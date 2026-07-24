// /api/categories

const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// POST /api/categories - 카테고리 생성
router.post("/", categoryController.createCategory);

// GET /api/categories/user/:userId - 특정 유저의 카테고리 목록 조회
router.get("/user/:userId", categoryController.getCategoriesByUser);

// DELETE /api/categories/:categoryId - 카테고리 삭제
router.delete("/:categoryId", categoryController.deleteCategory);

module.exports = router;
