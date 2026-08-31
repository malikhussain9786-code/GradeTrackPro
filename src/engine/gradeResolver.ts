import { GradeBand, GradeScale } from '../types';
import { round2, clamp } from '../utils/math';

// GradeTrack Pro — Grade Resolver
// The single source of truth for turning either a percentage (marks-mode
// universities) or a selected letter (grade-mode universities) into
// grade points, using ONLY the official bands supplied per university —
// never a generic/guessed formula.

export interface ResolvedGrade {
  letter: string;
  points: number;
  isPassing: boolean;
}

/** Marks-mode: find the band whose [minPercent, maxPercent] contains the percent. */
export function resolveBandForPercent(scale: GradeScale, percent: number): GradeBand | null {
  const p = clamp(percent, 0, 100);
  // Bands are ordered highest -> lowest; find the first band that contains p.
  for (const band of scale.bands) {
    if (band.minPercent === undefined || band.maxPercent === undefined) continue;
    if (p >= band.minPercent && p <= band.maxPercent) return band;
  }
  return null;
}

/** Marks-mode: percent -> points, interpolating within the matched band if the scale allows it. */
export function pointsFromPercent(scale: GradeScale, percent: number): ResolvedGrade | null {
  const band = resolveBandForPercent(scale, percent);
  if (!band) return null;

  if (!scale.interpolate || band.minPoints === band.maxPoints) {
    return { letter: band.letter, points: round2(band.minPoints), isPassing: band.isPassing };
  }

  const { minPercent, maxPercent, minPoints, maxPoints } = band;
  if (minPercent === undefined || maxPercent === undefined) {
    return { letter: band.letter, points: round2(band.minPoints), isPassing: band.isPassing };
  }

  const span = maxPercent - minPercent;
  const ratio = span > 0 ? (clamp(percent, minPercent, maxPercent) - minPercent) / span : 0;
  const points = minPoints + ratio * (maxPoints - minPoints);

  return { letter: band.letter, points: round2(points), isPassing: band.isPassing };
}

/** Grade-mode: student-selected letter -> points, direct lookup. */
export function pointsFromLetter(scale: GradeScale, letter: string): ResolvedGrade | null {
  const band = scale.bands.find((b) => b.letter.toLowerCase() === letter.toLowerCase());
  if (!band) return null;
  return { letter: band.letter, points: round2(band.minPoints), isPassing: band.isPassing };
}

/** Returns the list of selectable letter grades for grade-mode universities, in official order. */
export function listSelectableGrades(scale: GradeScale): string[] {
  return scale.bands.map((b) => b.letter);
}
