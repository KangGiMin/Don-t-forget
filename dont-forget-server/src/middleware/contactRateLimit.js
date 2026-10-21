const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const requestsByUser = new Map();

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requestsByUser) {
    if (entry.resetAt <= now) requestsByUser.delete(key);
  }
}, WINDOW_MS);
cleanupTimer.unref();

exports.contactRateLimit = (req, res, next) => {
  const key = req.auth?.uid;
  if (!key) return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
  const now = Date.now();
  let entry = requestsByUser.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    requestsByUser.set(key, entry);
  }
  if (entry.count >= MAX_REQUESTS) {
    return res.status(429).json({ success: false, message: "문의 요청은 15분에 5회까지 가능합니다." });
  }
  entry.count += 1;
  return next();
};
