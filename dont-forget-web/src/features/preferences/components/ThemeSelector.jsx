import { useEffect, useRef, useState } from "react";
import { THEME_OPTIONS } from "@/shared/constants/theme";
import "./ThemeSelector.css";

export default function ThemeSelector() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const shouldUseDark = theme === "dark" || (theme === "system" && mediaQuery.matches);
      root.classList.toggle("dark", shouldUseDark);
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    const handleSystemThemeChange = () => {
      if (theme === "system") applyTheme();
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (nextTheme) => {
    setTheme(nextTheme);
    setIsOpen(false);
  };
  const selectedTheme = THEME_OPTIONS.find((option) => option.value === theme) || THEME_OPTIONS[2];

  return (
    <div className="theme-selector-container" ref={dropdownRef}>
      <button type="button" className="theme-main-btn" onClick={() => setIsOpen((open) => !open)}>
        {selectedTheme.buttonLabel}
      </button>
      {isOpen && (
        <ul className="theme-dropdown-menu">
          {THEME_OPTIONS.map((option) => (
            <li key={option.value} onClick={() => handleThemeChange(option.value)}>
              <span>{option.menuLabel}</span>
              {theme === option.value && <span className="check-mark">✔</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
