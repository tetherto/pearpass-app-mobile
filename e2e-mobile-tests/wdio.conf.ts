import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import axios from 'axios';
import * as FormData from 'form-data';

type WdioConfig = WebdriverIO.Config & {
  autoCompileOpts?: {
    autoCompile: boolean;
    tsNodeOpts: {
      transpileOnly: boolean;
      project: string;
    };
  };
};

// ===============================================
// ENVIRONMENT VARIABLES & CONSTANTS
// ===============================================
const PLATFORM = (process.env.PLATFORM || 'Android') as 'Android' | 'iOS';
const RUN_TARGET = (process.env.RUN_TARGET || 'local_emulator') as
  | 'bs'
  | 'local_real_android'
  | 'local_real_ios'
  | 'local_emulator';

const IS_BS = RUN_TARGET === 'bs';
const IS_ANDROID = PLATFORM === 'Android';

const ENABLE_QASE = process.env.ENABLE_QASE === 'true';
const QASE_RUN_ID = Number(process.env.QASE_TEST_RUN_ID || '0');
const QASE_PROJECT_CODE = process.env.QASE_PROJECT_CODE || 'PAS';

const BUILD_PREFIX = process.env.BUILD_PREFIX || 'PearPass E2E';
const APP_VERSION = process.env.APP_VERSION || 'unknown';

const BROWSERSTACK_APP_UPLOAD_URL = 'https://api-cloud.browserstack.com/app-automate/upload';

const {
  WDIO_WAITFOR_TIMEOUT = '5000', // Reduced from 10000 for faster element detection
  WDIO_CONNECTION_RETRY_TIMEOUT = '30000',
  WDIO_CONNECTION_RETRY_COUNT = '2',
  MOCHA_TIMEOUT = '90000',
  APPIUM_NEW_COMMAND_TIMEOUT = '120',

  APPIUM_NO_RESET = 'true',
  APPIUM_FULL_RESET = 'false',
  APPIUM_AUTO_GRANT_PERMISSIONS = 'true',
  APPIUM_AUTO_ACCEPT_ALERTS = 'true',
  APPIUM_SKIP_UNLOCK = 'true',
  APPIUM_SKIP_SERVER_INSTALLATION = 'false',

  DEBUG = 'false',
  LOG_LEVEL = 'info',
  CAPTURE_SCREENSHOTS_ON_FAIL = 'true',
  ENABLE_REALTIME_REPORTING = 'false',
  QASE_UPLOAD_ATTACHMENTS = 'false',
} = process.env;

const VERBOSE_TESTS = process.env.VERBOSE_TESTS === 'true';

// ===============================================
// HELPER FUNCTIONS
// ===============================================
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function uploadAppToBS(localPath: string): Promise<string> {
  if (!fs.existsSync(localPath)) {
    throw new Error(`App not found: ${localPath}`);
  }

  const form = new (FormData as any)();
  form.append('file', fs.createReadStream(localPath));

  const { data } = await axios.post(
    BROWSERSTACK_APP_UPLOAD_URL,
    form,
    {
      auth: {
        username: requiredEnv('BROWSERSTACK_USERNAME'),
        password: requiredEnv('BROWSERSTACK_ACCESS_KEY'),
      },
      headers: form.getHeaders(),
    }
  );

  return data.app_url;
}

function getLocalAppPath(): string {
  const base = path.resolve(__dirname, 'apps');
  return IS_ANDROID
    ? path.join(base, 'android', process.env.ANDROID_APP || 'PearPass.apk')
    : path.join(base, 'ios', process.env.IOS_APP || 'PearPass.ipa');
}

