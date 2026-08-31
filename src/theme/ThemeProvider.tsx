import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { Appearance } from 'react-native';
import { lightTheme, darkTheme, AppTheme, palette } from './colors';
import { type, fontFamily } from './typography';
import { spacing, radius, elevation, touchTarget, tabBarHeight } from './spacing';
import { layoutSafety } from './layout';
import { getSettings, updateSettings } from '../storage/settingsRepository';
import { ThemeModePreference } from '../types/settings';

type ThemeMode = ThemeModePreference;

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  type: typeof type;
  spacing: typeof spacing;
  radius: typeof radius;
  elevation: typeof elevation;
  touchTarget: typeof touchTarget;
  tabBarHeight: number;
  layoutSafety: typeof layoutSafety;
  palette: typeof palette;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Screens follow the mockups: Dashboard is dark/navy, most other
// screens (Course Entry, Result, Planner) are light/cream. That's a
// per-screen visual choice, NOT the same as system dark/light mode
// preference — so we keep two concepts separate:
//   - `mode` = user's app-wide dark/light preference (Settings screen)
//   - individual screens can still opt into a fixed navy hero section
//     regardless of mode, matching the reference design.
//
// Both `mode` and `hapticsEnabled` are loaded from and persisted to
// AsyncStorage (Step 26) — previously `mode` was in-memory only and
// would silently reset to "system" on every app restart.

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = Appearance.getColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then((settings) => {
      setModeState(settings.themeMode);
      setHapticsEnabledState(settings.hapticsEnabled);
      setLoaded(true);
    });
  }, []);

  const resolvedIsDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const theme = resolvedIsDark ? darkTheme : lightTheme;

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    updateSettings({ themeMode: next });
  }, []);

  const setHapticsEnabled = useCallback((enabled: boolean) => {
    setHapticsEnabledState(enabled);
    updateSettings({ hapticsEnabled: enabled });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      isDark: resolvedIsDark,
      setMode,
      hapticsEnabled,
      setHapticsEnabled,
      type,
      spacing,
      radius,
      elevation,
      touchTarget,
      tabBarHeight,
      layoutSafety,
      palette,
    }),
    [theme, mode, resolvedIsDark, setMode, hapticsEnabled, setHapticsEnabled]
  );

  // Avoid a flash of default (system) theme before persisted settings
  // load — render nothing for the one frame this takes.
  if (!loaded) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}

export { fontFamily };
