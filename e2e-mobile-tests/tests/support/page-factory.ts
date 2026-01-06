import OnboardingPage from '@pages/OnboardingPage';
import SignUpPage from '@pages/SignUpPage';
import HomePage from '@pages/HomePage';
import SidebarPage from '@pages/SidebarPage';

class PageFactory {
  static get onboarding() {
    return new OnboardingPage();
  }

  static get signUp() {
    return new SignUpPage();
  }

  static get home() {
    return new HomePage();
  }

  static get sidebar() {
    return new SidebarPage();
  }
}

export const Pages = PageFactory;