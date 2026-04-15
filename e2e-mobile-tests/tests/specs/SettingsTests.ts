import 'mocha';
import { browser } from '@wdio/globals';
import { Pages } from '@support/page-factory';
import { TEST_PASSWORDS } from '@data/signUp.data';
import {
  restartAndNavigateToSettings,
  restartAndNavigateToSecurityPage,
  restartAndNavigateToSyncingPage,
  restartAndNavigateToVaultPage,
  restartAndNavigateToAboutPage,
} from '@helpers/test-setup';
import { systemPickerNavigateToDownloadsViaSettings } from '@helpers/create-flow-helpers';

// ============================================================
// SETTINGS PAGE - NAVIGATION
// ============================================================
describe('Settings - Main Page Navigation', () => {
  beforeEach(async () => {
    await restartAndNavigateToSettings();
  });

  it('[PAS-3024] User can tap on Settings tab and appear on Settings page', async () => {
    const { settings } = Pages;
    await settings.verifySettingsPageTitle();
  });

  it('[PAS-3025] User should see Settings page with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyAllElements();
  });

  it('[PAS-3026] User can tap on Security button and appear on Security page', async () => {
    const { settings } = Pages;
    await settings.tapSecurityButton();
    await settings.verifySecurityPageDisplayed();
    await settings.tapBackButton();
    await settings.verifySettingsPageTitle();
  });

  it('[PAS-3027] User can tap on Syncing button and appear on Syncing page', async () => {
    const { settings } = Pages;
    await settings.tapSyncingButton();
    await settings.verifySyncingPageDisplayed();
    await settings.tapBackButton();
    await settings.verifySettingsPageTitle();
  });

  it('[PAS-3028] User can tap on Autofill button and appear on Autofill page', async () => {
    const { settings } = Pages;
    await settings.tapAutofillButton();
    await settings.verifyAutofillPageDisplayed();
    await settings.tapBackButton();
    await settings.verifySettingsPageTitle();
  });

  it('[PAS-3029] User can tap on Vault button and appear on Vault page', async () => {
    const { settings } = Pages;
    await settings.tapVaultButton();
    await settings.verifyVaultPageDisplayed();
    await settings.tapBackButton();
    await settings.verifySettingsPageTitle();
  });

  it('[PAS-3030] User can tap on Appearance button and appear on Appearance page', async () => {
    const { settings } = Pages;
    await settings.tapAppearanceButton();
    await settings.verifyAppearancePageDisplayed();
    await settings.tapBackButton();
    await settings.verifySettingsPageTitle();
  });

  it('[PAS-3031] User can tap on About button and appear on About page', async () => {
    const { settings } = Pages;
    await settings.tapAboutButton();
    await settings.verifyAboutPageDisplayed();
    await settings.tapBackButton();
    await settings.verifySettingsPageTitle();
  });
});

// ============================================================
// SECURITY PAGE - ELEMENTS & MASTER PASSWORD POPUP
// ============================================================
describe('Settings - Security Page Elements', () => {
  beforeEach(async () => {
    await restartAndNavigateToSecurityPage();
  });

  it('[PAS-3032] User can verify Security page with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyMasterPasswordSectionWithAllElements();
    await settings.verifyPearPassFunctionsSectionWithAllElements();
  });

  it('[PAS-3033] User can tap on Master Vault edit icon and see Modify master password popup', async () => {
    const { settings } = Pages;
    await settings.tapMasterVaultFieldEditIcon();
    await settings.verifyModifyMasterPasswordPopUp();
    await settings.tapModifyMasterPasswordPopUpCancelButton();
  });
});

