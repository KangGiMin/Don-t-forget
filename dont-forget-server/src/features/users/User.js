const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String },
  name: { type: String, trim: true },
  phone: { type: String, trim: true },
  id: { type: String, trim: true },
  password: { type: String, select: false },
  statusMessage: { type: String, default: "", maxlength: 160 },
  profileImg: { type: String, default: "", maxlength: 2800000 },
  timeZone: { type: String, default: "Asia/Seoul" },
  lifetimeCompletedCount: { type: Number, default: 0, min: 0 },
  tierPoints: { type: Number, default: 0, min: 0 },
  expoPushTokens: [{ token: { type: String, trim: true }, deviceId: { type: String, trim: true }, updatedAt: { type: Date, default: Date.now } }],
  webPushSubscriptions: [{ endpoint: { type: String }, expirationTime: { type: Number, default: null }, keys: { p256dh: { type: String }, auth: { type: String } }, updatedAt: { type: Date, default: Date.now } }],
}, { timestamps: true, autoIndex: false });

userSchema.index({ firebaseUid: 1 }, { unique: true, partialFilterExpression: { firebaseUid: { $type: "string" } }, name: "firebaseUid_1" });
userSchema.index({ id: 1 }, { unique: true, partialFilterExpression: { id: { $type: "string" } }, name: "id_1" });
userSchema.index({ lifetimeCompletedCount: -1, createdAt: 1 }, { name: "leaderboard_completed_count" });

module.exports = mongoose.model("User", userSchema);
