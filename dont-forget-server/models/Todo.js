// 할 일 로직

const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  text: { type: String, required: true, trim: true, maxlength: 500 },
  category: {
    type: String,
    enum: ["업무", "공부", "개인", "기타"],
    default: "개인",
  },
  dueDate: { type: String, required: true },
  priority: {
    type: String,
    enum: ["높음", "보통", "낮음"],
    default: "보통",
  },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

todoSchema.index({ userId: 1, dueDate: 1, createdAt: -1 });

module.exports = mongoose.model("Todo", todoSchema);
