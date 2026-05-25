import 'mocha';
import { Pages } from '@support/page-factory';


describe('Sign In Flow - Create Master Password page', () => {

    it('[] User can verify Create Master Password Page with all elements displayed', async () => {
      const { signUp } = Pages;

      await signUp.verifyCreateMasterPasswordPageWithAllElements();
    });

    it('[] Verify that continue button is disabled by default', async () => {
      const { signUp } = Pages;

      await signUp.verifyContinueButtonDisabled();
    });

    it('[] Verify that hint text is displayed when user tap on enter master password field', async () => {
      const { signUp } = Pages;

      await signUp.tapOnEnterMasterPasswordField();
      await signUp.verifyEnterMasterPasswordFieldHintTextDisplayed();
    });

    it('[] Verify that Decent password indicator is displayed when user enters too short password', async () => {
      const { signUp } = Pages;

      await signUp.enterMasterPassword('tooShort.sevenChars');
      await signUp.verifyPasswordsIndicatorsDisplayed('enterMasterPasswordField', 'Decent');
      await signUp.enterRepeatMasterPassword('tooShort.sevenChars');
      await signUp.verifyPasswordsIndicatorsDisplayed('repeatMasterPasswordField', 'Match');
      await signUp.verifyContinueButtonDisabled();
    });

    it('[] Verify that Continue button is enabled when user enters valid password', async () => {
      const { signUp } = Pages;

      await signUp.enterMasterPassword('valid.standard');
      await signUp.verifyPasswordsIndicatorsDisplayed('enterMasterPasswordField', 'Strong');
      await signUp.enterRepeatMasterPassword('valid.standard');
      await signUp.verifyPasswordsIndicatorsDisplayed('repeatMasterPasswordField', 'Match');
      await signUp.verifyContinueButtonEnabled();
    });

    it('[] Verify that User can create master password, continue to turn on autofill page', async () => {
      const { signUp, home } = Pages;

      await signUp.enterMasterPassword('valid.standard');
      await signUp.verifyPasswordsIndicatorsDisplayed('enterMasterPasswordField', 'Strong');
      await signUp.enterRepeatMasterPassword('valid.standard');
      await signUp.verifyPasswordsIndicatorsDisplayed('repeatMasterPasswordField', 'Match');
      await signUp.tapOnContinueButton();
      await signUp.verifyTurnOnAutofillPageDisplayed();
      await signUp.tapOnTurnOnAutofillButton();
      await signUp.verifyPreferredServicesPageDisplayed();
      await signUp.tapOnPearPassButton();
      await signUp.verifyPreferredServicesPopupDisplayed();
      await signUp.tapOnPreferredServicesPopupChangeButton();
      await signUp.verifyPreferredServicesPageDisplayed();
      await signUp.tapOnPreferredServicesBackButton();
      await signUp.verifyEnableBiometricsPageWithAllElementsDisplayed();
      await signUp.tapOnEnableBiometricsButton();
      await signUp.verifyUnlockWithBiometricsPopUpWithAllElementsDisplayed();
      await signUp.useBiometricsAuthentication();
      await signUp.verifyUnlockWithBiometricsPopUpDisplayed();
      await signUp.useBiometricsAuthentication();
      await home.noItemSavedTitleDisplayed();
    });
});
