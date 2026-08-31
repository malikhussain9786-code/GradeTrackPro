import { STORAGE_KEYS } from './keys';
import { readJSON, writeJSON } from './storageClient';
import { HistoryEntry } from '../types';

// GradeTrack Pro — History Repository
// Newest entries first, matching the History screen's expected order.

async function getAll(): Promise<HistoryEntry[]> {
  return readJSON<HistoryEntry[]>(STORAGE_KEYS.HISTORY, []);
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const entries = await getAll();
  return [...entries].sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
}

export async function addHistoryEntry(entry: HistoryEntry): Promise<boolean> {
  const entries = await getAll();
  entries.push(entry);
  return writeJSON(STORAGE_KEYS.HISTORY, entries);
}

export async function updateHistoryEntry(entry: HistoryEntry): Promise<boolean> {
  const entries = await getAll();
  const idx = entries.findIndex((e) => e.id === entry.id);
  if (idx === -1) return false;
  entries[idx] = entry;
  return writeJSON(STORAGE_KEYS.HISTORY, entries);
}

export async function deleteHistoryEntry(id: string): Promise<boolean> {
  const entries = await getAll();
  const next = entries.filter((e) => e.id !== id);
  return writeJSON(STORAGE_KEYS.HISTORY, next);
}

export async function clearHistory(): Promise<boolean> {
  return writeJSON(STORAGE_KEYS.HISTORY, []);
}

export async function deleteHistoryEntries(ids: string[]): Promise<boolean> {
  const entries = await getAll();
  const idSet = new Set(ids);
  const next = entries.filter((e) => !idSet.has(e.id));
  return writeJSON(STORAGE_KEYS.HISTORY, next);
}

// GradeTrack Pro — Payload-linked lookups
// Semester Management (Step 18) needs to keep a saved Semester/CgpaRecord
// and its corresponding History entry in sync: editing a semester should
// UPDATE its history entry (not create a duplicate), and deleting a
// semester should remove its history entry too.

export async function findHistoryEntryByPayloadId(payloadId: string): Promise<HistoryEntry | undefined> {
  const entries = await getAll();
  return entries.find((e) => (e.payload as { id?: string } | undefined)?.id === payloadId);
}

export async function deleteHistoryEntriesByPayloadId(payloadId: string): Promise<boolean> {
  const entries = await getAll();
  const next = entries.filter((e) => (e.payload as { id?: string } | undefined)?.id !== payloadId);
  return writeJSON(STORAGE_KEYS.HISTORY, next);
}