// ============================================================
// SECURITY - MASTER PASSWORD VALIDATION
// ============================================================
describe('Settings - Security - Master Password Validation', () => {
  beforeEach(async () => {
    await restartAndNavigateToSecurityPage();
    const { settings } = Pages;
    await settings.tapMasterVaultFieldEditIcon();
    await settings.verifyModifyMasterPasswordPopUp();
  });

  afterEach(async () => {
    const { settings } = Pages;
    try {
      await settings.tapModifyMasterPasswordPopUpCancelButton();
    } catch {
    }
  });

  it('[PAS-3034] User can see warning messages if all fields are empty and tap on continue button', async () => {
    const { settings } = Pages;
    await settings.tapModifyMasterPasswordPopUpSaveButton();
    await settings.verifyOldPasswordInvalidPasswordWarning();
    await settings.verifyCreateNewPasswordIsRequiredWarning();
    await settings.verifyRepeatNewPasswordIsRequiredWarning();
  });

  it('[PAS-442] User can see warning if old password is invalid', async () => {
    const { settings } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.invalid.standard);
    await settings.enterCreateNewPassword(TEST_PASSWORDS.valid.complex);
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.valid.complex);
    await settings.tapModifyMasterPasswordPopUpSaveButton();
    await settings.verifyOldPasswordInvalidPasswordWarning();
  });

  it('[PAS-443] User can see warning if new password is invalid format', async () => {
    const { settings } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.enterCreateNewPassword(TEST_PASSWORDS.invalid.standard);
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.invalid.standard);
    await settings.tapModifyMasterPasswordPopUpSaveButton();
    await settings.verifyCreateNewPasswordWarningAll();
  });

  it('[PAS-3035] User can see warning if new password is same as old password', async () => {
    const { settings } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.enterCreateNewPassword(TEST_PASSWORDS.valid.standard);
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.valid.standard);
    await settings.tapModifyMasterPasswordPopUpSaveButton();
    await settings.verifyNewPasswordDifferentFromOldPasswordWarning();
  });

  it('[PAS-2622] It is impossible to change password when there are less than 8 characters', async () => {
    const { settings, signUp } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.enterCreateNewPassword(TEST_PASSWORDS.tooShort.sevenChars);
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.tooShort.sevenChars);
    await settings.tapModifyMasterPasswordPopUpSaveButton();
    await signUp.verifyValidationError('passwordTooShort');
  });

  it('[PAS-2623] It is impossible to change password when there is no uppercase', async () => {
    const { settings, signUp } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.enterCreateNewPassword(TEST_PASSWORDS.missingUppercase);
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.missingUppercase);
    await settings.tapModifyMasterPasswordPopUpSaveButton();
    await signUp.verifyValidationError('passwordMissingUppercase');
  });

  it('[PAS-2624] It is impossible to change password when there is no lowercase', async () => {
    const { settings, signUp } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.enterCreateNewPassword(TEST_PASSWORDS.missingLowercase);
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.missingLowercase);
    await settings.tapModifyMasterPasswordPopUpSaveButton();
    await signUp.verifyValidationError('passwordMissingLowercase');
  });

  it('[PAS-2625] It is impossible to change password when there is no special character', async () => {
    const { settings, signUp } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.enterCreateNewPassword(TEST_PASSWORDS.missingSpecial);
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.missingSpecial);
    await settings.tapModifyMasterPasswordPopUpSaveButton();
    await signUp.verifyValidationError('passwordMissingSpecial');
  });

  it('[PAS-2626] It is impossible to change password when there is no digit', async () => {
    const { settings, signUp } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.enterCreateNewPassword(TEST_PASSWORDS.missingNumber);
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.missingNumber);
    await settings.tapModifyMasterPasswordPopUpSaveButton();
    await signUp.verifyValidationError('passwordMissingNumber');
  });

  it('[PAS-2627] It is impossible to change password when entering different passwords in each field', async () => {
    const { settings, signUp } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.enterCreateNewPassword(TEST_PASSWORDS.valid.complex);
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.valid.withSpecial);
    await settings.tapModifyMasterPasswordPopUpSaveButton();
    await signUp.verifyValidationError('passwordsDoNotMatch');
  });
});

// ============================================================
// SECURITY - CHANGE PASSWORD FLOW
// ============================================================
describe('Settings - Security - Change Password Flow', () => {
  const OLD_PASSWORD = TEST_PASSWORDS.valid.standard;
  const NEW_PASSWORD = TEST_PASSWORDS.valid.complex;

  before(async () => {
    await restartAndNavigateToSecurityPage(OLD_PASSWORD);
  });

  it('[PAS-441, PAS-2621] User can change password of master vault', async () => {
    const { settings } = Pages;

    await settings.tapMasterVaultFieldEditIcon();
    await settings.verifyModifyMasterPasswordPopUp();

    await settings.enterOldPassword(OLD_PASSWORD);
    await settings.tapOldPasswordToggleVisibility();
    await settings.verifyOldPasswordText(OLD_PASSWORD);
    await settings.tapOldPasswordToggleVisibility();
    await settings.verifyOldPasswordText(TEST_PASSWORDS.valid.masked);

    await settings.enterCreateNewPassword(NEW_PASSWORD);
    await settings.tapCreateNewPasswordToggleVisibility();
    await settings.verifyCreateNewPasswordText(NEW_PASSWORD);
    await settings.tapCreateNewPasswordToggleVisibility();
    await settings.verifyCreateNewPasswordText(TEST_PASSWORDS.valid.maskedComplex);

    await settings.enterRepeatNewPassword(NEW_PASSWORD);
    await settings.tapRepeatNewPasswordToggleVisibility();
    await settings.verifyRepeatNewPasswordText(NEW_PASSWORD);
    await settings.tapRepeatNewPasswordToggleVisibility();
    await settings.verifyRepeatNewPasswordText(TEST_PASSWORDS.valid.maskedComplex);

    await settings.tapModifyMasterPasswordPopUpSaveButton();
    await settings.verifyContinueUsingBiometricsAccessPopupDisplayed();
  });

  it('[PAS-1438] User can see biometrics popup and tap on enable button', async () => {
    const { settings } = Pages;
    
    await settings.verifyContinueUsingBiometricsAccessPopupAllElementsDisplayed();
    await settings.tapContinueUsingBiometricsAccessPopupEnableButton();
    await browser.pause(2000);
    await settings.verifyContinueUsingBiometricsAccessPopupNotDisplayed();
  });

  it('[PAS-1436] User can apply fingerprint authentication', async () => {
    const { settings } = Pages;
    await settings.useBiometricsAuthentication();
    await settings.useBiometricsAuthentication();
  });

  it('[PAS-1098] User logs in the App by entering changed master password', async () => {
    const { settings, home, sidebar, signUp } = Pages;

    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCloseVault();
    await signUp.waitForEnterPasswordScreen();
    await signUp.enterMasterPassword(NEW_PASSWORD);
    await signUp.tapEnterPasswordContinue();
    await signUp.verifySelectVaultsTitle();
    await signUp.tapSelectVaultsVaultItem();
    await home.verifyHomeLogoLockVisible();
    await home.tapBottomNavSettingsTab();
    await settings.verifySettingsPageTitle();
  });

  it('[PAS-1315] User logs in after changing password and trying biometrics', async () => {
    const { home, sidebar, signUp } = Pages;

    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCloseVault();
    await signUp.waitForEnterPasswordScreen();
    await signUp.enterMasterPassword(NEW_PASSWORD);
    await signUp.tapEnterPasswordContinue();
    await signUp.verifySelectVaultsTitle();
    await signUp.tapSelectVaultsVaultItem();
    await home.verifyHomeLogoLockVisible();
  });
});

