import BasePage from '@pages/BasePage';
import settingsLocators from '@locators/SettingsLocators';
import { GENERAL_TAB, VAULTS_TAB, LANGUAGE_SECTION, PASSWORDS_SECTION, MODIFY_MASTER_PASSWORD_POPUP, REPORT_PROBLEM_SECTION, VERSION_SECTION, LEGAL_LINKS, VAULTS_SECTION, CHANGE_VAULT_NAME_POPUP, EXPORT_SECTION, IMPORT_SECTION, CUSTOM_SETTINGS_SECTION, BLIND_PEERING_SECTION, AUTOFILL_SECTION } from '@data/settings.data';
import { browser } from '@wdio/globals';

// Use global expect from expect-webdriverio for text comparison
declare const expect: any;

export class SettingsPage extends BasePage {
  protected selectors = settingsLocators;

  /* ==================== GENERAL TAB GETTERS ==================== */
  get generalTab() { return this.$('generalTab'); }
  get vaultsTab() { return this.$('vaultsTab'); }
  get exportTab() { return this.$('exportTab'); }
  get importTab() { return this.$('importTab'); }
  get advancedTab() { return this.$('advancedTab'); }
  
  /* ==================== LANGUAGE SECTION GETTERS ==================== */
  get languageSection() { return this.$('languageSection'); }
  get languageSectionTitle() { return this.$('languageSectionTitle'); }
  get languageDropdown() { return this.$('languageDropdown'); }
  get languageDropdownMenu() { return this.$('languageDropdownMenu'); }
  get languageDropdownIcon() { return this.$('languageDropdownIcon'); }
  get languageDropdownText() { return this.$('languageDropdownText'); }
  
  /* ==================== PASSWORDS SECTION GETTERS ==================== */
  get passwordsSection() { return this.$('passwordsSection'); }
  get passwordSectionTitle() { return this.$('passwordSectionTitle'); }
  get masterVaultField() { return this.$('masterVaultField'); }
  get masterVaultFieldText() { return this.$('masterVaultFieldText'); }
  get masterVaultFieldFirstIcon() { return this.$('masterVaultFieldFirstIcon'); }
  get masterVaultFieldEditIcon() { return this.$('masterVaultFieldEditIcon'); }
  get modifyMasterPasswordPopUp() { return this.$('modifyMasterPasswordPopUp'); }
  get modifyMasterPasswordPopUpTitle() { return this.$('modifyMasterPasswordPopUpTitle'); }
  
  /* ==================== MODIFY MASTER PASSWORD POPUP GETTERS ==================== */
  get modifyMasterPasswordPopUpOldPasswordFieldText() { return this.$('modifyMasterPasswordPopUpOldPasswordFieldText'); }
  get modifyMasterPasswordPopUpInsertOldPasswordField() { return this.$('modifyMasterPasswordPopUpInsertOldPasswordField'); }
  get modifyMasterPasswordPopUpInsertOldPasswordInput() { return this.$('modifyMasterPasswordPopUpInsertOldPasswordInput'); }
  get modifyMasterPasswordPopUpInsertOldPasswordFieldIcon() { return this.$('modifyMasterPasswordPopUpInsertOldPasswordFieldIcon'); }
  get modifyMasterPasswordPopUpInsertOldPasswordFieldToggleVisibility() { return this.$('modifyMasterPasswordPopUpInsertOldPasswordFieldToggleVisibility'); }
  
  get modifyMasterPasswordPopUpCreateNewPasswordFieldText() { return this.$('modifyMasterPasswordPopUpCreateNewPasswordFieldText'); }
  get modifyMasterPasswordPopUpCreateNewPasswordField() { return this.$('modifyMasterPasswordPopUpCreateNewPasswordField'); }
  get modifyMasterPasswordPopUpCreateNewPasswordInput() { return this.$('modifyMasterPasswordPopUpCreateNewPasswordInput'); }
  get modifyMasterPasswordPopUpCreateNewPasswordFieldIcon() { return this.$('modifyMasterPasswordPopUpCreateNewPasswordFieldIcon'); }
  get modifyMasterPasswordPopUpCreateNewPasswordFieldToggleVisibility() { return this.$('modifyMasterPasswordPopUpCreateNewPasswordFieldToggleVisibility'); }
  
  get modifyMasterPasswordPopUpRepeatNewPasswordFieldText() { return this.$('modifyMasterPasswordPopUpRepeatNewPasswordFieldText'); }
  get modifyMasterPasswordPopUpRepeatNewPasswordField() { return this.$('modifyMasterPasswordPopUpRepeatNewPasswordField'); }
  get modifyMasterPasswordPopUpRepeatNewPasswordInput() { return this.$('modifyMasterPasswordPopUpRepeatNewPasswordInput'); }
  get modifyMasterPasswordPopUpRepeatNewPasswordFieldIcon() { return this.$('modifyMasterPasswordPopUpRepeatNewPasswordFieldIcon'); }
  get modifyMasterPasswordPopUpRepeatNewPasswordFieldToggleVisibility() { return this.$('modifyMasterPasswordPopUpRepeatNewPasswordFieldToggleVisibility'); }
  
  get modifyMasterPasswordPopUpContinueButton() { return this.$('modifyMasterPasswordPopUpContinueButton'); }
  get modifyMasterPasswordPopUpContinueButtonText() { return this.$('modifyMasterPasswordPopUpContinueButtonText'); }
  get modifyMasterPasswordPopUpCancelButton() { return this.$('modifyMasterPasswordPopUpCancelButton'); }
  get modifyMasterPasswordPopUpCancelButtonText() { return this.$('modifyMasterPasswordPopUpCancelButtonText'); }
  
  /* ==================== VAULTS TAB GETTERS ==================== */
  get manageVaultsSection() { return this.$('manageVaultsSection'); }
  get manageVaultsSectionTitle() { return this.$('manageVaultsSectionTitle'); }
  get manageVaultsSectionItem() { return this.$('manageVaultsSectionItem'); }
  get manageVaultsSectionItemIcon() { return this.$('manageVaultsSectionItemIcon'); }
  get manageVaultsSectionItemEditIcon() { return this.$('manageVaultsSectionItemEditIcon'); }
  get manageVaultsSectionItemText() { return this.$('manageVaultsSectionItemText'); }
  get newVaultNameText() { return this.$('newVaultNameText'); }
  get manageVaultsSectionItemDate() { return this.$('manageVaultsSectionItemDate'); }
  get manageVaultsSectionSecondItem() { return this.$('manageVaultsSectionSecondItem'); }
  get manageVaultsSectionSecondItemIcon() { return this.$('manageVaultsSectionSecondItemIcon'); }
  get manageVaultsSectionSecondItemEditIcon() { return this.$('manageVaultsSectionSecondItemEditIcon'); }
  get manageVaultsSectionSecondItemText() { return this.$('manageVaultsSectionSecondItemText'); }
  get manageVaultsSectionSecondItemDate() { return this.$('manageVaultsSectionSecondItemDate'); }
  
  /* ==================== CHANGE VAULT NAME POPUP GETTERS ==================== */
  get changeVaultNamePopUp() { return this.$('changeVaultNamePopUp'); }
  get changeVaultNamePopUpTitle() { return this.$('changeVaultNamePopUpTitle'); }
  get changeVaultNamePopUpButton() { return this.$('changeVaultNamePopUpButton'); }
  get changeVaultNamePopUpButtonText() { return this.$('changeVaultNamePopUpButtonText'); }
  get changeVaultNamePopUpWindow() { return this.$('changeVaultNamePopUpWindow'); }
  get changeVaultNamePopUpWindowTitle() { return this.$('changeVaultNamePopUpWindowTitle'); }
  get changeVaultNamePopUpWindowInputFieldName() { return this.$('changeVaultNamePopUpWindowInputFieldName'); }
  get changeVaultNamePopUpWindowInputField() { return this.$('changeVaultNamePopUpWindowInputField'); }
  get changeVaultNamePopUpWindowCancelButton() { return this.$('changeVaultNamePopUpWindowCancelButton'); }
  get changeVaultNamePopUpWindowCancelButtonText() { return this.$('changeVaultNamePopUpWindowCancelButtonText'); }
  get changeVaultNamePopUpWindowContinueButton() { return this.$('changeVaultNamePopUpWindowContinueButton'); }
  get changeVaultNamePopUpWindowContinueButtonText() { return this.$('changeVaultNamePopUpWindowContinueButtonText'); }
  
  /* ==================== MODIFY MASTER PASSWORD POPUP WARNING GETTERS ==================== */
  get invalidPasswordWarning() { return this.$('invalidPasswordWarning'); }
  get invalidPasswordWarningIcon() { return this.$('invalidPasswordWarningIcon'); }
  get passwordIsRequiredWarning() { return this.$('passwordIsRequiredWarning'); }
  get passwordIsRequiredWarningIcon() { return this.$('passwordIsRequiredWarningIcon'); }
  get passwordIsRequiredWarning2() { return this.$('passwordIsRequiredWarning2'); }
  get passwordIsRequiredWarning2Icon() { return this.$('passwordIsRequiredWarning2Icon'); }
  get passwordWarningAll() { return this.$('passwordWarningAll'); }
  get passwordWarningAllIcon() { return this.$('passwordWarningAllIcon'); }
  get newPasswordDifferentFromOldPasswordWarning() { return this.$('newPasswordDifferentFromOldPasswordWarning'); }
  get newPasswordDifferentFromOldPasswordWarningIcon() { return this.$('newPasswordDifferentFromOldPasswordWarningIcon'); }
  
  /* ==================== REPORT A PROBLEM SECTION GETTERS ==================== */
  get reportProblemSection() { return this.$('reportProblemSection'); }
  get reportProblemSectionTitle() { return this.$('reportProblemSectionTitle'); }
  get issueInputField() { return this.$('issueInputField'); }
  get sendButton() { return this.$('sendButton'); }
  get sendButtonText() { return this.$('sendButtonText'); }
  get feedbackSentToast() { return this.$('feedbackSentToast'); }
  get feedbackSentToastText() { return this.$('feedbackSentToastText'); }
  
  /* ==================== VERSION SECTION GETTERS ==================== */
  get versionSection() { return this.$('versionSection'); }
  get versionSectionTitle() { return this.$('versionSectionTitle'); }
  get versionText() { return this.$('versionText'); }
  
  /* ==================== EXPORT SECTION GETTERS ==================== */
  get exportSection() { return this.$('exportSection'); }
  
  /* ==================== IMPORT SECTION GETTERS ==================== */
  get importSection() { return this.$('importSection'); }
  get importSectionTitle() { return this.$('importSectionTitle'); }
  get importSectionDescription() { return this.$('importSectionDescription'); }
  
  get onePasswordButton() { return this.$('onePasswordButton'); }
  get onePasswordButtonIcon() { return this.$('onePasswordButtonIcon'); }
  get onePasswordButtonName() { return this.$('onePasswordButtonName'); }
  get onePasswordButtonText() { return this.$('onePasswordButtonText'); }
  
  get bitwardenButton() { return this.$('bitwardenButton'); }
  get bitwardenButtonIcon() { return this.$('bitwardenButtonIcon'); }
  get bitwardenButtonName() { return this.$('bitwardenButtonName'); }
  get bitwardenButtonText() { return this.$('bitwardenButtonText'); }
  
  get lastPassButton() { return this.$('lastPassButton'); }
  get lastPassButtonIcon() { return this.$('lastPassButtonIcon'); }
  get lastPassButtonName() { return this.$('lastPassButtonName'); }
  get lastPassButtonText() { return this.$('lastPassButtonText'); }
  
  get nordPassButton() { return this.$('nordPassButton'); }
  get nordPassButtonIcon() { return this.$('nordPassButtonIcon'); }
  get nordPassButtonName() { return this.$('nordPassButtonName'); }
  get nordPassButtonText() { return this.$('nordPassButtonText'); }
  
  get protonPassButton() { return this.$('protonPassButton'); }
  get protonPassButtonIcon() { return this.$('protonPassButtonIcon'); }
  get protonPassButtonName() { return this.$('protonPassButtonName'); }
  get protonPassButtonText() { return this.$('protonPassButtonText'); }
  
  get unencryptedFileButton() { return this.$('unencryptedFileButton'); }
  get unencryptedFileButtonIcon() { return this.$('unencryptedFileButtonIcon'); }
  get unencryptedFileButtonName() { return this.$('unencryptedFileButtonName'); }
  get unencryptedFileButtonText() { return this.$('unencryptedFileButtonText'); }
  
  get downloadsFolderTitle() { return this.$('downloadsFolderTitle'); }
  get onePasswordFile() { return this.$('onePasswordFile'); }
  get bitwardenCsvFile() { return this.$('bitwardenCsvFile'); }
  get bitwardenJsonFile() { return this.$('bitwardenJsonFile'); }
  get lastPassCsvFile() { return this.$('lastPassCsvFile'); }
  get nordPassCsvFile() { return this.$('nordPassCsvFile'); }
  get protonPassCsvFile() { return this.$('protonPassCsvFile'); }
  get protonPassJsonFile() { return this.$('protonPassJsonFile'); }
  get unencryptedFileCsvFile() { return this.$('unencryptedFileCsvFile'); }
  get unencryptedFileJsonFile() { return this.$('unencryptedFileJsonFile'); }
  get vaultsImportedSuccessfullyToast() { return this.$('vaultsImportedSuccessfullyToast'); }
  get vaultsImportedSuccessfullyToastText() { return this.$('vaultsImportedSuccessfullyToastText'); }
  get menuButton() { return this.$('menuButton'); }
  get downloadsButton() { return this.$('downloadsButton'); }

