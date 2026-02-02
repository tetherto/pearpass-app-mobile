const settingsLocators = {
/* ============================
        GENERAL
============================ */
  generalTab: '//android.widget.TextView[@text="General"]',
  vaultsTab: '//android.widget.TextView[@text="Vaults"]',
  exportTab: '//android.widget.TextView[@text="Export"]',
  importTab: '//android.widget.TextView[@text="Import"]',
  advancedTab: '//android.widget.TextView[@text="Advanced"]',
/* ============================
        LEGAL LINKS
============================ */
  termsOfUseLink: '//android.widget.TextView[@text="Terms of Use"]',
  privacyStatementLink: '//android.widget.TextView[@text="Privacy Statement"]',
  termsOfUseLinkPageTitle: '//android.widget.TextView[@text="PearPass Application Terms of Use"]',
  privacyStatementLinkPageTitle: '//android.widget.TextView[@text="PearPass Application Privacy Statement"]',
/* ============================
        GENERAL - LANGUAGE SECTION
============================ */     
  languageSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  languageSectionTitle: '//android.widget.TextView[@text="Language"]',
  languageDropdown: '~English',
  languageDropdownIcon:'//android.widget.Button[@content-desc="English"]/com.horcrux.svg.SvgView',
  languageDropdownText:'//android.widget.TextView[@text="English"]',
  languageDropdownMenu: '//android.view.ViewGroup[@content-desc="English"]',
/* ============================
        GENERAL - PASSWORDS SECTION
============================ */ 
  passwordsSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
  passwordSectionTitle: '//android.widget.TextView[@text="Passwords"]',
  masterVaultField: '~Master Vault',
  masterVaultFieldText: '//android.widget.TextView[@text="Master Vault"]',
  masterVaultFieldFirstIcon: '//android.view.ViewGroup[@content-desc="Master Vault"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
  masterVaultFieldEditIcon: '//android.view.ViewGroup[@content-desc="Master Vault"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',

  modifyMasterPasswordPopUp: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]',
  modifyMasterPasswordPopUpTitle: '//android.widget.TextView[@text="Modify master password"]',
  
  modifyMasterPasswordPopUpOldPasswordFieldText: '//android.widget.TextView[@text="Insert old password"]',
  modifyMasterPasswordPopUpInsertOldPasswordField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]',
  modifyMasterPasswordPopUpInsertOldPasswordInput: '~insert-old-password-input-field',
  modifyMasterPasswordPopUpInsertOldPasswordFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
  modifyMasterPasswordPopUpInsertOldPasswordFieldToggleVisibility: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup',
  
  modifyMasterPasswordPopUpCreateNewPasswordFieldText: '//android.widget.TextView[@text="Create new password"]',
  modifyMasterPasswordPopUpCreateNewPasswordField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[4]',
  modifyMasterPasswordPopUpCreateNewPasswordInput: '~create-new-password-input-field',
  modifyMasterPasswordPopUpCreateNewPasswordFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[4]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
  modifyMasterPasswordPopUpCreateNewPasswordFieldToggleVisibility: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[4]/android.view.ViewGroup',

  modifyMasterPasswordPopUpRepeatNewPasswordFieldText: '//android.widget.TextView[@text="Repeat new password"]',
  modifyMasterPasswordPopUpRepeatNewPasswordField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[5]',
  modifyMasterPasswordPopUpRepeatNewPasswordInput: '~repeat-new-password-input-field',
  modifyMasterPasswordPopUpRepeatNewPasswordFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[5]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
  modifyMasterPasswordPopUpRepeatNewPasswordFieldToggleVisibility: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[5]/android.view.ViewGroup',

  modifyMasterPasswordPopUpContinueButton: '~Continue',
  modifyMasterPasswordPopUpContinueButtonText: '//android.widget.TextView[@text="Continue"]',
  modifyMasterPasswordPopUpCancelButton: '~Cancel',
  modifyMasterPasswordPopUpCancelButtonText: '//android.widget.TextView[@text="Cancel"]',

  invalidPasswordWarning: '//android.widget.TextView[@text=" Invalid password "]',
  invalidPasswordWarningIcon: '//android.view.ViewGroup[@content-desc=" Invalid password "]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
  passwordIsRequiredWarning: '(//android.widget.TextView[@text=" Password is required "])[1]',
  passwordIsRequiredWarningIcon: '(//android.view.ViewGroup[@content-desc=" Password is required "])[1]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
  passwordIsRequiredWarning2: '(//android.widget.TextView[@text=" Password is required "])[2]',
  passwordIsRequiredWarning2Icon: '(//android.view.ViewGroup[@content-desc=" Password is required "])[2]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
  passwordWarningAll: `//android.widget.TextView[@text=" Password must be at least 8 characters long, Password must contain at least one number, Password must contain at least one special character "]`,
  passwordWarningAllIcon: '//android.view.ViewGroup[@content-desc=" Password must be at least 8 characters long, Password must contain at least one number, Password must contain at least one special character "]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
  newPasswordDifferentFromOldPasswordWarning: '//android.widget.TextView[@text=" New password must be different from the current password "]',
  newPasswordDifferentFromOldPasswordWarningIcon: '//android.view.ViewGroup[@content-desc=" New password must be different from the current password "]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
