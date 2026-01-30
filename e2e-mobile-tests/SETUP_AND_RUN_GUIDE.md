# Setup and Run Guide - PearPass E2E Mobile Tests

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running Tests](#running-tests)
6. [Troubleshooting](#troubleshooting)

---

## Overview

This guide will help you set up and run end-to-end mobile automation tests for the PearPass application. The test framework supports:

- **Platforms**: Android and iOS
- **Execution Targets**: BrowserStack (cloud), Local real devices, Local emulators/simulators
- **Test Management**: Integration with Qase.io
- **Framework**: WebdriverIO with Appium

---

## Prerequisites

### Required Software

#### 1. Node.js (v18 or higher)
- **Download**: https://nodejs.org/
- **Verify installation**:
  ```bash
  node --version
  npm --version
  ```
- Should output: `v18.x.x` or higher for Node.js, `9.x.x` or higher for npm

#### 2. Git
- **Download**: https://git-scm.com/
- Required for cloning the repository

#### 3. Java JDK (v11 or higher)
- **Required for**: Appium and Android testing
- **Download**: 
  - Windows/Mac: https://adoptium.net/ (recommended) or Oracle JDK
  - Linux: `sudo apt-get install openjdk-11-jdk` (Ubuntu/Debian)
- **Verify installation**:
  ```bash
  java -version
  ```
- Should output: `openjdk version "11.x.x"` or higher

### For Android Testing

#### 4. Android Studio
- **Download**: https://developer.android.com/studio
- **Installation steps**:
  1. Download and run the installer
  2. During setup, ensure "Android SDK", "Android SDK Platform", and "Android Virtual Device" are selected
  3. Complete the installation wizard

#### 5. Android SDK Platform Tools
- Usually installed with Android Studio
- **Manual installation** (if needed):
  1. Open Android Studio → SDK Manager
  2. Go to "SDK Tools" tab
  3. Check "Android SDK Platform-Tools"
  4. Click "Apply" to install

#### 6. Android Emulator OR Physical Device
- **Option A - Emulator**:
  1. Open Android Studio → AVD Manager
  2. Click "Create Virtual Device"
  3. Select a device (e.g., Pixel 7, Android 13)
  4. Download a system image (API 33/34 recommended)
  5. Finish setup
- **Option B - Physical Device**:
  1. Enable Developer Options on your Android device
  2. Enable USB Debugging
  3. Connect device via USB
  4. Verify connection: `adb devices`

#### 7. Environment Variables (Android)
Add to your system PATH:
- `ANDROID_HOME` = path to Android SDK (e.g., `C:\Users\YourName\AppData\Local\Android\Sdk`)
- Add to PATH: `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\tools`

**Windows**:
```powershell
# In PowerShell (as Administrator)
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\YourName\AppData\Local\Android\Sdk", "Machine")
```

**macOS/Linux**:
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

### For iOS Testing (macOS only)

#### 8. Xcode
- **Download**: Mac App Store (free)
- **Installation**: 
  1. Search "Xcode" in App Store
  2. Click "Get" / "Install"
  3. Wait for download (several GB)
  4. Open Xcode and accept license agreement

#### 9. Xcode Command Line Tools
- **Install**:
  ```bash
  xcode-select --install
  ```
- Follow the installation prompts

#### 10. CocoaPods (if needed)
- **Install**:
  ```bash
  sudo gem install cocoapods
  ```

#### 11. iOS Simulator OR Physical Device
- **Option A - Simulator**:
  - Included with Xcode
  - Launch: Xcode → Open Developer Tool → Simulator
- **Option B - Physical Device**:
  1. Connect iPhone/iPad via USB
  2. Trust the computer on device
  3. Verify: `xcrun simctl list devices`

### For BrowserStack Testing (Optional)

#### 12. BrowserStack Account
- **Sign up**: https://www.browserstack.com/
- **Get credentials**: 
  1. Log in to BrowserStack
  2. Go to Account Settings → Access Key
  3. Copy your Username and Access Key

---

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd pearpass-app-mobile/e2e-mobile-tests
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- WebdriverIO
- Appium
- TypeScript
- Test dependencies

**Expected time**: 2-5 minutes depending on internet speed

### Step 3: Verify Installation

```bash
# Check WebdriverIO installation
npx wdio --version

# Check Appium (if installed globally)
appium --version
```

---

## Configuration

### Step 1: Create Environment File

Copy the example environment file:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

### Step 2: Configure Environment Variables

Open `.env` file and configure the following:

#### Basic Configuration

```env
# Platform selection
PLATFORM=Android                  # Android | iOS
RUN_TARGET=local_emulator         # bs | local_real_android | local_real_ios | local_emulator
```

#### For Local Android Emulator

```env
PLATFORM=Android
RUN_TARGET=local_emulator

# Android Emulator Configuration
ANDROID_DEVICE_NAME=Android Emulator
ANDROID_PLATFORM_VERSION=13
ANDROID_AVD_NAME=Pixel_6_Pro_API_34        # Your AVD name from Android Studio
ANDROID_UDID=emulator-5554                 # Check with: adb devices
```

#### For Local Real Android Device

```env
PLATFORM=Android
RUN_TARGET=local_real_android

ANDROID_DEVICE_NAME=Your_Device_Name      # Check with: adb devices -l
ANDROID_PLATFORM_VERSION=13               # Your device Android version
```

#### For Local iOS Simulator

```env
PLATFORM=iOS
RUN_TARGET=local_real_ios

IOS_DEVICE_NAME=iPhone 15 Pro
IOS_PLATFORM_VERSION=17
```

#### For BrowserStack

```env
PLATFORM=Android                          # or iOS
RUN_TARGET=bs

# BrowserStack Credentials
BROWSERSTACK_USERNAME=your_bs_username
BROWSERSTACK_ACCESS_KEY=your_bs_access_key

# Device Selection
BS_ANDROID_DEVICE=Samsung Galaxy S24
BS_ANDROID_VERSION=14.0
BS_IOS_DEVICE=iPhone 15 Pro
BS_IOS_VERSION=17
```

#### App Paths

Place your app files in the appropriate directories:

```env
# For Android
ANDROID_APP=PearPass.apk                  # Place in apps/android/ folder

# For iOS
IOS_APP=PearPass.ipa                      # Place in apps/ios/ folder
```

**Note**: Create `apps/android/` and `apps/ios/` directories if they don't exist.

#### Qase Integration (Optional)

```env
ENABLE_QASE=true                          # Set to false to disable
QASE_API_TOKEN=your_qase_api_token_here
QASE_PROJECT_CODE=PAS
QASE_TESTOPS_PLAN_ID=2                    # 0 for auto-create
QASE_RUN_ID=0                             # 0 for auto-create
```

---

## Running Tests

### Available Test Scripts

#### Run All Tests

```bash
# Android Emulator
npm run e2e:android:emulator

# Android Real Device
npm run e2e:android:local

# iOS Simulator/Device
npm run e2e:ios:local

# BrowserStack
npm run e2e:android:bs
npm run e2e:ios:bs
```

#### Run Specific Test Suites

```bash
# Sign-up tests
npm run test:signup

# Onboarding tests
npm run test:onboarding

# Sidebar tests
npm run test:sidebar

# All tests
npm run test:all
```

#### Run with Custom Parameters

```bash
# Override platform
cross-env PLATFORM=iOS npm run wdio

# Override target
cross-env RUN_TARGET=local_real_android npm run wdio

# Run specific suite
npm run wdio -- --suite signup
```

### Before Running Tests

1. **For Android Emulator**:
   ```bash
   # Start emulator manually (optional, Appium can start it)
   emulator -avd Pixel_6_Pro_API_34
   
   # Verify device is connected
   adb devices
   ```

2. **For iOS Simulator**:
   ```bash
   # Start simulator manually (optional)
   open -a Simulator
   
   # Verify devices
   xcrun simctl list devices
   ```

3. **For Real Devices**:
   - Ensure device is connected via USB
   - Enable USB debugging (Android) or trust computer (iOS)
   - Verify connection: `adb devices` (Android) or check in Xcode (iOS)

### Test Execution Flow

1. Tests start automatically
2. Appium server starts (if not running)
3. App is installed on device/emulator
4. Tests execute sequentially
5. Results are displayed in console
6. Screenshots are saved on failures (in `screenshots/` directory)

---

## Troubleshooting

### Common Issues

#### 1. "Appium not found" or "Cannot connect to Appium"

**Solution**:
```bash
# Install Appium globally (optional)
npm install -g appium

# Or use the local version
npx appium --version
```

#### 2. "Device not found" or "No devices connected"

**For Android**:
```bash
# Check connected devices
adb devices

# If no devices, try:
adb kill-server
adb start-server
adb devices

# For emulator, ensure it's running
emulator -list-avds
emulator -avd Your_AVD_Name
```

**For iOS**:
```bash
# List available simulators
xcrun simctl list devices

# Boot a simulator
xcrun simctl boot "iPhone 15 Pro"

# Check if device is trusted (for real devices)
# Settings → General → Device Management
```

#### 3. "ANDROID_HOME not set"

**Solution**:
- Verify Android SDK path
- Add `ANDROID_HOME` to environment variables (see Prerequisites section)
- Restart terminal/IDE after setting environment variables

#### 4. "App not found" or "Cannot install app"

**Solution**:
- Ensure app file exists in `apps/android/` or `apps/ios/` directory
- Check file name matches `.env` configuration
- Verify app file is not corrupted
- For iOS: ensure app is properly signed

#### 5. "Port already in use" (Appium)

**Solution**:
```bash
# Kill process on port 4723 (default Appium port)
# Windows
netstat -ano | findstr :4723
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:4723 | xargs kill -9
```

#### 6. "Timeout waiting for element"

**Solution**:
- Increase timeout in `wdio.conf.ts` (if needed)
- Check if app is loading correctly
- Verify element locators are correct
- Check device performance (emulator might be slow)

#### 7. TypeScript Compilation Errors

**Solution**:
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript version
npx tsc --version
```

#### 8. "Qase integration errors"

**Solution**:
- Verify `QASE_API_TOKEN` is correct
- Check `QASE_PROJECT_CODE` matches your Qase project
- Set `ENABLE_QASE=false` to disable integration temporarily
- Verify network connection to Qase.io

### Getting Help

1. **Check logs**: Test execution logs are displayed in console
2. **Screenshots**: Failed tests save screenshots in `screenshots/` directory
3. **Appium logs**: Check Appium server output for detailed errors
4. **WebdriverIO logs**: Increase log level in `wdio.conf.ts`:
   ```typescript
   logLevel: 'debug',  // Change from 'info' to 'debug'
   ```

### Useful Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Java version
java -version

# Check Android SDK
echo $ANDROID_HOME        # macOS/Linux
echo %ANDROID_HOME%       # Windows

# List Android devices
adb devices

# List iOS simulators
xcrun simctl list devices

# Check Appium
npx appium --version

# Check WebdriverIO
npx wdio --version
```

---

## Additional Resources

- **WebdriverIO Documentation**: https://webdriver.io/
- **Appium Documentation**: https://appium.io/docs/en/latest/
- **Android Developer Guide**: https://developer.android.com/studio
- **Xcode Documentation**: https://developer.apple.com/xcode/
- **BrowserStack Documentation**: https://www.browserstack.com/docs/

---

## Quick Start Checklist

- [ ] Node.js v18+ installed
- [ ] Java JDK 11+ installed
- [ ] Android Studio installed (for Android) OR Xcode installed (for iOS)
- [ ] Environment variables configured (ANDROID_HOME for Android)
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] App files placed in `apps/android/` or `apps/ios/`
- [ ] Device/emulator ready and connected
- [ ] First test run successful

---

**Last Updated**: January 2026
**Test Framework Version**: 1.1.1
