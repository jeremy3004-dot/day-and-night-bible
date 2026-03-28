// Static graphite palette used outside the React theme context.
export const colors = {
  // Background colors
  background: '#090A0D',
  cardBackground: '#14161B',
  cardBorder: 'rgba(255, 255, 255, 0.08)',

  // Text colors
  primaryText: '#E6E1DA',
  secondaryText: '#AAA39A',

  // Accent colors
  accent: '#B7A58A',
  accentGreen: '#B7A58A', // Legacy alias kept for backward compatibility
  accentPrimary: '#B7A58A',
  accentSecondary: '#D6CEC3',
  accentTertiary: '#7C766F',

  // Named aliases kept for backward compatibility
  tibetanMaroon: '#B7A58A',
  tibetanMaroonLight: '#C8B89B',
  saffronGold: '#D6CEC3',
  saffronGoldLight: '#A58D6B',
  skyBlue: '#7C766F',
  skyBlueLight: '#8C8F96',

  // Tab colors
  tabActive: '#F1ECE4',
  tabInactive: '#7C766F',

  // Additional utility colors
  error: '#D17A6C',
  success: '#7C9A72',
  warning: '#B89857',

  // Overlay
  overlay: 'rgba(4, 5, 8, 0.58)',

  // Premium Bible experience palette
  bibleBackground: '#101114',
  bibleSurface: '#15171B',
  bibleElevatedSurface: '#1B1E24',
  bibleDivider: 'rgba(255, 255, 255, 0.08)',
  biblePrimaryText: '#E6E1DA',
  bibleSecondaryText: '#AAA39A',
  bibleAccent: '#B7A58A',
  bibleControlBackground: '#F1ECE4',
} as const;

export type ColorKey = keyof typeof colors;