/* ============================
        GENERAL - REPORT PROBLEM SECTION
============================ */ 
  reportProblemSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[6]', 
  reportProblemSectionTitle: '//android.widget.TextView[@text="Report a problem"]',
  issueInputField: '//android.widget.EditText[@resource-id="report-problem-issue-input-input"]',
  sendButton: '~Send',
  sendButtonText: '//android.widget.TextView[@text="Send"]',
  feedbackSentToast: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  feedbackSentToastText: '//android.widget.TextView[@text="Feedback sent"]',

  versionSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[10]',
  versionSectionTitle: '//android.widget.TextView[@text="Version"]',
  versionText: '//android.widget.TextView[@text="1.2.2"]',
/* ============================
        VAULTS SECTION
============================ */
  manageVaultsSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  manageVaultsSectionTitle: '//android.widget.TextView[@text="Manage Vaults"]',
  manageVaultsSectionItem: '~vault-item-0',
  manageVaultsSectionItemIcon: '//android.view.ViewGroup[@content-desc="vault-item-0"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
  manageVaultsSectionItemEditIcon: '//android.view.ViewGroup[@content-desc="vault-item-0"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  manageVaultsSectionItemText: '//android.widget.TextView[@text="Kazik"]',
  newVaultNameText: '//android.view.ViewGroup[@content-desc="vault-item-0"]//android.widget.TextView[1]',
  manageVaultsSectionItemDate: '(//android.widget.TextView[@text="27/01/2026"])[1]',

  manageVaultsSectionSecondItem: '~vault-item-1',
  manageVaultsSectionSecondItemIcon: '//android.view.ViewGroup[@content-desc="vault-item-1"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
  manageVaultsSectionSecondItemEditIcon: '//android.view.ViewGroup[@content-desc="vault-item-1"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  manageVaultsSectionSecondItemText: '//android.widget.TextView[@text="Valeron"]',
  manageVaultsSectionSecondItemDate: '(//android.widget.TextView[@text="27/01/2026"])[2]',

  changeVaultNamePopUp: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  changeVaultNamePopUpTitle: '//android.widget.TextView[@text="What would you like to modify?"]',
  changeVaultNamePopUpButton: '~Change vault name',
  changeVaultNamePopUpButtonText: '//android.widget.TextView[@text="Change vault name"]',
  changeVaultNamePopUpWindow: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]',
  changeVaultNamePopUpWindowTitle: '//android.widget.TextView[@text="Change Vault Name"]',
  changeVaultNamePopUpWindowInputFieldName: '//android.widget.TextView[@text="Vault name"]',
  changeVaultNamePopUpWindowInputField: '~change-vault-name-input-field',
  changeVaultNamePopUpWindowCancelButton: '~Cancel',
  changeVaultNamePopUpWindowCancelButtonText: '//android.widget.TextView[@text="Cancel"]',
  changeVaultNamePopUpWindowContinueButton: '~Continue',
  changeVaultNamePopUpWindowContinueButtonText: '//android.widget.TextView[@text="Continue"]',

  newVaultNameAtVaultsSection: '//android.widget.TextView[@text="Ibrahim"]',
