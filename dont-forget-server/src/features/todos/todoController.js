const mongoose = require("mongoose");
const { parseReminderOffsets, buildReminderStates, resolveDeadline } = require("./services/reminderSchedule");
const { awardCompletion } = require("./services/awardCompletion");
const Todo = require("./Todo");
const User = require("../users/User");
const { validTimeZone, isValidDateKey } = require("../../shared/dateTime");

exports.createTodo = async (req, res) => {
  try {
    const { text, category, dueDate, dueTime = "23:59", dueAt, timeZone = "Asia/Seoul", reminders = [], priority } = req.body;
    if (typeof text !== "string" || !text.trim() || text.trim().length > 200) return res.status(400).json({ success: false, message: "할 일을 1~200자로 입력해 주세요." });
    if (!isValidDateKey(dueDate)) return res.status(400).json({ success: false, message: "마감 날짜를 YYYY-MM-DD 형식으로 입력해 주세요." });
    if (typeof dueTime !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(dueTime)) return res.status(400).json({ success: false, message: "마감 시각을 HH:mm 형식으로 입력해 주세요." });
    const zone = validTimeZone(timeZone);
    const deadline = resolveDeadline(dueDate, dueTime, zone, dueAt);
    if (!deadline) return res.status(400).json({ success: false, message: "마감 날짜와 시각을 확인해 주세요." });
    const offsets = parseReminderOffsets(reminders);
    await User.updateOne({ firebaseUid: req.auth.uid }, { $set: { timeZone: zone }, $setOnInsert: { firebaseUid: req.auth.uid } }, { upsert: true });
    const newTodo = await Todo.create({ userId: req.auth.uid, text: text.trim(), category, dueDate, dueTime, dueAt: deadline, timeZone: zone, reminders: buildReminderStates(offsets), priority });
    if (offsets.length) console.info("Reminder scheduled:", { todoId: String(newTodo._id), dueAt: deadline.toISOString(), offsetsMinutes: offsets, timeZone: zone });
    return res.status(201).json({ success: true, todo: newTodo });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "할 일을 저장하지 못했습니다." });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const filter = { userId: req.auth.uid };
    const term = typeof req.query.tags === "string" ? req.query.tags.trim() : "";
    if (term.length > 100) return res.status(400).json({ success: false, message: "검색어는 100자 이하여야 합니다." });
    if (term) {
      const escaped = term.replace(/[.*+?^|{}()[\]\\$]/g, (character) => "\\" + character);
      filter.$or = [{ text: { $regex: escaped, $options: "i" } }, { category: { $regex: escaped, $options: "i" } }];
    }
    const todos = await Todo.find(filter).sort({ dueDate: 1, dueTime: 1, createdAt: -1 });
    return res.json({ success: true, todos });
  } catch (_) { return res.status(500).json({ success: false, message: "할 일을 불러오지 못했습니다." }); }
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { text, completed, category, dueDate, dueTime, dueAt, timeZone, reminders, priority } = req.body;
  const updateData = {};
  if (text !== undefined) {
    if (typeof text !== "string" || !text.trim() || text.trim().length > 200) return res.status(400).json({ success: false, message: "할 일을 1~200자로 입력해 주세요." });
    updateData.text = text.trim();
  }
  if (category !== undefined) updateData.category = category;
  if (priority !== undefined) updateData.priority = priority;
  if (dueDate !== undefined) {
    if (!isValidDateKey(dueDate)) return res.status(400).json({ success: false, message: "마감 날짜 형식이 올바르지 않습니다." });
    updateData.dueDate = dueDate;
  }
  try {
    const existing = await Todo.findOne({ _id: id, userId: req.auth.uid });
    if (!existing) return res.status(404).json({ success: false, message: "할 일을 찾을 수 없습니다." });
    if (dueTime !== undefined) {
      if (typeof dueTime !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(dueTime)) return res.status(400).json({ success: false, message: "마감 시각 형식이 올바르지 않습니다." });
      updateData.dueTime = dueTime;
    }
    const zone = validTimeZone(timeZone || existing.timeZone || "Asia/Seoul");
    if (dueDate !== undefined || dueTime !== undefined || dueAt !== undefined || timeZone !== undefined) {
      const nextDate = updateData.dueDate || existing.dueDate;
      const nextTime = updateData.dueTime || existing.dueTime || "23:59";
      const deadline = resolveDeadline(nextDate, nextTime, zone, dueAt);
      if (!deadline) return res.status(400).json({ success: false, message: "마감 날짜와 시각을 확인해 주세요." });
      updateData.dueAt = deadline;
      updateData.timeZone = zone;
    }
    const deadlineChanged = dueDate !== undefined || dueTime !== undefined || dueAt !== undefined || timeZone !== undefined;
    if (reminders !== undefined) {
      const offsets = parseReminderOffsets(reminders);
      updateData.reminders = buildReminderStates(offsets, existing.reminders, deadlineChanged);
    } else if (deadlineChanged && existing.reminders?.length) {
      updateData.reminders = buildReminderStates(existing.reminders.map((item) => item.offsetMinutes), existing.reminders, true);
    }
    if (completed !== undefined && typeof completed !== "boolean") return res.status(400).json({ success: false, message: "완료 상태가 올바르지 않습니다." });
    if (completed !== undefined) {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const todo = await Todo.findOne({ _id: id, userId: req.auth.uid }).session(session);
          if (!todo) throw Object.assign(new Error("할 일을 찾을 수 없습니다."), { statusCode: 404 });
          if (todo.completed !== completed) {
            todo.completed = completed;
            todo.completedAt = completed ? new Date() : null;
          }
          Object.assign(todo, updateData);
          await todo.save({ session });
          if (completed) await awardCompletion(todo, req.auth.uid, session);
        });
      } finally { await session.endSession(); }
      const updatedTodo = await Todo.findOne({ _id: id, userId: req.auth.uid });
      return res.json({ success: true, todo: updatedTodo });
    }
    const updatedTodo = await Todo.findOneAndUpdate({ _id: id, userId: req.auth.uid }, { $set: updateData }, { returnDocument: "after", runValidators: true });
    return res.json({ success: true, todo: updatedTodo });
  } catch (error) {
    if (error.statusCode === 404) return res.status(404).json({ success: false, message: error.message });
    console.error("Todo update failed:", { name: error?.name, code: error?.code });
    return res.status(400).json({ success: false, message: error.message === "Transaction numbers are only allowed on a replica set member or mongos" ? "완료 점수 기록을 위해 MongoDB 복제 세트 연결이 필요합니다." : "할 일을 수정하지 못했습니다." });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.auth.uid });
    if (!deletedTodo) return res.status(404).json({ success: false, message: "할 일을 찾을 수 없습니다." });
    return res.json({ success: true, message: "할 일이 삭제되었습니다." });
  } catch (_) { return res.status(400).json({ success: false, message: "할 일을 삭제하지 못했습니다." }); }
};