// ============================================================
// SECURITY - TOGGLES
// ============================================================
describe('Settings - Security - Toggles', () => {
  const CURRENT_PASSWORD = TEST_PASSWORDS.valid.complex;

  beforeEach(async () => {
    await restartAndNavigateToSecurityPage(CURRENT_PASSWORD);
  });

  it('[PAS-410, PAS-411] User can turn on and turn off Reminders toggle', async () => {
    const { settings } = Pages;
    await settings.tapRemindersToggleOn();
    await settings.verifyRemindersToggleOffDisplayed();
    await settings.tapRemindersToggleOff();
    await settings.verifyRemindersToggleOnDisplayed();
  });

  it('[PAS-414, PAS-415] User can turn on and turn off Copy to Clipboard toggle', async () => {
    const { settings } = Pages;
    await settings.tapCopyToClipboardToggleOn();
    await settings.verifyCopyToClipboardToggleOffDisplayed();
    await settings.tapCopyToClipboardToggleOff();
    await settings.verifyCopyToClipboardToggleOnDisplayed();
  });

  it('[PAS-470, PAS-471] User can turn on and turn off Unlock with biometrics toggle', async () => {
    const { settings } = Pages;
    await settings.verifyUnlockWithBiometricsToggleOnDisplayed();
    await settings.tapUnlockWithBiometricsToggleOn();
    await settings.verifyBiometricsAuthenticationToggleOffDisplayed();
  });
});

// ============================================================
// SECURITY - AUTO-LOGOUT
// ============================================================
describe('Settings - Security - Auto-logout', () => {
  const CURRENT_PASSWORD = TEST_PASSWORDS.valid.complex;

  before(async () => {
    await restartAndNavigateToSecurityPage(CURRENT_PASSWORD);
  });

  it('[PAS-3036] Verify that information icon about Auto Logout is displayed', async () => {
    const { settings } = Pages;
    await settings.verifyAutoLogoutInformationIconDisplayed();
  });

  it('[PAS-3037] User can tap on Auto Logout information icon and see popup', async () => {
    const { settings } = Pages;
    await settings.tapAutoLogInInformationIcon();
    await settings.verifyAutoLogoutTimeoutPopupDisplayed();
    await settings.verifyAutoLogoutTimeoutPopupElements();
    await settings.tapRandomlyOnScreen();
  });

  it('[PAS-1444] User can select Auto Logout timeout options', async () => {
    const { settings } = Pages;
    await settings.tapAutoLogoutTimeoutField();
    await settings.verifyAutoLogoutTimeoutFieldDropdownDisplayed();
    await settings.verifyThirtySecondsRadioButtonSelected();
  });

  it('[PAS-1450] User can switch between Auto Logout timeout options', async () => {
    const { settings } = Pages;
    await settings.tapNeverRadioButton();
    await settings.verifyNeverDisplayedInAutoLogoutTimeoutField();
  });

  it('[PAS-1447] Verify all Auto Logout timeout options are displayed', async () => {
    const { settings } = Pages;
    await settings.tapAutoLogoutTimeoutFieldNever();
    await settings.verifyAutoLogoutTimeoutFieldDropdownDisplayed();
    await settings.verifyThirtySecondsRadioButtonUnselected();
    await settings.verifyOneMinuteRadioButtonUnselected();
    await settings.verifyFiveMinutesRadioButtonUnselected();
    await settings.verifyFifteenMinutesRadioButtonUnselected();
    await settings.verifyThirtyMinutesRadioButtonUnselected();
    await settings.verifyOneHourRadioButtonUnselected();
    await settings.verifyFourHoursRadioButtonUnselected();
    await settings.verifyNeverRadioButtonSelected();
  });
});

