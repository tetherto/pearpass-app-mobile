import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import axios from 'axios';
import * as FormData from 'form-data';

import type { Options } from '@wdio/types';
// @ts-ignore - JS module without type declarations
import qaseHook from './tests/helpers/qase-hook.js';

/* ===============================================
   PLATFORM SETTINGS
================================================= */
type Platform = 'Android' | 'iOS';
type RunTarget = 'bs' | 'local_real_android' | 'local_real_ios' | 'local_emulator';
const PLATFORM = (process.env.PLATFORM || 'Android') as Platform;
const RUN_TARGET = (process.env.RUN_TARGET || 'bs') as RunTarget;
const ENABLE_QASE = process.env.ENABLE_QASE === 'true';
const QASE_RUN_ID = Number(process.env.QASE_RUN_ID || '1');

const BUILD_PREFIX = process.env.BUILD_PREFIX || 'WDK E2E';

/* ===============================================
   HELPERS
================================================= */
function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`❌ Missing env var: ${name}`);
  return v;
}

async function uploadToBS(appPath: string): Promise<string> {
  if (!fs.existsSync(appPath)) {
    throw new Error(`❌ App not found: ${appPath}`);
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(appPath));

  const res = await axios.post(
    'https://api-cloud.browserstack.com/app-automate/upload',
    form,
    {
      auth: {
        username: requiredEnv('BROWSERSTACK_USERNAME'),
        password: requiredEnv('BROWSERSTACK_ACCESS_KEY')
      },
      headers: form.getHeaders()
    }
  );

  return res.data?.app_url;
}

async function resolveApp(platform: Platform): Promise<string> {
  if (platform === 'Android' && process.env.ANDROID_APP) return process.env.ANDROID_APP;
  if (platform === 'iOS' && process.env.IOS_APP) return process.env.IOS_APP;

  const local = platform === 'iOS'
    ? path.resolve(__dirname, 'apps/ios/YourApp.ipa')
    : path.resolve(__dirname, 'apps/android/testtask.apk');

  return uploadToBS(local);
}

function getVersion(p: string): string | undefined {
  const m = path.basename(p).match(/(\d+\.\d+\.\d+)/);
  return m ? m[1] : undefined;
}

const isBS = RUN_TARGET === 'bs';
const isAndroid = PLATFORM === 'Android';

