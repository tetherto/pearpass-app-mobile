#!/usr/bin/env bash
# Patches the Expo-generated android project for F-Droid builds.
# Run from the repo root.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
target_abi="${1:-}"

cd "$repo_root/android"

# --- Remove Google Play / Firebase / ML Kit dependencies ---

google_dep_re='com\.google\.android\.gms|com\.google\.mlkit|com\.google\.firebase|com\.google\.android\.datatransport|play-services-|firebase-|googleid|credentials-play-services-auth|barcode-scanning|camera-mlkit-vision'

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

# --- Gradle build config ---

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

# --- Vision Camera: stub out ML Kit code scanner ---

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

patch("com/mrousavy/camera/core/CameraSession.kt", [
    (r'import com\.google\.mlkit\.vision\.barcode\.common\.Barcode\n?', ''),
    (r'List<Barcode>', 'List<Any>'),
])

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

patch("com/mrousavy/camera/react/CameraView+Events.kt", [
    (r'import com\.google\.mlkit\.vision\.barcode\.common\.Barcode\n?', ''),
    (r'fun CameraView\.invokeOnCodeScanned\(barcodes: List<Barcode>,',
     'fun CameraView.invokeOnCodeScanned(barcodes: List<Any>,'),
    (r'barcodes\.forEach \{ barcode ->.*?codes\.pushMap\(code\)\s*\}',
     '// code scanner stripped for fdroid', re.DOTALL),
])

patch("com/mrousavy/camera/react/CameraView.kt", [
    (r'import com\.google\.mlkit\.vision\.barcode\.common\.Barcode\n?', ''),
    (r'List<Barcode>', 'List<Any>'),
])

print("Done stubbing ML Kit references")
PYSTUB

# --- Proguard rules ---

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