/* ============================
        EXPORT SECTION
============================ */
  exportSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  exportSectionTitle: '(//android.widget.TextView[@text="Export"])[2]',
  vaults1: '~export-vault-item-0',
  vaults2: '~export-vault-item-1',
  vaults1Icon: '//android.view.ViewGroup[@content-desc="export-vault-item-0"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  newVaultNameAtExportSection: '//android.view.ViewGroup[@content-desc="export-vault-item-0"]//android.widget.TextView[1]',
  vaults1Text: '//android.widget.TextView[@text="Ibrahim"]',
  vaults1Date: '(//android.widget.TextView[@text="27/01/2026"])[1]',
  vaults2Icon: '//android.view.ViewGroup[@content-desc="export-vault-item-1"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  vaults2Text: '//android.widget.TextView[@text="Valeron"]',
  vaults2Date: '(//android.widget.TextView[@text="27/01/2026"])[2]',
  exportSectionText: '//android.widget.TextView[@text="Choose the file format"]',
  csvRadioButton: '~csv',
  csvRadioButtonText: '//android.widget.TextView[@text="csv"]',
  csvRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="csv"]/android.view.ViewGroup',
  csvRadioButtonChoose: '//android.view.ViewGroup[@content-desc="csv"]/android.view.ViewGroup[1]',
  jsonRadioButton: '~json',
  jsonRadioButtonText: '//android.widget.TextView[@text="json"]',
  jsonRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="json"]/android.view.ViewGroup',
  jsonRadioButtonChoose: '//android.view.ViewGroup[@content-desc="json"]/android.view.ViewGroup[1]',
  exportButton: '(//android.view.ViewGroup[@content-desc="Export"])[2]',
  exportButtonText: '(//android.widget.TextView[@text="Export"])[3]',
  vault1ChooseIcon: '//android.view.ViewGroup[@content-desc="export-vault-item-0"]/android.view.ViewGroup',
  vault1ChooseIcon1: '//android.view.ViewGroup[@content-desc="export-vault-item-0"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  vault2ChooseIcon: '//android.view.ViewGroup[@content-desc="export-vault-item-1"]/android.view.ViewGroup',
  vault2ChooseIcon1: '//android.view.ViewGroup[@content-desc="export-vault-item-1"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  
  exportVaultsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  exportVaultsPopupTitle: '//android.widget.TextView[@text="Are you sure to export your Vault?"]',
  exportVaultsPopupText: '//android.widget.TextView[@text="Exporting your vault may expose sensitive data. Proceed only on trusted devices."]',
  exportVaultsPopupField: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup[1]',
  exportVaultsPopupFieldIcon: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup[1]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
  exportVaultsPopupFieldShowPasswordIcon: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup[1]/android.view.ViewGroup',
  exportVaultsPopupFieldShowPasswordIcon1: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup[1]/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  exportVaultsPopupInputField: '~export-vault-modal-password-input-field',
  exportVaultsPopupExportButton: '(//android.view.ViewGroup[@content-desc="Export"])[3]',
  exportVaultsPopupExportButtonText: '(//android.widget.TextView[@text="Export"])[4]',
  exportVaultsPopupCancelButton: '~Cancel',
  exportVaultsPopupCancelButtonText: '//android.widget.TextView[@text="Cancel"]',
  exportVaultsInValidPasswordWarningIcon: '//android.view.ViewGroup[@content-desc=" Invalid password "]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
  exportVaultsInValidPasswordWarningText: '//android.widget.TextView[@text=" Invalid password "]',
  inValidPasswordWarningText: '//android.widget.TextView[@text=" Invalid password "]',
  vaultsSavedMessage: '//android.widget.TextView[@resource-id="android:id/content_preview_filename"]',
  exportSuccessToast: '//android.view.ViewGroup[@resource-id="toastContentContainer"]',
  exportSuccessToastTitle: '//android.widget.TextView[@resource-id="toastText1"]',
  exportSuccessToastText: '//android.widget.TextView[@resource-id="toastText2"]',
