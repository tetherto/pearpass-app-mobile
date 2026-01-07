<p align="center">
  <img src="assets/images/logo.png" alt="Pearpass logo" width="264" />
</p>

# pearpass-app-mobile

PearPass Mobile App is a secure and user-friendly password management solution designed for mobile devices. It allows users to store, generate, and manage their passwords across different platforms with strong encryption.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Project Architecture](#project-architecture)
- [Starting the Application](#starting-the-application)
- [Prebuild Instructions](#prebuild-instructions)
- [Testing](#testing)
- [Dependencies](#dependencies)
- [Related Projects](#related-projects)

## Features

- Secure password, identity, and credit card, notes and custom fields storage
- Biometric authentication (fingerprint and face recognition)
- Cross-device and platform synchronization
- Offline access to your credentials
- Encryption for data security
- Password strength analysis
- Random password generator
- Easy-to-use interface

## Installation

**Node.js**: Ensure you have the correct Node.js version installed. You can check the required version in the `.nvmrc` file. And ensure it matches to your current node version by running:

```bash
node --version
```

```bash
# Clone the repository
git clone git@github.com:tetherto/pearpass-app-mobile.git

# Navigate to the project directory
cd pearpass-app-mobile

# Initialize and update submodules
git submodule update --init --recursive

# To update all submodules to the latest `main` branch, use the provided script.
npm run update-submodules

# In case of specific remote use:
npm run update-submodules -- [remote-name]

# Install dependencies
npm install

# generate translation keys
npm run lingui:extract

npm run lingui:compile

# Generate worklet bundles
npm run bundle-bare

# Generate native iOS and Android directories (see Prebuild Instructions below)
npx expo prebuild --clean
```

## Project Architecture

This project uses **Expo Plugins** to manage native iOS and Android configurations. The `ios/` and `android/` directories are **not tracked in git** and are generated dynamically using Expo's prebuild system.

### Key Points:
- Native directories (`ios/` and `android/`) are gitignored
- All native configurations are managed through Expo plugins in the `plugins/` directory
- Running `npx expo prebuild --clean` generates the native directories with all necessary configurations


## Starting the Application

Before starting the application, you need to build it first. The build command produces bundles for iOS, iOS extension, and Android, and also runs custom prebuild:

```bash
# Build the application
npm run build

# Then start on your preferred platform
npm run ios      # For iOS
npm run android  # For Android
```

## Prebuild Instructions

⚠️ **Important**: Always use custom prebuild scripts instead of `expo prebuild` directly.

### Available Scripts:

- `npm run custom-prebuild` - Standard prebuild for both platforms
- `npm run custom-prebuild:clean` - Clean prebuild (recommended)
- `npm run custom-prebuild:ios` - iOS only
- `npm run custom-prebuild:android` - Android only

### Why use custom scripts?

These scripts automatically handle custom splash screen configuration during the prebuild process.

### Usage:

```bash
# Most common - clean prebuild for both platforms
npm run custom-prebuild:clean

# iOS only
npm run custom-prebuild:ios

# Android only
npm run custom-prebuild:android
```

## Testing

### Unit Testing

Run unit tests with Jest:

```bash
npm test
```

### End-to-End Testing with Maestro

PearPass uses Maestro for end-to-end testing. Maestro allows you to write UI tests in simple YAML format.

#### Installation

1. Install Maestro CLI:

```bash
# macOS
brew tap mobile-dev-inc/tap
brew install maestro
```

2. Verify installation:

```bash
maestro --version
```

#### Running E2E Tests

Run a specific test flow:

```bash
maestro test e2e/welcome/passwordCreate.yaml
```

Run all test flows:

```bash
maestro test -e e2e/
```

#### Creating Maestro Tests

Each test file must have:

1. A config section with appId
2. A commands section after the "---" separator

Example:

```yaml
appId: com.pears.pass
---
- launchApp
- assertVisible: 'Master password'
- tapOn:
    text: 'Master password'
```

For more information, refer to the [Maestro documentation](https://maestro.mobile.dev/).

## Dependencies

- [React Native](https://reactnative.dev/)
- [React](https://reactjs.org/)
- [React Navigation](https://reactnavigation.org/)
- [Styled Components](https://styled-components.com/)
- [Lingui](https://lingui.dev/)
- [Expo](https://expo.dev/)
- [Redux](https://redux.js.org/)

## Related Projects

- [pearpass-app-desktop](https://github.com/tetherto/pearpass-app-desktop) - A mobile app for PearPass, a password manager
- [pearpass-lib-ui-react-native-components](https://github.com/tetherto/pearpass-lib-ui-react-native-components) - A library of React Native UI components for PearPass
- [pearpass-lib-ui-react-components](https://github.com/tetherto/pearpass-lib-ui-react-components) - A library of React UI components for PearPass
- [tether-dev-docs](https://github.com/tetherto/tether-dev-docs) - Documentations and guides for developers
- [pearpass-lib-vault](https://github.com/tetherto/pearpass-lib-vault) - A library for managing password vaults
- [pearpass-lib-vault-core](https://github.com/tetherto/pearpass-lib-vault-core) - A bare wrapper for Autopass and Corestore for password storage and encryption

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for details.
