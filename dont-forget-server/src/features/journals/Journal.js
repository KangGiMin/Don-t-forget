const mongoose = require("mongoose");
const journalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  title: { type: String, default: "", trim: true, maxlength: 120 },
  content: { type: String, required: true, maxlength: 20000 },
}, { timestamps: true });
journalSchema.index({ userId: 1, date: 1 }, { unique: true, name: "unique_daily_journal" });
module.exports = mongoose.model("Journal", journalSchema);
