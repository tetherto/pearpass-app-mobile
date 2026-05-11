#!/usr/bin/env bash
#
# Build bare-kit and all linked native addons from source for Android,
# replacing the prebuilt artifacts that ship in npm packages.
#
# F-Droid forbids prebuilt binaries in node_modules, so this script
# reproduces what `bare-link` would have placed by compiling each
# addon's CMake project with the Android NDK.
#
# Outputs (overwriting prebuilts in node_modules):
#   node_modules/react-native-bare-kit/android/libs/bare-kit/jni/<abi>/libbare-kit.so
#   node_modules/react-native-bare-kit/android/libs/bare-kit/classes.jar
#   node_modules/<addon>/prebuilds/<android-host>/<addon>.bare
#
# Addon `.bare` files are placed where bare-link expects them. Gradle's
# preBuild → link.mjs → bare-link will then handle the ELF SONAME/DT_NEEDED
# rewriting and copy them to react-native-bare-kit/android/src/main/addons/.
#
# Required environment:
#   ANDROID_NDK_ROOT (or ANDROID_NDK_HOME) — pointing at NDK r27+
#   ANDROID_HOME (or ANDROID_SDK_ROOT)     — for android.jar (classes.jar build)
#
# Optional positional argument:
#   $1                 single ABI to build (arm64-v8a | armeabi-v7a | x86 | x86_64).
#                      When omitted, builds all four (default for local dev). The
#                      F-Droid recipe passes the ABI of the current versionCode so
#                      each build only compiles what it needs.
#
# Optional environment:
#   BARE_KIT_VERSION   git ref to clone (default: v2.0.0 — matches the
#                      prebuilts shipped by react-native-bare-kit 0.13.0)
#   BARE_BUILD_DIR     workspace root    (default: <project>/.bare-build)
#   ANDROID_PLATFORM   min API level     (default: 29)
#   ABIS               space-separated   (default: "arm64-v8a armeabi-v7a x86 x86_64";
#                                         overridden by $1 when given)
#   JOBS               cmake parallelism (default: nproc)

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BARE_KIT_VERSION="${BARE_KIT_VERSION:-v2.0.0}"
BARE_BUILD_DIR="${BARE_BUILD_DIR:-$PROJECT_DIR/.bare-build}"
ANDROID_PLATFORM="${ANDROID_PLATFORM:-29}"
ABIS="${ABIS:-arm64-v8a armeabi-v7a x86 x86_64}"
JOBS="${JOBS:-$(getconf _NPROCESSORS_ONLN 2>/dev/null || echo 4)}"

if [ "${1:-}" != "" ]; then
  case "$1" in
    arm64-v8a|armeabi-v7a|x86|x86_64) ABIS="$1" ;;
    *) printf '[bare-build] ERROR: unknown ABI argument: %s\n' "$1" >&2; exit 1 ;;
  esac
fi

NDK="${ANDROID_NDK_ROOT:-${ANDROID_NDK_HOME:-}}"
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"

RNBK_DIR="$PROJECT_DIR/node_modules/react-native-bare-kit"
RNBK_LIBS="$RNBK_DIR/android/libs/bare-kit"
BARE_KIT_SRC="$BARE_BUILD_DIR/bare-kit"

log()   { printf '[bare-build] %s\n' "$*"; }
fatal() { printf '[bare-build] ERROR: %s\n' "$*" >&2; exit 1; }

# Portable replacement for `install -D src dst` (GNU-only flag).
install_to() {
  local src="$1" dst="$2"
  mkdir -p "$(dirname "$dst")"
  cp -f "$src" "$dst"
}

