import 'mocha';
import { Pages } from '@support/page-factory';
import { TEST_PASSWORDS, NEW_VAULT_SCREEN } from '@data/signUp.data';

describe('Sign Up Flow - Create Master Password', () => {

  it('[PAS-XXX] User should see Create Master Password screen with all elements', async () => {
    const signUp = Pages.signUp;
    const onboarding = Pages.onboarding;
    await onboarding.waitForLoaded();
    await onboarding.verifyStep(0);
    await onboarding.tapSkip();
    await onboarding.tapContinue();
    await signUp.verifyCreatePasswordScreenContent();
    await signUp.verifyPasswordInputsVisible();
    await signUp.verifyRequirementsVisible();
  });

  it('[PAS-XXX] User should see Continue button disabled when terms are not accepted', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.standard);
    await signUp.verifyContinueButtonDisabled();
  });

  it('[PAS-XXX] User should see Continue button enabled after accepting terms', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.standard);
    await signUp.acceptTerms();
    await signUp.verifyTermsCheckboxChecked();
    await signUp.verifyContinueButtonEnabled();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User can enter password in password input field', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPassword(TEST_PASSWORDS.valid.standard);
    await expect(signUp.createPasswordInput).toHaveValue(TEST_PASSWORDS.valid.standard);
  });

  it('[PAS-XXX] User can enter password in confirm password input field', async () => {
    const signUp = Pages.signUp;
    await signUp.enterConfirmPassword(TEST_PASSWORDS.valid.standard);
    await expect(signUp.createPasswordConfirmInput).toHaveValue(TEST_PASSWORDS.valid.standard);
  });

  it('[PAS-XXX] User can create password with valid password (standard)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.standard);
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User can create password with valid password (long)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.long);
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User can create password with valid password (with special chars)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.withSpecial);
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User can create password with valid password (complex)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.complex);
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User cannot proceed with password that is too short (7 characters)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.tooShort.sevenChars);
    await signUp.verifyValidationError('passwordTooShort');
    await signUp.acceptTerms();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing uppercase letter', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingUppercase);
    await signUp.verifyValidationError('passwordMissingUppercase');
    await signUp.acceptTerms();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing lowercase letter', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingLowercase);
    await signUp.verifyValidationError('passwordMissingLowercase');
    await signUp.acceptTerms();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing number', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingNumber);
    await signUp.verifyValidationError('passwordMissingNumber');
    await signUp.acceptTerms();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing special character', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingSpecial);
    await signUp.verifyValidationError('passwordMissingSpecial');
    await signUp.acceptTerms();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User can toggle terms checkbox', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.standard);
    await signUp.verifyContinueButtonDisabled();
    
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
    
    await signUp.declineTerms();
    await signUp.verifyContinueButtonDisabled();
  });

  it('[PAS-XXX] User can tap on Terms of Use link', async () => {
    const signUp = Pages.signUp;
    await expect.soft(signUp.createPasswordTermsLink);
    await signUp.tapTermsLink();
    await signUp.chromeUrlBarDisplayed();
    await signUp.pressBack();
  });

  it('[PAS-XXX] User sees warning message about password recovery', async () => {
    const signUp = Pages.signUp;
    await expect.soft(signUp.createPasswordWarning)
      .toBeDisplayed({ message: 'Warning should be visible' });
    await signUp.verifyCreatePasswordWarningText();
  });

  it('[PAS-XXX] User sees all password requirements listed', async () => {
    const signUp = Pages.signUp;
    await signUp.verifyRequirementsVisible();
  });


  it('[PAS-XXX] User can toggle password visibility to see password instead of dots', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;

    await signUp.enterPassword(password);
    await signUp.verifyPasswordVisibilityToggleVisible();
    await signUp.togglePasswordVisibility();
    await signUp.verifyPasswordValueAfterToggle(password);
    await signUp.togglePasswordVisibility();
    await signUp.verifyPasswordValueAfterToggle(password);
  });

  it('[PAS-XXX] User can toggle confirm password visibility to see password instead of dots', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    
    await signUp.enterConfirmPassword(password);
    await signUp.verifyConfirmPasswordVisibilityToggleVisible();
    await signUp.toggleConfirmPasswordVisibility();
    await signUp.verifyConfirmPasswordValueAfterToggle(password);
    await signUp.toggleConfirmPasswordVisibility();
    await signUp.verifyConfirmPasswordValueAfterToggle(password);
  });

  it('[PAS-XXX] User can toggle password visibility for both password fields independently', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    
    await signUp.enterPasswords(password);
    await signUp.togglePasswordVisibility();
    await signUp.verifyPasswordValueAfterToggle(password);
    await signUp.toggleConfirmPasswordVisibility();
    await signUp.verifyConfirmPasswordValueAfterToggle(password);
    await signUp.togglePasswordVisibility();
    await signUp.toggleConfirmPasswordVisibility();
    await signUp.verifyPasswordValueAfterToggle(password);
    await signUp.verifyConfirmPasswordValueAfterToggle(password);
  });

  it('[PAS-XXX] User can complete password creation flow with valid password', async () => {
    const signUp = Pages.signUp;

    await signUp.enterPasswords(TEST_PASSWORDS.valid.standard);
    await signUp.acceptTerms();
    await signUp.tapContinue();
  });
});

