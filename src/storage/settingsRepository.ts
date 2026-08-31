import { STORAGE_KEYS } from './keys';
import { readJSON, writeJSON } from './storageClient';
import { AppSettings, DEFAULT_SETTINGS } from '../types';

// GradeTrack Pro — Settings Repository

export async function getSettings(): Promise<AppSettings> {
  return readJSON<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: AppSettings): Promise<boolean> {
  return writeJSON(STORAGE_KEYS.SETTINGS, settings);
}

export async function updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await saveSettings(next);
  return next;
}
