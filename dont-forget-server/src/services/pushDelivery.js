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
  if (!user) return { sent: 0, total: 0, expoTargets: 0, webTargets: 0, expoSent: 0, webSent: 0 };
  const jobs = [];
  for (const device of user.expoPushTokens || []) jobs.push({ channel: "expo", send: () => sendExpoToken(device.token, payload) });
  if (configureWebPush()) {
    for (const sub of user.webPushSubscriptions || []) jobs.push({ channel: "web", send: async () => {
        try { await webPush.sendNotification(sub.toObject ? sub.toObject() : sub, JSON.stringify(payload)); return true; }
        catch (error) {
          if (error.statusCode === 404 || error.statusCode === 410) await User.updateOne({ firebaseUid: userId }, { $pull: { webPushSubscriptions: { endpoint: sub.endpoint } } });
          throw error;
        }
      } });
  }
  const results = await Promise.allSettled(jobs.map((job) => job.send()));
  const delivered = results.map((result) => result.status === "fulfilled" && result.value);
  const sent = delivered.filter(Boolean).length;
  results.forEach((result, index) => {
    if (result.status === "rejected") console.error("Push delivery failed:", { channel: jobs[index].channel, name: result.reason?.name, statusCode: result.reason?.statusCode });
  });
  const channelCount = (channel, isDelivered) => jobs.reduce((count, job, index) => count + Number(job.channel === channel && (!isDelivered || delivered[index])), 0);
  return {
    sent,
    total: jobs.length,
    expoTargets: channelCount("expo", false),
    webTargets: channelCount("web", false),
    expoSent: channelCount("expo", true),
    webSent: channelCount("web", true),
  };
}

module.exports = { sendToUser, configureWebPush };
