// src/pages/LoginPage.jsx
import { useState } from 'react';
import { auth, googleProvider } from '../../../firebase/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../../../locales/LanguageContext"; 
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
      localStorage.setItem('userName', user.displayName || user.email || '친구');
      navigate('/todo');
    } catch (error) {
      console.error('Google 로그인 실패:', error);
      alert('Google 로그인에 실패했습니다.');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      localStorage.setItem('userName', user.email.split('@')[0]);
      navigate('/todo');
    } catch (error) {
      console.error('이메일 로그인 실패:', error);
      alert('이메일 또는 비밀번호를 확인해 주세요.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">{t.loginTitle}</h1>
        
       <form className="login-form" onSubmit={handleEmailLogin}>
          <input type="email" placeholder={t.phIdEmail} value={email} onChange={(e) => setEmail(e.target.value)} className="login-input" />
          <input type="password" placeholder={t.phPassword} value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" />
          <button type="submit" className="login-submit-btn">{t.btnLogin}</button>
          <button type="button" onClick={() => navigate('/signup')} className="email-signup-btn">{t.btnEmailSignup}</button>
        </form>

        <div className="social-login-area">
          <div className="divider">{t.simpleLogin}</div>
          <button type="button" onClick={handleGoogleLogin} className="google-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" />
            {t.btnGoogleLogin}
          </button>
        </div>

        <div className="login-links">
          <span className="link-text" onClick={() => navigate('/signup')}>{t.linkSignup}</span>
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