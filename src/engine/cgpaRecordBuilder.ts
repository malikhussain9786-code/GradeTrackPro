import { CgpaRecord, SemesterSummary, UniversityId } from '../types';
import { generateId, nowIso } from '../utils/id';

// GradeTrack Pro — CGPA Record Builder
// Mirrors semesterBuilder.ts: takes the engine's calculation output
// and produces a storage-ready CgpaRecord for Save to History (Step 15)
// and future History screen display (Steps 20-21).

export function buildCgpaRecord(
  universityId: UniversityId,
  semesterSummaries: SemesterSummary[],
  totalCreditHours: number,
  totalQualityPoints: number,
  cgpa: number,
  existingId?: string
): CgpaRecord {
  const timestamp = nowIso();
  return {
    id: existingId ?? generateId('cgpa'),
    universityId,
    semesters: semesterSummaries,
    totalCreditHours,
    totalQualityPoints,
    cgpa,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
