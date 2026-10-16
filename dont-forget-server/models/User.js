const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: { type: String, default: "" },
    name: { type: String, trim: true, maxlength: 80, default: "" },
    statusMessage: { type: String, trim: true, maxlength: 240, default: "" },
    profileImg: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userSchema, "userprofiles");
