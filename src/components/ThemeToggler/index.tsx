import { useCallback, useEffect, useState } from 'react';
import { Theme } from '../../types';
import styles from './ThemeToggler.module.css';

// https://codepen.io/kabadesu/pen/MWwyVOw

function getInitialTheme(){
  const localTheme = localStorage.getItem(window.location.host + '-selected-theme');
  if (['light', 'dark'].includes(localTheme)) return localTheme as Theme;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function useThemeState() {
  const [theme, setTheme] = useState<Theme | null>(null);

  const toggleTheme = useCallback(
    () =>
      setTheme(theme => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(window.location.host + '-selected-theme', newTheme);
        return newTheme;
      }),
    [setTheme],
  );

  useEffect(() => {
    if (typeof document !== 'object') return;
    if (theme === null) return setTheme(getInitialTheme());
    document.querySelector('body').dataset.theme = theme;
  }, [setTheme, theme]);

  return { theme, toggleTheme };
}

export default function ThemeToggler() {
  const { theme, toggleTheme } = useThemeState();
  return (
    <div className={styles.wrapper}>
      <div className={styles.switch}>
        <input
          type="checkbox"
          className={styles.switch__input}
          id="theme-toggler"
          onChange={toggleTheme}
          checked={theme === 'light'}
        />
        <label className={styles.switch__label} htmlFor="theme-toggler" aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}>
          <span className={styles.switch__indicator}></span>
          <span className={styles.switch__decoration}></span>
        </label>
      </div>
    </div>
  );
}
