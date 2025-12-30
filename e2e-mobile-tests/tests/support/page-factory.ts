import OnboardingPage from '@pages/OnboardingPage';
import SignUpPage from '@pages/SignUpPage';

class PageFactory {
  static get onboarding() {
    return new OnboardingPage();
  }

  static get signUp() {
    return new SignUpPage();
  }
}

export const Pages = PageFactory;