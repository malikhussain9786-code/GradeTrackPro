import { Semester, SemesterSummary } from '../types';
import { round2, safeDivide } from '../utils/math';

// GradeTrack Pro — CGPA Calculator
// CGPA = sum(quality points across ALL semesters) / sum(credit hours
// across ALL semesters) — cumulative, not an average of per-semester
// SGPAs (that would misweight semesters with different credit loads).

export interface CgpaCalculationResult {
  cgpa: number;
  totalCreditHours: number;
  totalQualityPoints: number;
  semesterCount: number;
  semesterSummaries: SemesterSummary[];
}

export function calculateCgpaFromSemesters(semesters: Semester[]): CgpaCalculationResult {
  const totalCreditHours = semesters.reduce((sum, s) => sum + s.totalCreditHours, 0);
  const totalQualityPoints = semesters.reduce((sum, s) => sum + s.totalQualityPoints, 0);

  const semesterSummaries: SemesterSummary[] = semesters.map((s) => ({
    semesterId: s.id,
    label: s.label,
    sgpa: s.sgpa,
    creditHours: s.totalCreditHours,
    qualityPoints: s.totalQualityPoints,
  }));

  return {
    cgpa: round2(safeDivide(totalQualityPoints, totalCreditHours)),
    totalCreditHours,
    totalQualityPoints: round2(totalQualityPoints),
    semesterCount: semesters.length,
    semesterSummaries,
  };
}

/**
 * Manual-entry CGPA path: when a student enters past semesters' SGPA +
 * credit hours directly (per the original spec's "Semester 1 SGPA,
 * Semester 2 SGPA..." flow) rather than building full subject lists.
 */
export interface ManualSemesterInput {
  sgpa: number;
  creditHours: number;
  label?: string;
}

export function calculateCgpaFromManualEntries(entries: ManualSemesterInput[]): CgpaCalculationResult {
  const totalCreditHours = entries.reduce((sum, e) => sum + e.creditHours, 0);
  const totalQualityPoints = entries.reduce((sum, e) => sum + e.sgpa * e.creditHours, 0);

  const semesterSummaries: SemesterSummary[] = entries.map((e, idx) => ({
    semesterId: `manual_${idx}`,
    label: e.label ?? `Semester ${idx + 1}`,
    sgpa: e.sgpa,
    creditHours: e.creditHours,
    qualityPoints: round2(e.sgpa * e.creditHours),
  }));

  return {
    cgpa: round2(safeDivide(totalQualityPoints, totalCreditHours)),
    totalCreditHours,
    totalQualityPoints: round2(totalQualityPoints),
    semesterCount: entries.length,
    semesterSummaries,
  };
}