// ============================================================
// SYNCING PAGE - BLIND PEERS
// ============================================================
describe('Settings - Syncing - Blind Peers', () => {
  const CURRENT_PASSWORD = TEST_PASSWORDS.valid.complex;

  before(async () => {
    await restartAndNavigateToSyncingPage(CURRENT_PASSWORD);
  });

  it('[PAS-3038] User can verify Syncing page with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyBlindPeeringSectionWithAllElements();
  });

  it('[PAS-1466] User can tap on Blind Peering information icon and see popup', async () => {
    const { settings } = Pages;
    await settings.tapBlindPeeringSectionInformationIcon();
    await settings.verifyBlindPeeringSectionInformationPopupDisplayed();
  });

  it('[PAS-1465] User can tap on Learn more button and see learn more page', async () => {
    const { sidebar, settings } = Pages;
    await settings.tapBlindPeeringSectionLearnMoreButton();
    await settings.verifyBlindPeeringSectionLearnMorePageDisplayed();
    await sidebar.pressBack();
    await settings.verifyBlindPeeringSectionInformationPopupDisplayed();
    await settings.tapRandomlyOnScreen();
    await browser.pause(1000);
  });

  it('[PAS-1451] User can tap on Blind Peering toggle and see Choose Blind Peer popup', async () => {
    const { settings } = Pages;
    await settings.tapBlindPeeringSectionToggle();
    await settings.verifyChooseYourBlindPeerPopupDisplayed();
    await settings.verifyChooseYourBlindPeerPopupElements();
    await settings.tapChooseYourBlindPeerPopupCancelButton();
    await settings.verifyChooseYourBlindPeerPopupNotDisplayed();
  });

  it('[PAS-1452] User can switch between Automatic and Manual Blind Peers', async () => {
    const { settings } = Pages;
    await settings.tapBlindPeeringSectionToggle();
    await settings.verifyChooseYourBlindPeerPopupDisplayed();
    await settings.tapManualBlindPeersRadioButton();
    await settings.verifyManualBlindPeersRadioButtonSelected();
    await settings.verifyAutomaticBlindPeersRadioButtonUnselected();
    await settings.tapChooseYourBlindPeerPopupCancelButton();
    await settings.verifyChooseYourBlindPeerPopupNotDisplayed();
  });

  it('[PAS-1455] User can choose Automatic Blind Peers', async () => {
    const { settings } = Pages;
    await settings.tapBlindPeeringSectionToggle();
    await settings.verifyChooseYourBlindPeerPopupDisplayed();
    await settings.verifyAutomaticBlindPeersRadioButtonSelected();
    await settings.tapChooseYourBlindPeerPopupConfirmButton();
    await settings.verifyAutomaticBlindPeersToastDisplayed();
  });

  it('[PAS-3039] User can verify Automatic Blind Peers status is Active', async () => {
    const { settings } = Pages;
    await settings.verifyAllNewElementsInYourBlindPeersSection();
  });

  it('[PAS-3040] User can tap on Edit Blind Peers button and see popup', async () => {
    const { settings } = Pages;
    await settings.tapEditBlindPeersButton();
    await settings.verifyChooseYourBlindPeerPopupDisplayed();
    await settings.tapChooseYourBlindPeerPopupCancelButton();
  });

  it('[PAS-3041] User can choose Manual Blind Peers', async () => {
    const { settings } = Pages;
    await settings.tapEditBlindPeersButton();
    await settings.verifyChooseYourBlindPeerPopupDisplayed();
    await settings.tapManualBlindPeersRadioButton();
    await settings.tapChooseYourBlindPeerPopupConfirmButton();
    await settings.verifyManualBlindPeersPopupDisplayed();
  });

  it('[PAS-3042] Verify that Manual Blind Peers popup has all elements', async () => {
    const { settings } = Pages;
    await settings.verifyManualBlindPeersPopupElements();
  });

  it('[PAS-1456] User can add one more code field for blind peer', async () => {
    const { settings } = Pages;
    await settings.tapAddPeerButton();
    await settings.verifyTwoBlinPeersElementsDisplayed();
  });

  it('[PAS-1454] User can remove one code for blind peer', async () => {
    const { settings } = Pages;
    await settings.tapRemovePeerButton();
    await settings.verifyTwoBlinPeersElementsIsNotDisplayed();
  });

  it('[PAS-3043] User can see error for invalid blind peer code', async () => {
    const { settings } = Pages;
    await settings.enterCodeForBlindPeer(TEST_PASSWORDS.blindPeerCodeInvalid);
    await settings.tapManualBlindPeersPopupConfirmButton();
    await settings.verifyInvalidCodeForBlindPeerWarningMessageDisplayed();
  });

  it('[PAS-1453] User can add valid code for blind peer', async () => {
    const { settings } = Pages;
    await settings.tapBlindPeeringSectionToggle();
    await settings.tapManualBlindPeersRadioButton();
    await settings.tapChooseYourBlindPeerPopupConfirmButton();
    await settings.verifyManualBlindPeersPopupDisplayed();
    await settings.enterCodeForBlindPeer(TEST_PASSWORDS.blindPeerCodeValid);
    await browser.pause(3000);
    await settings.tapManualBlindPeersPopupConfirmButton();
    await settings.verifySuccessToastForManualBlindPeersDisplayed();
  });

  it('[PAS-3044] User can verify Manual Blind Peers status is Active', async () => {
    const { settings } = Pages;
    await settings.verifyAllNewManualBlindPeersElementsInYourBlindPeersSection();
  });
});

