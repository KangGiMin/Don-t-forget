// src/pages/FindIdPage.jsx
import { useState } from "react";
import "./LoginPage.css"; // 로그인 페이지 CSS 재사용

function FindIdPage() {
  const [name, setName] = useState("");
  const [foundId, setFoundId] = useState(null);

  const handleFindId = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/find-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name }),
      });

      const result = await response.json();

      if (result.success) {
        setFoundId(result.id);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log("통신 에러 ㅠㅠ", error);
      alert("서버랑 통신 실패!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">아이디 찾기</h1>

        {!foundId ? (
          <form className="login-form" onSubmit={handleFindId}>
            <input
              type="text"
              className="login-input"
              placeholder="가입할 때 입력한 이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button type="submit" className="login-submit-btn">
              아이디 찾기
            </button>
          </form>
        ) : (
          <div style={{ margin: "20px 0", color: "#f8fafc", fontSize: "18px" }}>
            <p>회원님의 아이디는?</p>
            <p
              style={{
                color: "#38bdf8",
                fontWeight: "bold",
                fontSize: "24px",
                margin: "15px 0",
              }}
            >
              {foundId}
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="login-submit-btn"
            >
              로그인하러 가기
            </button>
          </div>
        )}

        <div className="login-footer">
          <a href="/login" className="footer-link">
            로그인으로 돌아가기
          </a>
          <div className="divider"></div>
          <a href="/find-pw" className="footer-link">
            비밀번호 찾기
          </a>
        </div>
      </div>
    </div>
  );
}

export default FindIdPage;
