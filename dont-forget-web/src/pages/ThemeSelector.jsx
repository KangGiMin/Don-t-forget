// 화면 테마 설정

import { useState, useEffect, useRef } from 'react';
import './ThemeSelector.css'; // 디자인을 위해 3단계에서 만들 파일!

function ThemeSelector() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 문이 열렸는지 닫혔는지!
  const dropdownRef = useRef(null); // 바깥쪽 클릭했을 때 닫히게 하려는 레이더!

  // 🌟 [핵심 기능 1] 화면 색깔 진짜로 바꾸기!
  useEffect(() => {
    const root = window.document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (theme === 'dark' || (theme === 'system' && systemPrefersDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
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

  // 유저가 메뉴를 클릭했을 때 실행할 함수
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsOpen(false); // 고르고 나면 문 닫기!
  };

  const getButtonText = () => {
    if (theme === 'light') return '라이트 모드';
    if (theme === 'dark') return '다크 모드';
    return '시스템 설정';
  };

  return (
    <div className="theme-selector-container" ref={dropdownRef}>
      {/* 1. 화면 테마 메인 버튼 */}
      <button 
        className="theme-main-btn" 
        onClick={() => setIsOpen(!isOpen)}
      >
        화면 테마 {theme === 'light' ? '🌞' : theme === 'dark' ? '🌙' : '💻'}
      </button>

      {/* 2. 드롭다운 메뉴 (isOpen이 true일 때만 촥! 나타남) */}
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