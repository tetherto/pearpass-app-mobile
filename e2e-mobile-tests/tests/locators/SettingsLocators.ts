const settingsLocators = {


/* ============================
        SETTINGS PAGE
============================ */
  settingsTitle: '(//android.widget.TextView[@text="Settings"])[1]',
  securityButton: '~Security',
  securityButtonIcon: '//android.view.ViewGroup[@content-desc="Security"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  securityButtonText: '//android.widget.TextView[@text="Security"]',
  syncingButton: '~Syncing',
  syncingButtonIcon: '//android.view.ViewGroup[@content-desc="Syncing"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  syncingButtonText: '//android.widget.TextView[@text="Syncing"]',
  autofillButton: '~Autofill',
  autofillButtonIcon: '//android.view.ViewGroup[@content-desc="Autofill"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  autofillButtonText: '//android.widget.TextView[@text="Autofill"]',
  vaultButton: '~Vault',
  vaultButtonIcon: '//android.view.ViewGroup[@content-desc="Vault"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  vaultButtonText: '//android.widget.TextView[@text="Vault"]',
  appearanceButton: '~Appearance',
  appearanceButtonIcon: '//android.view.ViewGroup[@content-desc="Appearance"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  appearanceButtonText: '//android.widget.TextView[@text="Appearance"]',
  aboutButton: '~About',
  aboutButtonIcon: '//android.view.ViewGroup[@content-desc="About"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  aboutButtonText: '//android.widget.TextView[@text="About"]',
/* ============================
        SECURITY PAGE
============================ */
  backButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/com.horcrux.svg.SvgView',
  securityPageTitle: '//android.widget.TextView[@text="Security"]',
  masterPasswordField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  masterPasswordFieldTitle: '//android.widget.TextView[@text="Master Password"]',
  masterPasswordFieldText: '//android.widget.TextView[@text="Manage the password that protects your app."]',
  masterVaultField: '~Master Vault',
  masterVaultFieldText: '//android.widget.TextView[@text="Master Vault"]',
  masterVaultFieldFirstIcon: '//android.view.ViewGroup[@content-desc="Master Vault"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
  masterVaultFieldEditIcon: '//android.view.ViewGroup[@content-desc="Master Vault"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',

/* =====================================================
        MODIFY MASTER PASSWORD POPUP
===================================================== */
  modifyMasterPasswordPopUp: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]',
  modifyMasterPasswordPopUpTitle: '//android.widget.TextView[@text="Update master password"]',

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

  modifyMasterPasswordPopUpSaveButton: '~Save',
  modifyMasterPasswordPopUpSaveButtonText: '//android.widget.TextView[@text="Save"]',
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

