const User = require("../users/User");
const { formatDateInZone } = require("../../shared/dateTime");
const TIERS = [
  { key: "bronze", name: "브론즈", threshold: 0 },
  { key: "silver", name: "실버", threshold: 30 },
  { key: "gold", name: "골드", threshold: 60 },
  { key: "platinum", name: "플래티넘", threshold: 90 },
  { key: "diamond", name: "다이아", threshold: 120 },
  { key: "emerald", name: "에메랄드", threshold: 150 },
  { key: "master", name: "마스터", threshold: 180 },
  { key: "grand-master", name: "그랜드 마스터", threshold: 210 },
  { key: "challenger", name: "챌린저", threshold: 240 },
];
function getTier(points) { return [...TIERS].reverse().find((tier) => points >= tier.threshold) || TIERS[0]; }
exports.getMyStats = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.auth.uid }).select("name profileImg lifetimeCompletedCount tierPoints timeZone");
    const points = user?.tierPoints || 0;
    const tier = getTier(points);
    const nextTier = TIERS[TIERS.findIndex((item) => item.key === tier.key) + 1] || null;
    const zone = user?.timeZone || "Asia/Seoul";
    const dayKey = formatDateInZone(new Date(), zone);
    const DailyCounter = require("../users/TierDailyCounter");
    const daily = await DailyCounter.findOne({ userId: req.auth.uid, dayKey });
    return res.json({ success: true, stats: { completedCount: user?.lifetimeCompletedCount || 0, tierPoints: points, tier, nextTier, pointsToNextTier: nextTier ? Math.max(0, nextTier.threshold - points) : 0, dailyTierPoints: daily?.count || 0, dailyTierPointLimit: 3, timeZone: zone } });
  } catch (_) { return res.status(500).json({ success: false, message: "진행 정보를 불러오지 못했습니다." }); }
};
exports.getLeaderboard = async (_req, res) => {
  try {
    const users = await User.find({ firebaseUid: { $type: "string" } }).select("name profileImg lifetimeCompletedCount").sort({ lifetimeCompletedCount: -1, createdAt: 1 }).limit(100).lean();
    return res.json({ success: true, leaderboard: users.map((user, index) => ({ rank: index + 1, userId: user._id, name: user.name || "사용자", profileImg: user.profileImg || "", completedCount: user.lifetimeCompletedCount || 0 })) });
  } catch (_) { return res.status(500).json({ success: false, message: "명예의 전당을 불러오지 못했습니다." }); }
};
