// GradeTrack Pro — GPA Planner Models

export interface PlannerInput {
  currentCgpa: number;
  completedCreditHours: number;
  remainingCreditHours: number;
  targetCgpa: number;
}

export type PlannerFeasibility = 'achievable' | 'difficult' | 'impossible';

export interface PlannerResult {
  requiredFutureSgpa: number; // may exceed 4.0 mathematically
  feasibility: PlannerFeasibility;
  cappedAtMaxGpa: boolean; // true if requiredFutureSgpa > 4.0
  message: string; // human-readable summary shown on the result card
}
