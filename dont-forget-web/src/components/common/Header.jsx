// 메인화면 상단 영역 컴포넌트

import { useLanguage } from '../../locales/LanguageContext';

function Header({ userName, toggleSidebar }) {
  const { t } = useLanguage();
  
  return (
    <div className="header-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
      <div>
        <h1 className="title-text">{userName}{t.appTitle}</h1>
        <p className="subtitle-text">{t.appSubtitle}</p>
      </div>
      <button className="hamburger-button" onClick={toggleSidebar} style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
        ☰
      </button>
    </div>
  );
}

export default Header;