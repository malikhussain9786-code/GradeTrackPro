// GradeTrack Pro — Layout Safety Constants
// Central place for anything related to "don't overlap system UI."
// Actual safe-area insets come from react-native-safe-area-context
// at the component level (useSafeAreaInsets) — these are the extra
// buffers we add ON TOP of that, matched to the mockup spacing.

export const layoutSafety = {
  // Extra breathing room below the tab bar content, above the
  // Android 3-button nav / gesture pill and iOS home indicator.
  bottomContentPadding: 24,

  // Minimum gap between any tappable element and the screen edge.
  edgeGutter: 16,

  // Minimum gap between two adjacent tappable elements (prevents
  // fat-finger mis-taps on small Android phones).
  tapGutter: 8,

  // Header height (matches "Add Course" / "SGPA Result" style bar
  // in the mockups) before safe-area top inset is added.
  headerHeight: 52,

  // On 7-inch tablets, phone-proportioned cards/forms stretched to
  // full width look wrong (huge line lengths, sparse spacing). Every
  // screen's scrollable content caps at this width and centers itself
  // — invisible on phones (screens are narrower than this anyway),
  // but keeps tablets looking like a deliberately-designed layout
  // rather than a phone screen stretched thin.
  maxContentWidth: 640,
};
