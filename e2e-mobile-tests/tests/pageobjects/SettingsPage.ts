import BasePage from '@pages/BasePage';
import settingsLocators from '@locators/SettingsLocators';
import { SETTINGS_PAGE, SECURITY_PAGE, SYNCING_PAGE, AUTOFILL_PAGE, VAULT_PAGE, APPEARANCE_PAGE, ABOUT_PAGE, MASTER_PASSWORD_SECTION, PEAR_PASS_FUNCTIONS_SECTION, CONTINUE_USING_BIOMETRICS_ACCESS_POPUP, LANGUAGE_SECTION, MODIFY_MASTER_PASSWORD_POPUP, REPORT_PROBLEM_SECTION, VERSION_SECTION, LEGAL_LINKS, CHANGE_VAULT_NAME_POPUP, EXPORT_SECTION, IMPORT_SECTION, CUSTOM_SETTINGS_SECTION, BLIND_PEERING_SECTION, AUTOFILL_SECTION, YOUR_VAULT_SECTION, LINKED_DEVICES_SECTION, IMPORT_VAULT_POPUP, ImportWalletType, DropTextWalletType } from '@data/settings.data';
import { browser } from '@wdio/globals';

// Use global expect from expect-webdriverio for text comparison
declare const expect: any;

export class SettingsPage extends BasePage {
  protected selectors = settingsLocators;

  /* ==================== SETTINGS PAGE GETTERS ==================== */
  get settingsTitle() { return this.$('settingsTitle'); }
  get securityButton() { return this.$('securityButton'); }
  get securityButtonIcon() { return this.$('securityButtonIcon'); }
  get securityButtonText() { return this.$('securityButtonText'); }
  get syncingButton() { return this.$('syncingButton'); }
  get syncingButtonIcon() { return this.$('syncingButtonIcon'); }
  get syncingButtonText() { return this.$('syncingButtonText'); }
  get autofillButton() { return this.$('autofillButton'); }
  get autofillButtonIcon() { return this.$('autofillButtonIcon'); }
  get autofillButtonText() { return this.$('autofillButtonText'); }
  get vaultButton() { return this.$('vaultButton'); }
  get vaultButtonIcon() { return this.$('vaultButtonIcon'); }
  get vaultButtonText() { return this.$('vaultButtonText'); }
  get appearanceButton() { return this.$('appearanceButton'); }
  get appearanceButtonIcon() { return this.$('appearanceButtonIcon'); }
  get appearanceButtonText() { return this.$('appearanceButtonText'); }
  get aboutButton() { return this.$('aboutButton'); }
  get aboutButtonIcon() { return this.$('aboutButtonIcon'); }
  get aboutButtonText() { return this.$('aboutButtonText'); }
  get backButton() { return this.$('backButton'); }
  
  /* ==================== SECURITY PAGE GETTERS ==================== */
  get securityPageTitle() { return this.$('securityPageTitle'); }
  get masterPasswordField() { return this.$('masterPasswordField'); }
  get masterPasswordFieldTitle() { return this.$('masterPasswordFieldTitle'); }
  get masterPasswordFieldText() { return this.$('masterPasswordFieldText'); }
  get masterVaultField() { return this.$('masterVaultField'); }
  get masterVaultFieldText() { return this.$('masterVaultFieldText'); }
  get masterVaultFieldFirstIcon() { return this.$('masterVaultFieldFirstIcon'); }
  get masterVaultFieldEditIcon() { return this.$('masterVaultFieldEditIcon'); }

  get modifyMasterPasswordPopUp() { return this.$('modifyMasterPasswordPopUp'); }
  get modifyMasterPasswordPopUpTitle() { return this.$('modifyMasterPasswordPopUpTitle'); }

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
  
  get modifyMasterPasswordPopUpSaveButton() { return this.$('modifyMasterPasswordPopUpSaveButton'); }
  get modifyMasterPasswordPopUpSaveButtonText() { return this.$('modifyMasterPasswordPopUpSaveButtonText'); }
  get modifyMasterPasswordPopUpCancelButton() { return this.$('modifyMasterPasswordPopUpCancelButton'); }
  get modifyMasterPasswordPopUpCancelButtonText() { return this.$('modifyMasterPasswordPopUpCancelButtonText'); }
  
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

  get allowAllCookiesButton() { return this.$('allowAllCookiesButton'); }

  /* ==================== PEAR PASS FUNCTIONS SECTION GETTERS ==================== */
  get pearPassFunctionsSection() { return this.$('pearPassFunctionsSection'); }
  get pearPassFunctionsSectionTitle() { return this.$('pearPassFunctionsSectionTitle'); }
  get pearPassFunctionsSectionText() { return this.$('pearPassFunctionsSectionText'); }
  get remindersTitle() { return this.$('remindersTitle'); }
  get remindersDescription() { return this.$('remindersDescription'); }
  get remindersToggleOn() { return this.$('remindersToggleOn'); }
  get remindersToggleOff() { return this.$('remindersToggleOff'); }
  get copyToClipboardTitle() { return this.$('copyToClipboardTitle'); }
  get copyToClipboardDescription() { return this.$('copyToClipboardDescription'); }
  get copyToClipboardToggleOn() { return this.$('copyToClipboardToggleOn'); }
  get copyToClipboardToggleOff() { return this.$('copyToClipboardToggleOff'); }
  get hapticFeedbackTitle() { return this.$('hapticFeedbackTitle'); }
  get hapticFeedbackDescription() { return this.$('hapticFeedbackDescription'); }
  get hapticFeedbackToggleOn() { return this.$('hapticFeedbackToggleOn'); }
  get hapticFeedbackToggleOff() { return this.$('hapticFeedbackToggleOff'); }
  get unlockWithBiometricsTitle() { return this.$('unlockWithBiometricsTitle'); }
  get unlockWithBiometricsDescription() { return this.$('unlockWithBiometricsDescription'); }
  get unlockWithBiometricsToggleOn() { return this.$('unlockWithBiometricsToggleOn'); }
  get unlockWithBiometricsToggleOff() { return this.$('unlockWithBiometricsToggleOff'); }
  get biometricsAuthenticationPopupAppLogo() { return this.$('biometricsAuthenticationPopupAppLogo'); }
  get biometricsAuthenticationPopupAppText() { return this.$('biometricsAuthenticationPopupAppText'); }
  get biometricsAuthenticationPopupText() { return this.$('biometricsAuthenticationPopupText'); }
  get biometricsAuthenticationPopupIndicator() { return this.$('biometricsAuthenticationPopupIndicator'); }
  get biometricsAuthenticationPopupUsePinButton() { return this.$('biometricsAuthenticationPopupUsePinButton'); }
  get continueUsingBiometricsAccessPopup() { return this.$('continueUsingBiometricsAccessPopup'); }
  get continueUsingBiometricsAccessPopupTitle() { return this.$('continueUsingBiometricsAccessPopupTitle'); }
  get continueUsingBiometricsAccessPopupDescription() { return this.$('continueUsingBiometricsAccessPopupDescription'); }
  get continueUsingBiometricsAccessPopupEnableButton() { return this.$('continueUsingBiometricsAccessPopupEnableButton'); }
  get continueUsingBiometricsAccessPopupEnableButtonText() { return this.$('continueUsingBiometricsAccessPopupEnableButtonText'); }
  get continueUsingBiometricsAccessPopupCancelButton() { return this.$('continueUsingBiometricsAccessPopupCancelButton'); }
  get continueUsingBiometricsAccessPopupCancelButtonText() { return this.$('continueUsingBiometricsAccessPopupCancelButtonText'); }
  get autoLogoutTitle() { return this.$('autoLogoutTitle'); }
  get autoLogoutDescription() { return this.$('autoLogoutDescription'); }
  get autoLogoutTimeoutField() { return this.$('autoLogoutTimeoutField'); }
  get autoLogoutTimeoutFieldText() { return this.$('autoLogoutTimeoutFieldText'); }
  get autoLogoutTimeoutFieldIcon() { return this.$('autoLogoutTimeoutFieldIcon'); }
  get autoLogoutTimeoutFieldDropdown() { return this.$('autoLogoutTimeoutFieldDropdown'); }
  get autoLogoutTimeoutFieldNever() { return this.$('autoLogoutTimeoutFieldNever'); }
  get autoLogoutTimeoutFieldNeverText() { return this.$('autoLogoutTimeoutFieldNeverText'); }
  get autoLogoutTimeoutFieldNeverIcon() { return this.$('autoLogoutTimeoutFieldNeverIcon'); }
  get autoLogoutInformationIcon() { return this.$('autoLogoutInformationIcon'); }
  get autoLogoutInformationPopup() { return this.$('autoLogoutInformationPopup'); }
  get autoLogoutInformationPopupTitle() { return this.$('autoLogoutInformationPopupTitle'); }
  get autoLogoutInformationPopupDescription1() { return this.$('autoLogoutInformationPopupDescription1'); }
  get autoLogoutInformationPopupDescription2() { return this.$('autoLogoutInformationPopupDescription2'); }
  get thirtySecondsRadioButtonChoose() { return this.$('thirtySecondsRadioButtonChoose'); }
  get thirtySecondsRadioButtonText() { return this.$('thirtySecondsRadioButtonText'); }
  get thirtySecondsRadioButtonUnchoose() { return this.$('thirtySecondsRadioButtonUnchoose'); }
  get oneMinuteRadioButtonUnchoose() { return this.$('oneMinuteRadioButtonUnchoose'); }
  get oneMinuteRadioButtonChoose() { return this.$('oneMinuteRadioButtonChoose'); }
  get oneMinuteRadioButtonText() { return this.$('oneMinuteRadioButtonText'); }
  get fiveMinutesRadioButtonUnchoose() { return this.$('fiveMinutesRadioButtonUnchoose'); }
  get fiveMinutesRadioButtonChoose() { return this.$('fiveMinutesRadioButtonChoose'); }
  get fiveMinutesRadioButtonText() { return this.$('fiveMinutesRadioButtonText'); }
  get fifteenMinutesRadioButtonUnchoose() { return this.$('fifteenMinutesRadioButtonUnchoose'); }
  get fifteenMinutesRadioButtonChoose() { return this.$('fifteenMinutesRadioButtonChoose'); }
  get fifteenMinutesRadioButtonText() { return this.$('fifteenMinutesRadioButtonText'); }
  get thirtyMinutesRadioButtonUnchoose() { return this.$('thirtyMinutesRadioButtonUnchoose'); }
  get thirtyMinutesRadioButtonChoose() { return this.$('thirtyMinutesRadioButtonChoose'); }
  get thirtyMinutesRadioButtonText() { return this.$('thirtyMinutesRadioButtonText'); }
  get oneHourRadioButtonUnchoose() { return this.$('oneHourRadioButtonUnchoose'); }
  get oneHourRadioButtonChoose() { return this.$('oneHourRadioButtonChoose'); }
  get oneHourRadioButtonText() { return this.$('oneHourRadioButtonText'); }
  get fourHoursRadioButtonUnchoose() { return this.$('fourHoursRadioButtonUnchoose'); }
  get fourHoursRadioButtonChoose() { return this.$('fourHoursRadioButtonChoose'); }
  get fourHoursRadioButtonText() { return this.$('fourHoursRadioButtonText'); }
  get neverRadioButtonUnchoose() { return this.$('neverRadioButtonUnchoose'); }
  get neverRadioButtonChoose() { return this.$('neverRadioButtonChoose'); }
  get neverRadioButtonText() { return this.$('neverRadioButtonText'); }

  /* ==================== SYNCING PAGE GETTERS ==================== */
  get syncingPageTitle() { return this.$('syncingPageTitle'); }
  get blindPeeringSection() { return this.$('blindPeeringSection'); }
  get blindPeeringSectionIcon() { return this.$('blindPeeringSectionIcon'); }
  get blindPeeringSectionTitle() { return this.$('blindPeeringSectionTitle'); }
  get blindPeeringSectionDescription() { return this.$('blindPeeringSectionDescription'); }
  get blindPeeringSectionText() { return this.$('blindPeeringSectionText'); }
  get blindPeeringSectionLearnMoreButton() { return this.$('blindPeeringSectionLearnMoreButton'); }
  get blindPeeringSectionLearnMoreButtonIcon() { return this.$('blindPeeringSectionLearnMoreButtonIcon'); }
  get blindPeeringSectionToggleOff() { return this.$('blindPeeringSectionToggleOff'); }
  get blindPeeringSectionToggleOn() { return this.$('blindPeeringSectionToggleOn'); }

  get blindPeeringSectionInformationPopup() { return this.$('blindPeeringSectionInformationPopup'); }
  get blindPeeringSectionInformationPopupTitle() { return this.$('blindPeeringSectionInformationPopupTitle'); }
  get blindPeeringSectionInformationPopupDescription() { return this.$('blindPeeringSectionInformationPopupDescription'); }
  get blindPeeringSectionInformationPopupText() { return this.$('blindPeeringSectionInformationPopupText'); }
  get blindPeeringSectionInformationPopupText2() { return this.$('blindPeeringSectionInformationPopupText2'); }
  get blindPeeringSectionInformationPopupText3() { return this.$('blindPeeringSectionInformationPopupText3'); }
  get blindPeeringSectionInformationPopupLearnMoreButton() { return this.$('blindPeeringSectionInformationPopupLearnMoreButton'); }
  get blindPeeringSectionInformationPopupLearnMoreButtonIcon() { return this.$('blindPeeringSectionInformationPopupLearnMoreButtonIcon'); }
  get blindPeeringSectionInformationPopupLearnMoreButtonLink() { return this.$('blindPeeringSectionInformationPopupLearnMoreButtonLink'); }

