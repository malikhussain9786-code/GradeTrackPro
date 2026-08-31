# GradeTrack Pro

A premium, accurate SGPA & CGPA calculator built for Pakistani university
students. No login, no signup, no ads — fully offline, with official
verified grading systems for 10 universities.

Built with Expo SDK 54, React Native, and TypeScript.

## Supported Universities

Foundation University Islamabad, COMSATS University Islamabad, NUTECH,
NUML, International Islamic University Islamabad (IIUI), Riphah
International University, FAST-NUCES, NUST, Air University, Bahria
University — each using their real official grading scale, sourced
directly from university documents (not generic assumptions).

## Quick Start

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (SDK 54) to run on your phone. See
**`BUILD_INSTRUCTIONS.md`** for producing a real APK (for testing) or
AAB (for Play Store submission).

## Documentation

- **`BUILD_INSTRUCTIONS.md`** — exact commands to build a testable APK
  and a Play Store-ready AAB, plus first-time EAS setup and how to push
  future updates.
- **`PRIVACY_POLICY.md`** — required for Play Store submission; host
  this content publicly and link it in Play Console.
- **`PLAY_STORE_LISTING.md`** — ready-to-paste app title, descriptions,
  Data Safety form answers, and a checklist of what screenshots to
  capture before submitting.

## Project Structure

```
src/
  types/        Core data models (University, Subject, Semester, etc.)
  data/         The 10 universities' official info + grade scales
  engine/       All calculation logic (SGPA, CGPA, GPA Planner, validation)
  storage/      AsyncStorage layer — semesters, history, settings, backup
  theme/        Colors, typography, spacing — the design system
  components/   Reusable UI building blocks
  screens/      Every screen, grouped by feature area
  navigation/   Screen routing (root stack + bottom tabs)
  hooks/        Reusable React hooks (e.g. subject list management)
  utils/        Small pure helpers (id generation, date formatting, math)

assets/
  universities/ Campus photos for all 10 universities
  branding/     Source logo files
  playstore/    Pre-made 512×512 icon and 1024×500 feature graphic
```

## What's Already Verified

- **Calculation accuracy**: every university's grading logic was
  stress-tested against hand calculations and the official documents
  provided, including edge cases (decimal marks, boundary percentages,
  interpolated grade bands, grade-select-only universities).
- **Build integrity**: the app has been successfully bundled through
  Metro for both Android and iOS in this environment, confirming no
  broken imports or missing native dependencies.
- **Responsive layout**: content is capped at a sensible max-width on
  tablet-sized screens; all list items truncate gracefully rather than
  overflow on narrow phones.

## No Backend Required

Everything runs locally on-device via AsyncStorage. There is no `.env`
file, no server, no Supabase, no API keys — the zip you have is the
complete app. Run `npm install`, then follow `BUILD_INSTRUCTIONS.md`.

## License

See `LICENSE`.

