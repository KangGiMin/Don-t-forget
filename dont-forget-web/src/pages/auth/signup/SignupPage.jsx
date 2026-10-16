// src/pages/SignupPage.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase/firebase";
import { useLanguage } from "../../../locales/LanguageContext";
import "./SignupPage.css";

function SignupPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name.trim() });
      localStorage.setItem("userName", name.trim());
      navigate("/todo", { replace: true });
    } catch (signupError) {
      console.error("회원가입 실패:", signupError);
      setError("회원가입에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">{t.signupTitle}</h1>

        <form className="register-form" onSubmit={handleRegister}>
          <input type="text" className="register-input" placeholder={t.phSignupName} value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" className="register-input" placeholder={t.phIdEmail} value={email} onChange={(e) => setEmail(e.target.value)} autoCapitalize="none" required />
          <input type="password" className="register-input" placeholder={t.phSignupPw} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          {error && <p role="alert">{error}</p>}
          <button type="submit" className="register-submit-btn">{t.btnSignup}</button>
        </form>

        <div className="register-footer">
          <div>{t.txtAlreadyAccount}</div>
          <a href="/login" className="footer-link">{t.linkToLogin}</a>
        </div>
      </div>
    </div>
  );
}
export default SignupPage;