  get blindPeeringInformationPage() { return this.$('blindPeeringInformationPage'); }

  get chooseBlindPeeringPopup() { return this.$('chooseBlindPeeringPopup'); }
  get chooseBlindPeeringPopupTitle() { return this.$('chooseBlindPeeringPopupTitle'); }
  get chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonChoose() { return this.$('chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonChoose'); }
  get chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonText() { return this.$('chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonText'); }
  get chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonUnchoose() { return this.$('chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonUnchoose'); }

  get chooseBlindPeeringPopupManualBlindPeersRadioButtonChoose() { return this.$('chooseBlindPeeringPopupManualBlindPeersRadioButtonChoose'); }
  get chooseBlindPeeringPopupManualBlindPeersRadioButtonText() { return this.$('chooseBlindPeeringPopupManualBlindPeersRadioButtonText'); }
  get chooseBlindPeeringPopupManualBlindPeersRadioButtonUnchoose() { return this.$('chooseBlindPeeringPopupManualBlindPeersRadioButtonUnchoose'); }

  get chooseBlindPeeringPopupConfirmButton() { return this.$('chooseBlindPeeringPopupConfirmButton'); }
  get chooseBlindPeeringPopupConfirmButtonText() { return this.$('chooseBlindPeeringPopupConfirmButtonText'); }
  get chooseBlindPeeringPopupCancelButton() { return this.$('chooseBlindPeeringPopupCancelButton'); }
  get chooseBlindPeeringPopupCancelButtonText() { return this.$('chooseBlindPeeringPopupCancelButtonText'); }

  get automaticBlindPeersToast() { return this.$('automaticBlindPeersToast'); }
  get automaticBlindPeersToastText() { return this.$('automaticBlindPeersToastText'); }

  get yourBlindPeersText() { return this.$('yourBlindPeersText'); }
  get yourBlindPeersField() { return this.$('yourBlindPeersField'); }
  get ourBlindPeersFieldText() { return this.$('ourBlindPeersFieldText'); }
  get ourBlindPeersFieldIcon() { return this.$('ourBlindPeersFieldIcon'); }
  get ourBlindPeersFieldStatus() { return this.$('ourBlindPeersFieldStatus'); }

  get manualBlindPeersField() { return this.$('manualBlindPeersField'); }
  get manualBlindPeersFieldText() { return this.$('manualBlindPeersFieldText'); }
  get manualBlindPeersFieldIcon() { return this.$('manualBlindPeersFieldIcon'); }
  get manualBlindPeersFieldStatus() { return this.$('manualBlindPeersFieldStatus'); }
  get separateIcon() { return this.$('separateIcon'); }
  get manualBlindPeersFieldTextCount() { return this.$('manualBlindPeersFieldTextCount'); }

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
  get manualBlindPeersPopupConfirmButton() { return this.$('manualBlindPeersPopupConfirmButton'); }
  get manualBlindPeersPopupConfirmButtonText() { return this.$('manualBlindPeersPopupConfirmButtonText'); }
  get manualBlindPeersPopupCancelButton() { return this.$('manualBlindPeersPopupCancelButton'); }
  get manualBlindPeersPopupCancelButtonText() { return this.$('manualBlindPeersPopupCancelButtonText'); }

  get twoBlinPeerText() { return this.$('twoBlinPeerText'); }
  get twoBlinPeerAddHereYourCodeField() { return this.$('twoBlinPeerAddHereYourCodeField'); }
  get removePeerButton() { return this.$('removePeerButton'); }
  get removePeerButtonText() { return this.$('removePeerButtonText'); }
  get removePeerButtonIcon() { return this.$('removePeerButtonIcon'); }

  get errorToastForManualBlindPeers() { return this.$('errorToastForManualBlindPeers'); }
  get errorToastForManualBlindPeersText() { return this.$('errorToastForManualBlindPeersText'); }
  get successToastForManualBlindPeers() { return this.$('successToastForManualBlindPeers'); }
  get successToastForManualBlindPeersText() { return this.$('successToastForManualBlindPeersText'); }

  /* ==================== AUTOFILL PAGE GETTERS ==================== */
  get autofillPageTitle() { return this.$('autofillPageTitle'); }
  get autofillSection() { return this.$('autofillSection'); }
  get autofillSectionTitle() { return this.$('autofillSectionTitle'); }
  get autofillSectionDescription() { return this.$('autofillSectionDescription'); }
  get autofillSectionSetAsDefaultButton() { return this.$('autofillSectionSetAsDefaultButton'); }
  get autofillSectionSetAsDefaultButtonText() { return this.$('autofillSectionSetAsDefaultButtonText'); }

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

  /* ==================== VAULT PAGE GETTERS ==================== */
  get vaultPageTitle() { return this.$('vaultPageTitle'); }
  get vaultSection() { return this.$('vaultSection'); }
  get vaultSectionTitle() { return this.$('vaultSectionTitle'); }
  get vaultSectionDescription() { return this.$('vaultSectionDescription'); }
  get manageVaultsSectionItem() { return this.$('manageVaultsSectionItem'); }
  get manageVaultsSectionItemIcon() { return this.$('manageVaultsSectionItemIcon'); }
  get manageVaultsSectionItemEditIcon() { return this.$('manageVaultsSectionItemEditIcon'); }
  get manageVaultsSectionItemText() { return this.$('manageVaultsSectionItemText'); }
  get manageVaultsSectionItemDate() { return this.$('manageVaultsSectionItemDate'); }
  get manageVaultsSectionSecondItem() { return this.$('manageVaultsSectionSecondItem'); }
  get manageVaultsSectionSecondItemIcon() { return this.$('manageVaultsSectionSecondItemIcon'); }
  get manageVaultsSectionSecondItemEditIcon() { return this.$('manageVaultsSectionSecondItemEditIcon'); }
  get manageVaultsSectionSecondItemText() { return this.$('manageVaultsSectionSecondItemText'); }
  get manageVaultsSectionSecondItemDate() { return this.$('manageVaultsSectionSecondItemDate'); }

  /* ==================== YOUR VAULT SECTION GETTERS ==================== */
  get yourVaultSection() { return this.$('yourVaultSection'); }
  get yourVaultSectionTitle() { return this.$('yourVaultSectionTitle'); }
  get yourVaultSectionDescription() { return this.$('yourVaultSectionDescription'); }

  get yourVaultSectionItem() { return this.$('yourVaultSectionItem'); }
  get yourVaultSectionItemIcon() { return this.$('yourVaultSectionItemIcon'); }
  get yourVaultSectionItemEditIcon() { return this.$('yourVaultSectionItemEditIcon'); }
  get yourVaultSectionItemText() { return this.$('yourVaultSectionItemText'); }
  get yourVaultSectionItemDate() { return this.$('yourVaultSectionItemDate'); }

  get yourVaultSectionSecondItem() { return this.$('yourVaultSectionSecondItem'); }
  get yourVaultSectionSecondItemIcon() { return this.$('yourVaultSectionSecondItemIcon'); }
  get yourVaultSectionSecondItemEditIcon() { return this.$('yourVaultSectionSecondItemEditIcon'); }
  get yourVaultSectionSecondItemText() { return this.$('yourVaultSectionSecondItemText'); }
  get yourVaultSectionSecondItemDate() { return this.$('yourVaultSectionSecondItemDate'); }

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
  get changeVaultNamePopUpWindowSaveButton() { return this.$('changeVaultNamePopUpWindowSaveButton'); }
  get changeVaultNamePopUpWindowSaveButtonText() { return this.$('changeVaultNamePopUpWindowSaveButtonText'); }

  get newVaultNameAtVaultsSection() { return this.$('newVaultNameAtVaultsSection'); }
  get backButtonAtVaultsSection() { return this.$('backButtonAtVaultsSection'); }
 
  /* ==================== EXPORT SECTION GETTERS ==================== */
  get exportVaultSection() { return this.$('exportVaultSection'); }
  get exportVaultSectionTitle() { return this.$('exportVaultSectionTitle'); }
  get exportVaultSectionDescription() { return this.$('exportVaultSectionDescription'); }
  get vaults1() { return this.$('vaults1'); }
  get vaults2() { return this.$('vaults2'); }
  get vaults1Icon() { return this.$('vaults1Icon'); }
  get newVaultNameAtExportSection() { return this.$('newVaultNameAtExportSection'); }
  get vaults1Text() { return this.$('vaults1Text'); }
  get vaults1Date() { return this.$('vaults1Date'); }
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
  get jsonRadioButtonChoose() { return this.$('jsonRadioButtonChoose'); }
  get jsonRadioButtonUnchoose() { return this.$('jsonRadioButtonUnchoose'); }
  get exportButton() { return this.$('exportButton'); }
  get exportButtonText() { return this.$('exportButtonText'); }
  get vault1ChooseIcon() { return this.$('vault1ChooseIcon'); }
  get vault1ChooseIcon1() { return this.$('vault1ChooseIcon1'); }
  get vault2ChooseIcon() { return this.$('vault2ChooseIcon'); }
  get vault2ChooseIcon1() { return this.$('vault2ChooseIcon1'); }

  get exportVaultsPopup() { return this.$('exportVaultsPopup'); }
  get exportVaultsPopupTitle() { return this.$('exportVaultsPopupTitle'); }
  get exportVaultsPopupText() { return this.$('exportVaultsPopupText'); }
  get exportVaultsPopupField() { return this.$('exportVaultsPopupField'); }
  get exportVaultsPopupFieldIcon() { return this.$('exportVaultsPopupFieldIcon'); }
  get exportVaultsPopupFieldShowPasswordIcon() { return this.$('exportVaultsPopupFieldShowPasswordIcon'); }
  get exportVaultsPopupFieldShowPasswordIcon1() { return this.$('exportVaultsPopupFieldShowPasswordIcon1'); }
  get exportVaultsPopupInputField() { return this.$('exportVaultsPopupInputField'); }
  get exportVaultsPopupExportButton() { return this.$('exportVaultsPopupExportButton'); }
  get exportVaultsPopupExportButtonText() { return this.$('exportVaultsPopupExportButtonText'); }
  get exportVaultsPopupCancelButton() { return this.$('exportVaultsPopupCancelButton'); }
  get exportVaultsPopupCancelButtonText() { return this.$('exportVaultsPopupCancelButtonText'); }
  get exportVaultsInValidPasswordWarningIcon() { return this.$('exportVaultsInValidPasswordWarningIcon'); }
  get exportVaultsInValidPasswordWarningText() { return this.$('exportVaultsInValidPasswordWarningText'); }
  get inValidPasswordWarningText() { return this.$('inValidPasswordWarningText'); }
  get vaultsSavedMessage1() { return this.$('vaultsSavedMessage1'); }
  get vaultsSavedMessage2() { return this.$('vaultsSavedMessage2'); }
  get exportSuccessToast() { return this.$('exportSuccessToast'); }
  get exportSuccessToastTitle() { return this.$('exportSuccessToastTitle'); }
  get exportSuccessToastText() { return this.$('exportSuccessToastText'); }
  get noDataToExportToast() { return this.$('noDataToExportToast'); }
  get noDataToExportToastTitle() { return this.$('noDataToExportToastTitle'); }
  get noDataToExportToastText() { return this.$('noDataToExportToastText'); }

  /* ==================== IMPORT SECTION GETTERS ==================== */
  get importVaultSection() { return this.$('importVaultSection'); }
  get importVaultSectionTitle() { return this.$('importVaultSectionTitle'); }
  get importVaultSectionDescription() { return this.$('importVaultSectionDescription'); }
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
  get keePassButton() { return this.$('keePassButton'); }
  get keePassButtonIcon() { return this.$('keePassButtonIcon'); }
  get keePassButtonName() { return this.$('keePassButtonName'); }
  get keePassButtonText() { return this.$('keePassButtonText'); }
  get keePassXCButton() { return this.$('keePassXCButton'); }
  get keePassXCButtonIcon() { return this.$('keePassXCButtonIcon'); }
  get keePassXCButtonName() { return this.$('keePassXCButtonName'); }
  get keePassXCButtonText() { return this.$('keePassXCButtonText'); }
  get unencryptedFileButton() { return this.$('unencryptedFileButton'); }
  get unencryptedFileButtonIcon() { return this.$('unencryptedFileButtonIcon'); }
  get unencryptedFileButtonName() { return this.$('unencryptedFileButtonName'); }
  get unencryptedFileButtonText() { return this.$('unencryptedFileButtonText'); }
  get encryptedFileButton() { return this.$('encryptedFileButton'); }
  get encryptedFileButtonIcon() { return this.$('encryptedFileButtonIcon'); }
  get encryptedFileButtonName() { return this.$('encryptedFileButtonName'); }
  get encryptedFileButtonText() { return this.$('encryptedFileButtonText'); }

