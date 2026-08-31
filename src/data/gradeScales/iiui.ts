import { GradeScale } from '../../types';

// Source: "IIUI Official Grading Scale", confirmed by user.
export const iiuiGradeScale: GradeScale = {
  universityId: 'iiui',
  maxGpa: 4.0,
  minPassingPoints: 1.0,
  interpolate: false, // fixed points per band, no in-band ranges given
  bands: [
    { letter: 'A', minPercent: 80, maxPercent: 100, minPoints: 4.0, maxPoints: 4.0, isPassing: true },
    { letter: 'B+', minPercent: 75, maxPercent: 79, minPoints: 3.5, maxPoints: 3.5, isPassing: true },
    { letter: 'B', minPercent: 70, maxPercent: 74, minPoints: 3.0, maxPoints: 3.0, isPassing: true },
    { letter: 'C+', minPercent: 65, maxPercent: 69, minPoints: 2.5, maxPoints: 2.5, isPassing: true },
    { letter: 'C', minPercent: 60, maxPercent: 64, minPoints: 2.0, maxPoints: 2.0, isPassing: true },
    { letter: 'D+', minPercent: 55, maxPercent: 59, minPoints: 1.5, maxPoints: 1.5, isPassing: true },
    { letter: 'D', minPercent: 50, maxPercent: 54, minPoints: 1.0, maxPoints: 1.0, isPassing: true },
    { letter: 'F', minPercent: 0, maxPercent: 49, minPoints: 0, maxPoints: 0, isPassing: false },
  ],
};