/* =====================================================
        PEARPASS FUNCTIONS
===================================================== */
  pearPassFunctionsSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[4]',
  pearPassFunctionsSectionTitle: '//android.widget.TextView[@text="PearPass functions"]',
  pearPassFunctionsSectionText: '//android.widget.TextView[@text="Control how PearPass works and keep your vault secure."]',

  remindersTitle: '//android.widget.TextView[@text="Reminders"]',
  remindersDescription: `//android.widget.TextView[@text="Get alerts when it's time to update your passwords."]`,
  remindersToggleOn: '~Reminders enabled',
  remindersToggleOff: '~Reminders disabled',

  copyToClipboardTitle: '//android.widget.TextView[@text="Copy to clipboard"]',
  copyToClipboardDescription: '//android.widget.TextView[@text="Copy any password instantly with one tap."]',
  copyToClipboardToggleOn: '~Copy to clipboard enabled',
  copyToClipboardToggleOff: '~Copy to clipboard disabled',

  hapticFeedbackTitle: '//android.widget.TextView[@text="Haptic feedback"]',
  hapticFeedbackDescription: '//android.widget.TextView[@text="Meaningful haptics for important actions"]',
  hapticFeedbackToggleOn: '~Haptic feedback enabled',
  hapticFeedbackToggleOff: '~Haptic feedback disabled',

  unlockWithBiometricsTitle: '//android.widget.TextView[@text="Unlock with biometrics"]',
  unlockWithBiometricsDescription: '//android.widget.TextView[@text="Use Face ID or fingerprint for faster, secure access."]',
  unlockWithBiometricsToggleOn: '~Unlock with biometrics enabled',
  unlockWithBiometricsToggleOff: '~Unlock with biometrics disabled',

  biometricsAuthenticationPopupAppLogo: '~App logo',
  biometricsAuthenticationPopupAppText: '//android.widget.TextView[@resource-id="com.android.systemui:id/logo_description"]',
  biometricsAuthenticationPopupText: '//android.widget.TextView[@resource-id="com.android.systemui:id/title"]',
  biometricsAuthenticationPopupIndicator: '~Fingerprint sensor',
  biometricsAuthenticationPopupUsePinButton: '//android.widget.Button[@resource-id="com.android.systemui:id/button_use_credential"]',

  autoLogoutTitle: '//android.widget.TextView[@text="Auto Log-out"]',
  autoLogoutDescription: '//android.widget.TextView[@text="Automatically logs you out after you stop interacting with the app, based on the timeout you select."]',
  autoLogoutTimeoutField: '~30 seconds',
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

  continueUsingBiometricsAccessPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',  
  continueUsingBiometricsAccessPopupTitle: '//android.widget.TextView[@text="Continue using Biometric Access"]',
  continueUsingBiometricsAccessPopupDescription: '//android.widget.TextView[@text="Your password was updated, so biometric login was turned off. Enable it again to continue signing in with your biometrics."]',
  continueUsingBiometricsAccessPopupEnableButton: '~Enable',
  continueUsingBiometricsAccessPopupEnableButtonText: '//android.widget.TextView[@text="Enable"]',
  continueUsingBiometricsAccessPopupCancelButton: '~Dismiss',
  continueUsingBiometricsAccessPopupCancelButtonText: '//android.widget.TextView[@text="Dismiss"]',

  autoLogoutInformationIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]/com.horcrux.svg.SvgView',
  autoLogoutInformationPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  autoLogoutInformationPopupTitle: '(//android.widget.TextView[@text="Auto Log-out"])[2]',
  autoLogoutInformationPopupDescription1: `//android.widget.TextView[@text="• Auto-lock determines how long Pearpass stays unlocked when you're not actively using it."]`,
  autoLogoutInformationPopupDescription2: `//android.widget.TextView[@text="• Inactivity is based on your interaction with Pearpass, not on device idle time."]`,


