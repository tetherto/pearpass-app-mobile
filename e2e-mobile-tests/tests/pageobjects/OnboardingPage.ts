import BasePage from '@pages/BasePage';
import onboardingLocators from '@locators/OnboardingLocators';
import { ONBOARDING_STEPS, ONBOARDING_BUTTONS } from '@data/onboarding.data';
import { browser } from '@wdio/globals';

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

    await this.mainDescription(step.index).waitForDisplayed({
      timeoutMsg: `Main description for step ${step.index} did not appear`
    });

    await expect.soft(this.mainDescription(step.index))
      .toHaveText(step.mainDescription, { message: `Main description for step ${step.index} should match` });
    
    if (step.subDescription) {
      await this.subDescription(step.index).waitForDisplayed({
        timeoutMsg: `Sub description for step ${step.index} did not appear`
      });

      await expect.soft(this.subDescription(step.index))
        .toHaveText(step.subDescription, { message: `Sub description for step ${step.index} should match` });
    }
    const mediaLocator = this.mediaStep(step.index);
    const mediaLocatorValue = this.selectors[`onboardingMediaStep${step.index}`];
    if (mediaLocatorValue && mediaLocatorValue.trim() !== '') {
      await expect.soft(mediaLocator)
        .toBeDisplayed({ message: `Media content for step ${step.index} should be visible` });
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
    await expect.soft(this.continueText)
      .toHaveText(ONBOARDING_BUTTONS.continue, { message: 'Continue button should have correct text' });
    
    await expect.soft(this.skipText)
      .toHaveText(ONBOARDING_BUTTONS.skip, { message: 'Skip button should have correct text' });

    return this.self;
  }
}

export default OnboardingPage;
