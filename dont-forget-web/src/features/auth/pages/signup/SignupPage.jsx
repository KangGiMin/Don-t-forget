import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "@/shared/services/firebase/firebase";
import { getFirebaseAuthHeaders } from "@/shared/services/firebase/idToken";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import "./SignupPage.css";
import { apiUrl } from "@/shared/config/api";
import { ROUTES } from "@/shared/constants/app";

function SignupPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password.length < 10) {
      alert("비밀번호는 10자 이상이어야 합니다.");
      return;
    }

    setSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName: name.trim() });
      const profileResponse = await fetch(
        apiUrl(`/users/${encodeURIComponent(credential.user.uid)}`),
        {
          method: "PUT",
          headers: await getFirebaseAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ userName: name.trim(), statusMessage: "", profileImg: "" }),
        }
      );
      if (!profileResponse.ok) console.warn("Firebase account exists, but the profile record could not be saved yet.");

      localStorage.setItem("userId", credential.user.uid);
      localStorage.setItem("userName", name.trim());
      navigate(ROUTES.todos, { replace: true });
    } catch (error) {
      console.error("Signup failed.", error.code || error.message);
      alert(error.code === "auth/email-already-in-use"
        ? "이미 가입된 이메일입니다."
        : error.code === "auth/invalid-email"
          ? "이메일 주소를 확인해 주세요."
          : error.code === "auth/weak-password"
            ? "비밀번호는 10자 이상이어야 합니다."
            : "회원가입을 완료하지 못했습니다. 서버 연결과 입력 정보를 확인해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="page-brand" aria-label="Don't Forget">
          <span>Don't forget</span>
        </div>
        <h1 className="register-title">{t.signupTitle}</h1>
        <p className="auth-intro">{t.appSubtitle}</p>
        <form className="register-form" onSubmit={handleRegister}>
          <input type="email" className="register-input" placeholder={t.phSignupId} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          <input type="password" className="register-input" placeholder={t.phSignupPw} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={10} required />
          <input type="text" className="register-input" placeholder={t.phSignupName} value={name} onChange={(event) => setName(event.target.value)} maxLength={60} required />
          <button type="submit" className="register-submit-btn" disabled={submitting}>{submitting ? "가입 중..." : t.btnSignup}</button>
        </form>
        <div className="register-footer">
          <div>{t.txtAlreadyAccount}</div>
          <a href={ROUTES.login} className="footer-link">{t.linkToLogin}</a>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;






