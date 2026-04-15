import 'dotenv/config';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import axios from 'axios';
import * as FormData from 'form-data';

import type { Options } from '@wdio/types';
// @ts-ignore - JS module without type declarations
import qaseHook from './tests/helpers/qase-hook.js';
// @ts-ignore - JS module without type declarations
import WDIOQaseReporter, { afterRunHook, beforeRunHook } from 'wdio-qase-reporter';
import qaseSync from './tests/helpers/qase-sync';

// Extend WebdriverIO Capabilities typings (custom Appium / BrowserStack keys)
declare module 'webdriverio' {
  interface Capabilities {
    'appium:enableBiometric'?: boolean;
    'appium:biometricStrategy'?: string;
    'appium:allowTestPackages'?: boolean;
    'appium:autoGrantPermissions'?: boolean;
    'appium:noReset'?: boolean;
    'appium:fullReset'?: boolean;
    'appium:newCommandTimeout'?: number;
    'appium:dontStopAppOnReset'?: boolean;
    'appium:settings'?: Record<string, any>;
    'appium:appPackage'?: string;
    'appium:deviceName'?: string;
    'appium:platformVersion'?: string;
    'bstack:options'?: {
      deviceName?: string;
      platformVersion?: string;
      projectName?: string;
      buildName?: string;
      sessionName?: string;
      debug?: boolean;
      networkLogs?: boolean;
    };
  }
}

/* ===============================================
   PLATFORM SETTINGS
================================================= */
type Platform = 'Android' | 'iOS';
type RunTarget = 'bs' | 'local_real_android' | 'local_real_ios' | 'local_emulator';
const PLATFORM = (process.env.PLATFORM || 'Android') as Platform;
const RUN_TARGET = (process.env.RUN_TARGET || 'bs') as RunTarget;
const ENABLE_QASE = process.env.ENABLE_QASE === 'true';
const ENABLE_SLACK = process.env.ENABLE_SLACK === 'true';
const SLACK_WEBHOOK_URL = (process.env.SLACK_WEBHOOK_URL || '').trim();
// Support both env var names for backwards compatibility
const QASE_RUN_ID = Number(process.env.QASE_RUN_ID || process.env.QASE_TEST_RUN_ID || '0');
// QASE_TESTOPS_PLAN_ID is the official env name for Test Plan ID
const QASE_PLAN_ID = Number(process.env.QASE_TESTOPS_PLAN_ID || process.env.QASE_PLAN_ID || '0');

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