// ============================================================
// AUTOFILL PAGE
// ============================================================
describe('Settings - Autofill Page', () => {
  const CURRENT_PASSWORD = TEST_PASSWORDS.valid.complex;

  before(async () => {
    await restartAndNavigateToSettings(CURRENT_PASSWORD);
    const { settings } = Pages;
    await settings.tapAutofillButton();
    await settings.verifyAutofillPageDisplayed();
  });

  it('[PAS-3045] User can verify Autofill page with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyAutofillPageWithAllElements();
  });

  it('[PAS-412] User can set PearPass as default autofill provider', async () => {
    const { settings } = Pages;
    await settings.tapSetAsDefaultButton();
    await settings.verifyPearPassAppRadioButtonDisplayed();
    await settings.tapPearPassAppRadioButton();
    await settings.verifyAutofillPopupTextDisplayed();
    await settings.tapAutofillPopupOkButton();
    await settings.tapBackButtonInChangeAutofillProviderPage();
    await settings.verifyNewElementsInAutofillSection();
  });

  it('[PAS-3046] User can tap on Manage autofill settings link', async () => {
    const { settings } = Pages;
    await settings.tapAutoFillNewLinkManageAutofillSettings();
    await settings.verifyAutofillPageDisplayed();
    await settings.tapAutoFIllServicesBackButton();
  });
});

// ============================================================
// VAULT PAGE - YOUR VAULT & LINKED DEVICES
// ============================================================
describe('Settings - Vault Page', () => {
  const CURRENT_PASSWORD = TEST_PASSWORDS.valid.complex;

  before(async () => {
    await restartAndNavigateToVaultPage(CURRENT_PASSWORD);
  });

  it('[PAS-2389] User can verify Vault page with Your Vault section', async () => {
    const { settings } = Pages;
    await settings.verifyYourVaultSectionWithAllElements();
  });

  it('[PAS-3047] User can tap on Manage Vaults edit icon and see Change Vault Name popup', async () => {
    const { settings } = Pages;
    await settings.tapManageVaultsSectionItemEditIcon();
    await settings.verifyChangeVaultNamePopup();
    await settings.verifyChangeVaultNamePopupButton();
    await settings.tapChangeVaultNamePopUpButton();
    await settings.verifyChangeVaultNamePopupWindow();
    await settings.verifyChangeVaultNamePopupWindowElements();
    await settings.tapChangeVaultNamePopUpWindowCancelButton();
    await settings.verifyChangeVaultNamePopupWindowNotDisplayed();
  });

  it('[PAS-1104] User can change name of vault', async () => {
    const { settings } = Pages;
    const newVaultName = 'Ibrahim';

    await settings.tapManageVaultsSectionItemEditIcon();
    await settings.tapChangeVaultNamePopUpButton();
    await settings.verifyChangeVaultNamePopupWindow();
    await settings.enterChangeVaultName(newVaultName);
    await settings.verifyChangeVaultNamePopupWindowInputField(newVaultName);
    await settings.tapChangeVaultNamePopUpWindowSaveButton();
    await browser.pause(3000);
    await settings.verifyChangeVaultNamePopupWindowNotDisplayed();
  });

  it('[PAS-3048] Check that name of vault is changed everywhere', async () => {
    const { settings, home, sidebar, signUp } = Pages;
    const newVaultName = 'Ibrahim';

    await browser.pause(5000);
    await settings.verifyManageVaultsSectionFirstItemText(newVaultName);
    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.verifyNewVaultNameAtSidebar(newVaultName);
    await sidebar.tapCloseVault();
    await signUp.waitForEnterPasswordScreen();
    await signUp.enterMasterPassword(CURRENT_PASSWORD);
    await signUp.tapEnterPasswordContinue();
    await signUp.verifySelectVaultsTitle();
    await signUp.verifyNewVaultNameAtSelectVaultsPage(newVaultName);
    await signUp.tapSelectVaultsVaultItem();
    await home.verifyHomeLogoLockVisible();
    await home.tapBottomNavSettingsTab();
    await settings.verifySettingsPageTitle();
    await settings.tapVaultButton();
  });

  it('[PAS-1467] User can verify Linked Devices section', async () => {
    const { settings } = Pages;
    await settings.verifyLinkedDevicesSectionWithAllElements();
  });

  it('[PAS-1468] User can tap on Add device button and see popup', async () => {
    const { settings, sidebar } = Pages;
    await settings.tapAddDeviceButton();
    await sidebar.verifyAddDevicePopupFull();
  });

  it('[PAS-1470] Import vault tab is opened when tapping it', async () => {
    const { sidebar } = Pages;
    await sidebar.tapAddDevicePopupImportVaultTab();
    await sidebar.verifyAddDevicePopupImportVaultTab();
  });

  it('[PAS-1469] Share this Vault tab is opened when tapping it', async () => {
    const { sidebar } = Pages;
    await sidebar.tapAddDevicePopupShareVaultTab();
    await sidebar.verifyAddDevicePopupShareVaultTab();
    await sidebar.tapAddDevicePopupBackButton();
  });
});

