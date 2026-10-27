const User = require("../users/User");
const { validTimeZone } = require("../../shared/dateTime");
const { configureWebPush } = require("../../services/pushDelivery");

exports.getVapidKey = (_req, res) => res.json({ success: true, publicKey: process.env.WEB_PUSH_PUBLIC_KEY || "" });
exports.setTimeZone = async (req, res) => {
  const timeZone = validTimeZone(req.body?.timeZone || "Asia/Seoul");
  try {
    await User.findOneAndUpdate({ firebaseUid: req.auth.uid }, { $set: { timeZone }, $setOnInsert: { firebaseUid: req.auth.uid } }, { upsert: true, setDefaultsOnInsert: true });
    return res.json({ success: true, timeZone });
  } catch (_) { return res.status(500).json({ success: false, message: "시간대 설정을 저장하지 못했습니다." }); }
};
exports.registerExpoToken = async (req, res) => {
  const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
  if (!token || token.length > 300) return res.status(400).json({ success: false, message: "푸시 토큰이 올바르지 않습니다." });
  try {
    await User.findOneAndUpdate({ firebaseUid: req.auth.uid }, { $setOnInsert: { firebaseUid: req.auth.uid }, $set: { timeZone: validTimeZone(req.body?.timeZone || "Asia/Seoul") }, $pull: { expoPushTokens: { token } } }, { upsert: true, setDefaultsOnInsert: true });
    await User.updateOne({ firebaseUid: req.auth.uid }, { $push: { expoPushTokens: { token, deviceId: String(req.body?.deviceId || "").slice(0, 120), updatedAt: new Date() } } });
    return res.json({ success: true });
  } catch (_) { return res.status(500).json({ success: false, message: "푸시 기기를 등록하지 못했습니다." }); }
};
exports.unregisterExpoToken = async (req, res) => {
  try { await User.updateOne({ firebaseUid: req.auth.uid }, { $pull: { expoPushTokens: { token: req.body?.token } } }); return res.json({ success: true }); }
  catch (_) { return res.status(500).json({ success: false, message: "푸시 기기를 해제하지 못했습니다." }); }
};
exports.registerWebSubscription = async (req, res) => {
  const subscription = req.body?.subscription;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth || subscription.endpoint.length > 3000) return res.status(400).json({ success: false, message: "브라우저 알림 구독 정보가 올바르지 않습니다." });
  try {
    await User.findOneAndUpdate({ firebaseUid: req.auth.uid }, { $setOnInsert: { firebaseUid: req.auth.uid }, $set: { timeZone: validTimeZone(req.body?.timeZone || "Asia/Seoul") }, $pull: { webPushSubscriptions: { endpoint: subscription.endpoint } } }, { upsert: true, setDefaultsOnInsert: true });
    await User.updateOne({ firebaseUid: req.auth.uid }, { $push: { webPushSubscriptions: { endpoint: subscription.endpoint, expirationTime: subscription.expirationTime || null, keys: subscription.keys, updatedAt: new Date() } } });
    return res.json({ success: true, configured: configureWebPush() });
  } catch (_) { return res.status(500).json({ success: false, message: "브라우저 알림을 등록하지 못했습니다." }); }
};
exports.unregisterWebSubscription = async (req, res) => {
  try { await User.updateOne({ firebaseUid: req.auth.uid }, { $pull: { webPushSubscriptions: { endpoint: req.body?.endpoint } } }); return res.json({ success: true }); }
  catch (_) { return res.status(500).json({ success: false, message: "브라우저 알림 구독을 해제하지 못했습니다." }); }
};
