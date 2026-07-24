const express = require("express");
const cors = require("cors");
require("dotenv").config();

// DB 및 라우터 불러오기
const pool = require("./config/db");
const userRoutes = require("./src/routes/userRoutes");
const todoRoutes = require("./src/routes/todoRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes"); // 👈 추가!

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 등록
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/categories", categoryRoutes); // 👈 /api/categories 추가!

// 기본 헬스체크 라우트
app.get("/", (req, res) => {
  res.send("돈폴겟(DonForget) 백엔드 서버가 정상적으로 동작 중입니다! 🚀");
});

module.exports = app;
