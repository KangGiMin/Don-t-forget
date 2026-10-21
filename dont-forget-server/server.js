require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || Buffer.byteLength(JWT_SECRET, "utf8") < 32) {
  throw new Error("JWT_SECRET must contain at least 32 random bytes.");
}

const app = require("./src/app");
const { connectDatabase } = require("./src/config/database");
const PORT = Number(process.env.PORT) || 3000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`백엔드(Node) 서버가 http://localhost:${PORT} 에서 켜졌습니다!`);
    });
  })
  .catch((error) => {
    console.error("MongoDB 연결 또는 사용자 인덱스 준비 실패:", {
      name: error?.name,
      code: error?.code,
      codeName: error?.codeName,
      message: error?.message,
    });
    process.exitCode = 1;
  });
