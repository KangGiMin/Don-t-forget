const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String },
  name: { type: String, trim: true },
  phone: { type: String, trim: true },
  id: { type: String, trim: true },
  password: { type: String, select: false },
  statusMessage: { type: String, default: "", maxlength: 160 },
  profileImg: { type: String, default: "", maxlength: 2800000 },
}, { timestamps: true, autoIndex: false });

// Firebase 계정과 레거시 아이디 계정의 식별자는 각각 존재하는 문자열일 때만 고유해야 합니다.
userSchema.index({ firebaseUid: 1 }, {
  unique: true,
  partialFilterExpression: { firebaseUid: { $type: "string" } },
  name: "firebaseUid_1",
});
userSchema.index({ id: 1 }, {
  unique: true,
  partialFilterExpression: { id: { $type: "string" } },
  name: "id_1",
});

module.exports = mongoose.model("User", userSchema);
