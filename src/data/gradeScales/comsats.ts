import { GradeScale } from '../../types';

// Source: official COMSATS University Islamabad Notification
// CUI-Reg/Notif-/20/2322/2798, Dec 7 2020 — HEC Grading Criteria,
// effective Fall 2021 admissions. Confirmed by user via document photo.
export const comsatsGradeScale: GradeScale = {
  universityId: 'comsats',
  maxGpa: 4.0,
  minPassingPoints: 0.1,
  interpolate: true,
  bands: [
    { letter: 'A', minPercent: 85, maxPercent: 100, minPoints: 3.67, maxPoints: 4.0, isPassing: true },
    { letter: 'A-', minPercent: 80, maxPercent: 84, minPoints: 3.34, maxPoints: 3.66, isPassing: true },
    { letter: 'B+', minPercent: 75, maxPercent: 79, minPoints: 3.01, maxPoints: 3.33, isPassing: true },
    { letter: 'B', minPercent: 71, maxPercent: 74, minPoints: 2.67, maxPoints: 3.0, isPassing: true },
    { letter: 'B-', minPercent: 68, maxPercent: 70, minPoints: 2.34, maxPoints: 2.66, isPassing: true },
    { letter: 'C+', minPercent: 64, maxPercent: 67, minPoints: 2.01, maxPoints: 2.33, isPassing: true },
    { letter: 'C', minPercent: 61, maxPercent: 63, minPoints: 1.67, maxPoints: 2.0, isPassing: true },
    { letter: 'C-', minPercent: 58, maxPercent: 60, minPoints: 1.31, maxPoints: 1.66, isPassing: true },
    { letter: 'D+', minPercent: 54, maxPercent: 57, minPoints: 1.01, maxPoints: 1.3, isPassing: true },
    { letter: 'D', minPercent: 50, maxPercent: 53, minPoints: 0.1, maxPoints: 1.0, isPassing: true },
    { letter: 'F', minPercent: 0, maxPercent: 49, minPoints: 0, maxPoints: 0, isPassing: false },
  ],
};