// ============================================================
// VAULT PAGE - EXPORT
// ============================================================
describe('Settings - Vault - Export', () => {
  const CURRENT_PASSWORD = TEST_PASSWORDS.valid.complex;

  before(async () => {
    await restartAndNavigateToVaultPage(CURRENT_PASSWORD);
  });

  it('[PAS-3049] Verify that json radio button is selected by default', async () => {
    const { settings } = Pages;
    await settings.verifyJSONRadioButtonSelected();
  });

  it('[PAS-3050] User can switch between CSV and JSON file format', async () => {
    const { settings } = Pages;
    await settings.tapCSVRadioButton();
    await settings.verifyCSVRadioButtonSelected();
    await settings.verifyJSONRadioButtonUnselected();
    await settings.tapJSONRadioButton();
    await settings.verifyJSONRadioButtonSelected();
    await settings.verifyCSVRadioButtonUnselected();
  });

  it('[PAS-2394] User can tap Export button and see Export Vaults popup', async () => {
    const { settings } = Pages;
    await settings.tapExportButton();
    await settings.verifyExportVaultsPopupDisplayed();
    await settings.verifyAllExportVaultsPopupElementsShouldBeDisplayed();
    await settings.tapExportVaultsPopupCancelButton();
    await settings.verifyExportVaultsPopupNotDisplayed();
  });

  it('[PAS-3051] Verify Export button in popup is not clickable by default', async () => {
    const { settings } = Pages;
    await settings.tapExportButton();
    await settings.verifyExportVaultsPopupExportButtonNotClickable();
    await settings.tapExportVaultsPopupCancelButton();
    await settings.verifyExportVaultsPopupNotDisplayed();
  });

  it('[PAS-3052] Verify Export button is clickable after entering Master password', async () => {
    const { settings } = Pages;
    await settings.tapExportButton();
    await settings.enterMasterPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyExportVaultsPopupExportButtonClickable();
    await settings.tapExportVaultsPopupCancelButton();
  });

  it('[PAS-1250] User can see warning for invalid Master password', async () => {
    const { settings } = Pages;
    await settings.tapExportButton();
    await settings.enterMasterPassword(TEST_PASSWORDS.invalid.standard);
    await settings.tapExportVaultsPopupFieldShowPasswordIcon();
    await settings.verifyExportVaultsPopupInputField(TEST_PASSWORDS.invalid.standard);
    await settings.tapExportVaultsPopupFieldShowPasswordIcon();
    await settings.verifyExportVaultsPopupExportButtonClickable();
    await settings.tapExportVaultsPopupExportButton();
    await settings.verifyInValidPasswordWarningIconDisplayed();
    await settings.tapExportVaultsPopupCancelButton();
  });

  it('[PAS-458, PAS-1249, PAS-2393] User can export vaults in JSON format', async () => {
    const { settings, sidebar } = Pages;
    await settings.tapExportButton();
    await settings.enterMasterPassword(CURRENT_PASSWORD);
    await settings.tapExportVaultsPopupFieldShowPasswordIcon();
    await settings.verifyExportVaultsPopupInputField(CURRENT_PASSWORD);
    await settings.tapExportVaultsPopupFieldShowPasswordIcon();
    await settings.tapExportVaultsPopupExportButton();
    await settings.verifyVaultsSavedMessageDisplayed();
    await sidebar.pressBack();
    await settings.verifyToastMessageDisplayed();
    await browser.pause(5000);
  });

  it('[PAS-455, PAS-1235] User can export vaults in CSV format', async () => {
    const { settings, signUp } = Pages;
    await settings.tapCSVRadioButton();
    await settings.verifyCSVRadioButtonSelected();
    await settings.verifyJSONRadioButtonUnselected();
    await settings.tapExportButton();
    await settings.enterMasterPassword(CURRENT_PASSWORD);
    await settings.tapExportVaultsPopupFieldShowPasswordIcon();
    await settings.verifyExportVaultsPopupInputField(CURRENT_PASSWORD);
    await settings.tapExportVaultsPopupFieldShowPasswordIcon();
    await settings.tapExportVaultsPopupExportButton();
    await settings.verifyToastMessageNoDataToExportDisplayed();
  });
});