/* ============================
        IMPORT SECTION
============================ */
  importSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  importSectionTitle: '(//android.widget.TextView[@text="Import"])[2]',
  importSectionDescription: '//android.widget.TextView[@text="Import your Vaults from a file or another app. Currently, only CSV files are supported."]',
  
  onePasswordButton: '//android.view.ViewGroup[@content-desc="1Password, .csv"]',
  onePasswordButtonIcon: '//android.view.ViewGroup[@content-desc="1Password, .csv"]/android.widget.ImageView',
  onePasswordButtonName: '//android.widget.TextView[@text="1Password"]',
  onePasswordButtonText: '(//android.widget.TextView[@text=".csv"])[1]',

  bitwardenButton: '//android.view.ViewGroup[@content-desc="Bitwarden, .json, .csv"]',
  bitwardenButtonIcon: '//android.view.ViewGroup[@content-desc="Bitwarden, .json, .csv"]/android.widget.ImageView',
  bitwardenButtonName: '//android.widget.TextView[@text="Bitwarden"]',
  bitwardenButtonText: '(//android.widget.TextView[@text=".json, .csv"])[1]',

  lastPassButton: '//android.view.ViewGroup[@content-desc="LastPass, .csv"]',
  lastPassButtonIcon: '//android.view.ViewGroup[@content-desc="LastPass, .csv"]/android.widget.ImageView',
  lastPassButtonName: '//android.widget.TextView[@text="LastPass"]',
  lastPassButtonText: '(//android.widget.TextView[@text=".csv"])[2]',

  nordPassButton: '//android.view.ViewGroup[@content-desc="NordPass, .csv"]',
  nordPassButtonIcon: '//android.view.ViewGroup[@content-desc="NordPass, .csv"]/android.widget.ImageView',
  nordPassButtonName: '//android.widget.TextView[@text="NordPass"]',
  nordPassButtonText: '(//android.widget.TextView[@text=".csv"])[3]',

  protonPassButton: '//android.view.ViewGroup[@content-desc="Proton Pass, .csv, .json"]',
  protonPassButtonIcon: '//android.view.ViewGroup[@content-desc="Proton Pass, .csv, .json"]/android.widget.ImageView',
  protonPassButtonName: '//android.widget.TextView[@text="Proton Pass"]',
  protonPassButtonText: '//android.widget.TextView[@text=".csv, .json"]',

  unencryptedFileButton: '//android.view.ViewGroup[@content-desc="Unencrypted file, .json, .csv"]',
  unencryptedFileButtonIcon: '//android.view.ViewGroup[@content-desc="Unencrypted file, .json, .csv"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  unencryptedFileButtonName: '//android.widget.TextView[@text="Unencrypted file"]',
  unencryptedFileButtonText: '(//android.widget.TextView[@text=".json, .csv"])[2]',

  vaultsImportFailedToast: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  vaultsImportFailedToastText: '//android.widget.TextView[@text="Vaults import failed!"]',

  downloadsFolderTitle: '(//android.widget.TextView[@text="Downloads"])[2]',
  onePasswordFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="1PasswordExport-VOOZZKNJHBAA7NTCW7SJU7763Y-20251217-223358.csv"]',
  bitwardenCsvFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="bitwarden_export_20251218011811.csv"]',
  bitwardenJsonFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="bitwarden_export_20251218011800.json"]',
  lastPassCsvFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="lastpass_vault_export (1).csv"]',
  nordPassCsvFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="nordpass_2025-10-25 01_47_36 (1).csv"]',
  protonPassCsvFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="Proton Pass_export_2025-12-17_1766000222.csv"]',
  protonPassJsonFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="Proton pass.json"]',
  unencryptedFileCsvFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="PearPass_Reg_ios_10_11_1_2025_11_11T21_49_11_607Z.csv"]',
  unencryptedFileJsonFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="PearPass_Security_2025_11_19T14_58_18_650Z.json"]',

  vaultsImportedSuccessfullyToast: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  vaultsImportedSuccessfullyToastText: '//android.widget.TextView[@text="Vaults imported successfully!"]',

  menuButton: '~Show roots',
  downloadsButton: '//android.widget.ListView[@resource-id="com.google.android.documentsui:id/roots_list"]/android.widget.LinearLayout[3]',
