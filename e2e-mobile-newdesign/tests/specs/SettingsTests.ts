import 'mocha';
import { Pages } from '@support/page-factory';
import { TEST_PASSWORDS } from '@data/signUp.data';
import { restartAndNavigateToSettingsPage, restartAndNavigateToAppPreferencesPage, restartAndNavigateToMasterPasswordPage, restartAndNavigateToBlindPeeringPage, restartAndNavigateToYourDevicesPage, restartAndNavigateToAppVersionPage, restartAndNavigateToReportAProblemPage, 
  restartAndNavigateToLanguagePage, restartAndNavigateToYourVaultsPage, restartAndNavigateToImportItemsPage, restartAndNavigateToExportItemsPage} from '@helpers/test-setup';


describe('Settings - Main Page Navigation', () => {
  beforeEach(async () => {
    await restartAndNavigateToSettingsPage();
  });

  it('[] User should see Settings page with all elements', async () => {
    const { settings } = Pages;

    await settings.verifySettingsPageWithAllElements();
  });

  it('User can show and hide sections', async () => {
    const { settings } = Pages;

    await settings.showHideSections('hide', 'securitySection');
    await settings.verifySettingsPageSecuritySubSectionsNotDisplayed();
    await settings.showHideSections('hide', 'syncingSection');
    await settings.verifySettingsPageSyncingSubSectionsNotDisplayed();
    await settings.showHideSections('hide', 'vaultSection');
    await settings.verifySettingsPageVaultSubSectionsNotDisplayed();
    await settings.showHideSections('hide', 'appearanceSection');
    await settings.verifySettingsPageAppearanceSubSectionsNotDisplayed();
    await settings.showHideSections('hide', 'aboutSection');
    await settings.verifySettingsPageAboutSubSectionsNotDisplayed();
  });
});

describe('Security - App Preferences Page', () => {
  beforeEach(async () => {
    await restartAndNavigateToAppPreferencesPage();
  });

  it('[] User can tap on "App Preferences" button and appear on App Preferences page', async () => {
    const { settings } = Pages;

    await settings.verifyAppPreferencesPageDisplayed();
  });

  it('[] User can verify App Preferences page with all elements', async () => {
    const { settings } = Pages;

    await settings.verifyAppPreferencesPageDisplayed();
    await settings.verifyAutofillAndBrowsingSectionWithAllElements();
    await settings.verifyUnlockMethodSectionWithAllElements();
    await settings.verifySecurityAwarenessSectionWithAllElements();
  });
  
  it('[] User can tap on Clear Clipboard field and verify Clear Clipboard popup with all elements and close it', async () => {
    const { settings } = Pages;

    await settings.tapOnClearClipboardField();
    await settings.verifyClearClipboardPopupWithAllElements();
    await settings.tapOnPopupCloseButton();
    await settings.verifyClearClipboardPopupNotDisplayed();
  });

  it('[] User can tap on Clear Clipboard field and change timeout to 1 hour', async () => {
    const { settings } = Pages;
    
    await settings.tapOnClearClipboardField();
    await settings.verifyClearClipboardPopupWithAllElements();
    await settings.tapOnOneHourButton();
    await settings.verifyClearClipboardPopupNotDisplayed();
    await settings.verifyClearClipboardPopupTimeoutFieldOneHourDisplayed();
  });

  it('[] User can tap on Auto Lock field and verify Auto Lock popup with all elements and close it', async () => {
    const { settings } = Pages;

    await settings.tapOnClearAutoLockField();
    await settings.verifyAutoLockPopupWithAllElements();
    await settings.tapOnPopupCloseButton();
    await settings.verifyAutoLockPopupNotDisplayed();
  });

  it('[] User can tap on Auto Lock field and change timeout to "Never"', async () => {
    const { settings } = Pages;
    
    await settings.tapOnClearAutoLockField();
    await settings.verifyAutoLockPopupWithAllElements();
    await settings.tapOnNeverButton();
    await settings.verifyAutoLockPopupNotDisplayed();
    await settings.verifyAutoLockFieldNeverDisplayed();
  });

  it('[] User can tap on "Back" button and appear on Settings page', async () => {
    const { settings } = Pages;

    await settings.tapBackButton();
    await settings.verifySettingsPageWithAllElements();
  });  
});

