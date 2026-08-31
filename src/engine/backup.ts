import { STORAGE_KEYS, CURRENT_SCHEMA_VERSION } from '../storage/keys';
import { readJSON, writeJSON } from '../storage/storageClient';

// GradeTrack Pro — Backup / Restore
//
// Since there's no login and no cloud backend, "Data backup" means a
// local export: every AsyncStorage key this app owns, serialized into
// one JSON file the student can share (Google Drive, email, WhatsApp
// to themselves, etc.) via the OS share sheet, and later restore from.
//
// This is a genuine file, not a placeholder — Step 26's Settings
// screen wires this to expo-sharing / expo-document-picker for a real
// export/import flow.

export interface BackupPayload {
  appName: 'GradeTrack Pro';
  schemaVersion: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

export async function buildBackupPayload(): Promise<BackupPayload> {
  const data: Record<string, unknown> = {};
  for (const key of Object.values(STORAGE_KEYS)) {
    data[key] = await readJSON(key, null);
  }
  return {
    appName: 'GradeTrack Pro',
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export interface RestoreResult {
  ok: boolean;
  error?: string;
}

export async function restoreFromBackupPayload(raw: string): Promise<RestoreResult> {
  let parsed: BackupPayload;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'This file is not a valid GradeTrack Pro backup.' };
  }

  if (parsed.appName !== 'GradeTrack Pro' || !parsed.data || typeof parsed.data !== 'object') {
    return { ok: false, error: 'This file is not a valid GradeTrack Pro backup.' };
  }

  try {
    for (const key of Object.values(STORAGE_KEYS)) {
      if (key in parsed.data && parsed.data[key] !== null) {
        await writeJSON(key, parsed.data[key]);
      }
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Something went wrong while restoring your data.' };
  }
}
