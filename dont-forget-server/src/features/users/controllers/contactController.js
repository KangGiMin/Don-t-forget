const User = require('../User');
const nodemailer = require('nodemailer');

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