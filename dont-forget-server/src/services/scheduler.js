const Todo = require("../features/todos/Todo");
const Routine = require("../features/routines/Routine");
const { sendToUser } = require("./pushDelivery");
const { formatDateInZone, nextRoutineOccurrence } = require("../shared/dateTime");

let timer = null;
let running = false;

async function processReminderJobs(now = new Date()) {
  const candidates = await Todo.find({ completed: false, dueAt: { $gt: now }, reminders: { $elemMatch: { sentAt: null } } }).limit(2000);
  for (const todo of candidates) {
    for (const reminder of todo.reminders) {
      if (reminder.sentAt) continue;
      const notifyAt = new Date(todo.dueAt.getTime() - reminder.offsetMinutes * 60000);
      if (notifyAt > now) continue;
      const staleClaim = new Date(now.getTime() - 5 * 60000);
      const claimed = await Todo.findOneAndUpdate(
        { _id: todo._id, completed: false, dueAt: { $gt: now }, reminders: { $elemMatch: { offsetMinutes: reminder.offsetMinutes, sentAt: null, $or: [{ claimedAt: null }, { claimedAt: { $lt: staleClaim } }] } } },
        { $set: { "reminders.$.claimedAt": now } },
        { returnDocument: "after" }
      );
      if (!claimed) continue;
      try {
        console.info("Reminder push dispatching:", { todoId: String(todo._id), offsetMinutes: reminder.offsetMinutes, dueAt: todo.dueAt.toISOString() });
        const result = await sendToUser(todo.userId, { title: "할 일 마감이 가까워요", body: `${todo.text} · ${todo.dueDate} ${todo.dueTime}`, data: { todoId: String(todo._id), dueDate: todo.dueDate, dueTime: todo.dueTime, route: "todo" } });
        if (result.sent > 0) {
          console.info("Reminder push delivered:", {
            todoId: String(todo._id),
            sent: result.sent,
            targets: result.total,
            webSent: result.webSent,
            webTargets: result.webTargets,
            expoSent: result.expoSent,
            expoTargets: result.expoTargets,
          });
          await Todo.updateOne({ _id: todo._id, "reminders.offsetMinutes": reminder.offsetMinutes }, { $set: { "reminders.$.sentAt": now, "reminders.$.claimedAt": null } });
        }
        else {
          console.warn("Reminder push was not delivered:", {
            todoId: String(todo._id),
            targets: result.total,
            webTargets: result.webTargets,
            expoTargets: result.expoTargets,
          });
          await Todo.updateOne({ _id: todo._id, "reminders.offsetMinutes": reminder.offsetMinutes }, { $set: { "reminders.$.claimedAt": null } });
        }
      } catch (error) {
        console.error("Reminder scheduling failed:", { todoId: String(todo._id), name: error?.name, statusCode: error?.statusCode });
        await Todo.updateOne({ _id: todo._id, "reminders.offsetMinutes": reminder.offsetMinutes }, { $set: { "reminders.$.claimedAt": null } });
      }
    }
  }
}

async function processRoutineJobs(now = new Date()) {
  const dueRoutines = await Routine.find({ active: true, nextRunAt: { $lte: now } }).sort({ nextRunAt: 1 }).limit(100);
  for (const routine of dueRoutines) {
    const occurrenceAt = new Date(routine.nextRunAt);
    const occurrenceDate = formatDateInZone(occurrenceAt, routine.timeZone);
    try {
      await Todo.create({
        userId: routine.userId, text: routine.text, category: routine.category, dueDate: occurrenceDate,
        dueTime: routine.dueTime, dueAt: occurrenceAt, timeZone: routine.timeZone,
        reminders: routine.reminderOffsets.map((offsetMinutes) => ({ offsetMinutes, sentAt: null, claimedAt: null })),
        routineId: routine._id, occurrenceDate,
      });
    } catch (error) {
      if (error?.code !== 11000) console.error("Routine occurrence failed:", { name: error?.name, code: error?.code });
    }
    const next = nextRoutineOccurrence(routine, occurrenceAt);
    const update = next ? { nextRunAt: next.runAt } : { active: false };
    await Routine.updateOne({ _id: routine._id, active: true, nextRunAt: occurrenceAt }, { $set: update });
  }
}

async function runScheduledWork() {
  if (running) return;
  running = true;
  try { const now = new Date(); await processRoutineJobs(now); await processReminderJobs(now); }
  catch (error) { console.error("Scheduled task processing failed:", { name: error?.name, code: error?.code }); }
  finally { running = false; }
}

function startSchedulers() {
  if (timer) return;
  console.info("Reminder scheduler started (30-second interval).");
  runScheduledWork();
  timer = setInterval(runScheduledWork, 30000);
  timer.unref?.();
}
function stopSchedulers() { if (timer) clearInterval(timer); timer = null; }
module.exports = { startSchedulers, stopSchedulers, processReminderJobs, processRoutineJobs };
