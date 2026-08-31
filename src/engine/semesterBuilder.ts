import { Subject, Semester, UniversityId } from '../types';
import { calculateSgpa } from './sgpaCalculator';
import { generateId, nowIso } from '../utils/id';

// GradeTrack Pro — Semester Builder
// Takes the subjects entered in Course Entry (Step 10) and produces
// a fully-formed Semester record ready for storage (Step 18-19) or
// display (Step 12's "Save to History" action). Kept separate from
// the UI so History and Save-flow code never has to re-derive totals
// by hand — they just call this once.

export function buildSemesterFromSubjects(
  universityId: UniversityId,
  subjects: Subject[],
  label: string,
  semesterNumber: number,
  existingId?: string
): Semester {
  const { sgpa, totalCreditHours, totalQualityPoints } = calculateSgpa(subjects);
  const timestamp = nowIso();

  return {
    id: existingId ?? generateId('sem'),
    universityId,
    label,
    semesterNumber,
    subjects,
    totalCreditHours,
    totalQualityPoints,
    sgpa,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