/* ============================
        SYNCING PAGE
============================ */
  syncingPageTitle: '//android.widget.TextView[@text="Syncing"]',

  blindPeeringSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  blindPeeringSectionIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',

  blindPeeringSectionInformationPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  blindPeeringSectionInformationPopupTitle: '//android.widget.TextView[@text="Blind Peer"]',
  blindPeeringSectionInformationPopupDescription: '//android.widget.TextView[@text="Choose between:"]',
  blindPeeringSectionInformationPopupText: '//android.widget.TextView[@text="• Automatic Blind Peers: Let PearPass allocate Blind Peers for you to handle syncing."]',
  blindPeeringSectionInformationPopupText2: '//android.widget.TextView[@text="• Manual Blind Peers: Setup your own private Blind Peers."]',
  blindPeeringSectionInformationPopupText3: '//android.widget.TextView[@text="In both cases, all data stays fully encrypted, ensuring safe, non-intrusive replication and better data consistency."]',
  blindPeeringSectionInformationPopupLearnMoreButton: '//android.widget.TextView[@text="Learn more about blind peering."]',
  blindPeeringSectionInformationPopupLearnMoreButtonIcon: '//android.view.ViewGroup[@content-desc="Learn more about blind peering."]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  blindPeeringSectionInformationPopupLearnMoreButtonLink: '(//android.view.ViewGroup[@content-desc="Learn more about blind peering."])[2]',

  blindPeeringSectionTitle: '//android.widget.TextView[@text="Blind Peering"]',
  blindPeeringSectionDescription: '//android.widget.TextView[@text="Private Connections"]',
  blindPeeringSectionText: '//android.widget.TextView[@text="Sync your encrypted vault securely with blind peers to improve availability and consistency. Blind peers cannot read your data."]',
  blindPeeringSectionLearnMoreButton: '//android.widget.TextView[@text="Learn more about blind peering."]',
  blindPeeringSectionLearnMoreButtonIcon: '//android.view.ViewGroup[@content-desc="Learn more about blind peering."]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  blindPeeringSectionToggleOff: '//android.widget.Switch[@content-desc="Blind Peering disabled"]/android.view.ViewGroup',
  blindPeeringSectionToggleOn: '~Blind Peering enabled',

  blindPeeringInformationPage: '//android.widget.EditText[@resource-id="com.android.chrome:id/url_bar"]',

  chooseBlindPeeringPopup: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup',
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
  yourBlindPeersField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
  ourBlindPeersFieldText: '//android.widget.TextView[@text="Automatic"]',
  ourBlindPeersFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[6]',
  ourBlindPeersFieldStatus: '//android.widget.TextView[@text="Active"]',

  manualBlindPeersField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
  manualBlindPeersFieldText: '//android.widget.TextView[@text="Personal"]',
  manualBlindPeersFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[6]',
  manualBlindPeersFieldStatus: '//android.widget.TextView[@text="Active"]',
  separateIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[7]',
  manualBlindPeersFieldTextCount: '//android.widget.TextView[@text="1 peers"]',

  editBlindPeersButton: '~Edit',
  editBlindPeersButtonText: '//android.widget.TextView[@text="Edit"]',
  editBlindPeersButtonIcon: '//android.view.ViewGroup[@content-desc="Edit"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',

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

  allowAllCookiesButton: '//android.widget.Button[@resource-id="CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"]',
/* ============================
        AUTOFILL PAGE
============================ */
  autofillPageTitle: '(//android.widget.TextView[@text="Autofill"])[1]',
  autofillSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  autofillSectionTitle: '(//android.widget.TextView[@text="Autofill"])[2]',
  autofillSectionDescription: '//android.widget.TextView[@text="Set your Autofill for your entire account"]',
  autofillSectionSetAsDefaultButton: '~Set as Default',
  autofillSectionSetAsDefaultButtonText: '//android.widget.TextView[@text="Set as Default"]',

  autoFIllServicesToolbar: '~Autofill service',
  autoFIllServicesBackButton: '~Navigate up',
  autoFIllServicesPearPassRadioButton: '//androidx.recyclerview.widget.RecyclerView[@resource-id="com.android.settings:id/recycler_view"]/android.widget.LinearLayout[3]',
  autoFIllServicesPearPassRadioButtonText: '//android.widget.TextView[@resource-id="android:id/title" and @text="PearPass"]',
  autoFIllServicesPearPassRadioButtonIcon: '(//android.widget.ImageView[@resource-id="android:id/icon"])[3]',

  autofillPopup: '//androidx.appcompat.widget.LinearLayoutCompat[@resource-id="com.android.settings:id/parentPanel"]',
  autofillPopupText: '//android.widget.TextView[@resource-id="android:id/message"]',
  autofillPopupOkButton: '//android.widget.Button[@resource-id="android:id/button1"]',
  autofillPopupCancelButton: '//android.widget.Button[@resource-id="android:id/button2"]',

  autofillNewText: '//android.widget.TextView[@text="Set your Autofill for your entire account"]',
  autoFillNewLinkManageAutofillSettings: '//android.widget.TextView[@text="Manage autofill settings"]',

/* ============================
        VAULT PAGE
============================ */
  vaultPageTitle: '//android.widget.TextView[@text="Vaults"]',
  vaultSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  vaultSectionTitle: '//android.widget.TextView[@text="Your Vault"]',
  vaultSectionDescription: '//android.widget.TextView[@text="Share, edit, or delete your vault from one place."]',

  manageVaultsSectionItem: '~vault-item-982a56153365c95d5d5a4aa765e8864a',
  manageVaultsSectionItemIcon: '//android.view.ViewGroup[@content-desc="vault-item-982a56153365c95d5d5a4aa765e8864a"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
  manageVaultsSectionItemEditIcon: '//android.view.ViewGroup[@content-desc="vault-item-982a56153365c95d5d5a4aa765e8864a"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
  manageVaultsSectionItemText: '//android.widget.TextView[@text="Kazik"]',
  manageVaultsSectionItemDate: '(//android.widget.TextView[@text="30/03/2026"])[1]',

  manageVaultsSectionSecondItem: '~vault-item-1',
  manageVaultsSectionSecondItemIcon: '//android.view.ViewGroup[@content-desc="vault-item-1"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
  manageVaultsSectionSecondItemEditIcon: '//android.view.ViewGroup[@content-desc="vault-item-1"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  manageVaultsSectionSecondItemText: '//android.widget.TextView[@text="Valeron"]',
  manageVaultsSectionSecondItemDate: '(//android.widget.TextView[@text="30/03/2026"])[2]',

  changeVaultNamePopUp: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup',
  changeVaultNamePopUpTitle: '//android.widget.TextView[@text="What would you like to modify?"]',
  changeVaultNamePopUpButton: '~Change vault name',
  changeVaultNamePopUpButtonText: '//android.widget.TextView[@text="Change vault name"]',
  changeVaultNamePopUpWindow: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]',
  changeVaultNamePopUpWindowTitle: '//android.widget.TextView[@text="Change Vault Name"]',
  changeVaultNamePopUpWindowInputFieldName: '//android.widget.TextView[@text="Vault name"]',
  changeVaultNamePopUpWindowInputField: '~change-vault-name-input-field',
  changeVaultNamePopUpWindowCancelButton: '~Cancel',
  changeVaultNamePopUpWindowCancelButtonText: '//android.widget.TextView[@text="Cancel"]',
  changeVaultNamePopUpWindowSaveButton: '~Save',
  changeVaultNamePopUpWindowSaveButtonText: '//android.widget.TextView[@text="Save"]',

  newVaultNameAtVaultsSection: '//android.widget.TextView[@text="Ibrahim"]',
  backButtonAtVaultsSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/com.horcrux.svg.SvgView',
