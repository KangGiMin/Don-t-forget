// src/pages/SignupPage.jsx
import { useState } from "react";
import { useLanguage } from '../LanguageContext';
import "./SignupPage.css";

function SignupPage() {
  const { t } = useLanguage();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, password: password, name: name }),
      });
      const result = await response.json();
      if (result.success) {
        window.location.href = "/login";
      } else { alert(result.message); }
    } catch (error) { console.log(error); }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">{t.signupTitle}</h1>

        <form className="register-form" onSubmit={handleRegister}>
          <input type="text" className="register-input" placeholder={t.phSignupId} value={id} onChange={(e) => setId(e.target.value)} required />
          <input type="password" className="register-input" placeholder={t.phSignupPw} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="text" className="register-input" placeholder={t.phSignupName} value={name} onChange={(e) => setName(e.target.value)} required />
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