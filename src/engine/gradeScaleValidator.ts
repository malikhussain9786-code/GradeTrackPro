import { GradeScale } from '../types';

// GradeTrack Pro — Grade Scale Validator
// This validates the DATA itself (the 10 official grading tables),
// not user input (that's Step 25's Error Detection System). The goal:
// prove every university's grade scale is internally consistent —
// no gaps or overlaps in percentage coverage, no duplicate letters,
// correctly ordered bands, points within range — BEFORE it ever
// reaches a student's calculation.

export interface ValidationIssue {
  severity: 'error' | 'warning';
  message: string;
}

export interface GradeScaleValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export function validateGradeScale(scale: GradeScale): GradeScaleValidationResult {
  const issues: ValidationIssue[] = [];
  const { bands, maxGpa, minPassingPoints } = scale;

  if (bands.length === 0) {
    issues.push({ severity: 'error', message: 'Grade scale has no bands defined.' });
    return { valid: false, issues };
  }

  // 1. Unique letters
  const letters = bands.map((b) => b.letter);
  const dupeLetters = letters.filter((l, i) => letters.indexOf(l) !== i);
  if (dupeLetters.length > 0) {
    issues.push({ severity: 'error', message: `Duplicate grade letters: ${[...new Set(dupeLetters)].join(', ')}` });
  }

  // 2. Points within [0, maxGpa], min <= max per band
  bands.forEach((b) => {
    if (b.minPoints > b.maxPoints) {
      issues.push({ severity: 'error', message: `${b.letter}: minPoints (${b.minPoints}) exceeds maxPoints (${b.maxPoints}).` });
    }
    if (b.minPoints < 0 || b.maxPoints > maxGpa) {
      issues.push({ severity: 'error', message: `${b.letter}: points out of [0, ${maxGpa}] range.` });
    }
  });

  // 3. Bands ordered descending by points (highest grade first) —
  //    the engine relies on this order for band-matching.
  for (let i = 1; i < bands.length; i++) {
    if (bands[i].maxPoints > bands[i - 1].maxPoints) {
      issues.push({
        severity: 'error',
        message: `Bands out of order: ${bands[i - 1].letter} (${bands[i - 1].maxPoints}) should be >= ${bands[i].letter} (${bands[i].maxPoints}).`,
      });
    }
  }

  // 4. Marks-mode coverage check: if ANY band has percent bounds, ALL
  //    should, and together they must cover 0-100 with no gaps/overlaps.
  const hasAnyPercent = bands.some((b) => b.minPercent !== undefined);
  if (hasAnyPercent) {
    const missingPercent = bands.filter((b) => b.minPercent === undefined || b.maxPercent === undefined);
    if (missingPercent.length > 0) {
      issues.push({
        severity: 'error',
        message: `Mixed marks/grade bands: ${missingPercent.map((b) => b.letter).join(', ')} missing percent range.`,
      });
    } else {
      const sorted = [...bands].sort((a, b) => (a.minPercent ?? 0) - (b.minPercent ?? 0));
      if (sorted[0].minPercent !== 0) {
        issues.push({ severity: 'error', message: `Coverage does not start at 0% (starts at ${sorted[0].minPercent}%).` });
      }
      const last = sorted[sorted.length - 1];
      if (last.maxPercent !== 100) {
        issues.push({ severity: 'error', message: `Coverage does not end at 100% (ends at ${last.maxPercent}%).` });
      }
      for (let i = 1; i < sorted.length; i++) {
        const prevMax = sorted[i - 1].maxPercent!;
        const curMin = sorted[i].minPercent!;
        if (curMin > prevMax + 1) {
          issues.push({
            severity: 'error',
            message: `Gap in coverage between ${sorted[i - 1].letter} (ends ${prevMax}%) and ${sorted[i].letter} (starts ${curMin}%).`,
          });
        }
        if (curMin <= prevMax - 1) {
          issues.push({
            severity: 'error',
            message: `Overlap between ${sorted[i - 1].letter} (ends ${prevMax}%) and ${sorted[i].letter} (starts ${curMin}%).`,
          });
        }
      }
    }
  }

  // 5. Exactly one non-passing band expected (F) — anything else is
  //    worth a warning since it's unusual, though not necessarily wrong.
  const nonPassing = bands.filter((b) => !b.isPassing);
  if (nonPassing.length === 0) {
    issues.push({ severity: 'warning', message: 'No failing grade band defined.' });
  } else if (nonPassing.length > 1) {
    issues.push({
      severity: 'warning',
      message: `Multiple non-passing bands: ${nonPassing.map((b) => b.letter).join(', ')}.`,
    });
  }

  // 6. minPassingPoints should align with the lowest passing band —
  //    otherwise it's a meaningless/stale value.
  const passingBands = bands.filter((b) => b.isPassing);
  if (passingBands.length > 0) {
    const lowestPassingPoints = Math.min(...passingBands.map((b) => b.minPoints));
    if (Math.abs(lowestPassingPoints - minPassingPoints) > 0.51) {
      issues.push({
        severity: 'warning',
        message: `minPassingPoints (${minPassingPoints}) is far from the lowest passing band's points (${lowestPassingPoints}).`,
      });
    }
  }

  const hasErrors = issues.some((i) => i.severity === 'error');
  return { valid: !hasErrors, issues };
}
