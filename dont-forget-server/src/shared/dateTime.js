const validTimeZone = (zone) => {
  try { new Intl.DateTimeFormat("en-US", { timeZone: zone }).format(); return zone; }
  catch (_) { return "Asia/Seoul"; }
};

function getZonedParts(value, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: validTimeZone(timeZone), year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(value);
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
}

function isValidDateKey(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function zonedDateTimeToUtc(date, time, timeZone) {
  if (!isValidDateKey(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const wanted = Date.UTC(year, month - 1, day, hour, minute, 0);
  let guess = wanted;
  for (let index = 0; index < 4; index += 1) {
    const actual = getZonedParts(new Date(guess), timeZone);
    const represented = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, actual.second);
    const correction = wanted - represented;
    guess += correction;
    if (correction === 0) break;
  }
  return new Date(guess);
}

function formatDateInZone(value, timeZone) {
  const parts = getZonedParts(value, timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function nextRoutineOccurrence(routine, after = new Date()) {
  const zone = validTimeZone(routine.timeZone);
  const start = new Date(`${routine.startDate}T12:00:00Z`);
  const day = new Date(formatDateInZone(after, zone) + "T12:00:00Z");
  if (start > day) day.setTime(start.getTime());
  for (let offset = 0; offset <= 370; offset += 1) {
    const candidate = new Date(day);
    candidate.setUTCDate(day.getUTCDate() + offset);
    const dateKey = candidate.toISOString().slice(0, 10);
    if (routine.endDate && dateKey > routine.endDate) return null;
    if (dateKey < routine.startDate) continue;
    if (routine.frequency === "weekly" && !routine.weekdays.includes(candidate.getUTCDay())) continue;
    const runAt = zonedDateTimeToUtc(dateKey, routine.dueTime, zone);
    if (runAt && runAt > after) return { date: dateKey, runAt };
  }
  return null;
}

module.exports = { validTimeZone, getZonedParts, isValidDateKey, zonedDateTimeToUtc, formatDateInZone, nextRoutineOccurrence };
