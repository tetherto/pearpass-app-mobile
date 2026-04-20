/**
 * Test Setup Helpers
 * 
 * Provides functions for setting up independent, idempotent tests.
 * 
 * App Flow:
 * - Fresh app / clearApp → Onboarding → Create Master Password
 * - After password created → App restart shows Enter Master Password
 * - After vault created → App restart shows Enter Master Password → Home
 */

import { browser, $ } from '@wdio/globals';
import { TEST_PASSWORDS } from '@data/signUp.data';

const APP_PACKAGE = 'com.pears.pass';
const DEFAULT_PASSWORD = TEST_PASSWORDS.valid.standard;

// ============================================================
// APP STATE MANAGEMENT
// ============================================================

/**
 * Clears app data completely - returns to fresh onboarding state.
 * Use for: OnboardingTests, Create Master Password tests
 */
export async function clearAppData(): Promise<void> {
  try {
    await browser.terminateApp(APP_PACKAGE);
    await browser.execute('mobile: clearApp', { appId: APP_PACKAGE });
    await browser.activateApp(APP_PACKAGE);
    await browser.pause(2000);
  } catch (error: any) {
    console.warn('clearAppData failed, trying alternative approach:', error.message);
    // Fallback: just restart the app
    await restartApp();
  }
}

/**
 * Restarts the app without clearing data.
 * After Create Master Password: shows Enter Master Password screen
 * Before Create Master Password: shows Onboarding
 */
export async function restartApp(): Promise<void> {
  await browser.terminateApp(APP_PACKAGE);
  await browser.pause(500);
  await browser.activateApp(APP_PACKAGE);
  await browser.pause(1500);
}

/**
 * Alias for clearAppData - explicitly named for clarity
 */
export async function resetToOnboarding(): Promise<void> {
  await clearAppData();
}

// ============================================================
// LAZY PAGE IMPORTS (avoid circular dependencies)
// ============================================================

function getPages() {
  // Dynamic import to avoid circular dependencies
  const { Pages } = require('@support/page-factory');
  return Pages;
}

// ============================================================
// NAVIGATION HELPERS
// ============================================================

/**
 * Completes onboarding quickly using Skip button.
 * Precondition: App is on onboarding screen
 */
export async function completeOnboardingQuickly(): Promise<void> {
  const Pages = getPages();
  const onboarding = Pages.onboarding;
  
  await onboarding.waitForLoaded();
  await onboarding.tapSkip();
  await onboarding.tapContinue();
}

/**
 * Navigates to Create Master Password screen from fresh state.
 * Clears app data and completes onboarding.
 */
export async function navigateToCreatePasswordScreen(): Promise<void> {
  await clearAppData();
  await completeOnboardingQuickly();
  
  const Pages = getPages();
  await Pages.signUp.waitForCreatePasswordScreen();
}

/**
 * Creates password and handles biometric popup.
 * Precondition: On Create Master Password screen
 * 
 * @param password - Password to create (default: TEST_PASSWORDS.valid.standard)
 * @param skipBiometrics - Whether to skip biometrics popup (default: true)
 */
export async function createPasswordAndProceed(
  password: string = DEFAULT_PASSWORD,
  skipBiometrics: boolean = true
): Promise<void> {
  const Pages = getPages();
  const signUp = Pages.signUp;
  
  await signUp.enterPasswords(password);
  await signUp.acceptTerms();
  await signUp.tapContinue();
  
  // Handle biometrics popup
  if (skipBiometrics) {
    try {
      await signUp.enableBiometricAuthenticationPopup.waitForDisplayed({ timeout: 5000 });
      await signUp.enableBiometricAuthenticationPopupDismissButton.click();
      await browser.pause(500);
    } catch {
      // Popup didn't appear or already dismissed
    }
  }
}

/**
 * Navigates to Enter Master Password screen.
 * Creates a new account with the specified password.
 * 
 * @param password - Password to use for account creation
 */
export async function navigateToEnterPasswordScreen(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  await navigateToCreatePasswordScreen();
  await createPasswordAndProceed(password);
  
  const Pages = getPages();
  await Pages.signUp.waitForEnterPasswordScreen();
}

/**
 * Sets up account with password (use in `before` hook).
 * After this, restartApp() will show Enter Password screen.
 * 
 * @param password - Password to create
 */
export async function setupAccountWithPassword(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  await navigateToCreatePasswordScreen();
  await createPasswordAndProceed(password);
}

/**
 * Restarts app and waits for Enter Password screen.
 * Use in `beforeEach` after setupAccountWithPassword() was called in `before`.
 */
export async function restartAndWaitForEnterPasswordScreen(): Promise<void> {
  await restartApp();
  const Pages = getPages();
  await Pages.signUp.waitForEnterPasswordScreen();
}

