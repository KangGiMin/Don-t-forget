const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: String(process.env.DB_PASSWORD || "1234"), // 👈 String()으로 무조건 문자열로 감싸서 넘김!
  database: process.env.DB_NAME || "donforget_db",
});

// DB 연결 테스트
pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌ PostgreSQL 연결 실패!:", err.stack);
  }
  console.log("✅ PostgreSQL 데이터베이스 연결 성공!");
  release();
});

module.exports = pool;
