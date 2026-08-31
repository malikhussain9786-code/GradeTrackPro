import AsyncStorage from '@react-native-async-storage/async-storage';

// GradeTrack Pro — Storage Client
//
// Thin, typed wrapper around AsyncStorage. Every read is wrapped in
// try/catch so a single corrupted JSON blob can never crash the app
// (Security requirement: "Protection against corrupted data"). On a
// parse failure we log, return the fallback, and leave the bad key
// alone rather than silently deleting the user's data.

export class StorageError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storage] Failed to read/parse key "${key}", using fallback.`, err);
    return fallback;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[storage] Failed to write key "${key}".`, err);
    return false;
  }
}

export async function removeKey(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`[storage] Failed to remove key "${key}".`, err);
    return false;
  }
}

export async function clearKeys(keys: string[]): Promise<boolean> {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (err) {
    console.warn('[storage] Failed to clear keys.', err);
    return false;
  }
}
