import { useLanguage } from "@/shared/i18n/LanguageContext";

export default function Header({
  userName,
  toggleSidebar,
  onShowToday,
  onShowAllTodos,
  onScrollToCalendar,
  showAllTodos,
}) {
  const { t } = useLanguage();

  return (
    <header className="header-area">
      <button type="button" className="brand-home" onClick={onShowToday} aria-label={t.btnToday}>
        <span className="brand-mark" aria-hidden="true">✓</span>
        <span>Don't forget</span>
      </button>

      <nav className="header-nav" aria-label={t.appTitle}>
        <button
          type="button"
          className={`header-nav-item ${showAllTodos ? "" : "active"}`}
          onClick={onShowToday}
        >
          <span aria-hidden="true">◷</span>{t.btnToday}
        </button>
        <button
          type="button"
          className={`header-nav-item ${showAllTodos ? "active" : ""}`}
          onClick={onShowAllTodos}
        >
          <span aria-hidden="true">▤</span>{t.navTodos}
        </button>
        <button type="button" className="header-nav-item" onClick={onScrollToCalendar}>
          <span aria-hidden="true">▦</span>{t.navCalendar}
        </button>
      </nav>

      <div className="header-user">
        <span className="header-avatar" aria-hidden="true">{userName?.charAt(0) || "?"}</span>
        <span className="header-user-name">{userName}</span>
        <button
          type="button"
          className="hamburger-button"
          onClick={toggleSidebar}
          aria-label={t.menuProfile}
          title={t.menuProfile}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
