import { GradeScale } from '../../types';

// Source: confirmed by user — NUST and Air University use the same
// standard 11-grade scale. Two separate exports (same values) so each
// university's data file stays independent and easy to update later
// if one of them changes independently.

const standardElevenGradeBands = [
  { letter: 'A', minPoints: 4.0, maxPoints: 4.0, isPassing: true },
  { letter: 'A-', minPoints: 3.67, maxPoints: 3.67, isPassing: true },
  { letter: 'B+', minPoints: 3.33, maxPoints: 3.33, isPassing: true },
  { letter: 'B', minPoints: 3.0, maxPoints: 3.0, isPassing: true },
  { letter: 'B-', minPoints: 2.67, maxPoints: 2.67, isPassing: true },
  { letter: 'C+', minPoints: 2.33, maxPoints: 2.33, isPassing: true },
  { letter: 'C', minPoints: 2.0, maxPoints: 2.0, isPassing: true },
  { letter: 'C-', minPoints: 1.67, maxPoints: 1.67, isPassing: true },
  { letter: 'D+', minPoints: 1.33, maxPoints: 1.33, isPassing: true },
  { letter: 'D', minPoints: 1.0, maxPoints: 1.0, isPassing: true },
  { letter: 'F', minPoints: 0, maxPoints: 0, isPassing: false },
] as const;

export const nustGradeScale: GradeScale = {
  universityId: 'nust',
  maxGpa: 4.0,
  minPassingPoints: 1.0,
  interpolate: false,
  bands: [...standardElevenGradeBands],
};

export const airGradeScale: GradeScale = {
  universityId: 'air',
  maxGpa: 4.0,
  minPassingPoints: 1.0,
  interpolate: false,
  bands: [...standardElevenGradeBands],
};
