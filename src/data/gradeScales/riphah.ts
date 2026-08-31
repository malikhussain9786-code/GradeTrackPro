import { GradeScale } from '../../types';

// Source: official Riphah grading criteria document (ric.edu.pk),
// "+0.1 per mark above minimum for the letter band" rule — reproduced
// here via linear interpolation across each band's percent range.
export const riphahGradeScale: GradeScale = {
  universityId: 'riphah',
  maxGpa: 4.0,
  minPassingPoints: 1.0,
  interpolate: true,
  bands: [
    { letter: 'A+', minPercent: 90, maxPercent: 100, minPoints: 4.0, maxPoints: 4.0, isPassing: true },
    { letter: 'A', minPercent: 80, maxPercent: 89, minPoints: 4.0, maxPoints: 4.0, isPassing: true },
    { letter: 'A-', minPercent: 78, maxPercent: 79, minPoints: 3.8, maxPoints: 3.9, isPassing: true },
    { letter: 'B+', minPercent: 74, maxPercent: 77, minPoints: 3.4, maxPoints: 3.7, isPassing: true },
    { letter: 'B', minPercent: 70, maxPercent: 73, minPoints: 3.0, maxPoints: 3.3, isPassing: true },
    { letter: 'B-', minPercent: 68, maxPercent: 69, minPoints: 2.8, maxPoints: 2.9, isPassing: true },
    { letter: 'C+', minPercent: 64, maxPercent: 67, minPoints: 2.4, maxPoints: 2.7, isPassing: true },
    { letter: 'C', minPercent: 60, maxPercent: 63, minPoints: 2.0, maxPoints: 2.3, isPassing: true },
    { letter: 'C-', minPercent: 58, maxPercent: 59, minPoints: 1.8, maxPoints: 1.9, isPassing: true },
    { letter: 'D+', minPercent: 54, maxPercent: 57, minPoints: 1.4, maxPoints: 1.7, isPassing: true },
    { letter: 'D', minPercent: 50, maxPercent: 53, minPoints: 1.0, maxPoints: 1.3, isPassing: true },
    { letter: 'F', minPercent: 0, maxPercent: 49, minPoints: 0, maxPoints: 0, isPassing: false },
  ],
};
