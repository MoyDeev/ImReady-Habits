// Minimal design tokens. No UI library; just colors + spacing, light/dark aware.

export type Theme = {
  dark: boolean;
  bg: string;
  card: string;
  cardAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentText: string;
  danger: string;
  /** Heatmap intensity ramp, index 0 = empty cell. */
  heat: string[];
};

const darkTheme: Theme = {
  dark: true,
  bg: '#0E0E12',
  card: '#17171E',
  cardAlt: '#1F1F28',
  border: '#2A2A35',
  text: '#F2F2F5',
  textMuted: '#A0A0AD',
  textFaint: '#63636E',
  accent: '#7C5CFF',
  accentText: '#FFFFFF',
  danger: '#FF5C7C',
  heat: ['#1F1F28', '#3A2E6E', '#5A45B0', '#7C5CFF', '#A88EFF'],
};

const lightTheme: Theme = {
  dark: false,
  bg: '#F6F6F9',
  card: '#FFFFFF',
  cardAlt: '#EFEFF4',
  border: '#E2E2EA',
  text: '#16161C',
  textMuted: '#5C5C6A',
  textFaint: '#9A9AA8',
  accent: '#7C5CFF',
  accentText: '#FFFFFF',
  danger: '#E0335A',
  heat: ['#EAEAF0', '#D8CCFF', '#B6A0FF', '#8C6BFF', '#6A45E0'],
};

export function getTheme(scheme: string | null | undefined): Theme {
  return scheme === 'light' ? lightTheme : darkTheme;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

/** Palette offered when creating a habit. */
export const HABIT_COLORS = [
  '#7C5CFF',
  '#4CC9F0',
  '#43E6A0',
  '#FFD166',
  '#FF8C42',
  '#FF5C7C',
  '#C77DFF',
  '#8ECAE6',
];
