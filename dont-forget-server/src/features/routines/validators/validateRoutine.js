const { validTimeZone, isValidDateKey } = require("../../../shared/dateTime");

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

module.exports = { validateRule };