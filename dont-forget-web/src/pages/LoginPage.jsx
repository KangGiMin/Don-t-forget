// src/pages/LoginPage.jsx
import { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext'; // 🌟 무전기 추가!
import './LoginPage.css';

function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('userName', user.displayName);
      localStorage.setItem('userId', user.uid);
      window.location.href = "/todo";
    } catch (error) { console.error(error); }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('userName', user.email.split('@')[0]);
      localStorage.setItem('userId', user.uid);
      window.location.href = "/todo";
    } catch (error) { alert("이메일 또는 비밀번호가 틀렸습니다."); }
  };

  const handleEmailSignUp = async () => {
    if (!email || !password) return alert("가입할 이메일과 비밀번호를 위에 먼저 입력하신 후 눌러주세요.");
    if (password.length < 6) return alert("비밀번호는 안전하게 6자리 이상으로 해야 합니다.");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("성공적으로 회원가입 되었습니다.");
    } catch (error) { console.error(error); }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">{t.loginTitle}</h1>
        
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
          <span className="link-text" onClick={() => navigate('/Signup')}>{t.linkSignup}</span>
          <span className="separator">|</span>
          <span className="link-text" onClick={() => navigate('/find-id')}>{t.linkFindId}</span>
          <span className="separator">|</span>
          <span className="link-text" onClick={() => navigate('/find-pw')}>{t.linkFindPw}</span>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;