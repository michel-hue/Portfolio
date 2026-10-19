import { useCallback, useEffect, useState } from 'react';
import type { ThemeName } from '../styles/theme';

const STORAGE_KEY = 'portfolio-theme';

function getInitialTheme(): ThemeName {
  // 1. Vérifier le localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }

  // 2. Vérifier la préférence système
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  // 3. Défaut : dark mode
  return 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    // Appliquer la classe sur le body
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);

    // Sauvegarder dans localStorage
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setDark = useCallback(() => setTheme('dark'), []);
  const setLight = useCallback(() => setTheme('light'), []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setDark,
    setLight,
  };
}
