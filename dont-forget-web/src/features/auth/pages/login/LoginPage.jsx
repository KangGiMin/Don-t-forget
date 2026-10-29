// src/pages/LoginPage.jsx
import { useEffect, useState } from 'react';
import { auth, googleProvider } from '@/shared/services/firebase/firebase';
import { getFirebaseAuthHeaders } from '@/shared/services/firebase/idToken';
import { signInWithCustomToken, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "@/shared/i18n/LanguageContext"; 
import './LoginPage.css';
import { apiUrl } from "@/shared/config/api";
import { ROUTES } from "@/shared/constants/app";

function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [socialError, setSocialError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const customToken = params.get("firebase_custom_token");
    const socialErrorMessage = params.get("social_error");
    if (!customToken && !socialErrorMessage) return;

    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    if (socialErrorMessage) {
      setSocialError(socialErrorMessage);
      return;
    }

    let active = true;
    const completeSocialLogin = async () => {
      try {
        const credential = await signInWithCustomToken(auth, customToken);
        const user = credential.user;
        const displayName = params.get("display_name") || "친구";
        const photoURL = params.get("photo_url") || null;
        await updateProfile(user, { displayName, photoURL });
        try {
          await fetch(apiUrl(`/users/${encodeURIComponent(user.uid)}`), {
            method: "PUT",
            headers: await getFirebaseAuthHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ userName: displayName, statusMessage: "", profileImg: photoURL || "" }),
          });
        } catch (profileError) {
          console.warn("Social account profile was not saved.", profileError?.message);
        }
        if (!active) return;
        localStorage.setItem("userName", displayName);
        localStorage.setItem("profileImg", photoURL || "");
        localStorage.setItem("userId", user.uid);
        window.location.replace(ROUTES.todos);
      } catch (error) {
        if (active) setSocialError("소셜 로그인에 실패했습니다. 다시 시도해 주세요.");
        console.error(error);
      }
    };
    completeSocialLogin();
    return () => { active = false; };
  }, []);

  const startSocialLogin = (provider) => {
    setSocialError("");
    window.location.assign(apiUrl(`/auth/social/${provider}/start?platform=web`));
  };

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

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="page-brand" aria-label="Don't Forget">
          <span>Don't forget</span>
        </div>
        <h1 className="login-title">{t.loginTitle}</h1>
        <p className="auth-intro">{t.appSubtitle}</p>
        
       <form className="login-form" onSubmit={handleEmailLogin}>
          <input type="email" placeholder={t.phIdEmail} value={email} onChange={(e) => setEmail(e.target.value)} className="login-input" />
          <input type="password" placeholder={t.phPassword} value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" />
          <button type="submit" className="login-submit-btn">{t.btnLogin}</button>
        </form>

        <div className="social-login-area">
          <div className="divider">{t.simpleLogin}</div>
          <div className="social-provider-buttons">
            <button type="button" onClick={handleGoogleLogin} className="google-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="" aria-hidden="true" />
              {t.btnGoogleLogin}
            </button>
            <button type="button" onClick={() => startSocialLogin("naver")} className="social-provider-btn naver-login-btn">
              <svg className="social-provider-icon naver-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 2h7l6 10V2h7v20h-7L9 12v10H2z" />
              </svg>
              {t.btnNaverLogin}
            </button>
            <button type="button" onClick={() => startSocialLogin("kakao")} className="social-provider-btn kakao-login-btn">
              <svg className="social-provider-icon kakao-icon" viewBox="60 14 16 17" aria-hidden="true">
                <path d="M68.001 16.5225C64.4222 16.5225 61.5225 19.0037 61.5225 22.0641C61.5225 24.0312 62.7219 25.7596 64.5292 26.7423L63.9181 29.2113C63.8954 29.285 63.9132 29.364 63.9619 29.4184C63.9975 29.457 64.0461 29.478 64.0931 29.478C64.1337 29.478 64.1742 29.464 64.2082 29.4341L66.834 27.5144C67.2117 27.5723 67.6007 27.6039 67.9994 27.6039C71.5767 27.6039 74.478 25.1226 74.478 22.0623C74.478 19.002 71.5783 16.5225 68.001 16.5225Z" />
              </svg>
              {t.btnKakaoLogin}
            </button>
          </div>
          {socialError ? <p className="social-login-error" role="alert">{socialError}</p> : null}
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





