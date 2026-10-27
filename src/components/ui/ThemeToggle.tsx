import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`} aria-pressed={isDark} className="flex h-touch w-touch items-center justify-center rounded-full border border-outline bg-surface text-content-secondary shadow-2xs transition-colors hover:bg-surface-muted hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};
