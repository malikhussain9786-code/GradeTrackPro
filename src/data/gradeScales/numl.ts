import { GradeScale } from '../../types';

// Source: official NUML grading table, confirmed by user (studentcalc.com
// screenshot cross-referenced against NUML's published percentage bands).
export const numlGradeScale: GradeScale = {
  universityId: 'numl',
  maxGpa: 4.0,
  minPassingPoints: 1.0,
  interpolate: true,
  bands: [
    { letter: 'A+', minPercent: 90, maxPercent: 100, minPoints: 4.0, maxPoints: 4.0, isPassing: true },
    { letter: 'A', minPercent: 80, maxPercent: 89.99, minPoints: 4.0, maxPoints: 4.0, isPassing: true },
    { letter: 'B+', minPercent: 75, maxPercent: 79.99, minPoints: 3.5, maxPoints: 3.99, isPassing: true },
    { letter: 'B', minPercent: 70, maxPercent: 74.99, minPoints: 3.0, maxPoints: 3.49, isPassing: true },
    { letter: 'C+', minPercent: 65, maxPercent: 69.99, minPoints: 2.5, maxPoints: 2.99, isPassing: true },
    { letter: 'C', minPercent: 60, maxPercent: 64.99, minPoints: 2.0, maxPoints: 2.49, isPassing: true },
    { letter: 'D+', minPercent: 55, maxPercent: 59.99, minPoints: 1.5, maxPoints: 1.99, isPassing: true },
    { letter: 'D', minPercent: 50, maxPercent: 54.99, minPoints: 1.0, maxPoints: 1.49, isPassing: true },
    { letter: 'F', minPercent: 0, maxPercent: 49.99, minPoints: 0, maxPoints: 0, isPassing: false },
  ],
};