describe('Settings - Security - Master Password Page', () => {
  beforeEach(async () => {
    await restartAndNavigateToMasterPasswordPage();
  });

  it('[] User can tap on "Master Password" button and appear on Master Password page', async () => {
    const { settings } = Pages;

    await settings.verifyMasterPasswordPageWithAllElementsDisplayed();
  });

  it('[] Verify that change password button is disabled by default', async () => {
    const { settings } = Pages;

    await settings.verifyChangePasswordButtonDisabled();
  });

  it('[] Autofill hint is displayed if user taps on current password input field', async () => {
    const { settings } = Pages;

    await settings.tapOnCurrentPasswordInputField();
    await settings.verifyAutofillHintDisplayed();
  });

  it('[] It is impossible to change password when there are less than 8 characters', async () => {
    const { settings } = Pages;

    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('currentPasswordField', 'Strong');
    await settings.enterCreateNewPassword(TEST_PASSWORDS.tooShort.sevenChars);
    await settings.verifyPasswordsIndicatorsDisplayed('newPasswordField', 'Decent');
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.tooShort.sevenChars);
    await settings.verifyPasswordsIndicatorsDisplayed('repeatNewPasswordField', 'Match');
    await settings.tapOnChangePasswordButton();
    await settings.verifyPasswordWarningTextDisplayed('passwordTooShort');
  });

  it('[] It is impossible to change password when there is no uppercase', async () => {
    const { settings } = Pages;

    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('currentPasswordField', 'Strong');
    await settings.enterCreateNewPassword(TEST_PASSWORDS.missingUppercase);
    await settings.verifyPasswordsIndicatorsDisplayed('newPasswordField', 'Decent');
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.missingUppercase);
    await settings.verifyPasswordsIndicatorsDisplayed('repeatNewPasswordField', 'Match');
    await settings.tapOnChangePasswordButton();
    await settings.verifyPasswordWarningTextDisplayed('passwordMissingUppercase');
  });

  it('[] It is impossible to change password when there is no lowercase', async () => {
    const { settings } = Pages;
    
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('currentPasswordField', 'Strong');
    await settings.enterCreateNewPassword(TEST_PASSWORDS.missingLowercase);
    await settings.verifyPasswordsIndicatorsDisplayed('newPasswordField', 'Decent');
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.missingLowercase);
    await settings.verifyPasswordsIndicatorsDisplayed('repeatNewPasswordField', 'Match');
    await settings.tapOnChangePasswordButton();
    await settings.verifyPasswordWarningTextDisplayed('passwordMissingLowercase');
  });

  it('[] It is impossible to change password when there is no special character', async () => {
    const { settings } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('currentPasswordField', 'Strong');
    await settings.enterCreateNewPassword(TEST_PASSWORDS.missingSpecial);
    await settings.verifyPasswordsIndicatorsDisplayed('newPasswordField', 'Decent');
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.missingSpecial);
    await settings.verifyPasswordsIndicatorsDisplayed('repeatNewPasswordField', 'Match');
    await settings.tapOnChangePasswordButton();
    await settings.verifyPasswordWarningTextDisplayed('passwordMissingSpecial');
  });

  it('[] It is impossible to change password when there is no digit', async () => {
    const { settings } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('currentPasswordField', 'Strong');
    await settings.enterCreateNewPassword(TEST_PASSWORDS.missingNumber);
    await settings.verifyPasswordsIndicatorsDisplayed('newPasswordField', 'Decent');
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.missingNumber);
    await settings.verifyPasswordsIndicatorsDisplayed('repeatNewPasswordField', 'Match');
    await settings.tapOnChangePasswordButton();
    await settings.verifyPasswordWarningTextDisplayed('passwordMissingNumber');
  });

  it('[] It is impossible to change password when entering different passwords in each field', async () => {
    const { settings } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('currentPasswordField', 'Strong');
    await settings.enterCreateNewPassword(TEST_PASSWORDS.valid.complex);
    await settings.verifyPasswordsIndicatorsDisplayed('newPasswordField', 'Strong');
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.valid.withSpecial);
    await settings.verifyPasswordsIndicatorsDisplayed('repeatNewPasswordField', 'Vulnerable');
  });

  it('[] User can see warning if current password is invalid', async () => {
    const { settings } = Pages;

    await settings.enterOldPassword(TEST_PASSWORDS.invalid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('currentPasswordField', 'Vulnerable');
    await settings.enterCreateNewPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('newPasswordField', 'Strong');
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('repeatNewPasswordField', 'Match');
    await settings.tapOnChangePasswordButton();
    await settings.verifyPasswordWarningTextDisplayed('invalidPassword');
  });

  it('[] User can see warning if new password is same as old password', async () => {
    const { settings } = Pages;

    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('currentPasswordField', 'Strong');
    await settings.enterCreateNewPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('newPasswordField', 'Strong');
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('repeatNewPasswordField', 'Match');
    await settings.tapOnChangePasswordButton();
    await settings.verifyPasswordWarningTextDisplayed('newPasswordSameAsOldPassword');
  });

  it('[] User can change password with valid password', async () => {
    const { settings } = Pages;
    await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
    await settings.verifyPasswordsIndicatorsDisplayed('currentPasswordField', 'Strong');
    await settings.enterCreateNewPassword(TEST_PASSWORDS.valid.complex);
    await settings.verifyPasswordsIndicatorsDisplayed('newPasswordField', 'Strong');
    await settings.enterRepeatNewPassword(TEST_PASSWORDS.valid.complex);
    await settings.verifyPasswordsIndicatorsDisplayed('repeatNewPasswordField', 'Match');
    await settings.tapOnChangePasswordButton();
    await settings.verifyMasterPasswordChangedSuccessToastMessageDisplayed();
  });
});

