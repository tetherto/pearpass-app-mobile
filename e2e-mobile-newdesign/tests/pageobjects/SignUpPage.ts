import { browser } from '@wdio/globals';
import BasePage from '@pages/BasePage';
import signUpLocators from '@locators/SignUpLocators';
import {
  CREATE_MASTER_PASSWORD_PAGE,
  TURN_ON_AUTOFILL_PAGE,
  PREFERED_SERVICES_PAGE,
  UNLOCK_WITH_BIOMETRICS_PAGE,
  UNLOCK_WITH_BIOMETRICS_POPUP,
  getTestPassword,
  type TestPasswordKey,
  type SignUpPasswordFieldName,
  type SignUpPasswordStrength,
  type SignUpPasswordMatchStatus,
  type SignUpPasswordIndicatorStatus,
} from '@data/signUp.data';


export class SignUpPage extends BasePage {
  protected selectors = signUpLocators;

  async waitForCreatePasswordScreen(): Promise<this> {
    await this.waitForDisplayed('createMasterPasswordTitle', 30000);
    await this.expectDisplayed('createMasterPasswordTitle');
    await this.expectExactText(
      'createMasterPasswordTitle',
      CREATE_MASTER_PASSWORD_PAGE.title,
    );
    return this.self;
  }

  async verifyCreateMasterPasswordPageWithAllElements(): Promise<this> {
    await this.waitForDisplayed('createMasterPasswordTitle', 30000);
    await this.expectExactText('createMasterPasswordTitle', CREATE_MASTER_PASSWORD_PAGE.title);
    await this.expectDisplayed('createMasterPasswordDescription');
    await this.expectExactText('createMasterPasswordDescription', CREATE_MASTER_PASSWORD_PAGE.description);

    await this.expectDisplayed('enterMasterPasswordField');
    await this.expectDisplayed('enterMasterPasswordFieldTitle');
    await this.expectExactText('enterMasterPasswordFieldTitle', CREATE_MASTER_PASSWORD_PAGE.passwordField.title);
    await this.expectDisplayed('enterMasterPasswordFieldInput');
    await this.expectExactText('enterMasterPasswordFieldInput', CREATE_MASTER_PASSWORD_PAGE.passwordField.placeholder);
    await this.expectDisplayed('enterMasterPasswordFieldShowPasswordButton');

    await this.expectDisplayed('repeatMasterPasswordField');
    await this.expectDisplayed('repeatMasterPasswordFieldTitle');
    await this.expectExactText('repeatMasterPasswordFieldTitle', CREATE_MASTER_PASSWORD_PAGE.repeatPasswordField.title);
    await this.expectDisplayed('repeatMasterPasswordFieldInput');
    await this.expectExactText('repeatMasterPasswordFieldInput', CREATE_MASTER_PASSWORD_PAGE.repeatPasswordField.placeholder);
    await this.expectDisplayed('repeatMasterPasswordFieldShowPasswordButton');

    await this.expectDisplayed('termsOfUseText');
    await this.expectExactText('termsOfUseText', CREATE_MASTER_PASSWORD_PAGE.termsOfUse.text);
    await this.expectDisplayed('termsOfUseLink');

    await this.expectDisplayed('continueButton');
    await this.expectDisplayed('continueButtonText');
    await this.expectExactText('continueButtonText', CREATE_MASTER_PASSWORD_PAGE.continueButton);
    await this.expectDisplayed('continueButtonIcon');

    return this.self;
  }

  async verifyEnterMasterPasswordPageWithAllElements(): Promise<this> {
    await this.waitForDisplayed('pearPassLogo', 30000);
    await this.waitForDisplayed('enterMasterPasswordTitle', 30000);
    await this.expectExactText('enterMasterPasswordTitle', 'Please enter your master password to continue');
    await this.waitForDisplayed('enterMasterPasswordField', 30000);
    await this.waitForDisplayed('enterMasterPasswordFieldTitle', 30000);
    await this.expectExactText('enterMasterPasswordFieldTitle', 'Password');
    await this.waitForDisplayed('enterMasterPasswordFieldInput', 30000);
    return this.self;
  }

