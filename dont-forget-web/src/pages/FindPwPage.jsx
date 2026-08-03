// src/pages/FindPwPage.jsx
import { useState } from "react";
import "./LoginPage.css";

function FindPwPage() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, name: name, newPassword: newPassword }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        window.location.href = "/login";
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
        <h1 className="login-title">비밀번호 찾기(재설정)</h1>

        <form className="login-form" onSubmit={handleResetPassword}>
          <input
            type="text"
            className="login-input"
            placeholder="아이디를 입력하세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="text"
            className="login-input"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="새로운 비밀번호를 입력하세요"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-submit-btn">
            비밀번호 변경하기
          </button>
        </form>

        <div className="login-footer">
          <a href="/login" className="footer-link">
            로그인으로 돌아가기
          </a>
          <div className="divider"></div>
          <a href="/find-id" className="footer-link">
            아이디 찾기
          </a>
        </div>
      </div>
    </div>
  );
}

export default FindPwPage;