describe('Settings - Syncing - Blind Peering Page', () => {
  beforeEach(async () => {
    await restartAndNavigateToBlindPeeringPage();
  });

  it('[] User can tap on "Blind Peering" button and appear on Blind Peering page', async () => {
    const { settings } = Pages;

    await settings.verifyBlindPeeringPageWithAllElementsDisplayed();
  });

  it('[] User can enable blind peering', async () => {
    const { settings } = Pages;

    await settings.tapOnBlindPeeringPageEnableFieldToggleOff();
    await settings.verifyBlindPeeringPageEnableFieldToggleOn();
    await settings.verifyAutomaticBlindPeersFieldDisplayed();
    await settings.verifyManualBlindPeersFieldDisplayed();
    await settings.verifySaveChangesButtonDisplayed();
  });

  it('[] User can disable blind peering', async () => {
    const { settings } = Pages;

    await settings.tapOnBlindPeeringPageEnableFieldToggleOn();
    await settings.verifyBlindPeeringPageEnableFieldToggleOff();
    await settings.verifyAutomaticBlindPeersFieldNotDisplayed();
    await settings.verifyManualBlindPeersFieldNotDisplayed();
  });

  it('[] Verify that automatic blind peers field is chosen by default when blind peering is enabled', async () => {
    const { settings } = Pages;

    await settings.tapOnBlindPeeringPageEnableFieldToggleOff();
    await settings.verifyBlindPeerRadio('automatic', 'Checked');
  });

  it('[] User can choose Automatic Blind Peers', async () => {
    const { settings } = Pages;

    await settings.tapOnAutomaticBlindPeersField();
    await settings.verifyBlindPeerRadio('automatic', 'Checked');
    await settings.verifyBlindPeerRadio('manual', 'Unchecked');
    await settings.tapOnSaveChangesButton();
    await settings.verifySuccessToastMessageDisplayed();
  });

  it('[] User can choose Manual Blind Peers', async () => {
    const { settings } = Pages;

    await settings.tapOnManualBlindPeersField();
    await settings.verifyBlindPeerRadio('automatic', 'Unchecked');
    await settings.verifyBlindPeerRadio('manual', 'Checked');
    await settings.verifyManualBlindPeersEnterPeerCodeFieldDisplayed();
    await settings.verifyManualBlindPeersAddPeerButtonDisplayed();
  });
  
  it('[] User can add one more code field for blind peer', async () => {
    const { settings } = Pages;
    await settings.tapOnManualBlindPeersAddPeerButton();
    await settings.verifyManualBlindPeersEnterPeerCodeFieldDisplayed(1);
    await settings.verifyManualBlindPeersEnterPeerCodeFieldDisplayed(2);
  });

  it('[] Verify that User can add only 5 code fields for blind peer', async () => {
    const { settings } = Pages;
    await settings.tapOnManualBlindPeersAddPeerButton();
    await settings.tapOnManualBlindPeersAddPeerButton();
    await settings.tapOnManualBlindPeersAddPeerButton();
    await settings.verifyManualBlindPeersEnterPeerCodeFieldDisplayed(1);
    await settings.verifyManualBlindPeersEnterPeerCodeFieldDisplayed(2);
    await settings.verifyManualBlindPeersEnterPeerCodeFieldDisplayed(3);
    await settings.verifyManualBlindPeersEnterPeerCodeFieldDisplayed(4);
    await settings.verifyManualBlindPeersEnterPeerCodeFieldDisplayed(5);
    await settings.verifyManualBlindPeersAddPeerButtonNotDisplayed();
  });

  it('[] User can remove code fields for blind peer', async () => {
    const { settings } = Pages;

    await settings.tapOnManualBlindPeersRemovePeerButton(1);
    await settings.tapOnManualBlindPeersRemovePeerButton(1);
    await settings.tapOnManualBlindPeersRemovePeerButton(1);
    await settings.tapOnManualBlindPeersRemovePeerButton(1);
    await settings.verifyManualBlindPeersEnterPeerCodeFieldNotDisplayed(1);
    await settings.verifyManualBlindPeersEnterPeerCodeFieldNotDisplayed(2);
    await settings.verifyManualBlindPeersEnterPeerCodeFieldNotDisplayed(3);
    await settings.verifyManualBlindPeersEnterPeerCodeFieldNotDisplayed(4);
    await settings.verifyManualBlindPeersEnterPeerCodeFieldNotDisplayed(5);
  });

  it('[PAS-3043] User can see error for invalid blind peer code', async () => {
    const { settings } = Pages;

    await settings.enterPeerCodeForBlindPeer(TEST_PASSWORDS.blindPeerCodeInvalid);
    await settings.tapOnSaveChangesButton();
    await settings.verifyErrorToastMessageDisplayed();
  });

  it('[PAS-1453] User can add valid code for blind peer', async () => {
    const { settings } = Pages;

    await settings.clearPeerCodeForBlindPeerField();
    await settings.enterPeerCodeForBlindPeer(TEST_PASSWORDS.blindPeerCodeValid);
    await settings.tapOnSaveChangesButton();
    await settings.verifySuccessToastMessageDisplayed();
  });

  it('[] Verify that user is moved to the Settings page after tapping on Back button from Blind Peering page', async () => {
    const { settings } = Pages;

    await settings.tapBackButton();
    await settings.verifySettingsPageWithAllElements();
  });
});

