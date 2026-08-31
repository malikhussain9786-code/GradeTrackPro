import { GradeScale } from '../../types';

// Source: official Foundation University academic scribd document,
// undergraduate programs table (per-mark GPC), confirmed by user.
export const foundationGradeScale: GradeScale = {
  universityId: 'foundation',
  maxGpa: 4.0,
  minPassingPoints: 1.0,
  interpolate: true,
  bands: [
    { letter: 'A+', minPercent: 85, maxPercent: 100, minPoints: 4.0, maxPoints: 4.0, isPassing: true },
    { letter: 'A', minPercent: 80, maxPercent: 84, minPoints: 3.6, maxPoints: 3.92, isPassing: true },
    { letter: 'B+', minPercent: 75, maxPercent: 79, minPoints: 3.2, maxPoints: 3.52, isPassing: true },
    { letter: 'B', minPercent: 70, maxPercent: 74, minPoints: 2.8, maxPoints: 3.12, isPassing: true },
    { letter: 'C+', minPercent: 65, maxPercent: 69, minPoints: 2.4, maxPoints: 2.72, isPassing: true },
    { letter: 'C', minPercent: 60, maxPercent: 64, minPoints: 2.0, maxPoints: 2.32, isPassing: true },
    { letter: 'D+', minPercent: 55, maxPercent: 59, minPoints: 1.75, maxPoints: 1.95, isPassing: true },
    { letter: 'D', minPercent: 50, maxPercent: 54, minPoints: 1.5, maxPoints: 1.7, isPassing: true },
    { letter: 'F', minPercent: 0, maxPercent: 49, minPoints: 0, maxPoints: 0, isPassing: false },
  ],
};
