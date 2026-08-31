import { STORAGE_KEYS } from './keys';
import { readJSON, writeJSON } from './storageClient';
import { Semester, UniversityId } from '../types';

// GradeTrack Pro — Semester Repository
//
// Semesters are stored as Record<UniversityId, Semester[]> so switching
// universities never mixes data, and deleting all data for one
// university (if ever needed) is a single key removal.

type SemesterStore = Partial<Record<UniversityId, Semester[]>>;

async function getStore(): Promise<SemesterStore> {
  return readJSON<SemesterStore>(STORAGE_KEYS.SEMESTERS, {});
}

async function setStore(store: SemesterStore): Promise<boolean> {
  return writeJSON(STORAGE_KEYS.SEMESTERS, store);
}

export async function getSemesters(universityId: UniversityId): Promise<Semester[]> {
  const store = await getStore();
  return store[universityId] ?? [];
}

export async function getAllSemesters(): Promise<SemesterStore> {
  return getStore();
}

export async function saveSemester(universityId: UniversityId, semester: Semester): Promise<boolean> {
  const store = await getStore();
  const list = store[universityId] ?? [];
  const idx = list.findIndex((s) => s.id === semester.id);
  if (idx >= 0) {
    list[idx] = semester;
  } else {
    list.push(semester);
  }
  store[universityId] = list;
  return setStore(store);
}

export async function deleteSemester(universityId: UniversityId, semesterId: string): Promise<boolean> {
  const store = await getStore();
  const list = store[universityId] ?? [];
  store[universityId] = list.filter((s) => s.id !== semesterId);
  return setStore(store);
}

export async function clearUniversitySemesters(universityId: UniversityId): Promise<boolean> {
  const store = await getStore();
  delete store[universityId];
  return setStore(store);
}