/* ============================
        EXPORT VAULT
============================ */
  exportVaultSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
  exportVaultSectionTitle: '//android.widget.TextView[@text="Export Vault"]',
  exportVaultSectionDescription: '//android.widget.TextView[@text="Choose the file format to export your Vault"]',
  vaults1: '~export-vault-item-0',
  vaults2: '~export-vault-item-1',
  vaults1Icon: '//android.view.ViewGroup[@content-desc="export-vault-item-0"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  newVaultNameAtExportSection: '//android.widget.TextView[@text="Ibrahim"]',
  vaults1Text: '//android.widget.TextView[@text="Ibrahim"]',
  vaults1Date: '(//android.widget.TextView[@text="30/03/2026"])[1]',
  vaults2Icon: '//android.view.ViewGroup[@content-desc="export-vault-item-1"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  vaults2Text: '//android.widget.TextView[@text="Valeron"]',
  vaults2Date: '(//android.widget.TextView[@text="30/03/2026"])[2]',
  exportSectionText: '//android.widget.TextView[@text="Choose the file format"]',
  csvRadioButton: '~CSV',
  csvRadioButtonText: '//android.widget.TextView[@text="CSV"]',
  csvRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="CSV"]/android.view.ViewGroup',
  csvRadioButtonChoose: '//android.view.ViewGroup[@content-desc="CSV"]/android.view.ViewGroup[1]',
  jsonRadioButton: '~JSON (Recommended)',
  jsonRadioButtonText: '//android.widget.TextView[@text="JSON (Recommended)"]',
  jsonRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="JSON (Recommended)"]/android.view.ViewGroup',
  jsonRadioButtonChoose: '//android.view.ViewGroup[@content-desc="JSON (Recommended)"]/android.view.ViewGroup[1]',

  protectWithPasswordTitle: '//android.widget.TextView[@text="Protect with Password"]',
  protectWithPasswordTitleText: '//android.widget.TextView[@text="Protect your exported file so it can only be opened with the password you set"]',
  protectWithPasswordRadioButtonUnchoose: '~Encryption disabled',
  protectWithPasswordRadioButtonChoose: '~Encryption enabled',

  exportButton: '~Export',
  exportButtonText: '//android.widget.TextView[@text="Export"]',
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
  exportVaultsPopupExportButton: '(//android.view.ViewGroup[@content-desc="Export"])[2]',
  exportVaultsPopupExportButtonText: '(//android.widget.TextView[@text="Export"])[2]',
  exportVaultsPopupCancelButton: '~Cancel',
  exportVaultsPopupCancelButtonText: '//android.widget.TextView[@text="Cancel"]',
  exportVaultsInValidPasswordWarningIcon: '//android.view.ViewGroup[@content-desc=" Invalid password "]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
  exportVaultsInValidPasswordWarningText: '//android.widget.TextView[@text=" Invalid password "]',
  inValidPasswordWarningText: '//android.widget.TextView[@text=" Invalid password "]',
  vaultsSavedMessage1: '//android.widget.TextView[@resource-id="com.android.intentresolver:id/headline"]',
  vaultsSavedMessage2: '//android.widget.TextView[@resource-id="com.android.intentresolver:id/content_preview_filename"]',
  exportSuccessToast: '//android.view.ViewGroup[@resource-id="toastContentContainer"]',
  exportSuccessToastTitle: '//android.widget.TextView[@resource-id="toastText1"]',
  exportSuccessToastText: '//android.widget.TextView[@resource-id="toastText2"]',
  noDataToExportToast: '//android.view.ViewGroup[@resource-id="toastContentContainer"]',
  noDataToExportToastTitle: '//android.widget.TextView[@resource-id="toastText1"]',
  noDataToExportToastText: '//android.widget.TextView[@resource-id="toastText2"]',

