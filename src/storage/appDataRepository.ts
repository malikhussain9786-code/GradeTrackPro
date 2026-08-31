import { STORAGE_KEYS, CURRENT_SCHEMA_VERSION } from './keys';
import { clearKeys, readJSON, writeJSON } from './storageClient';
import { UniversityId } from '../types';

// GradeTrack Pro — Data Reset & Misc Settings
// Backs the "Clear all data" option in Settings (Step 26).
// Wipes every key this app has ever written, then re-seeds the
// schema version so future migrations behave correctly on next launch.

export async function clearAllAppData(): Promise<boolean> {
  const allKeys = Object.values(STORAGE_KEYS);
  const ok = await clearKeys(allKeys);
  if (ok) {
    await writeJSON(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
  }
  return ok;
}

export async function getSelectedUniversity(): Promise<UniversityId | null> {
  return readJSON<UniversityId | null>(STORAGE_KEYS.SELECTED_UNIVERSITY, null);
}

export async function setSelectedUniversity(id: UniversityId | null): Promise<boolean> {
  return writeJSON(STORAGE_KEYS.SELECTED_UNIVERSITY, id);
}

export async function ensureSchemaInitialized(): Promise<void> {
  const version = await readJSON<number>(STORAGE_KEYS.SCHEMA_VERSION, 0);
  if (version !== CURRENT_SCHEMA_VERSION) {
    // Future steps: run migration logic here based on `version`.
    await writeJSON(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
  }
}
