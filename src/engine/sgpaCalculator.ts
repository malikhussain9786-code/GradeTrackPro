import { Subject } from '../types';
import { round2, safeDivide } from '../utils/math';

// GradeTrack Pro — SGPA Calculator
// SGPA = sum(quality points) / sum(credit hours), standard formula
// confirmed identical across all 10 universities (NUTECH's own
// documentation states this explicitly; it matches the others).

export interface SgpaCalculationResult {
  sgpa: number;
  totalCreditHours: number;
  totalQualityPoints: number;
  subjectCount: number;
}

export function calculateSgpa(subjects: Subject[]): SgpaCalculationResult {
  const validSubjects = subjects.filter(
    (s) => s.creditHours > 0 && s.qualityPoints !== undefined && s.qualityPoints !== null
  );

  const totalCreditHours = validSubjects.reduce((sum, s) => sum + s.creditHours, 0);
  const totalQualityPoints = validSubjects.reduce((sum, s) => sum + (s.qualityPoints ?? 0), 0);

  return {
    sgpa: round2(safeDivide(totalQualityPoints, totalCreditHours)),
    totalCreditHours,
    totalQualityPoints: round2(totalQualityPoints),
    subjectCount: validSubjects.length,
  };
}
