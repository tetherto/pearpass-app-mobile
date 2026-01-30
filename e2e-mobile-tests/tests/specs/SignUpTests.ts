import 'mocha';
import { Pages } from '@support/page-factory';
import { TEST_PASSWORDS, NEW_VAULT_SCREEN, ENTER_PASSWORD_SCREEN } from '@data/signUp.data';

declare const expect: any;

describe('Sign Up Flow - Create Master Password', () => {

  it('[PAS-XXX] User should see Create Master Password screen with all elements', async () => {
    const signUp = Pages.signUp;
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
    await signUp.togglePasswordVisibility();
    const passwordText = await signUp.createPasswordInput.getText();
    expect(passwordText).toBe(TEST_PASSWORDS.valid.standard);
    await signUp.toggleConfirmPasswordVisibility();
    const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(TEST_PASSWORDS.valid.standard);
    await signUp.togglePasswordVisibility();
    await signUp.toggleConfirmPasswordVisibility();
  });

  it('[PAS-XXX] User can enter password in confirm password input field', async () => {
    const signUp = Pages.signUp;
    await signUp.enterConfirmPassword(TEST_PASSWORDS.valid.standard);
    await signUp.toggleConfirmPasswordVisibility();
    const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(TEST_PASSWORDS.valid.standard);
    await signUp.toggleConfirmPasswordVisibility();
  });

  it('[PAS-XXX] User can create password with valid password (standard)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.standard);
    await signUp.toggleConfirmPasswordVisibility();
    const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(TEST_PASSWORDS.valid.standard);
    await signUp.toggleConfirmPasswordVisibility()
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User can create password with valid password (long)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.long);
    await signUp.toggleConfirmPasswordVisibility();
    const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(TEST_PASSWORDS.valid.long);
    await signUp.toggleConfirmPasswordVisibility()
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User can create password with valid password (with special chars)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.withSpecial);
    await signUp.toggleConfirmPasswordVisibility();
    const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(TEST_PASSWORDS.valid.withSpecial);
    await signUp.toggleConfirmPasswordVisibility()
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User can create password with valid password (complex)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.complex);
    await signUp.toggleConfirmPasswordVisibility();
    const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(TEST_PASSWORDS.valid.complex);
    await signUp.toggleConfirmPasswordVisibility()
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User cannot proceed with password that is too short (7 characters)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.tooShort.sevenChars);
    await signUp.toggleConfirmPasswordVisibility();
    const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(TEST_PASSWORDS.tooShort.sevenChars);
    await signUp.toggleConfirmPasswordVisibility()
    await signUp.enterPasswordPasswordMustBeAtLeast8CharactersLongWarning.waitForDisplayed({ timeout: 5000 });
    await signUp.verifyValidationError('passwordTooShort');
    await signUp.acceptTerms();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing uppercase letter', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingUppercase);
    await signUp.toggleConfirmPasswordVisibility();
    const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(TEST_PASSWORDS.missingUppercase);
    await signUp.toggleConfirmPasswordVisibility()
    await signUp.enterPasswordPasswordMustContainAtLeastOneUppercaseLetterWarning.waitForDisplayed({ timeout: 5000 });
    await signUp.verifyValidationError('passwordMissingUppercase');
    await signUp.acceptTerms();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing lowercase letter', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingLowercase);
    await signUp.toggleConfirmPasswordVisibility();
    const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(TEST_PASSWORDS.missingLowercase);
    await signUp.toggleConfirmPasswordVisibility()
    await signUp.enterPasswordPasswordMustContainAtLeastOneLowercaseLetterWarning.waitForDisplayed({ timeout: 5000 });
    await signUp.verifyValidationError('passwordMissingLowercase');
    await signUp.acceptTerms();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing number', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingNumber);
    await signUp.toggleConfirmPasswordVisibility();
    const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(TEST_PASSWORDS.missingNumber);
    await signUp.toggleConfirmPasswordVisibility()
    await signUp.enterPasswordPasswordMustContainAtLeastOneNumberWarning.waitForDisplayed({ timeout: 5000 });
    await signUp.verifyValidationError('passwordMissingNumber');
    await signUp.acceptTerms();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing special character', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingSpecial);
    await signUp.toggleConfirmPasswordVisibility();
    const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(TEST_PASSWORDS.missingSpecial);
    await signUp.toggleConfirmPasswordVisibility()
    await signUp.enterPasswordPasswordMustContainAtLeastOneSpecialCharacterWarning.waitForDisplayed({ timeout: 5000 });
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
    const isDisplayed = await signUp.createPasswordTermsLink.isDisplayed();
    if (!isDisplayed) throw new Error('Terms link should be visible');
    await signUp.tapTermsLink();
    await signUp.chromeUrlBarDisplayed();
    await signUp.pressBack();
  });

  it('[PAS-XXX] User sees warning message about password recovery', async () => {
    const signUp = Pages.signUp;
    const isDisplayed = await signUp.createPasswordWarning.isDisplayed();
    if (!isDisplayed) throw new Error('Warning should be visible');
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
  });

  it('[PAS-XXX] User can toggle confirm password visibility to see password instead of dots', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    
    await signUp.enterConfirmPassword(password);
    await signUp.verifyConfirmPasswordVisibilityToggleVisible();
    await signUp.toggleConfirmPasswordVisibility();
    await signUp.verifyConfirmPasswordValueAfterToggle(password);
    await signUp.toggleConfirmPasswordVisibility();
  });

  it('[PAS-XXX] User can toggle password visibility for both password fields independently', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    const masked = TEST_PASSWORDS.valid.masked;
    const maskedConfirm = TEST_PASSWORDS.valid.maskedConfirm;
    
    await signUp.enterPasswords(password);
    await signUp.togglePasswordVisibility();
    await signUp.verifyPasswordValueAfterToggle(password);
    await signUp.togglePasswordVisibility();
    await signUp.verifyPasswordValueAfterToggle(masked);
    await signUp.toggleConfirmPasswordVisibility();
    await signUp.verifyConfirmPasswordValueAfterToggle(password);
    await signUp.toggleConfirmPasswordVisibility();
    await signUp.verifyConfirmPasswordValueAfterToggle(maskedConfirm);
  });

  it('[PAS-XXX] User can not complete password creation flow with different passwords', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    const differentPassword = TEST_PASSWORDS.valid.withSpecial;

    await signUp.enterPassword(password);
    await signUp.togglePasswordVisibility();
    await signUp.enterConfirmPassword(differentPassword);
    await signUp.toggleConfirmPasswordVisibility();
    await signUp.acceptTerms();
    await signUp.tapContinue();
    await signUp.verifyPasswordMismatchWarningVisible();
    await signUp.declineTerms();
  });

  it('[PAS-XXX] User can complete password creation flow with valid password', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;

    await signUp.enterPasswords(password);
    await signUp.acceptTerms();
    await signUp.tapContinue();
  });
});

