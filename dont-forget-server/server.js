// 프로젝트 서버의 중심축

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { applicationDefault, initializeApp } = require("firebase-admin/app");
require("dotenv").config();

if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error("FIREBASE_PROJECT_ID 환경변수가 필요합니다.");
}

initializeApp({
  credential: applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const app = express();
const PORT = Number(process.env.PORT || 3000);
const allowedOrigins = process.env.CORS_ORIGIN
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === "production" && !allowedOrigins?.length) {
  throw new Error("운영 환경에서는 CORS_ORIGIN을 설정해야 합니다.");
}

app.use(cors({ origin: allowedOrigins?.length ? allowedOrigins : true }));
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ limit: "3mb", extended: true }));

const todoRoutes = require("./routes/todos");
const userRoutes = require("./routes/users");

app.use("/api/todos", todoRoutes);
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Node(백엔드) 서버가 오픈되었습니다!");
});

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI 환경변수가 필요합니다.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`백엔드 서버가 포트 ${PORT}에서 실행 중입니다.`);
  });
}

startServer().catch((error) => {
  console.error("서버 시작 실패:", error);
  process.exitCode = 1;
});