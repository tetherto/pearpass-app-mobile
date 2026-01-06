# 📱 Task: Run Mobile Automation Tests Locally - Manual QA Setup Guide

## Task Description
Create a step-by-step guide for manual QA team to set up and run mobile automation tests locally on their machines.

---

## 🎯 Objective
Enable manual QA engineers to run automation tests locally for:
- Android devices/emulators
- iOS devices/simulators

**Target Audience:** Manual QA team members with basic technical knowledge

**Estimated Setup Time:** 30-45 minutes

---

## ✅ Prerequisites Checklist

### Required Software
- [ ] Node.js v18+ installed (`node --version`)
- [ ] Git installed (if cloning repo)
- [ ] Android Studio (for Android testing)
- [ ] Xcode (for iOS testing - Mac only)
- [ ] Java JDK 11+ (for Android/Appium)

### Device Setup
- [ ] Android Emulator running OR Physical Android device connected
- [ ] iOS Simulator running OR Physical iOS device connected (Mac only)

---

## 📋 Setup Steps

### 1. Install Dependencies
```bash
cd e2e-mobile-tests
npm install
```

### 2. Prepare App Files
- **Android:** Place `.apk` in `apps/android/PearPass.apk`
- **iOS:** Place `.ipa` in `apps/ios/PearPass.ipa`

### 3. Run Tests

**Android Emulator:**
```bash
npm run e2e:android:emulator
```

**Physical Android Device:**
```bash
# Enable USB Debugging first
npm run e2e:android:local
```

**iOS Simulator (Mac only):**
```bash
npm run e2e:ios:local
```

**Run Specific Test:**
```bash
npm run e2e:android:emulator -- --spec tests/specs/SidebarTests.ts
```

---

## 🔧 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Device not found | Check `adb devices` (Android) or Xcode Devices (iOS) |
| App install fails | Verify .apk/.ipa file exists in `apps/` folder |
| Tests timeout | Increase timeout in `.env` file |
| Port in use | Kill Appium: `pkill -f appium` |

---

## 📊 Expected Output

**Success:**
```
✓ [PAS-XXX] Test name (2.5s)
2 passing (15.3s)
```

**Failure:**
```
✗ [PAS-XXX] Test name (5.2s)
  Error: Element not found
Screenshot saved: screenshots/FAIL_*.png
```

---

## 📚 Documentation

Full detailed tutorial: `TUTORIAL_RUN_TESTS_LOCALLY.md`

**Key Commands:**
- `npm install` - Install dependencies
- `npm run e2e:android:emulator` - Run Android tests
- `npm run e2e:ios:local` - Run iOS tests
- `adb devices` - Check Android devices
- `xcrun simctl list devices` - Check iOS simulators

---

## 🎓 Test Structure

```
tests/
├── specs/        # Test files
├── pageobjects/  # Page models
├── locators/      # Element locators
└── data/          # Test data
```

---

## ✅ Acceptance Criteria

- [ ] QA team member can successfully run `npm install`
- [ ] QA team member can run tests on Android emulator
- [ ] QA team member can run tests on physical device (optional)
- [ ] QA team member understands test output
- [ ] QA team member knows how to troubleshoot common issues

---

## 📞 Support

For issues, provide:
- Error message
- Screenshot (if available)
- Setup details (OS, Node version, device)

Contact: Automation Team

---

**Priority:** Medium
**Labels:** Documentation, QA, Automation, Setup
**Assignee:** Manual QA Team
**Due Date:** [Set as needed]