  /* ==================== ADVANCED SECTION GETTERS ==================== */
  get customSettingsSection() { return this.$('customSettingsSection'); }
  get customSettingsSectionTitle() { return this.$('customSettingsSectionTitle'); }
  get customSettingsSectionDescription() { return this.$('customSettingsSectionDescription'); }
  get remindersTitle() { return this.$('remindersTitle'); }
  get remindersDescription() { return this.$('remindersDescription'); }
  get remindersToggleOn() { return this.$('remindersToggleOn'); }
  get remindersToggleOff() { return this.$('remindersToggleOff'); }
  get copyToClipboardTitle() { return this.$('copyToClipboardTitle'); }
  get copyToClipboardDescription() { return this.$('copyToClipboardDescription'); }
  get copyToClipboardToggleOn() { return this.$('copyToClipboardToggleOn'); }
  get copyToClipboardToggleOff() { return this.$('copyToClipboardToggleOff'); }
  get autoLogoutTitle() { return this.$('autoLogoutTitle'); }
  get autoLogoutDescription() { return this.$('autoLogoutDescription'); }
  get autoLogoutTimeoutField() { return this.$('autoLogoutTimeoutField'); }
  get autoLogoutTimeoutFieldText() { return this.$('autoLogoutTimeoutFieldText'); }
  get autoLogoutTimeoutFieldIcon() { return this.$('autoLogoutTimeoutFieldIcon'); }
  get autoLogoutTimeoutFieldDropdown() { return this.$('autoLogoutTimeoutFieldDropdown'); }
  get autoLogoutTimeoutFieldNever() { return this.$('autoLogoutTimeoutFieldNever'); }
  get autoLogoutTimeoutFieldNeverText() { return this.$('autoLogoutTimeoutFieldNeverText'); }
  get autoLogoutTimeoutFieldNeverIcon() { return this.$('autoLogoutTimeoutFieldNeverIcon'); }
  get thirtySecondsRadioButtonChoose() { return this.$('thirtySecondsRadioButtonChoose'); }
  get thirtySecondsRadioButtonUnchoose() { return this.$('thirtySecondsRadioButtonUnchoose'); }
  get thirtySecondsRadioButtonText() { return this.$('thirtySecondsRadioButtonText'); }
  get oneMinuteRadioButtonUnchoose() { return this.$('oneMinuteRadioButtonUnchoose'); }
  get oneMinuteRadioButtonText() { return this.$('oneMinuteRadioButtonText'); }
  get fiveMinutesRadioButtonUnchoose() { return this.$('fiveMinutesRadioButtonUnchoose'); }
  get fiveMinutesRadioButtonText() { return this.$('fiveMinutesRadioButtonText'); }
  get fifteenMinutesRadioButtonUnchoose() { return this.$('fifteenMinutesRadioButtonUnchoose'); }
  get fifteenMinutesRadioButtonText() { return this.$('fifteenMinutesRadioButtonText'); }
  get thirtyMinutesRadioButtonUnchoose() { return this.$('thirtyMinutesRadioButtonUnchoose'); }
  get thirtyMinutesRadioButtonText() { return this.$('thirtyMinutesRadioButtonText'); }
  get oneHourRadioButtonUnchoose() { return this.$('oneHourRadioButtonUnchoose'); }
  get oneHourRadioButtonText() { return this.$('oneHourRadioButtonText'); }
  get fourHourRadioButtonUnchoose() { return this.$('fourHoursRadioButtonUnchoose'); }
  get fourHoursRadioButtonChoose() { return this.$('fourHoursRadioButtonChoose'); }
  get fourHoursRadioButtonText() { return this.$('fourHoursRadioButtonText'); }
  get neverRadioButtonUnchoose() { return this.$('neverRadioButtonUnchoose'); }
  get neverRadioButtonText() { return this.$('neverRadioButtonText'); }
  get neverRadioButtonChoose() { return this.$('neverRadioButtonChoose'); }
  get blindPeeringSection() { return this.$('blindPeeringSection'); }
  get blindPeeringSectionIcon() { return this.$('blindPeeringSectionIcon'); }
  get autoFillSection() { return this.$('autoFillSection'); }
  get autoFillSectionTitle() { return this.$('autoFillSectionTitle'); }
  get autoFillSectionDescription() { return this.$('autoFillSectionDescription'); }
  get setAsDefaultButton() { return this.$('setAsDefaultButton'); }
  get setAsDefaultButtonText() { return this.$('setAsDefaultButtonText'); }
  get setAsDefaultButtonIcon() { return this.$('setAsDefaultButtonIcon'); }
  get autoFIllServicesToolbar() { return this.$('autoFIllServicesToolbar'); }
  get autoFIllServicesBackButton() { return this.$('autoFIllServicesBackButton'); }
  get autoFIllServicesPearPassRadioButton() { return this.$('autoFIllServicesPearPassRadioButton'); }
  get autoFIllServicesPearPassRadioButtonText() { return this.$('autoFIllServicesPearPassRadioButtonText'); }
  get autoFIllServicesPearPassRadioButtonIcon() { return this.$('autoFIllServicesPearPassRadioButtonIcon'); }
  get autofillPopup() { return this.$('autofillPopup'); }
  get autofillPopupText() { return this.$('autofillPopupText'); }
  get autofillPopupOkButton() { return this.$('autofillPopupOkButton'); }
  get autofillPopupCancelButton() { return this.$('autofillPopupCancelButton'); }
  get autofillNewText() { return this.$('autofillNewText'); }
  get autoFillNewLinkManageAutofillSettings() { return this.$('autoFillNewLinkManageAutofillSettings'); }
  get blindPeeringSectionTitle() { return this.$('blindPeeringSectionTitle'); }
  get blindPeeringSectionDescription() { return this.$('blindPeeringSectionDescription'); }
  get blindPeeringSectionText() { return this.$('blindPeeringSectionText'); }
  get blindPeeringSectionLearnMoreButton() { return this.$('blindPeeringSectionLearnMoreButton'); }
  get blindPeeringSectionLearnMoreButtonIcon() { return this.$('blindPeeringSectionLearnMoreButtonIcon'); }
  get blindPeeringSectionInformationPopupLearnMoreButton() { return this.$('blindPeeringSectionInformationPopupLearnMoreButton'); }
  get blindPeeringSectionInformationPopupLearnMoreButtonIcon() { return this.$('blindPeeringSectionInformationPopupLearnMoreButtonIcon'); }
  get blindPeeringSectionInformationPopupLearnMoreButtonLink() { return this.$('blindPeeringSectionInformationPopupLearnMoreButtonLink'); }
  get blindPeeringSectionToggleOn() { return this.$('blindPeeringSectionToggleOn'); }
  get blindPeeringSectionToggleOff() { return this.$('blindPeeringSectionToggleOff'); }
  get blindPeeringSectionInformationPopup() { return this.$('blindPeeringSectionInformationPopup'); }
  get blindPeeringSectionInformationPopupTitle() { return this.$('blindPeeringSectionInformationPopupTitle'); }
  get blindPeeringSectionInformationPopupDescription() { return this.$('blindPeeringSectionInformationPopupDescription'); }
  get blindPeeringSectionInformationPopupText() { return this.$('blindPeeringSectionInformationPopupText'); }
  get blindPeeringSectionInformationPopupText2() { return this.$('blindPeeringSectionInformationPopupText2'); }
  get blindPeeringInformationPage() { return this.$('blindPeeringInformationPage'); }
  get chooseBlindPeeringPopup() { return this.$('chooseBlindPeeringPopup'); }
  get chooseBlindPeeringPopupTitle() { return this.$('chooseBlindPeeringPopupTitle'); }
  get chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonChoose() { return this.$('chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonChoose'); }
  get chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonText() { return this.$('chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonText'); }
  get chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonUnchoose() { return this.$('chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonUnchoose'); }
  get chooseBlindPeeringPopupManualBlindPeersRadioButtonText() { return this.$('chooseBlindPeeringPopupManualBlindPeersRadioButtonText'); }
  get chooseBlindPeeringPopupManualBlindPeersRadioButtonUnchoose() { return this.$('chooseBlindPeeringPopupManualBlindPeersRadioButtonUnchoose'); }
  get chooseBlindPeeringPopupManualBlindPeersRadioButtonChoose() { return this.$('chooseBlindPeeringPopupManualBlindPeersRadioButtonChoose'); }
  get chooseBlindPeeringPopupConfirmButton() { return this.$('chooseBlindPeeringPopupConfirmButton'); }
  get chooseBlindPeeringPopupConfirmButtonText() { return this.$('chooseBlindPeeringPopupConfirmButtonText'); }
  get chooseBlindPeeringPopupCancelButton() { return this.$('chooseBlindPeeringPopupCancelButton'); }
  get chooseBlindPeeringPopupCancelButtonText() { return this.$('chooseBlindPeeringPopupCancelButtonText'); }
  get automaticBlindPeersToast() { return this.$('automaticBlindPeersToast'); }
  get automaticBlindPeersToastText() { return this.$('automaticBlindPeersToastText'); }
  get yourBlindPeersText() { return this.$('yourBlindPeersText'); }
  get yourBlindPeersField() { return this.$('yourBlindPeersField'); }
  get manualBlindPeersField() { return this.$('manualBlindPeersField'); }
  get manualBlindPeersFieldText() { return this.$('manualBlindPeersFieldText'); }
  get manualBlindPeersFieldIcon() { return this.$('manualBlindPeersFieldIcon'); }
  get manualBlindPeersFieldStatus() { return this.$('manualBlindPeersFieldStatus'); }
  get separateIcon() { return this.$('separateIcon'); }
  get manualBlindPeersFieldTextCount() { return this.$('manualBlindPeersFieldTextCount'); }
  get ourBlindPeersFieldText() { return this.$('ourBlindPeersFieldText'); }
  get ourBlindPeersFieldIcon() { return this.$('ourBlindPeersFieldIcon'); }
  get ourBlindPeersFieldStatus() { return this.$('ourBlindPeersFieldStatus'); }
  get editBlindPeersButton() { return this.$('editBlindPeersButton'); }
  get editBlindPeersButtonText() { return this.$('editBlindPeersButtonText'); }
  get editBlindPeersButtonIcon() { return this.$('editBlindPeersButtonIcon'); }
  get manualBlindPeersPopup() { return this.$('manualBlindPeersPopup'); }
  get manualBlindPeersPopupTitle() { return this.$('manualBlindPeersPopupTitle'); }
  get manualBlindPeersPopupBackButton() { return this.$('manualBlindPeersPopupBackButton'); }
  get oneBlinPeerText() { return this.$('oneBlinPeerText'); }
  get addHereYourCodeField() { return this.$('addHereYourCodeField'); }
  get addPeerButton() { return this.$('addPeerButton'); }
  get addPeerButtonText() { return this.$('addPeerButtonText'); }
  get addPeerButtonIcon() { return this.$('addPeerButtonIcon'); }
  get twoBlinPeerText() { return this.$('twoBlinPeerText'); }
  get twoBlinPeerAddHereYourCodeField() { return this.$('twoBlinPeerAddHereYourCodeField'); }
  get removePeerButton() { return this.$('removePeerButton'); }
  get removePeerButtonText() { return this.$('removePeerButtonText'); }
  get removePeerButtonIcon() { return this.$('removePeerButtonIcon'); }
  get errorToastForManualBlindPeers() { return this.$('errorToastForManualBlindPeers'); }
  get errorToastForManualBlindPeersText() { return this.$('errorToastForManualBlindPeersText'); }
  get successToastForManualBlindPeers() { return this.$('successToastForManualBlindPeers'); }
  get successToastForManualBlindPeersText() { return this.$('successToastForManualBlindPeersText'); }
  get manualBlindPeersPopupConfirmButton() { return this.$('manualBlindPeersPopupConfirmButton'); }
  get manualBlindPeersPopupConfirmButtonText() { return this.$('manualBlindPeersPopupConfirmButtonText'); }
  get manualBlindPeersPopupCancelButton() { return this.$('manualBlindPeersPopupCancelButton'); }
  get manualBlindPeersPopupCancelButtonText() { return this.$('manualBlindPeersPopupCancelButtonText'); }
  get exportSectionTitle() { return this.$('exportSectionTitle'); }
  get vaults1() { return this.$('vaults1'); }
  get vaults2() { return this.$('vaults2'); }
  get vaults1Icon() { return this.$('vaults1Icon'); }
  get vaults1Text() { return this.$('vaults1Text'); }
  get vaults1Date() { return this.$('vaults1Date'); }
  get vault1ChooseIcon() { return this.$('vault1ChooseIcon'); }
  get vault1ChooseIcon1() { return this.$('vault1ChooseIcon1'); }
  get vaults2Icon() { return this.$('vaults2Icon'); }
  get vaults2Text() { return this.$('vaults2Text'); }
  get vaults2Date() { return this.$('vaults2Date'); }
  get exportSectionText() { return this.$('exportSectionText'); }
  get csvRadioButton() { return this.$('csvRadioButton'); }
  get csvRadioButtonText() { return this.$('csvRadioButtonText'); }
  get csvRadioButtonUnchoose() { return this.$('csvRadioButtonUnchoose'); }
  get csvRadioButtonChoose() { return this.$('csvRadioButtonChoose'); }
  get jsonRadioButton() { return this.$('jsonRadioButton'); }
  get jsonRadioButtonText() { return this.$('jsonRadioButtonText'); }
  get jsonRadioButtonUnchoose() { return this.$('jsonRadioButtonUnchoose'); }
  get jsonRadioButtonChoose() { return this.$('jsonRadioButtonChoose'); }
  get exportButton() { return this.$('exportButton'); }
  get exportButtonText() { return this.$('exportButtonText'); }
  get exportVaultsPopup() { return this.$('exportVaultsPopup'); }
  get exportVaultsPopupTitle() { return this.$('exportVaultsPopupTitle'); }
  get exportVaultsPopupText() { return this.$('exportVaultsPopupText'); }
  get exportVaultsPopupField() { return this.$('exportVaultsPopupField'); }
  get exportVaultsPopupFieldIcon() { return this.$('exportVaultsPopupFieldIcon'); }
  get exportVaultsInValidPasswordWarningIcon() { return this.$('exportVaultsInValidPasswordWarningIcon'); }
  get exportVaultsInValidPasswordWarningText() { return this.$('exportVaultsInValidPasswordWarningText'); }
  get exportVaultsPopupFieldShowPasswordIcon() { return this.$('exportVaultsPopupFieldShowPasswordIcon'); }
  get exportVaultsPopupFieldShowPasswordIcon1() { return this.$('exportVaultsPopupFieldShowPasswordIcon1'); }
  get exportVaultsPopupInputField() { return this.$('exportVaultsPopupInputField'); }
  get exportVaultsPopupExportButton() { return this.$('exportVaultsPopupExportButton'); }
  get exportVaultsPopupExportButtonText() { return this.$('exportVaultsPopupExportButtonText'); }
  get exportVaultsPopupCancelButton() { return this.$('exportVaultsPopupCancelButton'); }
  get exportVaultsPopupCancelButtonText() { return this.$('exportVaultsPopupCancelButtonText'); }
  get vaultsSavedMessage() { return this.$('vaultsSavedMessage'); }
  get exportSuccessToast() { return this.$('exportSuccessToast'); }
  get exportSuccessToastTitle() { return this.$('exportSuccessToastTitle'); }
  get exportSuccessToastText() { return this.$('exportSuccessToastText'); }
  get newVaultNameAtVaultsSection() { return this.$('newVaultNameAtVaultsSection'); }
  get newVaultNameAtExportSection() { return this.$('newVaultNameAtExportSection'); }


  /* ==================== LEGAL LINKS GETTERS ==================== */
  get termsOfUseLink() { return this.$('termsOfUseLink'); }
  get privacyStatementLink() { return this.$('privacyStatementLink'); }
  get termsOfUseLinkPageTitle() { return this.$('termsOfUseLinkPageTitle'); }
  get privacyStatementLinkPageTitle() { return this.$('privacyStatementLinkPageTitle'); }
  get allowAllCookiesButton() { return this.$('allowAllCookiesButton'); }

  async waitForLoaded(): Promise<this> {
    await this.generalTab.waitForDisplayed({ timeoutMsg: 'General tab not visible' });
    return this.self;
  }

  /* ==================== LANGUAGE SECTION METHODS ==================== */
  async verifyLanguageSection(): Promise<this> {
    await this.verifyElementDisplayed(this.languageSection, 'languageSection', 'Language section should be visible');
    
    await this.verifyElementDisplayed(this.languageSectionTitle, 'languageSectionTitle', 'Language section title should be visible');
    const titleText = await this.languageSectionTitle.getText();
    expect(titleText).toBe(LANGUAGE_SECTION.title);
    
    await this.verifyElementDisplayed(this.languageDropdown, 'languageDropdown', 'Language dropdown should be visible');
    
    await this.verifyElementDisplayed(this.languageDropdownIcon, 'languageDropdownIcon', 'Language dropdown icon should be visible');
    
    await this.verifyElementDisplayed(this.languageDropdownText, 'languageDropdownText', 'Language dropdown text should be visible');
    const languageText = await this.languageDropdownText.getText();
    expect(languageText).toBe(LANGUAGE_SECTION.defaultLanguage);
    
    return this.self;
  }

  async tapLanguageDropdown(): Promise<this> {
    await this.languageDropdown.click();
    return this.self;
  }

  async verifyLanguageDropdownMenu(): Promise<this> {
    await this.languageDropdownMenu.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.languageDropdownMenu, 'languageDropdownMenu', 'Language dropdown menu should be visible');
    
