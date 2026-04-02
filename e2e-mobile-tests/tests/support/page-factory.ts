import OnboardingPage from '@pages/OnboardingPage';
import SignUpPage from '@pages/SignUpPage';
import HomePage from '@pages/HomePage/HomePage';
import SidebarPage from '@pages/SidebarPage';
import SettingsPage from '@pages/SettingsPage';
import CreateLoginPage from '@pages/HomePage/CreateLoginPage';
import CreateCreditCardsPage from '@pages/HomePage/CreateCreditCardsPage';
import CreateWifiPage from '@pages/HomePage/CreateWifiPage';
import SaveRecoveryPhrasePage from '@pages/HomePage/SaveRecoveryPhrasePage';
import CreateIdentityPage from '@pages/HomePage/CreateIdentityPage';
import CreateNotesPage from '@pages/HomePage/CreateNotesPage';
import CreateCustomElementPage from '@pages/HomePage/CreateCustomElementPage';
import CreatedLoginItemPage from '@pages/CreatedLoginItemPage';
import CreatedCreditCardsItemPage from '@pages/CreatedCreditCardsItemPage';
import CreatedWiFiItemPage from '@pages/CreatedWiFiItemPage';
import CreatedIdentityItemPage from '@pages/CreatedIdentityItemPage';

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

  static get settings() {
    return new SettingsPage();
  }

  static get createLogin() {
    return new CreateLoginPage();
  }

  static get createCreditCards() {
    return new CreateCreditCardsPage();
  }

  static get createWifi() {
    return new CreateWifiPage();
  }

  static get saveRecoveryPhrase() {
    return new SaveRecoveryPhrasePage();
  }

  static get createIdentity() {
    return new CreateIdentityPage();
  }

  static get createNotes() {
    return new CreateNotesPage();
  }

  static get createCustomElement() {
    return new CreateCustomElementPage();
  }

  static get createdLoginItem() {
    return new CreatedLoginItemPage();
  }

  static get createdCreditCardsItem() {
    return new CreatedCreditCardsItemPage();
  }

  static get createdWiFiItem() {
    return new CreatedWiFiItemPage();
  }

  static get createdIdentityItem() {
    return new CreatedIdentityItemPage();
  }
}
export const Pages = PageFactory;
