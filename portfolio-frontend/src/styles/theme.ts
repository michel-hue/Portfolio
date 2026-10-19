export interface ThemeColors {
  bg: string;
  bgCard: string;
  bgCardHover: string;
  bgNavbar: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  border: string;
  shadow: string;
  inputBg: string;
  inputBorder: string;
  error: string;
  success: string;
}

export interface Theme {
  colors: ThemeColors;
  name: 'dark' | 'light';
}

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    bg: '#07070b',
    bgCard: '#121218',
    bgCardHover: '#15151c',
    bgNavbar: 'rgba(7, 7, 11, 0.85)',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    accent: '#ea284e',
    accentHover: '#f43f5e',
    border: 'rgba(255, 255, 255, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.4)',
    inputBg: '#141414',
    inputBorder: '#262626',
    error: '#ef4444',
    success: '#22c55e',
  },
};

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    bg: '#fafafa',
    bgCard: '#ffffff',
    bgCardHover: '#f5f5f5',
    bgNavbar: 'rgba(250, 250, 250, 0.85)',
    text: '#1a1a1a',
    textSecondary: '#555555',
    textMuted: '#999999',
    accent: '#ea284e',
    accentHover: '#c81e40',
    border: '#e5e5e5',
    shadow: 'rgba(0, 0, 0, 0.08)',
    inputBg: '#f5f5f5',
    inputBorder: '#d4d4d4',
    error: '#dc2626',
    success: '#16a34a',
  },
};

export type ThemeName = 'dark' | 'light';

export function getTheme(name: ThemeName): Theme {
  return name === 'dark' ? darkTheme : lightTheme;
}
