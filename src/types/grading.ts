// GradeTrack Pro — Grading Scale Model
//
// A GradeBand represents one row of a university's official grading
// table. For "marks" universities, minPercent/maxPercent are required
// so the engine can convert a raw percentage into the correct band.
// For "grade" universities, minPercent/maxPercent are omitted — the
// student selects the letter directly.
//
// gradePoints can be a fixed value (most universities) or a range
// (COMSATS, Foundation — "3.34 - 3.66" style) where the engine
// interpolates linearly across the percent range, matching the
// official "+0.1 per mark above band minimum" rule where specified.

export interface GradeBand {
  letter: string; // "A+", "A-", "B", etc.
  minPercent?: number; // inclusive lower bound, marks-mode only
  maxPercent?: number; // inclusive upper bound, marks-mode only
  minPoints: number;
  maxPoints: number; // equals minPoints when the band is a fixed value
  isPassing: boolean;
}

export interface GradeScale {
  universityId: string;
  bands: GradeBand[]; // ordered highest -> lowest
  maxGpa: number; // 4.0 for all 10 confirmed universities
  minPassingPoints: number; // grade points at/above which credit is earned
  interpolate: boolean; // true = linear interpolation within a band's percent range
}