// ============================================================
// VAULT PAGE - IMPORT
// ============================================================
describe('Settings - Vault - Import', () => {
  const CURRENT_PASSWORD = TEST_PASSWORDS.valid.complex;

  before(async () => {
    await restartAndNavigateToVaultPage(CURRENT_PASSWORD);
    const { settings } = Pages;
    await settings.swipeToUp();
    await settings.swipeToUp();
    await settings.swipeToUp();
    await settings.swipeToUp();
  });

  it('[PAS-3053] User can verify Vault page with Import section', async () => {
    const { settings } = Pages;
    await settings.verifyImportSection();
  });

  it('[PAS-3054] Verify OnePassword button with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyOnePasswordButtonWithAllElements();
  });

  it('[PAS-3055] Verify Bitwarden button with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyBitwardenButtonWithAllElements();
  });

  it('[PAS-3056] Verify KeePass button with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyKeePassButtonWithAllElements();
  });

  it('[PAS-3057] Verify KeePassXC button with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyKeePassXCButtonWithAllElements();
  });

  it('[PAS-3058] Verify LastPass button with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyLastPassButtonWithAllElements();
  });

  it('[PAS-3059] Verify NordPass button with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyNordPassButtonWithAllElements();
  });

  it('[PAS-3060] Verify ProtonPass button with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyProtonPassButtonWithAllElements();
  });

  it('[PAS-3061] Verify Encrypted file button with all elements', async () => {
    const { settings } = Pages;
    await settings.swipeToUp();
    await settings.verifyEncryptedFileButtonWithAllElements();
  });

  it('[PAS-3062] Verify Unencrypted file button with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyUnencryptedFileButtonWithAllElements();
  });

  it('[PAS-461] It is possible to import 1Password .csv vault', async () => {
    const { settings, home } = Pages;
    await settings.tapOnePasswordButton();
    await settings.verifyImportVaultPopupWithDropTextDisplayed('onePassword');
    await settings.tapBrowseFolderButton();
    await systemPickerNavigateToDownloadsViaSettings(settings);
    await settings.chooseOnePasswordFile();
    await settings.verifyImportVaultPopupDisplayed('onePassword');
    await settings.tapImportVaultPopupImportButton();
    await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.verifyOnePasswordAccountDisplayed();
    await home.verifyOnePasswordPasswordDisplayed();
    await home.verifyOnePasswordLoginDisplayed();
    await home.tapBottomNavSettingsTab();
  });

  it('[PAS-462] It is possible to import Bitwarden .csv vault', async () => {
    const { settings, home } = Pages;
    await settings.tapBitwardenButton();
    await settings.verifyImportVaultPopupWithDropTextDisplayed('bitwarden');
    await settings.tapBrowseFolderButton();
    await systemPickerNavigateToDownloadsViaSettings(settings);
    await settings.chooseBitwardenCsvFile();
    await settings.verifyImportVaultPopupDisplayed('bitwarden');
    await settings.tapImportVaultPopupImportButton();
    await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.verifyBitwardenCsvNoteDisplayed();
    await home.verifyBitwardenCsvLoginDisplayed();
    await home.tapBottomNavSettingsTab();
  });

  it('[PAS-463] It is possible to import Bitwarden .json vault', async () => {
    const { settings, home } = Pages;

    await settings.tapBitwardenButton();
    await settings.verifyImportVaultPopupWithDropTextDisplayed('bitwarden');
    await settings.tapBrowseFolderButton();
    await systemPickerNavigateToDownloadsViaSettings(settings);
    await settings.chooseBitwardenJsonFile();
    await settings.verifyImportVaultPopupDisplayed('bitwardenJson');
    await settings.tapImportVaultPopupImportButton();
    await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.verifyBitwardenJsonSshDisplayed();
    await home.verifyBitwardenJsonNoteDisplayed();
    await home.verifyBitwardenJsonLoginDisplayed();
    await home.verifyBitwardenJsonCreditDisplayed();
    await home.verifyBitwardenJsonIdentityDisplayed();
    await home.tapBottomNavSettingsTab();
  });

  it('[PAS-464] It is possible to import LastPass .csv vault', async () => {
    const { settings, home } = Pages;

    await settings.tapLastPassButton();
    await settings.verifyImportVaultPopupWithDropTextDisplayed('lastPass');
    await settings.tapBrowseFolderButton();
    await systemPickerNavigateToDownloadsViaSettings(settings);
    await settings.chooseLastPassCsvFile();
    await settings.verifyImportVaultPopupDisplayed('lastPass');
    await settings.tapImportVaultPopupImportButton();
    await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.verifyLastPassCsvNameDisplayed();
    await home.verifyLastPassCsvSecureDisplayed();
    await home.verifyLastPassCsvItemDisplayed();
    await home.tapBottomNavSettingsTab();
  });

  it('[PAS-465] It is possible to import NordPass .csv vault', async () => {
    const { settings, home } = Pages;

    await settings.tapNordPassButton();
    await settings.verifyImportVaultPopupWithDropTextDisplayed('nordPass');
    await settings.tapBrowseFolderButton();
    await systemPickerNavigateToDownloadsViaSettings(settings);
    await settings.chooseNordPassCsvFile();
    await settings.verifyImportVaultPopupDisplayed('nordPass');
    await settings.tapImportVaultPopupImportButton();
    await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.verifyNordPassCsvCreditDisplayed();
    await home.verifyNordPassCsvGmailDisplayed();
    await home.tapBottomNavSettingsTab();
  });

  it('[PAS-466] It is possible to import Proton Pass .csv vault', async () => {
    const { settings, home } = Pages;

    await settings.tapProtonPassButton();
    await settings.verifyImportVaultPopupWithDropTextDisplayed('protonPass');
    await settings.tapBrowseFolderButton();
    await systemPickerNavigateToDownloadsViaSettings(settings);
    await settings.chooseProtonPassCsvFile();
    await settings.verifyImportVaultPopupDisplayed('protonPass');
    await settings.tapImportVaultPopupImportButton();
    await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.verifyProtonPassCsvLoginDisplayed();
    await home.verifyProtonPassCsvNoteDisplayed();
    await home.verifyProtonPassCsvIdentityDisplayed();
    await home.tapBottomNavSettingsTab();
  });

  it('[PAS-3063] It is possible to import Proton Pass .json vault', async () => {
    const { settings, home } = Pages;

    await settings.tapProtonPassButton();
    await settings.verifyImportVaultPopupWithDropTextDisplayed('protonPass');
    await settings.tapBrowseFolderButton();
    await systemPickerNavigateToDownloadsViaSettings(settings);
    await settings.chooseProtonPassJsonFile();
    await settings.verifyImportVaultPopupDisplayed('protonPassJson');
    await settings.tapImportVaultPopupImportButton();
    await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.verifyProtonPassJsonIdentityDisplayed();
    await home.verifyProtonPassJsonNoteDisplayed();
    await home.verifyProtonPassJsonLoginDisplayed();
    await home.tapBottomNavSettingsTab();
  });

  it('[PAS-2414] It is possible to import Unencrypted file .csv vault', async () => {
    const { settings, home } = Pages;

    await settings.tapUnencryptedFileButton();
    await settings.verifyImportVaultPopupWithDropTextDisplayed('unencryptedFile');
    await settings.tapBrowseFolderButton();
    await systemPickerNavigateToDownloadsViaSettings(settings);
    await settings.chooseUnencryptedFileCsvFile();
    await settings.verifyImportVaultPopupDisplayed('unencryptedFile');
    await settings.tapImportVaultPopupImportButton();
    await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.verifyUnencryptedFileCsvHechtDisplayed();
    await home.verifyUnencryptedFileCsvIncDisplayed();
    await home.tapBottomNavSettingsTab();
  });

  it('[PAS-2415] It is possible to import Unencrypted file .json vault', async () => {
    const { settings, home } = Pages;

    await settings.tapUnencryptedFileButton();
    await settings.verifyImportVaultPopupWithDropTextDisplayed('unencryptedFile');
    await settings.tapBrowseFolderButton();
    await systemPickerNavigateToDownloadsViaSettings(settings);
    await settings.chooseUnencryptedFileJsonFile();
    await settings.verifyImportVaultPopupDisplayed('unencryptedFileJson');
    await settings.tapImportVaultPopupImportButton();
    await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
    await home.verifyUnencryptedFileJsonDisplayed();
  });
});