  get importVaultPopup() { return this.$('immortVaultPopup'); }
  get importVaultPopupTitle() { return this.$('immortVaultPopupTitle'); }
  get importVaultPopupTextOnePassword() { return this.$('immortVaultPopupTextOnePassword'); }
  get importVaultPopupTextBitwarden() { return this.$('immortVaultPopupTextBitwarden'); }
  get importVaultPopupTextLastPass() { return this.$('immortVaultPopupTextLastPass'); }
  get importVaultPopupTextNordPass() { return this.$('immortVaultPopupTextNordPass'); }
  get importVaultPopupTextProtonPass() { return this.$('immortVaultPopupTextProtonPass'); }
  get importVaultPopupTextUnencryptedFile() { return this.$('immortVaultPopupTextUnencryptedFile'); }
  get importVaultPopupTextEncryptedFile() { return this.$('immortVaultPopupTextEncryptedFile'); }
  get importVaultPopupText() { return this.$('immortVaultPopupText'); }
  get importVaultPopupBrowseFolderButton() { return this.$('immortVaultPopupBrowseFolderButton'); }
  get importVaultPopupBrowseFolderButtonText() { return this.$('immortVaultPopupBrowseFolderButtonText'); }
  get importVaultPopupImportButton() { return this.$('immortVaultPopupImportButton'); }
  get importVaultPopupImportButtonText() { return this.$('immortVaultPopupImportButtonText'); }
  get importVaultPopupText2() { return this.$('immortVaultPopupText2'); }
  get importVaultPopupText2OnePassword() { return this.$('immortVaultPopupText2OnePassword'); }
  get importVaultPopupText2Bitwarden() { return this.$('immortVaultPopupText2Bitwarden'); }
  get importVaultPopupText2BitwardenJson() { return this.$('immortVaultPopupText2BitwardenJson'); }
  get importVaultPopupText2LastPass() { return this.$('immortVaultPopupText2LastPass'); }
  get importVaultPopupText2NordPass() { return this.$('immortVaultPopupText2NordPass'); }
  get importVaultPopupText2ProtonPass() { return this.$('immortVaultPopupText2ProtonPass'); }
  get importVaultPopupText2ProtonPassJson() { return this.$('immortVaultPopupText2ProtonPassJson'); }
  get importVaultPopupText2UnencryptedFile() { return this.$('immortVaultPopupText2UnencryptedFile'); }
  get importVaultPopupText2UnencryptedFileJson() { return this.$('immortVaultPopupText2UnencryptedFileJson'); }
  get importVaultPopupText2EncryptedFile() { return this.$('immortVaultPopupText2EncryptedFile'); }
  get importVaultPopupIcon() { return this.$('immortVaultPopupIcon'); }
  get importVaultPopupDeleteButton() { return this.$('immortVaultPopupDeleteButton'); }

  get vaultsImportFailedToast() { return this.$('vaultsImportFailedToast'); }
  get vaultsImportFailedToastText() { return this.$('vaultsImportFailedToastText'); }

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

  /* ==================== LINKED DEVICES SECTION GETTERS ==================== */
  get linkedDevicesSection() { return this.$('linkedDevicesSection'); }
  get linkedDevicesSectionTitle() { return this.$('linkedDevicesSectionTitle'); }
  get linkedDevicesSectionDescription() { return this.$('linkedDevicesSectionDescription'); }
  get linkedDevicesSectionItem() { return this.$('linkedDevicesSectionItem'); }
  get linkedDevicesSectionItemIcon() { return this.$('linkedDevicesSectionItemIcon'); }
  get linkedDevicesSectionItemText() { return this.$('linkedDevicesSectionItemText'); }
  get linkedDevicesSectionItemDate() { return this.$('linkedDevicesSectionItemDate'); }
  get addDeviceButton() { return this.$('addDeviceButton'); }
  get addDeviceButtonText() { return this.$('addDeviceButtonText'); }

  /* ==================== APPEARANCE PAGE GETTERS ==================== */
  get appearancePageTitle() { return this.$('appearancePageTitle'); }
  get languageSection() { return this.$('languageSection'); }
  get languageSectionTitle() { return this.$('languageSectionTitle'); }
  get languageSectionDescription() { return this.$('languageSectionDescription'); }
  get languageDropdown() { return this.$('languageDropdown'); }
  get languageDropdownIcon() { return this.$('languageDropdownIcon'); }
  get languageDropdownText() { return this.$('languageDropdownText'); }
  get languageDropdownMenu() { return this.$('languageDropdownMenu'); }
  /* ==================== ABOUT PAGE GETTERS ==================== */
  get aboutPageTitle() { return this.$('aboutPageTitle'); }
  get reportProblemSection() { return this.$('reportProblemSection'); }
  get reportProblemSectionTitle() { return this.$('reportProblemSectionTitle'); }
  get issueInputField() { return this.$('issueInputField'); }
  get sendButton() { return this.$('sendButton'); }
  get sendButtonText() { return this.$('sendButtonText'); }
  get feedbackSentToast() { return this.$('feedbackSentToast'); }
  get feedbackSentToastText() { return this.$('feedbackSentToastText'); }

  /* ==================== VERSION SECTION GETTERS (ABOUT PAGE) ==================== */
  get versionSection() { return this.$('versionSection'); }
  get versionSectionTitle() { return this.$('versionSectionTitle'); }
  get versionSectionDescription() { return this.$('versionSectionDescription'); }
  get appVersionText() { return this.$('appVersionText'); }
  get appVersionValue() { return this.$('appVersionValue'); }
  get termsOfUseLink() { return this.$('termsOfUseLink'); }
  get termsOfUseLinkText() { return this.$('termsOfUseLinkText'); }
  get privacyStatementLink() { return this.$('privacyStatementLink'); }
  get privacyStatementLinkText() { return this.$('privacyStatementLinkText'); }
  get visitOurWebsiteText() { return this.$('visitOurWebsiteText'); }
  get visitOurWebsiteLinkIcon() { return this.$('visitOurWebsiteLinkIcon'); }
  get visitOurWebsiteLink() { return this.$('visitOurWebsiteLink'); }
  get termsOfUseLinkPageTitle() { return this.$('termsOfUseLinkPageTitle'); }
  get privacyStatementLinkPageTitle() { return this.$('privacyStatementLinkPageTitle'); }
  get pearPassWebsite() { return this.$('pearPassWebsite'); }

  /* ==================== SETTINGS PAGE VERIFICATIONS ==================== */
  async verifySettingsPageTitle(): Promise<this> {
    await this.verifyElementDisplayed(this.settingsTitle, 'settingsTitle', 'Settings title should be visible');
    const titleText = await this.settingsTitle.getText();
    expect(titleText).toBe(SETTINGS_PAGE.title);
    return this.self;
  }

  async verifyAllElements(): Promise<this> {
    await this.settingsTitle.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.settingsTitle, 'settingsTitle', 'Settings title should be visible');
    const titleText = await this.settingsTitle.getText();
    expect(titleText).toBe(SETTINGS_PAGE.title);

    await this.securityButton.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.securityButton, 'securityButton', 'Security button should be visible');
    await this.verifyElementDisplayed(this.securityButtonIcon, 'securityButtonIcon', 'Security button icon should be visible');
    await this.verifyElementDisplayed(this.securityButtonText, 'securityButtonText', 'Security button text should be visible');
    const securityButtonTextValue = await this.securityButtonText.getText();
    expect(securityButtonTextValue).toBe(SETTINGS_PAGE.securityButton);

    await this.syncingButton.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.syncingButton, 'syncingButton', 'Syncing button should be visible');
    await this.verifyElementDisplayed(this.syncingButtonIcon, 'syncingButtonIcon', 'Syncing button icon should be visible');
    await this.verifyElementDisplayed(this.syncingButtonText, 'syncingButtonText', 'Syncing button text should be visible');
    const syncingButtonTextValue = await this.syncingButtonText.getText();
    expect(syncingButtonTextValue).toBe(SETTINGS_PAGE.syncingButton);

    await this.autofillButton.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.autofillButton, 'autofillButton', 'Autofill button should be visible');
    await this.verifyElementDisplayed(this.autofillButtonIcon, 'autofillButtonIcon', 'Autofill button icon should be visible');
    await this.verifyElementDisplayed(this.autofillButtonText, 'autofillButtonText', 'Autofill button text should be visible');
    const autofillButtonTextValue = await this.autofillButtonText.getText();
    expect(autofillButtonTextValue).toBe(SETTINGS_PAGE.autofillButton);

    await this.vaultButton.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.vaultButton, 'vaultButton', 'Vault button should be visible');
    await this.verifyElementDisplayed(this.vaultButtonIcon, 'vaultButtonIcon', 'Vault button icon should be visible');
    await this.verifyElementDisplayed(this.vaultButtonText, 'vaultButtonText', 'Vault button text should be visible');
    const vaultButtonTextValue = await this.vaultButtonText.getText();
    expect(vaultButtonTextValue).toBe(SETTINGS_PAGE.vaultButton);

    await this.appearanceButton.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.appearanceButton, 'appearanceButton', 'Appearance button should be visible');
    await this.verifyElementDisplayed(this.appearanceButtonIcon, 'appearanceButtonIcon', 'Appearance button icon should be visible');
    await this.verifyElementDisplayed(this.appearanceButtonText, 'appearanceButtonText', 'Appearance button text should be visible');
    const appearanceButtonTextValue = await this.appearanceButtonText.getText();
    expect(appearanceButtonTextValue).toBe(SETTINGS_PAGE.appearanceButton);

    await this.aboutButton.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.aboutButton, 'aboutButton', 'About button should be visible');
    await this.verifyElementDisplayed(this.aboutButtonIcon, 'aboutButtonIcon', 'About button icon should be visible');
    await this.verifyElementDisplayed(this.aboutButtonText, 'aboutButtonText', 'About button text should be visible');
    const aboutButtonTextValue = await this.aboutButtonText.getText();
    expect(aboutButtonTextValue).toBe(SETTINGS_PAGE.aboutButton);

    return this.self;
  }
  /* ==================== SECURITY PAGE VERIFICATIONS ==================== */
  async verifySecurityPageDisplayed(): Promise<this> {
    await this.securityPageTitle.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.securityPageTitle, 'securityPageTitle', 'Security page title should be visible');
    const titleText = await this.securityPageTitle.getText();
    expect(titleText).toBe(SECURITY_PAGE.title);
    return this.self;
  }

  async verifyMasterPasswordSectionWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.backButton, 'backButton', 'Back button should be visible');
    await this.verifyElementDisplayed(this.securityPageTitle, 'securityPageTitle', 'Security page title should be visible');
    const securityTitleText = await this.securityPageTitle.getText();
    expect(securityTitleText).toBe(MASTER_PASSWORD_SECTION.securityPageTitle);

    await this.verifyElementDisplayed(this.masterPasswordField, 'masterPasswordField', 'Master Password field should be visible');
    await this.verifyElementDisplayed(this.masterPasswordFieldTitle, 'masterPasswordFieldTitle', 'Master Password field title should be visible');
    const masterPasswordTitleText = await this.masterPasswordFieldTitle.getText();
    expect(masterPasswordTitleText).toBe(MASTER_PASSWORD_SECTION.masterPasswordFieldTitle);
    await this.verifyElementDisplayed(this.masterPasswordFieldText, 'masterPasswordFieldText', 'Master Password field text should be visible');
    const masterPasswordTextValue = await this.masterPasswordFieldText.getText();
    expect(masterPasswordTextValue).toBe(MASTER_PASSWORD_SECTION.masterPasswordFieldText);

    await this.verifyElementDisplayed(this.masterVaultField, 'masterVaultField', 'Master Vault field should be visible');
    await this.verifyElementDisplayed(this.masterVaultFieldText, 'masterVaultFieldText', 'Master Vault field text should be visible');
    const masterVaultTextValue = await this.masterVaultFieldText.getText();
    expect(masterVaultTextValue).toBe(MASTER_PASSWORD_SECTION.masterVaultFieldText);
    await this.verifyElementDisplayed(this.masterVaultFieldFirstIcon, 'masterVaultFieldFirstIcon', 'Master Vault field first icon should be visible');
    await this.verifyElementDisplayed(this.masterVaultFieldEditIcon, 'masterVaultFieldEditIcon', 'Master Vault field edit icon should be visible');

    return this.self;
  }

  async verifyPearPassFunctionsSectionWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.pearPassFunctionsSection, 'pearPassFunctionsSection', 'PearPass functions section should be visible');
    await this.verifyElementDisplayed(this.pearPassFunctionsSectionTitle, 'pearPassFunctionsSectionTitle', 'PearPass functions section title should be visible');
    const sectionTitleText = await this.pearPassFunctionsSectionTitle.getText();
    expect(sectionTitleText).toBe(PEAR_PASS_FUNCTIONS_SECTION.pearPassFunctionsSectionTitle);
    await this.verifyElementDisplayed(this.pearPassFunctionsSectionText, 'pearPassFunctionsSectionText', 'PearPass functions section text should be visible');
    const sectionTextValue = await this.pearPassFunctionsSectionText.getText();
    expect(sectionTextValue).toBe(PEAR_PASS_FUNCTIONS_SECTION.pearPassFunctionsSectionText);

    await this.verifyElementDisplayed(this.remindersTitle, 'remindersTitle', 'Reminders title should be visible');
    const remindersTitleText = await this.remindersTitle.getText();
    expect(remindersTitleText).toBe(PEAR_PASS_FUNCTIONS_SECTION.remindersTitle);
    await this.verifyElementDisplayed(this.remindersDescription, 'remindersDescription', 'Reminders description should be visible');
    const remindersDescText = await this.remindersDescription.getText();
    expect(remindersDescText).toBe(PEAR_PASS_FUNCTIONS_SECTION.remindersDescription);
    await this.verifyElementDisplayed(this.remindersToggleOn, 'remindersToggleOn', 'Reminders toggle should be visible');

    await this.verifyElementDisplayed(this.copyToClipboardTitle, 'copyToClipboardTitle', 'Copy to clipboard title should be visible');
    const copyTitleText = await this.copyToClipboardTitle.getText();
    expect(copyTitleText).toBe(PEAR_PASS_FUNCTIONS_SECTION.copyToClipboardTitle);
    await this.verifyElementDisplayed(this.copyToClipboardDescription, 'copyToClipboardDescription', 'Copy to clipboard description should be visible');
    const copyDescText = await this.copyToClipboardDescription.getText();
    expect(copyDescText).toBe(PEAR_PASS_FUNCTIONS_SECTION.copyToClipboardDescription);
    await this.verifyElementDisplayed(this.copyToClipboardToggleOn, 'copyToClipboardToggleOn', 'Copy to clipboard toggle should be visible');

    // Scroll to see remaining elements
    await this.swipeToUp();

    await this.unlockWithBiometricsTitle.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.unlockWithBiometricsTitle, 'unlockWithBiometricsTitle', 'Unlock with biometrics title should be visible');
    const unlockWithBiometricsTitleText = await this.unlockWithBiometricsTitle.getText();
    expect(unlockWithBiometricsTitleText).toBe(PEAR_PASS_FUNCTIONS_SECTION.unlockWithBiometricsTitle);
    await this.verifyElementDisplayed(this.unlockWithBiometricsDescription, 'unlockWithBiometricsDescription', 'Unlock with biometrics description should be visible');
    const unlockWithBiometricsDescText = await this.unlockWithBiometricsDescription.getText();
    expect(unlockWithBiometricsDescText).toBe(PEAR_PASS_FUNCTIONS_SECTION.unlockWithBiometricsDescription);
    await this.verifyElementDisplayed(this.unlockWithBiometricsToggleOn, 'unlockWithBiometricsToggleOn', 'Unlock with biometrics toggle should be visible');

    await this.verifyElementDisplayed(this.autoLogoutTitle, 'autoLogoutTitle', 'Auto Log-out title should be visible');
    const autoLogoutTitleText = await this.autoLogoutTitle.getText();
    expect(autoLogoutTitleText).toBe(PEAR_PASS_FUNCTIONS_SECTION.autoLogoutTitle);
    await this.verifyElementDisplayed(this.autoLogoutDescription, 'autoLogoutDescription', 'Auto Log-out description should be visible');
    const autoLogoutDescText = await this.autoLogoutDescription.getText();
    expect(autoLogoutDescText).toBe(PEAR_PASS_FUNCTIONS_SECTION.autoLogoutDescription);
    await this.verifyElementDisplayed(this.autoLogoutTimeoutField, 'autoLogoutTimeoutField', 'Auto logout timeout field should be visible');
    await this.verifyElementDisplayed(this.autoLogoutTimeoutFieldText, 'autoLogoutTimeoutFieldText', 'Auto logout timeout field text should be visible');
    const timeoutText = await this.autoLogoutTimeoutFieldText.getText();
    expect(timeoutText).toBe(PEAR_PASS_FUNCTIONS_SECTION.autoLogoutTimeoutFieldText);
    await this.verifyElementDisplayed(this.autoLogoutTimeoutFieldIcon, 'autoLogoutTimeoutFieldIcon', 'Auto logout timeout field icon should be visible');

    return this.self;
  }

 /* ==================== PEAR PASS MASTER PASSWORD NAVIGATION ==================== */
 async tapMasterVaultFieldEditIcon(): Promise<this> {
  await this.masterVaultFieldEditIcon.click();
  return this.self;
}

