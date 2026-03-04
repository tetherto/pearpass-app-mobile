# ADR-0001: Android F-Droid compatibility audit (Credentials + version check)

## Status

Accepted

## Context

PearPass mobile is an Expo-managed React Native app. The repository does not commit an `android/` directory; native Android changes are applied at build-time via Expo config plugins.

The goal of this ADR is to identify F-Droid compatibility risks and recommend the smallest safe steps to introduce an F-Droid build channel while preserving existing Play Store behavior.

## Findings

### 1) Where `androidx.credentials:credentials-play-services-auth` is declared

The dependency is injected during Expo prebuild by a local config plugin:

- `plugins/expo-autofill-plugin/src/android/withAndroidAutofillService.ts`

It adds the following Gradle dependencies to the generated `android/app/build.gradle`:

- `androidx.credentials:credentials:1.6.0-beta03`
- `androidx.credentials:credentials-play-services-auth:1.6.0-beta03`

No other explicit `com.google.android.gms:*` / Firebase dependencies were found in the repo.

### 2) Where/how it is used in runtime flows

The Android Autofill / Credential Provider feature is implemented in the plugin’s Android template sources and wired via manifest edits.

Manifest integration:

- `plugins/expo-autofill-plugin/src/android/withAndroidManifest.ts`
- `plugins/expo-autofill-plugin/android-template/res/xml/credential_provider_config.xml`

Native service + activities:

- `plugins/expo-autofill-plugin/android-template/java/autofill/service/PearPassCredentialProviderService.java`
- `plugins/expo-autofill-plugin/android-template/java/autofill/ui/AuthenticationActivity.java`
- `plugins/expo-autofill-plugin/android-template/java/autofill/ui/PasskeyRegistrationActivity.java`

The template implements `androidx.credentials.provider.CredentialProviderService` and uses `androidx.credentials.provider.PendingIntentHandler` to parse create/get credential requests.

The presence of `credentials-play-services-auth` indicates that at least one part of the credential flow is intended to use Play Services-backed authentication integration (even if not directly referenced from this repo’s Java source).

### 3) Optional vs required

Based on the current structure, the credentials/autofill functionality is an additive feature provided via the Expo config plugin. The core app runtime (JS/TS) does not require it to launch.

Therefore, for F-Droid an MVP path is to gate/disable this feature at build time (flavor/channel), or to remove only the Play Services-backed dependency from the F-Droid build.

### 4) Current version-check implementation and redirect target

The update check and redirect behavior is currently Play Store specific on Android.

Constants:

- `src/constants/versionCheck.js`
- `packages/pearpass-lib-constants/src/constants/pearpassLinks.js`

Runtime behavior:

- `src/hooks/useVersionCheck.js`
  - On Android, fetches the Play Store HTML and regex-parses a version-like token.
- `src/app/App/index.jsx`
  - If `needsUpdate`, shows a forced update modal.
- `src/containers/Modal/UpdateModalContent/index.jsx`
  - Calls `Linking.openURL(PLAY_STORE_URL)` on Android after a countdown.

### 5) Other likely F-Droid issues spotted opportunistically

- The app’s Android “latest version” source is the Play Store web UI, which is not suitable for F-Droid builds.
- The update prompt currently forces the user into the Play Store on Android, which is explicitly disallowed for F-Droid.

## F-Droid impact assessment

### Credentials / autofill

F-Droid typically requires reproducible builds from source and avoidance of proprietary service dependencies.

The explicit inclusion of `androidx.credentials:credentials-play-services-auth` is a high-risk compatibility point for F-Droid, because it is a Play Services-backed integration and may introduce runtime dependency/behavior that is unavailable on non-GMS devices.

### Version check

The current version check:

- uses Play Store as the authoritative update source for Android
- redirects to Play Store

Both behaviors are incompatible with F-Droid’s distribution model.

## Recommendation (minimal, reversible)

1. Introduce an `fdroid` channel/flavor that is compile-time visible to the app (BuildConfig/resource/manifest placeholder or JS build-time constant).
2. Make version-check behavior channel-aware:
   - For `fdroid`, either disable the forced update modal or redirect to an F-Droid-compatible target.
   - Preserve current behavior for Play/standard builds.
3. Gate Play Services-backed credentials integration for `fdroid` as MVP:
   - Prefer flavor-scoped dependency injection and/or disabling the Expo config plugin for the `fdroid` variant.
   - Only build a non-GMS fallback if gating is insufficient for required functionality.

## Affected files / locations

- Native dependency injection: `plugins/expo-autofill-plugin/src/android/withAndroidAutofillService.ts`
- Manifest injection: `plugins/expo-autofill-plugin/src/android/withAndroidManifest.ts`
- Android template sources: `plugins/expo-autofill-plugin/android-template/**`
- Version check constants: `src/constants/versionCheck.js`
- Version check runtime: `src/hooks/useVersionCheck.js`
- Redirect UI: `src/containers/Modal/UpdateModalContent/index.jsx`
- Store URL constants: `packages/pearpass-lib-constants/src/constants/pearpassLinks.js`
