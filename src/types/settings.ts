// GradeTrack Pro — Settings Model

export type ThemeModePreference = 'light' | 'dark' | 'system';

export interface AppSettings {
  themeMode: ThemeModePreference;
  notificationsEnabled: boolean;
  hapticsEnabled: boolean;
  displayName?: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'system',
  notificationsEnabled: true,
  hapticsEnabled: true,
  displayName: '',
};
