// 서버(Node.js)의 전반적인 동작 로직 모음

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'don_forget_super_secret_key_1234!';

// 보안 미들웨어 - 요청에 유효한 토큰이 있는지 검사를 해 줌
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Header의 "Bearer <TOKEN>" 형태에서 토큰 문자열만 추출
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '인증 토큰이 필요합니다.' });
  }

  // 토큰이 진짜인지 위조된 건지 검증
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다.' });
    }
    req.user = user; // 토큰에 담긴 유저 정보를 req에 저장
    next(); // 검증 통과! 다음 단계로 이동
  });
};

const Todo = require("./models/Todo"); 
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const mongoose = require("mongoose");

// MongoDB 연결 코드
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("MongoDB 연결 성공!"))
  .catch((err) => console.log("MongoDB 연결 실패..", err));
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
// 기존 app.use(express.json()); 대신 아래 두 줄로 교체!
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get("/", (req, res) => {
  res.send("Node(백엔드) 서버가 무사히 오픈되었습니다!");
});

// 로그인 라우트 + JWT 티켓 발급 로직 (R - Read / 검증)
app.post("/api/login", async (req, res) => {
  try {
    const { id, password } = req.body;

    const user = await User.findOne({ id });
    if (!user) {
      console.log("로그인 성공한 유저 전체 정보:", user);
      console.log("보내려는 userId 값:", user._id);

      res.json({
        success: true,
        message: `${user.name}님 환영합니다!`,
        token: token,
        userId: user._id,
        userName: user.name,
      });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "잘못된 비밀번호입니다." });
    }

    // 🎟️ 로그인 성공! 짭짤한 JWT 티켓 만들기 (유효시간은 1일!)
    const token = jwt.sign(
      { userId: user._id, id: user.id }, // 티켓 안에 담아둘 유저 정보
      process.env.JWT_SECRET, // 우리 가게 비밀 도장
      { expiresIn: "1d" }, // 유효기간 1일
    );

    console.log(`${user.name}님 로그인 성공 및 Token 발급 완료! 🎫`);

    // 성공 메시지와 함께 티켓(token)을 프론트엔드로 쏴주기!
    res.json({
      success: true,
      message: `${user.name}님 환영합니다!`,
      token: token,
      userId: user._id,
      userName: user.name,
    });
  } catch (error) {
    console.log("로그인 에러 발생 ㅠㅠ", error);
    res.json({ success: false, message: "서버에 문제가 생겼습니다." });
  }
});

// ==========================================
// 📝 할 일(Todo) CRUD API 4총사
// ==========================================

// 1. 할 일 생성하기 (C - Create)
app.post("/api/todos", async (req, res) => {
  try {
    const { userId, text, category, dueDate, priority } = req.body;

    const newTodo = new Todo({
      userId,
      text,
      category,
      dueDate,
      priority,
    });

    await newTodo.save(); // 💾 냉장고에 할 일 찰칵 저장!
    res.json({
      success: true,
      message: "새로운 할 일이 추가되었습니다! 🚀",
      todo: newTodo,
    });
  } catch (error) {
    console.log("할 일 생성 에러 ㅠㅠ", error);
    res.json({ success: false, message: "할 일 저장 실패 ㅠㅠ" });
  }
});

// 2. 내 할 일 목록 조회하기 (R - Read)
app.get("/api/todos/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 해당 유저가 만든 모든 할 일들을 냉장고에서 싹 다 꺼내오기!
    const todos = await Todo.find({ userId });
    res.json({ success: true, todos });
  } catch (error) {
    console.log("할 일 조회 에러 ㅠㅠ", error);
    res.json({ success: false, message: "할 일 불러오기 실패 ㅠㅠ" });
  }
});

// ✏️ 할 일 수정 API (텍스트 및 완료 상태 통합 처리)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { text, completed, category, dueDate } = req.body;
    const updateData = {};
    
    if (text !== undefined) updateData.text = text;
    if (completed !== undefined) updateData.completed = completed;
    if (category !== undefined) updateData.category = category;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedTodo) {
      return res.json({ success: false, message: '해당 할 일을 찾을 수 없어!' });
    }

    res.json({ success: true, todo: updatedTodo });
  } catch (error) {
    console.log('할 일 수정 에러 ㅠㅠ', error);
    res.status(500).json({ success: false, message: '서버 에러 발생!' });
  }
});

// 4. 할 일 삭제하기 (D - Delete)
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Todo.findByIdAndDelete(id); // 🗑️ 냉장고에서 흔적도 없이 삭제!
    res.json({ success: true, message: "할 일이 삭제되었습니다! 🗑️" });
  } catch (error) {
    console.log("할 일 삭제 에러 ㅠㅠ", error);
    res.json({ success: false, message: "할 일 삭제 실패 ㅠㅠ" });
  }
});

