const Todo = require("./Todo");

exports.createTodo = async (req, res) => {
  try {
    const { text, category, dueDate, priority } = req.body;
    const newTodo = new Todo({
      userId: req.auth.uid,
      text,
      category,
      dueDate,
      priority,
    });
    await newTodo.save();
    return res.status(201).json({ success: true, todo: newTodo });
  } catch (error) {
    return res.status(400).json({ success: false, message: "할 일을 저장하지 못했습니다." });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const filter = { userId: req.auth.uid };
    const term = typeof req.query.tags === "string" ? req.query.tags.trim() : "";
    if (term.length > 100) {
      return res.status(400).json({ success: false, message: "검색어는 100자 이하여야 합니다." });
    }
    if (term) {
      const escaped = term.replace(/[.*+?^|{}()[\]\\$]/g, (character) => "\\" + character);
      filter.$or = [
        { text: { $regex: escaped, $options: "i" } },
        { category: { $regex: escaped, $options: "i" } },
      ];
    }
    const todos = await Todo.find(filter).sort({ dueDate: 1, createdAt: -1 });
    return res.json({ success: true, todos });
  } catch (error) {
    return res.status(500).json({ success: false, message: "할 일을 불러오지 못했습니다." });
  }
};
exports.updateTodo = async (req, res) => {
  try {
    const { text, completed, category, dueDate } = req.body;
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (completed !== undefined) updateData.completed = completed;
    if (category !== undefined) updateData.category = category;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.uid },
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedTodo) return res.status(404).json({ success: false, message: "할 일을 찾을 수 없습니다." });
    return res.json({ success: true, todo: updatedTodo });
  } catch (error) {
    return res.status(400).json({ success: false, message: "할 일을 수정하지 못했습니다." });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.uid,
    });
    if (!deletedTodo) return res.status(404).json({ success: false, message: "할 일을 찾을 수 없습니다." });
    return res.json({ success: true, message: "할 일이 삭제되었습니다." });
  } catch (error) {
    return res.status(400).json({ success: false, message: "할 일을 삭제하지 못했습니다." });
  }
};


