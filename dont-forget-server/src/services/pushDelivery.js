const User = require("../features/users/User");
const webPush = require("web-push");

let vapidConfigured = false;
function configureWebPush() {
  const { WEB_PUSH_PUBLIC_KEY, WEB_PUSH_PRIVATE_KEY } = process.env;
  if (WEB_PUSH_PUBLIC_KEY && WEB_PUSH_PRIVATE_KEY && !vapidConfigured) {
    webPush.setVapidDetails(process.env.WEB_PUSH_SUBJECT || "mailto:support@dontforget.app", WEB_PUSH_PUBLIC_KEY, WEB_PUSH_PRIVATE_KEY);
    vapidConfigured = true;
  }
  return vapidConfigured;
}

async function sendExpoToken(token, payload) {
  if (!/^Expo(nent)?PushToken\[[A-Za-z0-9_-]+\]$/.test(token)) return false;
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST", headers: { Accept: "application/json", "Accept-Encoding": "gzip, deflate", "Content-Type": "application/json" },
    body: JSON.stringify({ to: token, sound: "default", title: payload.title, body: payload.body, data: payload.data || {}, priority: "high" }),
  });
  const result = await response.json();
  const ticket = result?.data;
  if (ticket?.status === "error" && ticket?.details?.error === "DeviceNotRegistered") await User.updateOne({ "expoPushTokens.token": token }, { $pull: { expoPushTokens: { token } } });
  if (!response.ok || ticket?.status !== "ok") throw new Error(ticket?.message || `Expo push returned ${response.status}`);
  return true;
}

async function sendToUser(userId, payload) {
  const user = await User.findOne({ firebaseUid: userId }).select("expoPushTokens webPushSubscriptions");
  if (!user) return { sent: 0, total: 0 };
  const jobs = [];
  for (const device of user.expoPushTokens || []) jobs.push(() => sendExpoToken(device.token, payload));
  if (configureWebPush()) {
    for (const sub of user.webPushSubscriptions || []) jobs.push(async () => {
      try { await webPush.sendNotification(sub.toObject ? sub.toObject() : sub, JSON.stringify(payload)); return true; }
      catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) await User.updateOne({ firebaseUid: userId }, { $pull: { webPushSubscriptions: { endpoint: sub.endpoint } } });
        throw error;
      }
    });
  }
  const results = await Promise.allSettled(jobs.map((job) => job()));
  const sent = results.filter((result) => result.status === "fulfilled" && result.value).length;
  results.forEach((result) => { if (result.status === "rejected") console.error("Push delivery failed:", { name: result.reason?.name, statusCode: result.reason?.statusCode }); });
  return { sent, total: jobs.length };
}

module.exports = { sendToUser, configureWebPush };
