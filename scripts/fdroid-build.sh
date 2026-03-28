#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
phase="${1:-build}"

cd "$repo_root"

write_swarmconf_stub() {
  mkdir -p node_modules/@tetherto/swarmconf
  cat > node_modules/@tetherto/swarmconf/package.json <<'EOF'
{
  "name": "@tetherto/swarmconf",
  "version": "1.0.0-fdroid",
  "main": "index.js"
}
EOF
  cat > node_modules/@tetherto/swarmconf/index.js <<'EOF'
module.exports = class SwarmConfig {
  constructor() {
    this.current = { version: 0, blindRelays: [], blindPeers: [] }
  }
  async ready() {
    return this
  }
}
EOF
}

write_expo_camera_stub() {
  rm -rf node_modules/expo-camera
  mkdir -p node_modules/expo-camera
  cat > node_modules/expo-camera/package.json <<'EOF'
{
  "name": "expo-camera",
  "version": "16.1.11-fdroid",
  "main": "index.js",
  "expo": {
    "plugin": "./app.plugin.js"
  }
}
EOF
  cat > node_modules/expo-camera/app.plugin.js <<'EOF'
module.exports = (config) => config
EOF
  cat > node_modules/expo-camera/index.js <<'EOF'
const PermissionStatus = {
  GRANTED: "granted",
  DENIED: "denied"
}

const Camera = {
  async getCameraPermissionsAsync() {
    return { status: PermissionStatus.DENIED }
  },
  async requestCameraPermissionsAsync() {
    return { status: PermissionStatus.DENIED, canAskAgain: false }
  },
  async scanFromURLAsync() {
    return []
  }
}

function CameraView() {
  return null
}

module.exports = {
  Camera,
  CameraView,
  PermissionStatus
}
EOF
}

run_prebuild() {
  npm ci --install-links --legacy-peer-deps --no-audit --no-fund
  write_swarmconf_stub
  write_expo_camera_stub
  npm run fdroid:patches:prebuild
  npm run build
  ./node_modules/.bin/expo prebuild --platform android --clean --no-install
  perl -0777 -i -pe "s/def reactNativeAndroidDir = new File\\([\\s\\S]*?\\n\\)\\n\\n//g" android/build.gradle
  perl -0777 -i -pe "s/\\n\\s*maven \\{\\n\\s*\\/\\/ All of React Native[^\\n]*\\n\\s*url\\(reactNativeAndroidDir\\)\\n\\s*\\}\\n/\\n/g" android/build.gradle
  perl -i -ne "print unless /credentials-play-services-auth|play-services-auth|googleid|play-services-fido|firebase-messaging/" android/app/build.gradle
  rm -f android/app/debug.keystore
}

remove_messaging_classes() {
  python3 <<'PY' 2>/dev/null || true
import glob
import shutil
import zipfile

for jar_path in glob.glob("../node_modules/react-native-bare-kit/**/classes.jar", recursive=True):
    temp_path = jar_path + ".tmp"
    with zipfile.ZipFile(jar_path) as source_zip, zipfile.ZipFile(temp_path, "w") as target_zip:
        for entry in source_zip.infolist():
            if "MessagingService" not in entry.filename:
                target_zip.writestr(entry, source_zip.read(entry.filename))
    shutil.move(temp_path, jar_path)
PY
}

ensure_java_home() {
  if [ -z "${JAVA_HOME:-}" ] || [ ! -x "${JAVA_HOME}/bin/java" ]; then
    JAVA_HOME="$(find /usr/lib/jvm -maxdepth 1 -type d -name 'java-21*' | head -n 1)"
  fi
  if [ -z "${JAVA_HOME:-}" ] || [ ! -x "${JAVA_HOME}/bin/java" ]; then
    echo "Java 21 not found in /usr/lib/jvm" >&2
    exit 1
  fi
  export JAVA_HOME
}

