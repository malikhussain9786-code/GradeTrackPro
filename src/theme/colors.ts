// GradeTrack Pro — Color System
// Pulled directly from the reference mockups: navy dashboard theme,
// cream/light theme for secondary screens, gold as the single accent.

export const palette = {
  gold: {
    50: '#FBF3E1',
    100: '#F5E2B8',
    300: '#E8C05F',
    500: '#D4A017', // primary accent — buttons, active states, highlights
    600: '#B8850F',
    700: '#8F6608',
  },
  navy: {
    50: '#E9ECF5',
    100: '#C7CEE3',
    300: '#5A6C99',
    500: '#16203D', // card surfaces on dark theme
    700: '#0F1730', // deep background
    900: '#0A1128', // darkest — dashboard background
  },
  cream: {
    50: '#FFFFFF',
    100: '#FDFBF6',
    200: '#FAF6EF', // light theme background
    300: '#F1EAD9',
  },
  ink: {
    // text on light backgrounds
    900: '#141B2E',
    700: '#3A4256',
    500: '#6B7280',
    300: '#A6ACBB',
  },
  cloud: {
    // text on dark backgrounds
    50: '#F5F0E6',
    300: '#C9CEDC',
    500: '#8A93A8',
  },
  success: {
    500: '#3FA96A',
    100: '#DFF3E8',
  },
  warning: {
    500: '#E0A62E',
    100: '#FBF0DA',
  },
  error: {
    500: '#D9534F',
    100: '#FBE4E3',
  },
  gradeTier: {
    // grade-band color coding used across result screens
    excellent: '#3FA96A', // A range
    good: '#6FAF4E',      // B+ range
    average: '#D4A017',   // C range
    weak: '#E0873E',      // D range
    fail: '#D9534F',      // F
  },
} as const;

export interface AppTheme {
  mode: 'light' | 'dark';
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  navyText: string;
  tabActive: string;
  tabInactive: string;
  cardShadow: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
}

export const lightTheme: AppTheme = {
  mode: 'light',
  background: palette.cream[200],
  surface: palette.cream[50],
  surfaceAlt: palette.cream[100],
  border: palette.cream[300],
  textPrimary: palette.ink[900],
  textSecondary: palette.ink[500],
  textMuted: palette.ink[300],
  accent: palette.gold[500],
  accentSoft: palette.gold[100],
  navyText: palette.navy[900],
  tabActive: palette.navy[900],
  tabInactive: palette.ink[300],
  cardShadow: 'rgba(20, 27, 46, 0.08)',
  success: palette.success[500],
  successSoft: palette.success[100],
  warning: palette.warning[500],
  warningSoft: palette.warning[100],
  error: palette.error[500],
  errorSoft: palette.error[100],
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  background: palette.navy[900],
  surface: palette.navy[500],
  surfaceAlt: palette.navy[700],
  border: 'rgba(255,255,255,0.08)',
  textPrimary: palette.cloud[50],
  textSecondary: palette.cloud[300],
  textMuted: palette.cloud[500],
  accent: palette.gold[500],
  accentSoft: 'rgba(212, 160, 23, 0.16)',
  navyText: palette.cloud[50],
  tabActive: palette.gold[500],
  tabInactive: palette.cloud[500],
  cardShadow: 'rgba(0, 0, 0, 0.35)',
  success: palette.success[500],
  successSoft: 'rgba(63, 169, 106, 0.16)',
  warning: palette.warning[500],
  warningSoft: 'rgba(224, 166, 46, 0.16)',
  error: palette.error[500],
  errorSoft: 'rgba(217, 83, 79, 0.16)',
};

