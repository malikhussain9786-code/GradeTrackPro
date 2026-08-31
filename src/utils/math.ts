// GradeTrack Pro — Math Utilities
// One rounding function used everywhere so SGPA/CGPA never drifts
// due to inconsistent decimal handling across different screens.

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function safeDivide(numerator: number, denominator: number, fallback = 0): number {
  if (!denominator || Number.isNaN(denominator)) return fallback;
  return numerator / denominator;
}
