const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  offsetMinutes: { type: Number, required: true, min: 1, max: 43200 },
  sentAt: { type: Date, default: null },
  claimedAt: { type: Date, default: null },
}, { _id: false });

const todoSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  text: { type: String, required: true, trim: true, maxlength: 200 },
  category: { type: String, default: "기타" },
  dueDate: { type: String, required: true },
  dueTime: { type: String, default: "23:59", match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  dueAt: { type: Date, default: null, index: true },
  timeZone: { type: String, default: "Asia/Seoul" },
  reminders: { type: [reminderSchema], default: [] },
  priority: { type: String, default: "보통" },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  routineId: { type: mongoose.Schema.Types.ObjectId, ref: "Routine", default: null },
  occurrenceDate: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

todoSchema.index({ routineId: 1, occurrenceDate: 1 }, { unique: true, partialFilterExpression: { routineId: { $type: "objectId" }, occurrenceDate: { $type: "string" } } });
module.exports = mongoose.model("Todo", todoSchema);
