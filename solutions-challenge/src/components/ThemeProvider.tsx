import React, { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';
import { theme } from '../theme/theme';

type ThemeMode = 'light' | 'dark' | 'colorblind';
type ThemeType = 
  | keyof typeof theme.colors.light
  | keyof typeof theme.colors.colorblind
  | keyof typeof theme.colors.states;

interface ThemeContextType {
  mode: ThemeMode;
  colorblind: boolean;
  toggleMode: () => void;
  toggleColorblind: () => void;
  getClasses: (type: ThemeType) => string;
  getCombinedClasses: (type: ThemeType, additionalClasses: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}; 