async verifyModifyMasterPasswordPopUp(): Promise<this> {
  await this.modifyMasterPasswordPopUp.waitForDisplayed({ timeout: 20000 });
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
  
  // Verify Save Button
  await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpSaveButton, 'modifyMasterPasswordPopUpSaveButton', 'Save button should be visible');
  await this.verifyElementDisplayed(this.modifyMasterPasswordPopUpSaveButtonText, 'modifyMasterPasswordPopUpSaveButtonText', 'Save button text should be visible');
  const saveButtonText = await this.modifyMasterPasswordPopUpSaveButtonText.getText();
  expect(saveButtonText).toBe(MODIFY_MASTER_PASSWORD_POPUP.buttons.save);
  
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

async tapModifyMasterPasswordPopUpSaveButton(): Promise<this> {
  await this.modifyMasterPasswordPopUpSaveButton.click();
  return this.self;
}

async verifyOldPasswordInvalidPasswordWarning(): Promise<this> {
  await this.invalidPasswordWarningIcon.waitForDisplayed({ timeout: 20000, timeoutMsg: 'Invalid password warning icon not visible after waiting' });
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
  await this.passwordWarningAllIcon.waitForDisplayed({ timeout: 20000, timeoutMsg: 'Password warning all icon not visible after waiting' });
  await this.verifyElementDisplayed(this.passwordWarningAllIcon, 'passwordWarningAllIcon', 'Password warning all icon should be visible');
  await this.passwordWarningAll.waitForDisplayed({ timeout: 20000, timeoutMsg: 'Password warning all not visible after waiting' });
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

  /* ==================== PEAR PASS FUNCTIONS PAGE NAVIGATION ==================== */
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

  async tapHapticFeedbackToggleOn(): Promise<this> {
    await this.hapticFeedbackToggleOn.click();
    return this.self;
  }

  async verifyHapticFeedbackToggleOnDisplayed(): Promise<this> {
    await this.verifyElementDisplayed(this.hapticFeedbackToggleOn, 'hapticFeedbackToggleOn', 'Haptic feedback toggle on should be visible');
    return this.self;
  }

  async verifyHapticFeedbackToggleOffDisplayed(): Promise<this> {
    await this.verifyElementDisplayed(this.hapticFeedbackToggleOff, 'hapticFeedbackToggleOff', 'Haptic feedback toggle off should be visible');
    return this.self;
  }

  async tapHapticFeedbackToggleOff(): Promise<this> {
    await this.hapticFeedbackToggleOff.click();
    return this.self;
  }

  async tapUnlockWithBiometricsToggleOff(): Promise<this> {
    await this.unlockWithBiometricsToggleOff.click();
    return this.self;
  }

  async tapUnlockWithBiometricsToggleOn(): Promise<this> {
    await this.unlockWithBiometricsToggleOn.click();
    return this.self;
  }

  async verifyUnlockWithBiometricsToggleOnDisplayed(): Promise<this> {
    await this.verifyElementDisplayed(this.unlockWithBiometricsToggleOn, 'unlockWithBiometricsToggleOn', 'Unlock with biometrics toggle on should be visible');
    return this.self;
  }

  async verifyUnlockWithBiometricsToggleOffDisplayed(): Promise<this> {
    await this.verifyElementDisplayed(this.unlockWithBiometricsToggleOff, 'unlockWithBiometricsToggleOff', 'Unlock with biometrics toggle off should be visible');
    return this.self;
  }

  async verifyBiometricsAuthenticationToggleOffDisplayed(): Promise<this> {
    return this.verifyUnlockWithBiometricsToggleOffDisplayed();
  }

  async verifyContinueUsingBiometricsAccessPopupDisplayed(): Promise<this> {
    await this.continueUsingBiometricsAccessPopup.waitForDisplayed({
      timeout: 80000,
      interval: 200,
      timeoutMsg: 'Continue using biometrics access popup should be visible',
    });
    await this.verifyElementDisplayed(
      this.continueUsingBiometricsAccessPopup,
      'continueUsingBiometricsAccessPopup',
      'Continue using biometrics access popup should be visible'
    );
    return this.self;
  }

  async verifyContinueUsingBiometricsAccessPopupAllElementsDisplayed(): Promise<this> {
    await this.verifyContinueUsingBiometricsAccessPopupDisplayed();

    await this.verifyElementDisplayed(
      this.continueUsingBiometricsAccessPopupTitle,
      'continueUsingBiometricsAccessPopupTitle',
      'Continue using biometrics access popup title should be visible'
    );
    await this.verifyElementDisplayed(
      this.continueUsingBiometricsAccessPopupDescription,
      'continueUsingBiometricsAccessPopupDescription',
      'Continue using biometrics access popup description should be visible'
    );
    await this.verifyElementDisplayed(
      this.continueUsingBiometricsAccessPopupEnableButton,
      'continueUsingBiometricsAccessPopupEnableButton',
      'Continue using biometrics access popup enable button should be visible'
    );
    await this.verifyElementDisplayed(
      this.continueUsingBiometricsAccessPopupEnableButtonText,
      'continueUsingBiometricsAccessPopupEnableButtonText',
      'Continue using biometrics access popup enable button text should be visible'
    );
    await this.verifyElementDisplayed(
      this.continueUsingBiometricsAccessPopupCancelButton,
      'continueUsingBiometricsAccessPopupCancelButton',
      'Continue using biometrics access popup cancel button should be visible'
    );
    await this.verifyElementDisplayed(
      this.continueUsingBiometricsAccessPopupCancelButtonText,
      'continueUsingBiometricsAccessPopupCancelButtonText',
      'Continue using biometrics access popup cancel button text should be visible'
    );

    const titleText = (await this.continueUsingBiometricsAccessPopupTitle.getText()).trim();
    expect(titleText).toBe(CONTINUE_USING_BIOMETRICS_ACCESS_POPUP.title);

    const descriptionText = (await this.continueUsingBiometricsAccessPopupDescription.getText()).trim();
    expect(descriptionText).toBe(CONTINUE_USING_BIOMETRICS_ACCESS_POPUP.description);

    const enableButtonText = (await this.continueUsingBiometricsAccessPopupEnableButtonText.getText()).trim();
    expect(enableButtonText).toBe(CONTINUE_USING_BIOMETRICS_ACCESS_POPUP.enableButtonText);

    const cancelButtonText = (await this.continueUsingBiometricsAccessPopupCancelButtonText.getText()).trim();
    expect(cancelButtonText).toBe(CONTINUE_USING_BIOMETRICS_ACCESS_POPUP.cancelButtonText);

    return this.self;
  }

  async tapContinueUsingBiometricsAccessPopupEnableButton(): Promise<this> {
    await this.continueUsingBiometricsAccessPopupEnableButton.click();
    return this.self;
  }

  async verifyContinueUsingBiometricsAccessPopupNotDisplayed(): Promise<this> {
    await this.continueUsingBiometricsAccessPopup.waitForDisplayed({
      reverse: true,
      timeout: 20000,
      timeoutMsg: 'Continue using biometrics access popup should be closed',
    });
    return this.self;
  }

  async useBiometricsAuthentication(): Promise<this> {
    if (!this.isAndroid) {
      throw new Error('Biometric fingerprint auth helper is implemented only for Android');
    }
  
    const fingerprintId = 1;
  
    try {
      console.log(`🔐 Emulating fingerprint touch (ID: ${fingerprintId})...`);
  
      const deviceId = await this.getCurrentDeviceId();
  
      const { promisify } = require('util');
      const execAsync = promisify(require('child_process').exec);
  
      await browser.pause(1500);
  
      // Send fingerprint twice with a short pause between
      console.log('   → Sending first fingerprint touch...');
      await execAsync(`adb -s ${deviceId} emu finger touch ${fingerprintId}`);
      await browser.pause(800);
  
      console.log('   → Sending second fingerprint touch...');
      await execAsync(`adb -s ${deviceId} emu finger touch ${fingerprintId}`);
      await browser.pause(800);
  
      console.log(`✅ Fingerprint ${fingerprintId} emulated twice on device ${deviceId}`);
  
      // Wait for biometric prompt to dismiss (longer timeout)
      await this.waitForBiometricPopupToClose?.(12000) || 
             browser.pause(4000); // fallback if helper is missing
  
      return this;
    } catch (error: any) {
      console.error('❌ Fingerprint authentication failed:', error.message || error);
      throw new Error(`Unable to perform biometric authentication with ID ${fingerprintId}`);
    }
  }

  getCurrentDeviceId = async (): Promise<string> => {
    try {
      const caps = await browser.getCapabilities();
      if (caps['appium:udid']) return caps['appium:udid'] as string;
      if (caps.udid) return caps.udid as string;
  
      const deviceInfo = await browser.execute('mobile: getDeviceInfo');
      if (deviceInfo?.udid) return deviceInfo.udid;
    } catch (e) {
      console.warn('Could not get device ID from Appium, falling back to adb devices');
    }
  
    // Fallback: parse `adb devices` output
    const { promisify } = require('util');
    const execAsync = promisify(require('child_process').exec);
    try {
      const { stdout } = await execAsync('adb devices');
      const lines = stdout.trim().split('\n');
      for (const line of lines) {
        if (line.includes('emulator-') && line.includes('device')) {
          return line.split('\t')[0].trim();
        }
      }
    } catch (e) { /* ignore */ }
  
    return 'emulator-5554';
  };
  
  async tapAutoLogoutTimeoutField(): Promise<this> {
    await this.autoLogoutTimeoutField.click();
    return this.self;
  }

  async tapAutoLogoutTimeoutFieldNever(): Promise<this> {
    await this.autoLogoutTimeoutFieldNever.click();
    return this.self;
  }

  async verifyAutoLogoutTimeoutFieldDropdownDisplayed(): Promise<this> {
    await this.autoLogoutTimeoutFieldDropdown.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.autoLogoutTimeoutFieldDropdown, 'autoLogoutTimeoutFieldDropdown', 'Auto logout timeout field dropdown should be visible');
    return this.self;
  }

  async verifyAutoLogoutInformationIconDisplayed(): Promise<this> {
    await this.autoLogoutInformationIcon.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.autoLogoutInformationIcon, 'autoLogoutInformationIcon', 'Auto logout information icon should be visible');
    return this.self;
  }

  async tapAutoLogInInformationIcon(): Promise<this> {
    await this.autoLogoutInformationIcon.click();
    return this.self;
  }

  async verifyAutoLogoutTimeoutPopupDisplayed(): Promise<this> {
    await this.autoLogoutInformationPopup.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.autoLogoutInformationPopup, 'autoLogoutInformationPopup', 'Auto logout timeout popup should be visible');
    return this.self;
  }

  async verifyAutoLogoutTimeoutPopupElements(): Promise<this> {
    await this.autoLogoutInformationPopupTitle.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.autoLogoutInformationPopupTitle, 'autoLogoutInformationPopupTitle', 'Auto logout popup title should be visible');
    const titleText = await this.autoLogoutInformationPopupTitle.getText();
    expect(titleText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.informationPopup.title);

    await this.autoLogoutInformationPopupDescription1.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.autoLogoutInformationPopupDescription1, 'autoLogoutInformationPopupDescription1', 'Auto logout popup description 1 should be visible');
    const desc1Text = await this.autoLogoutInformationPopupDescription1.getText();
    expect(desc1Text).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.informationPopup.description1);

    await this.autoLogoutInformationPopupDescription2.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.autoLogoutInformationPopupDescription2, 'autoLogoutInformationPopupDescription2', 'Auto logout popup description 2 should be visible');
    const desc2Text = await this.autoLogoutInformationPopupDescription2.getText();
    expect(desc2Text).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.informationPopup.description2);

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

  async verifyFourHoursRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.fourHoursRadioButtonUnchoose, 'fourHoursRadioButtonUnchoose', '4 hours radio button should be unselected');
    await this.verifyElementDisplayed(this.fourHoursRadioButtonText, 'fourHoursRadioButtonText', '4 hours radio button text should be visible');
    const radioButtonText = await this.fourHoursRadioButtonText.getText();
    expect(radioButtonText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.fourHours);
    return this.self;
  }

  async verifyNeverRadioButtonUnselected(): Promise<this> {
    await this.verifyElementDisplayed(this.neverRadioButtonUnchoose, 'neverRadioButtonUnchoose', 'Never radio button should be unselected');
    await this.verifyElementDisplayed(this.neverRadioButtonText, 'neverRadioButtonText', 'Never radio button text should be visible');
    const radioButtonText = await this.neverRadioButtonText.getText();
    expect(radioButtonText).toBe(CUSTOM_SETTINGS_SECTION.autoLogout.timeoutOptions.never);
    return this.self;
  }

  /* ==================== SYNCING PAGE VERIFICATIONS ==================== */
  async verifySyncingPageDisplayed(): Promise<this> {
    await this.syncingPageTitle.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.syncingPageTitle, 'syncingPageTitle', 'Syncing page title should be visible');
    const titleText = await this.syncingPageTitle.getText();
    expect(titleText).toBe(SYNCING_PAGE.title);
    return this.self;
  }

  async verifyBlindPeeringSectionWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.blindPeeringSection, 'blindPeeringSection', 'Blind Peering section should be visible');
    await this.verifyElementDisplayed(this.blindPeeringSectionIcon, 'blindPeeringSectionIcon', 'Blind Peering section icon should be visible');
    await this.verifyElementDisplayed(this.blindPeeringSectionTitle, 'blindPeeringSectionTitle', 'Blind Peering section title should be visible');
    const titleText = await this.blindPeeringSectionTitle.getText();
    expect(titleText).toBe(BLIND_PEERING_SECTION.blindPeeringSectionTitle);
    await this.verifyElementDisplayed(this.blindPeeringSectionDescription, 'blindPeeringSectionDescription', 'Blind Peering section description should be visible');
    const descText = await this.blindPeeringSectionDescription.getText();
    expect(descText).toBe(BLIND_PEERING_SECTION.blindPeeringSectionDescription);
    await this.verifyElementDisplayed(this.blindPeeringSectionText, 'blindPeeringSectionText', 'Blind Peering section text should be visible');
    const sectionText = await this.blindPeeringSectionText.getText();
    expect(sectionText).toBe(BLIND_PEERING_SECTION.blindPeeringSectionText);
    await this.verifyElementDisplayed(this.blindPeeringSectionLearnMoreButton, 'blindPeeringSectionLearnMoreButton', 'Blind Peering Learn more button should be visible');
    const learnMoreText = await this.blindPeeringSectionLearnMoreButton.getText();
    expect(learnMoreText).toBe(BLIND_PEERING_SECTION.blindPeeringSectionLearnMoreButton);
    await this.verifyElementDisplayed(this.blindPeeringSectionLearnMoreButtonIcon, 'blindPeeringSectionLearnMoreButtonIcon', 'Blind Peering Learn more button icon should be visible');
    await this.verifyElementDisplayed(this.blindPeeringSectionToggleOff, 'blindPeeringSectionToggleOff', 'Blind Peering toggle should be visible');
    return this.self;
  }
  
  async tapBlindPeeringSectionInformationIcon(): Promise<this> {
    await this.blindPeeringSectionIcon.click();
    return this.self;
  }

  async verifyBlindPeeringSectionInformationPopupDisplayed(): Promise<this> {
    await this.blindPeeringSectionInformationPopup.waitForDisplayed({ timeout: 20000 });
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

    // Verify Popup Text 3
    await this.verifyElementDisplayed(this.blindPeeringSectionInformationPopupText3, 'blindPeeringSectionInformationPopupText3', 'Blind peering section information popup text 3 should be visible');
    const popupText3 = await this.blindPeeringSectionInformationPopupText3.getText();
    expect(popupText3).toBe(BLIND_PEERING_SECTION.informationPopup.text3);

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
    await this.blindPeeringInformationPage.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.blindPeeringInformationPage, 'blindPeeringInformationPage', 'Blind peering information page should be visible');
    const urlText = await this.blindPeeringInformationPage.getText();
    expect(urlText).toContain(BLIND_PEERING_SECTION.learnMoreUrl);
    
    return this.self;
  }

  async tapBlindPeeringSectionToggle(): Promise<this> {
    try {
      console.log('Waiting for blind peering toggle...');
      await this.blindPeeringSectionToggleOff.waitForDisplayed({ timeout: 20000 });
      const elementId = await this.blindPeeringSectionToggleOff.elementId;
      await driver.elementClick(elementId);
      console.log('Toggle clicked successfully');
      await browser.pause(2000); 
      return this.self;
    } catch (error: any) {
      console.error(`Failed to click toggle: ${error.message}`);
      const x = 842 + 65;
      const y = 570 + 37;
      
      console.log(`Tapping at coordinates: x=${x}, y=${y}`);
      
      await driver.execute('mobile: tap', {
        x: x,
        y: y,
        duration: 100 
      });
      await browser.pause(2000);
      return this.self;
    }
  }

  async verifyChooseYourBlindPeerPopupDisplayed(timeout: number = 20000): Promise<this> {
    try {
      await this.chooseBlindPeeringPopup.waitForDisplayed({ timeout });
      const isDisplayed = await this.chooseBlindPeeringPopup.isDisplayed();
      if (!isDisplayed) {
        throw new Error('Choose your Blind Peer popup is not displayed after waiting');
      }
      console.log('✓ Choose your Blind Peer popup is successfully displayed');
      return this;
    } catch (error: any) {
      throw new Error(
        `Failed to wait for Choose your Blind Peer popup display: ${error.message}`
      );
    }
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

  async verifyAutomaticBlindPeersToastDisplayed(maxWaitTime: number = 30000): Promise<this> {
    try {
      console.log('Waiting for Automatic Blind Peers toast...');
      
      await this.automaticBlindPeersToast.waitForDisplayed({ 
        timeout: maxWaitTime,
        timeoutMsg: `Automatic Blind Peers toast did not appear within ${maxWaitTime}ms`,
        interval: 1000
      });
      
      console.log('✓ Toast container found');
      
      const isToastDisplayed = await this.automaticBlindPeersToast.isDisplayed();
      if (!isToastDisplayed) {
        throw new Error('Toast container is not displayed');
      }

      await this.automaticBlindPeersToastText.waitForDisplayed({ 
        timeout: 20000,
        timeoutMsg: 'Toast text did not appear within timeout'
      });
      const toastText = await this.automaticBlindPeersToastText.getText();
      console.log(`Toast text: "${toastText}"`);
      
      expect(toastText).toBe(BLIND_PEERING_SECTION.toastMessages.automaticEnabled);
      
      console.log('✓ Automatic Blind Peers toast verified successfully');
      return this.self;
      
    } catch (error: any) {
      await browser.saveScreenshot(`toast_error_${Date.now()}.png`);
      throw new Error(`Failed to verify toast: ${error.message}`);
    }
  }

  async verifyAllNewElementsInYourBlindPeersSection(): Promise<this> {
    // Verify Your Blind Peers Text
    await this.yourBlindPeersText.waitForDisplayed({ timeout: 20000, timeoutMsg: 'Your Blind Peers text not visible' });
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
    await this.manualBlindPeersPopup.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.manualBlindPeersPopup, 'manualBlindPeersPopup', 'Manual Blind Peers popup should be visible');
    return this.self;
  }

  async verifyManualBlindPeersPopupElements(): Promise<this> {
    const popupWaitOpts = { timeout: 20000, timeoutMsg: 'Manual Blind Peers popup element not visible' };

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

  async acceptCookiesIfPresent(): Promise<this> {
    await browser.pause(3000);
    const isExisting = await this.allowAllCookiesButton.isExisting().catch(() => false);
    if (!isExisting) {
      return this.self;
    }
    await this.allowAllCookiesButton.waitForDisplayed({ timeout: 20000 });
    await this.allowAllCookiesButton.click();
    return this.self;
  }

  async enterCodeForBlindPeer(code: string): Promise<this> {
    await this.addHereYourCodeField.waitForDisplayed({ timeout: 20000 });
    await this.addHereYourCodeField.click();
    await this.addHereYourCodeField.setValue(code);
    return this.self;
  }

  async verifyInvalidCodeForBlindPeerWarningMessageDisplayed(maxWaitTime: number = 30000): Promise<this> {
    try {
      console.log('Waiting for invalid code warning toast...');
      
      await this.errorToastForManualBlindPeers.waitForDisplayed({ 
        timeout: maxWaitTime,
        timeoutMsg: `Invalid code error toast did not appear within ${maxWaitTime}ms`,
        interval: 1000 
      });
      
      console.log('✓ Error toast container found');
      
      const isToastDisplayed = await this.errorToastForManualBlindPeers.isDisplayed();
      if (!isToastDisplayed) {
        throw new Error('Error toast container is not displayed');
      }
      
      await this.errorToastForManualBlindPeersText.waitForDisplayed({ 
        timeout: 20000,
        timeoutMsg: 'Error toast text did not appear within timeout'
      });
      
      const errorText = await this.errorToastForManualBlindPeersText.getText();
      console.log(`Error text: "${errorText}"`);
      
      expect(errorText).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.errorMessage);
      
      console.log('✓ Invalid code warning toast verified successfully');
      return this.self;
      
    } catch (error: any) {
      await browser.saveScreenshot(`error_toast_${Date.now()}.png`);
      throw new Error(`Failed to verify error toast: ${error.message}`);
    }
  }

  async verifySuccessToastForManualBlindPeersDisplayed(maxWaitTime: number = 30000): Promise<this> {
    try {
      console.log('Waiting for manual blind peers success toast...');
      
      await this.successToastForManualBlindPeers.waitForDisplayed({ 
        timeout: maxWaitTime,
        timeoutMsg: `Success toast for manual blind peers did not appear within ${maxWaitTime}ms`,
        interval: 1000
      });
      
      console.log('✓ Success toast container found');
      
      const isToastDisplayed = await this.successToastForManualBlindPeers.isDisplayed();
      if (!isToastDisplayed) {
        throw new Error('Success toast container is not displayed');
      }
    
      await this.successToastForManualBlindPeersText.waitForDisplayed({ 
        timeout: 20000,
        timeoutMsg: 'Success toast text did not appear within timeout'
      });
  
      const successText = await this.successToastForManualBlindPeersText.getText();
      console.log(`Success text: "${successText}"`);
      
      expect(successText).toBe(BLIND_PEERING_SECTION.manualBlindPeersPopup.successMessage);
      
      console.log('✓ Manual blind peers success toast verified successfully');
      return this.self;
      
    } catch (error: any) {
      await browser.saveScreenshot(`success_toast_error_${Date.now()}.png`);
      throw new Error(`Failed to verify success toast: ${error.message}`);
    }
  }

  async verifyAllNewManualBlindPeersElementsInYourBlindPeersSection(): Promise<this> {
    await this.yourBlindPeersText.waitForDisplayed({ timeout: 20000 });

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
    await this.manualBlindPeersFieldIcon.waitForDisplayed({ timeout: 20000 });
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

  /* ==================== AUTOFILL PAGE VERIFICATIONS ==================== */
  async verifyAutofillPageDisplayed(): Promise<this> {
    await this.autofillPageTitle.waitForDisplayed({ timeout: 20000 });
    return this.self;
  }

  async verifyAutofillPageWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.autofillPageTitle, 'autofillPageTitle', 'Autofill page title should be visible');
    const pageTitleText = await this.autofillPageTitle.getText();
    expect(pageTitleText).toBe(AUTOFILL_SECTION.autofillPageTitle);
    await this.verifyElementDisplayed(this.autofillSection, 'autofillSection', 'Autofill section should be visible');
    await this.verifyElementDisplayed(this.autofillSectionTitle, 'autofillSectionTitle', 'Autofill section title should be visible');
    const sectionTitleText = await this.autofillSectionTitle.getText();
    expect(sectionTitleText).toBe(AUTOFILL_SECTION.autofillSectionTitle);
    await this.verifyElementDisplayed(this.autofillSectionDescription, 'autofillSectionDescription', 'Autofill section description should be visible');
    const descText = await this.autofillSectionDescription.getText();
    expect(descText).toBe(AUTOFILL_SECTION.autofillSectionDescription);
    await this.verifyElementDisplayed(this.autofillSectionSetAsDefaultButton, 'autofillSectionSetAsDefaultButton', 'Set as Default button should be visible');
    await this.verifyElementDisplayed(this.autofillSectionSetAsDefaultButtonText, 'autofillSectionSetAsDefaultButtonText', 'Set as Default button text should be visible');
    const buttonText = await this.autofillSectionSetAsDefaultButtonText.getText();
    expect(buttonText).toBe(AUTOFILL_SECTION.autofillSectionSetAsDefaultButtonText);
    return this.self;
  }

  async tapSetAsDefaultButton(): Promise<this> {
    await this.autofillSectionSetAsDefaultButton.click();
    return this.self;
  }

  async verifyAutofillPopupDisplayed(): Promise<this> {
    await this.autoFIllServicesToolbar.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.autoFIllServicesToolbar, 'autoFIllServicesToolbar', 'Autofill services toolbar should be visible');
    return this.self;
  }

  async verifyPearPassAppRadioButtonDisplayed(): Promise<this> {
    const popupWaitTimeout = 10000;

    // Verify Radio Button
    await this.autoFIllServicesPearPassRadioButton.waitForDisplayed({
      timeout: popupWaitTimeout,
      timeoutMsg: 'PearPass app radio button should be visible',
    });
    await this.verifyElementDisplayed(this.autoFIllServicesPearPassRadioButton, 'autoFIllServicesPearPassRadioButton', 'PearPass app radio button should be visible');

    // Verify Radio Button Text
    await this.autoFIllServicesPearPassRadioButtonText.waitForDisplayed({
      timeout: popupWaitTimeout,
      timeoutMsg: 'PearPass app radio button text should be visible',
    });
    await this.verifyElementDisplayed(this.autoFIllServicesPearPassRadioButtonText, 'autoFIllServicesPearPassRadioButtonText', 'PearPass app radio button text should be visible');
    const radioButtonText = await this.autoFIllServicesPearPassRadioButtonText.getText();
    expect(radioButtonText).toBe(AUTOFILL_SECTION.autofillService.pearPassAppName);

    // Verify Radio Button Icon
    await this.autoFIllServicesPearPassRadioButtonIcon.waitForDisplayed({
      timeout: popupWaitTimeout,
      timeoutMsg: 'PearPass app radio button icon should be visible',
    });
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

  /** Back on Android system "Change autofill provider" screen (`~Navigate up`). */
  async tapBackButtonInChangeAutofillProviderPage(): Promise<this> {
    await this.autoFIllServicesBackButton.waitForDisplayed({
      timeout: 20000,
      timeoutMsg: 'Change autofill provider back button (Navigate up) should be visible',
    });
    await this.autoFIllServicesBackButton.click();
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

  /* ==================== VAULT PAGE VERIFICATIONS ==================== */
  async verifyVaultPageDisplayed(): Promise<this> {
    await this.vaultPageTitle.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.vaultPageTitle, 'vaultPageTitle', 'Vault page title should be visible');
    const titleText = await this.vaultPageTitle.getText();
    expect(titleText).toBe(VAULT_PAGE.title);
    return this.self;
  }

  async verifyYourVaultSectionWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.vaultSection, 'vaultSection', 'Your Vault section should be visible');
    await this.verifyElementDisplayed(this.vaultSectionTitle, 'vaultSectionTitle', 'Your Vault section title should be visible');
    const sectionTitleText = await this.vaultSectionTitle.getText();
    expect(sectionTitleText).toBe(YOUR_VAULT_SECTION.vaultSectionTitle);
    await this.verifyElementDisplayed(this.vaultSectionDescription, 'vaultSectionDescription', 'Your Vault section description should be visible');
    const descText = await this.vaultSectionDescription.getText();
    expect(descText).toBe(YOUR_VAULT_SECTION.vaultSectionDescription);

    await this.verifyElementDisplayed(this.manageVaultsSectionItem, 'manageVaultsSectionItem', 'First vault item should be visible');
    await this.verifyElementDisplayed(this.manageVaultsSectionItemIcon, 'manageVaultsSectionItemIcon', 'First vault item icon should be visible');
    await this.verifyElementDisplayed(this.manageVaultsSectionItemEditIcon, 'manageVaultsSectionItemEditIcon', 'First vault item edit icon should be visible');
    await this.verifyElementDisplayed(this.manageVaultsSectionItemText, 'manageVaultsSectionItemText', 'First vault item text should be visible');
    const firstItemText = await this.manageVaultsSectionItemText.getText();
    expect(firstItemText).toBe(YOUR_VAULT_SECTION.manageVaultsSectionItemText);
    await this.verifyElementDisplayed(this.manageVaultsSectionItemDate, 'manageVaultsSectionItemDate', 'First vault item date should be visible');
    const firstItemDate = await this.manageVaultsSectionItemDate.getText();
    expect(firstItemDate).toBe(YOUR_VAULT_SECTION.manageVaultsSectionItemDate);

    // await this.verifyElementDisplayed(this.manageVaultsSectionSecondItem, 'manageVaultsSectionSecondItem', 'Second vault item should be visible');
    // await this.verifyElementDisplayed(this.manageVaultsSectionSecondItemIcon, 'manageVaultsSectionSecondItemIcon', 'Second vault item icon should be visible');
    // await this.verifyElementDisplayed(this.manageVaultsSectionSecondItemEditIcon, 'manageVaultsSectionSecondItemEditIcon', 'Second vault item edit icon should be visible');
    // await this.verifyElementDisplayed(this.manageVaultsSectionSecondItemText, 'manageVaultsSectionSecondItemText', 'Second vault item text should be visible');
    // const secondItemText = await this.manageVaultsSectionSecondItemText.getText();
    // expect(secondItemText).toBe(YOUR_VAULT_SECTION.manageVaultsSectionSecondItemText);
    // await this.verifyElementDisplayed(this.manageVaultsSectionSecondItemDate, 'manageVaultsSectionSecondItemDate', 'Second vault item date should be visible');
    // const secondItemDate = await this.manageVaultsSectionSecondItemDate.getText();
    // expect(secondItemDate).toBe(YOUR_VAULT_SECTION.manageVaultsSectionSecondItemDate);

    return this.self;
  }
