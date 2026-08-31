import { Subject, GradeScale, University } from '../types';
import { computeCompositePercent } from './marksToPercent';
import { pointsFromPercent, pointsFromLetter } from './gradeResolver';
import { round2 } from '../utils/math';

// GradeTrack Pro — Subject Calculator
// Produces the computed fields on a Subject (percent, grade, points,
// quality points) based on the owning university's inputMode.
// Returns null fields (rather than throwing) when input is incomplete —
// the caller (Course Entry screen, Step 10-11) is responsible for
// surfacing validation errors via the Step 25 error-detection system.

export interface SubjectCalculationResult {
  computedPercent: number | null;
  computedGrade: string | null;
  computedPoints: number | null;
  qualityPoints: number | null;
  isPassing: boolean | null;
}

export function calculateSubject(
  subject: Pick<Subject, 'creditHours' | 'hasLab' | 'theoryMarks' | 'practicalMarks' | 'selectedGrade'>,
  university: Pick<University, 'inputMode'>,
  scale: GradeScale
): SubjectCalculationResult {
  const empty: SubjectCalculationResult = {
    computedPercent: null,
    computedGrade: null,
    computedPoints: null,
    qualityPoints: null,
    isPassing: null,
  };

  if (!subject.creditHours || subject.creditHours <= 0) return empty;

  if (university.inputMode === 'marks') {
    const percent = computeCompositePercent(subject.hasLab, subject.theoryMarks, subject.practicalMarks);
    if (percent === null) return empty;

    const resolved = pointsFromPercent(scale, percent);
    if (!resolved) return empty;

    return {
      computedPercent: percent,
      computedGrade: resolved.letter,
      computedPoints: resolved.points,
      qualityPoints: round2(resolved.points * subject.creditHours),
      isPassing: resolved.isPassing,
    };
  }

  // grade-mode
  if (!subject.selectedGrade) return empty;
  const resolved = pointsFromLetter(scale, subject.selectedGrade);
  if (!resolved) return empty;

  return {
    computedPercent: null,
    computedGrade: resolved.letter,
    computedPoints: resolved.points,
    qualityPoints: round2(resolved.points * subject.creditHours),
    isPassing: resolved.isPassing,
  };
}