check_prereqs() {
  [ -d "$RNBK_DIR" ]    || fatal "react-native-bare-kit not in node_modules; run 'npm ci' first"
  [ -d "$PROJECT_DIR/node_modules/bare-link" ] \
                        || fatal "bare-link not in node_modules; run 'npm ci' first"
  [ -n "$NDK" ]         || fatal "ANDROID_NDK_ROOT (or ANDROID_NDK_HOME) is not set"
  [ -d "$NDK" ]         || fatal "NDK directory does not exist: $NDK"
  [ -n "$SDK" ]         || fatal "ANDROID_HOME (or ANDROID_SDK_ROOT) is not set"
  [ -d "$SDK" ]         || fatal "SDK directory does not exist: $SDK"
  command -v cmake >/dev/null || fatal "cmake not found in PATH"
  command -v node  >/dev/null || fatal "node not found in PATH"
  command -v npm   >/dev/null || fatal "npm not found in PATH"
  command -v git   >/dev/null || fatal "git not found in PATH"
  command -v javac >/dev/null || fatal "javac not found in PATH"
  command -v jar   >/dev/null || fatal "jar not found in PATH"
}

ensure_bare_kit_clone() {
  if [ -d "$BARE_KIT_SRC/.git" ]; then
    log "bare-kit clone exists at $BARE_KIT_SRC; pulling $BARE_KIT_VERSION"
    git -C "$BARE_KIT_SRC" fetch --depth=1 origin "$BARE_KIT_VERSION"
    git -C "$BARE_KIT_SRC" checkout --force FETCH_HEAD
  else
    log "cloning bare-kit @ $BARE_KIT_VERSION → $BARE_KIT_SRC"
    mkdir -p "$BARE_BUILD_DIR"
    git clone --depth=1 --branch "$BARE_KIT_VERSION" \
      https://github.com/holepunchto/bare-kit.git "$BARE_KIT_SRC"
  fi

  if [ ! -d "$BARE_KIT_SRC/node_modules/cmake-bare" ]; then
    log "running npm install in bare-kit clone (one-time)"
    (cd "$BARE_KIT_SRC" && npm install --no-audit --no-fund --loglevel=warn)
  fi
}

# Map android-* host names (used by bare-link / cmake-bare) to NDK ABIs
host_for_abi() {
  case "$1" in
    arm64-v8a)   echo "android-arm64" ;;
    armeabi-v7a) echo "android-arm"   ;;
    x86)         echo "android-ia32"  ;;
    x86_64)      echo "android-x64"   ;;
    *) fatal "unknown ABI: $1" ;;
  esac
}

# Common cmake configure args for an Android target.
# Args: <abi> <kind: "kit"|"addon">
android_cmake_args() {
  local abi="$1" kind="${2:-kit}"
  cat <<EOF
-DCMAKE_TOOLCHAIN_FILE=$NDK/build/cmake/android.toolchain.cmake
-DANDROID_ABI=$abi
-DANDROID_PLATFORM=android-$ANDROID_PLATFORM
-DCMAKE_BUILD_TYPE=Release
-DCMAKE_POSITION_INDEPENDENT_CODE=ON
-Dcmake-bare_DIR=$BARE_KIT_SRC/node_modules/cmake-bare
-Dcmake-bare-bundle_DIR=$BARE_KIT_SRC/node_modules/cmake-bare-bundle
-Dcmake-fetch_DIR=$BARE_KIT_SRC/node_modules/cmake-fetch
-Dcmake-napi_DIR=$BARE_KIT_SRC/node_modules/cmake-napi
-Dcmake-npm_DIR=$BARE_KIT_SRC/node_modules/cmake-npm
-DCMAKE_PREFIX_PATH=$BARE_KIT_SRC/node_modules
EOF

  # Bare addons are loaded into the bare runtime at runtime; many of their
  # symbols (js_*, uv_*) are resolved from libbare-kit.so at dlopen time.
  # cmake-bare passes -Wl,-undefined,dynamic_lookup which is macOS-only;
  # LLD on Android ignores it and refuses to link with unresolved symbols.
  # Tell LLD to allow undefined symbols in shared libs for addon builds.
  if [ "$kind" = "addon" ]; then
    cat <<'EOF'
-DCMAKE_SHARED_LINKER_FLAGS=-Wl,--unresolved-symbols=ignore-all
-DCMAKE_MODULE_LINKER_FLAGS=-Wl,--unresolved-symbols=ignore-all
EOF
  fi
}

