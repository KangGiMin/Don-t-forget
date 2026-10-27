const Journal = require("./Journal");
const { isValidDateKey } = require("../../shared/dateTime");
exports.getJournals = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { userId: req.auth.uid };
    if (from || to) {
      filter.date = {};
      if (from && /^\d{4}-\d{2}-\d{2}$/.test(from)) filter.date.$gte = from;
      if (to && /^\d{4}-\d{2}-\d{2}$/.test(to)) filter.date.$lte = to;
    }
    const journals = await Journal.find(filter).sort({ date: -1 }).limit(366);
    return res.json({ success: true, journals });
  } catch (_) { return res.status(500).json({ success: false, message: "일기를 불러오지 못했습니다." }); }
};
exports.upsertJournal = async (req, res) => {
  const { date, title = "", content } = req.body;
  if (!isValidDateKey(date) || typeof content !== "string" || !content.trim() || content.length > 20000 || typeof title !== "string" || title.length > 120) {
    return res.status(400).json({ success: false, message: "날짜, 제목 또는 일기 내용을 확인해 주세요." });
  }
  try {
    const journal = await Journal.findOneAndUpdate(
      { userId: req.auth.uid, date },
      { $set: { title: title.trim(), content: content.trim() } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.json({ success: true, journal });
  } catch (_) { return res.status(400).json({ success: false, message: "일기를 저장하지 못했습니다." }); }
};
exports.deleteJournal = async (req, res) => {
  try { const result = await Journal.findOneAndDelete({ userId: req.auth.uid, date: req.params.date }); if (!result) return res.status(404).json({ success: false, message: "일기를 찾을 수 없습니다." }); return res.json({ success: true }); }
  catch (_) { return res.status(400).json({ success: false, message: "일기를 삭제하지 못했습니다." }); }
};