/* ==================== YOUR VAULT SECTION VERIFICATIONS ==================== */
  async tapManageVaultsSectionItemEditIcon(): Promise<this> {
    await this.manageVaultsSectionItemEditIcon.click();
    return this.self;
  }

  async tapBackButtonAtVaultsSection(): Promise<this> {
    await this.backButtonAtVaultsSection.click();
    return this.self;
  }

  async verifyManageVaultsSectionFirstItemText(expectedText: string): Promise<this> {
    await this.newVaultNameAtVaultsSection.waitForDisplayed({ timeout: 20000, timeoutMsg: 'First vault item text (new vault name) not visible' });
    await this.verifyElementDisplayed(this.newVaultNameAtVaultsSection, 'newVaultNameAtVaultsSection', 'First vault item text should be visible');
    const displayedText = await this.newVaultNameAtVaultsSection.getText();
    expect(displayedText).toBe(expectedText);
    return this.self;
  }

  async verifyChangeVaultNamePopup(): Promise<this> {
    await this.changeVaultNamePopUp.waitForDisplayed({ timeout: 20000 });
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
    await this.changeVaultNamePopUpWindow.waitForDisplayed({ timeout: 20000 });
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
    
    // Verify Save Button
    await this.verifyElementDisplayed(this.changeVaultNamePopUpWindowSaveButton, 'changeVaultNamePopUpWindowSaveButton', 'Save button should be visible');
    await this.verifyElementDisplayed(this.changeVaultNamePopUpWindowSaveButtonText, 'changeVaultNamePopUpWindowSaveButtonText', 'Save button text should be visible');
    const saveButtonText = await this.changeVaultNamePopUpWindowSaveButtonText.getText();
    expect(saveButtonText).toBe(CHANGE_VAULT_NAME_POPUP.buttons.save);
    
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

  async tapChangeVaultNamePopUpWindowSaveButton(): Promise<this> {
    await this.changeVaultNamePopUpWindowSaveButton.click();
    return this.self;
  }

  async verifyChangeVaultNamePopupWindowNotDisplayed(): Promise<this> {
    await this.changeVaultNamePopUpWindow.waitForDisplayed({ reverse: true, timeout: 20000 });
    const isDisplayed = await this.changeVaultNamePopUpWindow.isDisplayed().catch(() => false);
    if (isDisplayed) {
      throw new Error('Change Vault Name popup window should not be displayed');
    }
    return this.self;
  }
  
  async verifyExportSectionWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.exportVaultSection, 'exportVaultSection', 'Export Vault section should be visible');
    await this.verifyElementDisplayed(this.exportVaultSectionTitle, 'exportVaultSectionTitle', 'Export Vault section title should be visible');
    const sectionTitleText = await this.exportVaultSectionTitle.getText();
    expect(sectionTitleText).toBe(EXPORT_SECTION.exportVaultSectionTitle);
    await this.verifyElementDisplayed(this.exportVaultSectionDescription, 'exportVaultSectionDescription', 'Export Vault section description should be visible');
    const descText = await this.exportVaultSectionDescription.getText();
    expect(descText).toBe(EXPORT_SECTION.exportVaultSectionDescription);

    await this.verifyElementDisplayed(this.vaults1, 'vaults1', 'First export vault item should be visible');
    await this.verifyElementDisplayed(this.vaults1Icon, 'vaults1Icon', 'First export vault icon should be visible');
    await this.verifyElementDisplayed(this.newVaultNameAtExportSection, 'newVaultNameAtExportSection', 'First vault name at export section should be visible');
    await this.verifyElementDisplayed(this.vaults1Text, 'vaults1Text', 'First export vault text should be visible');
    const vaults1TextValue = await this.vaults1Text.getText();
    expect(vaults1TextValue).toBe(EXPORT_SECTION.vaults1Text);
    await this.verifyElementDisplayed(this.vaults1Date, 'vaults1Date', 'First export vault date should be visible');
    const vaults1DateValue = await this.vaults1Date.getText();
    expect(vaults1DateValue).toBe(EXPORT_SECTION.vaults1Date);

    await this.verifyElementDisplayed(this.vaults2, 'vaults2', 'Second export vault item should be visible');
    await this.verifyElementDisplayed(this.vaults2Icon, 'vaults2Icon', 'Second export vault icon should be visible');
    await this.verifyElementDisplayed(this.vaults2Text, 'vaults2Text', 'Second export vault text should be visible');
    const vaults2TextValue = await this.vaults2Text.getText();
    expect(vaults2TextValue).toBe(EXPORT_SECTION.vaults2Text);
    await this.verifyElementDisplayed(this.vaults2Date, 'vaults2Date', 'Second export vault date should be visible');
    const vaults2DateValue = await this.vaults2Date.getText();
    expect(vaults2DateValue).toBe(EXPORT_SECTION.vaults2Date);

    await this.verifyElementDisplayed(this.exportSectionText, 'exportSectionText', 'Export section text should be visible');
    const exportSectionTextValue = await this.exportSectionText.getText();
    expect(exportSectionTextValue).toBe(EXPORT_SECTION.exportSectionText);
    await this.verifyElementDisplayed(this.csvRadioButton, 'csvRadioButton', 'CSV radio button should be visible');
    await this.verifyElementDisplayed(this.csvRadioButtonText, 'csvRadioButtonText', 'CSV radio button text should be visible');
    const csvText = await this.csvRadioButtonText.getText();
    expect(csvText).toBe(EXPORT_SECTION.csvRadioButtonText);
    await this.verifyElementDisplayed(this.csvRadioButtonUnchoose, 'csvRadioButtonUnchoose', 'CSV radio button unchoose should be visible');
    await this.verifyElementDisplayed(this.jsonRadioButton, 'jsonRadioButton', 'JSON radio button should be visible');
    await this.verifyElementDisplayed(this.jsonRadioButtonText, 'jsonRadioButtonText', 'JSON radio button text should be visible');
    const jsonText = await this.jsonRadioButtonText.getText();
    expect(jsonText).toBe(EXPORT_SECTION.jsonRadioButtonText);
    await this.verifyElementDisplayed(this.jsonRadioButtonChoose, 'jsonRadioButtonChoose', 'JSON radio button choose should be visible');
    await this.verifyElementDisplayed(this.exportButton, 'exportButton', 'Export button should be visible');
    await this.verifyElementDisplayed(this.exportButtonText, 'exportButtonText', 'Export button text should be visible');
    const exportButtonTextValue = await this.exportButtonText.getText();
    expect(exportButtonTextValue).toBe(EXPORT_SECTION.exportButtonText);

    return this.self;
  }

