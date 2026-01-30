import BasePage from '@pages/BasePage';
import onboardingLocators from '@locators/OnboardingLocators';
import { ONBOARDING_STEPS, ONBOARDING_BUTTONS } from '@data/onboarding.data';
import { browser } from '@wdio/globals';

// Use global expect from expect-webdriverio for text comparison
declare const expect: any;

export class OnboardingPage extends BasePage {
  protected selectors = onboardingLocators;

  get logo() { return this.$('onboardingLogo'); }
  get progressBar() { return this.$('onboardingProgressBar'); }
  get continueButton() { return this.$('onboardingContinueButton'); }
  get skipButton() { return this.$('onboardingSkipButton'); }
  get continueText() { return this.$('onboardingContinueText'); }
  get skipText() { return this.$('onboardingSkipText'); }

  progressStep(index: number) { return this.$(`onboardingProgressStep${index}`); }
  mediaStep(index: number) { return this.$(`onboardingMediaStep${index}`); }
  mainDescription(index: number) { return this.$(`onboardingMainDescription${index}`); }
  subDescription(index: number) { return this.$(`onboardingSubDescription${index}`); }

  async waitForLoaded(): Promise<this> {
    await browser.pause(5000);
    await this.logo.waitForDisplayed({ timeoutMsg: 'Onboarding logo not visible' });
    await this.progressBar.waitForDisplayed({ timeoutMsg: 'Progress bar not visible' });
    return this.self;
  }

  async verifyStep(stepIndex: 0 | 1 | 2 | 3 | 4 | 5): Promise<this> {
    const step = ONBOARDING_STEPS.find(s => s.index === stepIndex);
    if (!step) throw new Error(`No data for onboarding step ${stepIndex}`);
  
    const WAIT_TIMEOUT = 15000;
    const POLL_INTERVAL = 500;
  
    // 1. Wait for main description to appear and check text
    await browser.waitUntil(
      async () => {
        const el = this.mainDescription(step.index);
        return (await el.isExisting()) && (await el.isDisplayed());
      },
      {
        timeout: WAIT_TIMEOUT,
        interval: POLL_INTERVAL,
        timeoutMsg: `Main description for step ${stepIndex} did not appear within ${WAIT_TIMEOUT}ms`
      }
    );
  
    const mainDescriptionActual = await this.mainDescription(step.index).getText();
    expect(mainDescriptionActual).toBe(step.mainDescription);
  
    // 2. If sub-description exists — wait and verify
    if (step.subDescription) {
      await browser.waitUntil(
        async () => {
          const el = this.subDescription(step.index);
          return (await el.isExisting()) && (await el.isDisplayed());
        },
        {
          timeout: WAIT_TIMEOUT,
          interval: POLL_INTERVAL,
          timeoutMsg: `Sub-description for step ${stepIndex} did not appear within ${WAIT_TIMEOUT}ms`
        }
      );
  
      const subDescriptionActual = await this.subDescription(step.index).getText();
      expect(subDescriptionActual).toBe(step.subDescription);
    }
  
    // 3. Check media content (if locator exists)
    const mediaLocatorValue = this.selectors[`onboardingMediaStep${stepIndex}`];
    if (mediaLocatorValue && mediaLocatorValue.trim() !== '') {
      const mediaEl = this.mediaStep(step.index);
  
      await browser.waitUntil(
        async () => await mediaEl.isDisplayed(),
        {
          timeout: WAIT_TIMEOUT,
          interval: POLL_INTERVAL,
          timeoutMsg: `Media content for step ${stepIndex} did not appear within ${WAIT_TIMEOUT}ms`
        }
      );
  
      // Additional check - element is already verified by waitUntil above
      const isDisplayed = await mediaEl.isDisplayed();
      if (!isDisplayed) {
        throw new Error(`Media content for step ${stepIndex} should be visible`);
      }
    }
  
    return this.self;
  }

  async tapContinue(currentStep?: number): Promise<this> {
    await this.continueButton.click();
    if (currentStep === 0) {
      await browser.pause(3000);
    } else {
      await browser.pause(500);
    }
    return this.self;
  }

  async tapSkip(): Promise<this> {
    await this.skipButton.click();
    return this.self;
  }

  async completeOnboarding(): Promise<this> {
    await this.waitForLoaded();
    for (const step of ONBOARDING_STEPS) {
      await this.verifyStep(step.index);
      if (step.index < 5) await this.continueButton.click();
    }
    await this.continueButton.click();
    return this.self;
  }

  async goToStep(stepIndex: 0 | 1 | 2 | 3 | 4 | 5): Promise<this> {
    await this.progressStep(stepIndex).click();
    return this.verifyStep(stepIndex); 
  }

  async verifyButtons(): Promise<this> {
    // Use exact text matching with getText() and expect().toBe() for strict comparison
    const continueTextActual = await this.continueText.getText();
    expect(continueTextActual).toBe(ONBOARDING_BUTTONS.continue);
    
    const skipTextActual = await this.skipText.getText();
    expect(skipTextActual).toBe(ONBOARDING_BUTTONS.skip);

    return this.self;
  }
}

export default OnboardingPage;
