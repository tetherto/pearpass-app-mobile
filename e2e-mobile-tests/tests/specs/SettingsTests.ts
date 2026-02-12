import 'mocha';
import { Pages } from '@support/page-factory';
import { TEST_PASSWORDS } from '@data/signUp.data';
import { browser } from '@wdio/globals';


  describe('Settings Flow - General Tab', () => {

    it('[PAS-XXX] User can open Settings page and appear on General tab', async () => {
      const { settings, signUp, home } = Pages;
      
      await signUp.waitForEnterPasswordScreen();
      await signUp.enterMasterPassword(TEST_PASSWORDS.valid.standard);
      await signUp.tapEnterPasswordContinue();
      await signUp.verifySelectVaultsTitle();
      await signUp.tapSelectVaultsVaultItem();
      await home.verifyHomeLogoLockVisible();
      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();
    });

    it('[PAS-XXX] User should see Language section with all elements', async () => {
      const { settings } = Pages;
      
      await settings.verifyLanguageSection();
    });

    it('[PAS-XXX] User should see Passwords section with all elements', async () => {
      const { settings } = Pages;
      
      await settings.verifyPasswordsSection();
    });

    it('[PAS-XXX] User should see Report a problem section with all elements', async () => {
      const { settings } = Pages;

      await settings.verifyReportProblemSection();
    });

    it('[PAS-XXX] User should see Version section with all elements', async () => {
      const { settings } = Pages;

      await settings.verifyVersionSection();
    });

    it('[PAS-XXX] User can see terms of use link and privacy statement link', async () => {
      const { settings } = Pages;

      await settings.swipeToUp();
      await settings.verifyTermsOfUseLink();
      await settings.verifyPrivacyStatementLink();
      await settings.swipeToDown();
    });

    it('[PAS-407] User can open language dropdown and see language menu', async () => {
      const { settings } = Pages;

      await settings.tapLanguageDropdown();
      await settings.verifyLanguageDropdownMenu();
      await settings.tapLanguageDropdown();
    });

    it('[PAS-XXX] User can tap on Master Vault edit icon and see Modify master password popup', async () => {
      const { settings } = Pages;

      await settings.tapMasterVaultFieldEditIcon();
      await settings.verifyModifyMasterPasswordPopUp();
      await settings.tapModifyMasterPasswordPopUpCancelButton();
    });

    it('[PAS-XXX] User can see warning messages in modify master password popup if all fields are empty and tap on continue button', async () => {
      const { settings } = Pages;

      await settings.tapMasterVaultFieldEditIcon();
      await settings.tapModifyMasterPasswordPopUpContinueButton();    
      await settings.verifyOldPasswordInvalidPasswordWarning();
      await settings.verifyCreateNewPasswordIsRequiredWarning();
      await settings.verifyRepeatNewPasswordIsRequiredWarning();
      await settings.tapModifyMasterPasswordPopUpCancelButton();
    });

    it('[PAS-442] User can see warning messages in modify master password popup if old password is invalid and tap on continue button', async () => {
      const { settings } = Pages;

      await settings.tapMasterVaultFieldEditIcon();
      await settings.enterOldPassword(TEST_PASSWORDS.invalid.standard);
      await settings.enterCreateNewPassword(TEST_PASSWORDS.valid.complex);
      await settings.enterRepeatNewPassword(TEST_PASSWORDS.valid.complex);
      await settings.tapModifyMasterPasswordPopUpContinueButton();
      await settings.verifyOldPasswordInvalidPasswordWarning();
      await settings.tapModifyMasterPasswordPopUpCancelButton();
    });

    it('[PAS-443] User can see warning messages in modify master password popup if create new password is invalid and tap on continue button', async () => {
      const { settings } = Pages;

      await settings.tapMasterVaultFieldEditIcon();
      await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
      await settings.enterCreateNewPassword(TEST_PASSWORDS.invalid.standard);
      await settings.enterRepeatNewPassword(TEST_PASSWORDS.invalid.standard);
      await settings.tapModifyMasterPasswordPopUpContinueButton();
      await settings.verifyCreateNewPasswordWarningAll();
      await settings.tapModifyMasterPasswordPopUpCancelButton();
    });

    it('[PAS-XXX] User can see warning messages in modify master password popup if new password is different from old password and tap on continue button', async () => {
      const { settings } = Pages;

      await settings.tapMasterVaultFieldEditIcon();
      await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
      await settings.enterCreateNewPassword(TEST_PASSWORDS.valid.standard);
      await settings.enterRepeatNewPassword(TEST_PASSWORDS.valid.standard);
      await settings.tapModifyMasterPasswordPopUpContinueButton();
      await settings.verifyNewPasswordDifferentFromOldPasswordWarning();
      await settings.tapModifyMasterPasswordPopUpCancelButton();
    });

    it('[PAS-441] User can change password of master vault', async () => {
      const { settings } = Pages;

      await settings.tapMasterVaultFieldEditIcon();
      await settings.verifyModifyMasterPasswordPopUp();
      // Old Password Field
      await settings.enterOldPassword(TEST_PASSWORDS.valid.standard);
      await settings.tapOldPasswordToggleVisibility();
      await settings.verifyOldPasswordText(TEST_PASSWORDS.valid.standard);
      await settings.tapOldPasswordToggleVisibility();
      await settings.verifyOldPasswordText(TEST_PASSWORDS.valid.masked);
      // Create New Password Field
      await settings.enterCreateNewPassword(TEST_PASSWORDS.valid.complex);
      await settings.tapCreateNewPasswordToggleVisibility();
      await settings.verifyCreateNewPasswordText(TEST_PASSWORDS.valid.complex);
      await settings.tapCreateNewPasswordToggleVisibility();
      await settings.verifyCreateNewPasswordText(TEST_PASSWORDS.valid.maskedComplex);
      // Repeat New Password Field
      await settings.enterRepeatNewPassword(TEST_PASSWORDS.valid.complex);
      await settings.tapRepeatNewPasswordToggleVisibility();
      await settings.verifyRepeatNewPasswordText(TEST_PASSWORDS.valid.complex);
      await settings.tapRepeatNewPasswordToggleVisibility();
      await settings.verifyRepeatNewPasswordText(TEST_PASSWORDS.valid.maskedComplex);
      // Continue Button
      await settings.tapModifyMasterPasswordPopUpContinueButton();
      await browser.pause(10000);
      await settings.verifyModifyMasterPasswordPopUpNotDisplayed();
    });
    
    it('[PAS-408] User can send feedback in Report a problem section', async () => {
      const { settings } = Pages;
      const testMessage = 'Testing message';
      // Verify placeholder text
      await settings.verifyIssueInputFieldPlaceholder();
      // Enter text and verify it's displayed
      await settings.enterIssueText(testMessage);
      await settings.verifyIssueText(testMessage);
      // Send feedback
      await settings.tapSendButton();
      await settings.tapSendButton();
      // Verify toast appears
      await settings.verifyFeedbackSentToast();
    });
  });
  
  describe('Settings Flow - Vaults Tab', () => {

    it('[PAS-XXX] User can tap on Vaults Tab and appear on Vaults page', async () => {
      const { settings } = Pages;

      await settings.tapVaultsTab();
      await settings.verifyVaultsPage();
    });

    it('[PAS-XXX] User can verify Manage Vaults section with all elements', async () => {
      const { settings } = Pages;

      await settings.verifyManageVaultsSections();
    });

    it('[PAS-XXX] User can tap on Manage Vaults section item and see Change Vault Name popup', async () => {
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

    it('[PAS-XXX] User can change name of vault', async () => {
      const { settings } = Pages;
      const newVaultName = 'Ibrahim';

      await settings.tapManageVaultsSectionItemEditIcon();
      await settings.tapChangeVaultNamePopUpButton();
      await settings.verifyChangeVaultNamePopupWindow();
      await settings.enterChangeVaultName(newVaultName);
      await settings.verifyChangeVaultNamePopupWindowInputField(newVaultName);
      await settings.tapChangeVaultNamePopUpWindowContinueButton();
      await browser.pause(3000);
      await settings.verifyChangeVaultNamePopupWindowNotDisplayed();
    });

    it('[PAS-XXX] Check that name of vault is changed', async () => {
      const { settings, home, sidebar, signUp } = Pages;
      const newVaultName = 'Ibrahim';

      await settings.verifyManageVaultsSectionFirstItemText(newVaultName);
      await settings.tapExportTab();
      await settings.verifyNewVaultNameAtExportSection(newVaultName);
      await home.tapBottomNavHomeTab();
      await home.waitForHomePageLoaded();
      await home.tapHomeLogoLock();
      await sidebar.waitForLoaded();
      await sidebar.verifyNewVaultNameAtSidebar(newVaultName);
      await sidebar.tapCloseVault();
      await signUp.waitForEnterPasswordScreen();
      await signUp.enterMasterPassword(TEST_PASSWORDS.valid.complex);
      await signUp.tapEnterPasswordContinue();
      await signUp.verifySelectVaultsTitle();
      await signUp.verifyNewVaultNameAtSelectVaultsPage(newVaultName);
      await signUp.tapSelectVaultsVaultItem();
      await home.verifyHomeLogoLockVisible();
      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();
      await settings.tapVaultsTab();
    });
  });

  describe('Settings Flow - Export Tab', () => {

    it('[PAS-XXX] User can tap on Export Tab and appear on Export page', async () => {
      const { settings } = Pages;

      await settings.tapExportTab();
      await settings.verifyExportPage();
    });

    it('[PAS-XXX] Verify that Export page has all needed elements', async () => {
      const { settings } = Pages;

      await settings.verifyAllElementsInExportPage();
    });

    it('[PAS-XXX] Verify that json radio button is selected by default', async () => {
      const { settings } = Pages;

      await settings.verifyJSONRadioButtonSelected();
    });

    it('[PAS-XXX] User can switch between CSV and JSON file format', async () => {
      const { settings } = Pages;

      await settings.tapCSVRadioButton();
      await settings.verifyCSVRadioButtonSelected();
      await settings.verifyJSONRadioButtonUnselected();
      await settings.tapJSONRadioButton();
      await settings.verifyJSONRadioButtonSelected();
      await settings.verifyCSVRadioButtonUnselected();
    });

    it('[PAS-XXX] Verify that Export button is not clickable by default', async () => {
      const { settings } = Pages;

      await settings.verifyExportButtonNotClickable();
    });

    it('[PAS-XXX] Verify that Export button is clickable after User choose at least one vault', async () => {
      const { settings } = Pages;

      await settings.tapVaults1();
      await settings.vaults1ChooseIconAppear();
      await settings.verifyExportButtonClickable();
    }); 

    it('[PAS-XXX] Verify that user can tap on Export button and see Export Vaults popup and verify all elements', async () => {
      const { settings } = Pages;

      await settings.tapExportButton();
      await settings.verifyExportVaultsPopupDisplayed();
      await settings.verifyAllExportVaultsPopupElementsShouldBeDisplayed();
      await settings.tapExportVaultsPopupCancelButton();
      await settings.verifyExportVaultsPopupNotDisplayed();
    });

    it('[PAS-XXX] Verify that Export button in popup window is not clickable by default', async () => {
      const { settings } = Pages;

      await settings.tapExportButton();
      await settings.verifyExportVaultsPopupExportButtonNotClickable();
    });

    it('[PAS-XXX] Verify that Export button in popup window is clickable after User enter Master password', async () => {
      const { settings } = Pages;

      await settings.tapExportButton();
      await settings.enterMasterPassword(TEST_PASSWORDS.valid.standard);
      await settings.verifyExportVaultsPopupExportButtonClickable();
      await settings.tapExportVaultsPopupCancelButton();
    });

    it('[PAS-XXX] Verify that user can see warning message if Master password is invalid', async () => {
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

    it('[PAS-458] User can export vaults in JSON format', async () => {
      const { settings, sidebar } = Pages;

      await settings.tapExportButton();
      await settings.enterMasterPassword(TEST_PASSWORDS.valid.complex);
      await settings.tapExportVaultsPopupFieldShowPasswordIcon();
      await settings.verifyExportVaultsPopupInputField(TEST_PASSWORDS.valid.complex);
      await settings.tapExportVaultsPopupFieldShowPasswordIcon();
      await settings.tapExportVaultsPopupExportButton();
      await settings.verifyVaultsSavedMessageDisplayed();
      await sidebar.pressBack();
      await settings.verifyToastMessageDisplayed();
    });

    it('[PAS-455] User can export vaults in CSV format', async () => {
      const { settings, sidebar } = Pages;

      await settings.tapVaults1();
      await settings.vaults1ChooseIconAppear();
      await settings.tapExportButton();
      await settings.enterMasterPassword(TEST_PASSWORDS.valid.complex);
      await settings.tapExportVaultsPopupExportButton();
      await settings.verifyVaultsSavedMessageDisplayed();
      await sidebar.pressBack();
      await settings.verifyToastMessageDisplayed();
    });
  });

  describe('Settings Flow - Advanced Tab', () => {

    it('[PAS-XXX] User can tap on Advanced Tab and appear on Advanced page', async () => {
      const { settings } = Pages;

      await settings.tapAdvancedTab();
      await settings.verifyAdvancedPage();
    });

    it('[PAS-XXX] User can verify Custom settings section with all elements', async () => {
      const { settings } = Pages;

      await settings.verifyCustomSettingsSection();
    });

    it('[PAS-XXX] User can turn on and turn off Reminders toggle', async () => {
      const { settings } = Pages;

      await settings.tapRemindersToggleOn();
      await settings.verifyRemindersToggleOffDisplayed();
      await settings.tapRemindersToggleOff();
      await settings.verifyRemindersToggleOnDisplayed();
    });

    it('[PAS-XXX] User can turn on and turn off Copy to Clipboard toggle', async () => {
      const { settings } = Pages;
      
      await settings.tapCopyToClipboardToggleOn();
      await settings.verifyCopyToClipboardToggleOffDisplayed();
      await settings.tapCopyToClipboardToggleOff();
      await settings.verifyCopyToClipboardToggleOnDisplayed();
    });

    it('[PAS-XXX] User can select Auto Logout timeout options and verify that 30 seconds is selected by default', async () => {
      const { settings } = Pages;

      await settings.tapAutoLogoutTimeoutField();
      await settings.verifyAutoLogoutTimeoutFieldDropdownDisplayed();
      await settings.verifyThirtySecondsRadioButtonSelected();
    });

    it('[PAS-XXX] User can switch between Auto Logout timeout options and select 4 hours', async () => {
      const { settings } = Pages;

      await settings.tapNeverRadioButton();
      await settings.verifyNeverDisplayedInAutoLogoutTimeoutField();
      await settings.tapAutoLogoutTimeoutFieldNever();
      await settings.verifyNeverRadioButtonSelected();
    });
        
    it('[PAS-XXX] Verify that all Auto Logout timeout options are displayed and not selected by default', async () => {
      const { settings, home, sidebar, signUp } = Pages;

      await settings.verifyThirtySecondsRadioButtonUnselected();
      await settings.verifyOneMinuteRadioButtonUnselected();
      await settings.verifyFiveMinutesRadioButtonUnselected();
      await settings.verifyFifteenMinutesRadioButtonUnselected();
      await settings.verifyThirtyMinutesRadioButtonUnselected();
      await settings.verifyOneHourRadioButtonUnselected();
      await settings.verifyNeverRadioButtonUnselected();
      await settings.tapNeverRadioButton();
      await home.tapBottomNavHomeTab();
      await home.waitForHomePageLoaded();
      await home.tapHomeLogoLock();
      await sidebar.waitForLoaded();
      await sidebar.tapCloseVault();
      await signUp.waitForEnterPasswordScreen();
      await signUp.enterMasterPassword(TEST_PASSWORDS.valid.complex);
      await signUp.tapEnterPasswordContinue();
      await signUp.verifySelectVaultsTitle();
      await signUp.tapSelectVaultsVaultItem();
      await home.verifyHomeLogoLockVisible();
      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();
      await settings.tapAdvancedTab();
    });

    it('[PAS-XXX] User can verify Blind Peering section with all elements', async () => {
      const { settings } = Pages;

      await settings.verifyBlindPeeringSection();
      await settings.verifyAllElementsInBlindPeeringSection();
    });

    it('[PAS-XXX] User can tap on Blind Peering section information icon and see information popup', async () => {
      const { settings } = Pages;

      await settings.tapBlindPeeringSectionInformationIcon();
      await settings.verifyBlindPeeringSectionInformationPopupDisplayed();
    });

    it('[PAS-XXX] User can tap on Blind Peering section learn more button and see learn more page and return to Settings page', async () => {
      const { sidebar, settings } = Pages;

      await settings.tapBlindPeeringSectionLearnMoreButton();
      await settings.verifyBlindPeeringSectionLearnMorePageDisplayed();
      await sidebar.pressBack();
      await settings.verifyBlindPeeringSectionInformationPopupDisplayed();
      await settings.tapRandomlyOnScreen();
    });

    it('[PAS-XXX] User can tap on Blind Peering section toggle and see Choose your Blind Peer popup', async () => {
      const { settings } = Pages;

      await settings.tapBlindPeeringSectionToggle();
      await settings.verifyChooseYourBlindPeerPopupDisplayed();
      await settings.verifyChooseYourBlindPeerPopupElements();
      await settings.tapChooseYourBlindPeerPopupCancelButton();
      await settings.verifyChooseYourBlindPeerPopupNotDisplayed();
    });

    it('[PAS-XXX] User can tap on Blind Peering section toggle, check that Automatic Blind Peers radio button is selected by default and tap on Manual Blind Peers radio button and see Manual Blind Peers selected', async () => {
      const { settings } = Pages;

      await settings.tapBlindPeeringSectionToggle();
      await settings.verifyAutomaticBlindPeersRadioButtonSelected();
      await settings.tapManualBlindPeersRadioButton();
      await settings.verifyManualBlindPeersRadioButtonSelected();
      await settings.verifyAutomaticBlindPeersRadioButtonUnselected();
      await settings.tapChooseYourBlindPeerPopupCancelButton();
      await settings.verifyChooseYourBlindPeerPopupNotDisplayed();
    });

    it('[PAS-XXX] User can choose Automatic Blind Peers', async () => {
      const { settings } = Pages;

      await settings.tapBlindPeeringSectionToggle();
      await settings.verifyChooseYourBlindPeerPopupDisplayed();
      await settings.verifyAutomaticBlindPeersRadioButtonSelected();
      await settings.tapChooseYourBlindPeerPopupConfirmButton();
      await settings.verifyAutomaticBlindPeersToastDisplayed();    
    });

    it('[PAS-XXX] User can verify Your Blind Peers section with new elements and see Automatic Blind Peers status is Active', async () => {
      const { settings } = Pages;

      await settings.swipeToUp();
      await settings.verifyAllNewElementsInYourBlindPeersSection();
    });

    it('[PAS-XXX] User can tap on Edit Blind Peers button and see Blind Peers popup', async () => {
      const { settings } = Pages;

      await settings.tapEditBlindPeersButton();
      await settings.verifyChooseYourBlindPeerPopupDisplayed();
      await settings.tapChooseYourBlindPeerPopupCancelButton();
    });

    it('[PAS-XXX] User can choose Manual Blind Peers', async () => {
      const { settings } = Pages;

      await settings.tapEditBlindPeersButton();
      await settings.verifyChooseYourBlindPeerPopupDisplayed();
      await settings.tapManualBlindPeersRadioButton();
      await settings.tapChooseYourBlindPeerPopupConfirmButton();
      await settings.verifyManualBlindPeersPopupDisplayed();
    });

    it('[PAS-XXX] Verify that Manual Blind Peers popup has all elements', async () => {
      const { settings } = Pages;

      await settings.verifyManualBlindPeersPopupElements();
    });

    it('[PAS-XXX] User can add one more code for blind peer', async () => {
      const { settings } = Pages;

      await settings.tapAddPeerButton();
      await settings.verifyTwoBlinPeersElementsDisplayed();
    });

    it('[PAS-XXX] User can remove one code for blind peer', async () => {
      const { settings } = Pages;

      await settings.tapRemovePeerButton();
      await settings.verifyTwoBlinPeersElementsIsNotDisplayed();
    });

    it('[PAS-XXX] User can add invalid code for blind peer and see error message', async () => {
      const { settings } = Pages;

      await settings.enterCodeForBlindPeer(TEST_PASSWORDS.blindPeerCodeInvalid);
      await settings.tapManualBlindPeersPopupConfirmButton();
      await browser.pause(3000);
      await settings.verifyInvalidCodeForBlindPeerWarningMessageDisplayed();
    });

    it('[PAS-XXX] User can add valid code for blind peer and see it in Your Blind Peers section', async () => {
      const { settings } = Pages;

      await settings.tapBlindPeeringSectionToggle();
      await settings.tapManualBlindPeersRadioButton();
      await settings.tapChooseYourBlindPeerPopupConfirmButton();
      await settings.verifyManualBlindPeersPopupDisplayed();
      await settings.enterCodeForBlindPeer(TEST_PASSWORDS.blindPeerCodeValid);
      await settings.tapManualBlindPeersPopupConfirmButton();
      await browser.pause(3000);
      await settings.verifySuccessToastForManualBlindPeersDisplayed();
    });

    it('[PAS-XXX] User can verify Your Blind Peers section with new elements and see Manual Blind Peers status is Active', async () => {
      const { settings } = Pages;
      
      await settings.swipeToUp();
      await settings.verifyAllNewManualBlindPeersElementsInYourBlindPeersSection();
    });

    it('[PAS-XXX] User can verify Autofill section with all elements', async () => {
      const { settings } = Pages;

      await settings.swipeToUp();
      await settings.verifyAutofillSection();
      await settings.verifyAllElementsInAutofillSection();
    });

    it('[PAS-XXX] User can tap on Autofill section, see Autofill popup and choose PearPass as default autofill provider', async () => {
      const { settings } = Pages;

      await settings.tapSetAsDefaultButton();
      await settings.verifyAutofillPopupDisplayed();
      await settings.verifyPearPassAppRadioButtonDisplayed();
      await settings.tapPearPassAppRadioButton();
      await settings.verifyAutofillPopupTextDisplayed();
      await settings.tapAutofillPopupOkButton();      
      await settings.swipeToDown();
      await settings.verifyNewElementsInAutofillSection();
    });

    it('[PAS-XXX] User can tap on Manage autofill settings link and see Autofill service page', async () => {
      const { settings } = Pages;

      await settings.tapAutoFillNewLinkManageAutofillSettings();
      await settings.verifyAutofillPopupDisplayed();
      await settings.tapAutoFIllServicesBackButton();
    });
  });

  describe('Settings Flow - Import Tab', () => {

    it('[PAS-XXX] User can tap on Import Tab and appear on Import page', async () => {
      const { settings, home } = Pages;

      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();
      await settings.tapImportTab();
      await settings.verifyImportPage();
    });

    it('[PAS-XXX] User can verify Import section with all elements', async () => {
      const { settings } = Pages;

      await settings.verifyImportSection();
      await settings.verifyTermsOfUseLink();
      await settings.verifyPrivacyStatementLink();
    });

    it('[PAS-XXX] Verify OnePassword button with all elements', async () => {
      const { settings } = Pages;

      await settings.verifyOnePasswordButtonWithAllElements();
    });

    it('[PAS-XXX] Verify Bitwarden button with all elements', async () => {
      const { settings } = Pages;

      await settings.verifyBitwardenButtonWithAllElements();
    });

    it('[PAS-XXX] Verify LastPass button with all elements', async () => {
      const { settings } = Pages;

      await settings.verifyLastPassButtonWithAllElements();
    });

    it('[PAS-XXX] Verify NordPass button with all elements', async () => {
      const { settings } = Pages;

      await settings.verifyNordPassButtonWithAllElements();
    });

    it('[PAS-XXX] Verify ProtonPass button with all elements', async () => {
      const { settings } = Pages;

      await settings.verifyProtonPassButtonWithAllElements();
    });

    it('[PAS-XXX] Verify Unencrypted file button with all elements', async () => {
      const { settings } = Pages;
        
      await settings.verifyUnencryptedFileButtonWithAllElements();
    });

    it('[PAS-461] It is possible to import 1Password .csv vault', async () => {
      const { settings, home } = Pages;
        
      await settings.tapOnePasswordButton();
      await settings.tapMenuButton();
      await settings.tapDownloadsButton();
      await settings.verifyDownloadsFolderTitleDisplayed();
      await settings.chooseOnePasswordFile();
      await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
      await home.tapBottomNavHomeTab();
      await home.waitForHomePageLoaded();
      await home.verifyOnePasswordAccountDisplayed();
      await home.verifyOnePasswordPasswordDisplayed();
      await home.verifyOnePasswordLoginDisplayed();
    });

    it('[PAS-462] It is possible to import Bitwarden .csv vault', async () => {
      const { settings, home } = Pages;

      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();

      await settings.tapBitwardenButton();
      await settings.verifyDownloadsFolderTitleDisplayed();
      await settings.chooseBitwardenCsvFile();
      await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
      await home.tapBottomNavHomeTab();
      await home.waitForHomePageLoaded();
      await home.verifyBitwardenCsvNoteDisplayed();
      await home.verifyBitwardenCsvLoginDisplayed();
    });

    it('[PAS-463] It is possible to import Bitwarden .json vault', async () => {
      const { settings, home } = Pages;

      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();

      await settings.tapBitwardenButton();
      await settings.verifyDownloadsFolderTitleDisplayed();
      await settings.chooseBitwardenJsonFile();
      await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
      await home.tapBottomNavHomeTab();
      await home.waitForHomePageLoaded();
      await home.verifyBitwardenJsonSshDisplayed();
      await home.verifyBitwardenJsonNoteDisplayed();
      await home.verifyBitwardenJsonLoginDisplayed();
      await home.verifyBitwardenJsonCreditDisplayed();
      await home.verifyBitwardenJsonIdentityDisplayed();
    });

    it('[PAS-464] It is possible to import LastPass .csv vault', async () => {
      const { settings, home } = Pages;

      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();

      await settings.tapLastPassButton();
      await settings.verifyDownloadsFolderTitleDisplayed();
      await settings.chooseLastPassCsvFile();
      await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
      await home.tapBottomNavHomeTab();
      await home.waitForHomePageLoaded();
      await home.verifyLastPassCsvNameDisplayed();
      await home.verifyLastPassCsvSecureDisplayed();
      await home.verifyLastPassCsvItemDisplayed();
    });

    it('[PAS-465] It is possible to import NordPass .csv vault', async () => {
      const { settings, home } = Pages;

      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();

      await settings.tapNordPassButton();
      await settings.verifyDownloadsFolderTitleDisplayed();
      await settings.chooseNordPassCsvFile();
      await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
      await home.tapBottomNavHomeTab();
      await home.waitForHomePageLoaded();
      await home.verifyNordPassCsvCreditDisplayed();
      await home.verifyNordPassCsvGmailDisplayed();
    });

    it('[PAS-466] It is possible to import Proton Pass .csv vault', async () => {
      const { settings, home } = Pages;

      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();

      await settings.tapProtonPassButton();
      await settings.verifyDownloadsFolderTitleDisplayed();
      await settings.chooseProtonPassCsvFile();
      await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
      await home.tapBottomNavHomeTab();
      await home.waitForHomePageLoaded();
      await home.verifyProtonPassCsvIdentityDisplayed();
      await home.verifyProtonPassCsvNoteDisplayed();
      await home.verifyProtonPassCsvLoginDisplayed();
    });

    it('[PAS-] It is possible to import Proton Pass .json vault', async () => {
      const { settings, home } = Pages;

      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();

      await settings.tapProtonPassButton();
      await settings.verifyDownloadsFolderTitleDisplayed();
      await settings.chooseProtonPassJsonFile();
      await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
      await home.tapBottomNavHomeTab();
      await home.waitForHomePageLoaded();
      await home.verifyProtonPassJsonIdentityDisplayed();
      await home.verifyProtonPassJsonNoteDisplayed();
      await home.verifyProtonPassJsonLoginDisplayed();
    });

    it('[PAS-468] It is possible to import Unencrypted file .csv vault', async () => {
      const { settings, home } = Pages;

      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();

      await settings.tapUnencryptedFileButton();
      await settings.verifyDownloadsFolderTitleDisplayed();
      await settings.chooseUnencryptedFileCsvFile();
      await settings.verifyVaultsImportedSuccessfullyToastDisplayed();
      await home.tapBottomNavHomeTab();
      await home.waitForHomePageLoaded();
      await home.verifyUnencryptedFileCsvHechtDisplayed();
      await home.verifyUnencryptedFileCsvIncDisplayed();
      });

    it('[PAS-XXX] User can open terms of use link and see terms of use page', async () => {
      const { settings, home } = Pages;

      await home.tapBottomNavSettingsTab();
      await settings.waitForLoaded();
      await settings.tapTermsOfUseLink();
      await settings.acceptCookiesIfPresent();
      await settings.verifyTermsOfUsePage();
      await settings.pressBack();
  });

  it('[PAS-XXX] User can open privacy statement link and see privacy statement page', async () => {
    const { settings } = Pages;

    await settings.tapPrivacyStatementLink();
    await settings.verifyPrivacyStatementPage();
    await settings.pressBack();
  });
});
