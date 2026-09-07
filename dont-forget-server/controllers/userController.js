// user(사용자) 관련 로직 모음 - 로그인, 회원가입, 프로필, 문의하기 등

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET || 'don_forget_super_secret_key_1234!';

// 1. 로그인
exports.login = async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await User.findOne({ id });
    
    // 🌟 시한폭탄 해체 완료: 아이디가 없거나 비번 틀리면 정상적으로 튕겨내게 수정!
    if (!user) return res.json({ success: false, message: "존재하지 않는 아이디입니다." });
    if (user.password !== password) return res.json({ success: false, message: "잘못된 비밀번호입니다." });

    const token = jwt.sign({ userId: user._id, id: user.id }, JWT_SECRET, { expiresIn: "1d" });
    
    res.json({
      success: true,
      message: `${user.name}님 환영합니다!`,
      token: token,
      userId: user._id,
      userName: user.name,
    });
  } catch (error) {
    res.json({ success: false, message: "서버에 문제가 생겼습니다." });
  }
};

// 2. 회원가입
exports.signup = async (req, res) => {
  try {
    const { name, phone, id, password } = req.body;
    const existingUser = await User.findOne({ id });
    if (existingUser) return res.json({ success: false, message: "이미 사용 중인 아이디야!" });

    const newUser = new User({ name, phone, id, password });
    await newUser.save();
    res.json({ success: true, message: "회원가입 대성공! 환영해! 🎉" });
  } catch (error) {
    res.json({ success: false, message: "서버에 문제가 생겼어 ㅠㅠ" });
  }
};

// 3. 아이디 찾기
exports.findId = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findOne({ name });
    if (!user) return res.json({ success: false, message: "입력하신 이름으로 등록된 아이디가 없어!" });
    res.json({ success: true, id: user.id });
  } catch (error) {
    res.status(500).json({ success: false, message: "서버 에러 발생!" });
  }
};

// 4. 비밀번호 재설정
exports.resetPassword = async (req, res) => {
  try {
    const { id, name, newPassword } = req.body;
    const user = await User.findOne({ id, name });
    if (!user) return res.json({ success: false, message: "일치하는 아이디나 이름 정보를 찾을 수 없어!" });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "비밀번호가 성공적으로 변경되었어!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "서버 에러 발생!" });
  }
};

// 5. 유저 프로필 수정
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { userName, statusMessage, profileImg } = req.body;
    const query = mongoose.Types.ObjectId.isValid(userId) ? { _id: userId } : { id: userId };
   
    const updatedUser = await User.findOneAndUpdate(
      query,
      { $set: { name: userName, statusMessage, profileImg } },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true } 
    );
    res.json({ success: true, message: '프로필 업데이트 찢었다! 완료!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: '서버가 아파요 ㅠㅠ' });
  }
};

// 6. 유저 정보 조회
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const query = mongoose.Types.ObjectId.isValid(userId) ? { _id: userId } : { id: userId };
    const user = await User.findOne(query);

    if (user) res.json({ success: true, user });
    else res.json({ success: false, message: '장부에 없는 유저야 ㅠㅠ' });
  } catch (error) {
    res.status(500).json({ success: false, message: '서버가 아파요 ㅠㅠ' });
  }
};

// 7. 관리자 문의 (이메일 발송)
exports.contactAdmin = async (req, res) => {
  try {
    const { userName, title, content } = req.body; 
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'gimingng2311@gmail.com', pass: 'txfpkwcfvkfrxrhl' }
    });

    const mailOptions = {
      from: 'gimingng2311@gmail.com',
      to: 'gimingng2311@gmail.com', 
      subject: `[돈폴겟 고객센터] ${userName}님의 문의: ${title}`, 
      text: `보낸 사람: ${userName}\n제목: ${title}\n\n[문의 내용]\n${content}` 
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: '문의가 정상적으로 접수되었습니다!' });
  } catch (error) {
    res.json({ success: false, message: '서버 문제로 이메일 전송에 실패했어요.' });
  }
};