// 회원가입 API (C - Create)
const User = require("./models/User"); // 아까 만든 설계도 가져오기!

app.post("/api/signup", async (req, res) => {
  try {
    const { name, phone, id, password } = req.body;

    // 1. 이미 똑똑한 아이디가 있는지 검사하기
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.json({
        success: false,
        message: "이미 누군가 사용 중인 아이디야!",
      });
    }

    // 2. 새 유저 객체 만들어서 냉장고에 저장하기
    const newUser = new User({ name, phone, id, password });
    await newUser.save(); // 💾 데이터베이스에 진짜로 저장!

    console.log(`새로운 회원 가입 성공! 아이디: ${id}`);
    res.json({ success: true, message: "회원가입 대성공! 환영해! 🎉" });
  } catch (error) {
    console.log("회원가입 에러 발생 ㅠㅠ", error);
    res.json({ success: false, message: "서버에 문제가 생겼어 ㅠㅠ" });
  }
});

// 🔍 1. 아이디 찾기 API
app.post("/api/find-id", async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findOne({ name: name });

    if (!user) {
      return res.json({
        success: false,
        message: "입력하신 이름으로 등록된 아이디가 없어!",
      });
    }

    res.json({ success: true, id: user.id });
  } catch (error) {
    console.log("아이디 찾기 에러 ㅠㅠ", error);
    res.status(500).json({ success: false, message: "서버 에러 발생!" });
  }
});

// 🔑 2. 비밀번호 재설정 API
app.post("/api/reset-password", async (req, res) => {
  try {
    const { id, name, newPassword } = req.body;
    const user = await User.findOne({ id: id, name: name });

    if (!user) {
      return res.json({
        success: false,
        message: "일치하는 아이디나 이름 정보를 찾을 수 없어!",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었어! 새 비밀번호로 로그인해 봐.",
    });
  } catch (error) {
    console.log("비밀번호 재설정 에러 ㅠㅠ", error);
    res.status(500).json({ success: false, message: "서버 에러 발생!" });
  }
});

// 👤 유저 프로필 정보 수정해 주는 창고 직원 (API)
// ==========================================
// 👤 유저 프로필 정보 수정해 주는 창고 직원 (API) - 강력 버전!
// ==========================================
app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { userName, statusMessage, profileImg } = req.body;

    // 🌟 [핵심 수술] 아이디가 MongoDB 기본 _id인지, 커스텀 id인지 둘 다 커버하기!
    let query = {};
    if (mongoose.Types.ObjectId.isValid(userId)) {
      query = { _id: userId }; // 24자리 기본 아이디일 경우
    } else {
      query = { id: userId };  // 네 스샷처럼 커스텀 아이디(Firebase 등)일 경우
    }

    // findByIdAndUpdate 대신 findOneAndUpdate를 써서 유도리 있게 검색!
    const updatedUser = await User.findOneAndUpdate(
      query,
      { 
        name: userName, // 프론트의 userName을 DB의 name 필드에 덮어쓰기
        statusMessage: statusMessage,
        profileImg: profileImg
      },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: '장부에 없는 유저야 ㅠㅠ' });
    }

    res.json({ success: true, message: '프로필 업데이트 찢었다! 완료!', user: updatedUser });

  } catch (error) {
    console.log('프로필 업데이트 서버 에러 ㅠㅠ:', error);
    res.status(500).json({ success: false, message: '서버가 아파요 ㅠㅠ' });
  }
});
app.listen(PORT, () => {
  console.log(
    `백엔드(Node) 서버가 http://localhost:${PORT} 에서 켜졌습니다! 🚀`,
  );
});

// 🔍 1. 아이디 찾기 API
app.post("/api/find-id", async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findOne({ name: name });

    if (!user) {
      return res.json({
        success: false,
        message: "입력하신 이름으로 등록된 아이디가 없어!",
      });
    }

    res.json({ success: true, id: user.id });
  } catch (error) {
    console.log("아이디 찾기 에러 ㅠㅠ", error);
    res.status(500).json({ success: false, message: "서버 에러 발생!" });
  }
});

// 🔑 2. 비밀번호 재설정 API
app.post("/api/reset-password", async (req, res) => {
  try {
    const { id, name, newPassword } = req.body;
    const user = await User.findOne({ id: id, name: name });

    if (!user) {
      return res.json({
        success: false,
        message: "일치하는 아이디나 이름 정보를 찾을 수 없어!",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었어! 새 비밀번호로 로그인해 봐.",
    });
  } catch (error) {
    console.log("비밀번호 재설정 에러 ㅠㅠ", error);
    res.status(500).json({ success: false, message: "서버 에러 발생!" });
  }
});