    const languageText = await this.languageDropdownText.getText();
    expect(languageText).toBe(LANGUAGE_SECTION.defaultLanguage);
    
    return this.self;
  }

  /* ==================== PASSWORDS SECTION METHODS ==================== */
  async verifyPasswordsSection(): Promise<this> {
    await this.verifyElementDisplayed(this.passwordsSection, 'passwordsSection', 'Passwords section should be visible');
    
    await this.verifyElementDisplayed(this.passwordSectionTitle, 'passwordSectionTitle', 'Password section title should be visible');
    const titleText = await this.passwordSectionTitle.getText();
    expect(titleText).toBe(PASSWORDS_SECTION.title);
    
    await this.verifyElementDisplayed(this.masterVaultField, 'masterVaultField', 'Master Vault field should be visible');
    
    await this.verifyElementDisplayed(this.masterVaultFieldText, 'masterVaultFieldText', 'Master Vault field text should be visible');
    const masterVaultText = await this.masterVaultFieldText.getText();
    expect(masterVaultText).toBe(PASSWORDS_SECTION.masterVault);
    
    await this.verifyElementDisplayed(this.masterVaultFieldFirstIcon, 'masterVaultFieldFirstIcon', 'Master Vault field first icon should be visible');
    
    await this.verifyElementDisplayed(this.masterVaultFieldEditIcon, 'masterVaultFieldEditIcon', 'Master Vault field edit icon should be visible');
    
    return this.self;
  }

  async tapMasterVaultFieldEditIcon(): Promise<this> {
    await this.masterVaultFieldEditIcon.click();
    return this.self;
  }

  async tapVaultsTab(): Promise<this> {
    await this.vaultsTab.click();
    return this.self;
  }

  async tapExportTab(): Promise<this> {
    await this.exportTab.click();
    return this.self;
  }

  async tapImportTab(): Promise<this> {
    await this.importTab.click();
    return this.self;
  }

  async verifyImportPage(): Promise<this> {
    await this.importSection.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.importSection, 'importSection', 'Import section should be visible');
    return this.self;
  }

  async verifyImportSection(): Promise<this> {
    // Verify Import Section Title
    await this.verifyElementDisplayed(this.importSectionTitle, 'importSectionTitle', 'Import section title should be visible');
    const titleText = await this.importSectionTitle.getText();
    expect(titleText).toBe(IMPORT_SECTION.title);
    
    // Verify Import Section Description
    await this.verifyElementDisplayed(this.importSectionDescription, 'importSectionDescription', 'Import section description should be visible');
    const descriptionText = await this.importSectionDescription.getText();
    expect(descriptionText).toBe(IMPORT_SECTION.description);
    
    return this.self;
  }

  async verifyOnePasswordButtonWithAllElements(): Promise<this> {
    // Verify 1Password Button
    await this.verifyElementDisplayed(this.onePasswordButton, 'onePasswordButton', '1Password button should be visible');
    
    // Verify 1Password Button Icon
    await this.verifyElementDisplayed(this.onePasswordButtonIcon, 'onePasswordButtonIcon', '1Password button icon should be visible');
    
    // Verify 1Password Button Name
    await this.verifyElementDisplayed(this.onePasswordButtonName, 'onePasswordButtonName', '1Password button name should be visible');
    const buttonName = await this.onePasswordButtonName.getText();
    expect(buttonName).toBe(IMPORT_SECTION.importSources.onePassword.name);
    
    // Verify 1Password Button Text (Format)
    await this.verifyElementDisplayed(this.onePasswordButtonText, 'onePasswordButtonText', '1Password button text should be visible');
    const buttonText = await this.onePasswordButtonText.getText();
    expect(buttonText).toBe(IMPORT_SECTION.importSources.onePassword.formats);
    
    return this.self;
  }

  async tapOnePasswordButton(): Promise<this> {
    await this.onePasswordButton.click();
    return this.self;
  }

  async tapMenuButton(): Promise<this> {
    await this.menuButton.click();
    return this.self;
  }

  async tapDownloadsButton(): Promise<this> {
    await this.downloadsButton.click();
    return this.self;
  }

  async tapBitwardenButton(): Promise<this> {
    await this.bitwardenButton.click();
    return this.self;
  }

  async tapLastPassButton(): Promise<this> {
    await this.lastPassButton.click();
    return this.self;
  }

  async tapNordPassButton(): Promise<this> {
    await this.nordPassButton.click();
    return this.self;
  }

  async tapProtonPassButton(): Promise<this> {
    await this.protonPassButton.click();
    return this.self;
  }

  async tapUnencryptedFileButton(): Promise<this> {
    await this.unencryptedFileButton.click();
    return this.self;
  }

  async verifyDownloadsFolderTitleDisplayed(): Promise<this> {
    await this.downloadsFolderTitle.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.downloadsFolderTitle, 'downloadsFolderTitle', 'Downloads folder title should be visible');
    return this.self;
  }

  async chooseOnePasswordFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.onePasswordFile.waitForDisplayed({ timeout: waitTimeout });
        await this.onePasswordFile.click();
        return this.self;
      } catch (err: any) {
        lastError = err;
        if (attempt < maxAttempts - 1) {
          await this.swipe('up');
        }
      }
    }
    throw lastError ?? new Error('onePasswordFile not found after swiping up');
  }

  async chooseBitwardenCsvFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.bitwardenCsvFile.waitForDisplayed({ timeout: waitTimeout });
        await this.bitwardenCsvFile.click();
        return this.self;
      } catch (err: any) {
        lastError = err;
        if (attempt < maxAttempts - 1) {
          await this.swipe('up');
        }
      }
    }
    throw lastError ?? new Error('bitwardenCsvFile not found after swiping up');
  }

  async chooseBitwardenJsonFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.bitwardenJsonFile.waitForDisplayed({ timeout: waitTimeout });
        await this.bitwardenJsonFile.click();
        return this.self;
      } catch (err: any) {
        lastError = err;
        if (attempt < maxAttempts - 1) {
          await this.swipe('up');
        }
      }
    }
    throw lastError ?? new Error('bitwardenJsonFile not found after swiping up');
  }

  async chooseLastPassCsvFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.lastPassCsvFile.waitForDisplayed({ timeout: waitTimeout });
        await this.lastPassCsvFile.click();
        return this.self;
      } catch (err: any) {
        lastError = err;
        if (attempt < maxAttempts - 1) {
          await this.swipe('up');
        }
      }
    }
    throw lastError ?? new Error('lastPassCsvFile not found after swiping up');
  }

  async chooseNordPassCsvFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.nordPassCsvFile.waitForDisplayed({ timeout: waitTimeout });
        await this.nordPassCsvFile.click();
        return this.self;
      } catch (err: any) {
        lastError = err;
        if (attempt < maxAttempts - 1) {
          await this.swipe('up');
        }
      }
    }
    throw lastError ?? new Error('nordPassCsvFile not found after swiping up');
  }

  async chooseProtonPassCsvFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.protonPassCsvFile.waitForDisplayed({ timeout: waitTimeout });
        await this.protonPassCsvFile.click();
        return this.self;
      } catch (err: any) {
        lastError = err;
        if (attempt < maxAttempts - 1) {
          await this.swipe('up');
        }
      }
    }
    throw lastError ?? new Error('protonPassCsvFile not found after swiping up');
  }

  async chooseProtonPassJsonFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.protonPassJsonFile.waitForDisplayed({ timeout: waitTimeout });
        await this.protonPassJsonFile.click();
        return this.self;
      } catch (err: any) {
        lastError = err;
        if (attempt < maxAttempts - 1) {
          await this.swipe('up');
        }
      }
    }
    throw lastError ?? new Error('protonPassJsonFile not found after swiping up');
  }

  async chooseUnencryptedFileCsvFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.unencryptedFileCsvFile.waitForDisplayed({ timeout: waitTimeout });
        await this.unencryptedFileCsvFile.click();
        return this.self;
      } catch (err: any) {
        lastError = err;
        if (attempt < maxAttempts - 1) {
          await this.swipe('up');
        }
      }
    }
    throw lastError ?? new Error('unencryptedFileCsvFile not found after swiping up');
  }

  async chooseUnencryptedFileJsonFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.unencryptedFileJsonFile.waitForDisplayed({ timeout: waitTimeout });
        await this.unencryptedFileJsonFile.click();
        return this.self;
      } catch (err: any) {
        lastError = err;
        if (attempt < maxAttempts - 1) {
          await this.swipe('up');
        }
      }
    }
    throw lastError ?? new Error('unencryptedFileJsonFile not found after swiping up');
  }

  async verifyVaultsImportedSuccessfullyToastDisplayed(): Promise<this> {
    await this.vaultsImportedSuccessfullyToast.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.vaultsImportedSuccessfullyToast, 'vaultsImportedSuccessfullyToast', 'Vaults imported successfully toast should be visible');
    
    await this.verifyElementDisplayed(this.vaultsImportedSuccessfullyToastText, 'vaultsImportedSuccessfullyToastText', 'Vaults imported successfully toast text should be visible');
    const toastText = await this.vaultsImportedSuccessfullyToastText.getText();
    expect(toastText).toBe(IMPORT_SECTION.toastMessages.importSuccess);
    
    return this.self;
  }

  async verifyBitwardenButtonWithAllElements(): Promise<this> {
    // Verify Bitwarden Button
    await this.verifyElementDisplayed(this.bitwardenButton, 'bitwardenButton', 'Bitwarden button should be visible');
    
    // Verify Bitwarden Button Icon
    await this.verifyElementDisplayed(this.bitwardenButtonIcon, 'bitwardenButtonIcon', 'Bitwarden button icon should be visible');
    
    // Verify Bitwarden Button Name
    await this.verifyElementDisplayed(this.bitwardenButtonName, 'bitwardenButtonName', 'Bitwarden button name should be visible');
    const buttonName = await this.bitwardenButtonName.getText();
    expect(buttonName).toBe(IMPORT_SECTION.importSources.bitwarden.name);
    
    // Verify Bitwarden Button Text (Format)
    await this.verifyElementDisplayed(this.bitwardenButtonText, 'bitwardenButtonText', 'Bitwarden button text should be visible');
    const buttonText = await this.bitwardenButtonText.getText();
    expect(buttonText).toBe(IMPORT_SECTION.importSources.bitwarden.formats);
    
    return this.self;
  }

  async verifyLastPassButtonWithAllElements(): Promise<this> {
    // Verify LastPass Button
    await this.verifyElementDisplayed(this.lastPassButton, 'lastPassButton', 'LastPass button should be visible');
    
    // Verify LastPass Button Icon
    await this.verifyElementDisplayed(this.lastPassButtonIcon, 'lastPassButtonIcon', 'LastPass button icon should be visible');
    
    // Verify LastPass Button Name
    await this.verifyElementDisplayed(this.lastPassButtonName, 'lastPassButtonName', 'LastPass button name should be visible');
    const buttonName = await this.lastPassButtonName.getText();
    expect(buttonName).toBe(IMPORT_SECTION.importSources.lastPass.name);
    
    // Verify LastPass Button Text (Format)
    await this.verifyElementDisplayed(this.lastPassButtonText, 'lastPassButtonText', 'LastPass button text should be visible');
    const buttonText = await this.lastPassButtonText.getText();
    expect(buttonText).toBe(IMPORT_SECTION.importSources.lastPass.formats);
    
    return this.self;
  }

  async verifyNordPassButtonWithAllElements(): Promise<this> {
    // Verify NordPass Button
    await this.verifyElementDisplayed(this.nordPassButton, 'nordPassButton', 'NordPass button should be visible');
    
    // Verify NordPass Button Icon
    await this.verifyElementDisplayed(this.nordPassButtonIcon, 'nordPassButtonIcon', 'NordPass button icon should be visible');
    
    // Verify NordPass Button Name
    await this.verifyElementDisplayed(this.nordPassButtonName, 'nordPassButtonName', 'NordPass button name should be visible');
    const buttonName = await this.nordPassButtonName.getText();
    expect(buttonName).toBe(IMPORT_SECTION.importSources.nordPass.name);
    
    // Verify NordPass Button Text (Format)
    await this.verifyElementDisplayed(this.nordPassButtonText, 'nordPassButtonText', 'NordPass button text should be visible');
    const buttonText = await this.nordPassButtonText.getText();
    expect(buttonText).toBe(IMPORT_SECTION.importSources.nordPass.formats);
    
    return this.self;
  }

  async verifyProtonPassButtonWithAllElements(): Promise<this> {
    // Verify Proton Pass Button
    await this.verifyElementDisplayed(this.protonPassButton, 'protonPassButton', 'Proton Pass button should be visible');
    
    // Verify Proton Pass Button Icon
    await this.verifyElementDisplayed(this.protonPassButtonIcon, 'protonPassButtonIcon', 'Proton Pass button icon should be visible');
    
    // Verify Proton Pass Button Name
    await this.verifyElementDisplayed(this.protonPassButtonName, 'protonPassButtonName', 'Proton Pass button name should be visible');
    const buttonName = await this.protonPassButtonName.getText();
    expect(buttonName).toBe(IMPORT_SECTION.importSources.protonPass.name);
    
    // Verify Proton Pass Button Text (Format)
    await this.verifyElementDisplayed(this.protonPassButtonText, 'protonPassButtonText', 'Proton Pass button text should be visible');
    const buttonText = await this.protonPassButtonText.getText();
    expect(buttonText).toBe(IMPORT_SECTION.importSources.protonPass.formats);
    
    return this.self;
  }

  async verifyUnencryptedFileButtonWithAllElements(): Promise<this> {
    // Verify Unencrypted File Button
    await this.verifyElementDisplayed(this.unencryptedFileButton, 'unencryptedFileButton', 'Unencrypted file button should be visible');
    
    // Verify Unencrypted File Button Icon
    await this.verifyElementDisplayed(this.unencryptedFileButtonIcon, 'unencryptedFileButtonIcon', 'Unencrypted file button icon should be visible');
    
    // Verify Unencrypted File Button Name
    await this.verifyElementDisplayed(this.unencryptedFileButtonName, 'unencryptedFileButtonName', 'Unencrypted file button name should be visible');
    const buttonName = await this.unencryptedFileButtonName.getText();
    expect(buttonName).toBe(IMPORT_SECTION.importSources.unencryptedFile.name);
    
    // Verify Unencrypted File Button Text (Format)
    await this.verifyElementDisplayed(this.unencryptedFileButtonText, 'unencryptedFileButtonText', 'Unencrypted file button text should be visible');
    const buttonText = await this.unencryptedFileButtonText.getText();
    expect(buttonText).toBe(IMPORT_SECTION.importSources.unencryptedFile.formats);
    
    return this.self;
  }

  async tapAdvancedTab(): Promise<this> {
    await this.advancedTab.click();
    return this.self;
  }

  async verifyAdvancedPage(): Promise<this> {
    await this.customSettingsSection.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.customSettingsSection, 'customSettingsSection', 'Custom settings section should be visible');
    return this.self;
  }

  async verifyCustomSettingsSection(): Promise<this> {
    // Verify Section Title
    await this.verifyElementDisplayed(this.customSettingsSectionTitle, 'customSettingsSectionTitle', 'Custom settings section title should be visible');
    const titleText = await this.customSettingsSectionTitle.getText();
    expect(titleText).toBe(CUSTOM_SETTINGS_SECTION.title);

    // Verify Section Description
    await this.verifyElementDisplayed(this.customSettingsSectionDescription, 'customSettingsSectionDescription', 'Custom settings section description should be visible');
    const descriptionText = await this.customSettingsSectionDescription.getText();
    expect(descriptionText).toBe(CUSTOM_SETTINGS_SECTION.description);

    // Verify Reminders Section
    await this.verifyElementDisplayed(this.remindersTitle, 'remindersTitle', 'Reminders title should be visible');
    const remindersTitleText = await this.remindersTitle.getText();
    expect(remindersTitleText).toBe(CUSTOM_SETTINGS_SECTION.reminders.title);
    
    await this.verifyElementDisplayed(this.remindersDescription, 'remindersDescription', 'Reminders description should be visible');
    const remindersDescriptionText = await this.remindersDescription.getText();
    expect(remindersDescriptionText).toBe(CUSTOM_SETTINGS_SECTION.reminders.description);
    
    await this.verifyElementDisplayed(this.remindersToggleOn, 'remindersToggleOn', 'Reminders toggle on should be visible');

    // Verify Copy to Clipboard Section
    await this.verifyElementDisplayed(this.copyToClipboardTitle, 'copyToClipboardTitle', 'Copy to clipboard title should be visible');
    const copyToClipboardTitleText = await this.copyToClipboardTitle.getText();
    expect(copyToClipboardTitleText).toBe(CUSTOM_SETTINGS_SECTION.copyToClipboard.title);
    
    await this.verifyElementDisplayed(this.copyToClipboardDescription, 'copyToClipboardDescription', 'Copy to clipboard description should be visible');
    const copyToClipboardDescriptionText = await this.copyToClipboardDescription.getText();
    expect(copyToClipboardDescriptionText).toBe(CUSTOM_SETTINGS_SECTION.copyToClipboard.description);
    
    await this.verifyElementDisplayed(this.copyToClipboardToggleOn, 'copyToClipboardToggleOn', 'Copy to clipboard toggle on should be visible');

    // Verify Auto Logout Section
    await this.verifyElementDisplayed(this.autoLogoutTitle, 'autoLogoutTitle', 'Auto logout title should be visible');
    const autoLogoutTitleText = await this.autoLogoutTitle.getText();
    expect(autoLogoutTitleText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.title);
    
    await this.verifyElementDisplayed(this.autoLogoutDescription, 'autoLogoutDescription', 'Auto logout description should be visible');
    const autoLogoutDescriptionText = await this.autoLogoutDescription.getText();
    expect(autoLogoutDescriptionText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.description);

    // Verify Auto Logout Timeout Field
    await this.verifyElementDisplayed(this.autoLogoutTimeoutField, 'autoLogoutTimeoutField', 'Auto logout timeout field should be visible');
    await this.verifyElementDisplayed(this.autoLogoutTimeoutFieldText, 'autoLogoutTimeoutFieldText', 'Auto logout timeout field text should be visible');
    const timeoutFieldText = await this.autoLogoutTimeoutFieldText.getText();
    expect(timeoutFieldText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.thirtySeconds);
    await this.verifyElementDisplayed(this.autoLogoutTimeoutFieldIcon, 'autoLogoutTimeoutFieldIcon', 'Auto logout timeout field icon should be visible');

    return this.self;
  }

  async tapRemindersToggleOn(): Promise<this> {
    await this.remindersToggleOn.click();
    return this.self;
  }

  async tapRemindersToggleOff(): Promise<this> {
    await this.remindersToggleOff.click();
    return this.self;
  }

  async verifyRemindersToggleOffDisplayed(): Promise<this> {
    await this.verifyElementDisplayed(this.remindersToggleOff, 'remindersToggleOff', 'Reminders toggle off should be visible');
    return this.self;
  }

  async verifyRemindersToggleOnDisplayed(): Promise<this> {
    await this.verifyElementDisplayed(this.remindersToggleOn, 'remindersToggleOn', 'Reminders toggle on should be visible');
    return this.self;
  }

  async tapCopyToClipboardToggleOn(): Promise<this> {
    await this.copyToClipboardToggleOn.click();
    return this.self;
  }

  async tapCopyToClipboardToggleOff(): Promise<this> {
    await this.copyToClipboardToggleOff.click();
    return this.self;
  }

  async verifyCopyToClipboardToggleOffDisplayed(): Promise<this> {
    await this.verifyElementDisplayed(this.copyToClipboardToggleOff, 'copyToClipboardToggleOff', 'Copy to clipboard toggle off should be visible');
    return this.self;
  }

  async verifyCopyToClipboardToggleOnDisplayed(): Promise<this> {
    await this.verifyElementDisplayed(this.copyToClipboardToggleOn, 'copyToClipboardToggleOn', 'Copy to clipboard toggle on should be visible');
    return this.self;
  }

  async tapAutoLogoutTimeoutField(): Promise<this> {
    await this.autoLogoutTimeoutField.click();
    return this.self;
  }

  async tapAutoLogoutTimeoutFieldNever(): Promise<this> {
    await this.autoLogoutTimeoutFieldNever.click();
    return this.self;
  }

  async verifyAutoLogoutTimeoutFieldDropdownDisplayed(): Promise<this> {
    await this.autoLogoutTimeoutFieldDropdown.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.autoLogoutTimeoutFieldDropdown, 'autoLogoutTimeoutFieldDropdown', 'Auto logout timeout field dropdown should be visible');
    return this.self;
  }

  async verifyThirtySecondsRadioButtonSelected(): Promise<this> {
    await this.verifyElementDisplayed(this.thirtySecondsRadioButtonChoose, 'thirtySecondsRadioButtonChoose', '30 seconds radio button should be selected');
    return this.self;
  }

  async tapNeverRadioButton(): Promise<this> {
    await this.neverRadioButtonUnchoose.click();
    return this.self;
  }

  async verifyNeverDisplayedInAutoLogoutTimeoutField(): Promise<this> {
    await this.verifyElementDisplayed(this.autoLogoutTimeoutFieldNever, 'autoLogoutTimeoutFieldNever', 'Auto logout timeout field with Never should be visible');
    await this.verifyElementDisplayed(this.autoLogoutTimeoutFieldNeverText, 'autoLogoutTimeoutFieldNeverText', 'Auto logout timeout field text with Never should be visible');
    const timeoutFieldText = await this.autoLogoutTimeoutFieldNeverText.getText();
    expect(timeoutFieldText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.never);
    await this.verifyElementDisplayed(this.autoLogoutTimeoutFieldNeverIcon, 'autoLogoutTimeoutFieldNeverIcon', 'Auto logout timeout field icon with Never should be visible');
    return this.self;
  }

  async verifyNeverRadioButtonSelected(): Promise<this> {
    await this.verifyElementDisplayed(this.neverRadioButtonChoose, 'neverRadioButtonChoose', 'Never radio button should be selected');
    await this.verifyElementDisplayed(this.neverRadioButtonText, 'neverRadioButtonText', 'Never radio button text should be visible');
    const radioButtonText = await this.neverRadioButtonText.getText();
    expect(radioButtonText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.never);
    return this.self;
  }

  async verifyThirtySecondsRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.thirtySecondsRadioButtonUnchoose, 'thirtySecondsRadioButtonUnchoose', '30 seconds radio button should be unselected');
    await this.verifyElementDisplayed(this.thirtySecondsRadioButtonText, 'thirtySecondsRadioButtonText', '30 seconds radio button text should be visible');
    const radioButtonText = await this.thirtySecondsRadioButtonText.getText();
    expect(radioButtonText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.thirtySeconds);
    return this.self;
  }

  async verifyOneMinuteRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.oneMinuteRadioButtonUnchoose, 'oneMinuteRadioButtonUnchoose', '1 minute radio button should be unselected');
    await this.verifyElementDisplayed(this.oneMinuteRadioButtonText, 'oneMinuteRadioButtonText', '1 minute radio button text should be visible');
    const radioButtonText = await this.oneMinuteRadioButtonText.getText();
    expect(radioButtonText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.oneMinute);
    return this.self;
  }

  async verifyFiveMinutesRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.fiveMinutesRadioButtonUnchoose, 'fiveMinutesRadioButtonUnchoose', '5 minutes radio button should be unselected');
    await this.verifyElementDisplayed(this.fiveMinutesRadioButtonText, 'fiveMinutesRadioButtonText', '5 minutes radio button text should be visible');
    const radioButtonText = await this.fiveMinutesRadioButtonText.getText();
    expect(radioButtonText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.fiveMinutes);
    return this.self;
  }

  async verifyFifteenMinutesRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.fifteenMinutesRadioButtonUnchoose, 'fifteenMinutesRadioButtonUnchoose', '15 minutes radio button should be unselected');
    await this.verifyElementDisplayed(this.fifteenMinutesRadioButtonText, 'fifteenMinutesRadioButtonText', '15 minutes radio button text should be visible');
    const radioButtonText = await this.fifteenMinutesRadioButtonText.getText();
    expect(radioButtonText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.fifteenMinutes);
    return this.self;
  }

  async verifyThirtyMinutesRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.thirtyMinutesRadioButtonUnchoose, 'thirtyMinutesRadioButtonUnchoose', '30 minutes radio button should be unselected');
    await this.verifyElementDisplayed(this.thirtyMinutesRadioButtonText, 'thirtyMinutesRadioButtonText', '30 minutes radio button text should be visible');
    const radioButtonText = await this.thirtyMinutesRadioButtonText.getText();
    expect(radioButtonText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.thirtyMinutes);
    return this.self;
  }

  async verifyOneHourRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.oneHourRadioButtonUnchoose, 'oneHourRadioButtonUnchoose', '1 hour radio button should be unselected');
    await this.verifyElementDisplayed(this.oneHourRadioButtonText, 'oneHourRadioButtonText', '1 hour radio button text should be visible');
    const radioButtonText = await this.oneHourRadioButtonText.getText();
    expect(radioButtonText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.oneHour);
    return this.self;
  }

  async verifyNeverRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.neverRadioButtonUnchoose, 'neverRadioButtonUnchoose', 'Never radio button should be unselected');
    await this.verifyElementDisplayed(this.neverRadioButtonText, 'neverRadioButtonText', 'Never radio button text should be visible');
    const radioButtonText = await this.neverRadioButtonText.getText();
    expect(radioButtonText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.never);
    return this.self;
  }

  async verifyBlindPeeringSection(): Promise<this> {
    await this.blindPeeringSection.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.blindPeeringSection, 'blindPeeringSection', 'Blind peering section should be visible');
    return this.self;
  }

  async verifyAllElementsInBlindPeeringSection(): Promise<this> {
    // Verify Section Icon
    await this.blindPeeringSectionIcon.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.blindPeeringSectionIcon, 'blindPeeringSectionIcon', 'Blind peering section icon should be visible');
    
    // Verify Section Title
    await this.verifyElementDisplayed(this.blindPeeringSectionTitle, 'blindPeeringSectionTitle', 'Blind peering section title should be visible');
    
    // Verify Section Description
    await this.verifyElementDisplayed(this.blindPeeringSectionDescription, 'blindPeeringSectionDescription', 'Blind peering section description should be visible');
    const descriptionText = await this.blindPeeringSectionDescription.getText();
    expect(descriptionText).toBe(BLIND_PEERING_SECTION.description);
    
    // Verify Section Text
    await this.verifyElementDisplayed(this.blindPeeringSectionText, 'blindPeeringSectionText', 'Blind peering section text should be visible');
    const sectionText = await this.blindPeeringSectionText.getText();
    expect(sectionText).toBe(BLIND_PEERING_SECTION.text);
    
    // Verify Learn More Button (toggle element)
    await this.verifyElementDisplayed(this.blindPeeringSectionLearnMoreButton, 'blindPeeringSectionLearnMoreButton', 'Blind peering section learn more button should be visible');
    
    // Verify Learn More Button Icon
    await this.verifyElementDisplayed(this.blindPeeringSectionLearnMoreButtonIcon, 'blindPeeringSectionLearnMoreButtonIcon', 'Blind peering section learn more button icon should be visible');
    
    // Verify Toggle
    await this.verifyElementDisplayed(this.blindPeeringSectionToggleOff, 'blindPeeringSectionToggleOff', 'Blind peering section toggle off should be visible');
    
    return this.self;
  }

  async tapBlindPeeringSectionInformationIcon(): Promise<this> {
    await this.blindPeeringSectionIcon.click();
    return this.self;
  }

  async verifyBlindPeeringSectionInformationPopupDisplayed(): Promise<this> {
    await this.blindPeeringSectionInformationPopup.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.blindPeeringSectionInformationPopup, 'blindPeeringSectionInformationPopup', 'Blind peering section information popup should be visible');
    
    // Verify Popup Title
    await this.verifyElementDisplayed(this.blindPeeringSectionInformationPopupTitle, 'blindPeeringSectionInformationPopupTitle', 'Blind peering section information popup title should be visible');
    const titleText = await this.blindPeeringSectionInformationPopupTitle.getText();
    expect(titleText).toBe(BLIND_PEERING_SECTION.informationPopup.title);
    
    // Verify Popup Description
    await this.verifyElementDisplayed(this.blindPeeringSectionInformationPopupDescription, 'blindPeeringSectionInformationPopupDescription', 'Blind peering section information popup description should be visible');
    const descriptionText = await this.blindPeeringSectionInformationPopupDescription.getText();
    expect(descriptionText).toBe(BLIND_PEERING_SECTION.informationPopup.description);
    
    // Verify Popup Text 1
    await this.verifyElementDisplayed(this.blindPeeringSectionInformationPopupText, 'blindPeeringSectionInformationPopupText', 'Blind peering section information popup text should be visible');
    const popupText1 = await this.blindPeeringSectionInformationPopupText.getText();
    expect(popupText1).toBe(BLIND_PEERING_SECTION.informationPopup.text1);
    
    // Verify Popup Text 2
    await this.verifyElementDisplayed(this.blindPeeringSectionInformationPopupText2, 'blindPeeringSectionInformationPopupText2', 'Blind peering section information popup text 2 should be visible');
    const popupText2 = await this.blindPeeringSectionInformationPopupText2.getText();
    expect(popupText2).toBe(BLIND_PEERING_SECTION.informationPopup.text2);

    // Verify Learn More Button
    await this.verifyElementDisplayed(this.blindPeeringSectionInformationPopupLearnMoreButton, 'blindPeeringSectionInformationPopupLearnMoreButton', 'Blind peering section information popup learn more button should be visible');
    await this.verifyElementDisplayed(this.blindPeeringSectionInformationPopupLearnMoreButtonIcon, 'blindPeeringSectionInformationPopupLearnMoreButtonIcon', 'Blind peering section information popup learn more button icon should be visible');
    const learnMoreButtonText = await this.blindPeeringSectionInformationPopupLearnMoreButton.getText();
    expect(learnMoreButtonText).toBe(BLIND_PEERING_SECTION.informationPopup.learnMoreButton);
    
    return this.self;
  }

  async tapBlindPeeringSectionLearnMoreButton(): Promise<this> {
    await this.blindPeeringSectionInformationPopupLearnMoreButtonLink.click();
    return this.self;
  }

  async verifyBlindPeeringSectionLearnMorePageDisplayed(): Promise<this> {
    await this.blindPeeringInformationPage.waitForDisplayed({ timeout: 15000 });
    await this.verifyElementDisplayed(this.blindPeeringInformationPage, 'blindPeeringInformationPage', 'Blind peering information page should be visible');
    
    // Verify URL contains the expected URL
    const urlText = await this.blindPeeringInformationPage.getText();
    expect(urlText).toContain(BLIND_PEERING_SECTION.learnMoreUrl);
    
    return this.self;
  }

  async tapBlindPeeringSectionToggle(): Promise<this> {
    await this.blindPeeringSectionToggleOff.click();
    return this.self;
  }

  async verifyChooseYourBlindPeerPopupDisplayed(): Promise<this> {
    await this.chooseBlindPeeringPopup.waitForDisplayed({ timeout: 10000 });
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopup, 'chooseBlindPeeringPopup', 'Choose your Blind Peer popup should be visible');
    return this.self;
  }

  async verifyChooseYourBlindPeerPopupElements(): Promise<this> {
    // Verify Popup Title
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupTitle, 'chooseBlindPeeringPopupTitle', 'Choose your Blind Peer popup title should be visible');
    const titleText = await this.chooseBlindPeeringPopupTitle.getText();
    expect(titleText).toBe(BLIND_PEERING_SECTION.chooseBlindPeerPopup.title);
    
    // Verify Automatic Blind Peers Radio Button
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonChoose, 'chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonChoose', 'Automatic Blind Peers radio button should be visible');
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonText, 'chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonText', 'Automatic Blind Peers radio button text should be visible');
    const automaticText = await this.chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonText.getText();
    expect(automaticText).toBe(BLIND_PEERING_SECTION.chooseBlindPeerPopup.options.automatic);
    
    // Verify Manual Blind Peers Radio Button
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupManualBlindPeersRadioButtonText, 'chooseBlindPeeringPopupManualBlindPeersRadioButtonText', 'Manual Blind Peers radio button text should be visible');
    const manualText = await this.chooseBlindPeeringPopupManualBlindPeersRadioButtonText.getText();
    expect(manualText).toBe(BLIND_PEERING_SECTION.chooseBlindPeerPopup.options.manual);
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupManualBlindPeersRadioButtonUnchoose, 'chooseBlindPeeringPopupManualBlindPeersRadioButtonUnchoose', 'Manual Blind Peers radio button unchoose should be visible');
    
    // Verify Confirm Button
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupConfirmButton, 'chooseBlindPeeringPopupConfirmButton', 'Confirm button should be visible');
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupConfirmButtonText, 'chooseBlindPeeringPopupConfirmButtonText', 'Confirm button text should be visible');
    const confirmButtonText = await this.chooseBlindPeeringPopupConfirmButtonText.getText();
    expect(confirmButtonText).toBe(BLIND_PEERING_SECTION.chooseBlindPeerPopup.buttons.confirm);
    
    // Verify Cancel Button
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupCancelButton, 'chooseBlindPeeringPopupCancelButton', 'Cancel button should be visible');
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupCancelButtonText, 'chooseBlindPeeringPopupCancelButtonText', 'Cancel button text should be visible');
    const cancelButtonText = await this.chooseBlindPeeringPopupCancelButtonText.getText();
    expect(cancelButtonText).toBe(BLIND_PEERING_SECTION.chooseBlindPeerPopup.buttons.cancel);
    
    return this.self;
  }

  async tapChooseYourBlindPeerPopupCancelButton(): Promise<this> {
    await this.chooseBlindPeeringPopupCancelButton.click();
    return this.self;
  }

  async verifyChooseYourBlindPeerPopupNotDisplayed(): Promise<this> {
    const isDisplayed = await this.chooseBlindPeeringPopup.isDisplayed().catch(() => false);
    if (isDisplayed) {
      throw new Error('Choose your Blind Peer popup should not be displayed');
    }
    return this.self;
  }

  async verifyAutomaticBlindPeersRadioButtonSelected(): Promise<this> {
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonChoose, 'chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonChoose', 'Automatic Blind Peers radio button should be selected');
    return this.self;
  }

  async tapManualBlindPeersRadioButton(): Promise<this> {
    await this.chooseBlindPeeringPopupManualBlindPeersRadioButtonUnchoose.click();
    return this.self;
  }

  async verifyManualBlindPeersRadioButtonSelected(): Promise<this> {
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupManualBlindPeersRadioButtonChoose, 'chooseBlindPeeringPopupManualBlindPeersRadioButtonChoose', 'Manual Blind Peers radio button should be selected');
    return this.self;
  }

  async verifyAutomaticBlindPeersRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonUnchoose, 'chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonUnchoose', 'Automatic Blind Peers radio button should be unselected');
    return this.self;
  }

  async tapChooseYourBlindPeerPopupConfirmButton(): Promise<this> {
    await this.chooseBlindPeeringPopupConfirmButton.click();
    return this.self;
  }

  async verifyAutomaticBlindPeersToastDisplayed(): Promise<this> {
    await this.automaticBlindPeersToast.waitForDisplayed({ timeout: 10000 });
    await this.verifyElementDisplayed(this.automaticBlindPeersToast, 'automaticBlindPeersToast', 'Automatic Blind Peers toast should be visible');
    
    await this.verifyElementDisplayed(this.automaticBlindPeersToastText, 'automaticBlindPeersToastText', 'Automatic Blind Peers toast text should be visible');
    const toastText = await this.automaticBlindPeersToastText.getText();
    expect(toastText).toBe(BLIND_PEERING_SECTION.toastMessages.automaticEnabled);
    
    return this.self;
  }

  async verifyAllNewElementsInYourBlindPeersSection(): Promise<this> {
    // Verify Your Blind Peers Text
    await this.yourBlindPeersText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Your Blind Peers text not visible' });
    await this.verifyElementDisplayed(this.yourBlindPeersText, 'yourBlindPeersText', 'Your Blind Peers text should be visible');
    const yourBlindPeersTextValue = await this.yourBlindPeersText.getText();
    expect(yourBlindPeersTextValue).toBe(BLIND_PEERING_SECTION.yourBlindPeers.text);
    
    // Verify Your Blind Peers Field
    await this.verifyElementDisplayed(this.yourBlindPeersField, 'yourBlindPeersField', 'Your Blind Peers field should be visible');
    
    // Verify Our Blind Peers Field Text
    await this.verifyElementDisplayed(this.ourBlindPeersFieldText, 'ourBlindPeersFieldText', 'Our Blind Peers field text should be visible');
    const ourBlindPeersFieldTextValue = await this.ourBlindPeersFieldText.getText();
    expect(ourBlindPeersFieldTextValue).toBe(BLIND_PEERING_SECTION.yourBlindPeers.fieldText);
    
    // Verify Our Blind Peers Field Icon
    await this.verifyElementDisplayed(this.ourBlindPeersFieldIcon, 'ourBlindPeersFieldIcon', 'Our Blind Peers field icon should be visible');
    
    // Verify Our Blind Peers Field Status
    await this.verifyElementDisplayed(this.ourBlindPeersFieldStatus, 'ourBlindPeersFieldStatus', 'Our Blind Peers field status should be visible');
    const ourBlindPeersFieldStatusValue = await this.ourBlindPeersFieldStatus.getText();
    expect(ourBlindPeersFieldStatusValue).toBe(BLIND_PEERING_SECTION.yourBlindPeers.status);
    
    // Verify Edit Button
    await this.verifyElementDisplayed(this.editBlindPeersButton, 'editBlindPeersButton', 'Edit Blind Peers button should be visible');
    
    // Verify Edit Button Text
    await this.verifyElementDisplayed(this.editBlindPeersButtonText, 'editBlindPeersButtonText', 'Edit Blind Peers button text should be visible');
    const editButtonText = await this.editBlindPeersButtonText.getText();
    expect(editButtonText).toBe(BLIND_PEERING_SECTION.editButton);
    
    // Verify Edit Button Icon
    await this.verifyElementDisplayed(this.editBlindPeersButtonIcon, 'editBlindPeersButtonIcon', 'Edit Blind Peers button icon should be visible');
    
    return this.self;
  }

  async tapEditBlindPeersButton(): Promise<this> {
    await this.editBlindPeersButton.click();
    return this.self;
  }

  async verifyManualBlindPeersPopupDisplayed(): Promise<this> {
    await this.manualBlindPeersPopup.waitForDisplayed({ timeout: 10000 });
    await this.verifyElementDisplayed(this.manualBlindPeersPopup, 'manualBlindPeersPopup', 'Manual Blind Peers popup should be visible');
    return this.self;
  }

  async verifyManualBlindPeersPopupElements(): Promise<this> {
    const popupWaitOpts = { timeout: 5000, timeoutMsg: 'Manual Blind Peers popup element not visible' };

    // Verify Popup Title
    await this.manualBlindPeersPopupTitle.waitForDisplayed(popupWaitOpts);
    await this.verifyElementDisplayed(this.manualBlindPeersPopupTitle, 'manualBlindPeersPopupTitle', 'Manual Blind Peers popup title should be visible');
    const titleText = await this.manualBlindPeersPopupTitle.getText();
    expect(titleText).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.title);

    // Verify Back Button
    await this.manualBlindPeersPopupBackButton.waitForDisplayed(popupWaitOpts);
    await this.verifyElementDisplayed(this.manualBlindPeersPopupBackButton, 'manualBlindPeersPopupBackButton', 'Manual Blind Peers popup back button should be visible');

    // Verify Blind Peer 1 Text
    await this.oneBlinPeerText.waitForDisplayed(popupWaitOpts);
    await this.verifyElementDisplayed(this.oneBlinPeerText, 'oneBlinPeerText', 'Blind Peer 1 text should be visible');
    const blindPeer1Text = await this.oneBlinPeerText.getText();
    expect(blindPeer1Text).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.blindPeer1);

    // Verify Input Field
    await this.addHereYourCodeField.waitForDisplayed(popupWaitOpts);
    await this.verifyElementDisplayed(this.addHereYourCodeField, 'addHereYourCodeField', 'Add here your code field should be visible');
    const inputFieldPlaceholder = await this.addHereYourCodeField.getAttribute('text') || await this.addHereYourCodeField.getAttribute('hint');
    expect(inputFieldPlaceholder).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.inputFieldPlaceholder);

    // Verify Add Peer Button
    await this.addPeerButton.waitForDisplayed(popupWaitOpts);
    await this.verifyElementDisplayed(this.addPeerButton, 'addPeerButton', 'Add Peer button should be visible');

    // Verify Add Peer Button Text
    await this.addPeerButtonText.waitForDisplayed(popupWaitOpts);
    await this.verifyElementDisplayed(this.addPeerButtonText, 'addPeerButtonText', 'Add Peer button text should be visible');
    const addPeerButtonTextValue = await this.addPeerButtonText.getText();
    expect(addPeerButtonTextValue).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.buttons.addPeer);

    // Verify Add Peer Button Icon
    await this.addPeerButtonIcon.waitForDisplayed(popupWaitOpts);
    await this.verifyElementDisplayed(this.addPeerButtonIcon, 'addPeerButtonIcon', 'Add Peer button icon should be visible');

    // Verify Confirm Button
    await this.manualBlindPeersPopupConfirmButton.waitForDisplayed(popupWaitOpts);
    await this.verifyElementDisplayed(this.manualBlindPeersPopupConfirmButton, 'manualBlindPeersPopupConfirmButton', 'Confirm button should be visible');

    // Verify Confirm Button Text
    await this.manualBlindPeersPopupConfirmButtonText.waitForDisplayed(popupWaitOpts);
    await this.verifyElementDisplayed(this.manualBlindPeersPopupConfirmButtonText, 'manualBlindPeersPopupConfirmButtonText', 'Confirm button text should be visible');
    const confirmButtonText = await this.manualBlindPeersPopupConfirmButtonText.getText();
    expect(confirmButtonText).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.buttons.confirm);

    // Verify Cancel Button
    await this.manualBlindPeersPopupCancelButton.waitForDisplayed(popupWaitOpts);
    await this.verifyElementDisplayed(this.manualBlindPeersPopupCancelButton, 'manualBlindPeersPopupCancelButton', 'Cancel button should be visible');

    // Verify Cancel Button Text
    await this.manualBlindPeersPopupCancelButtonText.waitForDisplayed(popupWaitOpts);
    await this.verifyElementDisplayed(this.manualBlindPeersPopupCancelButtonText, 'manualBlindPeersPopupCancelButtonText', 'Cancel button text should be visible');
    const cancelButtonText = await this.manualBlindPeersPopupCancelButtonText.getText();
    expect(cancelButtonText).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.buttons.cancel);

    return this.self;
  }

  async tapAddPeerButton(): Promise<this> {
    await this.addPeerButton.click();
    return this.self;
  }

  async verifyTwoBlinPeersElementsDisplayed(): Promise<this> {
    // Verify Blind Peer 2 Text
    await this.verifyElementDisplayed(this.twoBlinPeerText, 'twoBlinPeerText', 'Blind Peer 2 text should be visible');
    const blindPeer2Text = await this.twoBlinPeerText.getText();
    expect(blindPeer2Text).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.blindPeer2);
    
    // Verify Input Field for Blind Peer 2
    await this.verifyElementDisplayed(this.twoBlinPeerAddHereYourCodeField, 'twoBlinPeerAddHereYourCodeField', 'Add here your code field for Blind Peer 2 should be visible');
    const inputFieldPlaceholder2 = await this.twoBlinPeerAddHereYourCodeField.getAttribute('text') || await this.twoBlinPeerAddHereYourCodeField.getAttribute('hint');
    expect(inputFieldPlaceholder2).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.inputFieldPlaceholder);
    
    // Verify Remove Peer Button
    await this.verifyElementDisplayed(this.removePeerButton, 'removePeerButton', 'Remove Peer button should be visible');
    
    // Verify Remove Peer Button Text
    await this.verifyElementDisplayed(this.removePeerButtonText, 'removePeerButtonText', 'Remove Peer button text should be visible');
    const removePeerButtonTextValue = await this.removePeerButtonText.getText();
    expect(removePeerButtonTextValue).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.buttons.removePeer);
    
    // Verify Remove Peer Button Icon
    await this.verifyElementDisplayed(this.removePeerButtonIcon, 'removePeerButtonIcon', 'Remove Peer button icon should be visible');
    
    return this.self;
  }

  async tapRemovePeerButton(): Promise<this> {
    await this.removePeerButton.click();
    return this.self;
  }

  async verifyTwoBlinPeersElementsIsNotDisplayed(): Promise<this> {
    const isDisplayed = await this.twoBlinPeerText.isDisplayed().catch(() => false);
    if (isDisplayed) {
      throw new Error('Two Blind Peers elements should not be displayed');
    }
    return this.self;
  }

  async tapManualBlindPeersPopupConfirmButton(): Promise<this> {
    await this.manualBlindPeersPopupConfirmButton.click();
    return this.self;
  }

  async verifyAutofillSection(): Promise<this> {
    await this.verifyElementDisplayed(this.autoFillSection, 'autoFillSection', 'Autofill section should be visible');
    return this.self;
  }

  async verifyAllElementsInAutofillSection(): Promise<this> {
    // Verify Section Title
    await this.verifyElementDisplayed(this.autoFillSectionTitle, 'autoFillSectionTitle', 'Autofill section title should be visible');
    const titleText = await this.autoFillSectionTitle.getText();
    expect(titleText).toBe(AUTOFILL_SECTION.title);
    
    // Verify Section Description
    await this.verifyElementDisplayed(this.autoFillSectionDescription, 'autoFillSectionDescription', 'Autofill section description should be visible');
    const descriptionText = await this.autoFillSectionDescription.getText();
    expect(descriptionText).toBe(AUTOFILL_SECTION.description);
    
    // Verify Set as Default Button
    await this.verifyElementDisplayed(this.setAsDefaultButton, 'setAsDefaultButton', 'Set as Default button should be visible');
    
    // Verify Set as Default Button Text
    await this.verifyElementDisplayed(this.setAsDefaultButtonText, 'setAsDefaultButtonText', 'Set as Default button text should be visible');
    const setAsDefaultButtonTextValue = await this.setAsDefaultButtonText.getText();
    expect(setAsDefaultButtonTextValue).toBe(AUTOFILL_SECTION.setAsDefaultButton);
    
    // Verify Set as Default Button Icon
    await this.verifyElementDisplayed(this.setAsDefaultButtonIcon, 'setAsDefaultButtonIcon', 'Set as Default button icon should be visible');
    
    return this.self;
  }

  async tapSetAsDefaultButton(): Promise<this> {
    await this.setAsDefaultButton.click();
    return this.self;
  }

  async verifyAutofillPopupDisplayed(): Promise<this> {
    await this.autoFIllServicesToolbar.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.autoFIllServicesToolbar, 'autoFIllServicesToolbar', 'Autofill services toolbar should be visible');
    return this.self;
  }

  async verifyPearPassAppRadioButtonDisplayed(): Promise<this> {
    // Verify Radio Button
    await this.verifyElementDisplayed(this.autoFIllServicesPearPassRadioButton, 'autoFIllServicesPearPassRadioButton', 'PearPass app radio button should be visible');
    
    // Verify Radio Button Text
    await this.verifyElementDisplayed(this.autoFIllServicesPearPassRadioButtonText, 'autoFIllServicesPearPassRadioButtonText', 'PearPass app radio button text should be visible');
    const radioButtonText = await this.autoFIllServicesPearPassRadioButtonText.getText();
    expect(radioButtonText).toBe(AUTOFILL_SECTION.autofillService.pearPassAppName);
    
    // Verify Radio Button Icon
    await this.verifyElementDisplayed(this.autoFIllServicesPearPassRadioButtonIcon, 'autoFIllServicesPearPassRadioButtonIcon', 'PearPass app radio button icon should be visible');
    
    return this.self;
  }

  async tapPearPassAppRadioButton(): Promise<this> {
    await this.autoFIllServicesPearPassRadioButton.click();
    return this.self;
  }

  async verifyAutofillPopupTextDisplayed(): Promise<this> {
    // Verify Autofill Popup
    await this.verifyElementDisplayed(this.autofillPopup, 'autofillPopup', 'Autofill popup should be visible');
    
    // Verify Autofill Popup Text
    await this.verifyElementDisplayed(this.autofillPopupText, 'autofillPopupText', 'Autofill popup text should be visible');
    const popupText = await this.autofillPopupText.getText();
    expect(popupText).toBe(AUTOFILL_SECTION.autofillPopup.text);
    
    // Verify Autofill Popup OK Button
    await this.verifyElementDisplayed(this.autofillPopupOkButton, 'autofillPopupOkButton', 'Autofill popup OK button should be visible');
    
    // Verify Autofill Popup Cancel Button
    await this.verifyElementDisplayed(this.autofillPopupCancelButton, 'autofillPopupCancelButton', 'Autofill popup Cancel button should be visible');
    
    return this.self;
  }

  async tapAutofillPopupOkButton(): Promise<this> {
    await this.autofillPopupOkButton.click();
    return this.self;
  }

  async verifyNewElementsInAutofillSection(): Promise<this> {
    // Verify Autofill New Text
    await this.verifyElementDisplayed(this.autofillNewText, 'autofillNewText', 'Autofill enabled text should be visible');
    const autofillText = await this.autofillNewText.getText();
    expect(autofillText).toBe(AUTOFILL_SECTION.autofillEnabled.text);
    
    // Verify Manage Autofill Settings Link
    await this.verifyElementDisplayed(this.autoFillNewLinkManageAutofillSettings, 'autoFillNewLinkManageAutofillSettings', 'Manage autofill settings link should be visible');
    const manageLinkText = await this.autoFillNewLinkManageAutofillSettings.getText();
    expect(manageLinkText).toBe(AUTOFILL_SECTION.autofillEnabled.manageAutofillSettingsLink);
    
    return this.self;
  }

  async tapAutoFillNewLinkManageAutofillSettings(): Promise<this> {
    await this.autoFillNewLinkManageAutofillSettings.click();
    return this.self;
  }

  async tapAutoFIllServicesBackButton(): Promise<this> {
    await this.autoFIllServicesBackButton.click();
    return this.self;
  }

  async verifyExportPage(): Promise<this> {
    await this.exportSection.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.exportSection, 'exportSection', 'Export section should be visible');
    return this.self;
  }

  async verifyNewVaultNameAtExportSection(expectedText: string): Promise<this> {
    await this.newVaultNameAtExportSection.waitForDisplayed({ timeout: 5000, timeoutMsg: 'New vault name at Export section not visible' });
    await this.verifyElementDisplayed(this.newVaultNameAtExportSection, 'newVaultNameAtExportSection', 'First vault name at Export section should be visible');
    const displayedText = await this.newVaultNameAtExportSection.getText();
    expect(displayedText).toBe(expectedText);
    return this.self;
  }

  async verifyAllElementsInExportPage(): Promise<this> {
    // Verify Export Section Title
    await this.verifyElementDisplayed(this.exportSectionTitle, 'exportSectionTitle', 'Export section title should be visible');
    const titleText = await this.exportSectionTitle.getText();
    expect(titleText).toBe(EXPORT_SECTION.title);

    // Verify Vault 1
    await this.verifyElementDisplayed(this.vaults1, 'vaults1', 'Vault 1 should be visible');
    await this.verifyElementDisplayed(this.vaults1Icon, 'vaults1Icon', 'Vault 1 icon should be visible');
    await this.verifyElementDisplayed(this.vaults1Text, 'vaults1Text', 'Vault 1 text should be visible');
    const vault1Text = await this.vaults1Text.getText();
    expect(vault1Text).toBe(EXPORT_SECTION.vaults.vault1.nameAfterChange);
    await this.verifyElementDisplayed(this.vaults1Date, 'vaults1Date', 'Vault 1 date should be visible');
    const vault1Date = await this.vaults1Date.getText();
    expect(vault1Date).toBe(EXPORT_SECTION.vaults.vault1.date);

    // Verify Vault 2
    await this.verifyElementDisplayed(this.vaults2, 'vaults2', 'Vault 2 should be visible');
    await this.verifyElementDisplayed(this.vaults2Icon, 'vaults2Icon', 'Vault 2 icon should be visible');
    await this.verifyElementDisplayed(this.vaults2Text, 'vaults2Text', 'Vault 2 text should be visible');
    const vault2Text = await this.vaults2Text.getText();
    expect(vault2Text).toBe(EXPORT_SECTION.vaults.vault2.name);
    await this.verifyElementDisplayed(this.vaults2Date, 'vaults2Date', 'Vault 2 date should be visible');
    const vault2Date = await this.vaults2Date.getText();
    expect(vault2Date).toBe(EXPORT_SECTION.vaults.vault2.date);

    // Verify Export Section Text
    await this.verifyElementDisplayed(this.exportSectionText, 'exportSectionText', 'Export section text should be visible');
    const exportSectionTextValue = await this.exportSectionText.getText();
    expect(exportSectionTextValue).toBe(EXPORT_SECTION.chooseFileFormatText);

    // Verify CSV Radio Button
    await this.verifyElementDisplayed(this.csvRadioButton, 'csvRadioButton', 'CSV radio button should be visible');
    await this.verifyElementDisplayed(this.csvRadioButtonText, 'csvRadioButtonText', 'CSV radio button text should be visible');
    const csvRadioButtonTextValue = await this.csvRadioButtonText.getText();
    expect(csvRadioButtonTextValue).toBe(EXPORT_SECTION.fileFormats.csv);
    await this.verifyElementDisplayed(this.csvRadioButtonUnchoose, 'csvRadioButtonUnchoose', 'CSV radio button unchoose should be visible');

    // Verify JSON Radio Button
    await this.verifyElementDisplayed(this.jsonRadioButton, 'jsonRadioButton', 'JSON radio button should be visible');
    await this.verifyElementDisplayed(this.jsonRadioButtonText, 'jsonRadioButtonText', 'JSON radio button text should be visible');
    const jsonRadioButtonTextValue = await this.jsonRadioButtonText.getText();
    expect(jsonRadioButtonTextValue).toBe(EXPORT_SECTION.fileFormats.json);
    await this.verifyElementDisplayed(this.jsonRadioButtonUnchoose, 'jsonRadioButtonUnchoose', 'JSON radio button unchoose should be visible');
    await this.verifyElementDisplayed(this.jsonRadioButtonChoose, 'jsonRadioButtonChoose', 'JSON radio button choose should be visible');

    // Verify Export Button
    await this.verifyElementDisplayed(this.exportButton, 'exportButton', 'Export button should be visible');
    await this.verifyElementDisplayed(this.exportButtonText, 'exportButtonText', 'Export button text should be visible');
    const exportButtonTextValue = await this.exportButtonText.getText();
    expect(exportButtonTextValue).toBe(EXPORT_SECTION.exportButton);

    return this.self;
  }

  async verifyJSONRadioButtonSelected(): Promise<this> {
    await this.verifyElementDisplayed(this.jsonRadioButtonChoose, 'jsonRadioButtonChoose', 'JSON radio button should be selected');
    return this.self;
  }

  async tapCSVRadioButton(): Promise<this> {
    await this.csvRadioButton.click();
    return this.self;
  }

  async verifyCSVRadioButtonSelected(): Promise<this> {
    await this.verifyElementDisplayed(this.csvRadioButtonChoose, 'csvRadioButtonChoose', 'CSV radio button should be selected');
    return this.self;
  }

  async verifyJSONRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.jsonRadioButtonUnchoose, 'jsonRadioButtonUnchoose', 'JSON radio button should be unselected');
    return this.self;
  }

  async tapJSONRadioButton(): Promise<this> {
    await this.jsonRadioButton.click();
    return this.self;
  }

  async verifyCSVRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.csvRadioButtonUnchoose, 'csvRadioButtonUnchoose', 'CSV radio button should be unselected');
    return this.self;
  }

  async verifyExportButtonNotClickable(): Promise<this> {
    await this.expectClickable('exportButton', false);
    return this.self;
  }

  async tapVaults1(): Promise<this> {
    await this.vaults1.click();
    return this.self;
  }

  async vaults1ChooseIconAppear(): Promise<this> {
    await this.verifyElementDisplayed(this.vault1ChooseIcon, 'vault1ChooseIcon', 'Vault 1 choose icon should be visible');
    await this.verifyElementDisplayed(this.vault1ChooseIcon1, 'vault1ChooseIcon1', 'Vault 1 choose icon 1 should be visible');
    return this.self;
  }

  async verifyExportButtonClickable(): Promise<this> {
    await this.expectClickable('exportButton', true);
    return this.self;
  }

  async tapExportButton(): Promise<this> {
    await this.exportButton.click();
    return this.self;
  }

  async verifyExportVaultsPopupDisplayed(): Promise<this> {
    await this.exportVaultsPopup.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.exportVaultsPopup, 'exportVaultsPopup', 'Export Vaults popup should be visible');
    return this.self;
  }

  async verifyAllExportVaultsPopupElementsShouldBeDisplayed(): Promise<this> {
    // Verify Popup Title
    await this.verifyElementDisplayed(this.exportVaultsPopupTitle, 'exportVaultsPopupTitle', 'Export Vaults popup title should be visible');
    const titleText = await this.exportVaultsPopupTitle.getText();
    expect(titleText).toBe(EXPORT_SECTION.popup.title);

    // Verify Popup Text
    await this.verifyElementDisplayed(this.exportVaultsPopupText, 'exportVaultsPopupText', 'Export Vaults popup text should be visible');
    const popupText = await this.exportVaultsPopupText.getText();
    expect(popupText).toBe(EXPORT_SECTION.popup.description);

    // Verify Input Field
    await this.verifyElementDisplayed(this.exportVaultsPopupField, 'exportVaultsPopupField', 'Export Vaults popup field should be visible');
    await this.verifyElementDisplayed(this.exportVaultsPopupFieldIcon, 'exportVaultsPopupFieldIcon', 'Export Vaults popup field icon should be visible');
    await this.verifyElementDisplayed(this.exportVaultsPopupFieldShowPasswordIcon, 'exportVaultsPopupFieldShowPasswordIcon', 'Export Vaults popup field show password icon should be visible');
    await this.verifyElementDisplayed(this.exportVaultsPopupFieldShowPasswordIcon1, 'exportVaultsPopupFieldShowPasswordIcon1', 'Export Vaults popup field show password icon 1 should be visible');
    await this.verifyElementDisplayed(this.exportVaultsPopupInputField, 'exportVaultsPopupInputField', 'Export Vaults popup input field should be visible');
    const inputFieldPlaceholder = await this.exportVaultsPopupInputField.getAttribute('text') || await this.exportVaultsPopupInputField.getAttribute('hint');
    expect(inputFieldPlaceholder).toBe(EXPORT_SECTION.popup.inputFieldPlaceholder);

    // Verify Export Button
    await this.verifyElementDisplayed(this.exportVaultsPopupExportButton, 'exportVaultsPopupExportButton', 'Export Vaults popup export button should be visible');
    await this.verifyElementDisplayed(this.exportVaultsPopupExportButtonText, 'exportVaultsPopupExportButtonText', 'Export Vaults popup export button text should be visible');
    const exportButtonText = await this.exportVaultsPopupExportButtonText.getText();
    expect(exportButtonText).toBe(EXPORT_SECTION.popup.buttons.export);

    // Verify Cancel Button
    await this.verifyElementDisplayed(this.exportVaultsPopupCancelButton, 'exportVaultsPopupCancelButton', 'Export Vaults popup cancel button should be visible');
    await this.verifyElementDisplayed(this.exportVaultsPopupCancelButtonText, 'exportVaultsPopupCancelButtonText', 'Export Vaults popup cancel button text should be visible');
    const cancelButtonText = await this.exportVaultsPopupCancelButtonText.getText();
    expect(cancelButtonText).toBe(EXPORT_SECTION.popup.buttons.cancel);

    return this.self;
  }

  async tapExportVaultsPopupCancelButton(): Promise<this> {
    await this.exportVaultsPopupCancelButton.click();
    return this.self;
  }

  async verifyExportVaultsPopupNotDisplayed(): Promise<this> {
    const isDisplayed = await this.exportVaultsPopup.isDisplayed().catch(() => false);
    if (isDisplayed) {
      throw new Error('Export Vaults popup should not be displayed');
    }
    return this.self;
  }

  async verifyExportVaultsPopupExportButtonNotClickable(): Promise<this> {
    await this.expectClickable('exportVaultsPopupExportButton', false);
    return this.self;
  }

  async verifyExportVaultsPopupExportButtonClickable(): Promise<this> {
    await this.expectClickable('exportVaultsPopupExportButton', true);
    return this.self;
  }

  async enterMasterPassword(password: string): Promise<this> {
    await this.exportVaultsPopupInputField.setValue(password);
    return this.self;
  }

  async tapExportVaultsPopupFieldShowPasswordIcon(): Promise<this> {
    await this.exportVaultsPopupFieldShowPasswordIcon.click();
    return this.self;
  }

  async verifyExportVaultsPopupInputField(expectedText: string): Promise<this> {
    const actualText = await this.exportVaultsPopupInputField.getText();
    expect(actualText).toBe(expectedText);
    return this.self;
  }

  async tapExportVaultsPopupExportButton(): Promise<this> {
    await this.exportVaultsPopupExportButton.click();
    return this.self;
  }

  async verifyInValidPasswordWarningIconDisplayed(): Promise<this> {
    await this.exportVaultsInValidPasswordWarningIcon.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.exportVaultsInValidPasswordWarningIcon, 'exportVaultsInValidPasswordWarningIcon', 'Invalid password warning icon should be visible');
    await this.verifyElementDisplayed(this.exportVaultsInValidPasswordWarningText, 'exportVaultsInValidPasswordWarningText', 'Invalid password warning text should be visible');
    const warningText = await this.exportVaultsInValidPasswordWarningText.getText();
    expect(warningText).toBe(EXPORT_SECTION.popup.invalidPasswordWarning);
    return this.self;
  }

  async verifyVaultsSavedMessageDisplayed(): Promise<this> {
    await this.vaultsSavedMessage.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.vaultsSavedMessage, 'vaultsSavedMessage', 'Vaults saved message should be visible');
    return this.self;
  }

  async verifyToastMessageDisplayed(): Promise<this> {
    await this.exportSuccessToast.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.exportSuccessToast, 'exportSuccessToast', 'Export success toast should be visible');
    
    await this.verifyElementDisplayed(this.exportSuccessToastTitle, 'exportSuccessToastTitle', 'Export success toast title should be visible');
    const toastTitle = await this.exportSuccessToastTitle.getText();
    expect(toastTitle).toBe(EXPORT_SECTION.successToast.title);
    
    await this.verifyElementDisplayed(this.exportSuccessToastText, 'exportSuccessToastText', 'Export success toast text should be visible');
    const toastText = await this.exportSuccessToastText.getText();
    expect(toastText).toBe(EXPORT_SECTION.successToast.text);
    
    return this.self;
  }

  async verifyVaultsPage(): Promise<this> {
    await this.manageVaultsSection.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.manageVaultsSection, 'manageVaultsSection', 'Manage Vaults section should be visible');
    
    await this.verifyElementDisplayed(this.manageVaultsSectionTitle, 'manageVaultsSectionTitle', 'Manage Vaults section title should be visible');
    const titleText = await this.manageVaultsSectionTitle.getText();
    expect(titleText).toBe(VAULTS_SECTION.manageVaultsTitle);
    
    return this.self;
  }

  async verifyManageVaultsSections(): Promise<this> {
    // Verify First Item
    await this.verifyElementDisplayed(this.manageVaultsSectionItem, 'manageVaultsSectionItem', 'First vault item should be visible');
    await this.verifyElementDisplayed(this.manageVaultsSectionItemIcon, 'manageVaultsSectionItemIcon', 'First vault item icon should be visible');
    await this.verifyElementDisplayed(this.manageVaultsSectionItemEditIcon, 'manageVaultsSectionItemEditIcon', 'First vault item edit icon should be visible');
    
    await this.verifyElementDisplayed(this.manageVaultsSectionItemText, 'manageVaultsSectionItemText', 'First vault item text should be visible');
    const firstItemText = await this.manageVaultsSectionItemText.getText();
    expect(firstItemText).toBe(VAULTS_SECTION.firstItem.name);
    
    await this.verifyElementDisplayed(this.manageVaultsSectionItemDate, 'manageVaultsSectionItemDate', 'First vault item date should be visible');
    const firstItemDate = await this.manageVaultsSectionItemDate.getText();
    expect(firstItemDate).toBe(VAULTS_SECTION.firstItem.date);
    
    // Verify Second Item
    await this.verifyElementDisplayed(this.manageVaultsSectionSecondItem, 'manageVaultsSectionSecondItem', 'Second vault item should be visible');
    await this.verifyElementDisplayed(this.manageVaultsSectionSecondItemIcon, 'manageVaultsSectionSecondItemIcon', 'Second vault item icon should be visible');
    await this.verifyElementDisplayed(this.manageVaultsSectionSecondItemEditIcon, 'manageVaultsSectionSecondItemEditIcon', 'Second vault item edit icon should be visible');
    
    await this.verifyElementDisplayed(this.manageVaultsSectionSecondItemText, 'manageVaultsSectionSecondItemText', 'Second vault item text should be visible');
    const secondItemText = await this.manageVaultsSectionSecondItemText.getText();
    expect(secondItemText).toBe(VAULTS_SECTION.secondItem.name);
    
    await this.verifyElementDisplayed(this.manageVaultsSectionSecondItemDate, 'manageVaultsSectionSecondItemDate', 'Second vault item date should be visible');
    const secondItemDate = await this.manageVaultsSectionSecondItemDate.getText();
    expect(secondItemDate).toBe(VAULTS_SECTION.secondItem.date);
    
    return this.self;
  }

  async tapManageVaultsSectionItemEditIcon(): Promise<this> {
    await this.manageVaultsSectionItemEditIcon.click();
    return this.self;
  }

  async verifyManageVaultsSectionFirstItemText(expectedText: string): Promise<this> {
    await this.newVaultNameAtVaultsSection.waitForDisplayed({ timeout: 5000, timeoutMsg: 'First vault item text (new vault name) not visible' });
    await this.verifyElementDisplayed(this.newVaultNameAtVaultsSection, 'newVaultNameAtVaultsSection', 'First vault item text should be visible');
    const displayedText = await this.newVaultNameAtVaultsSection.getText();
    expect(displayedText).toBe(expectedText);
    return this.self;
  }

  async verifyChangeVaultNamePopup(): Promise<this> {
    await this.changeVaultNamePopUp.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.changeVaultNamePopUp, 'changeVaultNamePopUp', 'Change Vault Name popup should be visible');
    
    await this.verifyElementDisplayed(this.changeVaultNamePopUpTitle, 'changeVaultNamePopUpTitle', 'Change Vault Name popup title should be visible');
    const titleText = await this.changeVaultNamePopUpTitle.getText();
    expect(titleText).toBe(CHANGE_VAULT_NAME_POPUP.title);
    
    return this.self;
  }

  async verifyChangeVaultNamePopupButton(): Promise<this> {
    await this.verifyElementDisplayed(this.changeVaultNamePopUpButton, 'changeVaultNamePopUpButton', 'Change vault name button should be visible');
    await this.verifyElementDisplayed(this.changeVaultNamePopUpButtonText, 'changeVaultNamePopUpButtonText', 'Change vault name button text should be visible');
    
    const buttonText = await this.changeVaultNamePopUpButtonText.getText();
    expect(buttonText).toBe(CHANGE_VAULT_NAME_POPUP.changeVaultNameButton);
    
    return this.self;
  }

  async tapChangeVaultNamePopUpButton(): Promise<this> {
    await this.changeVaultNamePopUpButton.click();
    return this.self;
  }

  async verifyChangeVaultNamePopupWindow(): Promise<this> {
    await this.changeVaultNamePopUpWindow.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.changeVaultNamePopUpWindow, 'changeVaultNamePopUpWindow', 'Change Vault Name popup window should be visible');
    
    return this.self;
  }

  async verifyChangeVaultNamePopupWindowElements(): Promise<this> {
    // Verify Window Title
    await this.verifyElementDisplayed(this.changeVaultNamePopUpWindowTitle, 'changeVaultNamePopUpWindowTitle', 'Change Vault Name window title should be visible');
    const windowTitleText = await this.changeVaultNamePopUpWindowTitle.getText();
    expect(windowTitleText).toBe(CHANGE_VAULT_NAME_POPUP.windowTitle);
    
    // Verify Input Field Name
    await this.verifyElementDisplayed(this.changeVaultNamePopUpWindowInputFieldName, 'changeVaultNamePopUpWindowInputFieldName', 'Input field name label should be visible');
    const inputFieldNameText = await this.changeVaultNamePopUpWindowInputFieldName.getText();
    expect(inputFieldNameText).toBe(CHANGE_VAULT_NAME_POPUP.inputFieldLabel);
    
    // Verify Input Field
    await this.verifyElementDisplayed(this.changeVaultNamePopUpWindowInputField, 'changeVaultNamePopUpWindowInputField', 'Input field should be visible');
    
    // Verify Cancel Button
    await this.verifyElementDisplayed(this.changeVaultNamePopUpWindowCancelButton, 'changeVaultNamePopUpWindowCancelButton', 'Cancel button should be visible');
    await this.verifyElementDisplayed(this.changeVaultNamePopUpWindowCancelButtonText, 'changeVaultNamePopUpWindowCancelButtonText', 'Cancel button text should be visible');
    const cancelButtonText = await this.changeVaultNamePopUpWindowCancelButtonText.getText();
    expect(cancelButtonText).toBe(CHANGE_VAULT_NAME_POPUP.buttons.cancel);
    
    // Verify Continue Button
    await this.verifyElementDisplayed(this.changeVaultNamePopUpWindowContinueButton, 'changeVaultNamePopUpWindowContinueButton', 'Continue button should be visible');
    await this.verifyElementDisplayed(this.changeVaultNamePopUpWindowContinueButtonText, 'changeVaultNamePopUpWindowContinueButtonText', 'Continue button text should be visible');
    const continueButtonText = await this.changeVaultNamePopUpWindowContinueButtonText.getText();
    expect(continueButtonText).toBe(CHANGE_VAULT_NAME_POPUP.buttons.continue);
    
    return this.self;
  }

  async tapChangeVaultNamePopUpWindowCancelButton(): Promise<this> {
    await this.changeVaultNamePopUpWindowCancelButton.click();
    return this.self;
  }

  async enterChangeVaultName(vaultName: string): Promise<this> {
    await this.changeVaultNamePopUpWindowInputField.click();
    await this.changeVaultNamePopUpWindowInputField.clearValue();
    await this.changeVaultNamePopUpWindowInputField.setValue(vaultName);
    return this.self;
  }

  async verifyChangeVaultNamePopupWindowInputField(expectedText: string): Promise<this> {
    const actualText = await this.changeVaultNamePopUpWindowInputField.getText();
    expect(actualText).toBe(expectedText);
    return this.self;
  }

  async tapChangeVaultNamePopUpWindowContinueButton(): Promise<this> {
    await this.changeVaultNamePopUpWindowContinueButton.click();
    return this.self;
  }

  async verifyChangeVaultNamePopupWindowNotDisplayed(): Promise<this> {
    const isDisplayed = await this.changeVaultNamePopUpWindow.isDisplayed().catch(() => false);
    if (isDisplayed) {
      throw new Error('Change Vault Name popup window should not be displayed');
    }
    return this.self;
  }

  async verifyModifyMasterPasswordPopUp(): Promise<this> {
    await this.modifyMasterPasswordPopUp.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUp, 'modifyMasterPasswordPopUp', 'Modify master password popup should be visible');
    
    // Verify popup title
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpTitle, 'modifyMasterPasswordPopUpTitle', 'Modify master password popup title should be visible');
    const popupTitleText = await this.modifyMasterPasswordPopUpTitle.getText();
    expect(popupTitleText).toBe(MODIFY_MASTER_PASSWORD_POPUP.title);
    
    // Verify Old Password Field
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpOldPasswordFieldText, 'modifyMasterPasswordPopUpOldPasswordFieldText', 'Old password field text should be visible');
    const oldPasswordFieldText = await this.modifyMasterPasswordPopUpOldPasswordFieldText.getText();
    expect(oldPasswordFieldText).toBe(MODIFY_MASTER_PASSWORD_POPUP.oldPasswordField.label);
    
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpInsertOldPasswordField, 'modifyMasterPasswordPopUpInsertOldPasswordField', 'Old password field should be visible');
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpInsertOldPasswordInput, 'modifyMasterPasswordPopUpInsertOldPasswordInput', 'Old password input should be visible');
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpInsertOldPasswordFieldIcon, 'modifyMasterPasswordPopUpInsertOldPasswordFieldIcon', 'Old password field icon should be visible');
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpInsertOldPasswordFieldToggleVisibility, 'modifyMasterPasswordPopUpInsertOldPasswordFieldToggleVisibility', 'Old password field toggle visibility should be visible');
    
    // Verify Create New Password Field
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpCreateNewPasswordFieldText, 'modifyMasterPasswordPopUpCreateNewPasswordFieldText', 'Create new password field text should be visible');
    const createNewPasswordFieldText = await this.modifyMasterPasswordPopUpCreateNewPasswordFieldText.getText();
    expect(createNewPasswordFieldText).toBe(MODIFY_MASTER_PASSWORD_POPUP.newPasswordField.label);
    
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpCreateNewPasswordField, 'modifyMasterPasswordPopUpCreateNewPasswordField', 'Create new password field should be visible');
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpCreateNewPasswordInput, 'modifyMasterPasswordPopUpCreateNewPasswordInput', 'Create new password input should be visible');
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpCreateNewPasswordFieldIcon, 'modifyMasterPasswordPopUpCreateNewPasswordFieldIcon', 'Create new password field icon should be visible');
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpCreateNewPasswordFieldToggleVisibility, 'modifyMasterPasswordPopUpCreateNewPasswordFieldToggleVisibility', 'Create new password field toggle visibility should be visible');
    
    // Verify Repeat New Password Field
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpRepeatNewPasswordFieldText, 'modifyMasterPasswordPopUpRepeatNewPasswordFieldText', 'Repeat new password field text should be visible');
    const repeatNewPasswordFieldText = await this.modifyMasterPasswordPopUpRepeatNewPasswordFieldText.getText();
    expect(repeatNewPasswordFieldText).toBe(MODIFY_MASTER_PASSWORD_POPUP.repeatNewPasswordField.label);
    
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpRepeatNewPasswordField, 'modifyMasterPasswordPopUpRepeatNewPasswordField', 'Repeat new password field should be visible');
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpRepeatNewPasswordInput, 'modifyMasterPasswordPopUpRepeatNewPasswordInput', 'Repeat new password input should be visible');
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpRepeatNewPasswordFieldIcon, 'modifyMasterPasswordPopUpRepeatNewPasswordFieldIcon', 'Repeat new password field icon should be visible');
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpRepeatNewPasswordFieldToggleVisibility, 'modifyMasterPasswordPopUpRepeatNewPasswordFieldToggleVisibility', 'Repeat new password field toggle visibility should be visible');
    
    // Verify Continue Button
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpContinueButton, 'modifyMasterPasswordPopUpContinueButton', 'Continue button should be visible');
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpContinueButtonText, 'modifyMasterPasswordPopUpContinueButtonText', 'Continue button text should be visible');
    const continueButtonText = await this.modifyMasterPasswordPopUpContinueButtonText.getText();
    expect(continueButtonText).toBe(MODIFY_MASTER_PASSWORD_POPUP.buttons.continue);
    
    // Verify Cancel Button
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpCancelButton, 'modifyMasterPasswordPopUpCancelButton', 'Cancel button should be visible');
    await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpCancelButtonText, 'modifyMasterPasswordPopUpCancelButtonText', 'Cancel button text should be visible');
    const cancelButtonText = await this.modifyMasterPasswordPopUpCancelButtonText.getText();
    expect(cancelButtonText).toBe(MODIFY_MASTER_PASSWORD_POPUP.buttons.cancel);
    
    return this.self;
  }

  async tapModifyMasterPasswordPopUpCancelButton(): Promise<this> {
    await this.modifyMasterPasswordPopUpCancelButton.click();
    return this.self;
  }

  async verifyModifyMasterPasswordPopUpNotDisplayed(): Promise<this> {
    const isDisplayed = await this.modifyMasterPasswordPopUp.isDisplayed().catch(() => false);
    if (isDisplayed) {
      throw new Error('Modify master password popup should not be displayed');
    }
    return this.self;
  }

  async enterOldPassword(password: string): Promise<this> {
    await this.modifyMasterPasswordPopUpInsertOldPasswordInput.setValue(password);
    return this.self;
  }

  async tapOldPasswordToggleVisibility(): Promise<this> {
    await this.modifyMasterPasswordPopUpInsertOldPasswordFieldToggleVisibility.click();
    return this.self;
  }

  async verifyOldPasswordText(expectedText: string): Promise<this> {
    const actualText = await this.modifyMasterPasswordPopUpInsertOldPasswordInput.getText();
    expect(actualText).toBe(expectedText);
    return this.self;
  }

  async enterCreateNewPassword(password: string): Promise<this> {
    await this.modifyMasterPasswordPopUpCreateNewPasswordInput.setValue(password);
    return this.self;
  }

  async tapCreateNewPasswordToggleVisibility(): Promise<this> {
    await this.modifyMasterPasswordPopUpCreateNewPasswordFieldToggleVisibility.click();
    return this.self;
  }

  async verifyCreateNewPasswordText(expectedText: string): Promise<this> {
    const actualText = await this.modifyMasterPasswordPopUpCreateNewPasswordInput.getText();
    expect(actualText).toBe(expectedText);
    return this.self;
  }

  async enterRepeatNewPassword(password: string): Promise<this> {
    await this.modifyMasterPasswordPopUpRepeatNewPasswordInput.setValue(password);
    return this.self;
  }

  async tapRepeatNewPasswordToggleVisibility(): Promise<this> {
    await this.modifyMasterPasswordPopUpRepeatNewPasswordFieldToggleVisibility.click();
    return this.self;
  }

  async verifyRepeatNewPasswordText(expectedText: string): Promise<this> {
    const actualText = await this.modifyMasterPasswordPopUpRepeatNewPasswordInput.getText();
    expect(actualText).toBe(expectedText);
    return this.self;
  }

  async tapModifyMasterPasswordPopUpContinueButton(): Promise<this> {
    await this.modifyMasterPasswordPopUpContinueButton.click();
    return this.self;
  }

  async verifyOldPasswordInvalidPasswordWarning(): Promise<this> {
    await this.invalidPasswordWarningIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Invalid password warning icon not visible after waiting' });
    await this.verifyElementDisplayed(this.invalidPasswordWarningIcon, 'invalidPasswordWarningIcon', 'Invalid password warning icon should be visible');
    await this.verifyElementDisplayed(this.invalidPasswordWarning, 'invalidPasswordWarning', 'Invalid password warning should be visible');
    
    const warningText = await this.invalidPasswordWarning.getText();
    expect(warningText).toBe(MODIFY_MASTER_PASSWORD_POPUP.oldPasswordField.invalidPasswordWarning);
    
    return this.self;
  }

  async verifyCreateNewPasswordIsRequiredWarning(): Promise<this> {
    await this.verifyElementDisplayed(this.passwordIsRequiredWarningIcon, 'passwordIsRequiredWarningIcon', 'Password is required warning icon should be visible');
    await this.verifyElementDisplayed(this.passwordIsRequiredWarning, 'passwordIsRequiredWarning', 'Password is required warning should be visible');
    
    const warningText = await this.passwordIsRequiredWarning.getText();
    expect(warningText).toBe(MODIFY_MASTER_PASSWORD_POPUP.newPasswordField.passwordIsRequiredWarning);
    
    return this.self;
  }

  async verifyRepeatNewPasswordIsRequiredWarning(): Promise<this> {
    await this.verifyElementDisplayed(this.passwordIsRequiredWarning2Icon, 'passwordIsRequiredWarning2Icon', 'Password is required warning 2 icon should be visible');
    await this.verifyElementDisplayed(this.passwordIsRequiredWarning2, 'passwordIsRequiredWarning2', 'Password is required warning 2 should be visible');
    
    const warningText = await this.passwordIsRequiredWarning2.getText();
    expect(warningText).toBe(MODIFY_MASTER_PASSWORD_POPUP.repeatNewPasswordField.passwordIsRequiredWarning);
    
    return this.self;
  }

  async verifyCreateNewPasswordWarningAll(): Promise<this> {
    await this.passwordWarningAllIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password warning all icon not visible after waiting' });
    await this.verifyElementDisplayed(this.passwordWarningAllIcon, 'passwordWarningAllIcon', 'Password warning all icon should be visible');
    await this.passwordWarningAll.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password warning all not visible after waiting' });
    await this.verifyElementDisplayed(this.passwordWarningAll, 'passwordWarningAll', 'Password warning all should be visible');
    
    const warningText = await this.passwordWarningAll.getText();
    expect(warningText).toBe(MODIFY_MASTER_PASSWORD_POPUP.newPasswordField.passwordWarningAll);
    
    return this.self;
  }

  async verifyNewPasswordDifferentFromOldPasswordWarning(): Promise<this> {
    await this.verifyElementDisplayed(this.newPasswordDifferentFromOldPasswordWarningIcon, 'newPasswordDifferentFromOldPasswordWarningIcon', 'New password different from old password warning icon should be visible');
    await this.verifyElementDisplayed(this.newPasswordDifferentFromOldPasswordWarning, 'newPasswordDifferentFromOldPasswordWarning', 'New password different from old password warning should be visible');
    
    const warningText = await this.newPasswordDifferentFromOldPasswordWarning.getText();
    expect(warningText).toBe(MODIFY_MASTER_PASSWORD_POPUP.newPasswordField.newPasswordDifferentFromOldPasswordWarning);
    
    return this.self;
  }

  /* ==================== REPORT A PROBLEM SECTION METHODS ==================== */
  async verifyReportProblemSection(): Promise<this> {
    await this.verifyElementDisplayed(this.reportProblemSection, 'reportProblemSection', 'Report problem section should be visible');
    
    await this.verifyElementDisplayed(this.reportProblemSectionTitle, 'reportProblemSectionTitle', 'Report problem section title should be visible');
    const titleText = await this.reportProblemSectionTitle.getText();
    expect(titleText).toBe(REPORT_PROBLEM_SECTION.title);
    
    await this.verifyElementDisplayed(this.issueInputField, 'issueInputField', 'Issue input field should be visible');
    
    await this.verifyElementDisplayed(this.sendButton, 'sendButton', 'Send button should be visible');
    
    await this.verifyElementDisplayed(this.sendButtonText, 'sendButtonText', 'Send button text should be visible');
    const sendButtonTextValue = await this.sendButtonText.getText();
    expect(sendButtonTextValue).toBe(REPORT_PROBLEM_SECTION.sendButton);
    
    return this.self;
  }

  async verifyIssueInputFieldPlaceholder(): Promise<this> {
    await this.verifyElementDisplayed(this.issueInputField, 'issueInputField', 'Issue input field should be visible');
    
    // Check placeholder text - in Android it's usually in the 'text' attribute when field is empty
    const placeholder = await this.issueInputField.getAttribute('text') || await this.issueInputField.getAttribute('hint');
    expect(placeholder).toBe(REPORT_PROBLEM_SECTION.issueInputPlaceholder);
    
    return this.self;
  }

  async enterIssueText(text: string): Promise<this> {
    await this.issueInputField.click();
    await this.issueInputField.clearValue();
    await this.issueInputField.addValue(text);
    return this.self;
  }

  async verifyIssueText(expectedText: string): Promise<this> {
    const actualText = await this.issueInputField.getText();
    expect(actualText).toBe(expectedText);
    return this.self;
  }

  async tapSendButton(): Promise<this> {
    await this.sendButton.click();
    return this.self;
  }

  async verifyFeedbackSentToast(): Promise<this> {
    await this.feedbackSentToast.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.feedbackSentToast, 'feedbackSentToast', 'Feedback sent toast should be visible');
    
    await this.verifyElementDisplayed(this.feedbackSentToastText, 'feedbackSentToastText', 'Feedback sent toast text should be visible');
    
    const toastText = await this.feedbackSentToastText.getText();
    expect(toastText).toBe(REPORT_PROBLEM_SECTION.feedbackSentToastText);
    
    return this.self;
  }

  /* ==================== VERSION SECTION METHODS ==================== */
  async verifyVersionSection(): Promise<this> {
    await this.verifyElementDisplayed(this.versionSection, 'versionSection', 'Version section should be visible');
    
    await this.verifyElementDisplayed(this.versionSectionTitle, 'versionSectionTitle', 'Version section title should be visible');
    const titleText = await this.versionSectionTitle.getText();
    expect(titleText).toBe(VERSION_SECTION.title);
    
    await this.verifyElementDisplayed(this.versionText, 'versionText', 'Version text should be visible');
    const versionTextValue = await this.versionText.getText();
    expect(versionTextValue).toBe(VERSION_SECTION.versionNumber);
    
    return this.self;
  }

  /* ==================== LEGAL LINKS METHODS ==================== */
  async verifyTermsOfUseLink(): Promise<this> {
    await this.verifyElementDisplayed(this.termsOfUseLink, 'termsOfUseLink', 'Terms of Use link should be visible');
    
    const linkText = await this.termsOfUseLink.getText();
    expect(linkText).toBe(LEGAL_LINKS.termsOfUse);
    
    return this.self;
  }

  async verifyPrivacyStatementLink(): Promise<this> {
    await this.verifyElementDisplayed(this.privacyStatementLink, 'privacyStatementLink', 'Privacy Statement link should be visible');
    
    const linkText = await this.privacyStatementLink.getText();
    expect(linkText).toBe(LEGAL_LINKS.privacyStatement);
    
    return this.self;
  }

  async tapTermsOfUseLink(): Promise<this> {
    await this.termsOfUseLink.click();
    return this.self;
  }

  async tapPrivacyStatementLink(): Promise<this> {
    await this.privacyStatementLink.click();
    return this.self;
  }

  async verifyTermsOfUsePage(): Promise<this> {
    await this.termsOfUseLinkPageTitle.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.termsOfUseLinkPageTitle, 'termsOfUseLinkPageTitle', 'Terms of Use page title should be visible');
    
    const pageTitleText = await this.termsOfUseLinkPageTitle.getText();
    expect(pageTitleText).toBe(LEGAL_LINKS.termsOfUsePageTitle);
    
    return this.self;
  }

  async verifyPrivacyStatementPage(): Promise<this> {
    await this.privacyStatementLinkPageTitle.waitForDisplayed({ timeout: 5000 });
    await this.verifyElementDisplayed(this.privacyStatementLinkPageTitle, 'privacyStatementLinkPageTitle', 'Privacy Statement page title should be visible');
    
    const pageTitleText = await this.privacyStatementLinkPageTitle.getText();
    expect(pageTitleText).toBe(LEGAL_LINKS.privacyStatementPageTitle);
    
    return this.self;
  }

  async swipeToUp(): Promise<this> {
    // Свайп с фиксированными координатами: от X: 900 Y:1700 до X: 900 Y:1200
    await browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: 900, y: 1700 },
          { type: 'pointerDown' },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 600, x: 900, y: 1200 },
          { type: 'pointerUp' },
        ],
      },
    ]);
    await browser.releaseActions();
    await browser.pause(1500); // Пауза после свайпа для обновления UI
    return this.self;
  }

  async swipeToDown(): Promise<this> {
    // Выполняем несколько свайпов для гарантированного скролла
    for (let i = 0; i < 2; i++) {
      await this.swipe('down', 0.8);
      await browser.pause(500); // Пауза между свайпами
    }
    await browser.pause(1500); // Финальная пауза после всех свайпов для обновления UI
    return this.self;
  }

  /* ==================== ALLOW ALL COOKIES BUTTON METHODS ==================== */

  async acceptCookiesIfPresent(): Promise<this> {
    await browser.pause(3000);
    const isExisting = await this.allowAllCookiesButton.isExisting().catch(() => false);
    if (!isExisting) {
      return this.self;
    }
    await this.allowAllCookiesButton.waitForDisplayed({ timeout: 10000 });
    await this.allowAllCookiesButton.click();
    return this.self;
  }

  async enterCodeForBlindPeer(code: string): Promise<this> {
    await this.addHereYourCodeField.waitForDisplayed({ timeout: 10000 });
    await this.addHereYourCodeField.click();
    await this.addHereYourCodeField.clearValue();
    await this.addHereYourCodeField.setValue(code);
    return this.self;
  }

  async verifyInvalidCodeForBlindPeerWarningMessageDisplayed(): Promise<this> {
    await this.verifyElementDisplayed(this.errorToastForManualBlindPeers, 'errorToastForManualBlindPeers', 'Error toast for manual blind peers should be visible');
    await this.verifyElementDisplayed(this.errorToastForManualBlindPeersText, 'errorToastForManualBlindPeersText', 'Error toast text should be visible');
    const errorText = await this.errorToastForManualBlindPeersText.getText();
    expect(errorText).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.errorMessage);
    return this.self;
  }

  async verifySuccessToastForManualBlindPeersDisplayed(): Promise<this> {
    await this.verifyElementDisplayed(this.successToastForManualBlindPeers, 'successToastForManualBlindPeers', 'Success toast for manual blind peers should be visible');
    await this.verifyElementDisplayed(this.successToastForManualBlindPeersText, 'successToastForManualBlindPeersText', 'Success toast text should be visible');
    const successText = await this.successToastForManualBlindPeersText.getText();
    expect(successText).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.successMessage);
    return this.self;
  }

  async verifyAllNewManualBlindPeersElementsInYourBlindPeersSection(): Promise<this> {
    // Verify Your Blind Peers Text (переиспользуем существующую проверку)
    await this.verifyElementDisplayed(this.yourBlindPeersText, 'yourBlindPeersText', 'Your Blind Peers text should be visible');
    const yourBlindPeersTextValue = await this.yourBlindPeersText.getText();
    expect(yourBlindPeersTextValue).toBe(BLIND_PEERING_SECTION.yourBlindPeers.text);
    
    // Verify Manual Blind Peers Field
    await this.verifyElementDisplayed(this.manualBlindPeersField, 'manualBlindPeersField', 'Manual Blind Peers field should be visible');
    
    // Verify Manual Blind Peers Field Text
    await this.verifyElementDisplayed(this.manualBlindPeersFieldText, 'manualBlindPeersFieldText', 'Manual Blind Peers field text should be visible');
    const manualBlindPeersFieldTextValue = await this.manualBlindPeersFieldText.getText();
    expect(manualBlindPeersFieldTextValue).toBe(BLIND_PEERING_SECTION.yourBlindPeers.manualFieldText);
    
    // Verify Manual Blind Peers Field Icon
    await this.verifyElementDisplayed(this.manualBlindPeersFieldIcon, 'manualBlindPeersFieldIcon', 'Manual Blind Peers field icon should be visible');
    
    // Verify Manual Blind Peers Field Status
    await this.verifyElementDisplayed(this.manualBlindPeersFieldStatus, 'manualBlindPeersFieldStatus', 'Manual Blind Peers field status should be visible');
    const manualBlindPeersFieldStatusValue = await this.manualBlindPeersFieldStatus.getText();
    expect(manualBlindPeersFieldStatusValue).toBe(BLIND_PEERING_SECTION.yourBlindPeers.manualStatus);
    
    // Verify Separate Icon
    await this.verifyElementDisplayed(this.separateIcon, 'separateIcon', 'Separate icon should be visible');
    
    // Verify Manual Blind Peers Field Text Count
    await this.verifyElementDisplayed(this.manualBlindPeersFieldTextCount, 'manualBlindPeersFieldTextCount', 'Manual Blind Peers field text count should be visible');
    const manualBlindPeersFieldTextCountValue = await this.manualBlindPeersFieldTextCount.getText();
    expect(manualBlindPeersFieldTextCountValue).toBe(BLIND_PEERING_SECTION.yourBlindPeers.manualTextCount);
    
    return this.self;
  }
}


export default SettingsPage;
