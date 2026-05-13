#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
phase="${1:-build}"
target_abi="${2:-}"

cd "$repo_root"

export PEARPASS_DISTRIBUTION=fdroid

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

google_dep_re='com\.google\.android\.gms|com\.google\.mlkit|com\.google\.firebase|com\.google\.android\.datatransport|play-services-|firebase-|googleid|credentials-play-services-auth|barcode-scanning|camera-mlkit-vision'

run_prebuild() {
  npm cache clean --force 2>/dev/null || true
  npm ci --legacy-peer-deps --no-audit --no-fund
  write_swarmconf_stub
  npm run fdroid:patches:prebuild
  npm run build
  ./node_modules/.bin/expo prebuild --platform android --clean --no-install
  perl -0777 -i -pe "s/def reactNativeAndroidDir = new File\\([\\s\\S]*?\\n\\)\\n\\n//g" android/build.gradle
  perl -0777 -i -pe "s/\\n\\s*maven \\{\\n\\s*\\/\\/ All of React Native[^\\n]*\\n\\s*url\\(reactNativeAndroidDir\\)\\n\\s*\\}\\n/\\n/g" android/build.gradle
  perl -i -ne "print unless /$google_dep_re/" android/app/build.gradle
}

ensure_java_home() {
  if [ -n "${JAVA_HOME:-}" ] && [ -x "${JAVA_HOME}/bin/java" ]; then
    export JAVA_HOME
    return
  fi

  if [ -x /usr/libexec/java_home ]; then
    JAVA_HOME="$(
      /usr/libexec/java_home -v 17 2>/dev/null \
        || /usr/libexec/java_home 2>/dev/null \
        || true
    )"
  fi

  if { [ -z "${JAVA_HOME:-}" ] || [ ! -x "${JAVA_HOME}/bin/java" ]; } && [ -d /usr/lib/jvm ]; then
    JAVA_HOME="$(
      find /usr/lib/jvm -maxdepth 1 -type d \( -name 'java-17*' -o -name '*openjdk-17*' \) \
        | head -n 1
    )"
  fi

  if [ -z "${JAVA_HOME:-}" ] || [ ! -x "${JAVA_HOME}/bin/java" ]; then
    java_bin="$(command -v java || true)"
    if [ -n "$java_bin" ]; then
      JAVA_HOME="$(
        python3 - "$java_bin" <<'PY'
import os
import sys

print(os.path.dirname(os.path.dirname(os.path.realpath(sys.argv[1]))))
PY
      )"
    fi
  fi

  if [ -z "${JAVA_HOME:-}" ] || [ ! -x "${JAVA_HOME}/bin/java" ]; then
    echo "Unable to determine JAVA_HOME automatically" >&2
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

  # Work around Node 22 TypeScript stripping conflict with Expo packages
  export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--no-experimental-strip-types"

  cd android
  perl -i -ne "print unless /$google_dep_re/" app/build.gradle
  # Produce unsigned APKs — F-Droid signs with its own key
  rm -f app/debug.keystore
  sed -i.bak 's/signingConfig signingConfigs.debug/signingConfig null/' app/build.gradle && rm -f app/build.gradle.bak
  perl -0777 -i -pe 's/\s*signingConfigs\s*\{\s*debug\s*\{[^}]*\}\s*\}//' app/build.gradle
  find . ../node_modules -name '*.gradle' -type f -exec perl -i -ne "print unless /$google_dep_re/" {} +
  find . ../node_modules -name '*.gradle.kts' -type f -exec perl -i -ne "print unless /$google_dep_re/" {} +
  rm -f app/google-services.json
  perl -i -ne "print unless /com\\.google\\.gms\\.google-services/" app/build.gradle build.gradle
  if ! grep -q "fdroid-root-excludes" build.gradle; then
    cat >> build.gradle <<'ROOTEXCL'