/* ============================
        IMPORT VAULT
============================ */
  importVaultSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
  importVaultSectionTitle: '//android.widget.TextView[@text="Import Vault"]',
  importVaultSectionDescription: `//android.widget.TextView[@text="Move your saved items here from another password manager. They'll be added to this vault."]`,

  immortVaultPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup',
  immortVaultPopupTitle: '(//android.widget.TextView[@text="Import Vault"])[2]',
  immortVaultPopupTextOnePassword: '//android.widget.TextView[@text="Drop here the 1Password file"]',
  immortVaultPopupTextBitwarden: '//android.widget.TextView[@text="Drop here the Bitwarden file"]',
  immortVaultPopupTextKeePass: '//android.widget.TextView[@text="Drop here the LastPass file"]',
  immortVaultPopupTextKeePassXC: '//android.widget.TextView[@text="Drop here the KeePassXC file"]',
  immortVaultPopupTextLastPass: '//android.widget.TextView[@text="Drop here the LastPass file"]',
  immortVaultPopupTextNordPass: '//android.widget.TextView[@text="Drop here the NordPass file"]',
  immortVaultPopupTextProtonPass: '//android.widget.TextView[@text="Drop here the Proton Pass file"]',
  immortVaultPopupTextUnencryptedFile: '//android.widget.TextView[@text="Drop here the PearPass file"]',
  immortVaultPopupTextEncryptedFile: '//android.widget.TextView[@text="Drop here the Encrypted file"]',

  immortVaultPopupText2OnePassword: '//android.widget.TextView[@text="1PasswordExport-VOOZZKNJHBAA7NTCW7SJU7763Y-20251217-223358.csv"]',
  immortVaultPopupText2Bitwarden: '//android.widget.TextView[@text="bitwarden_export_20251218011811.csv"]',
  immortVaultPopupText2BitwardenJson: '//android.widget.TextView[@text="bitwarden_export_20251218011800.json"]',
  immortVaultPopupText2LastPass: '//android.widget.TextView[@text="lastpass_vault_export (1).csv"]',
  immortVaultPopupText2NordPass: '//android.widget.TextView[@text="nordpass_2025-10-25 01_47_36 (1).csv"]',
  immortVaultPopupText2ProtonPass: '//android.widget.TextView[@text="Proton Pass_export_2025-12-17_1766000222.csv"]',
  immortVaultPopupText2ProtonPassJson: '//android.widget.TextView[@text="Proton pass.json"]',
  immortVaultPopupText2UnencryptedFile: '//android.widget.TextView[@text="PearPass_Reg_ios_10_11_1_2025_11_11T21_49_11_607Z.csv"]',
  immortVaultPopupText2UnencryptedFileJson: '//android.widget.TextView[@text="PearPass_ytgiu_2025_12_02T10_41_25_523Z.json"]',
  immortVaultPopupText2EncryptedFile: '//android.widget.TextView[@text="PearPass_Security_2025_11_19T14_58_18_650Z.json"]',

  immortVaultPopupText: '//android.widget.TextView[@text="Maximum file size: 6 MB."]',
  immortVaultPopupBrowseFolderButton: '~Browse Folder',
  immortVaultPopupBrowseFolderButtonText: '//android.widget.TextView[@text="Browse Folder"]',

  immortVaultPopupText2: '//android.widget.TextView[@text="Import selected file or choose another one if you want to import a different vault."]',
  immortVaultPopupImportButton: '~Import',
  immortVaultPopupImportButtonText: '//android.widget.TextView[@text="Import"]',
  immortVaultPopupIcon: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  immortVaultPopupDeleteButton: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',

  onePasswordButton: '~1Password, .csv',
  onePasswordButtonIcon: '//android.view.ViewGroup[@content-desc="1Password, .csv"]/android.widget.ImageView',
  onePasswordButtonName: '//android.widget.TextView[@text="1Password"]',
  onePasswordButtonText: '(//android.widget.TextView[@text=".csv"])[1]',

  bitwardenButton: '~Bitwarden, .json, .csv',
  bitwardenButtonIcon: '//android.view.ViewGroup[@content-desc="Bitwarden, .json, .csv"]/android.widget.ImageView',
  bitwardenButtonName: '//android.widget.TextView[@text="Bitwarden"]',
  bitwardenButtonText: '(//android.widget.TextView[@text=".json, .csv"])[1]',

  keePassButton: '~KeePass, .kdbx, .csv, .xml',
  keePassButtonIcon: '//android.view.ViewGroup[@content-desc="KeePass, .kdbx, .csv, .xml"]/android.widget.ImageView',
  keePassButtonName: '//android.widget.TextView[@text="KeePass"]',
  keePassButtonText: '//android.widget.TextView[@text=".kdbx, .csv, .xml"]',

  keePassXCButton: '~KeePassXC, .csv, .xml',
  keePassXCButtonIcon: '//android.view.ViewGroup[@content-desc="KeePassXC, .csv, .xml"]/android.widget.ImageView',
  keePassXCButtonName: '//android.widget.TextView[@text="KeePassXC"]',
  keePassXCButtonText: '//android.widget.TextView[@text=".csv, .xml"]',

  lastPassButton: '~LastPass, .csv',
  lastPassButtonIcon: '//android.view.ViewGroup[@content-desc="LastPass, .csv"]/android.widget.ImageView',
  lastPassButtonName: '//android.widget.TextView[@text="LastPass"]',
  lastPassButtonText: '(//android.widget.TextView[@text=".csv"])[2]',

  nordPassButton: '~NordPass, .csv',
  nordPassButtonIcon: '//android.view.ViewGroup[@content-desc="NordPass, .csv"]/android.widget.ImageView',
  nordPassButtonName: '//android.widget.TextView[@text="NordPass"]',
  nordPassButtonText: '(//android.widget.TextView[@text=".csv"])[3]',

  protonPassButton: '~Proton Pass, .csv, .json',
  protonPassButtonIcon: '//android.view.ViewGroup[@content-desc="Proton Pass, .csv, .json"]/android.widget.ImageView',
  protonPassButtonName: '//android.widget.TextView[@text="Proton Pass"]',
  protonPassButtonText: '//android.widget.TextView[@text=".csv, .json"]',

  encryptedFileButton: '~Encrypted file, .json',
  encryptedFileButtonIcon: '//android.view.ViewGroup[@content-desc="Encrypted file, .json"]/android.widget.ImageView',
  encryptedFileButtonName: '//android.widget.TextView[@text="Encrypted file"]',
  encryptedFileButtonText: '//android.widget.TextView[@text=".json"]',

  unencryptedFileButton: '~Unencrypted file, .json, .csv',
  unencryptedFileButtonIcon: '//android.view.ViewGroup[@content-desc="Unencrypted file, .json, .csv"]/android.widget.ImageView',
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
  protonPassJsonFile: '//android.widget.TextView[@text="Proton pass.json"]',
  unencryptedFileCsvFile: '//android.widget.TextView[@text="PearPass_Reg_ios_10_11_1_2025_11_11T21_49_11_607Z.csv"]',
  unencryptedFileJsonFile: '//android.widget.TextView[@text="PearPass_ytgiu_2025_12_02T10_41_25_523Z.json"]',

  vaultsImportedSuccessfullyToast: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  vaultsImportedSuccessfullyToastText: '//android.widget.TextView[@text="Vaults imported successfully!"]',

  menuButton: '~Show roots',
  downloadsButton: '//android.widget.TextView[@resource-id="android:id/title" and @text="Downloads"]',