describe('Settings - Syncing - Your Devices Page', () => {
  beforeEach(async () => {
    await restartAndNavigateToYourDevicesPage();
  });

  it('[] User can tap on "Your Devices" button and appear on Your Devices page', async () => {
    const { settings } = Pages;

    await settings.verifyYourDevicesPageWithAllElements();
  });

  it('[] Verify that user is moved to the Settings page after tapping on Back button from Your Devices page', async () => {
    const { settings } = Pages;

    await settings.tapBackButton();
    await settings.verifySettingsPageWithAllElements();
  });
});

describe('Settings - Vault - Your Vaults Page', () => {
  beforeEach(async () => {
    await restartAndNavigateToYourVaultsPage();
  });

  it('[] User can tap on "Your Vaults" button and appear on Your Vaults page', async () => {
    const { settings } = Pages;

    await settings.verifyYourVaultsPageWithAllElements();
  });

  it('[] User can create new vault', async () => {
    const { settings } = Pages;

    await settings.tapOnCreateNewVaultButton();
    await settings.verifyCreateNewVaultPageWithAllElements();
    await settings.enterVaultName(TEST_PASSWORDS.vaultName);
    await settings.tapOnCreateNewVaultButton();
    await settings.verifyVaultCreatedSuccessToastMessageDisplayed();
  });

  it('[] Varify that new created vault "Kazik" is displayed on Home page when clicking on Vault tab', async () => {
    const { home } = Pages;
    await home.tapOnVaultTab();
    await home.verifyCreatedVaultFieldDisplayed();
  });

  it('[] Verify that new created vault is displayed on Your Vaults page in "Current Vault" section and the old one is displayed in "Other Vaults" section', async () => {
    const { settings } = Pages;

    await settings.tapOnYourVaultsButton();
    await settings.verifyYourVaultsPageTitle();
    await settings.verifyNewCreatedVaultFieldDisplayedInCurrentVaultSection();
    await settings.verifyOldVaultFieldDisplayedInOtherVaultsSection();
  });

  it('[] Verify that Create New Vault button is inactive by default on Create New Vault page', async () => {
    const { settings } = Pages;

    await settings.tapOnCreateNewVaultButton();
    await settings.verifyCreateNewVaultPageWithAllElements();
    await settings.verifyCreateNewVaultButtonDisabled();
    await settings.tapBackButton();
    await settings.verifyYourVaultsPageTitle();
  });

  it('[] User can create new vault with password', async () => {
    const { settings } = Pages;

    await settings.tapOnCreateNewVaultButton();
    await settings.verifyCreateNewVaultPageWithAllElements();
    await settings.enterVaultName(TEST_PASSWORDS.newVaultName);
    await settings.tapOnSetVaultPasswordToggle();
    await settings.verifySetVaultPasswordToggleOn();
    await settings.enterVaultPassword(TEST_PASSWORDS.newVaultPassword);
    await settings.enterVaultPasswordConfirm(TEST_PASSWORDS.newVaultPassword);
    await settings.tapOnCreateNewVaultButton();
    await settings.verifyVaultCreatedSuccessToastMessageDisplayed();
  });

  it('[] Varify that new created vault "Ibrahim" is displayed on Home page when clicking on Vault tab', async () => {
    const { home } = Pages;
    await home.tapOnVaultTab();
    await home.verifyCreatedVaultFieldDisplayed();
  });

  it('[] User can share vault', async () => {
    const { settings } = Pages;

    await settings.tapOnNewCreatedVaultFieldShareVaultButton();
    await settings.verifyShareVaultPageWithAllElements();
    await settings.tapOnShareVaultPageVaultLinkCopyIcon();
    await settings.verifyShareVaultPageVaultLinkCopiedToastMessageDisplayed();
  });

  it('[] Verify that text "Code expires in" is changed to "Code expired" after 2 minutes', async () => {
    const { settings } = Pages;

    await settings.tapOnNewCreatedVaultFieldShareVaultButton();
    await settings.verifyCodeExpireTextDisplayed();
    await settings.waitForTextToChange(125000);
    await settings.verifyCodeExpiredTextDisplayed();
    await settings.tapBackButton();
    await settings.verifyYourVaultsPageTitle();
  });

  it('[] User can not rename vault with wrong password', async () => {
    const { settings } = Pages;

    await settings.tapOnNewCreatedVaultFieldThreeDotsButton();
    await settings.verifyThreeDotsPopupWithAllElements();
    await settings.tapOnThreeDotsRenameButton();
    await settings.verifyRenameVaultPageWithAllElements();
    await settings.enterVaultName(TEST_PASSWORDS.changedVaultName);
    await settings.enterCurrentPassword(TEST_PASSWORDS.wrongVaultPassword);
    await settings.tapOnSaveButton();
    await settings.verifyInvalidPasswordToastMessageDisplayed();
  });

    it('[] User can rename vault with correct password', async () => {
    const { settings } = Pages;

    await settings.tapOnNewCreatedVaultFieldThreeDotsButton();
    await settings.verifyThreeDotsPopupWithAllElements();
    await settings.tapOnThreeDotsRenameButton();
    await settings.verifyRenameVaultPageWithAllElements();
    await settings.enterVaultName(TEST_PASSWORDS.changedVaultName);
    await settings.enterCurrentPassword(TEST_PASSWORDS.newVaultPassword);
    await settings.tapOnSaveButton();
    await settings.verifyVaultRenamedSuccessToastMessageDisplayed();
  });

  it('[] Varify that new created vault "IbrahimNew" is displayed on Your Vaults page', async () => {
    const { settings } = Pages;

    await settings.verifyYourVaultsPageTitle();
    await settings.verifyRenamedVaultFieldDisplayedInCurrentVaultSection();
  });

  it('[] Varify that new created vault "IbrahimNew" is displayed on Home page when clicking on Vault tab', async () => {
    const { home } = Pages;

    await home.tapOnVaultTab();
    await home.verifyCreatedVaultFieldDisplayed();
  });

  it('[] Verify that user is moved to the Settings page after tapping on Back button from Your Vaults page', async () => {
    const { settings } = Pages;

    await settings.tapBackButton();
    await settings.verifySettingsPageWithAllElements();
  });
});

