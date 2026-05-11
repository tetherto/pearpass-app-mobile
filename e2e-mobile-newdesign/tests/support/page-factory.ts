import OnboardingPage from '@pages/OnboardingPage';
import SignUpPage from '@pages/SignUpPage';
import HomePage from '@pages/HomePage';
import SettingsPage from '@pages/SettingsPage';
import CreateLoginPage from '@pages/CreateItemsPages/CreateLoginPage';
import CreateCreditCardPage from '@pages/CreateItemsPages/CreateCreditCardPage';
import CreateWifiPage from '@pages/CreateItemsPages/CreateWifiPage';
import SaveRecoveryPhrasePage from '@pages/CreateItemsPages/SaveRecoveryPhrasePage';
import CreateIdentityPage from '@pages/CreateItemsPages/CreateIdentityPage';
import CreateNotesPage from '@pages/CreateItemsPages/CreateNotesPage';
import CreateOtherPage from '@pages/CreateItemsPages/CreateOtherPage';
import CreatedLoginItemPage from '@pages/CreatedItemsPages/CreatedLoginItemPage';
import CreatedCreditCardItemPage from '@pages/CreatedItemsPages/CreatedCreditCardsItemPage';
import CreatedWiFiItemPage from '@pages/CreatedItemsPages/CreatedWiFiItemPage';
import CreatedIdentityItemPage from '@pages/CreatedItemsPages/CreatedIdentityItemPage';
import CreatePasswordPage from '@pages/CreateItemsPages/CreatePasswordPage';


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

  static get settings() {
    return new SettingsPage();
  }

  static get createLogin() {
    return new CreateLoginPage();
  }

  static get createCreditCard() {
    return new CreateCreditCardPage();
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

  static get createOther() {
    return new CreateOtherPage();
  }

  static get createPassword() {
    return new CreatePasswordPage();
  }

  static get createdLoginItem() {
    return new CreatedLoginItemPage();
  }

  static get createdCreditCardItem() {
    return new CreatedCreditCardItemPage();
  }

  static get createdWiFiItem() {
    return new CreatedWiFiItemPage();
  }

  static get createdIdentityItem() {
    return new CreatedIdentityItemPage();
  }
}
export const Pages = PageFactory;