// Ensure logs directory exists and clean up old log file
const logsDir = path.resolve(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
const appiumLogPath = path.join(logsDir, 'appium.log');
// Remove old log file if it exists to avoid permission issues
if (fs.existsSync(appiumLogPath)) {
  try {
    fs.unlinkSync(appiumLogPath);
  } catch (err) {
    // Ignore errors if file is locked
    console.warn('Could not delete old appium.log file:', err);
  }
}

/* ===============================================
   WDIO CONFIG
================================================= */
export const config: Options.Testrunner & {
  capabilities: WebdriverIO.Capabilities[];
  autoCompileOpts?: any;
} = {

  runner: 'local',

  specs: [
    './tests/specs/OnboardingTests.ts',
    './tests/specs/SignUpTests.ts',
  ],

  suites: {
    // Full flow suite: all tests run in one session (recommended for E2E flow)
    // This is the DEFAULT suite when no suite is specified
    fullFlow: [
      './tests/specs/OnboardingTests.ts',
      './tests/specs/SignUpTests.ts',
    ],
    // Individual suites for running tests separately if needed
    onboarding: [
      './tests/specs/OnboardingTests.ts',
    ],
    signup: [
      './tests/specs/SignUpTests.ts',
    ],
    // Sidebar tests require app to be fully set up (after onboarding + signup)
    sidebar: [
      './tests/specs/OnboardingTests.ts',
      './tests/specs/SignUpTests.ts',
      './tests/specs/SidebarTests.ts',
    ],
    // Sidebar only - run only SidebarTests.ts (requires app to be already set up)
    sidebarOnly: [
      './tests/specs/SidebarTests.ts',
    ],
    // Run all tests in order (full flow + sidebar)
    all: [
      './tests/specs/OnboardingTests.ts',
      './tests/specs/SignUpTests.ts',
      './tests/specs/SidebarTests.ts',
    ],
  },

  maxInstances: 1,

  /* ---------------- BrowserStack ---------------- */
  user: isBS ? requiredEnv('BROWSERSTACK_USERNAME') : undefined,
  key: isBS ? requiredEnv('BROWSERSTACK_ACCESS_KEY') : undefined,
  hostname: isBS ? 'hub.browserstack.com' : undefined,
  port: isBS ? 443 : undefined,
  path: isBS ? '/wd/hub' : undefined,

  services: isBS
    ? [
        [
          'browserstack',
          {
            browserstackLocal: process.env.BSTACK_LOCAL === 'true',
            buildIdentifier: process.env.BUILD_NUMBER
          }
        ]
      ]
    : [
        [
          'appium',
          {
            command: process.env.APPIUM_PATH || 'appium',
            args: {
              // Use console logging instead of file to avoid permission issues
              // log: appiumLogPath,
              logLevel: 'info',
              logTimestamp: true
            }
          }
        ]
      ],

  /* ---------------- Capabilities ---------------- */
  capabilities:
    RUN_TARGET === 'local_real_android'
      ? [
          {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:udid': requiredEnv('ANDROID_UDID'),
            'appium:app': path.resolve(__dirname, 'apps/android/testtask.apk'),
            'appium:noReset': true,
            'appium:autoGrantPermissions': true
          }
        ]

      : RUN_TARGET === 'local_real_ios'
      ? [
          {
            platformName: 'iOS',
            'appium:automationName': 'XCUITest',
            'appium:udid': requiredEnv('IOS_UDID'),
            'appium:app': path.resolve(__dirname, 'apps/ios/YourApp.ipa'),
            'appium:noReset': true,
            'appium:xcodeOrgId': requiredEnv('XCODE_ORG_ID'),
            'appium:xcodeSigningId': 'iPhone Developer'
          }
        ]
      : RUN_TARGET === 'local_emulator'
      ? [
          {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': process.env.EMULATOR_NAME || 'emulator-5554',
            'appium:platformVersion': process.env.EMULATOR_VERSION || '13',
            // Использовать уже установленное приложение вместо установки APK
            // 'appium:app': path.resolve(__dirname, 'apps/android/PearPass.apk'),
            'appium:appPackage': 'com.pears.pass',
            'appium:noReset': true,  // Не сбрасывать данные приложения
            'appium:fullReset': false,  // Не переустанавливать приложение
            'appium:autoGrantPermissions': true,
            'appium:newCommandTimeout': 300
          }
        ]

      : [
          isAndroid
            ? {
                platformName: 'Android',
                'appium:automationName': 'UiAutomator2',
                'bstack:options': {
                  deviceName: process.env.BS_ANDROID_DEVICE || 'Samsung Galaxy S23 Ultra',
                  platformVersion: process.env.BS_ANDROID_VERSION || '13.0',
                  projectName: 'WDK E2E',
                  buildName: `${BUILD_PREFIX} - ${new Date().toISOString().split('T')[0]}`,
                  sessionName: 'Android E2E Test',
                  debug: true,
                  networkLogs: true
                }
              }
            : {
                platformName: 'iOS',
                'appium:automationName': 'XCUITest',
                'bstack:options': {
                  deviceName: process.env.BS_IOS_DEVICE || 'iPhone 14 Pro Max',
                  platformVersion: process.env.BS_IOS_VERSION || '16.0',
                  projectName: 'WDK E2E',
                  buildName: `${BUILD_PREFIX} - ${new Date().toISOString().split('T')[0]}`,
                  sessionName: 'iOS E2E Test',
                  debug: true,
                  networkLogs: true
                }
              }
        ],

  /* ---------------- Settings ---------------- */
  logLevel: 'info',
  waitforTimeout: 21000,
  connectionRetryTimeout: 240000,
  connectionRetryCount: 3,

  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 180000
  },

  /* ---------------- Hooks ---------------- */
  async beforeSession(_config, capabilities) {
    console.log(`\n🚀 Running platform: ${PLATFORM}`);
    console.log(`🎯 Target: ${RUN_TARGET}`);
    console.log(`📊 Qase: ${ENABLE_QASE ? 'ENABLED' : 'DISABLED'}`);

    if (!isBS) return;

    const platformName = (capabilities as any).platformName as Platform;

    const appUrl = await resolveApp(platformName);
    (capabilities as any)['appium:app'] = appUrl;

    const localPath =
      platformName === 'iOS'
        ? path.resolve(__dirname, 'apps/ios/YourApp.ipa')
        : path.resolve(__dirname, 'apps/android/PearPass.apk');

    const version = getVersion(localPath);

    const opt = (capabilities as any)['bstack:options'];
    opt['buildName'] = `${BUILD_PREFIX} v${version || 'N/A'}`;
  },

  async beforeTest(test) {
    console.log(`🔍 ${test.title}`);
    if (ENABLE_QASE) {
      await qaseHook.beforeTest(test);
    }
  },

  async afterTest(test, context, result) {
    if (ENABLE_QASE) {
      await qaseHook.afterTest(test, context, { passed: result.passed, error: result.error });
    }
  },

  async onComplete() {
    console.log('\n🏁 E2E Completed.');
    if (ENABLE_QASE) {
      console.log(`📤 Qase results sent to Run ID: ${QASE_RUN_ID}`);
    }
  },

  /* -------------- TypeScript ---------------- */
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json'
    }
  }
};
