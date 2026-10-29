const User = require('../User');
const jwt = require('jsonwebtoken');
const { hashPassword, verifyPassword } = require('../services/passwordService');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured before the server starts.');
}

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