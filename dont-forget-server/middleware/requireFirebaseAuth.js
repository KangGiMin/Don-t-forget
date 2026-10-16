const { getAuth } = require("firebase-admin/auth");

module.exports = async function requireFirebaseAuth(req, res, next) {
  const authorization = req.get("authorization");
  const match = authorization?.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "로그인이 필요합니다.",
    });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(match[1]);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email_verified ? decodedToken.email || "" : "",
      name: decodedToken.name || "",
    };
    return next();
  } catch (error) {
    console.warn("Firebase 토큰 검증 실패:", error.code || error.message);
    return res.status(401).json({
      success: false,
      message: "인증 정보가 유효하지 않습니다. 다시 로그인해 주세요.",
    });
  }
};