// fdroid-root-excludes
allprojects {
  configurations.all {
    exclude group: "com.google.firebase"
    exclude group: "com.google.android.gms"
    exclude group: "com.google.mlkit"
    exclude group: "com.google.android.datatransport"
    exclude group: "androidx.credentials", module: "credentials-play-services-auth"
  }
}
ROOTEXCL
  fi
  if ! grep -q "fdroid-global-excludes" app/build.gradle; then
    printf '\n// fdroid-global-excludes\nconfigurations.matching { it.name.contains("Runtime") || it.name.contains("runtime") }.all {\n  exclude group: "com.google.firebase"\n  exclude group: "com.google.android.gms"\n  exclude group: "com.google.mlkit"\n  exclude group: "com.google.android.datatransport"\n  exclude group: "androidx.credentials", module: "credentials-play-services-auth"\n}\n' >> app/build.gradle
  fi
  if ! grep -q "dependenciesInfo {" app/build.gradle; then
    perl -0777 -i -pe "s/android\\s*\\{\\n/android {\\n    dependenciesInfo {\\n        includeInApk = false\\n        includeInBundle = false\\n    }\\n/s" app/build.gradle
  fi
  if ! grep -q "splits {" app/build.gradle; then
    if [ -n "$target_abi" ]; then
      abi_include="\"$target_abi\""
    else
      abi_include="\"arm64-v8a\", \"armeabi-v7a\", \"x86\", \"x86_64\""
    fi
    perl -0777 -i -pe "s/android\\s*\\{\\n/android {\\n    splits {\\n        abi {\\n            enable true\\n            reset()\\n            include $abi_include\\n            universalApk false\\n        }\\n    }\\n/s" app/build.gradle
    # Assign unique versionCode per ABI so F-Droid can serve the correct APK
    cat >> app/build.gradle <<'VCODE'

// Per-ABI versionCode: base * 10 + offset
android {
    def abiCodes = ["armeabi-v7a": 1, "arm64-v8a": 2, "x86": 3, "x86_64": 4]
    applicationVariants.configureEach { variant ->
        variant.outputs.each { output ->
            def abi = output.getFilter(com.android.build.OutputFile.ABI)
            if (abi != null) {
                output.versionCodeOverride = variant.versionCode * 10 + (abiCodes[abi] ?: 0)
            }
        }
    }
}
VCODE
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
  if ! grep -q '^VisionCamera_enableCodeScanner=false$' gradle.properties; then
    printf 'VisionCamera_enableCodeScanner=false\n' >> gradle.properties
  fi
  # Disable lint vital checks via property instead of -x task exclusion.
  # Using -x lintVitalFdroidRelease breaks Gradle's task dependency graph,
  # causing codegen tasks for library modules to be skipped.
  if ! grep -q '^android.lint.checkReleaseBuilds=false$' gradle.properties; then
    printf 'android.lint.checkReleaseBuilds=false\n' >> gradle.properties
  fi
  # Remove vision-camera's built-in code scanner (uses Google ML Kit)
  # Stub out all files that reference com.google.mlkit
  python3 - ../node_modules/react-native-vision-camera/android/src/main/java <<'PYSTUB'
import re, os, sys
base = sys.argv[1]

def write(path, content):
    full = os.path.join(base, path)
    with open(full, 'w') as f:
        f.write(content)
    print(f"  Stubbed {path}")

def patch(path, replacements):
    full = os.path.join(base, path)
    with open(full, 'r') as f:
        content = f.read()
    for item in replacements:
        if len(item) == 3:
            old, new, flags = item
        else:
            old, new = item
            flags = 0
        content = re.sub(old, new, content, flags=flags)
    with open(full, 'w') as f:
        f.write(content)
    print(f"  Patched {path}")

# 1. CodeScannerPipeline.kt - complete stub
write("com/mrousavy/camera/core/CodeScannerPipeline.kt", """
package com.mrousavy.camera.core
import androidx.camera.core.ImageAnalysis.Analyzer
import androidx.camera.core.ImageProxy
import java.io.Closeable
class CodeScannerPipeline(val configuration: CameraConfiguration.CodeScanner, val callback: CameraSession.Callback) : Closeable, Analyzer {
  override fun analyze(imageProxy: ImageProxy) { imageProxy.close() }
  override fun close() {}
}
""")

# 2. CameraSession.kt - remove Barcode import, replace List<Barcode> with List<Any>
patch("com/mrousavy/camera/core/CameraSession.kt", [
    (r'import com\.google\.mlkit\.vision\.barcode\.common\.Barcode\n?', ''),
    (r'List<Barcode>', 'List<Any>'),
])

