// src/pages/FindIdPage.jsx
import { useState } from "react";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import "./FindIdPage.css";
import { apiUrl } from "@/shared/config/api";
import { ROUTES } from "@/shared/constants/app";

function FindIdPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [foundId, setFoundId] = useState(null);

  const handleFindId = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl("/find-id"), {
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
      console.log(error);
    }
  };

  return (
    <div className="find-id-container">
      <div className="find-id-box">
        <div className="page-brand" aria-label="Don't Forget">
          <span className="page-brand-mark" aria-hidden="true">✓</span>
          <span>don't forget</span>
        </div>
        <h1 className="find-id-title">{t.findIdTitle}</h1>
        <p className="auth-intro">{t.appSubtitle}</p>

        {!foundId ? (
          <form className="find-id-form" onSubmit={handleFindId}>
            <input
              type="text"
              className="find-id-input"
              placeholder={t.phFindIdName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button type="submit" className="find-id-submit-btn">
              {t.btnFindId}
            </button>
          </form>
        ) : (
          <div className="find-id-result" role="status">
            <p>{t.txtYourIdIs}</p>
            <p className="found-id">{foundId}</p>
            <button
              onClick={() => (window.location.href = ROUTES.login)}
              className="login-submit-btn"
            >
              {t.btnGoLogin}
            </button>
          </div>
        )}

        <div className="login-footer">
          <a href={ROUTES.login} className="footer-link">
            {t.linkBackLogin}
          </a>
          <div className="divider"></div>
          <a href={ROUTES.findPassword} className="footer-link">
            {t.linkFindPw}
          </a>
        </div>
      </div>
    </div>
  );
}
export default FindIdPage;





