import { NavigatorScreenParams } from '@react-navigation/native';
import { UniversityId, Subject, SemesterSummary } from '../types';

// GradeTrack Pro — Navigation Types
// Root stack holds screens that live OUTSIDE the bottom tab bar
// (University selection, University Info, Course Entry, Results —
// these push full-screen with a back arrow, matching the mockups'
// "Add Course" / "SGPA Result" header style with a back chevron).
// MainTabs holds the 5 persistent tabs matching the mockup exactly.
// The Calculate tab is a lightweight hub; SGPA/CGPA entry + result
// screens live on the root stack so they get the proper pushed,
// back-chevron presentation the mockups show.

export type CalculatorMode = 'sgpa' | 'cgpa';

export type RootStackParamList = {
  Home: undefined;
  UniversityInfo: { universityId: UniversityId };
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  SgpaCourseEntry: { universityId: UniversityId; editSemesterId?: string };
  SgpaResult: {
    universityId: UniversityId;
    subjects: Subject[];
    sgpa: number;
    totalCreditHours: number;
    totalQualityPoints: number;
    semesterLabel?: string;
    existingSemesterId?: string;
    alreadySaved?: boolean;
  };
  CgpaEntry: { universityId: UniversityId };
  CgpaResult: {
    universityId: UniversityId;
    semesterSummaries: SemesterSummary[];
    cgpa: number;
    totalCreditHours: number;
    totalQualityPoints: number;
  };
  SemesterList: { universityId: UniversityId };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Calculate: { universityId?: UniversityId } | undefined;
  History: undefined;
  Planner: undefined;
  Settings: undefined;
};
