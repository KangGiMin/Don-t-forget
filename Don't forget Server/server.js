// 서버 실행 엔트리 포인트 (Listen)

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다!`);
  console.log(`=================================`);
});