build_bare_kit() {
  log "building bare-kit core (libbare-kit.so) for: $ABIS"
  for abi in $ABIS; do
    local build_dir="$BARE_BUILD_DIR/build/bare-kit/$abi"
    log "  bare-kit/$abi → cmake configure"
    cmake -S "$BARE_KIT_SRC" -B "$build_dir" \
      $(android_cmake_args "$abi")  >/dev/null

    log "  bare-kit/$abi → cmake build"
    cmake --build "$build_dir" --target bare_kit -j "$JOBS"

    local out
    out="$(find "$build_dir" -name libbare-kit.so -print -quit)"
    [ -n "$out" ] || fatal "libbare-kit.so not produced for $abi (check $build_dir)"

    install_to "$out" "$RNBK_LIBS/jni/$abi/libbare-kit.so"
    log "  bare-kit/$abi → wrote $RNBK_LIBS/jni/$abi/libbare-kit.so"
  done
}

build_bare_kit_classes_jar() {
  log "building bare-kit classes.jar (Java side)"

  local java_src="$BARE_KIT_SRC/android/src/main/java"
  [ -d "$java_src" ] || fatal "java source dir missing: $java_src"

  local android_jar
  android_jar="$(ls -1 "$SDK"/platforms/android-*/android.jar 2>/dev/null | sort -rV | head -1)"
  [ -n "$android_jar" ] || fatal "android.jar not found under $SDK/platforms/"

  local classes_dir="$BARE_BUILD_DIR/build/bare-kit-classes"
  rm -rf "$classes_dir"
  mkdir -p "$classes_dir"

  log "  javac → $classes_dir (using $(basename "$(dirname "$android_jar")"))"
  find "$java_src" -name '*.java' -print0 \
    | xargs -0 javac -source 1.8 -target 1.8 -classpath "$android_jar" -d "$classes_dir"

  jar cf "$RNBK_LIBS/classes.jar" -C "$classes_dir" .
  log "  wrote $RNBK_LIBS/classes.jar"
}

# Discover linked addons via bare-link's algorithm and emit:
#   <pkg-name>\t<version>\t<abs-dir>
# one per line, deduplicated by name+version+dir.
discover_addons() {
  node --no-warnings -e "
    const dependencies = require('$PROJECT_DIR/node_modules/bare-link/lib/dependencies');
    const { fileURLToPath } = require('url');
    const fs = require('fs');

    async function* walk(base, pkg, seen = new Set()) {
      if (seen.has(base)) return;
      seen.add(base);
      for await (const dep of dependencies(base, pkg)) {
        const dir = fileURLToPath(dep.url).replace(/\\/+\$/, '');
        if (dep.addon) yield { dir, name: dep.pkg.name, version: dep.pkg.version };
        yield* walk(dir, dep.pkg, seen);
      }
    }

    (async () => {
      const root = JSON.parse(fs.readFileSync('$PROJECT_DIR/package.json'));
      const seen = new Set();
      for await (const a of walk('$PROJECT_DIR', root)) {
        const key = a.name + '@' + a.version + '@' + a.dir;
        if (seen.has(key)) continue;
        seen.add(key);
        process.stdout.write(a.name + '\t' + a.version + '\t' + a.dir + '\n');
      }
    })().catch(e => { console.error(e); process.exit(1); });
  "
}

