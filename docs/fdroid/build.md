# F-Droid build channel (Android)

## Channel selection

The build channel is selected with the `PEARPASS_DISTRIBUTION` environment variable.

- `standard` (default): no Android flavors are generated.
- `fdroid`: Android Gradle product flavors are generated (`standard`, `fdroid`).

The selected channel is also exported to the app config as `extra.distribution`.

## Commands

### Standard Android prebuild

```bash
npx expo prebuild --platform android --no-install
```

Expected: generated `android/app/build.gradle` does not contain a `productFlavors` block.

### F-Droid Android prebuild

```bash
npm run fdroid:patches:prebuild
PEARPASS_DISTRIBUTION=fdroid npx expo prebuild --platform android --no-install
```

Expected: generated `android/app/build.gradle` contains `productFlavors { fdroid { ... } }` and an `assembleFdroidRelease` task exists.

### F-Droid APK build (local)

Prerequisites:

- Android SDK installed and configured via `ANDROID_HOME` or `android/local.properties`.

Generate the required Bare bundles:

```bash
npm run bundle-bare
```

```bash
npm run fdroid:patches:prebuild
PEARPASS_DISTRIBUTION=fdroid npx expo prebuild --platform android --no-install
npm run fdroid:patches:build

cd android
ANDROID_HOME=$HOME/Library/Android/sdk \
  GRADLE_USER_HOME=/tmp/pearpass-gradle-home \
  ./gradlew :app:assembleFdroidRelease --no-daemon -Dorg.gradle.vfs.watch=false \
    -Ppearpass.enableAbiSplits=true \
    -Ppearpass.abis=arm64-v8a,armeabi-v7a
```

Expected output path (ABI split):

- `android/app/build/outputs/apk/fdroid/release/app-fdroid-*-release.apk`

## Feature differences (current)

- `fdroid`: excludes `androidx.credentials:credentials-play-services-auth` from the generated Android Gradle dependencies.
