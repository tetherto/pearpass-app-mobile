import BasePage from  '../pageobjects/BasePage';
import signUpLocators from '../locators/SignUpLocators';

class SignUpPage extends BasePage {
  protected selectors = signUpLocators

  async waitForLoaded(): Promise<void> {
    await this.waitForDisplayed('onboardingLogo')
    await this.waitForDisplayed('onboardingProgressBar')
  }
}

export default SignUpPage;
