import { useLanguage } from "@/shared/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { APP_VERSION, ROUTES, SUPPORTED_LANGUAGES } from "@/shared/constants/app";
import ThemeSelector from "@/features/preferences/components/ThemeSelector";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, handleLogout }) {
  const { t, lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate(ROUTES.profile)}>{t.menuProfile}</div>
          <div className="menu-item language-menu-item">
            <span className="language-menu-title">{t.menuLang}</span>
            <select value={lang} onChange={(event) => changeLanguage(event.target.value)} className="language-select">
              {SUPPORTED_LANGUAGES.map(({ code, label }) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>
          <div className="menu-item" onClick={() => navigate(ROUTES.contact)}>{t.menuContact}</div>
          <div className="menu-item theme-menu-item">
            <span>{t.menuTheme}</span>
            <ThemeSelector />
          </div>
          <div className="menu-item logout-btn-sidebar" onClick={handleLogout}>{t.menuLogout}</div>
        </div>
        <div className="app-version">{t.appVersion} v{APP_VERSION}</div>
      </div>
    </>
  );
}