  async enterMasterPassword(passwordKey: TestPasswordKey = 'valid.standard'): Promise<this> {
    await this.waitForDisplayed('enterMasterPasswordFieldInput', 30000);
    await this.type('enterMasterPasswordFieldInput', getTestPassword(passwordKey));
    return this.self;
  }

  async enterRepeatMasterPassword(passwordKey: TestPasswordKey = 'valid.standard'): Promise<this> {
    await this.waitForDisplayed('repeatMasterPasswordFieldInput', 30000);
    await this.type('repeatMasterPasswordFieldInput', getTestPassword(passwordKey));
    return this.self;
  }

  async tapOnContinueButton(): Promise<this> {
    await this.waitForDisplayed('continueButton', 30000);
    await this.tap('continueButton');
    return this.self;
  }

  async tapOnEnterMasterPasswordField(): Promise<this> {
    await this.waitForDisplayed('enterMasterPasswordField', 20000);
    await this.tap('enterMasterPasswordField');
    return this.self;
  }

  async verifyEnterMasterPasswordFieldHintTextDisplayed(): Promise<this> {
    await this.waitForDisplayed('enterMasterPasswordFieldInfoBox', 20000);
    await this.expectDisplayed('enterMasterPasswordFieldInfoBoxIcon');
    await this.expectDisplayed('enterMasterPasswordFieldInfoBoxText');
    await this.expectExactText(
      'enterMasterPasswordFieldInfoBoxText',
      CREATE_MASTER_PASSWORD_PAGE.passwordField.hintText,
    );
    return this.self;
  }

  async verifyContinueButtonDisabled(): Promise<this> {
    await this.waitForDisplayed('continueButton', 20000);
    await this.expectEnabled('continueButton', false);
    return this.self;
  }

  async verifyContinueButtonEnabled(): Promise<this> {
    await this.waitForDisplayed('continueButton', 20000);
    await this.expectEnabled('continueButton', true);
    return this.self;
  }

  async verifyPasswordsIndicatorsDisplayed(
    field: SignUpPasswordFieldName,
    strength: SignUpPasswordStrength,
  ): Promise<this>;
  async verifyPasswordsIndicatorsDisplayed(
    field: 'repeatMasterPasswordField',
    strength: SignUpPasswordMatchStatus,
  ): Promise<this>;
  async verifyPasswordsIndicatorsDisplayed(
    field: SignUpPasswordFieldName,
    strength: SignUpPasswordIndicatorStatus,
  ): Promise<this> {
    const barLocator = `${field}PasswordIndicator${strength}`;

    await this.waitForDisplayed(barLocator, 20000);
    await this.expectDisplayed(barLocator);
    return this.self;
  }

  async verifyTurnOnAutofillPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('turnOnAutofillTitle', 30000);
    await this.expectExactText('turnOnAutofillTitle', TURN_ON_AUTOFILL_PAGE.title);
    await this.expectDisplayed('turnOnAutofillDescription');
    await this.expectExactText('turnOnAutofillDescription', TURN_ON_AUTOFILL_PAGE.description);
    await this.expectDisplayed('turnOnAutofillMedia');

    await this.expectDisplayed('turnOnAutofillButton');
    await this.expectDisplayed('turnOnAutofillButtonText');
    await this.expectExactText('turnOnAutofillButtonText', TURN_ON_AUTOFILL_PAGE.turnOnAutofillButton);
    await this.expectDisplayed('turnOnAutofillButtonIcon');

