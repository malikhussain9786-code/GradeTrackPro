import { GradeScale } from '../../types';

// Source: official FAST-NUCES grade scale, confirmed by user.
export const fastGradeScale: GradeScale = {
  universityId: 'fast',
  maxGpa: 4.0,
  minPassingPoints: 1.0,
  interpolate: false,
  bands: [
    { letter: 'A+', minPoints: 4.0, maxPoints: 4.0, isPassing: true },
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
  ],
};