/* ============================
        LINKED DEVICES
============================ */
  linkedDevicesSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[8]',
  linkedDevicesSectionTitle: '//android.widget.TextView[@text="Linked devices"]',
  linkedDevicesSectionDescription: '//android.widget.TextView[@text="These are the devices currently synced with this vault."]',
  linkedDevicesSectionItem: '~Android, 30/03/2026',
  linkedDevicesSectionItemIcon: '//android.view.ViewGroup[@content-desc="Android, 30/03/2026"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  linkedDevicesSectionItemText: '//android.widget.TextView[@text="Android"]',
  linkedDevicesSectionItemDate: '//android.widget.TextView[@text="30/03/2026"]',
  addDeviceButton: '~Add device',
  addDeviceButtonText: '//android.widget.TextView[@text="Add device"]',

/* ============================
        APPEARANCE PAGE
============================ */
  appearancePageTitle: '//android.widget.TextView[@text="Appearance"]',
  languageSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  languageSectionTitle: '//android.widget.TextView[@text="Language"]',
  languageSectionDescription: '//android.widget.TextView[@text="Choose the language of the app."]',
  languageDropdown: '~English',
  languageDropdownIcon:'//android.widget.Button[@content-desc="English"]/com.horcrux.svg.SvgView',
  languageDropdownText:'//android.widget.TextView[@text="English"]',
  languageDropdownMenu: '//android.view.ViewGroup[@content-desc="English"]',

