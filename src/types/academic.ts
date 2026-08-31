// GradeTrack Pro — Academic Record Models (Subject / Semester)

export interface MarksEntry {
  obtained: number;
  total: number;
}

export interface Subject {
  id: string; // uuid
  name: string;
  creditHours: number;
  hasLab: boolean; // COMSATS-style theory/practical split toggle

  // Populated depending on the university's inputMode:
  theoryMarks?: MarksEntry; // 70% component when hasLab, or full marks otherwise
  practicalMarks?: MarksEntry; // 30% component when hasLab
  selectedGrade?: string; // used directly for "grade" inputMode universities

  // Computed by the grading engine, cached for display/history:
  computedPercent?: number;
  computedGrade: string;
  computedPoints: number; // grade points for this subject
  qualityPoints: number; // computedPoints * creditHours
}

export interface Semester {
  id: string; // uuid
  universityId: string;
  label: string; // "Fall 2024 – Semester 5"
  semesterNumber: number;
  subjects: Subject[];
  totalCreditHours: number;
  totalQualityPoints: number;
  sgpa: number;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