/* ==================== EXPORT SECTION VERIFICATIONS ==================== */

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
    await this.vault1ChooseIcon.waitForDisplayed({ timeout: 20000 });
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
    await this.exportVaultsPopup.waitForDisplayed({ timeout: 20000 });
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
    await this.exportVaultsInValidPasswordWarningIcon.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.exportVaultsInValidPasswordWarningIcon, 'exportVaultsInValidPasswordWarningIcon', 'Invalid password warning icon should be visible');
    await this.verifyElementDisplayed(this.exportVaultsInValidPasswordWarningText, 'exportVaultsInValidPasswordWarningText', 'Invalid password warning text should be visible');
    const warningText = await this.exportVaultsInValidPasswordWarningText.getText();
    expect(warningText).toBe(EXPORT_SECTION.popup.invalidPasswordWarning);
    return this.self;
  }

  async verifyVaultsSavedMessageDisplayed(): Promise<this> {
    await this.vaultsSavedMessage1.waitForDisplayed({ timeout: 20000 });
    await this.vaultsSavedMessage2.waitForDisplayed({ timeout: 20000 });

    await this.verifyElementDisplayed(this.vaultsSavedMessage1, 'vaultsSavedMessage1', 'Share sheet headline should be visible');
    const headlineText = (await this.vaultsSavedMessage1.getText()).trim();
    expect(headlineText).toBe(EXPORT_SECTION.vaultsSavedMessage.headline);
    return this.self;
  }

  async verifyToastMessageDisplayed(): Promise<this> {
    await this.exportSuccessToast.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.exportSuccessToast, 'exportSuccessToast', 'Export success toast should be visible');
    
    await this.verifyElementDisplayed(this.exportSuccessToastTitle, 'exportSuccessToastTitle', 'Export success toast title should be visible');
    const toastTitle = await this.exportSuccessToastTitle.getText();
    expect(toastTitle).toBe(EXPORT_SECTION.successToast.title);
    
    await this.verifyElementDisplayed(this.exportSuccessToastText, 'exportSuccessToastText', 'Export success toast text should be visible');
    const toastText = await this.exportSuccessToastText.getText();
    expect(toastText).toBe(EXPORT_SECTION.successToast.text);
    
    return this.self;
  } 

  async verifyToastMessageNoDataToExportDisplayed(): Promise<this> {
    await this.exportSuccessToast.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.noDataToExportToast, 'noDataToExportToast', 'No data export toast should be visible');
    
    await this.verifyElementDisplayed(this.noDataToExportToastTitle, 'noDataToExportToastTitle', 'No data export success toast title should be visible');
    const toastTitle = await this.noDataToExportToastTitle.getText();
    expect(toastTitle).toBe(EXPORT_SECTION.noDataToExportToast.title);
    
    await this.verifyElementDisplayed(this.noDataToExportToastText, 'noDataToExportToastText', 'No data export toast text should be visible');
    const toastText = await this.noDataToExportToastText.getText();
    expect(toastText).toBe(EXPORT_SECTION.noDataToExportToast.text);
    
    return this.self;
  }

  /* ==================== IMPORT SECTION VERIFICATIONS ==================== */  

  async verifyImportSection(): Promise<this> {
    // Verify Import Section Title
    await this.verifyElementDisplayed(this.importVaultSectionTitle, 'importVaultSectionTitle', 'Import section title should be visible');
    const titleText = await this.importVaultSectionTitle.getText();
    expect(titleText).toBe(IMPORT_SECTION.title);
    
    // Verify Import Section Description
    await this.verifyElementDisplayed(this.importVaultSectionDescription, 'importVaultSectionDescription', 'Import section description should be visible');
    const descriptionText = await this.importVaultSectionDescription.getText();
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

  async verifyKeePassButtonWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.keePassButton, 'keePassButton', 'KeePass button should be visible');
    await this.verifyElementDisplayed(this.keePassButtonIcon, 'keePassButtonIcon', 'KeePass button icon should be visible');
    
    await this.verifyElementDisplayed(this.keePassButtonName, 'keePassButtonName', 'KeePass button name should be visible');
    const buttonName = await this.keePassButtonName.getText();
    expect(buttonName).toBe(IMPORT_SECTION.importSources.keePass.name);
    
    await this.verifyElementDisplayed(this.keePassButtonText, 'keePassButtonText', 'KeePass button text should be visible');
    const buttonText = await this.keePassButtonText.getText();
    expect(buttonText).toBe(IMPORT_SECTION.importSources.keePass.formats);
    
    return this.self;
  }

  async verifyKeePassXCButtonWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.keePassXCButton, 'keePassXCButton', 'KeePassXC button should be visible');
    await this.verifyElementDisplayed(this.keePassXCButtonIcon, 'keePassXCButtonIcon', 'KeePassXC button icon should be visible');
    
    await this.verifyElementDisplayed(this.keePassXCButtonName, 'keePassXCButtonName', 'KeePassXC button name should be visible');
    const buttonName = await this.keePassXCButtonName.getText();
    expect(buttonName).toBe(IMPORT_SECTION.importSources.keePassXC.name);
    
    await this.verifyElementDisplayed(this.keePassXCButtonText, 'keePassXCButtonText', 'KeePassXC button text should be visible');
    const buttonText = await this.keePassXCButtonText.getText();
    expect(buttonText).toBe(IMPORT_SECTION.importSources.keePassXC.formats);
    
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

  async verifyEncryptedFileButtonWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.encryptedFileButton, 'encryptedFileButton', 'Encrypted file button should be visible');
    await this.verifyElementDisplayed(this.encryptedFileButtonIcon, 'encryptedFileButtonIcon', 'Encrypted file button icon should be visible');
    
    await this.verifyElementDisplayed(this.encryptedFileButtonName, 'encryptedFileButtonName', 'Encrypted file button name should be visible');
    const buttonName = await this.encryptedFileButtonName.getText();
    expect(buttonName).toBe(IMPORT_SECTION.importSources.encryptedFile.name);
    
    await this.verifyElementDisplayed(this.encryptedFileButtonText, 'encryptedFileButtonText', 'Encrypted file button text should be visible');
    const buttonText = await this.encryptedFileButtonText.getText();
    expect(buttonText).toBe(IMPORT_SECTION.importSources.encryptedFile.formats);
    
    return this.self;
  }

  async tapOnePasswordButton(): Promise<this> {
    await this.onePasswordButton.click();
    return this.self;
  }

  private getDropTextElement(walletType: DropTextWalletType) {
    const elementMap = {
      onePassword: this.importVaultPopupTextOnePassword,
      bitwarden: this.importVaultPopupTextBitwarden,
      lastPass: this.importVaultPopupTextLastPass,
      nordPass: this.importVaultPopupTextNordPass,
      protonPass: this.importVaultPopupTextProtonPass,
      unencryptedFile: this.importVaultPopupTextUnencryptedFile,
      encryptedFile: this.importVaultPopupTextEncryptedFile,
    };
    return elementMap[walletType];
  }

  async verifyImportVaultPopupWithDropTextDisplayed(walletType: DropTextWalletType): Promise<this> {
    await this.importVaultPopup.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.importVaultPopup, 'importVaultPopup', 'Import Vault popup should be visible');

    await this.verifyElementDisplayed(this.importVaultPopupTitle, 'importVaultPopupTitle', 'Import Vault popup title should be visible');
    const titleText = await this.importVaultPopupTitle.getText();
    expect(titleText).toBe(IMPORT_VAULT_POPUP.title);

    const dropTextElement = this.getDropTextElement(walletType);
    await this.verifyElementDisplayed(dropTextElement, `importVaultPopupText${walletType}`, `${walletType} drop text should be visible`);
    const dropText = await dropTextElement.getText();
    expect(dropText).toBe(IMPORT_VAULT_POPUP.dropTexts[walletType]);

    await this.verifyElementDisplayed(this.importVaultPopupText, 'importVaultPopupText', 'Max file size text should be visible');
    const maxFileSizeText = await this.importVaultPopupText.getText();
    expect(maxFileSizeText).toBe(IMPORT_VAULT_POPUP.maxFileSizeText);

    await this.verifyElementDisplayed(this.importVaultPopupBrowseFolderButton, 'importVaultPopupBrowseFolderButton', 'Browse Folder button should be visible');
    await this.verifyElementDisplayed(this.importVaultPopupBrowseFolderButtonText, 'importVaultPopupBrowseFolderButtonText', 'Browse Folder button text should be visible');
    const browseFolderText = await this.importVaultPopupBrowseFolderButtonText.getText();
    expect(browseFolderText).toBe(IMPORT_VAULT_POPUP.browseFolderButtonText);

    return this.self;
  }

  private getFileNameElement(walletType: ImportWalletType) {
    const elementMap = {
      onePassword: this.importVaultPopupText2OnePassword,
      bitwarden: this.importVaultPopupText2Bitwarden,
      bitwardenJson: this.importVaultPopupText2BitwardenJson,
      lastPass: this.importVaultPopupText2LastPass,
      nordPass: this.importVaultPopupText2NordPass,
      protonPass: this.importVaultPopupText2ProtonPass,
      protonPassJson: this.importVaultPopupText2ProtonPassJson,
      unencryptedFile: this.importVaultPopupText2UnencryptedFile,
      unencryptedFileJson: this.importVaultPopupText2UnencryptedFileJson,
      encryptedFile: this.importVaultPopupText2EncryptedFile,
    };
    return elementMap[walletType];
  }

  async verifyImportVaultPopupDisplayed(walletType: ImportWalletType): Promise<this> {
    await this.importVaultPopup.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.importVaultPopup, 'importVaultPopup', 'Import Vault popup should be visible');

    await this.verifyElementDisplayed(this.importVaultPopupTitle, 'importVaultPopupTitle', 'Import Vault popup title should be visible');
    const titleText = await this.importVaultPopupTitle.getText();
    expect(titleText).toBe(IMPORT_VAULT_POPUP.title);

    await this.verifyElementDisplayed(this.importVaultPopupIcon, 'importVaultPopupIcon', 'Import Vault popup icon should be visible');

    const fileNameElement = this.getFileNameElement(walletType);
    await this.verifyElementDisplayed(fileNameElement, `importVaultPopupText2${walletType}`, `${walletType} file name should be visible`);
    const fileName = await fileNameElement.getText();
    expect(fileName).toBe(IMPORT_VAULT_POPUP.fileNames[walletType]);

    await this.verifyElementDisplayed(this.importVaultPopupDeleteButton, 'importVaultPopupDeleteButton', 'Delete button should be visible');

    await this.verifyElementDisplayed(this.importVaultPopupText2, 'importVaultPopupText2', 'Import selected file text should be visible');
    const importSelectedText = await this.importVaultPopupText2.getText();
    expect(importSelectedText).toBe(IMPORT_VAULT_POPUP.importSelectedFileText);

    await this.verifyElementDisplayed(this.importVaultPopupImportButton, 'importVaultPopupImportButton', 'Import button should be visible');
    await this.verifyElementDisplayed(this.importVaultPopupImportButtonText, 'importVaultPopupImportButtonText', 'Import button text should be visible');
    const importButtonText = await this.importVaultPopupImportButtonText.getText();
    expect(importButtonText).toBe(IMPORT_VAULT_POPUP.importButtonText);

    return this.self;
  }

  async tapBrowseFolderButton(): Promise<this> {
    await this.importVaultPopupBrowseFolderButton.click();
    return this.self;
  }

  async tapImportVaultPopupImportButton(): Promise<this> {
    await this.importVaultPopupImportButton.click();
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
    await this.downloadsFolderTitle.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.downloadsFolderTitle, 'downloadsFolderTitle', 'Downloads folder title should be visible');
    return this.self;
  }

  async chooseOnePasswordFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 20000;
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
    const waitTimeout = 20000;
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
    const waitTimeout = 20000;
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
    const waitTimeout = 20000;
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
    const waitTimeout = 20000;
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
    const waitTimeout = 20000;
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
    const waitTimeout = 20000;
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
    const waitTimeout = 20000;
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
    const waitTimeout = 20000;
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
    await this.vaultsImportedSuccessfullyToast.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.vaultsImportedSuccessfullyToast, 'vaultsImportedSuccessfullyToast', 'Vaults imported successfully toast should be visible');
    
    await this.verifyElementDisplayed(this.vaultsImportedSuccessfullyToastText, 'vaultsImportedSuccessfullyToastText', 'Vaults imported successfully toast text should be visible');
    const toastText = await this.vaultsImportedSuccessfullyToastText.getText();
    expect(toastText).toBe(IMPORT_SECTION.toastMessages.importSuccess);
    
    return this.self;
  }

  /* ==================== LINKED DEVICES SECTION VERIFICATIONS ==================== */
  async verifyLinkedDevicesSectionWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.linkedDevicesSection, 'linkedDevicesSection', 'Linked devices section should be visible');
    await this.verifyElementDisplayed(this.linkedDevicesSectionTitle, 'linkedDevicesSectionTitle', 'Linked devices section title should be visible');
    const sectionTitleText = await this.linkedDevicesSectionTitle.getText();
    expect(sectionTitleText).toBe(LINKED_DEVICES_SECTION.linkedDevicesSectionTitle);
    await this.verifyElementDisplayed(this.linkedDevicesSectionDescription, 'linkedDevicesSectionDescription', 'Linked devices section description should be visible');
    const descText = await this.linkedDevicesSectionDescription.getText();
    expect(descText).toBe(LINKED_DEVICES_SECTION.linkedDevicesSectionDescription);

    await this.verifyElementDisplayed(this.linkedDevicesSectionItem, 'linkedDevicesSectionItem', 'Linked devices section item should be visible');
    await this.verifyElementDisplayed(this.linkedDevicesSectionItemIcon, 'linkedDevicesSectionItemIcon', 'Linked devices section item icon should be visible');
    await this.verifyElementDisplayed(this.linkedDevicesSectionItemText, 'linkedDevicesSectionItemText', 'Linked devices section item text should be visible');
    const itemText = await this.linkedDevicesSectionItemText.getText();
    expect(itemText).toBe(LINKED_DEVICES_SECTION.linkedDevicesSectionItemText);
    await this.verifyElementDisplayed(this.linkedDevicesSectionItemDate, 'linkedDevicesSectionItemDate', 'Linked devices section item date should be visible');
    const itemDate = await this.linkedDevicesSectionItemDate.getText();
    expect(itemDate).toBe(LINKED_DEVICES_SECTION.linkedDevicesSectionItemDate);

    await this.verifyElementDisplayed(this.addDeviceButton, 'addDeviceButton', 'Add device button should be visible');
    await this.verifyElementDisplayed(this.addDeviceButtonText, 'addDeviceButtonText', 'Add device button text should be visible');
    const addDeviceText = await this.addDeviceButtonText.getText();
    expect(addDeviceText).toBe(LINKED_DEVICES_SECTION.addDeviceButtonText);

    return this.self;
  }

  async tapAddDeviceButton(): Promise<this> {
    await this.addDeviceButton.click();
    return this.self;
  }

    /* ==================== APPEARANCE PAGE VERIFICATIONS ==================== */
  async verifyAppearancePageDisplayed(): Promise<this> {
    await this.appearancePageTitle.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.appearancePageTitle, 'appearancePageTitle', 'Appearance page title should be visible');
    const titleText = await this.appearancePageTitle.getText();
    expect(titleText).toBe(APPEARANCE_PAGE.title);
    return this.self;
  }

  async verifyLanguageSectionWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.languageSection, 'languageSection', 'Language section should be visible');
    await this.verifyElementDisplayed(this.languageSectionTitle, 'languageSectionTitle', 'Language section title should be visible');
    const sectionTitleText = await this.languageSectionTitle.getText();
    expect(sectionTitleText).toBe(LANGUAGE_SECTION.languageSectionTitle);
    await this.verifyElementDisplayed(this.languageSectionDescription, 'languageSectionDescription', 'Language section description should be visible');
    const descText = await this.languageSectionDescription.getText();
    expect(descText).toBe(LANGUAGE_SECTION.languageSectionDescription);
    await this.verifyElementDisplayed(this.languageDropdown, 'languageDropdown', 'Language dropdown should be visible');
    await this.verifyElementDisplayed(this.languageDropdownIcon, 'languageDropdownIcon', 'Language dropdown icon should be visible');
    await this.verifyElementDisplayed(this.languageDropdownText, 'languageDropdownText', 'Language dropdown text should be visible');
    const dropdownText = await this.languageDropdownText.getText();
    expect(dropdownText).toBe(LANGUAGE_SECTION.languageDropdownText);
    return this.self;
  }

  async tapLanguageDropdown(): Promise<this> {
    await this.languageDropdown.click();
    return this.self;
  }

  async verifyLanguageDropdownMenu(): Promise<this> {
    await this.languageDropdownMenu.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.languageDropdownMenu, 'languageDropdownMenu', 'Language dropdown menu should be visible');
    
    const languageText = await this.languageDropdownText.getText();
    expect(languageText).toBe(LANGUAGE_SECTION.defaultLanguage);
    
    return this.self;
  }

  /* ==================== ABOUT PAGE VERIFICATIONS ==================== */
  async verifyAboutPageDisplayed(): Promise<this> {
    await this.aboutPageTitle.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.aboutPageTitle, 'aboutPageTitle', 'About page title should be visible');
    const titleText = await this.aboutPageTitle.getText();
    expect(titleText).toBe(ABOUT_PAGE.title);
    return this.self;
  }

  async verifyReportProblemSectionWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.reportProblemSection, 'reportProblemSection', 'Report problem section should be visible');
    await this.verifyElementDisplayed(this.reportProblemSectionTitle, 'reportProblemSectionTitle', 'Report problem section title should be visible');
    const sectionTitleText = await this.reportProblemSectionTitle.getText();
    expect(sectionTitleText).toBe(REPORT_PROBLEM_SECTION.reportProblemSectionTitle);
    await this.verifyElementDisplayed(this.issueInputField, 'issueInputField', 'Issue input field should be visible');
    await this.verifyElementDisplayed(this.sendButton, 'sendButton', 'Send button should be visible');
    await this.verifyElementDisplayed(this.sendButtonText, 'sendButtonText', 'Send button text should be visible');
    const sendButtonTextValue = await this.sendButtonText.getText();
    expect(sendButtonTextValue).toBe(REPORT_PROBLEM_SECTION.sendButtonText);
    return this.self;
  }

  async verifyPearPassVersionSectionWithAllElements(): Promise<this> {
    await this.verifyElementDisplayed(this.versionSection, 'versionSection', 'Version section should be visible');
    await this.verifyElementDisplayed(this.versionSectionTitle, 'versionSectionTitle', 'Version section title should be visible');
    const sectionTitleText = await this.versionSectionTitle.getText();
    expect(sectionTitleText).toBe(VERSION_SECTION.versionSectionTitle);
    await this.verifyElementDisplayed(this.versionSectionDescription, 'versionSectionDescription', 'Version section description should be visible');
    const descText = await this.versionSectionDescription.getText();
    expect(descText).toBe(VERSION_SECTION.versionSectionDescription);
    await this.verifyElementDisplayed(this.appVersionText, 'appVersionText', 'App version text should be visible');
    const appVersionLabel = await this.appVersionText.getText();
    expect(appVersionLabel).toBe(VERSION_SECTION.appVersionText);
    await this.verifyElementDisplayed(this.appVersionValue, 'appVersionValue', 'App version value should be visible');
    const appVersionVal = await this.appVersionValue.getText();
    expect(appVersionVal).toBe(VERSION_SECTION.appVersionValue);
    await this.verifyElementDisplayed(this.termsOfUseLink, 'termsOfUseLink', 'Terms of use link should be visible');
    await this.verifyElementDisplayed(this.termsOfUseLinkText, 'termsOfUseLinkText', 'Terms of use link text should be visible');
    const termsText = await this.termsOfUseLinkText.getText();
    expect(termsText).toBe(VERSION_SECTION.termsOfUseLinkText);
    await this.verifyElementDisplayed(this.privacyStatementLink, 'privacyStatementLink', 'Privacy statement link should be visible');
    await this.verifyElementDisplayed(this.privacyStatementLinkText, 'privacyStatementLinkText', 'Privacy statement link text should be visible');
    const privacyText = await this.privacyStatementLinkText.getText();
    expect(privacyText).toBe(VERSION_SECTION.privacyStatementLinkText);
    await this.verifyElementDisplayed(this.visitOurWebsiteText, 'visitOurWebsiteText', 'Visit our website text should be visible');
    const visitText = await this.visitOurWebsiteText.getText();
    expect(visitText).toBe(VERSION_SECTION.visitOurWebsiteText);
    await this.verifyElementDisplayed(this.visitOurWebsiteLinkIcon, 'visitOurWebsiteLinkIcon', 'Visit our website link icon should be visible');
    await this.verifyElementDisplayed(this.visitOurWebsiteLink, 'visitOurWebsiteLink', 'Visit our website link should be visible');
    const linkText = await this.visitOurWebsiteLink.getText();
    expect(linkText).toBe(VERSION_SECTION.visitOurWebsiteLink);
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
    await this.feedbackSentToast.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.feedbackSentToast, 'feedbackSentToast', 'Feedback sent toast should be visible');
    
    await this.verifyElementDisplayed(this.feedbackSentToastText, 'feedbackSentToastText', 'Feedback sent toast text should be visible');
    
    const toastText = await this.feedbackSentToastText.getText();
    expect(toastText).toBe(REPORT_PROBLEM_SECTION.feedbackSentToastText);
    
    return this.self;
  }

  /* ==================== VERSION SECTION VERIFICATIONS ==================== */
  async tapTermsOfUseLink(): Promise<this> {
    await this.termsOfUseLink.click();
    return this.self;
  }

  async tapPrivacyStatementLink(): Promise<this> {
    await this.privacyStatementLink.click();
    return this.self;
  }

  async verifyTermsOfUsePage(): Promise<this> {
    await this.termsOfUseLinkPageTitle.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.termsOfUseLinkPageTitle, 'termsOfUseLinkPageTitle', 'Terms of Use page title should be visible');
    
    const pageTitleText = await this.termsOfUseLinkPageTitle.getText();
    expect(pageTitleText).toBe(LEGAL_LINKS.termsOfUsePageTitle);
    
    return this.self;
  }

  async verifyPrivacyStatementPage(): Promise<this> {
    await this.privacyStatementLinkPageTitle.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.privacyStatementLinkPageTitle, 'privacyStatementLinkPageTitle', 'Privacy Statement page title should be visible');
    
    const pageTitleText = await this.privacyStatementLinkPageTitle.getText();
    expect(pageTitleText).toBe(LEGAL_LINKS.privacyStatementPageTitle);
    
    return this.self;
  }

  async tapVisitOurWebsiteLink(): Promise<this> {
    await this.visitOurWebsiteLinkIcon.click();
    return this.self;
  }

  async verifyVisitOurWebsitePage(): Promise<this> {
    await this.pearPassWebsite.waitForDisplayed({ timeout: 20000 });
    await this.verifyElementDisplayed(this.pearPassWebsite, 'pearPassWebsite', 'PearPass website (Chrome url bar) should be visible');
    const urlText = await this.pearPassWebsite.getText();
    expect(urlText).toContain(VERSION_SECTION.visitOurWebsiteLink);
    return this.self;
  }

  /* ==================== SETTINGS PAGE NAVIGATION ==================== */

  async tapSecurityButton(): Promise<this> {
    await this.securityButton.click();
    return this.self;
  }

  async tapSyncingButton(): Promise<this> {
    await this.syncingButton.click();
    return this.self;
  }

  async tapAutofillButton(): Promise<this> {
    await this.autofillButton.click();
    return this.self;
  }

  async tapVaultButton(): Promise<this> {
    await this.vaultButton.click();
    return this.self;
  }

  async tapAppearanceButton(): Promise<this> {
    await this.appearanceButton.click();
    return this.self;
  }

  async tapAboutButton(): Promise<this> {
    await this.aboutButton.click();
    return this.self;
  }

  async tapBackButton(): Promise<this> {
    await this.backButton.click();
    return this.self;
  }

  async swipeToUp(): Promise<this> {
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
    await browser.pause(1500);
    return this.self;
  }

  async swipeToDown(): Promise<this> {
    for (let i = 0; i < 2; i++) {
      await this.swipe('down', 0.8);
      await browser.pause(500);
    }
    await browser.pause(1500);
    return this.self;
  }
}

export default SettingsPage;