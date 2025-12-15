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

// Additional environment variables with defaults
const {
  // Timeouts
  WDIO_WAITFOR_TIMEOUT = '20000',
  WDIO_CONNECTION_RETRY_TIMEOUT = '120000',
  WDIO_CONNECTION_RETRY_COUNT = '3',
  MOCHA_TIMEOUT = '180000',
  
  // Appium settings
  APPIUM_NO_RESET = 'false',
  APPIUM_FULL_RESET = 'false',
  APPIUM_AUTO_GRANT_PERMISSIONS = 'true',
  APPIUM_AUTO_ACCEPT_ALERTS = 'true',
  
  // Debug and logging
  DEBUG = 'false',
  LOG_LEVEL = 'info',
  CAPTURE_SCREENSHOTS_ON_FAIL = 'true',
} = process.env;

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
    'https://api-cloud.browserstack.com/app-automate/upload',
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
  specs: ['./tests/specs/**/*.ts'],

  maxInstances: IS_BS ? 4 : 1,

  logLevel: LOG_LEVEL as WebdriverIO.LogLevel,
  bail: 0,
  waitforTimeout: Number(WDIO_WAITFOR_TIMEOUT),
  connectionRetryTimeout: Number(WDIO_CONNECTION_RETRY_TIMEOUT),
  connectionRetryCount: Number(WDIO_CONNECTION_RETRY_COUNT),

  framework: 'mocha',

  reporters: [
    'spec',
    ['qase', {
      enabled: ENABLE_QASE,
      projectCode: QASE_PROJECT_CODE,
      runId: QASE_RUN_ID,
      logging: DEBUG === 'true',
      uploadAttachments: true,
    }],
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: Number(MOCHA_TIMEOUT),
  },

  // BrowserStack / Local Appium / Grid
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
          logTimestamp: true
        } 
      }]],

  // ===============================================
  // CAPABILITIES - Based on your old project structure
  // ===============================================
  capabilities: [
    // Local real Android device
    RUN_TARGET === 'local_real_android'
      ? {
          platformName: 'Android',
          'appium:automationName': 'UiAutomator2',
          'appium:udid': process.env.ANDROID_UDID || requiredEnv('ANDROID_UDID'),
          'appium:app': getLocalAppPath(),
          'appium:noReset': APPIUM_NO_RESET === 'true',
          'appium:fullReset': APPIUM_FULL_RESET === 'true',
          'appium:autoGrantPermissions': APPIUM_AUTO_GRANT_PERMISSIONS === 'true',
          'appium:newCommandTimeout': 300,
        }
      : // Local real iOS device
      RUN_TARGET === 'local_real_ios'
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
      : // Local Android emulator
      RUN_TARGET === 'local_emulator'
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
          'appium:newCommandTimeout': 300,
          ...(process.env.ANDROID_UDID ? { 'appium:udid': process.env.ANDROID_UDID } : {}),
        }
      : // BrowserStack Android
      IS_ANDROID
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
      : // BrowserStack iOS
      {
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
    // Create required directories
    const requiredDirs = ['./error-shots', './logs', './screenshots'];
    requiredDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
    
    console.log(`\n🚀 Running platform: ${PLATFORM}`);
    console.log(`🎯 Target: ${RUN_TARGET}`);
    console.log(`📊 Qase: ${ENABLE_QASE ? 'ENABLED' : 'DISABLED'}`);

    const localAppPath = getLocalAppPath();
    console.log(`📱 App path: ${localAppPath}`);

    // For BrowserStack, we need to upload the app and update capabilities
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

      // Update BrowserStack capabilities
      (capabilities as any)['appium:app'] = appUrl;
      
      const bstackOptions = (capabilities as any)['bstack:options'];
      if (bstackOptions) {
        bstackOptions.buildName = buildName;
      }
    }
  },

  // Failure screenshot
  afterTest: async (test, _context, { passed }) => {
    if (!passed && CAPTURE_SCREENSHOTS_ON_FAIL === 'true') {
      const safeTitle = test.title.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `FAIL_${safeTitle}_${Date.now()}.png`;
      try {
        await browser.saveScreenshot(`./error-shots/${filename}`);
        console.log(`📸 Error screenshot saved: ./error-shots/${filename}`);
      } catch (e: any) {
        console.error('Failed to save screenshot:', e.message);
      }
    }
  },

  onComplete: async () => {
    console.log('\n🏁 E2E run finished');
    if (ENABLE_QASE && QASE_RUN_ID) {
      console.log(`📤 Qase results sent to Run ID: ${QASE_RUN_ID}`);
    }
  },

  // TypeScript compiler settings
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json',
    },
  },
};