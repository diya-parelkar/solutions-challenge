import { useState, useEffect } from 'react';
import { theme, getThemeClasses, combineClasses, ThemeType } from '../theme/theme';

type ThemeMode = 'light' | 'dark' | 'colorblind';

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [colorblind, setColorblind] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    const savedColorblind = localStorage.getItem('colorblind-mode') === 'true';
    
    if (savedMode) {
      setMode(savedMode);
      if (savedMode === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
    if (savedColorblind) setColorblind(true);
  }, []);

  // Update localStorage and HTML class when theme changes
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('colorblind-mode', colorblind.toString());
    
    // Update HTML class for dark mode
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode, colorblind]);

  // Toggle between light and dark mode
  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Toggle colorblind mode
  const toggleColorblind = () => {
    setColorblind(prev => !prev);
    setMode(prev => prev === 'colorblind' ? 'light' : 'colorblind');
  };

  // Get current theme classes
  const getClasses = (type: ThemeType) => {
    const currentMode = colorblind ? 'colorblind' : mode;
    const classes = getThemeClasses(currentMode, type);
    return typeof classes === 'string' ? classes : '';
  };

  // Combine theme classes with additional classes
  const getCombinedClasses = (type: ThemeType, additionalClasses: string) => {
    return combineClasses(getClasses(type), additionalClasses);
  };

  return {
    mode,
    colorblind,
    toggleMode,
    toggleColorblind,
    getClasses,
    getCombinedClasses,
  };
}; 