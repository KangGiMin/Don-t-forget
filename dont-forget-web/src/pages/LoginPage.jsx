import { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 1. 구글 로그인 (팝업 방식)
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('userName', user.displayName);
      localStorage.setItem('userId', user.uid);
      
      alert(`${user.displayName}님, 환영합니다!`);
      window.location.href = "/todo";
    } catch (error) {
      console.error(error);
      alert("구글 로그인에 실패했습니다. 설정을 확인해 주세요!");
    }
  };

  // 2. 이메일 로그인
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('userName', user.email.split('@')[0]);
      localStorage.setItem('userId', user.uid);

      alert("로그인되었습니다!");
      window.location.href = "/todo";
    } catch (error) {
      alert("이메일 또는 비밀번호가 틀렸습니다.");
    }
  };

  // 2-1. 이메일 회원가입
  const handleEmailSignUp = async () => {
    console.log("1. 회원가입 버튼 클릭됨"); 

    if (!email || !password) {
      console.log("2. 오류: 이메일이나 비밀번호 칸이 비어있습니다.");
      return alert("가입할 이메일과 비밀번호를 위에 먼저 입력하신 후 눌러주세요.");
    }
    
    if (password.length < 6) {
      console.log("3. 오류: 비밀번호가 6자리 미만입니다.");
      return alert("비밀번호는 안전하게 6자리 이상으로 해야 합니다.");
    }

    try {
      console.log("4. 파이어베이스로 가입 요청 보내는 중..."); 
      
      await createUserWithEmailAndPassword(auth, email, password);
      
      console.log("5. 파이어베이스 가입 완전 성공!"); 
      alert("성공적으로 회원가입 되었습니다.");
      
    } catch (error) {
      console.error("6. 파이어베이스 에러 발생 ㅠㅠ : ", error); 
      
      if (error.code === 'auth/email-already-in-use') {
        alert("이미 다른 유저가 사용 중인 이메일입니다.");
      } else {
        alert("회원가입에 실패했습니다. 에러 코드: " + error.code);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">로그인</h1>
        
       <form className="login-form" onSubmit={handleEmailLogin}>
          <input 
            type="email" 
            placeholder="아이디(또는 이메일)를 입력하세요" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input 
            type="password" 
            placeholder="비밀번호를 입력하세요 (6자 이상)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          
          {/* 로그인 버튼 */}
          <button type="submit" className="login-submit-btn">로그인하기</button>
          
          {/* 회원가입 버튼 */}
          <button type="button" onClick={handleEmailSignUp} className="email-signup-btn"> 
            이메일로 새로 가입하기
          </button>
        </form>

        {/* 구글 로그인 버튼 */}
        <div className="social-login-area">
          <div className="divider">간편 로그인</div>
          <button type="button" onClick={handleGoogleLogin} className="google-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" />
            구글 계정으로 로그인
          </button>
        </div>

        <div className="login-links">
          <span 
            className="link-text" 
            onClick={() => navigate('/Signup')}
          >
            회원가입
          </span>
          
          <span className="separator">|</span>
          
          <span 
            className="link-text" 
            onClick={() => navigate('/find-id')}
          >
            아이디 찾기
          </span>
          
          <span className="separator">|</span>
          
          <span 
            className="link-text" 
            onClick={() => navigate('/find-pw')}
          >
            비밀번호 찾기
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;