describe('Settings - Vault - Import Items Page', () => {
  beforeEach(async () => {
    await restartAndNavigateToImportItemsPage();
  });

  it('[] User can tap on "Import Items" button and appear on Import Items page', async () => {
    const { settings } = Pages;

    await settings.verifyImportItemsPageWithAllElements();
  });

  it('[] Verify OnePassword button with all elements', async () => {
    const { settings } = Pages;

    await settings.verifyImportSourceButtonWithAllElements('onePassword');
  });

  it('[] Verify Bitwarden button with all elements', async () => {
    const { settings } = Pages;

    await settings.verifyImportSourceButtonWithAllElements('bitwarden');
  });

  it('[] Verify KeePass button with all elements', async () => {
    const { settings } = Pages;

    await settings.verifyImportSourceButtonWithAllElements('keepass');
  });

  it('[] Verify KeePassXC button with all elements', async () => {
    const { settings } = Pages;

    await settings.verifyImportSourceButtonWithAllElements('keepassxc');
  });

  it('[] Verify LastPass button with all elements', async () => {
    const { settings } = Pages;

    await settings.verifyImportSourceButtonWithAllElements('lastpass');
  });

  it('[] Verify NordPass button with all elements', async () => {
    const { settings } = Pages;

    await settings.verifyImportSourceButtonWithAllElements('nordpass');
  });

  it('[] Verify ProtonPass button with all elements', async () => {
    const { settings } = Pages;

    await settings.verifyImportSourceButtonWithAllElements('protonpass');
  });

  it('[] Verify Encrypted file button with all elements', async () => {
    const { settings } = Pages;

    await settings.verifyImportSourceButtonWithAllElements('encryptedFile');
  });

  it('[] Verify Unencrypted file button with all elements', async () => {
    const { settings } = Pages;

    await settings.verifyUnencryptedFileButtonWithAllElements();
  });

  it('[] It is possible to import 1Password .csv vault', async () => {
    const { settings, home } = Pages;

    await settings.tapOnImportSourceButton('onePassword');
    await settings.verifyItemsImportPageWithAllElements('onePassword');
    await settings.tapOnUploadFileButton();
    await settings.chooseDownloadsFolder();
    await settings.chooseImportFile('onePasswordFile');
    await settings.verifyImportedFileFieldDisplayed('onePasswordFile');
    await settings.tapOnImportButton();
    await settings.verifyVaultsImportedSuccessToastMessageDisplayed();
    await home.tapOnVaultTab();
    await home.verifyOnePasswordAccountFieldDisplayed();
    await home.verifyOnePasswordPasswordFieldDisplayed();
    await home.verifyOnePasswordLoginFieldDisplayed();
  });

  it('[] It is possible to import Bitwarden .JSON vault', async () => {
    const { settings, home } = Pages;

    await settings.tapOnImportSourceButton('bitwarden');
    await settings.verifyItemsImportPageWithAllElements('bitwarden');
    await settings.tapOnUploadFileButton();
    await settings.chooseDownloadsFolder();
    await settings.chooseImportFile('bitwardenCsvFile');
    await settings.verifyImportedFileFieldDisplayed('bitwardenJsonFile');
    await settings.tapOnImportButton();
    await settings.verifyVaultsImportedSuccessToastMessageDisplayed();
    await home.tapOnVaultTab();
    await home.verifyBitwardenJsonSshFieldDisplayed();
    await home.verifyBitwardenJsonNotFoundFieldDisplayed();
    await home.verifyBitwardenJsonLoginFieldDisplayed();
    await home.verifyBitwardenJsonIdentityFieldDisplayed();
    await home.verifyBitwardenJsonCreditCardFieldDisplayed();
  });

  it('[] It is possible to import Bitwarden .CSV vault', async () => {
    const { settings, home } = Pages;

    await settings.tapOnImportSourceButton('bitwarden');
    await settings.verifyItemsImportPageWithAllElements('bitwarden');
    await settings.tapOnUploadFileButton();
    await settings.chooseDownloadsFolder();
    await settings.chooseImportFile('bitwardenCsvFile');
    await settings.verifyImportedFileFieldDisplayed('bitwardenCsvFile');
    await settings.tapOnImportButton();
    await settings.verifyVaultsImportedSuccessToastMessageDisplayed();
    await home.tapOnVaultTab();
    await home.verifyBitwardenCsvNoteFieldDisplayed();
    await home.verifyBitwardenCsvLoginFieldDisplayed();
  });

  it('[] It is possible to import LastPass .CSV vault', async () => {
    const { settings, home } = Pages;

    await settings.tapOnImportSourceButton('lastpass');
    await settings.verifyItemsImportPageWithAllElements('lastpass');
    await settings.tapOnUploadFileButton();
    await settings.chooseDownloadsFolder();
    await settings.chooseImportFile('lastPassCsvFile');
    await settings.verifyImportedFileFieldDisplayed('lastPassCsvFile');
    await settings.tapOnImportButton();
    await settings.verifyVaultsImportedSuccessToastMessageDisplayed();
    await home.tapOnVaultTab();
    await home.verifyLastPassCsvNameFieldDisplayed();
    await home.verifyLastPassCsvSecureFieldDisplayed();
    await home.verifyLastPassCsvItemFieldDisplayed();
  });

  it('[] It is possible to import NordPass .CSV vault', async () => {
    const { settings, home } = Pages;

    await settings.tapOnImportSourceButton('nordpass');
    await settings.verifyItemsImportPageWithAllElements('nordpass');
    await settings.tapOnUploadFileButton();
    await settings.chooseDownloadsFolder();
    await settings.chooseImportFile('nordPassCsvFile');
    await settings.verifyImportedFileFieldDisplayed('nordPassCsvFile');
    await settings.tapOnImportButton();
    await settings.verifyVaultsImportedSuccessToastMessageDisplayed();
    await home.tapOnVaultTab();
    await home.verifyNordPassCsvGmailFieldDisplayed();
    await home.verifyNordPassCsvCreditFieldDisplayed();
  });

  it('[] It is possible to import Proton Pass .CSV vault', async () => {
    const { settings, home } = Pages;

    await settings.tapOnImportSourceButton('protonpass');
    await settings.verifyItemsImportPageWithAllElements('protonpass');
    await settings.tapOnUploadFileButton();
    await settings.chooseDownloadsFolder();
    await settings.chooseImportFile('protonPassCsvFile');
    await settings.verifyImportedFileFieldDisplayed('protonPassCsvFile');
    await settings.tapOnImportButton();
    await settings.verifyVaultsImportedSuccessToastMessageDisplayed();
    await home.tapOnVaultTab();
    await home.verifyProtonPassCsvLoginFieldDisplayed();
    await home.verifyProtonPassCsvNoteFieldDisplayed();
    await home.verifyProtonPassCsvIdentityFieldDisplayed();
  });

  it('[] It is possible to import Proton Pass .JSON vault', async () => {
    const { settings, home } = Pages;

    await settings.tapOnImportSourceButton('protonpass');
    await settings.verifyItemsImportPageWithAllElements('protonpass');
    await settings.tapOnUploadFileButton();
    await settings.chooseDownloadsFolder();
    await settings.chooseImportFile('protonPassJsonFile');
    await settings.verifyImportedFileFieldDisplayed('protonPassJsonFile');
    await settings.tapOnImportButton();
    await settings.verifyVaultsImportedSuccessToastMessageDisplayed();
    await home.tapOnVaultTab();
    await home.verifyProtonPassJsonLoginFieldDisplayed();
    await home.verifyProtonPassJsonNoteFieldDisplayed();
    await home.verifyProtonPassJsonIdentityFieldDisplayed();
  });

  it('[] It is possible to import Unencrypted file .JSON vault', async () => {
    const { settings, home } = Pages;

    await settings.tapOnImportSourceButton('unencryptedFile');
    await settings.verifyItemsImportPageWithAllElements('unencryptedFile');
    await settings.tapOnUploadFileButton();
    await settings.chooseDownloadsFolder();
    await settings.chooseImportFile('unencryptedFileJsonFile');
    await settings.verifyImportedFileFieldDisplayed('unencryptedFileJsonFile');
    await settings.tapOnImportButton();
    await settings.verifyVaultsImportedSuccessToastMessageDisplayed();
    await home.tapOnVaultTab();
    await home.verifyEncryptedFileJsonHgfgFileDisplayed();
  });

  it('[] It is possible to import Unencrypted file .CSV vault', async () => {
    const { settings, home } = Pages;

    await settings.tapOnImportSourceButton('unencryptedFile');
    await settings.verifyItemsImportPageWithAllElements('unencryptedFile');
    await settings.tapOnUploadFileButton();
    await settings.chooseDownloadsFolder();
    await settings.chooseImportFile('unencryptedFileCsvFile');
    await settings.verifyImportedFileFieldDisplayed('unencryptedFileCsvFile');
    await settings.tapOnImportButton();
    await settings.verifyVaultsImportedSuccessToastMessageDisplayed();
    await home.tapOnVaultTab();
    await home.verifyEncryptedFileCsvIncFileDisplayed();
    await home.verifyEncryptedFileCsvHechtFileDisplayed();
  });
});

