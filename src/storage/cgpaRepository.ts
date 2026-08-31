import { STORAGE_KEYS } from './keys';
import { readJSON, writeJSON } from './storageClient';
import { CgpaRecord, UniversityId } from '../types';

// GradeTrack Pro — CGPA Repository

type CgpaStore = Partial<Record<UniversityId, CgpaRecord[]>>;

async function getStore(): Promise<CgpaStore> {
  return readJSON<CgpaStore>(STORAGE_KEYS.CGPA_RECORDS, {});
}

async function setStore(store: CgpaStore): Promise<boolean> {
  return writeJSON(STORAGE_KEYS.CGPA_RECORDS, store);
}

export async function getCgpaRecords(universityId: UniversityId): Promise<CgpaRecord[]> {
  const store = await getStore();
  return store[universityId] ?? [];
}

export async function saveCgpaRecord(universityId: UniversityId, record: CgpaRecord): Promise<boolean> {
  const store = await getStore();
  const list = store[universityId] ?? [];
  const idx = list.findIndex((r) => r.id === record.id);
  if (idx >= 0) {
    list[idx] = record;
  } else {
    list.push(record);
  }
  store[universityId] = list;
  return setStore(store);
}

export async function deleteCgpaRecord(universityId: UniversityId, recordId: string): Promise<boolean> {
  const store = await getStore();
  const list = store[universityId] ?? [];
  store[universityId] = list.filter((r) => r.id !== recordId);
  return setStore(store);
}
