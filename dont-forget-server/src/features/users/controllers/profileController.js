const User = require('../User');

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