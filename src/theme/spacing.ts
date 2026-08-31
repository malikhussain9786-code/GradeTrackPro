// GradeTrack Pro — Spacing, Radius & Elevation System
// One consistent scale used everywhere so no screen ever improvises
// its own padding/margin — this is what keeps 30+ screens feeling
// like one designer built them.

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

// Safe minimum touch target (Apple HIG / Material both recommend 44-48pt)
export const touchTarget = {
  min: 48,
};

// Elevation presets — shadow color is theme-dependent (passed in at call site)
export const elevation = {
  card: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  raised: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  subtle: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;

// Bottom tab bar height reserve — ensures content never sits under
// the tab bar OR the Android gesture nav bar underneath it.
export const tabBarHeight = 64;