    await this.expectDisplayed('notNowButton');
    return this.self;
  }

  async tapOnTurnOnAutofillButton(): Promise<this> {
    await this.waitForDisplayed('turnOnAutofillButton', 20000);
    await this.tap('turnOnAutofillButton');
    return this.self;
  }

  async tapOnPearPassButton(): Promise<this> {
    await this.waitForDisplayed('pearPassButton', 20000);
    await this.tap('pearPassButton');
    return this.self;
  }

  async verifyPreferredServicesPopupDisplayed(): Promise<this> {
    await this.waitForDisplayed('preferredServicesPopup', 20000);
    await this.expectDisplayed('preferredServicesPopup');
    return this.self;
  }

  async tapOnPreferredServicesPopupChangeButton(): Promise<this> {
    await this.waitForDisplayed('preferredServicesPopupChangeButton', 20000);
    await this.tap('preferredServicesPopupChangeButton');
    return this.self;
  }

  async tapOnPreferredServicesBackButton(): Promise<this> {
    await this.waitForDisplayed('preferedServicesBackButton', 20000);
    await this.tap('preferedServicesBackButton');
    return this.self;
  }

  async verifyPreferredServicesPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('preferedServicesTitle', 30000);
    await this.expectDisplayed('preferedServicesTitle');

    await this.expectDisplayed('noneButton');
    await this.expectDisplayed('noneButtonText');
    await this.expectExactText('noneButtonText', PREFERED_SERVICES_PAGE.noneButton);

    await this.expectDisplayed('pearPassButton');
    await this.expectDisplayed('pearPassButtonText');
    await this.expectExactText('pearPassButtonText', PREFERED_SERVICES_PAGE.pearPassButton);
    await this.expectDisplayed('pearPassButtonIcon');

    await this.expectDisplayed('googleButton');
    await this.expectDisplayed('googleButtonTitle');
    await this.expectExactText('googleButtonTitle', PREFERED_SERVICES_PAGE.googleButton.title);
    await this.expectDisplayed('googleButtonDescription');
    await this.expectDisplayed('googleButtonIcon');

    return this.self;
  }

  async verifyEnableBiometricsPageWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('unlockWithBiometricsTitle', 30000);
    await this.expectExactText('unlockWithBiometricsTitle', UNLOCK_WITH_BIOMETRICS_PAGE.title);
    await this.expectDisplayed('unlockWithBiometricsDescription');
    await this.expectExactText(
      'unlockWithBiometricsDescription',
      UNLOCK_WITH_BIOMETRICS_PAGE.description,
    );
    await this.expectDisplayed('unlockWithBiometricsMedia');

    await this.expectDisplayed('enableBiometricsButton');
    await this.expectDisplayed('enableBiometricsButtonText');
    await this.expectExactText(
      'enableBiometricsButtonText',
      UNLOCK_WITH_BIOMETRICS_PAGE.enableBiometricsButton,
    );
    await this.expectDisplayed('enableBiometricsButtonIcon');

    await this.expectDisplayed('notNowButton');
    return this.self;
  }

  async tapOnEnableBiometricsButton(): Promise<this> {
    await this.waitForDisplayed('enableBiometricsButton', 20000);
    await this.tap('enableBiometricsButton');
    return this.self;
  }

  async verifyUnlockWithBiometricsPopUpDisplayed(): Promise<this> {
    await this.waitForDisplayed('fingerPrintPopup', 30000);
    await this.expectDisplayed('fingerPrintPopup');
    return this.self;
  }

  async verifyUnlockWithBiometricsPopUpWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('fingerPrintPopup', 30000);
    await this.expectDisplayed('fingerPrintPopup');
    await this.expectDisplayed('fingerPrintPopupLogo');
    await this.expectDisplayed('fingerPrintPopupTitle');
    await this.expectExactText('fingerPrintPopupTitle', UNLOCK_WITH_BIOMETRICS_POPUP.title);
    await this.expectDisplayed('fingerPrintPopupSensor');
    await this.expectDisplayed('fingerPrintPopupUsePinButton');
    await this.expectExactText(
      'fingerPrintPopupUsePinButton',
      UNLOCK_WITH_BIOMETRICS_POPUP.usePinButton,
    );
    return this.self;
  }
}

export default SignUpPage;
