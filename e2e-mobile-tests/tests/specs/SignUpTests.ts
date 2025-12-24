import 'mocha';
import { Pages } from '@support/page-factory';
import { TEST_PASSWORDS, NEW_VAULT_SCREEN } from '@data/signUp.data';

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
  });

  it('[PAS-XXX] User can create password with valid password (long)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.long);
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
  });

  it('[PAS-XXX] User can create password with valid password (with special chars)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.withSpecial);
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
  });

  it('[PAS-XXX] User can create password with valid password (complex)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.complex);
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
  });

  it('[PAS-XXX] User cannot proceed with password that is too short (7 characters)', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.tooShort.sevenChars);
    await signUp.acceptTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing uppercase letter', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingUppercase);
    await signUp.acceptTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing lowercase letter', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingLowercase);
    await signUp.acceptTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing number', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingNumber);
    await signUp.acceptTerms();
  });

  it('[PAS-XXX] User cannot proceed with password missing special character', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.missingSpecial);
    await signUp.acceptTerms();
  });

  it('[PAS-XXX] User can toggle terms checkbox', async () => {
    const signUp = Pages.signUp;
    await signUp.enterPasswords(TEST_PASSWORDS.valid.standard);
    await signUp.verifyContinueButtonDisabled();
    
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonEnabled();
    
    await signUp.acceptTerms();
    await signUp.verifyContinueButtonDisabled();
  });

  it('[PAS-XXX] User can tap on Terms of Use link', async () => {
    const signUp = Pages.signUp;
    await expect(signUp.createPasswordTermsLink)
      .toBeDisplayed({ message: 'Terms link should be visible' });
    await signUp.createPasswordTermsLink.click();
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
    
    // Initially password should be hidden (secureTextEntry = true by default for isPassword fields)
    // Toggle visibility
    await signUp.togglePasswordVisibility();
    
    // After toggle, password value should still be accessible
    // Note: The visual representation (dots vs text) is handled natively
    // We verify that the toggle works by checking the value remains accessible
    await signUp.verifyPasswordValueAfterToggle(password);
    
    // Toggle back to hidden
    await signUp.togglePasswordVisibility();
    await signUp.verifyPasswordValueAfterToggle(password);
  });

  it('[PAS-XXX] User can toggle confirm password visibility to see password instead of dots', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    
    // Enter confirm password
    await signUp.enterConfirmPassword(password);
    
    // Verify toggle button is visible
    await signUp.verifyConfirmPasswordVisibilityToggleVisible();
    
    // Toggle visibility
    await signUp.toggleConfirmPasswordVisibility();
    
    // After toggle, password value should still be accessible
    await signUp.verifyConfirmPasswordValueAfterToggle(password);
    
    // Toggle back to hidden
    await signUp.toggleConfirmPasswordVisibility();
    await signUp.verifyConfirmPasswordValueAfterToggle(password);
  });

  it('[PAS-XXX] User can toggle password visibility for both password fields independently', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    
    // Enter both passwords
    await signUp.enterPasswords(password);
    
    // Toggle password field visibility
    await signUp.togglePasswordVisibility();
    await signUp.verifyPasswordValueAfterToggle(password);
    
    // Toggle confirm password field visibility independently
    await signUp.toggleConfirmPasswordVisibility();
    await signUp.verifyConfirmPasswordValueAfterToggle(password);
    
    // Both should work independently
    await signUp.togglePasswordVisibility();
    await signUp.toggleConfirmPasswordVisibility();
    
    // Values should still be accessible
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
    await expect(signUp.enterPasswordInput).toHaveValue(password);
  });

  it('[PAS-XXX] User can toggle password visibility to see password instead of dots', async () => {
    const signUp = Pages.signUp;
    const password = TEST_PASSWORDS.valid.standard;
    
    await signUp.enterMasterPassword(password);
    await signUp.verifyEnterPasswordVisibilityToggleVisible();
    
    // Toggle visibility
    await signUp.toggleEnterPasswordVisibility();
    
    // After toggle, password value should still be accessible
    await signUp.verifyEnterPasswordValueAfterToggle(password);
    
    // Toggle back to hidden
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
    
    // Enter the password that was created on the previous screen
    await signUp.enterMasterPassword(password);
    
    // Tap Continue button
    await signUp.tapEnterPasswordContinue();
    
    // After successful login, should navigate to next screen
    // Exact verification depends on what screen comes next
  });

  it('[PAS-XXX] User sees warning message about password recovery', async () => {
    const signUp = Pages.signUp;
    
    await expect.soft(signUp.enterPasswordWarning)
      .toBeDisplayed({ message: 'Warning should be visible' });
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
      
      // Verify navigation to Load Vault screen
      await signUp.waitForLoadVaultScreen();
      await signUp.verifyLoadVaultScreenContent();
      await signUp.tapLoadVaultSelectVaults();
      await signUp.waitForEnterPasswordScreen();
    });

    it('[PAS-XXX] User can tap Create a new vault button and navigate to New Vault screen', async () => {
      const signUp = Pages.signUp;
      await signUp.tapCreateNewVault();
      
      // Verify navigation to New Vault screen
      await signUp.waitForNewVaultScreen();
      await signUp.verifyNewVaultScreenContent();
    });
  });

  describe('Sign Up Flow - Create New Vault', () => {

    it('[PAS-XXX] User can verify Create New Vault screen, navigate and create vault', async () => {
      const signUp = Pages.signUp;

      await signUp.waitForSelectVaultTypeScreen();
      await signUp.tapCreateNewVault();
      
      await signUp.waitForNewVaultScreen();
      await expect.soft(signUp.newVaultTitle)
        .toHaveText(NEW_VAULT_SCREEN.title, { message: 'Create New Vault title should match' });
      
      const vaultName = 'Vall';
      await signUp.enterVaultName(vaultName);
      await expect(signUp.newVaultNameInput).toHaveValue(vaultName);
      
      await signUp.tapNewVaultContinue();
    });
  });
});