build_addon() {
  local name="$1" version="$2" dir="$3"
  # bare-link renames @scope/name → scope__name (no leading @)
  local sanitized="${name//\//__}"
  sanitized="${sanitized#@}"

  local rel="${dir#$PROJECT_DIR/}"
  log "addon $name@$version  ($rel)"

  # Some addons (e.g. bare-lief) gate test scaffolding on PROJECT_IS_TOP_LEVEL,
  # but the npm tarball strips test/. Configure each addon via a tiny wrapper
  # CMakeLists that does add_subdirectory(<addon>) so the addon is no longer
  # top-level and those guards skip cleanly.
  local wrap="$BARE_BUILD_DIR/build/wrappers/$sanitized@$version"
  mkdir -p "$wrap"
  cat > "$wrap/CMakeLists.txt" <<EOF
cmake_minimum_required(VERSION 3.25)
project(${sanitized//-/_}_wrapper)
add_subdirectory("$dir" addon_build)
EOF

  for abi in $ABIS; do
    local build_dir="$BARE_BUILD_DIR/build/addons/$sanitized@$version/$abi"
    log "  $sanitized/$abi → cmake configure"
    cmake -S "$wrap" -B "$build_dir" \
      $(android_cmake_args "$abi" addon)  >/dev/null

    # An addon's CMakeLists may declare *both* a bare module (via
    # add_bare_module → SUFFIX .bare) and a napi module (via add_napi_module
    # → SUFFIX .node) from the same binding.cc. We only need the bare one;
    # the napi target may also fail to configure (e.g. missing
    # bare-compat-napi). Build only `*_module` targets that produce `.bare`.
    # The wrapper makes CMakeFiles/*_module.dir live in addon_build/CMakeFiles/.
    # Walk all CMakeFiles trees under build_dir to find the bare module dirs.
    local bare_targets=()
    while IFS= read -r md; do
      [ -d "$md" ] || continue
      if [ -f "$md/link.txt" ] && grep -q '\.bare\b' "$md/link.txt"; then
        bare_targets+=("$(basename "$md" .dir)")
      fi
    done < <(find "$build_dir" -type d -name '*_module.dir')
    [ "${#bare_targets[@]}" -gt 0 ] \
      || fatal "no bare module targets found for $name@$version $abi (check $build_dir/CMakeFiles)"

    log "  $sanitized/$abi → cmake build (targets: ${bare_targets[*]})"
    cmake --build "$build_dir" -j "$JOBS" --target "${bare_targets[@]}"

    local out
    out="$(find "$build_dir" -maxdepth 4 -type f -name '*.bare' ! -empty | head -1)"
    [ -n "$out" ] || fatal "no .bare produced for $name@$version $abi (check $build_dir)"

    # Place into the addon's prebuilds/ dir at the canonical name expected by
    # bare-link. Gradle's preBuild task will run link.mjs → bare-link, which
    # reads from here, rewrites SONAME / DT_NEEDED, and emits the final
    # lib<name>.<version>.so into react-native-bare-kit/android/src/main/addons/.
    local host
    host="$(host_for_abi "$abi")"
    local target="$dir/prebuilds/$host/${sanitized}.bare"
    install_to "$out" "$target"
    log "  $sanitized/$abi → wrote $target"
  done
}

build_addons() {
  log "discovering linked addons …"
  local addons
  addons="$(discover_addons)"
  local count
  count="$(printf '%s\n' "$addons" | grep -c . || true)"
  log "found $count addon@version entries to build"

  while IFS=$'\t' read -r name version dir; do
    [ -z "$name" ] && continue
    build_addon "$name" "$version" "$dir"
  done <<< "$addons"
}

main() {
  log "==== bare-from-source build ===="
  log "project:     $PROJECT_DIR"
  log "bare-kit:    $BARE_KIT_VERSION"
  log "ABIs:        $ABIS"
  log "NDK:         $NDK"
  log "SDK:         $SDK"
  log "build dir:   $BARE_BUILD_DIR"
  log "jobs:        $JOBS"

  check_prereqs
  ensure_bare_kit_clone
  build_bare_kit
  build_bare_kit_classes_jar
  build_addons

  log "==== done. Outputs:"
  log "  $RNBK_LIBS/classes.jar"
  log "  $RNBK_LIBS/jni/<abi>/libbare-kit.so"
  log "  node_modules/<addon>/prebuilds/<host>/<addon>.bare"
  log "    (gradle preBuild will run bare-link to finalize these)"
}

main "$@"
