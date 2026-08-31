import { ValidationError } from '../types';

// GradeTrack Pro — Centralized Validators
//
// Every input-validation message in the app comes from here. Before
// this step, Course Entry, CGPA Entry, and the Planner each had their
// own inline validation logic with slightly different wording and
// coverage — the Planner had none at all, silently hiding its result
// card instead of explaining why. This module is the single source
// of truth, matching the original spec's exact required messages:
//   "Please enter valid marks."
//   "Grade entered is not available for this university."
//   "Please enter valid credit hours."

export function validateCourseName(name: string): ValidationError | null {
  if (!name.trim()) {
    return { field: 'subjectName', message: 'Please enter a course name.' };
  }
  return null;
}

export function validateCreditHours(raw: string): ValidationError | null {
  const value = parseFloat(raw);
  if (!raw.trim() || isNaN(value)) {
    return { field: 'creditHours', message: 'Please enter valid credit hours.' };
  }
  if (value <= 0) {
    return { field: 'creditHours', message: 'Credit hours must be greater than zero.' };
  }
  if (value < 0) {
    return { field: 'creditHours', message: 'Negative numbers are not allowed.' };
  }
  return null;
}

export function validateMarks(
  obtainedRaw: string,
  totalRaw: string,
  field: 'theoryMarks' | 'practicalMarks' = 'theoryMarks'
): ValidationError | null {
  const obtained = parseFloat(obtainedRaw);
  const total = parseFloat(totalRaw);

  if (!obtainedRaw.trim() || !totalRaw.trim() || isNaN(obtained) || isNaN(total)) {
    return { field, message: 'Please enter valid marks.' };
  }
  if (obtained < 0 || total < 0) {
    return { field, message: 'Negative numbers are not allowed.' };
  }
  if (total <= 0) {
    return { field, message: 'Please enter valid marks.' };
  }
  if (obtained > total) {
    return { field, message: 'Please enter valid marks.' }; // "above maximum marks" case
  }
  return null;
}

export function validateGradeSelection(selected: string | undefined): ValidationError | null {
  if (!selected) {
    return { field: 'selectedGrade', message: 'Grade entered is not available for this university.' };
  }
  return null;
}

export function validateCgpaBoundedValue(
  raw: string,
  maxGpa: number,
  field: 'currentCgpa' | 'targetCgpa'
): ValidationError | null {
  const value = parseFloat(raw);
  if (!raw.trim() || isNaN(value)) {
    return { field, message: 'Please enter a valid GPA value.' };
  }
  if (value < 0) {
    return { field, message: 'Negative numbers are not allowed.' };
  }
  if (value > maxGpa) {
    return { field, message: `Value cannot exceed ${maxGpa.toFixed(2)} for this university.` };
  }
  return null;
}

export function validatePositiveCreditHours(
  raw: string,
  field: 'completedCreditHours' | 'remainingCreditHours'
): ValidationError | null {
  const value = parseFloat(raw);
  if (!raw.trim() || isNaN(value)) {
    return { field, message: 'Please enter valid credit hours.' };
  }
  if (value < 0) {
    return { field, message: 'Negative numbers are not allowed.' };
  }
  if (field === 'remainingCreditHours' && value <= 0) {
    return { field, message: 'Remaining credit hours must be greater than zero.' };
  }
  return null;
}

export function validateSemesterLabel(label: string): ValidationError | null {
  if (!label.trim()) {
    return { field: 'subjectName', message: 'Please enter a semester label.' };
  }
  return null;
}
