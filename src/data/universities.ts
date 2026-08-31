import { University } from '../types';

// GradeTrack Pro — University Directory
//
// NOTE on `websiteUrl`: these are the standard, widely-published official
// domains for each institution. I have not live-verified them via browsing
// in this session — please double-check each one loads correctly before
// the Play Store release, since a broken "Official Website" button would
// hurt the premium feel you're going for.
//
// NOTE on `logo`: only campus banner photos were provided, not separate
// transparent-background logo marks. Using the banner image for both for
// now — the UI (Step 7+) will render a circular initials badge as the
// primary "logo" treatment instead of cropping the banner into a circle,
// which would look unprofessional. Send dedicated logo files anytime to
// upgrade this.

export const UNIVERSITIES: University[] = [
  {
    id: 'foundation',
    name: 'Foundation University Islamabad',
    shortName: 'FUI',
    logo: require('../../assets/universities/foundation.jpg'),
    banner: require('../../assets/universities/foundation.jpg'),
    websiteUrl: 'https://fui.edu.pk',
    about:
      'Foundation University Islamabad is a Fauji Foundation-chartered university offering programs across engineering, sciences, business, and health sciences, with campuses in Islamabad and Rawalpindi.',
    city: 'Islamabad / Rawalpindi',
    inputMode: 'marks',
    supportsTheoryPracticalSplit: true,
    gradeScaleNote: 'Official Foundation University undergraduate GPC table.',
    order: 0,
  },
  {
    id: 'comsats',
    name: 'COMSATS University Islamabad',
    shortName: 'COMSATS',
    logo: require('../../assets/universities/comsats.jpg'),
    banner: require('../../assets/universities/comsats.jpg'),
    websiteUrl: 'https://www.comsats.edu.pk',
    about:
      'COMSATS University Islamabad (CUI) is a public research university with multiple campuses across Pakistan, known for strong programs in computer science, engineering, and business.',
    city: 'Islamabad',
    inputMode: 'marks',
    supportsTheoryPracticalSplit: true,
    gradeScaleNote: 'Official HEC Grading Criteria, effective Fall 2021 (Notification CUI-Reg/Notif-/20/2322/2798).',
    order: 1,
  },
  {
    id: 'nutech',
    name: 'National University of Technology',
    shortName: 'NUTECH',
    logo: require('../../assets/universities/nutech.webp'),
    banner: require('../../assets/universities/nutech.webp'),
    websiteUrl: 'https://nutech.edu.pk',
    about:
      'The National University of Technology (NUTECH) is a public university in Islamabad focused on technology, engineering, and applied sciences education.',
    city: 'Islamabad',
    inputMode: 'grade',
    supportsTheoryPracticalSplit: false,
    gradeScaleNote: 'Official NUTECH grade point table (nutech.edu.pk).',
    order: 2,
  },
  {
    id: 'numl',
    name: 'National University of Modern Languages',
    shortName: 'NUML',
    logo: require('../../assets/universities/numl.jpg'),
    banner: require('../../assets/universities/numl.jpg'),
    websiteUrl: 'https://numl.edu.pk',
    about:
      'The National University of Modern Languages (NUML) is a public university in Islamabad renowned for language studies alongside management sciences, IT, and social sciences programs.',
    city: 'Islamabad',
    inputMode: 'marks',
    supportsTheoryPracticalSplit: false,
    gradeScaleNote: 'Official NUML percentage-to-GPA grading table.',
    order: 3,
  },
  {
    id: 'iiui',
    name: 'International Islamic University, Islamabad',
    shortName: 'IIUI',
    logo: require('../../assets/universities/iiui.jpg'),
    banner: require('../../assets/universities/iiui.jpg'),
    websiteUrl: 'https://www.iiu.edu.pk',
    about:
      'International Islamic University, Islamabad (IIUI) is a public university offering a wide range of programs across Islamic studies, sciences, engineering, and management.',
    city: 'Islamabad',
    inputMode: 'marks',
    supportsTheoryPracticalSplit: false,
    gradeScaleNote: 'Official IIUI grading scale.',
    order: 4,
  },
  {
    id: 'riphah',
    name: 'Riphah International University',
    shortName: 'Riphah',
    logo: require('../../assets/universities/riphah.jpg'),
    banner: require('../../assets/universities/riphah.jpg'),
    websiteUrl: 'https://www.riphah.edu.pk',
    about:
      'Riphah International University is a private university with campuses across Pakistan, offering programs in health sciences, engineering, computing, and management.',
    city: 'Islamabad',
    inputMode: 'marks',
    supportsTheoryPracticalSplit: false,
    gradeScaleNote: 'Official Riphah grading criteria (ric.edu.pk), HEC Policy Guidelines.',
    order: 5,
  },
  {
    id: 'fast',
    name: 'National University of Computer and Emerging Sciences (FAST-NUCES)',
    shortName: 'FAST-NUCES',
    logo: require('../../assets/universities/fast.jpg'),
    banner: require('../../assets/universities/fast.jpg'),
    websiteUrl: 'https://nu.edu.pk',
    about:
      'FAST-NUCES is one of Pakistan\u2019s top-ranked private universities for computer science and engineering, with campuses in Islamabad, Karachi, Lahore, Peshawar, and Faisalabad.',
    city: 'Islamabad (multi-campus)',
    inputMode: 'grade',
    supportsTheoryPracticalSplit: false,
    gradeScaleNote: 'Official FAST-NUCES grade point scale.',
    order: 6,
  },
  {
    id: 'nust',
    name: 'National University of Sciences and Technology',
    shortName: 'NUST',
    logo: require('../../assets/universities/nust.jpg'),
    banner: require('../../assets/universities/nust.jpg'),
    websiteUrl: 'https://nust.edu.pk',
    about:
      'The National University of Sciences and Technology (NUST) is a leading public research university in Islamabad, consistently ranked among Pakistan\u2019s top institutions.',
    city: 'Islamabad',
    inputMode: 'grade',
    supportsTheoryPracticalSplit: false,
    gradeScaleNote: 'Standard 11-grade NUST scale.',
    order: 7,
  },
  {
    id: 'air',
    name: 'Air University',
    shortName: 'Air University',
    logo: require('../../assets/universities/air.jpg'),
    banner: require('../../assets/universities/air.jpg'),
    websiteUrl: 'https://au.edu.pk',
    about:
      'Air University is a public university chartered by the Pakistan Air Force, offering programs in engineering, computing, management, and social sciences in Islamabad.',
    city: 'Islamabad',
    inputMode: 'grade',
    supportsTheoryPracticalSplit: false,
    gradeScaleNote: 'Standard 11-grade Air University scale.',
    order: 8,
  },
  {
    id: 'bahria',
    name: 'Bahria University',
    shortName: 'Bahria',
    logo: require('../../assets/universities/bahria.jpg'),
    banner: require('../../assets/universities/bahria.jpg'),
    websiteUrl: 'https://bahria.edu.pk',
    about:
      'Bahria University is a public-sector university chartered by the Pakistan Navy, with campuses in Islamabad, Karachi, and Lahore, offering programs across engineering, management, and computing.',
    city: 'Islamabad (multi-campus)',
    inputMode: 'grade',
    supportsTheoryPracticalSplit: false,
    gradeScaleNote: 'Official Bahria University 7-grade scale.',
    order: 9,
  },
];

export function getUniversityById(id: string): University | undefined {
  return UNIVERSITIES.find((u) => u.id === id);
}

// Defensive fallback for the rare case a stored/routed universityId
// somehow doesn't resolve (corrupted storage, future data migration
// gap). 'foundation' is always present in the static UNIVERSITIES
// array we control, so this can never itself be undefined — used at
// call sites that previously used an unchecked `!` non-null assertion.
export function getUniversityOrFallback(id: string): University {
  return getUniversityById(id) ?? UNIVERSITIES.find((u) => u.id === 'foundation')!;
}

export const UNIVERSITIES_SORTED = [...UNIVERSITIES].sort((a, b) => a.order - b.order);
