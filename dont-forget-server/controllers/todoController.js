const Todo = require("../models/Todo");

// 1. 할 일 생성하기 (C - Create)
exports.createTodo = async (req, res) => {
  try {
    const { userId, text, category, dueDate, priority } = req.body;
    const newTodo = new Todo({ userId, text, category, dueDate, priority });
    await newTodo.save();
    res.json({ success: true, message: "새로운 할 일이 추가되었습니다! 🚀", todo: newTodo });
  } catch (error) {
    console.log("할 일 생성 에러 ㅠㅠ", error);
    res.json({ success: false, message: "할 일 저장 실패 ㅠㅠ" });
  }
};

// 2. 내 할 일 목록 조회하기 (R - Read)
exports.getTodos = async (req, res) => {
  try {
    const { userId } = req.params;
    const todos = await Todo.find({ userId });
    res.json({ success: true, todos });
  } catch (error) {
    console.log("할 일 조회 에러 ㅠㅠ", error);
    res.json({ success: false, message: "할 일 불러오기 실패 ㅠㅠ" });
  }
};

// 3. 할 일 수정 API (U - Update)
exports.updateTodo = async (req, res) => {
  try {
    const { text, completed, category, dueDate } = req.body;
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (completed !== undefined) updateData.completed = completed;
    if (category !== undefined) updateData.category = category;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedTodo) return res.json({ success: false, message: '해당 할 일을 찾을 수 없어!' });
    res.json({ success: true, todo: updatedTodo });
  } catch (error) {
    console.log('할 일 수정 에러 ㅠㅠ', error);
    res.status(500).json({ success: false, message: '서버 에러 발생!' });
  }
};

// 4. 할 일 삭제하기 (D - Delete)
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ success: true, message: "할 일이 삭제되었습니다! 🗑️" });
  } catch (error) {
    console.log("할 일 삭제 에러 ㅠㅠ", error);
    res.json({ success: false, message: "할 일 삭제 실패 ㅠㅠ" });
  }
};