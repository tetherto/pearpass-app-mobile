# 📱 How to Run Automation Tests Locally - Manual QA Guide

## Task Overview
**Objective:** Enable manual QA team to run mobile automation tests locally on their machines for Android and iOS devices/emulators.

**Estimated Time:** 30-45 minutes for initial setup

**Prerequisites:** 
- Basic command line knowledge
- Node.js installed (v18+)
- Android Studio (for Android) or Xcode (for iOS)
- Physical device or emulator/simulator

---

## 📋 Prerequisites Checklist

### Required Software
- [ ] **Node.js** (v18 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version` and `npm --version`

- [ ] **Git** (if cloning repository)
  - Download from: https://git-scm.com/

### For Android Testing
- [ ] **Android Studio** with Android SDK
  - Download from: https://developer.android.com/studio
  - Install Android SDK Platform Tools
  - Set up Android Emulator OR connect physical Android device via USB

- [ ] **Appium** (will be installed automatically via npm)
- [ ] **Java JDK** (v11 or higher)
  - Required for Appium/Android

### For iOS Testing (Mac only)
- [ ] **Xcode** (latest version from App Store)
- [ ] **Xcode Command Line Tools**
  - Run: `xcode-select --install`
- [ ] **CocoaPods** (if needed)
  - Install: `sudo gem install cocoapods`
- [ ] **iOS Simulator** OR physical iOS device

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Clone/Navigate to Project
```bash
# If cloning from repository
git clone <repository-url>
cd pearpass-app-mobile/e2e-mobile-tests

# Or navigate to existing project
cd path/to/pearpass-app-mobile/e2e-mobile-tests
```

### Step 2: Install Dependencies
```bash
# Install all required packages
npm install

# This will install:
# - WebdriverIO
# - Appium
# - TypeScript
# - All test dependencies
```

**Expected Output:** You should see "added XXX packages" message. This may take 2-5 minutes.

### Step 3: Prepare Application Files

#### For Android:
1. Place your `.apk` file in: `e2e-mobile-tests/apps/android/`
2. Default filename: `PearPass.apk`
3. Or set custom path via environment variable: `ANDROID_APP=YourApp.apk`

#### For iOS:
1. Place your `.ipa` file in: `e2e-mobile-tests/apps/ios/`
2. Default filename: `PearPass.ipa`
3. Or set custom path via environment variable: `IOS_APP=YourApp.ipa`

### Step 4: Configure Environment (Optional)

Create a `.env` file in `e2e-mobile-tests/` directory if you need custom settings:

```env
# Android Device Settings (for physical device)
ANDROID_UDID=your_device_udid
ANDROID_DEVICE_NAME=Pixel_7
ANDROID_PLATFORM_VERSION=13

# iOS Device Settings (for physical device)
IOS_UDID=your_ios_device_udid
XCODE_ORG_ID=your_org_id

# Appium Settings
APPIUM_NO_RESET=false
APPIUM_FULL_RESET=false
APPIUM_AUTO_GRANT_PERMISSIONS=true
```

**Note:** Most settings have defaults and work without `.env` file.

---

## 🎯 Running Tests

### Option 1: Run on Android Emulator (Easiest for beginners)

**Prerequisites:**
- Android Emulator running (start from Android Studio)

**Command:**
```bash
npm run e2e:android:emulator
```

**What it does:**
- Uses default emulator (Pixel_7, Android 13)
- Installs and runs the app
- Executes all test suites
- Shows results in terminal

### Option 2: Run on Physical Android Device

**Prerequisites:**
1. Enable USB Debugging on your Android device:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable "USB Debugging"
2. Connect device via USB
3. Verify connection: `adb devices` (should show your device)

**Command:**
```bash
# Set device UDID (optional, if multiple devices)
export ANDROID_UDID=your_device_udid

npm run e2e:android:local
```

### Option 3: Run on iOS Simulator (Mac only)

**Prerequisites:**
- iOS Simulator running (start from Xcode)

**Command:**
```bash
npm run e2e:ios:local
```

### Option 4: Run on Physical iOS Device (Mac only)

**Prerequisites:**
1. Device connected via USB
2. Trust computer on device
3. Set XCODE_ORG_ID if needed

**Command:**
```bash
# Set device UDID and org ID
export IOS_UDID=your_device_udid
export XCODE_ORG_ID=your_org_id

npm run e2e:ios:local
```

### Option 5: Run Specific Test Suite

To run only specific tests, modify the command:

```bash
# Run only Sidebar tests
npm run e2e:android:emulator -- --spec tests/specs/SidebarTests.ts

# Run only SignUp tests
npm run e2e:android:emulator -- --spec tests/specs/SignUpTests.ts
```

---

## 📊 Understanding Test Output

### Successful Test Run
```
✓ [PAS-XXX] User should see Sidebar page with all elements (2.5s)
✓ [PAS-XXX] User should see All Folders selected by default (1.2s)

2 passing (15.3s)
```

### Failed Test
```
✗ [PAS-XXX] User can tap on Favorites (5.2s)
   Error: Element "sidebarFavorites" not found

1 failing, 1 passing (20.1s)
```

### Screenshots
- Failed tests automatically capture screenshots
- Location: `e2e-mobile-tests/screenshots/`
- Format: `FAIL_visibility_SidebarPage_element_name_timestamp.png`

---

## 🔧 Troubleshooting Common Issues

### Issue 1: "Appium not found" or Connection Errors

**Solution:**
```bash
# Reinstall dependencies
npm install

# Verify Appium is installed
npx appium --version
```

### Issue 2: "Device not found" (Android)

**Solutions:**
1. Check USB connection: `adb devices`
2. Enable USB Debugging on device
3. Install USB drivers for your device
4. Try different USB cable/port
5. Restart ADB: `adb kill-server && adb start-server`

### Issue 3: "Device not found" (iOS)

**Solutions:**
1. Trust computer on iOS device
2. Check device in Xcode → Window → Devices and Simulators
3. Verify UDID: `xcrun simctl list devices` (for simulator)
4. For physical device: Settings → General → About → Copy UDID

### Issue 4: "App installation failed"

**Solutions:**
1. Verify `.apk`/`.ipa` file exists in correct folder
2. Check file permissions
3. For iOS: Ensure app is properly signed
4. Try uninstalling existing app first

### Issue 5: "Tests timeout" or "Element not found"

**Solutions:**
1. Increase timeout in `.env`:
   ```env
   WDIO_WAITFOR_TIMEOUT=30000
   MOCHA_TIMEOUT=300000
   ```
2. Check if app is actually running on device
3. Verify app version matches test expectations
4. Check device logs: `adb logcat` (Android)

### Issue 6: "Port already in use" (Appium)

**Solution:**
```bash
# Kill existing Appium processes
pkill -f appium

# Or change Appium port in wdio.conf.ts
```

---

## 📝 Quick Reference Commands

```bash
# Install dependencies
npm install

# Run Android tests on emulator
npm run e2e:android:emulator

# Run Android tests on physical device
npm run e2e:android:local

# Run iOS tests on simulator
npm run e2e:ios:local

# Run specific test file
npm run e2e:android:emulator -- --spec tests/specs/SidebarTests.ts

# Check connected Android devices
adb devices

# Check iOS simulators
xcrun simctl list devices

# View Android logs
adb logcat

# Restart ADB
adb kill-server && adb start-server
```

---

## 🎓 Test Structure Overview

```
e2e-mobile-tests/
├── tests/
│   ├── specs/          # Test files (what to run)
│   ├── pageobjects/    # Page object models
│   ├── locators/        # Element locators
│   └── data/            # Test data
├── apps/                # Application files (.apk, .ipa)
├── screenshots/         # Auto-captured on failures
└── wdio.conf.ts        # Test configuration
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] `npm install` completed without errors
- [ ] App file (.apk/.ipa) is in correct folder
- [ ] Device/emulator is running and visible
- [ ] `npm run e2e:android:emulator` starts successfully
- [ ] Tests begin executing
- [ ] At least one test passes

---

## 🆘 Getting Help

If you encounter issues:

1. **Check logs:** Look at terminal output for error messages
2. **Check screenshots:** Review failure screenshots in `screenshots/` folder
3. **Verify setup:** Go through prerequisites checklist again
4. **Contact:** Reach out to automation team with:
   - Error message
   - Screenshot (if available)
   - Your setup details (OS, Node version, device info)

---

## 📚 Additional Resources

- **WebdriverIO Docs:** https://webdriver.io/
- **Appium Docs:** https://appium.io/docs/en/latest/
- **Android Testing:** https://developer.android.com/training/testing
- **iOS Testing:** https://developer.apple.com/documentation/xctest

---

## 🎯 Next Steps

Once you can run tests successfully:

1. Try running different test suites
2. Experiment with running specific tests
3. Review test code in `tests/specs/` to understand what's being tested
4. Check `tests/pageobjects/` to see how pages are modeled
5. Report any issues or improvements to the automation team

---

**Last Updated:** [Current Date]
**Maintained by:** Automation Team

