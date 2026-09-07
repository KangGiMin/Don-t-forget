// 프로젝트 서버의 중심축

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("node:dns");
require("dotenv").config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("MongoDB 연결 성공!"))
  .catch((err) => console.log("MongoDB 연결 실패..", err));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 쪼개진 라우터 불러오기
const todoRoutes = require('./routes/todos');
const userRoutes = require('./routes/users');

// api의 구역 할당하기
app.use('/api/todos', todoRoutes); 
app.use('/api', userRoutes); // 로그인, 회원가입 등 유저 관련은 모두 여기서 처리!

app.get("/", (req, res) => {
  res.send("Node(백엔드) 서버가 오픈되었습니다!");
});

// 서버 가동
app.listen(PORT, () => {
  console.log(`백엔드(Node) 서버가 http://localhost:${PORT} 에서 켜졌습니다!`);
});