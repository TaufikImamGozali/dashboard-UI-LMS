import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AccentColor } from '../types/settings';

export type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';
const STORAGE_KEY = 'coursue_theme';
const ACCENT_KEY = 'coursue_accent';

interface ThemeContextValue {
  theme: ResolvedTheme;
  themePreference: Theme;
  resolvedTheme: ResolvedTheme;
  accent: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: AccentColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const systemTheme = (): ResolvedTheme => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [themePreference, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  });
  const [systemPreference, setSystemPreference] = useState<ResolvedTheme>(systemTheme);
  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem(ACCENT_KEY);
    return saved === 'blue' || saved === 'emerald' || saved === 'rose' ? saved : 'purple';
  });
  const resolvedTheme = themePreference === 'system' ? systemPreference : themePreference;

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = (event: MediaQueryListEvent) => setSystemPreference(event.matches ? 'dark' : 'light');
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    localStorage.setItem(STORAGE_KEY, themePreference);
  }, [resolvedTheme, themePreference]);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    localStorage.setItem(ACCENT_KEY, accent);
  }, [accent]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const setAccent = useCallback((next: AccentColor) => setAccentState(next), []);
  const toggleTheme = useCallback(() => setThemeState(resolvedTheme === 'dark' ? 'light' : 'dark'), [resolvedTheme]);
  const value = useMemo(() => ({ theme: resolvedTheme, themePreference, resolvedTheme, accent, setTheme, setAccent, toggleTheme }), [accent, resolvedTheme, setAccent, setTheme, themePreference, toggleTheme]);
  return React.createElement(ThemeContext.Provider, { value }, children);
};

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}