/**
 * Restarts app, enters password, and navigates to New Vault screen.
 * Use in `beforeEach` after setupAccountWithPassword() was called in `before`.
 * Note: This is for when NO vaults exist yet.
 * 
 * Flow: Enter Password → Select Vault Type → tap "Create new vault" → New Vault screen
 * 
 * @param password - Password to enter
 */
export async function restartAndNavigateToNewVaultScreen(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  await restartApp();
  const Pages = getPages();
  const signUp = Pages.signUp;
  
  await signUp.waitForEnterPasswordScreen();
  await signUp.enterMasterPassword(password);
  await signUp.tapEnterPasswordContinue();
  await signUp.waitForSelectVaultTypeScreen();
  await signUp.tapCreateNewVault();
  await signUp.waitForNewVaultScreen();
}

export async function restartAndNavigateToHome(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  await restartApp();
  const Pages = getPages();
  const signUp = Pages.signUp;
  
  await signUp.waitForEnterPasswordScreen();
  await signUp.enterMasterPassword(password);
  await signUp.tapEnterPasswordContinue();
  
  // Verify Select Vaults screen title is displayed
  await signUp.waitForSelectVaultsScreen();
  // Tap on first vault to proceed to Home
  await signUp.tapSelectVaultsVaultItem();
  
  await Pages.home.waitForHomePageLoaded();
}

/**
 * Restarts app, enters password, selects vault by name, and navigates to Home.
 * Use when you need to select a specific vault (e.g., "Kazik" instead of default).
 * 
 * @param vaultName - Name of the vault to select
 * @param password - Password to enter
 */
export async function restartAndNavigateToHomeWithVault(
  vaultName: string,
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  await restartApp();
  const Pages = getPages();
  const signUp = Pages.signUp;
  
  await signUp.waitForEnterPasswordScreen();
  await signUp.enterMasterPassword(password);
  await signUp.tapEnterPasswordContinue();
  
  // Wait for Select Vaults screen and select specific vault
  await signUp.waitForSelectVaultsScreen();
  
  // Click on vault by name
  const vaultElement = await $(`//android.widget.TextView[@text="${vaultName}"]`);
  await vaultElement.waitForDisplayed({ timeout: 5000 });
  await vaultElement.click();
  
  // Wait for Home screen
  await Pages.home.waitForHomePageLoaded();
}

/**
 * Enters master password and proceeds to vault selection.
 * Precondition: On Enter Master Password screen
 * 
 * @param password - Password to enter
 */
export async function enterPasswordAndProceed(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  const Pages = getPages();
  const signUp = Pages.signUp;
  
  await signUp.enterMasterPassword(password);
  await signUp.tapEnterPasswordContinue();
  await signUp.waitForSelectVaultTypeScreen();
}

/**
 * Navigates to Select Vault Type screen.
 * Creates account and enters password.
 * 
 * @param password - Password to use
 */
export async function navigateToVaultSelectionScreen(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  await navigateToEnterPasswordScreen(password);
  await enterPasswordAndProceed(password);
}

/**
 * Creates a vault and navigates to Home screen.
 * 
 * @param password - Password to use
 * @param vaultName - Vault name (auto-generated if not provided)
 */
export async function navigateToHomeScreen(
  password: string = DEFAULT_PASSWORD,
  vaultName?: string
): Promise<void> {
  const uniqueVaultName = vaultName || generateUniqueVaultName();
  
  await navigateToVaultSelectionScreen(password);
  
  const Pages = getPages();
  const signUp = Pages.signUp;
  
  await signUp.tapCreateNewVault();
  await signUp.waitForNewVaultScreen();
  await signUp.enterVaultName(uniqueVaultName);
  await signUp.tapNewVaultContinue();
  
  await Pages.home.verifyHomeLogoLockVisible();
}

// ============================================================
// DATA GENERATION HELPERS
// ============================================================

/**
 * Generates a unique vault name with timestamp and random suffix.
 * Ensures idempotent tests - each run creates a unique vault.
 * 
 * @param prefix - Name prefix (default: 'TestVault')
 */
