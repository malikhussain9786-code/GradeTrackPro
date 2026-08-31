// GradeTrack Pro — Validation Models

export type ValidationFieldKey =
  | 'subjectName'
  | 'creditHours'
  | 'theoryMarks'
  | 'practicalMarks'
  | 'selectedGrade'
  | 'targetCgpa'
  | 'currentCgpa'
  | 'completedCreditHours'
  | 'remainingCreditHours';

export interface ValidationError {
  field: ValidationFieldKey;
  message: string; // exact user-facing copy, e.g. "Please enter valid marks."
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
