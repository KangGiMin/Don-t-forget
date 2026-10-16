const nodemailer = require("nodemailer");
const User = require("../models/User");

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      {
        $setOnInsert: {
          firebaseUid: req.user.uid,
          email: req.user.email,
          name: req.user.name,
        },
      },
      { new: true, upsert: true, runValidators: true }
    ).select("-__v");

    return res.json({ success: true, user });
  } catch (error) {
    console.error("프로필 조회 오류:", error);
    return res.status(500).json({
      success: false,
      message: "프로필을 불러오지 못했습니다.",
    });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const updates = {};
    const { name, statusMessage, profileImg } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length > 80) {
        return res.status(400).json({
          success: false,
          message: "이름은 80자 이내로 입력해 주세요.",
        });
      }
      updates.name = name.trim();
    }

    if (statusMessage !== undefined) {
      if (typeof statusMessage !== "string" || statusMessage.length > 240) {
        return res.status(400).json({
          success: false,
          message: "상태 메시지는 240자 이내로 입력해 주세요.",
        });
      }
      updates.statusMessage = statusMessage.trim();
    }

    if (profileImg !== undefined) {
      if (typeof profileImg !== "string" || profileImg.length > 2_000_000) {
        return res.status(400).json({
          success: false,
          message: "프로필 이미지는 2MB 이내로 입력해 주세요.",
        });
      }
      updates.profileImg = profileImg;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "수정할 프로필 항목이 없습니다.",
      });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      {
        $set: updates,
        $setOnInsert: {
          firebaseUid: req.user.uid,
          email: req.user.email,
        },
      },
      { new: true, upsert: true, runValidators: true }
    ).select("-__v");

    return res.json({ success: true, user });
  } catch (error) {
    console.error("프로필 수정 오류:", error);
    return res.status(500).json({
      success: false,
      message: "프로필을 수정하지 못했습니다.",
    });
  }
};

exports.contactAdmin = async (req, res) => {
  const { title, content } = req.body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    title.length > 200 ||
    typeof content !== "string" ||
    !content.trim() ||
    content.length > 10_000
  ) {
    return res.status(400).json({
      success: false,
      message: "문의 제목과 내용을 확인해 주세요.",
    });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_APP_PASSWORD) {
    return res.status(503).json({
      success: false,
      message: "문의 메일 서비스가 설정되지 않았습니다.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_APP_PASSWORD,
      },
    });
    const profile = await User.findOne({ firebaseUid: req.user.uid }).select(
      "name"
    );

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      replyTo: req.user.email || undefined,
      subject: `[돈폴겟 고객센터] ${profile?.name || req.user.email}: ${title.trim()}`,
      text: `보낸 사람: ${profile?.name || req.user.email}\n이메일: ${req.user.email}\n제목: ${title.trim()}\n\n[문의 내용]\n${content.trim()}`,
    });

    return res.json({
      success: true,
      message: "문의가 정상적으로 접수되었습니다.",
    });
  } catch (error) {
    console.error("문의 메일 발송 오류:", error);
    return res.status(502).json({
      success: false,
      message: "문의 메일 전송에 실패했습니다.",
    });
  }
};
