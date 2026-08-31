// GradeTrack Pro — Typography System
// The mockups use a serif display face for the "GradeTrack PK" wordmark
// and a clean grotesk/sans for everything else. We mirror that split:
// PlayfairDisplay (serif, premium/editorial) for hero numbers & wordmark,
// Inter (sans) for all UI text — both free, both load fast via expo-font.

export const fontFamily = {
  display: 'PlayfairDisplay_700Bold',
  displaySemibold: 'PlayfairDisplay_600SemiBold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemibold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
};

export const type = {
  // App wordmark / hero splash
  wordmark: { fontFamily: fontFamily.display, fontSize: 32, lineHeight: 38 },

  // Big result numbers (SGPA 3.67, CGPA 3.48, etc.)
  heroNumber: { fontFamily: fontFamily.display, fontSize: 44, lineHeight: 50 },
  heroNumberLarge: { fontFamily: fontFamily.display, fontSize: 56, lineHeight: 62 },

  // Screen titles ("Add Course", "SGPA Result")
  h1: { fontFamily: fontFamily.sansBold, fontSize: 20, lineHeight: 26 },
  h2: { fontFamily: fontFamily.sansSemibold, fontSize: 17, lineHeight: 23 },
  h3: { fontFamily: fontFamily.sansSemibold, fontSize: 15, lineHeight: 21 },

  // Body text
  body: { fontFamily: fontFamily.sans, fontSize: 14, lineHeight: 20 },
  bodyMedium: { fontFamily: fontFamily.sansMedium, fontSize: 14, lineHeight: 20 },
  bodySemibold: { fontFamily: fontFamily.sansSemibold, fontSize: 14, lineHeight: 20 },

  // Small / caption / labels
  caption: { fontFamily: fontFamily.sans, fontSize: 12, lineHeight: 16 },
  captionMedium: { fontFamily: fontFamily.sansMedium, fontSize: 12, lineHeight: 16 },
  micro: { fontFamily: fontFamily.sansMedium, fontSize: 10, lineHeight: 13 },

  // Buttons
  button: { fontFamily: fontFamily.sansSemibold, fontSize: 15, lineHeight: 20 },
} as const;
