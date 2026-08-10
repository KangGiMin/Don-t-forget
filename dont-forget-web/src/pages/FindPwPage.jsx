// src/pages/FindPwPage.jsx
import { useState } from "react";
import { useLanguage } from '../LanguageContext';
import "./FindPwPage.css";

function FindPwPage() {
  const { t } = useLanguage();
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
        window.location.href = "/login";
      } else { alert(result.message); }
    } catch (error) { console.log(error); }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">{t.findPwTitle}</h1>

        <form className="login-form" onSubmit={handleResetPassword}>
          <input type="text" className="login-input" placeholder={t.phFindPwId} value={id} onChange={(e) => setId(e.target.value)} required />
          <input type="text" className="login-input" placeholder={t.phFindPwName} value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="password" className="login-input" placeholder={t.phFindPwNew} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <button type="submit" className="login-submit-btn">{t.btnChangePw}</button>
        </form>

        <div className="login-footer">
          <a href="/login" className="footer-link">{t.linkBackLogin}</a>
          <div className="divider"></div>
          <a href="/find-id" className="footer-link">{t.linkFindId}</a>
        </div>
      </div>
    </div>
  );
}
export default FindPwPage;