# Agent notes (PearPass mobile)

## Build system gotchas

- This repo is Expo-managed: there is no committed `android/` directory. Native Gradle/manifest changes are applied during prebuild via config plugins (e.g., `plugins/expo-autofill-plugin`).
- Anything “flavor/channel”-specific for Android must be implemented via one of:
  - Expo config (`app.json` / `app.config.*`) with environment-driven switches.
  - Expo config plugins that can conditionally mutate the generated Android project.

## F-Droid compatibility hotspots

- `androidx.credentials:credentials-play-services-auth` is injected by `plugins/expo-autofill-plugin/src/android/withAndroidAutofillService.ts`. For F-Droid, prefer flavor/channel gating to remove this dependency.
- Android update check currently scrapes the Play Store and redirects users to Play Store URLs. This must become channel-aware for F-Droid.
