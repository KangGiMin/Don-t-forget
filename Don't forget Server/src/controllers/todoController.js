// Todo CRUD 및 일괄 삭제

const pool = require("../../config/db");

// 1. 할 일(Todo) 생성 로직
exports.createTodo = async (req, res) => {
  const { user_id, category_id, title, content, due_date, priority } = req.body;

  if (!user_id || !title || !due_date) {
    return res.status(400).json({
      success: false,
      message: "유저 ID, 제목, 마감일은 필수 요구 항목입니다.",
    });
  }

  try {
    const query = `
      INSERT INTO todos (user_id, category_id, title, content, due_date, priority)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      user_id,
      category_id || null,
      title,
      content || "",
      due_date,
      priority || "MEDIUM",
    ];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "할 일이 성공적으로 추가되었습니다.",
      todo: result.rows[0],
    });
  } catch (error) {
    console.error("Todo 생성 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
};

// 2. 특정 유저의 모든 할 일 조회
exports.getTodosByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `
      SELECT t.*, c.name AS category_name, c.color_code
      FROM todos t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
      ORDER BY t.due_date ASC;
    `;
    const result = await pool.query(query, [userId]);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      todos: result.rows,
    });
  } catch (error) {
    console.error("Todo 목록 조회 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
};

// 3. 할 일 수정 (내용 변경 또는 완료 처리)
exports.updateTodo = async (req, res) => {
  const { todoId } = req.params;
  const { title, content, due_date, priority, is_completed, category_id } =
    req.body;

  try {
    const query = `
      UPDATE todos
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          due_date = COALESCE($3, due_date),
          priority = COALESCE($4, priority),
          is_completed = COALESCE($5, is_completed),
          completed_at = CASE WHEN $5 = true THEN NOW() ELSE completed_at END,
          category_id = COALESCE($6, category_id),
          updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      title,
      content,
      due_date,
      priority,
      is_completed,
      category_id,
      todoId,
    ];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "해당 할 일을 찾을 수 없습니다." });
    }

    res.status(200).json({
      success: true,
      message: "할 일이 성공적으로 수정되었습니다.",
      todo: result.rows[0],
    });
  } catch (error) {
    console.error("Todo 수정 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
};

// 4. 할 일 삭제
exports.deleteTodo = async (req, res) => {
  const { todoId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [todoId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "해당 할 일을 찾을 수 없습니다." });
    }

    res.status(200).json({
      success: true,
      message: "할 일이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Todo 삭제 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
};