describe('Settings - Vault - Export Items Page', () => {
  beforeEach(async () => {
    await restartAndNavigateToExportItemsPage();
  });

  it('[] User can tap on "Export Items" button and appear on Export Items page', async () => {
    const { settings } = Pages;

    await settings.verifyVaultExportItemsPageWithAllElementsDisplayed();
  });

  it('[] User can switch between "JSON (Recommended)" and "CSV" radio buttons', async () => {
    const { settings } = Pages;

    await settings.tapOnCSVRadioButton();
    await settings.verifyJSONRadioButtonNotSelected();
    await settings.tapOnJSONRadioButton();
    await settings.verifyCSVRadioButtonNotSelected();
  });

  it('[] User can export vaults in JSON format without password protection', async () => {
    const { settings } = Pages;

    await settings.tapOnJSONField();
    await settings.tapOnExportButton();
    await settings.verifyFingerPrintPopupDisplayed();
    await settings.tapOnFingerPrintPopupCancelButton();
    await settings.verifyVerificationRequiredPopupDisplayedWithAllElements();
    await settings.verifyContinueButtonDisabledByDefault();
    await settings.enterMasterPassword(TEST_PASSWORDS.newVaultPassword);
    await settings.verifyContinueButtonEnabled();
    await settings.tapOnContinueButton();
    await settings.verifySharePopupWithAllElementsDisplayed();
    await settings.tapRandomlyOnScreen();
    await settings.verifyExportSuccessToastMessageDisplayedWithAllElements();
  });

  it('[] User can export vaults in JSON format with password protection', async () => {
    const { settings } = Pages;

    await settings.tapOnJSONField();
    await settings.tapOnProtectWithPasswordField();
    await settings.verifyPasswordFieldDisplayed();
    await settings.verifyRepeatPasswordFieldDisplayed();
    await settings.verifyExportButtonDisabledByDefault();
    await settings.enterPassword(TEST_PASSWORDS.newVaultPassword);
    await settings.enterRepeatPassword(TEST_PASSWORDS.newVaultPassword);
    await settings.tapOnExportButton();
    await settings.verifyFingerPrintPopupDisplayed();
    await settings.useBiometricsAuthentication();
    await settings.verifySharePopupWithAllElementsDisplayed();
    await settings.tapRandomlyOnScreen();
    await settings.verifyExportSuccessToastMessageDisplayedWithAllElements();
  });

  it('[] User can export vaults in CSV format', async () => {
    const { settings } = Pages;

    await settings.tapOnCSVField();
    await settings.tapOnExportButton();
    await settings.verifyFingerPrintPopupDisplayed();
    await settings.useBiometricsAuthentication();
    await settings.verifySharePopupWithAllElementsDisplayed();
    await settings.tapRandomlyOnScreen();
    await settings.verifyExportSuccessToastMessageDisplayedWithAllElements();
  });
});

