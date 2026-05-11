<p align="center">
  <img src="assets/images/logo.png" alt="Pearpass logo" width="264"/>
</p>

# PearPass Mobile

> The mobile app for PearPass, an open-source, end-to-end encrypted password and identity manager built on Pear Runtime.

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
- [Architecture](#architecture)
- [Starting the Application](#starting-the-application)
- [Prebuild](#prebuild)
- [Testing](#testing)
- [Dependencies](#dependencies)
- [Related Projects](#related-projects)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

PearPass is an open-source, privacy-first password and identity manager that gives you full control over your sensitive information. It makes storing and managing your credentials simple, secure, and private. PearPass encrypts and stores all data locally on your device.

Unlike traditional password managers that rely on centralized servers, PearPass is built on [Pear Runtime](https://pears.com/) and uses peer-to-peer technology to sync your credentials directly between your devices, ensuring they remain private, secure, and always under your control.

---

## Features

- **Encrypted-at-rest storage** — PearPass encrypts passwords, credit cards, secure notes, and custom fields before writing them to disk.
- **Biometric authentication** — Unlock your vault with fingerprint or face recognition.
- **Cross-device sync** — PearPass syncs credentials directly between your devices, with no central server.
- **Offline access** — Access your vault anytime, even without a network connection.
- **Password health** — Analyse password strength and identify weak passwords.
- **Random password generator** — Generate strong, unique passwords.
- **Easy-to-use interface** — a clean, intuitive design for managing your credentials on the go.

---

## Installation

### Prerequisites

- **Node.js** — check the required version in `.nvmrc` and verify with:

```bash
node --version
```

### Steps

```bash
# 1. Clone the repository
git clone git@github.com:tetherto/pearpass-app-mobile.git

# 2. Go to the cloned directory
cd pearpass-app-mobile

# 3. Install dependencies
npm install

# 4. Generate translation keys
npm run lingui:extract
npm run lingui:compile

# 5. Generate worklet bundles
npm run bundle-bare

# 6. Generate native iOS and Android directories (see Prebuild below)
npx expo prebuild --clean
```

---

## Usage Examples

Visit the official PearPass documentation for step-by-step guides on setup, vault management, syncing across devices, browser extension usage, and all other PearPass features:

**[docs.pass.pears.com](https://docs.pass.pears.com)**

---

## Architecture

This project uses **Expo Plugins** to manage native iOS and Android configurations. Git does not track the `ios/` and `android/` directories — Expo's prebuild system generates them dynamically.

### Key Points:

- Git ignores the native directories (`ios/` and `android/`).
- Expo plugins in the `plugins/` directory manage all native configurations.
- Running `npx expo prebuild --clean` generates the native directories with all necessary configurations.

---

## Starting the Application

Before starting the application, build it first. The build command produces bundles for iOS, iOS extension, and Android, and runs the custom prebuild:

```bash
# Build the application
npm run build

# Then start on your preferred platform
npm run ios      # For iOS
npm run android  # For Android
```

---

## Prebuild

This repo is Expo-managed. Prebuild generates the native `android/` and `ios/` folders; they are not committed.

### Standard (Play/normal) Android prebuild

```bash
npm run bundle-bare
npx expo prebuild --platform android --clean
```

### F-Droid Android prebuild

```bash
npm run bundle-bare
PEARPASS_DISTRIBUTION=fdroid npx expo prebuild --platform android --clean
```

More details:

- [`docs/fdroid/build.md`](docs/fdroid/build.md)
- [`docs/fdroid/version-check.md`](docs/fdroid/version-check.md)

---

## Testing

### Unit Testing

Run unit tests with Jest:

```bash
npm test
```

### End-to-End Testing with Maestro

PearPass uses Maestro for end-to-end testing. Maestro allows you to write UI tests in simple YAML format.

#### Install Maestro

```bash
# macOS
brew tap mobile-dev-inc/tap
brew install maestro
```

Verify the installation:

```bash
maestro --version
```

#### Run E2E Tests

Run a specific flow:

```bash
maestro test e2e/welcome/passwordCreate.yaml
```

Run all flows:

```bash
maestro test -e e2e/
```

#### Test file format

Each test file requires an `appId` block and a `---` separator before the commands:

```yaml
appId: com.pears.pass
---
- launchApp
- assertVisible: "Master password"
- tapOn:
    text: "Master password"
```

For more information, see the [Maestro documentation](https://maestro.mobile.dev/).

---

## Dependencies

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React](https://reactjs.org/)
- [React Navigation](https://reactnavigation.org/)
- [Styled Components](https://styled-components.com/)
- [Lingui](https://lingui.dev/)
- [Redux](https://redux.js.org/)

---

## Related Projects

| Project                                                                                                          | Description                                |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [`pearpass-app-desktop`](https://github.com/tetherto/pearpass-app-desktop)                                       | Desktop app for PearPass                   |
| [`pearpass-lib-vault`](https://github.com/tetherto/pearpass-lib-vault)                                           | Vault management library                   |
| [`pearpass-lib-vault-core`](https://github.com/tetherto/pearpass-lib-vault-core)                                 | Bare worker and client for PearPass vaults |
| [`pearpass-lib-ui-react-native-components`](https://github.com/tetherto/pearpass-lib-ui-react-native-components) | React Native UI component library          |
| [`pearpass-lib-ui-react-components`](https://github.com/tetherto/pearpass-lib-ui-react-components)               | React UI component library                 |
| [`tether-dev-docs`](https://github.com/tetherto/tether-dev-docs)                                                 | Developer documentation and guides         |

---

## Contributing

We welcome contributions. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the development workflow and coding conventions.

---

## Logging

Loggin is off by default. When enabled, logs are written to the app's cache directory — `main.log` from the JS host (React Native side) and `core.txt` from the Bare vault worker. The worker's sink redacts known sensitive fields (passwords, keys, tokens, etc.) before writing to `core.txt`. The host logger does not redact, so treat anything passed to `logger.*` on the JS side as on-disk-visible in `main.log`.

Two ways to enable:

- **In-app toggle** (Settings → Diagnostics → **Enable logs**). Persists across launches. Toggling off stops writes but keeps existing log files; toggling back on resumes appending to the same files, so a session can span multiple toggles.
- **Nightly builds** (`PearPass-nightly`): logging defaults to `debug` on first launch so testers don't have to opt in. The toggle still works to disable it.

Logs can be shared via Diagnostics screen **Share logs** action that zips both files plus a small metadata file (app version, distribution channel).

---

## Error reporting

**PearPass mobile is open source. Public releases and self-built versions never send any data anywhere. Sentry is only enabled on our nightly distribution channel for catching crashes during pre-release testing.**

Verifying:

- The gate is `isNightly()` from `src/constants/distribution.js`. Returns `false` unless the distribution channel is `nightly`.
- The Expo config plugin for Sentry is only loaded when `PEARPASS_DISTRIBUTION=nightly` at build time. `app.config.ts`. `app.json` has no Sentry plugin entry, so standard / F-Droid builds never include it.
- The Bare-side Sentry SDK (`sentry-bare`) is an optional peer dependency of `pearpass-lib-vault-core` — public builds don't install it.

---

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for details.
