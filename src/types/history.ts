// GradeTrack Pro — CGPA & History Models

export interface SemesterSummary {
  semesterId: string;
  label: string;
  sgpa: number;
  creditHours: number;
  qualityPoints: number;
}

export interface CgpaRecord {
  id: string; // uuid
  universityId: string;
  semesters: SemesterSummary[];
  totalCreditHours: number;
  totalQualityPoints: number;
  cgpa: number;
  createdAt: string;
  updatedAt: string;
}

import { UniversityId } from './university';

// A single saved item in the History screen — can represent
// a saved SGPA calculation, a saved CGPA snapshot, or a full semester.
export type HistoryEntryType = 'sgpa' | 'cgpa' | 'semester';

export interface HistoryEntry {
  id: string;
  type: HistoryEntryType;
  universityId: UniversityId;
  title: string; // e.g. "Fall 2024 – Semester 5"
  resultValue: number; // the SGPA or CGPA number
  creditHours: number;
  qualityPoints: number;
  savedAt: string; // ISO date
  payload: unknown; // full Semester or CgpaRecord for detail view / re-edit
}