describe('Settings - Appearance - Language Page', () => {
  beforeEach(async () => {
    await restartAndNavigateToLanguagePage();
  });

  it('[] User can tap on "Language" button and appear on Language page', async () => {
    const { settings } = Pages;

    await settings.verifyLanguagePageWithAllElements();
  });

  it('[] User can change language', async () => {
    const { settings } = Pages;

    await settings.tapOnLanguageButtonOnLanguagePage();
    await settings.verifyLanguagePopupWithAllElements();
    await settings.tapOnLanguagePopupLanguageButton();
    await settings.verifyLanguagePopupNotDisplayed();
  });

  it('[] User can close language popup by tapping on Cross button', async () => {
    const { settings } = Pages;

    await settings.tapOnLanguageButtonOnLanguagePage();
    await settings.verifyLanguagePopupWithAllElements();
    await settings.tapOnPopupCloseButton();
    await settings.verifyLanguagePopupNotDisplayed();
  });

  it('[] Verify that user is moved to the Settings page after tapping on Back button from Language page', async () => {
    const { settings } = Pages;

    await settings.tapBackButton();
    await settings.verifySettingsPageWithAllElements();
  });
});

describe('Settings - About - Report a Problem Page', () => {
  beforeEach(async () => {
    await restartAndNavigateToReportAProblemPage();
  });

  it('[] User can tap on "Report a Problem" button and appear on Report a Problem page', async () => {
    const { settings } = Pages;

    await settings.verifyReportAProblemPageWithAllElementsDisplayed();
  });

  it('[] Verify that send button is disabled by default', async () => {
    const { settings } = Pages;

    await settings.verifyReportAProblemPageSendButtonDisabled();
  });

  it('[] User can enter issue and tap on Send button', async () => {
    const { settings } = Pages;

    await settings.enterIssue(TEST_PASSWORDS.issueText);
    await settings.verifyReportAProblemPageSendButtonEnabled();
    await settings.tapOnReportAProblemPageSendButton();
    await settings.verifyReportAPorblemSuccessFeedbackToastMessageDisplayed();
  });

  it('[] Verify that user is moved to the Settings page after tapping on Back button from Report a Problem page', async () => {
    const { settings } = Pages;

    await settings.tapBackButton();
    await settings.verifySettingsPageWithAllElements();
  });
});

