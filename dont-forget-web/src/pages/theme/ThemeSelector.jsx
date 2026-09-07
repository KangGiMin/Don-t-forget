// 화면 테마 설정

import { useState, useEffect, useRef } from 'react';
import './ThemeSelector.css';

function ThemeSelector() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 🌟 [핵심 기능 1] 화면 색깔 진짜로 바꾸기 & 시스템 실시간 감시!
  useEffect(() => {
    const root = window.document.documentElement;
    // 컴퓨터의 현재 테마 상태를 확인하는 레이더망!
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 색깔을 칠하는 마법 함수
    const applyTheme = () => {
      const systemPrefersDark = mediaQuery.matches;
      if (theme === 'dark' || (theme === 'system' && systemPrefersDark)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    // 1. 일단 지금 당장 테마를 적용해!
    applyTheme();
    localStorage.setItem('theme', theme);

    // 2. 만약 컴퓨터 설정이 실시간으로 바뀌면?
    const handleSystemThemeChange = () => {
      // 유저가 '시스템 설정'을 골라놨을 때만 실시간으로 따라가기!
      if (theme === 'system') {
        applyTheme();
      }
    };

    // 레이더망에 '변화(change)'가 생기면 함수 실행하라고 감시카메라 달기
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // 로봇이 퇴근할 때 감시카메라도 떼어가기 (청소)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  // 🌟 [핵심 기능 2] 드롭다운 바깥쪽 클릭하면 스르륵 닫히기!
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const getButtonText = () => {
    if (theme === 'light') return '라이트 모드 🌞';
    if (theme === 'dark') return '다크 모드 🌙';
    return '시스템 설정 💻';
  };

  return (
    <div className="theme-selector-container" ref={dropdownRef}>
      <button 
        className="theme-main-btn" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {getButtonText()}
      </button>

      {isOpen && (
        <ul className="theme-dropdown-menu">
          <li onClick={() => handleThemeChange('light')}>
            <span>🌞 라이트 모드</span>
            {theme === 'light' && <span className="check-mark">✔</span>}
          </li>
          <li onClick={() => handleThemeChange('dark')}>
            <span>🌙 다크 모드</span>
            {theme === 'dark' && <span className="check-mark">✔</span>}
          </li>
          <li onClick={() => handleThemeChange('system')}>
            <span>💻 시스템 설정</span>
            {theme === 'system' && <span className="check-mark">✔</span>}
          </li>
        </ul>
      )}
    </div>
  );
}   

export default ThemeSelector;