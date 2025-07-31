import { useState, useEffect } from 'react';
import { Theme } from '../types';
import { saveTheme, loadTheme } from '../utils/storage';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = loadTheme();
    return (saved === 'dark' ? 'dark' : 'light') as Theme;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};