import BasePage from '@pages/BasePage';
import onboardingLocators from '@locators/OnboardingLocators';
import systemLocators from '@locators/SystemLocators';
import {
  ONBOARDING_SLIDES,
  ONBOARDING_HEADER,
  ONBOARDING_BUTTONS,
  type OnboardingSlide,
} from '@data/onboarding.data';
import { browser } from '@wdio/globals';

export class OnboardingPage extends BasePage {
  protected selectors = { ...onboardingLocators, ...systemLocators };

  async addFingerprintInPhoneSystem(): Promise<this> {
    await this.swipe('up');
    await this.swipe('up');
    await this.waitForDisplayed('settingsButton', 10000);
    await this.tap('settingsButton');
    await this.tapSecurityAndPrivacyButton();
    await this.waitForDisplayed('securityAndPrivacyTitle', 10000);
    await this.tap('deviceUnlockButton');
    await this.waitForDisplayed('deviceUnlockTitle', 10000);
    await this.tap('pixelImprintButton');
    await this.waitForDisplayed('chooseScreenLockTitle', 10000);
    await this.tap('pixelImprintPlusPinButton');
    await this.waitForDisplayed('pinInputField', 10000);
    await this.enterPin('3112');
    await this.tap('nextButton');
    await this.enterPin('3112');
    await this.tap('confirmButton');
    await this.waitForDisplayed('showAllNotificationsContentButton', 10000);
    await this.tap('showAllNotificationsContentButton');
    await this.waitForDisplayed('doneButton', 10000);
    await this.tap('doneButton');
    await this.waitForDisplayed('setupPixelImprintTittle', 10000);
    await this.swipeToUp();
    await this.swipeToUp();
    await this.tap('iAgreeButton');
    await this.waitForDisplayed('touchTheSensorTitle', 10000);
    await this.useBiometricsAuthentication();
    await this.waitForDisplayed('liftThenTouchAgainTitle', 10000);
    await this.useBiometricsAuthentication();
    await this.useBiometricsAuthentication();
    await this.waitForDisplayed('fingerPrintAddedTitle', 10000);
    await this.tap('doneButton2');
    return this.self;
  }

  async enterPin(password: string): Promise<this> {
    await this.type('pinInputField', password);
    return this.self;
  }

  async swipeToUp(): Promise<this> {
    await browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: 900, y: 1700 },
          { type: 'pointerDown' },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 600, x: 900, y: 1200 },
          { type: 'pointerUp' },
        ],
      },
    ]);
    await browser.releaseActions();
    await browser.pause(1500);
    return this.self;
  }

  async swipeToDown(): Promise<this> {
    for (let i = 0; i < 2; i++) {
      await this.swipe('down', 0.8);
      await browser.pause(500);
    }
    await browser.pause(1500);
    return this.self;
  }

  async tapSecurityAndPrivacyButton(): Promise<this> {
    const maxAttempts = 12;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const el = this.$('securityAndPrivacyButton');
      const visible = await el.isDisplayed().catch(() => false);

      if (visible) {
        await el.click();
        return this.self;
      }

      await this.swipeUpAtLeftEdge();
    }

    throw new Error(
      `"Security & privacy" was not found after ${maxAttempts} swipes up`
    );
  }

  private async swipeUpAtLeftEdge(): Promise<void> {
    const size = await browser.getWindowSize();
    const x = Math.round(size.width * 0.05);
    const startY = Math.round(size.height * 0.85);
    const endY = Math.round(size.height * 0.15);

    await browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 400, x, y: endY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await browser.releaseActions();
    await browser.pause(300);
  }

  async waitForLoaded(): Promise<this> {
    await browser.pause(3000);
    await this.waitForDisplayed('onboardingHeaderTitle', 20000);
    return this.self;
  }

  async useBiometricsAuthentication(): Promise<this> {
    if (!this.isAndroid) {
      throw new Error('Biometric fingerprint auth helper is implemented only for Android');
    }
  
    const fingerprintId = 1;
  
    try {
      console.log(`🔐 Emulating fingerprint touch (ID: ${fingerprintId})...`);
      const deviceId = await this.getCurrentDeviceId();
      const { promisify } = require('util');
      const execAsync = promisify(require('child_process').exec);
      await browser.pause(1500);
      console.log('   → Sending first fingerprint touch...');
      await execAsync(`adb -s ${deviceId} emu finger touch ${fingerprintId}`);
      await browser.pause(800);
      console.log('   → Sending second fingerprint touch...');
      await execAsync(`adb -s ${deviceId} emu finger touch ${fingerprintId}`);
      await browser.pause(800);
      console.log(`✅ Fingerprint ${fingerprintId} emulated twice on device ${deviceId}`);
      return this;
    } catch (error: any) {
      console.error('❌ Fingerprint authentication failed:', error.message || error);
      throw new Error(`Unable to perform biometric authentication with ID ${fingerprintId}`);
    }
  }

  getCurrentDeviceId = async (): Promise<string> => {
    try {
      const caps = await browser.getCapabilities();
      if (caps['appium:udid']) return caps['appium:udid'] as string;
      if (caps.udid) return caps.udid as string;
  
      const deviceInfo = await browser.execute('mobile: getDeviceInfo');
      if (deviceInfo?.udid) return deviceInfo.udid;
    } catch (e) {
      console.warn('Could not get device ID from Appium, falling back to adb devices');
    }
  
    // Fallback: parse `adb devices` output
    const { promisify } = require('util');
    const execAsync = promisify(require('child_process').exec);
    try {
      const { stdout } = await execAsync('adb devices');
      const lines = stdout.trim().split('\n');
      for (const line of lines) {
        if (line.includes('emulator-') && line.includes('device')) {
          return line.split('\t')[0].trim();
        }
      }
    } catch (e) { /* ignore */ }
  
    return 'emulator-5554';
  };

  async verifyHeader(): Promise<this> {
    await this.expectDisplayed('onboardingHeaderTitle');
    await this.expectDisplayedIfHasSelector('onboardingHeaderLogoIcon');
    return this.self;
  }

  async verifySlide(index: OnboardingSlide['index']): Promise<this> {
    const slide = ONBOARDING_SLIDES.find(s => s.index === index);
    if (!slide) throw new Error(`No onboarding data for slide ${index}`);

    await this.verifyHeader();

    await this.waitForDisplayed(`slide${index}Title`, 15000);
    await this.expectExactText(`slide${index}Title`, slide.title);

    await this.expectDisplayed(`slide${index}Description`);
    await this.expectExactText(`slide${index}Description`, slide.description);

    return this.self;
  }

  async verifyContinueButton(): Promise<this> {
    await this.expectDisplayed('continueButton');
    await this.expectDisplayed('continueButtonText');
    await this.expectExactText('continueButtonText', ONBOARDING_BUTTONS.continue);
    return this.self;
  }

  async tapContinue(): Promise<this> {
    await this.tap('continueButton');
    await browser.pause(800);
    return this.self;
  }

  async completeOnboarding(): Promise<this> {
    await this.waitForLoaded();
    for (const slide of ONBOARDING_SLIDES) {
      await this.verifySlide(slide.index);
      await this.tapContinue();
    }
    return this.self;
  }

  private async expectDisplayedIfHasSelector(name: string): Promise<void> {
    const selector = (this.selectors as Record<string, string>)[name];
    if (!selector || selector.trim().length === 0) return;
    await this.expectDisplayed(name);
  }
}

export default OnboardingPage;
