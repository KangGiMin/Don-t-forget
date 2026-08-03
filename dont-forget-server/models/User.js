// 회원가입 로직

const mongoose = require("mongoose");

// 유저 정보의 뼈대(Schema) 빚기
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 이름 (글자, 필수!)
  phone: { type: String, required: true }, // 연락처 (글자, 필수!)
  id: { type: String, required: true, unique: true }, // 아이디 (글자, 필수, 중복 금지!)
  password: { type: String, required: true }, // 비밀번호 (글자, 필수!)
});

// 이 뼈대를 바탕으로 'User' 모델(실제 작업자)을 만들어 내보내기
module.exports = mongoose.model("User", userSchema);
