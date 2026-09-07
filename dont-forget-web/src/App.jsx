import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './locales/LanguageContext';
import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignupPage";
import FindIdPage from "./pages/auth/findid/FindIdPage"; 
import FindPwPage from "./pages/auth/findpw/FindPwPage";
import MainPage from './pages/main/MainPage';
import ProfilePage from './pages/profile/ProfilePage';
import ContactAdminPage from './pages/admin/ContactAdminPage';

function App() {
  return (
    // 다국어 번역 기능을 앱 전체에 뿌려주기!
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* 아무것도 안 치고 들어오면 무조건 로그인 페이지로 쫓아냄! */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/find-id" element={<FindIdPage />} />
          <Route path="/find-pw" element={<FindPwPage />} />
          
          {/* 네가 지금 들어가려던 대망의 메인 화면! */}
          <Route path="/todo" element={<MainPage />} />
          
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contact" element={<ContactAdminPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;