# 3. CodeType.kt - replace toBarcodeType and fromBarcodeType
write("com/mrousavy/camera/core/types/CodeType.kt", """
package com.mrousavy.camera.core.types
import com.mrousavy.camera.core.CodeTypeNotSupportedError
import com.mrousavy.camera.core.InvalidTypeScriptUnionError

enum class CodeType(override val unionValue: String) : JSUnionValue {
  CODE_128("code-128"), CODE_39("code-39"), CODE_93("code-93"), CODABAR("codabar"),
  EAN_13("ean-13"), EAN_8("ean-8"), ITF("itf"), UPC_E("upc-e"), UPC_A("upc-a"),
  QR("qr"), PDF_417("pdf-417"), AZTEC("aztec"), DATA_MATRIX("data-matrix"), UNKNOWN("unknown");

  fun toBarcodeType(): Int = ordinal

  companion object : JSUnionValue.Companion<CodeType> {
    fun fromBarcodeType(barcodeType: Int): CodeType = entries.getOrElse(barcodeType) { UNKNOWN }

    override fun fromUnionValue(unionValue: String?): CodeType =
      entries.find { it.unionValue == unionValue }
        ?: throw InvalidTypeScriptUnionError("codeType", unionValue ?: "(null)")
  }
}
""")

# 4. CameraView+Events.kt - stub invokeOnCodeScanned
patch("com/mrousavy/camera/react/CameraView+Events.kt", [
    (r'import com\.google\.mlkit\.vision\.barcode\.common\.Barcode\n?', ''),
    (r'fun CameraView\.invokeOnCodeScanned\(barcodes: List<Barcode>,',
     'fun CameraView.invokeOnCodeScanned(barcodes: List<Any>,'),
    # Replace entire forEach block that accesses barcode.format etc with no-op
    (r'barcodes\.forEach \{ barcode ->.*?codes\.pushMap\(code\)\s*\}',
     '// code scanner stripped for fdroid', re.DOTALL),
])

# 5. CameraView.kt - remove Barcode import, replace callback signature
patch("com/mrousavy/camera/react/CameraView.kt", [
    (r'import com\.google\.mlkit\.vision\.barcode\.common\.Barcode\n?', ''),
    (r'List<Barcode>', 'List<Any>'),
])

print("Done stubbing ML Kit references")
PYSTUB
  if ! grep -q 'fdroid-dontwarn' app/proguard-rules.pro; then
    cat >> app/proguard-rules.pro <<'PROGUARD'

# fdroid-dontwarn: suppress warnings for excluded Google deps
-dontwarn com.google.mlkit.**
-dontwarn com.google.android.gms.**
-dontwarn com.google.firebase.**
-dontwarn com.google.android.datatransport.**
-dontwarn java.awt.**
PROGUARD
  fi
  ensure_java_home
  # Unset NODE_OPTIONS before invoking Gradle. settings.gradle spawns small
  # node processes (autolinking) that inherit this variable. On the F-Droid
  # build server the --max-old-space-size value can exceed available memory,
  # causing the OOM killer to SIGKILL node (exit code 9).
  unset NODE_OPTIONS
  # Skip :app:clean — each F-Droid build starts from a fresh checkout so there's
  # nothing to clean. Removing it allows -PreactNativeArchitectures to work in a
  # single gradle invocation without breaking codegen for library modules.
  local abi_flag=""
  if [ -n "$target_abi" ]; then
    abi_flag="-PreactNativeArchitectures=$target_abi"
  fi
  JAVA_HOME="$JAVA_HOME" GRADLE_USER_HOME=/tmp/pearpass-gradle-home ./gradlew \
    :app:assembleFdroidRelease \
    --no-daemon --parallel --build-cache \
    -Dorg.gradle.vfs.watch=false \
    -Dorg.gradle.java.installations.auto-download=false \
    -Dorg.gradle.java.installations.auto-detect=false \
    -Dorg.gradle.java.installations.paths="$JAVA_HOME" \
    -Pandroid.enableDependencyInfoInApk=false \
    -Pandroid.enableDependencyInfoInBundle=false \
    -Pandroid.enableProguardInReleaseBuilds=true \
    $abi_flag
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
    echo "Usage: bash scripts/fdroid-build.sh [prebuild|build|all] [abi]" >&2
    echo "  abi: arm64-v8a, armeabi-v7a, x86, x86_64 (optional, builds all if omitted)" >&2
    exit 64
    ;;
esac
