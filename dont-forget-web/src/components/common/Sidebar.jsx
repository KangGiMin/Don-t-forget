// 메인화면 사이드바 컴포넌트

import { useLanguage } from '../../locales/LanguageContext';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from '../../pages/theme/ThemeSelector'; // 🌟 테마 선택기 경로 연결

function Sidebar({ isSidebarOpen, setIsSidebarOpen, handleLogout }) {
  const { t, lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      {/* 사이드바 열렸을 때 뒤에 깔리는 까만 배경 */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      
      {/* 진짜 사이드바 본체 */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate('/profile')}>{t.menuProfile}</div>
          <div className="menu-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ marginBottom: '10px' }}>{t.menuLang}</span>
            <select value={lang} onChange={(e) => changeLanguage(e.target.value)} style={{ width: '100%', padding: '5px', borderRadius: '5px' }}>
              <option value="ko">🇰🇷 한국어</option>
              <option value="en">🇺🇸 English</option>
              <option value="ja">🇯🇵 日本語</option>
              <option value="zh">🇨🇳 中文</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="th">🇹🇭 ไทย</option>
            </select>
          </div>
          <div className="menu-item" onClick={() => navigate('/contact')}>{t.menuContact}</div>
          <div className="menu-item">{t.menuAllTodos}</div>
          <div className="menu-item">{t.menuTime}</div>
          <div className="menu-item theme-menu-item">
            <span>{t.menuTheme}</span> <ThemeSelector />
          </div>
          <div className="menu-item logout-btn-sidebar" onClick={handleLogout}>{t.menuLogout}</div>
        </div>
        <div className="app-version">{t.appVersion} v1.0.0</div>
      </div>
    </>
  );
}

export default Sidebar;