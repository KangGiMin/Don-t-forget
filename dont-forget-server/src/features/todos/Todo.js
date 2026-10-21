// 할 일 로직

const mongoose = require("mongoose");

// 할 일(Todo) 데이터의 뼈대(Schema) 빚기
const todoSchema = new mongoose.Schema({
    userId: {
    type: String, // 👈 "이제 파이어베이스가 주는 문자열(String) 신분증도 다 받겠다!"
    required: true
  }, // 어떤 유저의 할 일인지!
  text: { type: String, required: true }, // 할 일 내용 (예: 운동하기)
  category: { type: String, default: "기본" }, // 카테고리 (예: 운동, 공부, 쇼핑)
  dueDate: { type: String, required: true }, // 마감 기한 (날짜)
  priority: { type: String, default: "보통" }, // 우선순위 (높음 / 보통 / 낮음)
  completed: { type: Boolean, default: false }, // 완료 여부 (체크했으면 true, 아니면 false)
  createdAt: { type: Date, default: Date.now }, // 만든 날짜
});

module.exports = mongoose.model("Todo", todoSchema);
