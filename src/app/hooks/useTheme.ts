import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Берём сохранённую тему из localStorage, иначе light
    return (localStorage.getItem('theme') as Theme) ?? 'light';
  });

  useEffect(() => {
    // Ставим data-theme на <html> — CSS переменные переключаются автоматически
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
