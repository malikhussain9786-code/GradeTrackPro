# GradeTrack Pro — Build Instructions

No backend, no `.env` file, no Supabase — everything runs locally on your
device via AsyncStorage. This document is everything you need to go from
this project folder to an installable APK and a Play Store-ready AAB.

## 1. One-time setup

```bash
# Install dependencies (--legacy-peer-deps avoids peer dependency
# conflicts with some Expo SDK 54 packages — always use this flag
# when installing or adding packages in this project)
npm install --legacy-peer-deps

# Install EAS CLI globally (if you don't have it)
npm install -g eas-cli

# Log in to your Expo account (free — create one at expo.dev if needed)
eas login

# Link this project to your own EAS project
eas init
```

`eas init` will print a project ID — paste it into `app.json` under
`expo.extra.eas.projectId`, replacing `REPLACE_WITH_YOUR_EAS_PROJECT_ID`.

## 2. Test locally first (Expo Go)

```bash
npx expo start
```

Scan the QR code with Expo Go (SDK 54) on your Android phone. This is the
fastest way to test every screen before building a real APK.

## 3. Build a testing APK (installable directly, no Play Store needed)

```bash
eas build --platform android --profile preview
```

This produces a `.apk` file you can download from the EAS dashboard link
printed in your terminal, transfer to any Android phone, and install
directly (enable "Install from unknown sources" if prompted). Use this to
test on real devices before submitting anywhere.

## 4. Build the Play Store submission file (AAB)

```bash
eas build --platform android --profile production
```

This produces a `.aab` (Android App Bundle) — this is the file format
Google Play requires for new app submissions (not APK).

### App signing

EAS manages your signing keystore automatically and securely by default
— you don't need to create or manage a keystore yourself. The first time
you run a production build, EAS will offer to generate one and store it
for you. If you'd rather manage your own keystore, run
`eas credentials` to configure that instead.

## 5. Before you upload — required Play Console setup

1. Create a Google Play Console developer account (one-time $25 fee).
2. Create a new app, package name: `com.gradetrackpro.app`
3. Go to **App content** and fill in:
   - **Privacy Policy**: host the content in `PRIVACY_POLICY.md` somewhere
     public (a free GitHub Pages site works well) and paste that URL.
   - **Data Safety**: answers are pre-written in `PLAY_STORE_LISTING.md`
     — the short version is "no data collected, everything stays on
     the user's device."
   - **Content rating questionnaire**: answer honestly — this app has
     no ads, no user-generated content shared with others, no violence.
     Should rate as "Everyone."
4. Go to **Store presence → Main store listing** and paste in the app
   name, short description, and full description from
   `PLAY_STORE_LISTING.md`.
5. Upload screenshots (see `PLAY_STORE_LISTING.md` for what to capture)
   and the feature graphic (1024×500).
6. Go to **Production → Create new release**, upload the `.aab` file
   from Step 4, and submit for review.

## 6. Updating the app after launch

For every new version:

1. Bump `expo.version` in `app.json` (e.g. `1.0.0` → `1.0.1`).
2. `android.versionCode` is set to auto-increment via `eas.json`'s
   `"autoIncrement": true` on the production profile — EAS handles this
   for you automatically on each production build.
3. Run `eas build --platform android --profile production` again.
4. Upload the new `.aab` to Play Console → Production → Create new release.

## Troubleshooting

- **"Cannot find module 'react-native-worklets/plugin'"** — already
  fixed in this project (the dependency is in `package.json`), but if
  you ever see this again after modifying dependencies, run:
  `npm install react-native-worklets@0.5.1 --legacy-peer-deps`
- **Metro bundler errors on `npm install`** — always use
  `--legacy-peer-deps` when installing new packages in this project,
  since some Expo SDK 54 peer dependency ranges are still catching up.
- **Fonts look wrong / missing** — confirm `@expo-google-fonts/inter`
  and `@expo-google-fonts/playfair-display` are present in
  `node_modules` (`npm install` should have handled this).
