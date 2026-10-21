// user(사용자) 관련 로직 모음 - 로그인, 회원가입, 프로필, 문의하기 등

const User = require("./User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { promisify } = require("node:util");
const { randomBytes, scrypt, timingSafeEqual } = require("node:crypto");
const scryptAsync = promisify(scrypt);

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be configured before the server starts.");
}

const PASSWORD_KEY_LENGTH = 64;

const hashPassword = async (password) => {
  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, PASSWORD_KEY_LENGTH);
  return `scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
};

const verifyPassword = async (password, storedPassword) => {
  if (typeof storedPassword !== "string") return false;

  if (storedPassword.startsWith("scrypt$")) {
    const [, saltHex, keyHex] = storedPassword.split("$");
    if (!saltHex || !keyHex || !/^[a-f0-9]+$/i.test(saltHex) || !/^[a-f0-9]+$/i.test(keyHex)) return false;

    const expectedKey = Buffer.from(keyHex, "hex");
    if (expectedKey.length !== PASSWORD_KEY_LENGTH) return false;

    const actualKey = await scryptAsync(password, Buffer.from(saltHex, "hex"), expectedKey.length);
    return timingSafeEqual(actualKey, expectedKey);
  }

  // 기존 평문 계정은 로그인이 성공한 순간 해시로 자동 전환합니다.
  const provided = Buffer.from(password, "utf8");
  const legacy = Buffer.from(storedPassword, "utf8");
  return provided.length === legacy.length && timingSafeEqual(provided, legacy);
};

// 1. 로그인
exports.login = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (typeof id !== "string" || typeof password !== "string" || !id || !password) {
      return res.status(400).json({ success: false, message: "아이디 또는 비밀번호를 확인해 주세요." });
    }

    const user = await User.findOne({ id }).select("+password");
    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }

    if (!user.password.startsWith("scrypt$")) {
      user.password = await hashPassword(password);
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, id: user.id }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({
      success: true,
      message: `${user.name}님 환영합니다!`,
      token,
      userId: user._id,
      userName: user.name,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "서버에 문제가 생겼습니다." });
  }
};

// 2. 회원가입
exports.signup = async (req, res) => {
  try {
    const { name, phone, id, password } = req.body;
    if (![name, phone, id, password].every((value) => typeof value === "string" && value.trim())) {
      return res.status(400).json({ success: false, message: "필수 정보를 모두 입력해 주세요." });
    }
    if (password.length < 10) {
      return res.status(400).json({ success: false, message: "비밀번호는 10자 이상이어야 합니다." });
    }

    const existingUser = await User.findOne({ id: id.trim() });
    if (existingUser) return res.status(409).json({ success: false, message: "이미 사용 중인 아이디입니다." });

    const newUser = new User({
      name: name.trim(),
      phone: phone.trim(),
      id: id.trim(),
      password: await hashPassword(password),
    });
    await newUser.save();
    return res.status(201).json({ success: true, message: "회원가입이 완료되었습니다." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "회원가입을 완료하지 못했습니다." });
  }
};

// 아이디는 이름만으로 확인할 수 없도록 조회 기능을 비활성화합니다.
exports.findId = async (_req, res) => {
  return res.status(410).json({
    success: false,
    message: "아이디 조회는 제공하지 않습니다. 가입한 이메일로 로그인해 주세요.",
  });
};
// 5. Firebase 사용자 프로필 수정
exports.updateProfile = async (req, res) => {
  try {
    const { userName, statusMessage, profileImg } = req.body;
    if (typeof userName !== "string" || !userName.trim() || userName.trim().length > 60) {
      return res.status(400).json({ success: false, message: "닉네임을 1~60자로 입력해 주세요." });
    }
    if (statusMessage !== undefined && (typeof statusMessage !== "string" || statusMessage.length > 160)) {
      return res.status(400).json({ success: false, message: "상태 메시지는 160자 이하여야 합니다." });
    }
    if (profileImg !== undefined && (typeof profileImg !== "string" || profileImg.length > 2800000)) {
      return res.status(413).json({ success: false, message: "프로필 이미지는 2MB 이하로 선택해 주세요." });
    }
    // UID는 $set에 포함하고 별도의 $setOnInsert에는 중복 지정하지 않습니다.
    const update = {
      firebaseUid: req.auth.uid,
      name: userName.trim(),
      statusMessage: statusMessage?.trim() || "",
    };
    if (profileImg !== undefined) update.profileImg = profileImg;
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.auth.uid },
      { $set: update },
      { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.json({ success: true, user });
  } catch (error) {
    // 클라이언트 응답에는 내부 오류를 노출하지 않습니다. UID는 로그에서 가려 원인만 진단합니다.
    const diagnosticMessage = String(error?.message || "Unknown error").replaceAll(req.auth.uid, "[uid]");
    console.error("Firebase profile update failed:", {
      name: error?.name,
      code: error?.code,
      message: diagnosticMessage,
    });
    return res.status(500).json({ success: false, message: "프로필을 저장하지 못했습니다." });
  }
};

// 6. Firebase 사용자 정보 조회
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.auth.uid });
    if (!user) return res.json({ success: false, message: "프로필을 아직 저장하지 않았습니다." });
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "프로필을 불러오지 못했습니다." });
  }
};

// 7. 관리자 문의 (이메일 발송)
exports.contactAdmin = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (typeof title !== "string" || !title.trim() || title.trim().length > 160 ||
        typeof content !== "string" || !content.trim() || content.trim().length > 5000) {
      return res.status(400).json({ success: false, message: "제목(160자 이내)과 내용(5000자 이내)을 입력해 주세요." });
    }
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactTo = process.env.CONTACT_TO || smtpUser;
    if (!smtpUser || !smtpPass || !contactTo) {
      return res.status(500).json({ success: false, message: "메일 발송 설정이 완료되지 않았습니다." });
    }
    const profile = await User.findOne({ firebaseUid: req.auth.uid }).select("name");
    const userName = profile?.name || req.auth.uid;
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: smtpUser, pass: smtpPass } });
    await transporter.sendMail({
      from: smtpUser,
      to: contactTo,
      subject: "[돈폴겟 고객센터] " + userName + "님의 문의: " + title.trim(),
      text: "보낸 사람: " + userName + "\n제목: " + title.trim() + "\n\n[문의 내용]\n" + content.trim(),
    });
    return res.json({ success: true, message: "문의가 정상적으로 접수되었습니다!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "서버 문제로 이메일 전송에 실패했습니다." });
  }
};

