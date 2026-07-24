// 클라이언트(Flutter 앱)가 호출할 엔드포인트 URL 주소(POST /api/users, GET /api/users/:userId)를 정의

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// POST /api/users - 유저 정보 등록/업데이트
router.post("/", userController.registerOrUpdateUser);

// GET /api/users/:userId - 특정 유저 프로필 조회
router.get("/:userId", userController.getUserProfile);

module.exports = router;
