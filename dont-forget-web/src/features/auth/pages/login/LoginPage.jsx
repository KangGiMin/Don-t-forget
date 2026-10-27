// src/pages/LoginPage.jsx
import { useState } from 'react';
import { auth, googleProvider } from '@/shared/services/firebase/firebase';
import { getFirebaseAuthHeaders } from '@/shared/services/firebase/idToken';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "@/shared/i18n/LanguageContext"; 
import './LoginPage.css';
import { apiUrl } from "@/shared/config/api";
import { ROUTES } from "@/shared/constants/app";

function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.removeItem('token');
      localStorage.setItem('userName', user.displayName || user.email?.split('@')[0] || '친구');
      localStorage.setItem('userId', user.uid);
      window.location.href = ROUTES.todos;
    } catch (error) { console.error(error); }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      localStorage.removeItem('token');
      localStorage.setItem('userName', user.displayName || user.email.split('@')[0]);
      localStorage.setItem('userId', user.uid);
      window.location.href = ROUTES.todos;
    } catch (error) { alert("이메일 또는 비밀번호가 틀렸습니다."); }
  };

  const handleEmailSignUp = async () => {
    if (!email || !password) return alert("가입할 이메일과 비밀번호를 위에 먼저 입력하신 후 눌러주세요.");
    if (password.length < 10) return alert("비밀번호는 10자 이상이어야 합니다.");
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const displayName = credential.user.displayName || email.trim().split("@")[0];
      await fetch(apiUrl(`/users/${encodeURIComponent(credential.user.uid)}`), {
        method: "PUT",
        headers: await getFirebaseAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ userName: displayName, statusMessage: "", profileImg: "" }),
      });
      localStorage.setItem("userId", credential.user.uid);
      localStorage.setItem("userName", displayName);
      navigate(ROUTES.todos, { replace: true });
    } catch (error) { console.error(error); }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="page-brand" aria-label="Don't Forget">
          <span className="page-brand-mark" aria-hidden="true">✓</span>
          <span>don't forget</span>
        </div>
        <h1 className="login-title">{t.loginTitle}</h1>
        <p className="auth-intro">{t.appSubtitle}</p>
        
       <form className="login-form" onSubmit={handleEmailLogin}>
          <input type="email" placeholder={t.phIdEmail} value={email} onChange={(e) => setEmail(e.target.value)} className="login-input" />
          <input type="password" placeholder={t.phPassword} value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" />
          <button type="submit" className="login-submit-btn">{t.btnLogin}</button>
          <button type="button" onClick={handleEmailSignUp} className="email-signup-btn">{t.btnEmailSignup}</button>
        </form>

        <div className="social-login-area">
          <div className="divider">{t.simpleLogin}</div>
          <button type="button" onClick={handleGoogleLogin} className="google-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" />
            {t.btnGoogleLogin}
          </button>
        </div>

        <div className="login-links">
          <button type="button" className="link-text" onClick={() => navigate(ROUTES.signup)}>{t.linkSignup}</button>
          <span className="separator">|</span>
          <button type="button" className="link-text" onClick={() => navigate(ROUTES.findId)}>{t.linkFindId}</button>
          <span className="separator">|</span>
          <button type="button" className="link-text" onClick={() => navigate(ROUTES.findPassword)}>{t.linkFindPw}</button>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;





