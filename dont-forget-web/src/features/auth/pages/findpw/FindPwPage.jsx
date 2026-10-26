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
    <div className="find-pw-container">
      <div className="find-pw-box">
        <div className="page-brand" aria-label="Don't Forget">
          <span className="page-brand-mark" aria-hidden="true">✓</span>
          <span>don't forget</span>
        </div>
        <h1 className="find-pw-title">{t.findPwTitle}</h1>
        <p className="auth-intro">{t.appSubtitle}</p>
        {submitted ? (
          <p className="reset-status" role="status">등록된 계정이면 비밀번호 재설정 안내를 받을 수 있습니다.</p>
        ) : (
          <form className="find-pw-form" onSubmit={handleResetPassword}>
            <input
              type="email"
              className="find-pw-input"
              placeholder={t.phIdEmail}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
            <button type="submit" className="find-pw-submit-btn">{t.btnChangePw}</button>
          </form>
        )}
        <div className="find-pw-footer">
          <a href={ROUTES.login} className="find-pw-link">{t.linkBackLogin}</a>
        </div>
      </div>
    </div>
  );
}

export default FindPwPage;



