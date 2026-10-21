const jwt = require("jsonwebtoken");

const CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
let cachedCertificates = null;
let certificatesExpireAt = 0;

async function getFirebaseCertificates(forceRefresh = false) {
  if (!forceRefresh && cachedCertificates && Date.now() < certificatesExpireAt) {
    return cachedCertificates;
  }

  const response = await fetch(CERTS_URL);
  if (!response.ok) throw new Error(`Firebase certificate request failed (${response.status}).`);

  const certificates = await response.json();
  const cacheControl = response.headers.get("cache-control") || "";
  const maxAge = Number(cacheControl.match(/max-age=(\d+)/i)?.[1] || 300);
  cachedCertificates = certificates;
  certificatesExpireAt = Date.now() + maxAge * 1000;
  return certificates;
}

async function authenticateFirebaseToken(req, res, next) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    return res.status(500).json({ success: false, message: "Firebase 인증 서버 설정이 필요합니다." });
  }

  const match = (req.get("authorization") || "").match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
  }

  const token = match[1];
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || decoded.header?.alg !== "RS256" || typeof decoded.header.kid !== "string") {
    return res.status(401).json({ success: false, message: "유효하지 않은 로그인 토큰입니다." });
  }

  let certificates;
  try {
    certificates = await getFirebaseCertificates();
    if (!certificates[decoded.header.kid]) {
      certificates = await getFirebaseCertificates(true);
    }
  } catch (error) {
    return res.status(503).json({ success: false, message: "인증 서비스를 일시적으로 사용할 수 없습니다." });
  }

  const certificate = certificates[decoded.header.kid];
  if (!certificate) {
    return res.status(401).json({ success: false, message: "유효하지 않은 로그인 토큰입니다." });
  }

  try {
    const claims = jwt.verify(token, certificate, {
      algorithms: ["RS256"],
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
      clockTolerance: 5,
    });
    const now = Math.floor(Date.now() / 1000);
    if (
      claims.aud !== projectId ||
      claims.iss !== `https://securetoken.google.com/${projectId}` ||
      typeof claims.sub !== "string" || !claims.sub ||
      !Number.isFinite(claims.iat) || claims.iat > now ||
      !Number.isFinite(claims.exp) || claims.exp <= now ||
      !Number.isFinite(claims.auth_time) || claims.auth_time > now
    ) {
      return res.status(401).json({ success: false, message: "유효하지 않은 로그인 토큰입니다." });
    }

    req.auth = { uid: claims.sub };
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "유효하지 않거나 만료된 로그인 토큰입니다." });
  }
}

function requireSelf(paramName) {
  return (req, res, next) => {
    if (req.params[paramName] !== req.auth.uid) {
      return res.status(403).json({ success: false, message: "다른 사용자의 데이터에는 접근할 수 없습니다." });
    }
    return next();
  };
}

module.exports = { authenticateFirebaseToken, requireSelf };