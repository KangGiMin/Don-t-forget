import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import FindIdPage from "./pages/FindIdPage";
import FindPwPage from "./pages/FindPwPage";
import React, { useEffect } from 'react'; 
import './App.css';

function App() {

 // 🌟 [핵심 마법] 앱이 켜지자마자 테마를 세팅하고, 실시간으로 감시하는 본부!
  useEffect(() => {
    // 1. 메모장에서 유저가 마지막으로 고른 테마 꺼내오기! (없으면 'system'이 기본값)
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    // 2. 내 컴퓨터(OS)가 지금 다크모드인지 확인하는 레이더망!
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 3. 테마를 화면에 칠하는 진짜 일꾼 함수
    const applyTheme = (theme) => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // 🌟 유저가 '시스템 설정'을 골랐거나 처음 온 사람일 때!
        // 레이더망(mediaQuery)을 확인해서 컴퓨터 설정대로 따라가게 함!
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    // 4. 앱 켜지자마자 바로 색칠 시작!
    applyTheme(savedTheme);

    // 5. 🌟 실시간 감시 기능 (컴퓨터 설정이 바뀌면 웹페이지도 휙! 바뀌게)
    const handleChange = (e) => {
      // 유저가 '시스템 설정'으로 해놨을 때만 컴퓨터 설정을 따라가야 해!
      // (만약 유저가 억지로 '라이트 모드' 고정해놨으면 맘대로 바꾸면 안 되니까!)
      if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    // 레이더망에 변화 감지 센서 달아주기
    mediaQuery.addEventListener('change', handleChange);

    // 앱이 꺼질 땐 센서 깔끔하게 떼어내기 (메모리 낭비 방지!)
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Signup" element={<SignupPage />} />
        <Route path="/find-id" element={<FindIdPage />} /> 
        <Route path="/find-pw" element={<FindPwPage />} /> 
        <Route path="/todo" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
