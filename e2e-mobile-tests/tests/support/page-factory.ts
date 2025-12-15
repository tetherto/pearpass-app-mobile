import OnboardingPage from '../pageobjects/OnboardingPage';
import SignUpPage from '../pageobjects/SignUpPage';
// Add new pages here as the project grows

class PageFactory {
  static get onboarding() {
    return new OnboardingPage();
  }

  static get signUp() {
    return new SignUpPage();
  }
}

export const Pages = PageFactory;