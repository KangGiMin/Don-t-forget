import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = "dont-forget-theme";
const lightColors = { background: "#f6f7f3", surface: "#ffffff", surfaceAlt: "#eef2ed", text: "#26352d", muted: "#78847c", primary: "#2f6b4f", primaryStrong: "#24543e", primarySoft: "#e8f1eb", border: "#dfe7df", input: "#f7f9f6", danger: "#bd6259", dangerSoft: "#f9ece9", success: "#2f6b4f", shadow: "#21392b" };
const darkColors = { background: "#211d1a", surface: "#2c2722", surfaceAlt: "#352f29", text: "#f4eee7", muted: "#b6a99d", primary: "#2f6b4f", primaryStrong: "#9ecfab", primarySoft: "#293a30", border: "#423a32", input: "#25211d", danger: "#e49a91", dangerSoft: "#442e2a", success: "#9ecfab", shadow: "#000000" };

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
  useEffect(() => { Appearance.setColorScheme(themeMode === "system" ? null : themeMode); }, [themeMode]);
  const value = useMemo(() => ({ themeMode, setThemeMode, resolvedTheme, colors: resolvedTheme === "dark" ? darkColors : lightColors, loaded }), [themeMode, resolvedTheme, loaded]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
