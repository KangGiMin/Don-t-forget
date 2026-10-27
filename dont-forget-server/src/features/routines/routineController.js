const Todo = require("../todos/Todo");
const Routine = require("./Routine");
const { validTimeZone, isValidDateKey, nextRoutineOccurrence } = require("../../shared/dateTime");

function validateRule(body) {
  const { text, category, frequency, weekdays = [], startDate, endDate, dueTime, timeZone = "Asia/Seoul", reminderOffsets = [] } = body;
  if (typeof text !== "string" || !text.trim() || text.trim().length > 200) throw new Error("루틴 이름을 1~200자로 입력해 주세요.");
  if (!["daily", "weekly"].includes(frequency)) throw new Error("반복 주기를 선택해 주세요.");
  if (!isValidDateKey(startDate)) throw new Error("시작 날짜를 입력해 주세요.");
  if (endDate && !isValidDateKey(endDate)) throw new Error("종료 날짜를 확인해 주세요.");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(dueTime || "")) throw new Error("마감 시각을 HH:mm 형식으로 입력해 주세요.");
  const days = [...new Set(weekdays.map(Number))];
  if (frequency === "weekly" && (!days.length || days.some((day) => !Number.isInteger(day) || day < 0 || day > 6))) throw new Error("주간 루틴 요일을 선택해 주세요.");
  if (!Array.isArray(reminderOffsets) || reminderOffsets.length > 10 || reminderOffsets.some((minute) => !Number.isInteger(minute) || minute < 1 || minute > 43200)) throw new Error("알림 간격을 확인해 주세요.");
  return { text: text.trim(), category, frequency, weekdays: days, startDate, endDate: endDate || null, dueTime, timeZone: validTimeZone(timeZone), reminderOffsets: [...new Set(reminderOffsets)] };
}

exports.createRoutine = async (req, res) => {
  try {
    const data = validateRule(req.body);
    const candidate = { ...data };
    const next = nextRoutineOccurrence(candidate, new Date(Date.now() - 1000));
    if (!next) return res.status(400).json({ success: false, message: "반복 조건에 맞는 다음 날짜가 없습니다." });
    const routine = await Routine.create({ userId: req.auth.uid, ...data, nextRunAt: next.runAt });
    return res.status(201).json({ success: true, routine });
  } catch (error) { return res.status(400).json({ success: false, message: error.message || "루틴을 저장하지 못했습니다." }); }
};
exports.getRoutines = async (req, res) => {
  try { const routines = await Routine.find({ userId: req.auth.uid }).sort({ active: -1, nextRunAt: 1 }); return res.json({ success: true, routines }); }
  catch (_) { return res.status(500).json({ success: false, message: "루틴을 불러오지 못했습니다." }); }
};
exports.updateRoutine = async (req, res) => {
  try {
    const routine = await Routine.findOne({ _id: req.params.id, userId: req.auth.uid });
    if (!routine) return res.status(404).json({ success: false, message: "루틴을 찾을 수 없습니다." });
    if (req.body.active === false) { routine.active = false; await routine.save(); return res.json({ success: true, routine }); }
    const data = validateRule({ ...routine.toObject(), ...req.body });
    const next = nextRoutineOccurrence(data, new Date(Date.now() - 1000));
    if (!next) return res.status(400).json({ success: false, message: "다음 실행 날짜가 없습니다." });
    Object.assign(routine, data, { active: true, nextRunAt: next.runAt });
    await routine.save();
    return res.json({ success: true, routine });
  } catch (error) { return res.status(400).json({ success: false, message: error.message || "루틴을 수정하지 못했습니다." }); }
};
exports.deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findOneAndDelete({ _id: req.params.id, userId: req.auth.uid });
    if (!routine) return res.status(404).json({ success: false, message: "루틴을 찾을 수 없습니다." });
    return res.json({ success: true });
  } catch (_) { return res.status(400).json({ success: false, message: "루틴을 삭제하지 못했습니다." }); }
};
