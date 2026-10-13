import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'imagereco-theme';
const VALID_THEMES = ['light', 'dark'];

/**
 * Reads the saved theme preference, falling back to the system preference.
 */
function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (VALID_THEMES.includes(saved)) return saved;
  } catch {
    // localStorage may be unavailable (private mode) - fall through
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

/**
 * Theme state hook. Applies the theme as a class on <html>
 * ("light" / "dark") and persists the choice to localStorage.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore persistence failures
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