/* ============================
        ADVANCED SECTION
============================ */      
  customSettingsSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  customSettingsSectionTitle: '//android.widget.TextView[@text="Custom settings"]',
  customSettingsSectionDescription: '//android.widget.TextView[@text="Here you can choose your privacy settings and personalize your experience."]',
  remindersTitle: '//android.widget.TextView[@text="Reminders"]',
  remindersDescription: '//android.widget.TextView[@text="Enable the reminders to change your passwords"]',
  remindersToggleOn: '~Reminders enabled',
  remindersToggleOff: '~Reminders disabled',

  copyToClipboardTitle: '//android.widget.TextView[@text="Copy to clipboard"]',
  copyToClipboardDescription: '//android.widget.TextView[@text="When clicking a password you copy that into your clipboard"]',
  copyToClipboardToggleOn: '~Copy to clipboard enabled',
  copyToClipboardToggleOff: '~Copy to clipboard disabled',

  autoLogoutTitle: '//android.widget.TextView[@text="Auto Log-out"]',
  autoLogoutDescription: '//android.widget.TextView[@text="Automatically logs you out after you stop interacting with the app, based on the timeout you select."]',
  autoLogoutTimeoutField: '//android.view.ViewGroup[@content-desc="30 seconds"]',
  autoLogoutTimeoutFieldText: '//android.widget.TextView[@text="30 seconds"]',
  autoLogoutTimeoutFieldIcon: '//android.view.ViewGroup[@content-desc="30 seconds"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  autoLogoutTimeoutFieldDropdown: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',

  autoLogoutTimeoutFieldNever: '//android.view.ViewGroup[@content-desc="Never"]',
  autoLogoutTimeoutFieldNeverText: '//android.widget.TextView[@text="Never"]',
  autoLogoutTimeoutFieldNeverIcon: '//android.view.ViewGroup[@content-desc="Never"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',

  thirtySecondsRadioButtonChoose: '(//android.view.ViewGroup[@content-desc="30 seconds"])[2]/android.view.ViewGroup[2]',
  thirtySecondsRadioButtonText: '//android.widget.TextView[@text="30 seconds"]',
  thirtySecondsRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="30 seconds"]/android.view.ViewGroup',

  oneMinuteRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="1 minute"]/android.view.ViewGroup',
  oneMinuteRadioButtonChoose: '//android.view.ViewGroup[@content-desc="1 minute"]/android.view.ViewGroup[1]',
  oneMinuteRadioButtonText: '//android.widget.TextView[@text="1 minute"]',

  fiveMinutesRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="5 minutes"]/android.view.ViewGroup',
  fiveMinutesRadioButtonChoose: '//android.view.ViewGroup[@content-desc="5 minutes"]/android.view.ViewGroup[1]',
  fiveMinutesRadioButtonText: '//android.widget.TextView[@text="5 minutes"]',

  fifteenMinutesRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="15 minutes"]/android.view.ViewGroup',
  fifteenMinutesRadioButtonChoose: '//android.view.ViewGroup[@content-desc="15 minutes"]/android.view.ViewGroup[1]',
  fifteenMinutesRadioButtonText: '//android.widget.TextView[@text="15 minutes"]',

  thirtyMinutesRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="30 minutes"]/android.view.ViewGroup',
  thirtyMinutesRadioButtonChoose: '//android.view.ViewGroup[@content-desc="30 minutes"]/android.view.ViewGroup[1]',
  thirtyMinutesRadioButtonText: '//android.widget.TextView[@text="30 minutes"]',

  oneHourRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="1 hour"]/android.view.ViewGroup',
  oneHourRadioButtonChoose: '//android.view.ViewGroup[@content-desc="1 hour"]/android.view.ViewGroup[1]',
  oneHourRadioButtonText: '//android.widget.TextView[@text="1 hour"]',

  fourHoursRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="4 hours"]/android.view.ViewGroup',
  fourHoursRadioButtonChoose: '//android.view.ViewGroup[@content-desc="4 hours"]/android.view.ViewGroup[1]',
  fourHoursRadioButtonText: '//android.widget.TextView[@text="4 hours"]',

  neverRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="Never"]/android.view.ViewGroup',
  neverRadioButtonChoose: '(//android.view.ViewGroup[@content-desc="Never"])[2]/android.view.ViewGroup[1]',
  neverRadioButtonText: '//android.widget.TextView[@text="Never"]',

