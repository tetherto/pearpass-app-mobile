import 'mocha';
import { Pages } from '@support/page-factory';
import { TEST_PASSWORDS, NEW_VAULT_SCREEN, ENTER_PASSWORD_SCREEN } from '@data/signUp.data';
import {
  navigateToCreatePasswordScreen,
  restartAndWaitForEnterPasswordScreen,
  restartAndNavigateToNewVaultScreen,
  restartAndNavigateToHome,
  registerValidPasswordTests,
  registerInvalidPasswordTests,
  completePasswordCreationFlow
} from '@helpers/test-setup';

declare const expect: any;

// ============================================================
// CREATE MASTER PASSWORD SCREEN
// ============================================================

describe('Sign Up Flow - Create Master Password', () => {
  const getSignUp = () => Pages.signUp;
  
  beforeEach(async () => {
    await navigateToCreatePasswordScreen();
  });

  describe('Screen Elements', () => {
    
    it('[3001] User should see Create Master Password screen with all elements', async () => {
      const signUp = getSignUp();
      await signUp.verifyCreatePasswordScreenContent();
      await signUp.verifyPasswordInputsVisible();
      await signUp.verifyRequirementsVisible();
    });

    it('[3002] User sees warning message about password recovery', async () => {
      const signUp = getSignUp();
      await signUp.createPasswordWarning.waitForDisplayed({ timeout: 10000 });
      await signUp.verifyCreatePasswordWarningText();
    });
  });

  describe('Terms Checkbox', () => {
    
    it('[930] User should see Continue button disabled when terms are not accepted', async () => {
      const signUp = getSignUp();
      await signUp.enterPasswords(TEST_PASSWORDS.valid.standard);
      await signUp.verifyContinueButtonDisabled();
    });

    it('[3003] User should see Continue button enabled after accepting terms', async () => {
      const signUp = getSignUp();
      await signUp.enterPasswords(TEST_PASSWORDS.valid.standard);
      await signUp.acceptTerms();
      await signUp.verifyTermsCheckboxChecked();
      await signUp.verifyContinueButtonEnabled();
    });

    it('[3004] User can toggle terms checkbox on and off', async () => {
      const signUp = getSignUp();
      await signUp.enterPasswords(TEST_PASSWORDS.valid.standard);
      
      await signUp.verifyContinueButtonDisabled();
      await signUp.acceptTerms();
      await signUp.verifyContinueButtonEnabled();
      await signUp.declineTerms();
      await signUp.verifyContinueButtonDisabled();
    });

    it('[933] User can tap on Terms of Use link', async () => {
      const signUp = getSignUp();
      await signUp.createPasswordTermsLink.waitForDisplayed({ timeout: 10000 });
      await signUp.tapTermsLink();
      await signUp.tapUseWithoutAnAccountButton();
      await signUp.tapNoThanksButton();
      await signUp.tapAllowAllButton();
      await signUp.chromeUrlBarDisplayed();
      await signUp.pressBack();
    });
  });

  describe('Password Input', () => {
    
    it('[3005] User can enter password in both input fields', async () => {
      const signUp = getSignUp();
      const password = TEST_PASSWORDS.valid.standard;
      
      await signUp.enterPassword(password);
      await signUp.togglePasswordVisibility();
      const passwordText = await signUp.createPasswordInput.getText();
      expect(passwordText).toBe(password);
      
      await signUp.enterConfirmPassword(password);
      await signUp.toggleConfirmPasswordVisibility();
      const confirmText = await signUp.createPasswordConfirmInput.getText();
      expect(confirmText).toBe(password);
    });
  });

  describe('Password Visibility Toggle', () => {
    
    it('[3006] User can toggle password visibility to see password instead of dots', async () => {
      const signUp = getSignUp();
      const password = TEST_PASSWORDS.valid.standard;

      await signUp.enterPassword(password);
      await signUp.verifyPasswordVisibilityToggleVisible();
      await signUp.togglePasswordVisibility();
      await signUp.verifyPasswordValueAfterToggle(password);
    });

    it('[3007] User can toggle confirm password visibility to see password instead of dots', async () => {
      const signUp = getSignUp();
      const password = TEST_PASSWORDS.valid.standard;
      
      await signUp.enterConfirmPassword(password);
      await signUp.verifyConfirmPasswordVisibilityToggleVisible();
      await signUp.toggleConfirmPasswordVisibility();
      await signUp.verifyConfirmPasswordValueAfterToggle(password);
    });

    it('[3008] User can toggle password visibility for both fields independently', async () => {
      const signUp = getSignUp();
      const { standard: password, masked, maskedConfirm } = TEST_PASSWORDS.valid;
      
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
  });

  describe('Valid Passwords', () => {
    registerValidPasswordTests();
  });

  describe('Invalid Passwords', () => {
    registerInvalidPasswordTests();
  });

  describe('Password Mismatch and Empty Fields', () => {
    
    it('[2239] User cannot complete flow with mismatched passwords', async () => {
      const signUp = getSignUp();

      await signUp.enterPassword(TEST_PASSWORDS.valid.standard);
      await signUp.enterConfirmPassword(TEST_PASSWORDS.valid.withSpecial);
      await signUp.acceptTerms();
      await signUp.tapContinue();
      await signUp.verifyPasswordMismatchWarningVisible();
    });

    it('[2240] User cannot complete flow with both password fields empty', async () => {
      const signUp = getSignUp();

      await signUp.acceptTerms();
      await signUp.tapContinue();
      await signUp.verifyValidationError('passwordRequired', 'enterPassword');
      await signUp.verifyValidationError('passwordRequired', 'enterConfirmPassword');
    });

    it('[2241] User cannot complete flow with empty Enter password field', async () => {
      const signUp = getSignUp();
      
      await signUp.enterConfirmPassword(TEST_PASSWORDS.valid.standard);
      await signUp.acceptTerms();
      await signUp.tapContinue();
      await signUp.verifyValidationError('passwordRequired', 'enterPassword');
    });

    it('[2242] User cannot complete flow with empty Confirm password field', async () => {
      const signUp = getSignUp();
      
      await signUp.enterPassword(TEST_PASSWORDS.valid.standard);
      await signUp.acceptTerms();
      await signUp.tapContinue();
      await signUp.verifyValidationError('passwordRequired', 'enterConfirmPassword');
    });
  });

  describe('Complete Flow', () => {
    
    it('[2244, 204, 928, 929, 935] User can complete password creation flow', async () => {
      await completePasswordCreationFlow(TEST_PASSWORDS.valid.standard);
    });

    it('[209] User can enable biometrics authentication', async () => {
      const signUp = getSignUp();

      await signUp.enterPasswords(TEST_PASSWORDS.valid.standard);
      await signUp.acceptTerms();
      await signUp.tapContinue();

      await signUp.verifyEnableBiometricAuthenticationPopupDisplayed();
      await signUp.verifyEnableBiometricAuthenticationPopupAllElementsDisplayed();
      await signUp.tapEnableBiometricAuthenticationPopupEnableButton();
      
      await signUp.useBiometricsAuthentication();
      await signUp.useBiometricsAuthentication();
      await Pages.signUp.waitForEnterPasswordScreen();
    });
  });
});

// ============================================================
// ENTER MASTER PASSWORD SCREEN
// ============================================================

describe('Sign Up Flow - Enter Master Password', () => {
  const testPassword = TEST_PASSWORDS.valid.standard;
  const getSignUp = () => Pages.signUp;

  beforeEach(async () => {
    await restartAndWaitForEnterPasswordScreen();
  });

  describe('Screen Elements', () => {
    
    it('[3012] User should see Enter Master Password screen with all elements', async () => {
      const signUp = getSignUp();
      await signUp.verifyEnterPasswordScreenContent();
      await signUp.verifyEnterPasswordInputVisible();
      await signUp.verifyEnterPasswordInputIconVisible();
      await signUp.verifyEnterPasswordWarningIconVisible();
    });

    it('[3013] User should see placeholder text in password input field', async () => {
      const signUp = getSignUp();
      const placeholderText = await signUp.enterPasswordInput.getText();
      expect(placeholderText).toBe(ENTER_PASSWORD_SCREEN.placeholder);
    });
  });

  describe('Password Entry', () => {
    
    it('[3014] User can enter master password in input field', async () => {
      const signUp = getSignUp();
      
      await signUp.enterMasterPassword(testPassword);
      await signUp.toggleEnterPasswordVisibility();
      const enterPasswordText = await signUp.enterPasswordInput.getText();
      expect(enterPasswordText).toBe(testPassword);
    });

    it('[3015] User can toggle password visibility to see password', async () => {
      const signUp = getSignUp();
      
      await signUp.enterMasterPassword(testPassword);
      await signUp.verifyEnterPasswordVisibilityToggleVisible();
      
      await signUp.toggleEnterPasswordVisibility();
      await signUp.verifyEnterPasswordValueAfterToggle(testPassword);
      
      await signUp.toggleEnterPasswordVisibility();
      await signUp.verifyEnterPasswordValueAfterToggle(TEST_PASSWORDS.valid.masked);
    });
  });

  describe('Password Validation', () => {
    
    it('[1256] User cannot proceed with incorrect password', async () => {
      const signUp = getSignUp();
      
      await signUp.enterMasterPassword(TEST_PASSWORDS.valid.complex);
      await signUp.tapEnterPasswordContinue();
      await signUp.verifyValidationError('incorrectPassword4Attempts', 'enterMasterPassword');
    });

    it('[206, 207, 932] User can login with correct master password', async () => {
      const signUp = getSignUp();
      
      await signUp.enterMasterPassword(testPassword);
      await signUp.tapEnterPasswordContinue();
      await signUp.waitForSelectVaultTypeScreen();
    });
  });
});

// ============================================================
// CREATE NEW VAULT SCREEN
// ============================================================

describe('Sign Up Flow - Create New Vault', () => {
  const testPassword = TEST_PASSWORDS.valid.standard;
  const getSignUp = () => Pages.signUp;

  beforeEach(async () => {
    await restartAndNavigateToNewVaultScreen(testPassword);
  });

  it('[215] User should see New Vault screen with all elements', async () => {
    const signUp = getSignUp();
    await signUp.verifyNewVaultScreenContent();
  });

  it('[3016] User can navigate back from New Vault to Select Vaults', async () => {
    const signUp = getSignUp();
    
    await signUp.tapNewVaultSelectVaults();
    await signUp.waitForSelectVaultTypeScreen();
  });

  it('[219] User can create a new vault and navigate to Home', async () => {
    const signUp = getSignUp();
    const vaultName = 'Valeron';
    
    const titleText = await signUp.newVaultTitle.getText();
    expect(titleText).toBe(NEW_VAULT_SCREEN.title);
    
    await signUp.enterVaultName(vaultName);
    const inputText = await signUp.newVaultNameInput.getText();
    expect(inputText).toBe(vaultName);
    
    await signUp.tapNewVaultContinue();
    await Pages.home.verifyHomeLogoLockVisible();
  });
});