run_build() {
  if [ ! -f android/gradlew ]; then
    ./node_modules/.bin/expo prebuild --platform android --clean --no-install
  fi
  npm run fdroid:patches:build
  npm run bundle-bare
  test -f bundles/app-android.bundle.js
  npm run lingui:compile
  test -f src/locales/en/messages.js
  if [ -d node_modules/bare-link/prebuilds ]; then
    find node_modules/bare-link/prebuilds -type f -name patchelf -exec chmod +x {} +
  fi
  if [ -n "${ANDROID_HOME:-}" ]; then
    printf 'sdk.dir=%s\n' "$ANDROID_HOME" > android/local.properties
  fi

  cd android
  perl -i -ne "print unless /credentials-play-services-auth|play-services-auth|googleid|play-services-fido|firebase-messaging/" app/build.gradle
  find . ../node_modules -name '*.gradle' -type f -exec perl -i -ne "print unless /firebase-messaging|com\\.google\\.firebase\\.messaging/" {} +
  find . ../node_modules -name '*.gradle.kts' -type f -exec perl -i -ne "print unless /firebase-messaging|com\\.google\\.firebase\\.messaging/" {} +
  remove_messaging_classes
  rm -f app/google-services.json
  perl -i -ne "print unless /com\\.google\\.gms\\.google-services/" app/build.gradle build.gradle
  if ! grep -q "fdroid-root-excludes" build.gradle; then
    printf '\n// fdroid-root-excludes\nsubprojects {\n  configurations.all {\n    exclude group: "com.google.firebase"\n    exclude group: "com.google.firebase", module: "firebase-messaging"\n  }\n}\n' >> build.gradle
  fi
  if ! grep -q "fdroid-global-excludes" app/build.gradle; then
    printf '\n// fdroid-global-excludes\nconfigurations.all {\n  exclude group: "com.google.firebase"\n  exclude group: "com.google.firebase", module: "firebase-messaging"\n  exclude group: "com.google.android.gms", module: "play-services-fido"\n  exclude group: "com.google.android.gms", module: "play-services-auth"\n  exclude group: "androidx.credentials", module: "credentials-play-services-auth"\n}\n' >> app/build.gradle
  fi
  if ! grep -q "dependenciesInfo {" app/build.gradle; then
    perl -0777 -i -pe "s/android\\s*\\{\\n/android {\\n    dependenciesInfo {\\n        includeInApk = false\\n        includeInBundle = false\\n    }\\n/s" app/build.gradle
  fi
  if ! grep -q '^android.enableDependencyInfoInApks=false$' gradle.properties; then
    printf '\nandroid.enableDependencyInfoInApks=false\n' >> gradle.properties
  fi
  if ! grep -q '^android.enableDependencyInfoInApk=false$' gradle.properties; then
    printf 'android.enableDependencyInfoInApk=false\n' >> gradle.properties
  fi
  if ! grep -q '^android.enableDependencyInfoInBundle=false$' gradle.properties; then
    printf 'android.enableDependencyInfoInBundle=false\n' >> gradle.properties
  fi
  ensure_java_home
  JAVA_HOME="$JAVA_HOME" GRADLE_USER_HOME=/tmp/pearpass-gradle-home ./gradlew :app:clean :app:assembleRelease --no-daemon -Dorg.gradle.vfs.watch=false -Dorg.gradle.java.installations.auto-download=false -Dorg.gradle.java.installations.auto-detect=false -Dorg.gradle.java.installations.paths="$JAVA_HOME" -Pandroid.enableDependencyInfoInApk=false -Pandroid.enableDependencyInfoInBundle=false
}

case "$phase" in
  prebuild)
    run_prebuild
    ;;
  build)
    run_build
    ;;
  all)
    run_prebuild
    run_build
    ;;
  *)
    echo "Usage: bash scripts/fdroid-build.sh [prebuild|build|all]" >&2
    exit 64
    ;;
esac
