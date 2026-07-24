// 카테고리 관리

const pool = require("../../config/db");

// 1. 카테고리 생성
exports.createCategory = async (req, res) => {
  const { user_id, name, color_code } = req.body;

  if (!user_id || !name) {
    return res
      .status(400)
      .json({
        success: false,
        message: "유저 ID와 카테고리 이름은 필수입니다.",
      });
  }

  try {
    const query = `
      INSERT INTO categories (user_id, name, color_code)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [user_id, name, color_code || "#000000"];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "카테고리가 성공적으로 추가되었습니다.",
      category: result.rows[0],
    });
  } catch (error) {
    console.error("카테고리 생성 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
};

// 2. 특정 유저의 카테고리 목록 조회
exports.getCategoriesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const query = "SELECT * FROM categories WHERE user_id = $1 ORDER BY id ASC";
    const result = await pool.query(query, [userId]);

    res.status(200).json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    console.error("카테고리 목록 조회 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
};

// 3. 카테고리 삭제
exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [categoryId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "해당 카테고리를 찾을 수 없습니다." });
    }

    res.status(200).json({
      success: true,
      message: "카테고리가 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("카테고리 삭제 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
};
