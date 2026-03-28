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

// Graphite-first dark palette with restrained glass and serif-led reading surfaces.
const darkColors: ThemeColors = {
  background: '#090A0D',
  cardBackground: '#14161B',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  primaryText: '#E6E1DA',
  secondaryText: '#AAA39A',
  accentGreen: '#B7A58A',
  accentPrimary: '#B7A58A',
  accentSecondary: '#D6CEC3',
  accentTertiary: '#7C766F',
  tabActive: '#F1ECE4',
  tabInactive: '#7C766F',
  error: '#D17A6C',
  success: '#7C9A72',
  warning: '#B89857',
  overlay: 'rgba(4, 5, 8, 0.58)',
  bibleBackground: '#101114',
  bibleSurface: '#15171B',
  bibleElevatedSurface: '#1B1E24',
  bibleDivider: 'rgba(255, 255, 255, 0.08)',
  biblePrimaryText: '#E6E1DA',
  bibleSecondaryText: '#AAA39A',
  bibleAccent: '#B7A58A',
  bibleControlBackground: '#F1ECE4',
  glassBackground: 'rgba(22, 24, 30, 0.72)',
};

// Mineral light palette with the same restraint as dark mode.
const lightColors: ThemeColors = {
  background: '#F2F0EC',
  cardBackground: '#FBFAF8',
  cardBorder: 'rgba(22, 24, 30, 0.08)',
  primaryText: '#1B1D22',
  secondaryText: '#61646B',
  accentGreen: '#8F7A5E',
  accentPrimary: '#8F7A5E',
  accentSecondary: '#444A53',
  accentTertiary: '#8C8F96',
  tabActive: '#111317',
  tabInactive: '#8C8F96',
  error: '#A85A4D',
  success: '#55724F',
  warning: '#8E734A',
  overlay: 'rgba(10, 12, 18, 0.16)',
  bibleBackground: '#F6F4F0',
  bibleSurface: '#FBFAF8',
  bibleElevatedSurface: '#ECE9E4',
  bibleDivider: 'rgba(22, 24, 30, 0.08)',
  biblePrimaryText: '#1B1D22',
  bibleSecondaryText: '#61646B',
  bibleAccent: '#8F7A5E',
  bibleControlBackground: '#111317',
  glassBackground: 'rgba(255, 255, 255, 0.74)',
};

// Warm low-light palette for extended reading in dim environments.
const lowLightColors: ThemeColors = {
  background: '#14110D',
  cardBackground: '#1A1612',
  cardBorder: 'rgba(255, 244, 229, 0.08)',
  primaryText: '#D6CBBB',
  secondaryText: '#9E9387',
  accentGreen: '#A58D6B',
  accentPrimary: '#A58D6B',
  accentSecondary: '#C8B89B',
  accentTertiary: '#746B61',
  tabActive: '#ECE0CF',
  tabInactive: '#746B61',
  error: '#C57A6B',
  success: '#7F9273',
  warning: '#B48F57',
  overlay: 'rgba(6, 4, 2, 0.52)',
  bibleBackground: '#16120E',
  bibleSurface: '#1A1612',
  bibleElevatedSurface: '#211C17',
  bibleDivider: 'rgba(255, 244, 229, 0.08)',
  biblePrimaryText: '#D6CBBB',
  bibleSecondaryText: '#9E9387',
  bibleAccent: '#A58D6B',
  bibleControlBackground: '#ECE0CF',
  glassBackground: 'rgba(29, 24, 18, 0.78)',
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