/** Push all files from tests/data/test-data to the emulator Download folder (Android local_emulator only). */
function pushTestDataToEmulator(): void {
  const testDataDir = path.resolve(__dirname, 'tests', 'data', 'test-data');
  if (!fs.existsSync(testDataDir)) {
    console.warn(`⚠️ Test data folder not found: ${testDataDir}`);
    return;
  }
  const deviceDownload = '/sdcard/Download';
  const entries = fs.readdirSync(testDataDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);
  if (files.length === 0) {
    console.warn(`⚠️ No files in ${testDataDir}`);
    return;
  }
  for (const file of files) {
    const src = path.join(testDataDir, file);
    try {
      execSync(`adb push "${src}" "${deviceDownload}/"`, {
        stdio: 'inherit',
        maxBuffer: 10 * 1024 * 1024
      });
    } catch (err) {
      console.warn(`⚠️ Failed to push ${file}:`, (err as Error).message);
    }
  }
  console.log(`📁 ${files.length} file(s) pushed to ${deviceDownload}`);
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
   GLOBAL: test run start timestamp
================================================= */
const testStartTime = Date.now();

/* ===============================================
   Parse CTRF report JSON files for run statistics
================================================= */
function parseCTRFStats() {
  const ctrfDir = path.resolve(__dirname, 'ctrl');
  const suiteStats: Record<string, { total: number; passed: number; failed: number }> = {};
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  
  try {
    if (fs.existsSync(ctrfDir)) {
      const files = fs.readdirSync(ctrfDir).filter(f => f.endsWith('.json'));
      
      // Only files created/updated after this run started
      // 30s buffer before start time for clock skew / FS delays
      const startTimeWithBuffer = testStartTime - (30 * 1000);
      
      const recentFiles = files
        .map(file => {
          const filePath = path.join(ctrfDir, file);
          const stats = fs.statSync(filePath);
          return { file, mtime: stats.mtime.getTime() };
        })
        .filter(({ mtime }) => mtime >= startTimeWithBuffer)
        .sort((a, b) => b.mtime - a.mtime);
      
      console.log(`🔍 Found ${recentFiles.length} recent CTRF files (from ${files.length} total)`);
      
      for (const { file } of recentFiles) {
        try {
          const filePath = path.join(ctrfDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const report = JSON.parse(content);
          
          if (report.results && report.results.summary) {
            const summary = report.results.summary;
            const tests = summary.tests || 0;
            const passed = summary.passed || 0;
            const failed = summary.failed || 0;
            
            // Derive suite label from CTRF filename
            let suiteName = 'Unknown Suite';
            if (file.includes('OnboardingTests')) suiteName = 'Onboarding Flow';
            else if (file.includes('SignUpTests')) suiteName = 'Sign Up Flow';
            else if (file.includes('SidebarTests')) suiteName = 'Sidebar Flow';
            else if (file.includes('SettingsTests')) suiteName = 'Settings Flow';
            else if (file.includes('HomeTests')) suiteName = 'Home Flow';
            
            // Keep first match per suite name only
            if (!suiteStats[suiteName]) {
              suiteStats[suiteName] = { total: tests, passed, failed };
              totalTests += tests;
              totalPassed += passed;
              totalFailed += failed;
              console.log(`   📄 ${suiteName}: ${passed}/${tests} (from ${file})`);
            }
          }
        } catch (error) {
          console.warn(`Could not parse CTRF file ${file}:`, error);
        }
      }
    }
  } catch (error) {
    console.warn('Could not read CTRF directory:', error);
  }
  
  // Empty stats if no CTRF files matched
  return {
    total: totalTests,
    passed: totalPassed,
    failed: totalFailed,
    suites: suiteStats
  };
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
    // ============================================================
    // INDEPENDENT SUITES - Each suite can run independently
    // Tests use beforeEach hooks to set up their own state
    // ============================================================
    
    // Onboarding tests - tests onboarding screens and navigation
    onboarding: [
      './tests/specs/OnboardingTests.ts',
    ],
    
    // SignUp tests - tests password creation, entry, vault selection
    signup: [
      './tests/specs/SignUpTests.ts',
    ],
    
    // Sidebar tests - independent, sets up its own state
    sidebar: [
      './tests/specs/SidebarTests.ts',
    ],
    
    // Settings tests - independent, sets up its own state
    settings: [
      './tests/specs/SettingsTests.ts',
    ],
    
    // Home tests - independent, sets up its own state
    home: [
      './tests/specs/HomeTests.ts',
    ],
    
    // ============================================================
    // COMBINED SUITES - Run multiple independent suites together
    // Order doesn't matter since each test sets up its own state
    // ============================================================
    
    // Core authentication flow
    auth: [
      './tests/specs/OnboardingTests.ts',
      './tests/specs/SignUpTests.ts',
    ],

    // Onboarding + SignUp + Sidebar (matches npm script test:onboarding-signup-sidebar)
    onboardingSignupSidebar: [
      './tests/specs/OnboardingTests.ts',
      './tests/specs/SignUpTests.ts',
      './tests/specs/SidebarTests.ts',
    ],

    // Onboarding + SignUp + Sidebar + Settings (matches npm script test:onboarding-signup-sidebar-settings)
    onboardingSignupSidebarSettings: [
      './tests/specs/OnboardingTests.ts',
      './tests/specs/SignUpTests.ts',
      './tests/specs/SidebarTests.ts',
      './tests/specs/SettingsTests.ts',
    ],
    
    // All tests
    all: [
      './tests/specs/OnboardingTests.ts',
      './tests/specs/SignUpTests.ts',
      './tests/specs/SidebarTests.ts',
      './tests/specs/SettingsTests.ts',
      './tests/specs/HomeTests.ts',
    ],
    
    // ============================================================
    // LEGACY ALIASES - Kept for backward compatibility
    // ============================================================
    fullFlow: [
      './tests/specs/OnboardingTests.ts',
      './tests/specs/SignUpTests.ts',
    ],
    settingsOnly: [
      './tests/specs/SettingsTests.ts',
    ],
    sidebarOnly: [
      './tests/specs/SidebarTests.ts',
    ],
    homeOnly: [
      './tests/specs/HomeTests.ts',
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
            'appium:platformVersion': process.env.EMULATOR_VERSION || '16',
            'appium:appPackage': 'com.pears.pass',
            'appium:noReset': true,
            'appium:fullReset': false,
            'appium:allowTestPackages': true,
            'appium:enableBiometric': true,
            'appium:biometricStrategy': 'fingerprint',
            'appium:autoGrantPermissions': true,
            'appium:newCommandTimeout': 300,
            'appium:dontStopAppOnReset': true
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
  waitforTimeout: 15000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,

  framework: 'mocha',
  reporters: ENABLE_QASE
    ? [
        'spec',
        [
          WDIOQaseReporter,
          {
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true,
            useCucumber: false,
          },
        ],
        ['ctrf-json', {
          outputDir: './ctrl',
          appName: 'PearPass Mobile',
          appVersion: process.env.APP_VERSION || '1.1.1',
          osPlatform: PLATFORM,
        }],
      ]
    : [
        'spec',
        ['ctrf-json', {
          outputDir: './ctrl',
          appName: 'PearPass Mobile',
          appVersion: process.env.APP_VERSION || '1.1.1',
          osPlatform: PLATFORM,
        }],
      ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 300000
  },

  /* ---------------- Hooks ---------------- */
  async onPrepare() {
    if (RUN_TARGET === 'local_emulator' && PLATFORM === 'Android' && process.env.PUSH_TEST_DATA === 'true') {
      pushTestDataToEmulator();
    }
    if (ENABLE_QASE) {
      await beforeRunHook();
      const specsDir = path.resolve(__dirname, 'tests', 'specs');
      await qaseSync.initSync(specsDir);
    }
  },

  async beforeSession(_config, capabilities) {
    console.log(`\n🚀 Running platform: ${PLATFORM}`);
    console.log(`🎯 Target: ${RUN_TARGET}`);
    console.log(`📊 Qase: ${ENABLE_QASE ? 'ENABLED' : 'DISABLED'}`);
    console.log(`📨 Slack: ${ENABLE_SLACK ? 'ENABLED' : 'DISABLED'}`);

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
      
      const caseIds = qaseSync.extractAllCaseIds(test.title);
      qaseSync.recordTestResult(
        caseIds.length > 0 ? caseIds : null,
        test.title,
        result.passed ? 'passed' : 'failed',
        result.duration,
        result.error?.message
      );
    }
  },

  async onComplete(exitCode, _config, _capabilities) {
    const endTime = Date.now();
    const totalDuration = Math.round((endTime - testStartTime) / 1000);
    
    console.log('\n🏁 E2E Completed.');
    console.log(`Exit Code: ${exitCode}`);
    
    // Parse stats from CTRF reports
    const stats = parseCTRFStats();
    
    // Non-zero exit with zero tests: connection error, timeout, etc.
    if (exitCode !== 0 && stats.total === 0) {
      // No tests actually ran
      stats.total = 0;
      stats.passed = 0;
      stats.failed = 1; // Count as failed run
    }
    
    const passedRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
    
    console.log(`📊 Summary: ${stats.passed} passed, ${stats.failed} failed out of ${stats.total} tests (${passedRate}% success)`);
    console.log(`⏱️  Total duration: ${totalDuration}s`);
    
    // Per-suite breakdown
    console.log('\n📋 Test Suites Breakdown:');
    if (Object.keys(stats.suites).length > 0) {
      for (const [suiteName, suiteStats] of Object.entries(stats.suites)) {
        const suiteRate = suiteStats.total > 0 ? Math.round((suiteStats.passed / suiteStats.total) * 100) : 0;
        console.log(`   ${suiteName}: ${suiteStats.passed}/${suiteStats.total} (${suiteRate}%)`);
      }
    } else {
      console.log('   No test suites executed');
    }
    
    // Qase integration
    if (ENABLE_QASE) {
      await afterRunHook();
      await qaseSync.completeSync();
      if (QASE_PLAN_ID > 0) {
        console.log(`📤 Qase results sent to Plan ID: ${QASE_PLAN_ID} (auto-created run)`);
      } else if (QASE_RUN_ID > 0) {
        console.log(`📤 Qase results sent to Run ID: ${QASE_RUN_ID}`);
      } else {
        console.log(`📤 Qase results sent (auto-created run)`);
      }
    }

    // Slack integration
    if (ENABLE_SLACK && SLACK_WEBHOOK_URL) {
      try {
        console.log(`🔍 Attempting to send Slack notification...`);
        
        // Validate webhook URL
        const cleanWebhookUrl = SLACK_WEBHOOK_URL.trim();
        if (!cleanWebhookUrl || cleanWebhookUrl.length < 10) {
          console.error('❌ Slack webhook URL is empty or too short');
          return;
        }
        
        console.log(`🔍 Webhook URL length: ${cleanWebhookUrl.length} characters`);
        
        // Emoji from exit code and pass/fail counts
        let statusEmoji = '✅';
        if (exitCode !== 0) {
          // Non-zero exit → treat as failure
          statusEmoji = '❌';
        } else if (stats.failed > 0) {
          statusEmoji = stats.failed < stats.total * 0.3 ? '⚠️' : '❌';
        }
        
        // Suite lines for Slack body
        const suiteDetails = Object.keys(stats.suites).length > 0
          ? Object.entries(stats.suites)
              .map(([suiteName, suiteStats]) => {
                const suiteRate = suiteStats.total > 0 ? Math.round((suiteStats.passed / suiteStats.total) * 100) : 0;
                return `${suiteName}: ${suiteStats.passed}/${suiteStats.total} (${suiteRate}%)`;
              })
              .join('\n')
          : 'No test suites executed';
        
        // Build Slack payload
        const slackMessage = {
          text: `${statusEmoji} *E2E Test Results - ${PLATFORM}*\n
*Platform:* ${PLATFORM}
*Target:* ${RUN_TARGET}
*Total Tests:* ${stats.total}
*✅ Passed:* ${stats.passed}
*❌ Failed:* ${stats.failed}
*📈 Success Rate:* ${passedRate}%
*⏱️ Duration:* ${totalDuration}s

*📋 Test Suites Breakdown:*
${suiteDetails}

📅 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} • Exit Code: ${exitCode}`
        };
        
        // POST to Slack
        console.log(`📤 Sending to Slack: ${cleanWebhookUrl.substring(0, 50)}...`);
        const response = await axios.post(cleanWebhookUrl, slackMessage, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ Slack notification sent successfully! Status: ${response.status}`);
        
      } catch (error: any) {
        console.error('❌ Failed to send Slack notification:');
        
        if (error.response) {
          console.error(`   Status: ${error.response.status}`);
          console.error(`   Data: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          console.error(`   No response received from Slack`);
          console.error(`   Error: ${error.message}`);
        } else {
          console.error(`   Error: ${error.message}`);
        }
      }
    } else {
      console.log(`📨 Slack notifications are disabled or webhook URL not set`);
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