// src/pages/FindIdPage.jsx
import { useState } from "react";
import { useLanguage } from '../LanguageContext';
import "./FindIdPage.css";

function FindIdPage() {
  const { t } = useLanguage();
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
      } else { alert(result.message); }
    } catch (error) { console.log(error); }
  };

  return (
    <div className="find-id-container">
      <div className="find-id-box">
        <h1 className="find-id-title">{t.findIdTitle}</h1>

        {!foundId ? (
          <form className="find-id-form" onSubmit={handleFindId}>
            <input type="text" className="find-id-input" placeholder={t.phFindIdName} value={name} onChange={(e) => setName(e.target.value)} required />
            <button type="submit" className="find-id-submit-btn">{t.btnFindId}</button>
          </form>
        ) : (
          <div style={{ margin: "20px 0", color: "#f8fafc", fontSize: "18px" }}>
            <p>{t.txtYourIdIs}</p>
            <p style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "24px", margin: "15px 0" }}>{foundId}</p>
            <button onClick={() => (window.location.href = "/login")} className="login-submit-btn">{t.btnGoLogin}</button>
          </div>
        )}

        <div className="login-footer">
          <a href="/login" className="footer-link">{t.linkBackLogin}</a>
          <div className="divider"></div>
          <a href="/find-pw" className="footer-link">{t.linkFindPw}</a>
        </div>
      </div>
    </div>
  );
}
export default FindIdPage;