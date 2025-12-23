import BasePage from '@pages/BasePage';
import onboardingLocators from '@locators/OnboardingLocators';
import { ONBOARDING_STEPS } from '@data/onboarding.data';

export class OnboardingPage extends BasePage {
  protected selectors = onboardingLocators;

  get logo() { return this.$('onboardingLogo'); }
  get progressBar() { return this.$('onboardingProgressBar'); }
  get mainDescription() { return this.$('onboardingMainDescription'); }
  get subDescription() { return this.$('onboardingSubDescription'); }
  get continueButton() { return this.$('onboardingContinueButton'); }
  get skipButton() { return this.$('onboardingSkipButton'); }

  progressStep(index: number) { return this.$(`onboardingProgressStep${index}`); }
  mediaStep(index: number) { return this.$(`onboardingMediaStep${index}`); }

  async waitForLoaded(): Promise<this> {
    await this.logo.waitForDisplayed({ timeoutMsg: 'Onboarding logo not visible' });
    await this.progressBar.waitForDisplayed({ timeoutMsg: 'Progress bar not visible' });
    return this.self;
  }

  async verifyStep(stepIndex: 0 | 1 | 2 | 3 | 4 | 5): Promise<this> {
    const step = ONBOARDING_STEPS.find(s => s.index === stepIndex);
    if (!step) throw new Error(`No data for onboarding step ${stepIndex}`);

    await expect.soft(this.progressStep(step.index))
      .toBeDisplayed({ message: `Progress indicator for step ${step.index} should be active` });

    await expect.soft(this.mainDescription)
      .toHaveText(step.mainDescription);
    if (step.subDescription) {
      await expect.soft(this.subDescription)
        .toHaveText(step.subDescription);
    }

    await expect.soft(this.mediaStep(step.index))
      .toBeDisplayed({ message: `Media content for step ${step.index} should be visible` });

    return this.self;
  }

  async tapContinue(): Promise<this> {
    await this.continueButton.click();
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
}

export default OnboardingPage;