export function generateUniqueVaultName(prefix: string = 'TestVault'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Generates a unique email for testing.
 * 
 * @param prefix - Email prefix (default: 'test')
 */
export function generateUniqueEmail(prefix: string = 'test'): string {
  const timestamp = Date.now();
  return `${prefix}_${timestamp}@test.com`;
}

// ============================================================
// INPUT HELPERS
// ============================================================

/**
 * Clears password input fields on Create Master Password screen.
 */
export async function clearPasswordFields(): Promise<void> {
  const Pages = getPages();
  const signUp = Pages.signUp;
  
  try {
    await signUp.createPasswordInput.clearValue();
    await signUp.createPasswordConfirmInput.clearValue();
  } catch {
    // Fields might not be accessible
  }
}

/**
 * Clears Enter Master Password input field.
 */
export async function clearEnterPasswordField(): Promise<void> {
  const Pages = getPages();
  const signUp = Pages.signUp;
  
  try {
    await signUp.enterPasswordInput.clearValue();
  } catch {
    // Field might not be accessible
  }
}

// ============================================================
// WAIT HELPERS (replace browser.pause with smart waits)
// ============================================================

/**
 * Waits for element to be displayed with custom timeout.
 * Use instead of browser.pause() when waiting for UI changes.
 * 
 * @param elementGetter - Function that returns the element
 * @param timeout - Max wait time in ms (default: 10000)
 */
export async function waitForElement(
  elementGetter: () => WebdriverIO.Element | Promise<WebdriverIO.Element>,
  timeout: number = 10000
): Promise<void> {
  const element = await elementGetter();
  await element.waitForDisplayed({ timeout });
}

/**
 * Waits for element to disappear.
 * 
 * @param elementGetter - Function that returns the element
 * @param timeout - Max wait time in ms (default: 10000)
 */
export async function waitForElementToDisappear(
  elementGetter: () => WebdriverIO.Element | Promise<WebdriverIO.Element>,
  timeout: number = 10000
): Promise<void> {
  const element = await elementGetter();
  await element.waitForDisplayed({ timeout, reverse: true });
}

// ============================================================
// PASSWORD VERIFICATION HELPERS
// ============================================================

declare const expect: any;

/**
 * Verifies password entry with visibility toggle.
 * Enters password in both fields and verifies it's displayed correctly.
 * 
 * @param password - Password to enter and verify
 */
export async function verifyPasswordWithVisibilityToggle(
  password: string
): Promise<void> {
  const Pages = getPages();
  const signUp = Pages.signUp;
  
  await signUp.enterPasswords(password);
  await signUp.toggleConfirmPasswordVisibility();
  const confirmPasswordText = await signUp.createPasswordConfirmInput.getText();
  expect(confirmPasswordText).toBe(password);
  await signUp.toggleConfirmPasswordVisibility();
}

/**
 * Verifies that a valid password enables the Continue button.
 * Enters password, accepts terms, and verifies button is enabled.
 * 
 * @param password - Valid password to test
 */
export async function verifyValidPasswordEnablesButton(
  password: string
): Promise<void> {
  const Pages = getPages();
  const signUp = Pages.signUp;
  
  await verifyPasswordWithVisibilityToggle(password);
  await signUp.acceptTerms();
  await signUp.verifyContinueButtonEnabled();
}

/**
 * Verifies invalid password shows expected validation error.
 * 
 * @param password - Invalid password to test
 * @param errorType - Type of validation error expected
 * @param warningKey - Key of the warning element getter
 */
export async function verifyInvalidPasswordShowsError(
  password: string,
  errorType: string,
  warningKey: string
): Promise<void> {
  const Pages = getPages();
  const signUp = Pages.signUp;
  
  await verifyPasswordWithVisibilityToggle(password);
  await (signUp as any)[warningKey].waitForDisplayed({ timeout: 10000 });
  await signUp.verifyValidationError(errorType as any);
}

// ============================================================
// TEST DATA HELPERS
// ============================================================

/**
 * Password test cases for data-driven testing.
 */
export const VALID_PASSWORD_TEST_CASES = [
  { name: 'standard', password: TEST_PASSWORDS.valid.standard, caseId: '[3009]' },
  { name: 'long', password: TEST_PASSWORDS.valid.long, caseId: '[3010]' },
  { name: 'with special chars', password: TEST_PASSWORDS.valid.withSpecial, caseId: '[3011]' },
  { name: 'complex', password: TEST_PASSWORDS.valid.complex, caseId: '[1237]' },
] as const;

export const INVALID_PASSWORD_TEST_CASES = [
  { 
    caseId: '[1322]', 
    name: 'too short (7 characters)', 
    password: TEST_PASSWORDS.tooShort.sevenChars,
    errorType: 'passwordTooShort' as const,
    warningKey: 'enterPasswordPasswordMustBeAtLeast8CharactersLongWarning'
  },
  { 
    caseId: '[1323]', 
    name: 'missing uppercase letter', 
    password: TEST_PASSWORDS.missingUppercase,
    errorType: 'passwordMissingUppercase' as const,
    warningKey: 'enterPasswordPasswordMustContainAtLeastOneUppercaseLetterWarning'
  },
  { 
    caseId: '[1324]', 
    name: 'missing lowercase letter', 
    password: TEST_PASSWORDS.missingLowercase,
    errorType: 'passwordMissingLowercase' as const,
    warningKey: 'enterPasswordPasswordMustContainAtLeastOneLowercaseLetterWarning'
  },
  { 
    caseId: '[1326]', 
    name: 'missing number', 
    password: TEST_PASSWORDS.missingNumber,
    errorType: 'passwordMissingNumber' as const,
    warningKey: 'enterPasswordPasswordMustContainAtLeastOneNumberWarning'
  },
  { 
    caseId: '[1325]', 
    name: 'missing special character', 
    password: TEST_PASSWORDS.missingSpecial,
    errorType: 'passwordMissingSpecial' as const,
    warningKey: 'enterPasswordPasswordMustContainAtLeastOneSpecialCharacterWarning'
  },
] as const;

// ============================================================
// FLOW COMPLETION HELPERS
// ============================================================

/**
 * Completes password creation and waits for next screen.
 * Handles both biometric popup and enter password screen cases.
 * 
 * @param password - Password to use (default: standard test password)
 */
export async function completePasswordCreationFlow(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  const Pages = getPages();
  const signUp = Pages.signUp;

  await signUp.enterPasswords(password);
  await signUp.acceptTerms();
  await signUp.tapContinue();
}

/**
 * Waits for either biometric popup or enter password screen to appear.
 * Used after completing password creation flow.
 */
export async function waitForBiometricOrEnterPasswordScreen(): Promise<void> {
  const Pages = getPages();
  const signUp = Pages.signUp;

  await browser.waitUntil(
    async () => {
      const biometricVisible = await signUp.enableBiometricAuthenticationPopup.isDisplayed().catch(() => false);
      const enterPasswordVisible = await signUp.enterPasswordTitle.isDisplayed().catch(() => false);
      return biometricVisible || enterPasswordVisible;
    },
    { timeout: 15000, timeoutMsg: 'Neither biometric popup nor enter password screen appeared' }
  );
}

// ============================================================
// DATA-DRIVEN TEST REGISTRATION
// ============================================================

declare const it: Mocha.TestFunction;

/**
 * Registers data-driven tests for valid passwords.
 * Call this inside a describe() block.
 */
export function registerValidPasswordTests(): void {
  VALID_PASSWORD_TEST_CASES.forEach((testCase) => {
    const caseId = 'caseId' in testCase ? testCase.caseId : '';
    const testTitle = `${caseId ? `${caseId} ` : ''}User can create password with valid password (${testCase.name})`;
    
    it(testTitle, async () => {
      await verifyValidPasswordEnablesButton(testCase.password);
    });
  });
}

/**
 * Registers data-driven tests for invalid passwords.
 * Call this inside a describe() block.
 */
export function registerInvalidPasswordTests(): void {
  INVALID_PASSWORD_TEST_CASES.forEach(({ caseId, name, password, errorType, warningKey }) => {
    const testTitle = `${caseId} User cannot proceed with password ${name}`;
    
    it(testTitle, async () => {
      await verifyInvalidPasswordShowsError(password, errorType, warningKey);
    });
  });
}

// ============================================================
// SETTINGS NAVIGATION HELPERS
// ============================================================

/**
 * Restarts app, logs in, and navigates to Settings page.
 * Use in `beforeEach` for Settings tests.
 * 
 * @param password - Password to enter (default: standard test password)
 */
export async function restartAndNavigateToSettings(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  await restartAndNavigateToHome(password);
  const Pages = getPages();
  await Pages.home.tapBottomNavSettingsTab();
  await Pages.settings.verifySettingsPageTitle();
}

/**
 * Restarts app, logs in, and navigates to Security page in Settings.
 * Use in `beforeEach` for Security tests.
 * 
 * @param password - Password to enter
 */
export async function restartAndNavigateToSecurityPage(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  await restartAndNavigateToSettings(password);
  const Pages = getPages();
  await Pages.settings.tapSecurityButton();
  await Pages.settings.verifySecurityPageDisplayed();
}

/**
 * Restarts app, logs in, and navigates to Syncing page in Settings.
 * 
 * @param password - Password to enter
 */
export async function restartAndNavigateToSyncingPage(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  await restartAndNavigateToSettings(password);
  const Pages = getPages();
  await Pages.settings.tapSyncingButton();
  await Pages.settings.verifySyncingPageDisplayed();
}

/**
 * Restarts app, logs in, and navigates to Vault page in Settings.
 * 
 * @param password - Password to enter
 */
export async function restartAndNavigateToVaultPage(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  await restartAndNavigateToSettings(password);
  const Pages = getPages();
  await Pages.settings.tapVaultButton();
  await Pages.settings.verifyVaultPageDisplayed();
}

/**
 * Restarts app, logs in, and navigates to About page in Settings.
 * 
 * @param password - Password to enter
 */
export async function restartAndNavigateToAboutPage(
  password: string = DEFAULT_PASSWORD
): Promise<void> {
  await restartAndNavigateToSettings(password);
  const Pages = getPages();
  await Pages.settings.tapAboutButton();
  await Pages.settings.verifyAboutPageDisplayed();
}