/* =====================================================
        ADVANCED - BLIND PEERING SECTION
===================================================== */
  blindPeeringSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
  blindPeeringSectionIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[7]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  
  blindPeeringSectionInformationPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  blindPeeringSectionInformationPopupTitle: '//android.widget.TextView[@text="Blind Peer"]',
  blindPeeringSectionInformationPopupDescription: '//android.widget.TextView[@text="Choose between:"]',
  blindPeeringSectionInformationPopupText: '//android.widget.TextView[@text="• Automatic Blind Peers: Let PearPass allocate Blind Peers for you to handle syncing."]',
  blindPeeringSectionInformationPopupText2: '//android.widget.TextView[@text="• Manual Blind Peers: Setup your own private Blind Peers.In both cases, all data stays fully encrypted, ensuring safe, non-intrusive replication and better data consistency"]',
  blindPeeringSectionInformationPopupLearnMoreButton: '//android.widget.TextView[@text="Learn more about blind peering."]',
  blindPeeringSectionInformationPopupLearnMoreButtonIcon: '//android.view.ViewGroup[@content-desc="Learn more about blind peering."]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  blindPeeringSectionInformationPopupLearnMoreButtonLink: '(//android.view.ViewGroup[@content-desc="Learn more about blind peering."])[2]',

  blindPeeringSectionTitle: '//android.widget.TextView[@text="Blind Peering"]',
  blindPeeringSectionDescription: '//android.widget.TextView[@text="Private Connections"]',
  blindPeeringSectionText: '//android.widget.TextView[@text="Sync your encrypted vault securely with blind peers to improve availability and consistency. Blind peers cannot read your data."]',
  blindPeeringSectionLearnMoreButton: '//android.widget.TextView[@text="Learn more about blind peering."]',
  blindPeeringSectionLearnMoreButtonIcon: '//android.view.ViewGroup[@content-desc="Learn more about blind peering."]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  blindPeeringSectionToggleOff: '~Blind Peering disabled',
  blindPeeringSectionToggleOn: '~Blind Peering enabled',

  blindPeeringInformationPage: '//android.widget.EditText[@resource-id="com.android.chrome:id/url_bar"]',

  chooseBlindPeeringPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  chooseBlindPeeringPopupTitle: '//android.widget.TextView[@text="Choose your Blind Peer"]',
  chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonChoose: '//android.view.ViewGroup[@content-desc="Automatic Blind Peers "]/android.view.ViewGroup[1]',
  chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonText: '//android.widget.TextView[@text="Automatic Blind Peers "]',
  chooseBlindPeeringPopupAutomaticBlindPeersRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="Automatic Blind Peers "]/android.view.ViewGroup',

  chooseBlindPeeringPopupManualBlindPeersRadioButtonChoose: '//android.view.ViewGroup[@content-desc="Manual Blind Peers"]/android.view.ViewGroup[1]',
  chooseBlindPeeringPopupManualBlindPeersRadioButtonText: '//android.widget.TextView[@text="Manual Blind Peers"]',
  chooseBlindPeeringPopupManualBlindPeersRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="Manual Blind Peers"]/android.view.ViewGroup',

  chooseBlindPeeringPopupConfirmButton: '~Confirm',
  chooseBlindPeeringPopupConfirmButtonText: '//android.widget.TextView[@text="Confirm"]',
  chooseBlindPeeringPopupCancelButton: '~Cancel',
  chooseBlindPeeringPopupCancelButtonText: '//android.widget.TextView[@text="Cancel"]',

  automaticBlindPeersToast: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  automaticBlindPeersToastText: '//android.widget.TextView[@text="Automatic Blind Peers enabled successfully"]',

  yourBlindPeersText: '//android.widget.TextView[@text="Your Blind Peers"]',
  yourBlindPeersField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]',
  ourBlindPeersFieldText: '//android.widget.TextView[@text="Automatic"]',
  ourBlindPeersFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[10]',
  ourBlindPeersFieldStatus: '//android.widget.TextView[@text="Active"]',

  manualBlindPeersField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[7]',
  manualBlindPeersFieldText: '//android.widget.TextView[@text="Personal"]',
  manualBlindPeersFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[8]',
  manualBlindPeersFieldStatus: '//android.widget.TextView[@text="Active"]',
  separateIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]',
  manualBlindPeersFieldTextCount: '//android.widget.TextView[@text="1 peers"]',

  editBlindPeersButton: '~Edit',
  editBlindPeersButtonText: '//android.widget.TextView[@text="Edit"]',
  editBlindPeersButtonIcon: '//android.view.ViewGroup[@content-desc="Edit"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',

  manualBlindPeersPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',
  manualBlindPeersPopupTitle: '//android.widget.TextView[@text="Add Personal Blind Peers"]',
  manualBlindPeersPopupBackButton: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup',
  oneBlinPeerText: '//android.widget.TextView[@text=" #1 Blind Peer "]',
  addHereYourCodeField: '//android.widget.EditText[@text="Add here your code..."]',
  addPeerButton: '~Add Peer',
  addPeerButtonText: '//android.widget.TextView[@text="Add Peer"]',
  addPeerButtonIcon: '//android.view.ViewGroup[@content-desc="Add Peer"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  manualBlindPeersPopupConfirmButton: '~Confirm',
  manualBlindPeersPopupConfirmButtonText: '//android.widget.TextView[@text="Confirm"]',
  manualBlindPeersPopupCancelButton: '~Cancel',
  manualBlindPeersPopupCancelButtonText: '//android.widget.TextView[@text="Cancel"]',

  twoBlinPeerText: '//android.widget.TextView[@text=" #2 Blind Peer "]',
  twoBlinPeerAddHereYourCodeField: '(//android.widget.EditText[@text="Add here your code..."])[2]',
  removePeerButton: '~Remove Peer',
  removePeerButtonText: '//android.widget.TextView[@text="Remove Peer"]',
  removePeerButtonIcon: '//android.view.ViewGroup[@content-desc="Remove Peer"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',

  errorToastForManualBlindPeers: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  errorToastForManualBlindPeersText: '//android.widget.TextView[@text="Error adding Blind Peers"]',
  successToastForManualBlindPeers: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  successToastForManualBlindPeersText: '//android.widget.TextView[@text="Manual Blind Peers enabled successfully"]',
