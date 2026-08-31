import { GradeScale } from '../../types';

// Source: official NUTECH document (nutech.edu.pk), confirmed by user.
// No percentage bands provided — student selects the letter grade directly.
// XF / W / I are administrative grades (0.0 points, excluded from GPA
// credit-hour totals) — engine (Step 6+) must special-case them.
export const nutechGradeScale: GradeScale = {
  universityId: 'nutech',
  maxGpa: 4.0,
  minPassingPoints: 1.0,
  interpolate: false,
  bands: [
    { letter: 'A', minPoints: 4.0, maxPoints: 4.0, isPassing: true },
    { letter: 'B+', minPoints: 3.5, maxPoints: 3.5, isPassing: true },
    { letter: 'B', minPoints: 3.0, maxPoints: 3.0, isPassing: true },
    { letter: 'C+', minPoints: 2.5, maxPoints: 2.5, isPassing: true },
    { letter: 'C', minPoints: 2.0, maxPoints: 2.0, isPassing: true },
    { letter: 'D+', minPoints: 1.5, maxPoints: 1.5, isPassing: true },
    { letter: 'D', minPoints: 1.0, maxPoints: 1.0, isPassing: true },
    { letter: 'F', minPoints: 0, maxPoints: 0, isPassing: false },
  ],
};