/* ============================
        ABOUT PAGE
============================ */
  aboutPageTitle: '//android.widget.TextView[@text="About"]',
  reportProblemSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]', 
  reportProblemSectionTitle: '//android.widget.TextView[@text="Report a problem"]',
  issueInputField: '//android.widget.EditText[@resource-id="report-problem-issue-input-input"]',
  sendButton: '~Send',
  sendButtonText: '//android.widget.TextView[@text="Send"]',
  feedbackSentToast: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  feedbackSentToastText: '//android.widget.TextView[@text="Feedback sent"]',

  versionSection: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
  versionSectionTitle: '//android.widget.TextView[@text="PearPass version"]',
  versionSectionDescription: '//android.widget.TextView[@text="Here you can find all the info about your app."]',
  appVersionText: '//android.widget.TextView[@text="App version"]',
  appVersionValue: '//android.widget.TextView[@text="1.6.0"]',
  termsOfUseLink: '~Terms of use',
  termsOfUseLinkText: '//android.widget.TextView[@text="Terms of use"]',
  privacyStatementLink: '~Privacy statement',
  privacyStatementLinkText: '//android.widget.TextView[@text="Privacy statement"]',
  visitOurWebsiteText: '//android.widget.TextView[@text="Visit our website"]',
  visitOurWebsiteLinkIcon: '//android.view.ViewGroup[@content-desc="pass.pears.com"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  visitOurWebsiteLink: '//android.widget.TextView[@text="pass.pears.com"]',

  termsOfUseLinkPageTitle: '//android.widget.TextView[@text="PearPass Application Terms of Use"]',
  privacyStatementLinkPageTitle: '//android.widget.TextView[@text="PearPass Application Privacy Statement"]',

  pearPassWebsite: '//android.widget.EditText[@resource-id="com.android.chrome:id/url_bar"]',
}
export default settingsLocators
