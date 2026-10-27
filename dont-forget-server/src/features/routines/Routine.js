const mongoose = require("mongoose");
const routineSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  text: { type: String, required: true, trim: true, maxlength: 200 },
  category: { type: String, default: "기타" },
  frequency: { type: String, enum: ["daily", "weekly"], required: true },
  weekdays: [{ type: Number, min: 0, max: 6 }],
  startDate: { type: String, required: true },
  endDate: { type: String, default: null },
  dueTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  timeZone: { type: String, default: "Asia/Seoul" },
  reminderOffsets: [{ type: Number, min: 1, max: 43200 }],
  nextRunAt: { type: Date, required: true, index: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });
routineSchema.index({ userId: 1, active: 1, nextRunAt: 1 });
module.exports = mongoose.model("Routine", routineSchema);
