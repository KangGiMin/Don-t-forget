const mongoose = require("mongoose");

const completionEventSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  todoId: { type: mongoose.Schema.Types.ObjectId, required: true },
  completedAt: { type: Date, required: true, default: Date.now },
  dayKey: { type: String, required: true },
  tierPointsAwarded: { type: Boolean, default: false },
}, { timestamps: true });
completionEventSchema.index({ todoId: 1 }, { unique: true, name: "unique_completion_per_todo" });
completionEventSchema.index({ userId: 1, completedAt: -1 });
module.exports = mongoose.model("CompletionEvent", completionEventSchema);
