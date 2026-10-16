const Todo = require("../models/Todo");
const mongoose = require("mongoose");

const isValidTodoId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createTodo = async (req, res) => {
  try {
    const { text, category, dueDate, priority } = req.body;
    const newTodo = new Todo({ userId: req.user.uid, text, category, dueDate, priority });

    if (typeof text !== "string" || !text.trim() || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "text와 dueDate는 필수입니다.",
      });
    }

    await newTodo.save();

    return res.status(201).json({
      success: true,
      message: "할 일이 추가되었습니다.",
      todo: newTodo,
    });
  } catch (error) {
    console.error("할 일 생성 오류:", error);

    const status = error.name === "ValidationError" ? 400 : 500;
    return res.status(status).json({
      success: false,
      message:
        status === 400
          ? "할 일 항목의 값이 올바르지 않습니다."
          : "할 일을 저장하지 못했습니다.",
    });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const userId = req.user.uid;
    const todos = await Todo.find({ userId }).sort({
      dueDate: 1,
      createdAt: -1,
    });

    return res.json({ success: true, todos });
  } catch (error) {
    console.error("할 일 조회 오류:", error);

    return res.status(500).json({
      success: false,
      message: "할 일 목록을 불러오지 못했습니다.",
    });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    if (!isValidTodoId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "할 일 ID 형식이 올바르지 않습니다.",
      });
    }

    const { text, completed, category, dueDate, priority } = req.body;
    const updateData = {};

    if (text !== undefined) {
      if (typeof text !== "string" || !text.trim()) {
        return res.status(400).json({
          success: false,
          message: "할 일 내용은 비어 있을 수 없습니다.",
        });
      }
      updateData.text = text.trim();
    }
    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "완료 여부는 boolean 값이어야 합니다.",
        });
      }
      updateData.completed = completed;
    }
    if (category !== undefined) updateData.category = category;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (priority !== undefined) updateData.priority = priority;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "수정할 항목이 없습니다.",
      });
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "해당 할 일을 찾을 수 없습니다.",
      });
    }

    return res.json({ success: true, todo });
  } catch (error) {
    console.error("할 일 수정 오류:", error);

    const status = error.name === "ValidationError" ? 400 : 500;
    return res.status(status).json({
      success: false,
      message:
        status === 400
          ? "할 일 항목의 값이 올바르지 않습니다."
          : "할 일을 수정하지 못했습니다.",
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    if (!isValidTodoId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "할 일 ID 형식이 올바르지 않습니다.",
      });
    }

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "해당 할 일을 찾을 수 없습니다.",
      });
    }

    return res.json({
      success: true,
      message: "할 일이 삭제되었습니다.",
      todo,
    });
  } catch (error) {
    console.error("할 일 삭제 오류:", error);

    return res.status(500).json({
      success: false,
      message: "할 일을 삭제하지 못했습니다.",
    });
  }
};
