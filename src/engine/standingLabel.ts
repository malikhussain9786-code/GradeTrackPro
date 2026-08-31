// GradeTrack Pro — Academic Standing Labels
// Matches the mockups' "Excellent!" (SGPA result) and "Good Standing"
// (Dashboard) badges. Thresholds follow common Pakistani university
// academic-standing conventions (2.0 is the universal probation line
// per every grading document collected — NUTECH's doc states
// "SGPA/CGPA less than 2.00" is an academic deficiency).

export type StandingTier = 'excellent' | 'good' | 'satisfactory' | 'probation';

export interface StandingInfo {
  tier: StandingTier;
  label: string;
  description: string;
}

export function getStandingInfo(gpa: number): StandingInfo {
  if (gpa >= 3.5) {
    return { tier: 'excellent', label: 'Excellent!', description: 'Outstanding academic performance.' };
  }
  if (gpa >= 3.0) {
    return { tier: 'good', label: 'Good Standing', description: 'Strong, consistent performance.' };
  }
  if (gpa >= 2.0) {
    return { tier: 'satisfactory', label: 'Satisfactory', description: 'Meeting minimum requirements.' };
  }
  return {
    tier: 'probation',
    label: 'Academic Warning',
    description: 'Below the minimum 2.00 CGPA/SGPA threshold.',
  };
}
