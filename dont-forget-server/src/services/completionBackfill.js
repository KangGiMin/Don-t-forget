const User = require("../features/users/User");
const Todo = require("../features/todos/Todo");
const CompletionEvent = require("../features/users/CompletionEvent");
const TierDailyCounter = require("../features/users/TierDailyCounter");
const { validTimeZone, formatDateInZone } = require("../shared/dateTime");

// Seed legacy completed todos once so the leaderboard starts with existing history.
async function backfillCompletionStats() {
  const users = User.find({ firebaseUid: { $type: "string" } }).select("firebaseUid timeZone").lean().cursor();
  let migratedUsers = 0;
  for await (const user of users) {
    if (await CompletionEvent.exists({ userId: user.firebaseUid })) continue;
    const zone = validTimeZone(user.timeZone || "Asia/Seoul");
    const countsByDay = new Map();
    const eventBatch = [];
    let completedCount = 0;
    let tierPoints = 0;
    const completedTodos = Todo.find({ userId: user.firebaseUid, completed: true }).sort({ createdAt: 1 }).lean().cursor();
    for await (const todo of completedTodos) {
      const completedAt = todo.completedAt || todo.updatedAt || todo.createdAt || new Date();
      const dayKey = formatDateInZone(completedAt, zone);
      const currentDayCount = countsByDay.get(dayKey) || 0;
      const tierPointsAwarded = currentDayCount < 3;
      countsByDay.set(dayKey, currentDayCount + 1);
      if (tierPointsAwarded) tierPoints += 1;
      completedCount += 1;
      eventBatch.push({ userId: user.firebaseUid, todoId: todo._id, completedAt, dayKey, tierPointsAwarded });
      if (eventBatch.length >= 500) {
        await CompletionEvent.insertMany(eventBatch, { ordered: false });
        eventBatch.length = 0;
      }
    }
    if (!completedCount) continue;
    if (eventBatch.length) await CompletionEvent.insertMany(eventBatch, { ordered: false });
    const dailyCounters = [...countsByDay].map(([dayKey, count]) => ({
      updateOne: { filter: { userId: user.firebaseUid, dayKey }, update: { $setOnInsert: { userId: user.firebaseUid, dayKey, count: Math.min(count, 3) } }, upsert: true },
    }));
    if (dailyCounters.length) await TierDailyCounter.bulkWrite(dailyCounters, { ordered: false });
    await User.updateOne({ firebaseUid: user.firebaseUid }, { $set: { lifetimeCompletedCount: completedCount, tierPoints, timeZone: zone } });
    migratedUsers += 1;
  }
  if (migratedUsers) console.log(`기존 완료 기록 ${migratedUsers}명 집계 완료`);
}

module.exports = { backfillCompletionStats };
