// /api/todos

const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

// POST /api/todos - 할 일 생성
router.post("/", todoController.createTodo);

// GET /api/todos/user/:userId - 특정 유저의 모든 할 일 조회
router.get("/user/:userId", todoController.getTodosByUser);

// PUT /api/todos/:todoId - 할 일 수정
router.put("/:todoId", todoController.updateTodo);

// DELETE /api/todos/:todoId - 할 일 삭제
router.delete("/:todoId", todoController.deleteTodo);

module.exports = router;
