import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/shared/services/firebase/firebase";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import "./FindPwPage.css";
import { ROUTES } from "@/shared/constants/app";

function FindPwPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      // 계정 존재 여부가 화면에서 드러나지 않도록 결과 문구는 동일하게 둡니다.
      console.error("Password reset email request failed.", error.code);
    }
    setSubmitted(true);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">{t.findPwTitle}</h1>
        {submitted ? (
          <p role="status">등록된 계정이면 비밀번호 재설정 안내를 받을 수 있습니다.</p>
        ) : (
          <form className="login-form" onSubmit={handleResetPassword}>
            <input
              type="email"
              className="login-input"
              placeholder={t.phIdEmail}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
            <button type="submit" className="login-submit-btn">{t.btnChangePw}</button>
          </form>
        )}
        <div className="login-footer">
          <a href={ROUTES.login} className="footer-link">{t.linkBackLogin}</a>
        </div>
      </div>
    </div>
  );
}

export default FindPwPage;



