import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = "dont-forget-theme";
const lightColors = { background: "#f5f5f5", surface: "#ffffff", surfaceAlt: "#f0f0f0", text: "#202124", muted: "#70757a", primary: "#2B6CB0", primaryStrong: "#245B95", primarySoft: "#E6F0FA", border: "#dadce0", input: "#f8f9fa", danger: "#bd6259", dangerSoft: "#f9ece9", success: "#2B6CB0", shadow: "#202124" };
const darkColors = { background: "#111111", surface: "#202020", surfaceAlt: "#292929", text: "#f5f5f5", muted: "#a7a7a7", primary: "#2B6CB0", primaryStrong: "#2B6CB0", primarySoft: "#1E3550", border: "#303030", input: "#181818", danger: "#e49a91", dangerSoft: "#442e2a", success: "#2B6CB0", shadow: "#000000" };

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState("system");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (active && ["system", "light", "dark"].includes(saved)) setThemeModeState(saved);
    }).catch(() => {}).finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  const setThemeMode = async (mode) => {
    if (!["system", "light", "dark"].includes(mode)) return;
    setThemeModeState(mode);
    try { await AsyncStorage.setItem(THEME_STORAGE_KEY, mode); } catch (_) { /* Keep the in-memory preference for this session. */ }
  };
  const resolvedTheme = themeMode === "system" ? (systemScheme === "dark" ? "dark" : "light") : themeMode;
  useEffect(() => { Appearance.setColorScheme(themeMode === "system" ? "auto" : themeMode); }, [themeMode]);
  const value = useMemo(() => ({ themeMode, setThemeMode, resolvedTheme, colors: resolvedTheme === "dark" ? darkColors : lightColors, loaded }), [themeMode, resolvedTheme, loaded]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
