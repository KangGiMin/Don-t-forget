const User = require('../../users/User');
const CompletionEvent = require('../../users/CompletionEvent');
const TierDailyCounter = require('../../users/TierDailyCounter');
const { validTimeZone, formatDateInZone } = require('../../../shared/dateTime');

async function awardCompletion(todo, userId, session) {
  let event = await CompletionEvent.findOne({ todoId: todo._id }).session(session);
  if (event) return;
  const user = await User.findOne({ firebaseUid: userId }).session(session);
  const timeZone = validTimeZone(user?.timeZone || todo.timeZone || "Asia/Seoul");
  const dayKey = formatDateInZone(new Date(), timeZone);
  let daily = await TierDailyCounter.findOne({ userId, dayKey }).session(session);
  if (!daily) { daily = new TierDailyCounter({ userId, dayKey, count: 0 }); await daily.save({ session }); }
  const tierPointsAwarded = daily.count < 3;
  if (tierPointsAwarded) { daily.count += 1; await daily.save({ session }); }
  await CompletionEvent.create([{ userId, todoId: todo._id, completedAt: todo.completedAt || new Date(), dayKey, tierPointsAwarded }], { session });
  await User.findOneAndUpdate(
    { firebaseUid: userId },
    { $setOnInsert: { firebaseUid: userId }, $inc: { lifetimeCompletedCount: 1, tierPoints: tierPointsAwarded ? 1 : 0 } },
    { upsert: true, returnDocument: "after", session, setDefaultsOnInsert: true }
  );
}

module.exports = { awardCompletion };