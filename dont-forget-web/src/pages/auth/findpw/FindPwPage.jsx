import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { useLanguage } from "../../../locales/LanguageContext";
import "./FindPwPage.css";

function FindPwPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("계정이 존재하는 경우 비밀번호 재설정 안내 이메일을 보냈습니다.");
    } catch (resetError) {
      console.error("비밀번호 재설정 이메일 전송 실패:", resetError);
      setError("재설정 이메일을 보내지 못했습니다. 이메일 주소를 확인해 주세요.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">{t.findPwTitle}</h1>
        <form className="login-form" onSubmit={handleResetPassword}>
          <input
            type="email"
            className="login-input"
            placeholder={t.phIdEmail}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoCapitalize="none"
            required
          />
          {message && <p role="status">{message}</p>}
          {error && <p role="alert">{error}</p>}
          <button type="submit" className="login-submit-btn">{t.btnChangePw}</button>
        </form>
        <div className="login-footer">
          <Link to="/login" className="footer-link">{t.linkBackLogin}</Link>
          <div className="divider"></div>
          <Link to="/find-id" className="footer-link">{t.linkFindId}</Link>
        </div>
      </div>
    </div>
  );
}

export default FindPwPage;
