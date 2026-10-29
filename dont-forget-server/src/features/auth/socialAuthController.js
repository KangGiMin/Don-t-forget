const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");

const FIREBASE_CUSTOM_TOKEN_AUDIENCE =
  "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit";
const STATE_COOKIE_MAX_AGE = 10 * 60 * 1000;

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie || "";
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0 || part.slice(0, separator).trim() !== name) continue;
    try { return decodeURIComponent(part.slice(separator + 1).trim()); } catch { return ""; }
  }
  return "";
}

function getProviderConfig(provider) {
  const publicBase = process.env.SOCIAL_AUTH_PUBLIC_URL?.replace(/\/+$/, "");
  const callbackUrl = process.env[`${provider.toUpperCase()}_CALLBACK_URL`] ||
    (publicBase ? `${publicBase}/api/auth/social/${provider}/callback` : "");

  if (provider === "naver") {
    return {
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackUrl,
    };
  }
  if (provider === "kakao") {
    return {
      clientId: process.env.KAKAO_REST_API_KEY,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackUrl,
    };
  }
  return null;
}

function getClientReturnUrl(req, platform) {
  if (platform === "web") {
    return process.env.SOCIAL_WEB_RETURN_URL || "http://localhost:5173/login";
  }
  if (platform !== "mobile") return null;

  const candidate = req.query.return_uri;
  if (typeof candidate !== "string") return null;
  let url;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  if (url.protocol === "dontforgetmobile:") {
    const isExpectedDeepLink =
      (url.hostname === "social-auth" && ["", "/"].includes(url.pathname)) ||
      (!url.hostname && url.pathname === "/social-auth");
    if (!isExpectedDeepLink || url.search || url.hash || url.port || url.username || url.password) return null;
    return url.href;
  }
  if (url.protocol !== "exp:") return null;
  const allowedExpoHosts = (process.env.SOCIAL_MOBILE_EXPO_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  if (!allowedExpoHosts.includes(url.hostname.toLowerCase()) || url.pathname !== "/--/social-auth") return null;
  return url.href;
}

function getAuthorizationUrl(provider, config, state) {
  const url = new URL(provider === "naver"
    ? "https://nid.naver.com/oauth2.0/authorize"
    : "https://kauth.kakao.com/oauth/authorize");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.callbackUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  if (provider === "kakao") {
    url.searchParams.set("scope", "profile_nickname,profile_image");
  }
  return url.toString();
}

async function exchangeNaverCode(code, state, config) {
  const url = new URL("https://nid.naver.com/oauth2.0/token");
  url.searchParams.set("grant_type", "authorization_code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("client_secret", config.clientSecret);
  url.searchParams.set("code", code);
  url.searchParams.set("state", state);
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  const tokenData = await response.json();
  if (!response.ok || !tokenData.access_token) throw new Error("NAVER_TOKEN_EXCHANGE_FAILED");

  const profileResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: "application/json" },
  });
  const profileData = await profileResponse.json();
  const profile = profileData.response;
  if (!profileResponse.ok || profileData.resultcode !== "00" || !profile?.id) {
    throw new Error("NAVER_PROFILE_LOOKUP_FAILED");
  }
  return {
    providerId: String(profile.id),
    displayName: profile.name || profile.nickname || "네이버 사용자",
    photoUrl: profile.profile_image || "",
  };
}

async function exchangeKakaoCode(code, config) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    redirect_uri: config.callbackUrl,
    code,
  });
  if (config.clientSecret) body.set("client_secret", config.clientSecret);
  const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", Accept: "application/json" },
    body,
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) throw new Error("KAKAO_TOKEN_EXCHANGE_FAILED");

  const profileResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: "application/json" },
  });
  const profile = await profileResponse.json();
  if (!profileResponse.ok || !profile.id) throw new Error("KAKAO_PROFILE_LOOKUP_FAILED");
  return {
    providerId: String(profile.id),
    displayName: profile.kakao_account?.profile?.nickname || "카카오 사용자",
    photoUrl: profile.kakao_account?.profile?.profile_image_url || "",
  };
}

