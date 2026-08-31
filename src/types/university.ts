// GradeTrack Pro — University Data Model
//
// Two calculation input modes exist across the 10 universities, based
// on the official data confirmed:
//   - "marks": student enters raw marks, app converts marks -> grade -> points
//     (COMSATS, Foundation, NUML, IIUI, Riphah — all provided percentage bands)
//   - "grade": student picks the letter grade directly, no percentage bands
//     were provided officially (NUTECH, FAST, NUST, Air, Bahria)
//
// This is a per-university property, not a global app setting, because
// mixing both modes in one app is required by the official source data.

export type UniversityId =
  | 'foundation'
  | 'comsats'
  | 'nutech'
  | 'numl'
  | 'iiui'
  | 'riphah'
  | 'fast'
  | 'nust'
  | 'air'
  | 'bahria';

export type GradeInputMode = 'marks' | 'grade';

export interface University {
  id: UniversityId;
  name: string; // full official name
  shortName: string; // display badge (COMSATS, NUML, FAST-NUCES, etc.)
  logo: any; // require() image asset
  banner: any; // require() campus photo asset
  websiteUrl: string;
  about: string;
  city: string;
  inputMode: GradeInputMode;
  supportsTheoryPracticalSplit: boolean; // COMSATS-style 70/30 marks entry
  gradeScaleNote: string; // short official-source citation shown in Info screen
  order: number; // display order, Foundation = 0 (top)
}
