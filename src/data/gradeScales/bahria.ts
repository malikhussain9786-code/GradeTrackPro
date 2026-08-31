import { GradeScale } from '../../types';

// Source: Bahria University's own "Easy CGPA Calculator" grade list,
// confirmed by user (Pakistan Navy multi-campus institution).
export const bahriaGradeScale: GradeScale = {
  universityId: 'bahria',
  maxGpa: 4.0,
  minPassingPoints: 1.5,
  interpolate: false,
  bands: [
    { letter: 'A', minPoints: 4.0, maxPoints: 4.0, isPassing: true },
    { letter: 'B+', minPoints: 3.5, maxPoints: 3.5, isPassing: true },
    { letter: 'B', minPoints: 3.0, maxPoints: 3.0, isPassing: true },
    { letter: 'C+', minPoints: 2.5, maxPoints: 2.5, isPassing: true },
    { letter: 'C', minPoints: 2.0, maxPoints: 2.0, isPassing: true },
    { letter: 'D', minPoints: 1.5, maxPoints: 1.5, isPassing: true },
    { letter: 'F', minPoints: 0, maxPoints: 0, isPassing: false },
  ],
};
