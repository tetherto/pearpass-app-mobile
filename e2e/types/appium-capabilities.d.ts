// types/appium-capabilities.d.ts
import 'webdriverio';

declare module 'webdriverio' {
  interface Capabilities {
    // Android biometric
    'appium:enableBiometric'?: boolean;
    'appium:biometricStrategy'?: string;
    'appium:allowTestPackages'?: boolean;
    
    // iOS / WDA
    'appium:showXcodeLog'?: boolean;
    'appium:xcodeOrgId'?: string;
    'appium:xcodeSigningId'?: string;
    'appium:updatedWDABundleId'?: string;
    'appium:usePrebuiltWDA'?: boolean;
    'appium:useNewWDA'?: boolean;
    'appium:wdaLaunchTimeout'?: number;
    'appium:wdaConnectionTimeout'?: number;
    
    // Common Appium flags
    'appium:skipLogCapture'?: boolean;
    'appium:dontStopAppOnReset'?: boolean;
    'appium:settings'?: Record<string, any>;
    
    // Additional capabilities
    'appium:autoGrantPermissions'?: boolean;
    'appium:noReset'?: boolean;
    'appium:fullReset'?: boolean;
    'appium:newCommandTimeout'?: number;
    'appium:adbExecTimeout'?: number;
    'appium:unicodeKeyboard'?: boolean;
    'appium:resetKeyboard'?: boolean;
  }
}