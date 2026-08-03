// src/pages/RegisterPage.jsx
import { useState } from "react";
import "./SignupPage.css";

function SignupPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, password: password, name: name }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message || "회원가입 성공!");
        window.location.href = "/login";
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log("회원가입 통신 에러 ㅠㅠ", error);
      alert("서버랑 통신하는 데 실패했어!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">회원가입</h1>

        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="text"
            className="register-input"
            placeholder="사용하실 아이디를 입력하세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="password"
            className="register-input"
            placeholder="사용하실 비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            className="register-input"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" className="register-submit-btn">
            가입하기
          </button>
        </form>

        <div className="register-footer">
          <div>이미 계정이 있으신가요?</div>
          <a href="/login" className="footer-link">
            로그인하기
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