function hasFirebaseSigningConfig() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL &&
    process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
  );
}
function createFirebaseCustomToken(provider, providerId) {
  const serviceAccountEmail = process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!serviceAccountEmail || !privateKey || !process.env.FIREBASE_PROJECT_ID) {
    throw new Error("FIREBASE_CUSTOM_TOKEN_CONFIG_MISSING");
  }

  const uid = `social_${crypto.createHash("sha256").update(`${provider}:${providerId}`).digest("hex")}`;
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign({ uid }, privateKey, {
    algorithm: "RS256",
    issuer: serviceAccountEmail,
    subject: serviceAccountEmail,
    audience: FIREBASE_CUSTOM_TOKEN_AUDIENCE,
    expiresIn: 10 * 60,
    notBefore: now,
  });
}

function appendParams(target, params, platform) {
  const url = new URL(target);
  if (platform === "web") {
    const fragment = new URLSearchParams(url.hash.slice(1));
    for (const [key, value] of Object.entries(params)) fragment.set(key, value);
    url.hash = fragment.toString();
  } else {
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  }
  return url.toString();
}

function redirectWithError(res, target, platform, message) {
  return res.redirect(appendParams(target, { social_error: message }, platform));
}

exports.start = (req, res) => {
  const provider = req.params.provider;
  const config = getProviderConfig(provider);
  const platform = req.query.platform;
  const returnUrl = getClientReturnUrl(req, platform);
  if (!config?.clientId || (provider === "naver" && !config.clientSecret) || !config.callbackUrl || !returnUrl) {
    return res.status(503).send("소셜 로그인 설정이 완료되지 않았습니다. 서버 환경변수와 공급자 콜백 URL을 확인해 주세요.");
  }
  if (!hasFirebaseSigningConfig()) {
    return res.status(503).send("Firebase 서비스 계정 서명 설정이 필요합니다. 서버 환경변수를 확인해 주세요.");
  }
  const nonce = crypto.randomBytes(32).toString("base64url");
  const state = jwt.sign({ provider, platform, returnUrl, callbackUrl: config.callbackUrl, nonce }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "10m",
  });
  res.cookie(`social_oauth_${provider}`, nonce, {
    httpOnly: true,
    secure: config.callbackUrl.startsWith("https://"),
    sameSite: "lax",
    maxAge: STATE_COOKIE_MAX_AGE,
    path: "/api/auth/social",
  });
  return res.redirect(getAuthorizationUrl(provider, config, state));
};

exports.callback = async (req, res) => {
  const provider = req.params.provider;
  let state;
  try {
    state = jwt.verify(String(req.query.state || ""), process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return res.status(400).send("로그인 요청이 만료되었거나 올바르지 않습니다. 다시 시도해 주세요.");
  }
  const cookieName = `social_oauth_${provider}`;
  const cookieNonce = getCookie(req, cookieName);
  res.clearCookie(cookieName, { path: "/api/auth/social", sameSite: "lax", secure: state.callbackUrl?.startsWith("https://") });
  if (state.provider !== provider || !cookieNonce || cookieNonce !== state.nonce) {
    return res.status(400).send("로그인 요청을 확인할 수 없습니다. 다시 시도해 주세요.");
  }
  if (req.query.error || typeof req.query.code !== "string") {
    return redirectWithError(res, state.returnUrl, state.platform, "로그인이 취소되었거나 승인되지 않았습니다.");
  }

  try {
    const config = getProviderConfig(provider);
    if (!config || config.callbackUrl !== state.callbackUrl) throw new Error("SOCIAL_PROVIDER_CONFIG_MISMATCH");
    const profile = provider === "naver"
      ? await exchangeNaverCode(req.query.code, String(req.query.state), config)
      : await exchangeKakaoCode(req.query.code, config);
    const firebaseCustomToken = createFirebaseCustomToken(provider, profile.providerId);
    return res.redirect(appendParams(state.returnUrl, {
      firebase_custom_token: firebaseCustomToken,
      display_name: profile.displayName,
      photo_url: profile.photoUrl,
    }, state.platform));
  } catch (error) {
    const message = error.message === "FIREBASE_CUSTOM_TOKEN_CONFIG_MISSING"
      ? "Firebase 서버 서명 키가 설정되지 않았습니다."
      : "소셜 로그인에 실패했습니다. 다시 시도해 주세요.";
    console.error("Social login failed:", { provider, code: error.message });
    return redirectWithError(res, state.returnUrl, state.platform, message);
  }
};
