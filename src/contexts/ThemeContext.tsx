import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '../stores/authStore';

export interface ThemeColors {
  background: string;
  cardBackground: string;
  cardBorder: string;
  primaryText: string;
  secondaryText: string;
  accentGreen: string; // Legacy alias for backward compatibility
  accentPrimary: string; // Primary accent
  accentSecondary: string; // Secondary accent
  accentTertiary: string; // Tertiary accent
  tabActive: string;
  tabInactive: string;
  error: string;
  success: string;
  warning: string;
  overlay: string;
  bibleBackground: string;
  bibleSurface: string;
  bibleElevatedSurface: string;
  bibleDivider: string;
  biblePrimaryText: string;
  bibleSecondaryText: string;
  bibleAccent: string;
  bibleControlBackground: string;
}

// Global dark palette keeps the current brand accent but tightens the neutrals
// so the app feels more structured and less decorative.
const darkColors: ThemeColors = {
  background: '#0d1014',
  cardBackground: '#151a21',
  cardBorder: '#242a33',
  primaryText: '#f4f6f8',
  secondaryText: '#97a0aa',
  accentGreen: '#e35d5b', // Legacy alias for existing components
  accentPrimary: '#e35d5b',
  accentSecondary: '#d9dde2',
  accentTertiary: '#6e7782',
  tabActive: '#f4f6f8',
  tabInactive: '#717985',
  error: '#ff7b72',
  success: '#87c083',
  warning: '#c9a561',
  overlay: 'rgba(0, 0, 0, 0.6)',
  bibleBackground: '#0d1014',
  bibleSurface: '#151a21',
  bibleElevatedSurface: '#1c2129',
  bibleDivider: '#242a33',
  biblePrimaryText: '#f4f6f8',
  bibleSecondaryText: '#97a0aa',
  bibleAccent: '#e35d5b',
  bibleControlBackground: '#f4f6f8',
};

// Light mode keeps the same structured direction without parchment drift.
const lightColors: ThemeColors = {
  background: '#f5f7fa',
  cardBackground: '#ffffff',
  cardBorder: '#dde3ea',
  primaryText: '#151a21',
  secondaryText: '#67707b',
  accentGreen: '#d55b57',
  accentPrimary: '#d55b57',
  accentSecondary: '#48525d',
  accentTertiary: '#8a949f',
  tabActive: '#151a21',
  tabInactive: '#8b93a0',
  error: '#d55b57',
  success: '#5f8f5a',
  warning: '#ad8649',
  overlay: 'rgba(0, 0, 0, 0.24)',
  bibleBackground: '#f5f7fa',
  bibleSurface: '#ffffff',
  bibleElevatedSurface: '#eef2f7',
  bibleDivider: '#dde3ea',
  biblePrimaryText: '#151a21',
  bibleSecondaryText: '#67707b',
  bibleAccent: '#d55b57',
  bibleControlBackground: '#151a21',
};

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const preferences = useAuthStore((state) => state.preferences);
  const setPreferences = useAuthStore((state) => state.setPreferences);

  const isDark = useMemo(() => {
    // Use user preference if set, otherwise use system preference
    if (preferences.theme === 'dark') return true;
    if (preferences.theme === 'light') return false;
    return systemColorScheme === 'dark';
  }, [preferences.theme, systemColorScheme]);

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  const toggleTheme = useCallback(() => {
    setPreferences({ theme: isDark ? 'light' : 'dark' });
  }, [isDark, setPreferences]);

  const value = useMemo(
    () => ({
      colors,
      isDark,
      toggleTheme,
    }),
    [colors, isDark, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Export static colors for use outside of React context (e.g., in styles)
export { darkColors, lightColors };