// ============================================================
// APPEARANCE PAGE
// ============================================================
describe('Settings - Appearance Page', () => {
  const CURRENT_PASSWORD = TEST_PASSWORDS.valid.complex;

  beforeEach(async () => {
    await restartAndNavigateToSettings(CURRENT_PASSWORD);
    const { settings } = Pages;
    await settings.tapAppearanceButton();
    await settings.verifyAppearancePageDisplayed();
  });

  it('[PAS-3064] User can verify Appearance page with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyLanguageSectionWithAllElements();
  });

  it('[PAS-407] User can open language dropdown and see language menu', async () => {
    const { settings } = Pages;
    await settings.tapLanguageDropdown();
    await settings.verifyLanguageDropdownMenu();
    await settings.tapLanguageDropdown();
  });
});

// ============================================================
// ABOUT PAGE
// ============================================================
describe('Settings - About Page', () => {
  const CURRENT_PASSWORD = TEST_PASSWORDS.valid.complex;

  beforeEach(async () => {
    await restartAndNavigateToAboutPage(CURRENT_PASSWORD);
  });

  it('[PAS-3065] User can verify About page with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyReportProblemSectionWithAllElements();
  });

  it('[PAS-408] User can send feedback in Report a problem section', async () => {
    const { settings } = Pages;
    const testMessage = 'Testing message';
    await settings.verifyIssueInputFieldPlaceholder();
    await settings.enterIssueText(testMessage);
    await settings.verifyIssueText(testMessage);
    await settings.tapSendButton();
    await settings.tapSendButton();
    await settings.verifyFeedbackSentToast();
  });

  it('[PAS-1435] Nothing happens when tapping Send with empty field', async () => {
    const { settings } = Pages;
    await settings.verifyIssueInputFieldPlaceholder();
    await settings.tapSendButton();
    await settings.verifyAboutPageDisplayed();
  });

  it('[PAS-3066] User can verify Version section with all elements', async () => {
    const { settings } = Pages;
    await settings.verifyPearPassVersionSectionWithAllElements();
  });

  it('[PAS-453] User can tap on Terms of use link and verify page', async () => {
    const { settings } = Pages;
    await settings.tapTermsOfUseLink();
    await settings.acceptCookiesIfPresent();
    await settings.verifyTermsOfUsePage();
    await settings.pressBack();
  });

  it('[PAS-454] User can tap on Privacy statement link and verify page', async () => {
    const { settings } = Pages;
    await settings.tapPrivacyStatementLink();
    await settings.verifyPrivacyStatementPage();
    await settings.pressBack();
  });

  it('[PAS-1432] User can tap on Visit our website link and verify page', async () => {
    const { settings } = Pages;
    await settings.tapVisitOurWebsiteLink();
    await settings.verifyVisitOurWebsitePage();
    await settings.pressBack();
  });
});