describe('Sign Up Flow - Enter Master Password', () => {

  it('[PAS-XXX] User should see Enter Master Password screen with all elements', async () => {
    const signUp = Pages.signUp;

    await signUp.verifyEnterPasswordScreenContent();
    await signUp.verifyEnterPasswordInputVisible();
    await signUp.verifyEnterPasswordInputIconVisible();
    await signUp.verifyEnterPasswordWarningIconVisible();
  });

  it('[PAS-XXX] User should see placeholder text in password input field', async () => {
    const signUp = Pages.signUp;

    const placeholderText = await signUp.enterPasswordInput.getText();
    expect(placeholderText).toBe(ENTER_PASSWORD_SCREEN.placeholder);
  });

  it('[PAS-XXX] User can enter master password in password input field', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    
    await signUp.enterMasterPassword(password);
    await signUp.toggleEnterPasswordVisibility();

    const enterPasswordText = await signUp.enterPasswordInput.getText();
    expect(enterPasswordText).toBe(password);
    await signUp.toggleEnterPasswordVisibility();
  });

  it('[PAS-XXX] User can toggle password visibility to see password instead of dots', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    const masked = TEST_PASSWORDS.valid.masked;
    
    await signUp.enterMasterPassword(password);
    await signUp.verifyEnterPasswordVisibilityToggleVisible();
    await signUp.toggleEnterPasswordVisibility();
    await signUp.verifyEnterPasswordValueAfterToggle(password);
    await signUp.toggleEnterPasswordVisibility();
    await signUp.verifyEnterPasswordValueAfterToggle(masked);
  });

  it('[PAS-XXX] User can not complete password creation flow with different passwords', async () => {
    const signUp = Pages.signUp;
    const wrongPassword = TEST_PASSWORDS.valid.complex;
    
    await signUp.enterMasterPassword(wrongPassword);
    await signUp.tapEnterPasswordContinue();
    await signUp.enterPasswordIncorrectPassword4AttemptsWarning.waitForDisplayed({ timeout: 5000 });
    await signUp.verifyValidationError('incorrectPassword4Attempts', 'enterMasterPassword');
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
      const vaultName = 'Valeron';

      await signUp.tapNewVaultSelectVaults();
      await signUp.waitForSelectVaultTypeScreen();
      await signUp.tapCreateNewVault();
      await signUp.waitForNewVaultScreen();
      const newVaultTitleText = await signUp.newVaultTitle.getText();
      expect(newVaultTitleText).toBe(NEW_VAULT_SCREEN.title);
      await signUp.enterVaultName(vaultName);
      const vaultNameText = await signUp.newVaultNameInput.getText();
      expect(vaultNameText).toBe(vaultName);
      await signUp.tapNewVaultContinue();
      await home.verifyHomeLogoLockVisible();
    });
  });
});
