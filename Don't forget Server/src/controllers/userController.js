const pool = require("../../config/db"); // 👈 여기 경로 수정 완료!

// 회원가입 또는 유저 정보 저장 (OAuth 로그인 성공 후 백엔드로 유저 전송 시)
exports.registerOrUpdateUser = async (req, res) => {
  const { id, email, nickname, profile_image_url, provider } = req.body;

  if (!id || !email) {
    return res
      .status(400)
      .json({
        success: false,
        message: "사용자 ID와 이메일은 필수 요구 항목입니다.",
      });
  }

  try {
    const query = `
      INSERT INTO users (id, email, nickname, profile_image_url, provider, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (id) DO UPDATE 
      SET nickname = EXCLUDED.nickname,
          profile_image_url = EXCLUDED.profile_image_url,
          updated_at = NOW()
      RETURNING *;
    `;
    const values = [
      id,
      email,
      nickname || "돈폴겟유저",
      profile_image_url || "",
      provider || "email",
    ];
    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      message: "사용자 정보가 성공적으로 저장되었습니다.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("유저 등록/수정 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
};

// 특정 사용자 프로필 조회
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("프로필 조회 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
};