/* =====================================================
        ADVANCED - AUTOFILL SECTION
===================================================== */
  autoFillSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]',
  autoFillSectionTitle: '//android.widget.TextView[@text="Autofill"]',
  autoFillSectionDescription: '//android.widget.TextView[@text="Set PearPass as your default autofill provider for instant sign-ins."]',
  setAsDefaultButton: '~Set as Default',
  setAsDefaultButtonText: '//android.widget.TextView[@text="Set as Default"]',
  setAsDefaultButtonIcon: '//android.view.ViewGroup[@content-desc="Set as Default"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',

  autoFIllServicesToolbar: '~Autofill service',
  autoFIllServicesBackButton: '~Navigate up',
  autoFIllServicesPearPassRadioButton: '(//android.widget.RadioButton[@resource-id="android:id/checkbox"])[3]',
  autoFIllServicesPearPassRadioButtonText: '//android.widget.TextView[@resource-id="android:id/title" and @text="PearPass"]',
  autoFIllServicesPearPassRadioButtonIcon: '(//android.widget.RadioButton[@resource-id="android:id/checkbox"])[3]',

  autofillPopup: '//androidx.appcompat.widget.LinearLayoutCompat[@resource-id="com.android.settings:id/parentPanel"]',
  autofillPopupText: '//android.widget.TextView[@resource-id="android:id/message"]',
  autofillPopupOkButton: '//android.widget.Button[@resource-id="android:id/button1"]',
  autofillPopupCancelButton: '//android.widget.Button[@resource-id="android:id/button2"]',

  autofillNewText: '//android.widget.TextView[@text="PearPass autofill is enabled."]',
  autoFillNewLinkManageAutofillSettings: '//android.widget.TextView[@text="Manage autofill settings"]',

  allowAllCookiesButton: '//android.widget.Button[@resource-id="CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"]',
}
export default settingsLocators
