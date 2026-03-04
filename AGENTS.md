# Agent notes (PearPass mobile)

## Build system gotchas

- This repo is Expo-managed: there is no committed `android/` directory. Native Gradle/manifest changes are applied during prebuild via config plugins.
- `@expo/config` only auto-detects dynamic configs named `app.config.ts` or `app.config.js`. Because this repo uses `"type": "module"`, `app.config.ts` is used for dynamic config.
- Local config plugins referenced as `./plugins/<name>` must be resolvable via Node resolution. The existing repo pattern is to include a `package.json` with `"main": "app.plugin.js"`.

## F-Droid compatibility hotspots

- `androidx.credentials:credentials-play-services-auth` is injected by `plugins/expo-autofill-plugin/src/android/withAndroidAutofillService.ts`. For F-Droid, prefer flavor/channel gating to remove this dependency.
- Android update check currently scrapes the Play Store and redirects users to Play Store URLs. This must become channel-aware for F-Droid.

