const { zonedDateTimeToUtc } = require('../../../shared/dateTime');

function parseReminderOffsets(value) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 10) throw new Error("알림은 최대 10개까지 설정할 수 있습니다.");
  const offsets = [...new Set(value.map(Number))].sort((a, b) => b - a);
  if (offsets.some((minutes) => !Number.isInteger(minutes) || minutes < 1 || minutes > 43200)) {
    throw new Error("알림 시간은 1분에서 30일 사이로 설정해 주세요.");
  }
  return offsets;
}

function buildReminderStates(offsets, existing = [], reset = false) {
  return offsets.map((offsetMinutes) => {
    const old = reset ? null : existing.find((item) => item.offsetMinutes === offsetMinutes);
    return { offsetMinutes, sentAt: old?.sentAt || null, claimedAt: null };
  });
}

function resolveDeadline(dueDate, dueTime, timeZone, suppliedDueAt) {
  if (suppliedDueAt !== undefined) {
    const parsed = new Date(suppliedDueAt);
    if (!Number.isFinite(parsed.getTime())) return null;
    return parsed;
  }
  return zonedDateTimeToUtc(dueDate, dueTime, timeZone);
}

module.exports = { parseReminderOffsets, buildReminderStates, resolveDeadline };