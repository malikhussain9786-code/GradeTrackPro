import { MarksEntry } from '../types';
import { safeDivide, round2, clamp } from '../utils/math';

// GradeTrack Pro — Marks-to-Percent Conversion
//
// For universities with a theory/practical split (COMSATS-style,
// "Theory 70% / Practical 30%"), the composite percentage is the
// weighted average of each component's own percentage — NOT a raw
// sum of obtained marks over a combined total. This is the
// academically standard approach and is what the "70%" / "30%"
// labels in the UI actually mean.
//
// Example: Theory 63/100 (63%), Practical 28/50 (56%)
//   composite = 0.7 * 63 + 0.3 * 56 = 44.1 + 16.8 = 60.9%
//
// Without a split, the percentage is simply obtained/total * 100.
//
// The final composite is clamped to [0, 100] before rounding. This
// is defense-in-depth: the Course Entry screen's own validation
// (Step 10) already blocks obtained > total before a course can be
// added, but the live preview updates on every keystroke before that
// validation fires, so the engine itself must never hand back an
// out-of-range percentage — a student mid-typing "630" instead of
// "63" should see a sane number, not "630%".
//
// Individual theory/practical percentages are intentionally NOT
// rounded before weighting — only the final composite is rounded —
// to avoid compounding rounding error across two roundings.

const THEORY_WEIGHT = 0.7;
const PRACTICAL_WEIGHT = 0.3;

export function computeCompositePercent(
  hasLab: boolean,
  theory?: MarksEntry,
  practical?: MarksEntry
): number | null {
  if (!hasLab) {
    if (!theory || theory.total <= 0) return null;
    const percent = safeDivide(theory.obtained, theory.total) * 100;
    return round2(clamp(percent, 0, 100));
  }

  if (!theory || !practical || theory.total <= 0 || practical.total <= 0) return null;

  const theoryPercent = safeDivide(theory.obtained, theory.total) * 100;
  const practicalPercent = safeDivide(practical.obtained, practical.total) * 100;
  const composite = theoryPercent * THEORY_WEIGHT + practicalPercent * PRACTICAL_WEIGHT;

  return round2(clamp(composite, 0, 100));
}
