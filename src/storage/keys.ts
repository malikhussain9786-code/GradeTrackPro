// GradeTrack Pro — Storage Key Registry
//
// Every AsyncStorage key used anywhere in the app is declared here.
// This prevents typo bugs (e.g. "semesters" vs "semester") and makes
// a future "Clear All Data" wipe (Settings, Step 26) trivially safe —
// it just iterates STORAGE_KEYS instead of guessing key names.

export const STORAGE_KEYS = {
  SCHEMA_VERSION: '@gradetrack/schema_version',
  SEMESTERS: '@gradetrack/semesters', // Record<universityId, Semester[]>
  CGPA_RECORDS: '@gradetrack/cgpa_records', // Record<universityId, CgpaRecord[]>
  HISTORY: '@gradetrack/history', // HistoryEntry[]
  SETTINGS: '@gradetrack/settings', // AppSettings
  SELECTED_UNIVERSITY: '@gradetrack/selected_university', // UniversityId | null
} as const;

// Bump this whenever a stored shape changes so future steps can
// write a migration instead of silently corrupting old data.
export const CURRENT_SCHEMA_VERSION = 1;