describe('Sign Up Flow - Enter Master Password', () => {

  it('[PAS-XXX] User should see Enter Master Password screen with all elements', async () => {
    const signUp = Pages.signUp;

    await signUp.verifyEnterPasswordScreenContent();
    await signUp.verifyEnterPasswordInputVisible();
    await signUp.verifyEnterPasswordWarningVisible();
  });

  it('[PAS-XXX] User can enter master password in password input field', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    
    await signUp.enterMasterPassword(password);
    await signUp.toggleEnterPasswordVisibility();
    await expect(signUp.enterPasswordInput).toHaveValue(password);
    await signUp.toggleEnterPasswordVisibility();
  });

  it('[PAS-XXX] User can toggle password visibility to see password instead of dots', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    
    await signUp.enterMasterPassword(password);
    await signUp.verifyEnterPasswordVisibilityToggleVisible();
    await signUp.toggleEnterPasswordVisibility();
    await signUp.verifyEnterPasswordValueAfterToggle(password);
    await signUp.toggleEnterPasswordVisibility();
    await signUp.verifyEnterPasswordValueAfterToggle(password);
  });
  
  it('[PAS-XXX] User sees warning message about password recovery', async () => {
    const signUp = Pages.signUp;
    
    await expect.soft(signUp.enterPasswordWarning)
      .toBeDisplayed({ message: 'Warning should be visible' });
  });

  it('[PAS-XXX] User can login with correct master password', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    
    await signUp.enterMasterPassword(password);
    await signUp.tapEnterPasswordContinue();
  });

  describe('Sign Up Flow - Select Vault Type', () => {

    it('[PAS-XXX] User should see Select Vault Type screen with all elements', async () => {
      const signUp = Pages.signUp;

      await signUp.waitForSelectVaultTypeScreen();
      await signUp.verifySelectVaultTypeScreenContent();
    });

    it('[PAS-XXX] User can tap Load a vault button and navigate to Load Vault screen', async () => {
      const signUp = Pages.signUp;

      await signUp.tapLoadExistingVault();
      await signUp.waitForLoadVaultScreen();
      await signUp.verifyLoadVaultScreenContent();
      await signUp.tapLoadVaultSelectVaults();
      await signUp.waitForSelectVaultTypeScreen();
    });

    it('[PAS-XXX] User can tap Create a new vault button and navigate to New Vault screen', async () => {
      const signUp = Pages.signUp;

      await signUp.tapCreateNewVault();
      await signUp.waitForNewVaultScreen();
      await signUp.verifyNewVaultScreenContent();
    });
  });

  describe('Sign Up Flow - Create New Vault', () => {

    it('[PAS-XXX] User can verify Create New Vault screen, navigate and create vault', async () => {
      const signUp = Pages.signUp;
      const home = Pages.home;

      await signUp.tapNewVaultSelectVaults();
      await signUp.waitForSelectVaultTypeScreen();
      await signUp.tapCreateNewVault();
      await signUp.waitForNewVaultScreen();
      await expect.soft(signUp.newVaultTitle)
        .toHaveText(NEW_VAULT_SCREEN.title, { message: 'Create New Vault title should match' });
      const vaultName = 'Valeron';
      await signUp.enterVaultName(vaultName);
      await expect(signUp.newVaultNameInput).toHaveValue(vaultName);
      await signUp.tapNewVaultContinue();
      await home.verifyHomeLogoLockVisible();
    });
  });
});
