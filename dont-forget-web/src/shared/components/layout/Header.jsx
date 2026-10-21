import { useLanguage } from "@/shared/i18n/LanguageContext";

export default function Header({ userName, toggleSidebar }) {
  const { t } = useLanguage();

  return (
    <div className="header-area">
      <div>
        <h1 className="title-text">{userName}{t.appTitle}</h1>
        <p className="subtitle-text">{t.appSubtitle}</p>
      </div>
      <button type="button" className="hamburger-button" onClick={toggleSidebar}>
        ☰
      </button>
    </div>
  );
}
