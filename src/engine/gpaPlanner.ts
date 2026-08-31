import { PlannerInput, PlannerResult, PlannerFeasibility } from '../types';
import { round2, clamp } from '../utils/math';

// GradeTrack Pro — GPA Planner / CGPA Predictor
//
// Derivation: target CGPA is the weighted average of what's already
// earned and what's still to come:
//
//   T = (C * Hc + S * Hr) / (Hc + Hr)
//
// where C = current CGPA, Hc = completed credit hours, S = required
// future SGPA (unknown), Hr = remaining credit hours, T = target CGPA.
// Solving for S:
//
//   S = (T * (Hc + Hr) - C * Hc) / Hr
//
// Feasibility bands are relative to the university's max GPA (all 10
// confirmed universities use 4.0, but this stays correct if that ever
// changes): comfortably achievable below ~82.5% of max, difficult up
// to max, mathematically impossible beyond max — matching the
// original spec's "Achievable / Difficult / Impossible" requirement.

export function calculateRequiredSgpa(input: PlannerInput, maxGpa: number): PlannerResult {
  const { currentCgpa, completedCreditHours, remainingCreditHours, targetCgpa } = input;

  if (remainingCreditHours <= 0) {
    return {
      requiredFutureSgpa: 0,
      feasibility: 'impossible',
      cappedAtMaxGpa: false,
      message: 'Enter your remaining credit hours to see what SGPA you need.',
    };
  }

  const totalFutureHours = completedCreditHours + remainingCreditHours;
  const rawRequired =
    (targetCgpa * totalFutureHours - currentCgpa * completedCreditHours) / remainingCreditHours;

  const cappedAtMaxGpa = rawRequired > maxGpa;
  const requiredFutureSgpa = round2(clamp(rawRequired, 0, maxGpa));

  let feasibility: PlannerFeasibility;
  let message: string;

  if (rawRequired <= 0) {
    feasibility = 'achievable';
    message = `You're already on track — even a low SGPA in your remaining ${remainingCreditHours} credit hours will keep you at or above your ${targetCgpa.toFixed(2)} target.`;
  } else if (cappedAtMaxGpa) {
    feasibility = 'impossible';
    message = `Reaching ${targetCgpa.toFixed(2)} CGPA isn't mathematically possible with only ${remainingCreditHours} credit hours left — it would require an SGPA above ${maxGpa.toFixed(2)}.`;
  } else if (rawRequired <= maxGpa * 0.825) {
    feasibility = 'achievable';
    message = `To achieve ${targetCgpa.toFixed(2)} CGPA, you need approximately ${requiredFutureSgpa.toFixed(2)} SGPA in your remaining ${remainingCreditHours} credit hours.`;
  } else {
    feasibility = 'difficult';
    message = `To achieve ${targetCgpa.toFixed(2)} CGPA, you need approximately ${requiredFutureSgpa.toFixed(2)} SGPA in your remaining ${remainingCreditHours} credit hours — an ambitious but possible target.`;
  }

  return { requiredFutureSgpa, feasibility, cappedAtMaxGpa, message };
}