describe('Settings - About - App Version Page', () => {
  beforeEach(async () => {
    await restartAndNavigateToAppVersionPage();
  });

  it('[] User can tap on "App Version" button and appear on App Version page', async () => {
    const { settings } = Pages;

    await settings.verifyAppVersionPageWithAllElementsDisplayed();
  });

  it('[] User can tap on "Terms of Use" button and appear on Terms of Use page', async () => {
    const { settings } = Pages;

    
    await settings.tapOnTermsOfUseButton();
    await settings.verifyTermsOfUsePageDisplayed();
  });

  it('[] User can tap on "Privacy Statement" button and appear on Privacy Statement page', async () => {
    const { settings } = Pages;

    await settings.tapOnPrivacyStatementButton();
    await settings.verifyPrivacyStatementPageDisplayed();
    await settings.pressBack();
    await settings.verifyAppVersionPageWithAllElementsDisplayed();
  });

  it('[] User can tap on "Visit our website" button and appear on Visit our website page', async () => {
    const { settings } = Pages;

    await settings.tapOnVisitOurWebsiteButton();
    await settings.verifyVisitOurWebsitePageDisplayed();
    await settings.pressBack();
    await settings.verifyAppVersionPageWithAllElementsDisplayed();
  });

  it('[] Verify that user is moved to the Settings page after tapping on Back button from App Version page', async () => {
    const { settings } = Pages;
    
    await settings.tapBackButton();
    await settings.verifySettingsPageWithAllElements();
    await settings.pressBack();
    await settings.verifyAppVersionPageWithAllElementsDisplayed();
  });
});
