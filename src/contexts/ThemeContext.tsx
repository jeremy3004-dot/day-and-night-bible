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
  glassBackground: string;
}

// Warm near-black dark palette for a reverential, print-editorial feel.
const darkColors: ThemeColors = {
  background: '#0C0B09',
  cardBackground: '#161410',
  cardBorder: '#2A2620',
  primaryText: '#F0EBE0',
  secondaryText: '#9E9589',
  accentGreen: '#C0392B',
  accentPrimary: '#C0392B',
  accentSecondary: '#D9D3C8',
  accentTertiary: '#7A7269',
  tabActive: '#F0EBE0',
  tabInactive: '#6B635A',
  error: '#E07060',
  success: '#7A9E6E',
  warning: '#C9A055',
  overlay: 'rgba(10, 8, 6, 0.72)',
  bibleBackground: '#0C0B09',
  bibleSurface: '#131210',
  bibleElevatedSurface: '#1A1815',
  bibleDivider: '#2A2620',
  biblePrimaryText: '#F0EBE0',
  bibleSecondaryText: '#9E9589',
  bibleAccent: '#C0392B',
  bibleControlBackground: '#F0EBE0',
  glassBackground: 'rgba(12, 11, 9, 0.85)',
};

// Warm cream light palette.
const lightColors: ThemeColors = {
  background: '#F5F0E8',
  cardBackground: '#FDFAF5',
  cardBorder: '#DDD7CC',
  primaryText: '#1C1814',
  secondaryText: '#6B5F52',
  accentGreen: '#8B2020',
  accentPrimary: '#8B2020',
  accentSecondary: '#3D3530',
  accentTertiary: '#9A8E82',
  tabActive: '#1C1814',
  tabInactive: '#9A8E82',
  error: '#B5352A',
  success: '#4E7A44',
  warning: '#8B6820',
  overlay: 'rgba(0, 0, 0, 0.20)',
  bibleBackground: '#F5F0E8',
  bibleSurface: '#FDFAF5',
  bibleElevatedSurface: '#EDE8DE',
  bibleDivider: '#DDD7CC',
  biblePrimaryText: '#1C1814',
  bibleSecondaryText: '#6B5F52',
  bibleAccent: '#8B2020',
  bibleControlBackground: '#1C1814',
  glassBackground: 'rgba(245, 240, 232, 0.88)',
};

// Sepia / low-light palette for extended reading in dim environments.
const lowLightColors: ThemeColors = {
  background: '#1A1408',
  cardBackground: '#221B0B',
  cardBorder: '#352A10',
  primaryText: '#D4BA8A',
  secondaryText: '#8A7250',
  accentGreen: '#A0522D',
  accentPrimary: '#A0522D',
  accentSecondary: '#C4A87A',
  accentTertiary: '#6B5530',
  tabActive: '#D4BA8A',
  tabInactive: '#6B5530',
  error: '#C87060',
  success: '#7A8E5A',
  warning: '#B8901A',
  overlay: 'rgba(10, 6, 0, 0.72)',
  bibleBackground: '#1A1408',
  bibleSurface: '#1E1809',
  bibleElevatedSurface: '#24200E',
  bibleDivider: '#352A10',
  biblePrimaryText: '#D4BA8A',
  bibleSecondaryText: '#8A7250',
  bibleAccent: '#A0522D',
  bibleControlBackground: '#D4BA8A',
  glassBackground: 'rgba(26, 20, 8, 0.88)',
};

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  isLowLight: boolean;
  themeMode: 'dark' | 'light' | 'low-light';
  setTheme: (mode: 'dark' | 'light' | 'low-light') => void;
  toggleTheme: () => void; // backward compat -- toggles dark<->light
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const preferences = useAuthStore((state) => state.preferences);
  const setPreferences = useAuthStore((state) => state.setPreferences);

  const themeMode = useMemo((): 'dark' | 'light' | 'low-light' => {
    if (
      preferences.theme === 'dark' ||
      preferences.theme === 'light' ||
      preferences.theme === 'low-light'
    ) {
      return preferences.theme;
    }
    // Fallback to system preference
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  }, [preferences.theme, systemColorScheme]);

  const isDark = themeMode !== 'light';
  const isLowLight = themeMode === 'low-light';

  const colors = useMemo(
    () =>
      themeMode === 'dark' ? darkColors : themeMode === 'light' ? lightColors : lowLightColors,
    [themeMode]
  );

  const setTheme = useCallback(
    (mode: 'dark' | 'light' | 'low-light') => {
      setPreferences({ theme: mode });
    },
    [setPreferences]
  );

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  const value = useMemo(
    () => ({
      colors,
      isDark,
      isLowLight,
      themeMode,
      setTheme,
      toggleTheme,
    }),
    [colors, isDark, isLowLight, themeMode, setTheme, toggleTheme]
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
export { darkColors, lightColors, lowLightColors };
