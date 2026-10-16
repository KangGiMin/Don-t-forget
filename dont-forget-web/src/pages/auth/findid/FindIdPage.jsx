import { Link } from "react-router-dom";
import { useLanguage } from "../../../locales/LanguageContext";
import "./FindIdPage.css";

function FindIdPage() {
  const { t } = useLanguage();

  return (
    <div className="find-id-container">
      <div className="find-id-box">
        <h1 className="find-id-title">{t.findIdTitle}</h1>
        <p role="status">
          로그인 아이디는 Firebase 계정에 등록한 이메일 주소입니다.
          계정 이메일을 확인할 수 없다면 이메일 제공업체의 계정 복구 절차를 이용해 주세요.
        </p>
        <div className="login-footer">
          <Link to="/login" className="footer-link">{t.linkBackLogin}</Link>
          <div className="divider"></div>
          <Link to="/find-pw" className="footer-link">{t.linkFindPw}</Link>
        </div>
      </div>
    </div>
  );
}

export default FindIdPage;