// ===============================================
// WDIO CONFIGURATION
// ===============================================
export const config: WdioConfig = {
  runner: 'local',

  // Test Specs
  // NOTE: By default, each spec file runs in its own session (app restarts between files).
  // To run all tests in one session without app restart, use suites (see below).
  // Example: npm run wdio -- --suite fullFlow
  specs: ['./tests/specs/**/*.ts'],

  // Suites: Group test files to run in the same session
  // This allows tests to run sequentially in one app session without restarting
  // IMPORTANT: When using suites, all spec files in the suite share ONE session.
  // The app will NOT restart between spec files within the same suite.
  suites: {
    // Full flow suite: all tests run in one session (recommended for E2E flow)
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
  },

  maxInstances: IS_BS ? 4 : 1,
  maxInstancesPerCapability: 1,

  logLevel: (LOG_LEVEL as 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent'),
  outputDir: './logs',
  logLevels: {
  webdriver: VERBOSE_TESTS ? 'info' : 'warn',
  '@wdio/appium-service': VERBOSE_TESTS ? 'info' : 'warn',
  '@wdio/local-runner': 'warn',
  '@wdio/cli': 'warn',
  '@wdio/utils': 'warn',
  },
  bail: 0,
  waitforTimeout: Number(WDIO_WAITFOR_TIMEOUT),
  connectionRetryTimeout: Number(WDIO_CONNECTION_RETRY_TIMEOUT),
  connectionRetryCount: Number(WDIO_CONNECTION_RETRY_COUNT),

  framework: 'mocha',

  reporters: [
    ['spec', {
      showPreface: true,
      realtimeReporting: ENABLE_REALTIME_REPORTING === 'true',
    }],
    ['qase', {
      enabled: ENABLE_QASE,
      projectCode: QASE_PROJECT_CODE,
      runId: QASE_RUN_ID,
      logging: DEBUG === 'true',
      uploadAttachments: QASE_UPLOAD_ATTACHMENTS === 'true',
    }],
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: Number(MOCHA_TIMEOUT),
    grep: process.env.MOCHA_GREP || undefined,
  },

  hostname: IS_BS ? 'hub.browserstack.com' : undefined,
  port: IS_BS ? 443 : undefined,
  path: IS_BS ? '/wd/hub' : undefined,
  user: IS_BS ? requiredEnv('BROWSERSTACK_USERNAME') : undefined,
  key: IS_BS ? requiredEnv('BROWSERSTACK_ACCESS_KEY') : undefined,

  services: IS_BS
    ? [['browserstack', { browserstackLocal: process.env.BSTACK_LOCAL === 'true' }]]
    : [['appium', {
        args: {
          log: './logs/appium.log',
          relaxedSecurity: true,
          logTimestamp: true,
          logLevel: VERBOSE_TESTS ? 'info' : 'warn',
          logNoColors: true,
          sessionOverride: true,
          keepAliveTimeout: 600,
          address: '127.0.0.1',
          port: 4723,
          basePath: '/',
        },
        logPath: './logs',
        command: process.env.APPIUM_COMMAND || 'appium',
        waitStartup: 20000, // Increased for slow machines and first-time startup
        env: {
          ...process.env,
          NO_RESET: APPIUM_NO_RESET === 'true' ? 'true' : 'false',
        }
      }]],

  // ===============================================
  // CAPABILITIES
  // ===============================================
  capabilities: [
    RUN_TARGET === 'local_real_android'
      ? {
          platformName: 'Android',
          'appium:automationName': 'UiAutomator2',
          'appium:udid': process.env.ANDROID_UDID || requiredEnv('ANDROID_UDID'),
          'appium:app': getLocalAppPath(),
          'appium:noReset': APPIUM_NO_RESET === 'true',
          'appium:fullReset': APPIUM_FULL_RESET === 'true',
          'appium:autoGrantPermissions': APPIUM_AUTO_GRANT_PERMISSIONS === 'true',
          'appium:newCommandTimeout': Number(APPIUM_NEW_COMMAND_TIMEOUT),
          'appium:skipUnlock': APPIUM_SKIP_UNLOCK === 'true',
          'appium:skipServerInstallation': APPIUM_SKIP_SERVER_INSTALLATION === 'true',
          'appium:uiautomator2ServerLaunchTimeout': 30000,
        }
      : RUN_TARGET === 'local_real_ios'
      ? {
          platformName: 'iOS',
          'appium:automationName': 'XCUITest',
          'appium:udid': process.env.IOS_UDID || requiredEnv('IOS_UDID'),
          'appium:app': getLocalAppPath(),
          'appium:noReset': APPIUM_NO_RESET === 'true',
          'appium:fullReset': APPIUM_FULL_RESET === 'true',
          'appium:xcodeOrgId': process.env.XCODE_ORG_ID,
          'appium:xcodeSigningId': 'iPhone Developer',
        }
      : RUN_TARGET === 'local_emulator'
      ? {
          platformName: 'Android',
          'appium:automationName': 'UiAutomator2',
          'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Pixel_7',
          'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '13',
          'appium:app': getLocalAppPath(),
          'appium:noReset': APPIUM_NO_RESET === 'true',
          'appium:fullReset': APPIUM_FULL_RESET === 'true',
          'appium:autoGrantPermissions': APPIUM_AUTO_GRANT_PERMISSIONS === 'true',
          'appium:autoAcceptAlerts': APPIUM_AUTO_ACCEPT_ALERTS === 'true',
          'appium:newCommandTimeout': Number(APPIUM_NEW_COMMAND_TIMEOUT),
          'appium:skipUnlock': APPIUM_SKIP_UNLOCK === 'true',
          'appium:skipServerInstallation': APPIUM_SKIP_SERVER_INSTALLATION === 'true',
          'appium:uiautomator2ServerLaunchTimeout': 30000,
          ...(process.env.ANDROID_UDID ? { 'appium:udid': process.env.ANDROID_UDID } : {}),
        }
      : IS_ANDROID
      ? {
          platformName: 'Android',
          'appium:automationName': 'UiAutomator2',
          'bstack:options': {
            deviceName: process.env.BS_ANDROID_DEVICE || 'Samsung Galaxy S24',
            osVersion: process.env.BS_ANDROID_VERSION || '14.0',
            projectName: 'PearPass Mobile',
            sessionName: 'Android E2E',
            debug: DEBUG === 'true',
            networkLogs: DEBUG === 'true',
            appiumVersion: '2.0.0',
          },
        }
      : {
          platformName: 'iOS',
          'appium:automationName': 'XCUITest',
          'bstack:options': {
            deviceName: process.env.BS_IOS_DEVICE || 'iPhone 15 Pro',
            osVersion: process.env.BS_IOS_VERSION || '17',
            projectName: 'PearPass Mobile',
            sessionName: 'iOS E2E',
            debug: DEBUG === 'true',
            networkLogs: DEBUG === 'true',
            appiumVersion: '2.0.0',
          },
        }
  ],

  // ===============================================
  // HOOKS
  // ===============================================
  async beforeSession(_config, capabilities: WebdriverIO.Capabilities) {
    const requiredDirs = ['./error-shots', './logs', './screenshots'];
    requiredDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('🚀 E2E TEST RUN STARTING');
    console.log('='.repeat(60));
    console.log(`📱 Platform: ${PLATFORM}`);
    console.log(`🎯 Target: ${RUN_TARGET}`);
    console.log(`📊 Qase: ${ENABLE_QASE ? 'ENABLED' : 'DISABLED'}`);
    console.log(`⏱️  Timeouts (current values):`);
    console.log(`   - WaitFor: ${WDIO_WAITFOR_TIMEOUT}ms${process.env.WDIO_WAITFOR_TIMEOUT ? ' (from env)' : ' (default)'}`);
    console.log(`   - Mocha: ${MOCHA_TIMEOUT}ms${process.env.MOCHA_TIMEOUT ? ' (from env)' : ' (default)'}`);
    console.log(`   - Connection retry: ${WDIO_CONNECTION_RETRY_TIMEOUT}ms (${WDIO_CONNECTION_RETRY_COUNT} attempts)${process.env.WDIO_CONNECTION_RETRY_TIMEOUT ? ' (from env)' : ' (default)'}`);
    console.log(`   - Appium command: ${APPIUM_NEW_COMMAND_TIMEOUT}s${process.env.APPIUM_NEW_COMMAND_TIMEOUT ? ' (from env)' : ' (default)'}`);
    
    if (process.env.WDIO_WAITFOR_TIMEOUT || process.env.MOCHA_TIMEOUT || process.env.WDIO_CONNECTION_RETRY_TIMEOUT) {
      console.log(`\n⚠️  Note: Some timeout values are overridden by environment variables.`);
      console.log(`   To use optimized defaults, remove these from .env or system environment:`);
      if (process.env.WDIO_WAITFOR_TIMEOUT) console.log(`   - WDIO_WAITFOR_TIMEOUT=${process.env.WDIO_WAITFOR_TIMEOUT}`);
      if (process.env.MOCHA_TIMEOUT) console.log(`   - MOCHA_TIMEOUT=${process.env.MOCHA_TIMEOUT}`);
      if (process.env.WDIO_CONNECTION_RETRY_TIMEOUT) console.log(`   - WDIO_CONNECTION_RETRY_TIMEOUT=${process.env.WDIO_CONNECTION_RETRY_TIMEOUT}`);
      if (process.env.WDIO_CONNECTION_RETRY_COUNT) console.log(`   - WDIO_CONNECTION_RETRY_COUNT=${process.env.WDIO_CONNECTION_RETRY_COUNT}`);
    }
    
    const localAppPath = getLocalAppPath();
    console.log(`📦 App: ${path.basename(localAppPath)}`);
    if (!IS_BS) {
      console.log(`🔧 Appium: ${process.env.APPIUM_COMMAND || 'appium'} (check logs/appium.log if connection fails)`);
    }
    console.log('='.repeat(60) + '\n');

    if (IS_BS) {
      const appUrl = await uploadAppToBS(localAppPath);
      console.log(`📤 App uploaded to BrowserStack: ${appUrl}`);

      const appVersion =
        APP_VERSION !== 'unknown'
          ? APP_VERSION
          : fs.existsSync(localAppPath)
          ? path.basename(localAppPath).match(/\d+\.\d+\.\d+/)?.[0] || 'unknown'
          : 'unknown';

      const buildName = `${BUILD_PREFIX} v${appVersion} • ${new Date()
        .toISOString()
        .slice(0, 10)}`;

      (capabilities as any)['appium:app'] = appUrl;

      const bstackOptions = (capabilities as any)['bstack:options'];
      if (bstackOptions) {
        bstackOptions.buildName = buildName;
      }
    }
  },

  beforeTest: async (test, _context) => {
    const testTitle = test.title || 'Unknown test';
    const suiteTitle = test.parent || 'Unknown suite';
    console.log(`\n🧪 Running: ${suiteTitle} → ${testTitle}`);
  },

  afterTest: async (test, _context, { passed, duration }) => {
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    const durationSec = (duration / 1000).toFixed(2);
    console.log(`   ${status} (${durationSec}s)`);
    
    if (!passed && CAPTURE_SCREENSHOTS_ON_FAIL === 'true') {
      const safeTitle = test.title.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `FAIL_${safeTitle}_${Date.now()}.png`;
      try {
        await browser.saveScreenshot(`./error-shots/${filename}`);
        console.log(`   📸 Error screenshot saved: ./error-shots/${filename}`);
      } catch (e: any) {
        console.error(`   ⚠️  Failed to save screenshot: ${e.message}`);
      }
    }
  },

  beforeCommand: function (_commandName, _args) {
  },

  afterCommand: function (_commandName, _args, _result, error) {
    if (error) {
      if (DEBUG === 'true') {
        console.log(`[CMD_ERR] ${_commandName}: ${error.message}`);
      }
      
      if (error.message && error.message.includes('Unable to connect')) {
        console.error('\n' + '='.repeat(60));
        console.error('❌ APPIUM CONNECTION ERROR');
        console.error('='.repeat(60));
        console.error('Unable to connect to Appium server.');
        console.error(`\nError: ${error.message}`);
        console.error('\n📋 Troubleshooting Steps:');
        console.error('   1. Check if Appium is installed globally:');
        console.error('      npm list -g appium');
        console.error('   2. If not installed, install it:');
        console.error('      npm install -g appium');
        console.error('   3. Check Appium logs for details:');
        console.error('      Check logs/appium.log file');
        console.error('   4. Verify Appium can start manually:');
        console.error('      appium --version');
        console.error('   5. Check if port 4723 is available:');
        console.error('      netstat -ano | findstr :4723 (Windows)');
        console.error('   6. If using custom Appium path, set:');
        console.error('      APPIUM_COMMAND="path/to/appium"');
        console.error('   7. For more verbose logging, set:');
        console.error('      VERBOSE_TESTS=true');
        console.error('='.repeat(60) + '\n');
      }
    }
  },


  onComplete: async (_exitCode, _config, _capabilities, results) => {
    console.log('\n' + '='.repeat(60));
    console.log('🏁 E2E TEST RUN COMPLETED');
    console.log('='.repeat(60));
    
    if (results) {
      const total = results.finished;
      const passed = results.passed;
      const failed = results.failed;
      const duration = results.duration || 0;
      const durationMin = Math.floor(duration / 60000);
      const durationSec = Math.floor((duration % 60000) / 1000);
      
      console.log(`📊 Results:`);
      console.log(`   ✅ Passed: ${passed}`);
      console.log(`   ❌ Failed: ${failed}`);
      console.log(`   📝 Total:  ${total}`);
      console.log(`   ⏱️  Duration: ${durationMin}m ${durationSec}s`);
    }
    
    if (ENABLE_QASE && QASE_RUN_ID) {
      console.log(`\n📤 Qase results sent to Run ID: ${QASE_RUN_ID}`);
    }
    
    console.log('='.repeat(60) + '\n');
  },

  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json',
    },
  },
};
