const settingsLocators = {

  /* ============================
        SETTINGS PAGE
  ============================ */
  settingsTitle: '//android.widget.TextView[@text="Settings"]',
  backButton: '~Go back',
  popupCloseButton: '~Close',

  settingsPageSearchField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]',
  settingsPageSearchFieldInput: '~Search in Settings',
  settingsPageSearchFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/com.horcrux.svg.SvgView',

  /* ============================
        SECURITY (section + children)
  ============================ */
  securitySection: '~Security',
  securitySectionText: '//android.widget.TextView[@text="Security"]',
  securitySectionIcon: '//android.widget.Button[@content-desc="Security"]/android.view.ViewGroup/com.horcrux.svg.SvgView[2]',
  securitySectionShowIcon: '',
  securitySectionHideIcon: '',

  appPreferences: '~App Preferences',
  appPreferencesText: '//android.widget.TextView[@text="App Preferences"]',
  appPreferencesIcon: '//android.widget.Button[@content-desc="App Preferences"]/android.view.ViewGroup/com.horcrux.svg.SvgView',

  masterPassword: '~Master Password',
  masterPasswordText: '//android.widget.TextView[@text="Master Password"]',
  masterPasswordIcon: '//android.widget.Button[@content-desc="Master Password"]/android.view.ViewGroup/com.horcrux.svg.SvgView',
  
  /* ----- Master Password ----- */
  masterPasswordTitle: '//android.view.View[@text="Master Password"]',
  masterPasswordDescription: '//android.widget.TextView[@text="Manage the password that protects your app."]',

  currentPasswordField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup',
  currentPasswordFieldTitle: '//android.widget.TextView[@text="Current Password"]',
  currentPasswordFieldInput: '//android.widget.EditText[@text="Enter Current Password"]',
  currentPasswordFieldShowPasswordButton: '(//android.widget.Button[@content-desc="Show password"])[1]',
  currentPasswordFieldHidePasswordButton: '~Hide password',
  currentPasswordFieldPasswordIndicatorStrong: '',
  currentPasswordFieldPasswordIndicatorDecent: '',
  currentPasswordFieldPasswordIndicatorVulnerable: '',
  currentPasswordFieldPasswordIndicatorIconStrong: '',
  currentPasswordFieldPasswordIndicatorIconDecent: '',
  currentPasswordFieldPasswordIndicatorIconVulnerable: '',

  autofillHint: '//android.widget.TextView[@resource-id="android:id/text1"]',

  newPasswordField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup',
  newPasswordFieldTitle: '//android.widget.TextView[@text="New Password"]',
  newPasswordFieldInput: '//android.widget.EditText[@text="Enter New Password"]',
  newPasswordFieldShowPasswordButton: '(//android.widget.Button[@content-desc="Show password"])[2]',
  newPasswordFieldHidePasswordButton: '~Hide password',
  newPasswordFieldPasswordIndicatorStrong: '',
  newPasswordFieldPasswordIndicatorDecent: '',
  newPasswordFieldPasswordIndicatorVulnerable: '',
  newPasswordFieldPasswordIndicatorIcon: '',
  newPasswordFieldPasswordIndicatorIconStrong: '',
  newPasswordFieldPasswordIndicatorIconDecent: '',
  newPasswordFieldPasswordIndicatorIconVulnerable: '',

  repeatNewPasswordField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup',
  repeatNewPasswordFieldTitle: '//android.widget.TextView[@text="Repeat New Password"]',
  repeatNewPasswordFieldInput: '//android.widget.EditText[@text="Repeat New Password"]',
  repeatNewPasswordFieldShowPasswordButton: '(//android.widget.Button[@content-desc="Show password"])[3]',
  repeatNewPasswordFieldHidePasswordButton: '~Hide password',
  repeatNewPasswordFieldPasswordIndicatorStrong: '',
  repeatNewPasswordFieldPasswordIndicatorDecent: '',
  repeatNewPasswordFieldPasswordIndicatorVulnerable: '',
  repeatNewPasswordFieldPasswordIndicatorMatch: '',
  repeatNewPasswordFieldPasswordIndicatorIconMatch: '',
  repeatNewPasswordFieldPasswordIndicatorIconStrong: '',
  repeatNewPasswordFieldPasswordIndicatorIconDecent: '',
  repeatNewPasswordFieldPasswordIndicatorIconVulnerable: '',

  masterPasswordWarningTextField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[4]',
  masterPasswordWarningTextFieldText: `//android.widget.TextView[@text="Don't forget your Master password. It's the only way to access your vault. We can't help recover it. Back it up securely."]`,

  changePasswordButton: '~Change Password',
  changePasswordButtonText: '//android.widget.TextView[@text="Change Password"]',

  masterPasswordChangedSuccessToastMessage: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  masterPasswordChangedSuccessToastMessageText: '//android.widget.TextView[@text="Master password updated successfully"]',

  /* ----- Warning Text ----- */
  newPasswordSameAsOldPasswordWarningText: '//android.widget.TextView[@text="New password must be different from the current password"]',
  newPasswordSameAsOldPasswordWarningTextIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  invalidPasswordWarningText: '//android.widget.TextView[@text="Invalid password"]',
  invalidPasswordWarningTextIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  passwordTooShortWarningText: '//android.widget.TextView[@text="Password must be at least 8 characters long"]',
  passwordTooShortWarningTextIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  passwordMissingUppercaseWarningText: '//android.widget.TextView[@text="Password must contain at least one uppercase letter"]',
  passwordMissingUppercaseWarningTextIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  passwordMissingLowercaseWarningText: '//android.widget.TextView[@text="Password must contain at least one lowercase letter"]',
  passwordMissingLowercaseWarningTextIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  passwordMissingNumberWarningText: '//android.widget.TextView[@text="Password must contain at least one number"]',
  passwordMissingNumberWarningTextIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  passwordMissingSpecialWarningText: '//android.widget.TextView[@text="Password must contain at least one special character"]',
  passwordMissingSpecialWarningTextIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  /* ============================
        APP PREFERENCES SCREEN
  ============================ */
  appPreferencesScreenTitle: '//android.view.View[@text="App Preferences"]',
  appPreferencesScreenSubtitle: '//android.widget.TextView[@text="Control how PearPass works and keep your vault secure."]',

  /* ----- Autofill & Browsing ----- */
  autofillAndBrowsingSectionTitle: '//android.widget.TextView[@text="Autofill & Browsing"]',

  autofillSettingTitle: '//android.widget.TextView[@text="Autofill"]',
  autofillSettingDescription: '//android.widget.TextView[@text="Automatically fill usernames, passwords, and codes when you sign in"]',
  autofillToggleOn: '',
  autofillToggleOff: '',

  /* ----- Autofill Popup ----- */
  autoFIllServicesToolbar: '~Autofill service',
  autoFIllServicesBackButton: '~Navigate up',
  autoFIllServicesPearPassRadioButton: '//androidx.recyclerview.widget.RecyclerView[@resource-id="com.android.settings:id/recycler_view"]/android.widget.LinearLayout[2]',
  autoFIllServicesPearPassRadioButtonText: '//android.widget.TextView[@resource-id="android:id/title" and @text="PearPass Nightly"]',
  autoFIllServicesPearPassRadioButtonIcon: '(//android.widget.ImageView[@resource-id="android:id/icon"])[3]',

  autofillPopup: '//androidx.appcompat.widget.LinearLayoutCompat[@resource-id="com.android.settings:id/parentPanel"]',
  autofillPopupText: '//android.widget.TextView[@resource-id="android:id/message"]',
  autofillPopupOkButton: '//android.widget.Button[@resource-id="android:id/button1"]',
  autofillPopupCancelButton: '//android.widget.Button[@resource-id="android:id/button2"]',

  autofillNewText: '//android.widget.TextView[@text="Set your Autofill for your entire account"]',
  autoFillNewLinkManageAutofillSettings: '//android.widget.TextView[@text="Manage autofill settings"]',
  
  /* ----- Clear Clipboard ----- */
  clearClipboardTitle: '//android.widget.TextView[@text="Clear Clipboard"]',
  clearClipboardDescription: '//android.widget.TextView[@text="Automatically remove copied credentials from your clipboard after a set time"]',
  clearClipboardTimeoutField: '~30 Seconds',
  clearClipboardTimeoutText: '//android.widget.TextView[@text="30 Seconds"]',
  clearClipboardTimeoutTextIcon: '//android.view.ViewGroup[@content-desc="30 Seconds"]/com.horcrux.svg.SvgView',


  clearClipboardPopupTimeoutFieldOneHour: '~1 Hour',
  clearClipboardPopupTimeoutFieldOneHourText: '//android.widget.TextView[@text="1 Hour"]',

  /* ----- Clear Clipboard Popup ----- */
  clearClipboardPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  clearClipboardPopupTitle: '(//android.widget.TextView[@text="Clear Clipboard"])[1]',

  clearClipboardThirtySecondButton: '~30 Seconds',
  clearClipboardThirtySecondButtonText: '(//android.widget.TextView[@text="30 Seconds"])[1]',

  clearClipboardOneMinuteButton: '~1 Minute',
  clearClipboardOneMinuteButtonText: '//android.widget.TextView[@text="1 Minute"]',

  clearClipboardThreeMinutesButton: '~3 Minutes',
  clearClipboardThreeMinutesButtonText: '//android.widget.TextView[@text="3 Minutes"]',

  clearClipboardFiveMinutesButton: '~5 Minutes',
  clearClipboardFiveMinutesButtonText: '//android.widget.TextView[@text="5 Minutes"]',

  clearClipboardTenMinutesButton: '~10 Minutes',
  clearClipboardTenMinutesButtonText: '//android.widget.TextView[@text="10 Minutes"]',

  clearClipboardThirtyMinutesButton: '~30 Minutes',
  clearClipboardThirtyMinutesButtonText: '//android.widget.TextView[@text="30 Minutes"]',

  clearClipboardOneHourButton: '//android.widget.Button[@content-desc="1 Hour"]',
  clearClipboardOneHourButtonText: '//android.widget.TextView[@text="1 Hour"]',

  clearClipboardThreeHoursButton: '~3 Hours',
  clearClipboardThreeHoursButtonText: '//android.widget.TextView[@text="3 Hours"]',

  clearClipboardNeverButton: '~Never',
  clearClipboardNeverButtonText: '(//android.widget.TextView[@text="Never"])[1]',

  /* ----- Unlock Method ----- */
  unlockMethodSectionTitle: '//android.widget.TextView[@text="Unlock Method"]',

  unlockMethodInfoIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',

  unlockMethodMasterPasswordTitle: '//android.widget.TextView[@text="Master Password"]',
  unlockMethodMasterPasswordDescription: '//android.widget.TextView[@text="Use your master password to unlock PearPass and decrypt your vault"]',
  unlockMethodMasterPasswordCheckboxChecked: '',
  unlockMethodMasterPasswordCheckboxUnchecked: '',

  biometricsUnlockTitle: '//android.widget.TextView[@text="Biometrics"]',
  biometricsUnlockDescription: `//android.widget.TextView[@text="Use your device's built-in authentications (Face ID, fingerprint, or system PIN)"]`,
  biometricsUnlockCheckboxChecked: '',
  biometricsUnlockCheckboxUnchecked: '',

  /* ----- Security Awareness ----- */
  securityAwarenessSectionTitle: '//android.widget.TextView[@text="Security Awareness"]',

  autoLockTitle: '//android.widget.TextView[@text="Auto Lock"]',
  autoLockDescription: '//android.widget.TextView[@text="Automatically lock the app after selected period of inactivity"]',
  autoLockTimeoutField: '~30 seconds',
  autoLockTimeoutText: '//android.widget.TextView[@text="30 seconds"]',
  autoLockTimeoutTextIcon: '//android.view.ViewGroup[@content-desc="30 seconds"]/com.horcrux.svg.SvgView',

  autoLockPopupTitle: '(//android.widget.TextView[@text="Auto Lock"])[1]',

  /* ----- Reminders (toggle row) ----- */
  remindersTitle: '//android.widget.TextView[@text="Reminders"]',
  remindersDescription: `//android.widget.TextView[@text="Get alerts when it's time to update your passwords"]`,
  remindersToggleOn: '',
  remindersToggleOff: '',

  /* ----- Auto Lock — bottom sheet (timeout picker) ----- */
  autoLockBottomSheet: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  autoLockBottomSheetTitle: '(//android.widget.TextView[@text="Auto Lock"])[1]',

  autoLockThirtySecondButton: '~30 seconds',
  autoLockThirtySecondButtonText: '(//android.widget.TextView[@text="30 seconds"])[1]',

  autoLockOneMinuteButton: '~1 minute',
  autoLockOneMinuteButtonText: '//android.widget.TextView[@text="1 minute"]',

  autoLockFiveMinutesButton: '~5 minutes',
  autoLockFiveMinutesButtonText: '//android.widget.TextView[@text="5 minutes"]',

  autoLockFifteenMinutesButton: '~15 minutes',
  autoLockFifteenMinutesButtonText: '//android.widget.TextView[@text="15 minutes"]',

  autoLockThirtyMinutesButton: '~30 minutes',
  autoLockThirtyMinutesButtonText: '//android.widget.TextView[@text="30 minutes"]',

  autoLockOneHourButton: '~1 hour',
  autoLockOneHourButtonText: '//android.widget.TextView[@text="1 hour"]',

  autoLockFourHoursButton: '~4 hours',
  autoLockFourHoursButtonText: '//android.widget.TextView[@text="4 hours"]',

  autoLockNeverButton: '~Never',
  autoLockNeverButtonText: '(//android.widget.TextView[@text="Never"])[1]',

  autolockFieldNever: '~Never',
  autolockFieldNeverText: '(//android.widget.TextView[@text="Never"])[1]',

  /* ============================
        SYNCING (section + children)
  ============================ */
  syncingSection: '~Syncing',
  syncingSectionText: '//android.widget.TextView[@text="Syncing"]',
  syncingSectionIcon: '//android.widget.Button[@content-desc="Syncing"]/android.view.ViewGroup/com.horcrux.svg.SvgView[2]',
  syncingSectionShowIcon: '//android.widget.Button[@content-desc="Syncing"]/android.view.ViewGroup/com.horcrux.svg.SvgView[1]',
  syncingSectionHideIcon: '',

  /* ----- BLIND PEERING PAGE ----- */
  blindPeering: '~Blind Peering',
  blindPeeringText: '//android.widget.TextView[@text="Blind Peering"]',
  blindPeeringIcon: '//android.widget.Button[@content-desc="Blind Peering"]/android.view.ViewGroup/com.horcrux.svg.SvgView',

  blindPeeringPageTitle: '//android.view.View[@text="Blind Peering"]',
  blindPeeringPageDescription: `//android.widget.TextView[@text="Sync your encrypted vault with other devices to improve availability and reliability. Peers only see encrypted data - they can't access or read anything"]`,
  blindPeeringPageEnableField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  blindPeeringPageEnableFieldTitle: '//android.widget.TextView[@text="Enable Blind Peering"]',
  blindPeeringPageEnableFieldText: '//android.widget.TextView[@text="Allows your vault to sync through blind peers"]',
  blindPeeringPageEnableFieldToggleOff: '~Enable Blind Peering',
  blindPeeringPageEnableFieldToggleOn: '',

  automaticBlindPeersField: '~Automatic Blind Peers, Let PearPass allocate blind peers for you to handle syncing',
  automaticBlindPeersFieldTitle: '//android.widget.TextView[@text="Automatic Blind Peers"]',
  automaticBlindPeersFieldText: '//android.widget.TextView[@text="Let PearPass allocate blind peers for you to handle syncing"]',
  automaticBlindPeersFieldCheckboxChecked: '',
  automaticBlindPeersFieldCheckboxUnchecked: '',

  manualBlindPeersField: '~Manual Blind Peers, Setup your own private blind peers',
  manualBlindPeersFieldTitle: '//android.widget.TextView[@text="Manual Blind Peers"]',
  manualBlindPeersFieldText: '//android.widget.TextView[@text="Setup your own private blind peers"]',
  manualBlindPeersFieldCheckboxChecked: '',
  manualBlindPeersFieldCheckboxUnchecked: '',

  manualBlindPeersPeerCodeFieldTpl: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup[{index}]/android.view.ViewGroup',
  manualBlindPeersPeerCodeFieldTitleTpl: '(//android.widget.TextView[@text="Blind Peer"])[{index}]',
  manualBlindPeersPeerCodeFieldInputTpl: '(//android.widget.EditText[@text="Enter Peer Code"])[{index}]',
  manualBlindPeersPeerCodeFieldRemoveButtonTpl: '(//android.widget.Button[@content-desc="Remove peer"])[{index}]',

  manualBlindPeersAddPeerButton: '~Add Peer',
  manualBlindPeersAddPeerButtonText: '//android.widget.TextView[@text="Add Peer"]',
  manualBlindPeersAddPeerButtonIcon: '//android.widget.Button[@content-desc="Add Peer"]/com.horcrux.svg.SvgView',

  saveChangesButton: '~Save Changes',
  saveChangesButtonText: '//android.widget.TextView[@text="Save Changes"]',

  vaultsImportedSuccessToastMessage: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]',
  vaultsImportedSuccessToastMessageText: '//android.widget.TextView[@text="Vaults imported successfully!"]',

  errorToast: '',
  errorToastText: '',

  /* ----- YOUR DEVICES PAGE ----- */
  yourDevices: '~Your Devices',
  yourDevicesText: '//android.widget.TextView[@text="Your Devices"]',
  yourDevicesIcon: '//android.widget.Button[@content-desc="Your Devices"]/android.view.ViewGroup/com.horcrux.svg.SvgView',

  yourDevicesPageTitle: '//android.view.View[@text="Your Devices"]',
  yourDevicesPageDescription: '//android.widget.TextView[@text="Devices listed here stay in sync. Changes made on one device update across all your vaults on every synced device."]',
  yourDevicesPageText: '//android.widget.TextView[@text="Synced Personal Devices"]',

  syncedPersonalDevicesField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  syncedPersonalDevicesFieldTitle: '//android.widget.TextView[@text="Android"]',
  syncedPersonalDevicesFieldData: '//android.widget.TextView[@text="Paired on 22 Apr, 2026"]',
  syncedPersonalDevicesFieldIcon1: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
  syncedPersonalDevicesFieldIcon2: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',


  /* ============================
        VAULT (section + children)
  ============================ */
  vaultSection: '//android.widget.Button[@content-desc="Vault"]',
  vaultSectionText: '(//android.widget.TextView[@text="Vault"])[1]',
  vaultSectionIcon: '//android.widget.Button[@content-desc="Vault"]/android.view.ViewGroup/com.horcrux.svg.SvgView[2]',
  vaultSectionShowIcon: '//android.widget.Button[@content-desc="Vault"]/android.view.ViewGroup/com.horcrux.svg.SvgView[1]',
  vaultSectionHideIcon: '',

  yourVaults: '~Your Vaults',
  yourVaultsText: '//android.widget.TextView[@text="Your Vaults"]',
  yourVaultsIcon: '//android.widget.Button[@content-desc="Your Vaults"]/android.view.ViewGroup/com.horcrux.svg.SvgView',

  importItems: '~Import Items',
  importItemsText: '//android.widget.TextView[@text="Import Items"]',
  importItemsIcon: '//android.widget.Button[@content-desc="Import Items"]/android.view.ViewGroup/com.horcrux.svg.SvgView',

  exportItems: '~Export Items',
  exportItemsText: '//android.widget.TextView[@text="Export Items"]',
  exportItemsIcon: '//android.widget.Button[@content-desc="Export Items"]/android.view.ViewGroup/com.horcrux.svg.SvgView',  

  /* ----- YOUR VAULTS PAGE ----- */
  yourVaultsPageTitle: '//android.view.View[@text="Your Vaults"]',
  yourVaultsPageDescription: '//android.widget.TextView[@text="Manage your vaults, control access permissions, and take protective measures if needed."]',

  yourVaultsPageVaultsField: '~Valeron, Private',
  yourVaultsPageVaultsFieldTitle: '//android.widget.TextView[@text="Current Vault"]',
  yourVaultsPageVaultsFieldVaultName: '//android.widget.TextView[@text="Valeron"]',
  yourVaultsPageVaultsFieldIcon1: '//android.view.ViewGroup[@content-desc="Valeron, Private"]/android.view.ViewGroup[1]',
  yourVaultsPageVaultsFieldIcon2: '//android.view.ViewGroup[@content-desc="Valeron, Private"]/com.horcrux.svg.SvgView',
  yourVaultsPageVaultsFieldVaultText: '//android.widget.TextView[@text="Private"]',
  yourVaultsPageVaultsFieldShareVaultButton: '//android.view.ViewGroup[@content-desc="Valeron, Private"]/android.widget.Button',
  yourVaultsPageVaultsFieldThreeDotsButton: '//android.view.ViewGroup[@content-desc="Valeron, Private"]/android.view.ViewGroup[2]',

  yourVaultsPageVaultsFieldTitleOtherVaults: '//android.widget.TextView[@text="Other Vaults"]',

  newCreatedVaultField: '~Kazik, Private',
  newCreatedVaultFieldTitle: '//android.widget.TextView[@text="Current Vault"]',
  newCreatedVaultFieldIcon1: '//android.view.ViewGroup[@content-desc="Kazik, Private"]/android.view.ViewGroup[1]',
  newCreatedVaultFieldVaultName: '//android.widget.TextView[@text="Kazik"]',
  newCreatedVaultFieldIcon2: '//android.view.ViewGroup[@content-desc="Kazik, Private"]/com.horcrux.svg.SvgView',
  newCreatedVaultFieldVaultText: '//android.widget.TextView[@text="Private"]',
  newCreatedVaultFieldShareVaultButton: '//android.view.ViewGroup[@content-desc="Kazik, Private"]/android.widget.Button',
  newCreatedVaultFieldThreeDotsButton: '//android.view.ViewGroup[@content-desc="Kazik, Private"]/android.view.ViewGroup[2]',

  newCreatedVaultFieldIbrahim: '~Ibrahim, Private',
  newCreatedVaultFieldIbrahimTitle: '//android.widget.TextView[@text="Current Vault"]',
  newCreatedVaultFieldIbrahimIcon1: '//android.view.ViewGroup[@content-desc="Ibrahim, Private"]/android.view.ViewGroup[1]',
  newCreatedVaultFieldIbrahimVaultName: '//android.widget.TextView[@text="Ibrahim"]',
  newCreatedVaultFieldIbrahimIcon2: '//android.view.ViewGroup[@content-desc="Ibrahim, Private"]/com.horcrux.svg.SvgView',
  newCreatedVaultFieldIbrahimVaultText: '//android.widget.TextView[@text="Private"]',
  newCreatedVaultFieldIbrahimShareVaultButton: '//android.view.ViewGroup[@content-desc="Ibrahim, Private"]/android.widget.Button',
  newCreatedVaultFieldIbrahimThreeDotsButton: '//android.view.ViewGroup[@content-desc="Ibrahim, Private"]/android.view.ViewGroup[2]',

  renamedVaultField: '~IbrahimNew, Private',
  renamedVaultFieldTitle: '//android.widget.TextView[@text="Current Vault"]',
  renamedVaultFieldIcon1: '//android.view.ViewGroup[@content-desc="IbrahimNew, Private"]/android.view.ViewGroup[1]',
  renamedVaultFieldVaultName: '//android.widget.TextView[@text="IbrahimNew"]',
  renamedVaultFieldIcon2: '//android.view.ViewGroup[@content-desc="IbrahimNew, Private"]/com.horcrux.svg.SvgView',
  renamedVaultFieldVaultText: '//android.widget.TextView[@text="Private"]',
  renamedVaultFieldShareVaultButton: '//android.view.ViewGroup[@content-desc="IbrahimNew, Private"]/android.widget.Button',
  renamedVaultFieldThreeDotsButton: '//android.view.ViewGroup[@content-desc="IbrahimNew, Private"]/android.view.ViewGroup[2]',

  createNewVaultButton: '~Create New Vault',
  createNewVaultButtonText: '//android.widget.TextView[@text="Create New Vault"]',
  createNewVaultButtonIcon: '//android.widget.Button[@content-desc="Create New Vault"]/com.horcrux.svg.SvgView',

  createNewVaultPageTitle: '(//android.widget.TextView[@text="Create New Vault"])[1]',
  createNewVaultPageSubtitle: '//android.view.View[@text="Create New Vault"]',
  createNewVaultPageDescription: '//android.widget.TextView[@text="Create your vault by giving it a name. Add an optional vault password if you want an extra layer of protection on top of your master password."]',

  vaultNameField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup',
  vaultNameFieldTitle: '//android.widget.TextView[@text="Vault Name"]',
  vaultNameFieldInput: '//android.widget.EditText[@text="Enter Name"]',

  setVaultPasswordTitle: '//android.widget.TextView[@text="Set Vault Password"]',
  setVaultPasswordDescription: '//android.widget.TextView[@text="Add extra password on top of your master password"]',

  toggleOffButton: '~Set Vault Password',
  toggleOnButton: '',

  vaultCreatedSuccessToast: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  vaultCreatedSuccessToastText: '//android.widget.TextView[@text="Vault created"]',

  enterVaultPasswordField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[7]',
  enterVaultPasswordFieldTitle: '//android.widget.TextView[@text="Password"]',
  enterVaultPasswordFieldInput: '//android.widget.EditText[@text="Enter vault password"]',
  enterVaultPasswordFieldShowPasswordButton: '(//android.widget.Button[@content-desc="Show password"])[1]',
  enterVaultPasswordFieldHidePasswordButton: 'Hide password',

  repeatVaultPasswordField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]/android.view.ViewGroup',
  repeatVaultPasswordFieldTitle: '//android.widget.TextView[@text="Repeat Password"]',
  repeatVaultPasswordFieldInput: '//android.widget.EditText[@text="Repeat vault password"]',
  repeatVaultPasswordFieldShowPasswordButton: '~Show password',
  repeatVaultPasswordFieldHidePasswordButton: '(//android.widget.Button[@content-desc="Hide password"])[2]',
  

  /* ----- SHARE VAULT PAGE ----- */
  shareVaultPageTitle: '//android.view.View[@text="Share Ibrahim Vault"]',
  yourVaultsShareVaultsPageDescription: '//android.widget.TextView[@text="Access Code"]',
  yourVaultsShareVaultsPageQrCodePicture: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]',
  codeExpireText: '//android.widget.TextView[@text="Code expires in"]',
  codeExpireTime: '',
  codeExpireTimeIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/com.horcrux.svg.SvgView',

  codeExpiredText: '//android.widget.TextView[@text="Code expired"]',

  yourVaultsShareVaultsPageVaultLinkField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]',
  yourVaultsShareVaultsPageVaultLinkFieldTitle: '//android.widget.TextView[@text="Vault Link"]',
  yourVaultsShareVaultsPageVaultLink: '',
  yourVaultsShareVaultsPageVaultLinkCopyIcon: '//android.widget.Button[@content-desc="Copy"]/com.horcrux.svg.SvgView',

  copiedToast: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  copiedToastText: '//android.widget.TextView[@text="Copied!"]',

  threeDotsPopUp: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  threeDotsRenameButtonIcon: '//android.widget.Button[@content-desc="Rename"]/android.view.ViewGroup',
  threeDotsRenameButton: '~Rename',
  threeDotsRenameButtonText: '//android.widget.TextView[@text="Rename"]',

  /* ----- RENAME VAULT PAGE ----- */
  renameVaultPageTitle: '//android.widget.TextView[@text="Rename Vault"]',
  renameVaultPageField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup',
  renameVaultPageFieldTitle: '//android.widget.TextView[@text="Vault Name"]',
  renameVaultPageFieldInput: '//android.widget.EditText[@text="Ibrahim"]',

  renameVaultPageCurrentPasswordField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[4]/android.view.ViewGroup',
  renameVaultPageCurrentPasswordFieldTitle: '//android.widget.TextView[@text="Current Password"]',
  renameVaultPageCurrentPasswordFieldInput: '//android.widget.EditText[@text="Enter vault password"]',
  renameVaultPageCurrentPasswordFieldShowPasswordButton: '~Show password',
  renameVaultPageCurrentPasswordFieldHidePasswordButton: '~Hide password',

  saveButton: '~Save',
  saveButtonText: '//android.widget.TextView[@text="Save"]',
  vaultRenamedToast: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  vaultRenamedToastText: '//android.widget.TextView[@text="Vault renamed"]',

  invalidPasswordToastMessage: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  invalidPasswordToastMessageText: '//android.widget.TextView[@text="Invalid vault password"]',

  successPasswordToastMessage: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  successPasswordToastMessageText: '//android.widget.TextView[@text="Vault renamed"]',

  /* ----- IMPORT ITEMS PAGE ----- */
  importItemsPageTitle: '//android.view.View[@text="Import"]',
  importItemsPageDescription: '//android.widget.TextView[@text="To import data from another password manager, first access the password manager, export your data, and then upload the exported file into the designated field"]',
  importItemsPageImportSourceField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  importItemsPageImportSourceFieldTitle: '//android.widget.TextView[@text="Select Import Source"]',

  /* ----- 1PASSWORD ----- */
  onePasswordField: '~1Password, Required Format: .CSV',
  onePasswordFieldTitle: '//android.widget.TextView[@text="1Password"]',
  onePasswordFieldIcon: '//android.view.ViewGroup[@content-desc="1Password, Required Format: .CSV"]/android.view.ViewGroup',
  onePasswordFieldText: '(//android.widget.TextView[@text="Required Format: .CSV"])[1]',
  onePasswordFieldIcon2: '//android.view.ViewGroup[@content-desc="1Password, Required Format: .CSV"]/com.horcrux.svg.SvgView',

  importFormBackButton: '~Back',
  
  importFromOnePasswordPageTitle: '//android.view.View[@text="Import from 1Password"]',
  importFromOnePasswordPageDescription: '//android.widget.TextView[@text="To import data from Proton Pass, open the app, go to Settings, navigate to the Export tab, and choose your preferred export format. Once the export is complete, upload the file here. Additionally, learn more about exporting data from Proton Pass."]',
  
  uploadFileField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
  onePasswordUploadFileFieldIcon: '//android.widget.ImageView',
  onePasswordUploadFileFieldIcon2: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  onePasswordUploadFileFieldLink: '(//android.widget.Button[@content-desc="Upload file"])[1]',
  onePasswordUploadFileFieldText: '//android.widget.TextView[@text="Upload file here"]',
  onePasswordUploadFileFieldText2: '//android.widget.TextView[@text="Required formats: .CSV"]',

  uploadFileButton: '(//android.widget.Button[@content-desc="Upload file"])[2]',
  uploadFileButtonText: '//android.widget.TextView[@text="Upload file"]',
  uploadFileButtonIcon: '(//android.widget.Button[@content-desc="Upload file"])[2]/com.horcrux.svg.SvgView',

  onePasswordImportedFIleField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
  onePasswordImportedFIleFieldText: '//android.widget.TextView[@text="1PasswordExport-VOOZZKNJHBAA7NTCW7SJU7763Y-20251217-223358.csv"]',
  onePasswordImportedFIleFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
  onePasswordImportedFIleFieldIcon2: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  onePasswordImportedFIleFieldFileSizeText: '//android.widget.TextView[@text="394 B"]',
  onePasswordImportedFIleFieldDeleteButton: '~Remove 1PasswordExport-VOOZZKNJHBAA7NTCW7SJU7763Y-20251217-223358.csv',

  onePasswordImportedFIleFieldText2: '//android.widget.TextView[@text="Required formats: .CSV"]',

  onePasswordImportedFIleFieldLink: '(//android.widget.Button[@content-desc="Upload file"])[1]',
  onePasswordImportedFIleFieldText3: '//android.widget.TextView[@text="Upload file here"]',


  importButton: '~Import',
  importButtonText: '//android.widget.TextView[@text="Import"]',

  /* ----- BITWARDEN ----- */
  bitwardenField: '~Bitwarden, Required Format: .JSON, .CSV',
  bitwardenFieldTitle: '//android.widget.TextView[@text="Bitwarden"]',
  bitwardenFieldIcon: '//android.view.ViewGroup[@content-desc="Bitwarden, Required Format: .JSON, .CSV"]/android.view.ViewGroup',
  bitwardenFieldText: '(//android.widget.TextView[@text="Required Format: .JSON, .CSV"])[1]',
  bitwardenFieldIcon2: '//android.view.ViewGroup[@content-desc="Bitwarden, Required Format: .JSON, .CSV"]/com.horcrux.svg.SvgView',

  bitwardenImportFromOnePasswordPageTitle: '//android.view.View[@text="Import from Bitwarden"]',
  bitwardenUploadFileFieldText2: '//android.widget.TextView[@text="Required formats: .JSON, .CSV"]',

  bitwardenCSVImportedFIleField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
  bitwardenCSVImportedFIleFieldText: '//android.widget.TextView[@text="bitwarden_export_20251218011811.csv"]',
  bitwardenCSVImportedFIleFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
  bitwardenCSVImportedFIleFieldIcon2: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  bitwardenCSVImportedFIleFieldFileSizeText: '//android.widget.TextView[@text="271 B"]',
  bitwardenCSVImportedFIleFieldDeleteButton: '~Remove bitwarden_export_20251218011811.csv',

  bitwardenJSONImportedFIleField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
  bitwardenJSONImportedFIleFieldText: '//android.widget.TextView[@text="bitwarden_export_20251218011800.json"]',
  bitwardenJSONImportedFIleFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
  bitwardenJSONImportedFIleFieldIcon2: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  bitwardenJSONImportedFIleFieldFileSizeText: '//android.widget.TextView[@text="4.6 KB"]',
  bitwardenJSONImportedFIleFieldDeleteButton: '~Remove bitwarden_export_20251218011800.json',

  /* ----- KEEPASS ----- */
  keepassField: '~KeePass, Required Format: .KDBX, .CSV, .XML',
  keepassFieldTitle: '//android.widget.TextView[@text="KeePass"]',
  keepassFieldIcon: '//android.view.ViewGroup[@content-desc="KeePass, Required Format: .KDBX, .CSV, .XML"]/android.view.ViewGroup',
  keepassFieldText: '//android.widget.TextView[@text="Required Format: .KDBX, .CSV, .XML"]',
  keepassFieldIcon2: '//android.view.ViewGroup[@content-desc="KeePass, Required Format: .KDBX, .CSV, .XML"]/com.horcrux.svg.SvgView',

  keepassImportFromOnePasswordPageTitle: '//android.view.View[@text="Import from KeePass"]',
  keepassUploadFileFieldText2: '//android.widget.TextView[@text="Required formats: .KDBX, .CSV, .XML"]',

  /* ----- KEEPASSXC ----- */
  keepassxcField: '~KeePassXC, Required Format: .CSV, .XML',
  keepassxcFieldTitle: '//android.widget.TextView[@text="KeePassXC"]',
  keepassxcFieldIcon: '//android.view.ViewGroup[@content-desc="KeePassXC, Required Format: .CSV, .XML"]/android.view.ViewGroup//android.view.ViewGroup[@content-desc="KeePassXC, Required Format: .CSV, .XML"]/android.view.ViewGroup',
  keepassxcFieldText: '//android.widget.TextView[@text="Required Format: .CSV, .XML"]',
  keepassxcFieldIcon2: '//android.view.ViewGroup[@content-desc="KeePassXC, Required Format: .CSV, .XML"]/com.horcrux.svg.SvgView',

  keepassxcImportFromOnePasswordPageTitle: '//android.view.View[@text="Import from KeePassXC"]',
  keepassxcUploadFileFieldText2: '//android.widget.TextView[@text="Required formats: .CSV, .XML"]',

  /* ----- LASTPASS ----- */
  lastpassField: '~LastPass, Required Format: .CSV',
  lastpassFieldTitle: '//android.widget.TextView[@text="LastPass"]',
  lastpassFieldIcon: '//android.view.ViewGroup[@content-desc="LastPass, Required Format: .CSV"]/android.view.ViewGroup',
  lastpassFieldText: '(//android.widget.TextView[@text="Required Format: .CSV"])[2]',
  lastpassFieldIcon2: '//android.view.ViewGroup[@content-desc="LastPass, Required Format: .CSV"]/com.horcrux.svg.SvgView',

  lastpassImportFromOnePasswordPageTitle: '//android.view.View[@text="Import from LastPass"]',
  lastpassUploadFileFieldText2: '//android.widget.TextView[@text="Required formats: .CSV"]',

  lastpassImportedFIleField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
  lastpassImportedFIleFieldText: '//android.widget.TextView[@text="lastpass_vault_export (1).csv"]',
  lastpassImportedFIleFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
  lastpassImportedFIleFieldIcon2: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  lastpassImportedFIleFieldFileSizeText: '//android.widget.TextView[@text="455 B"]',
  lastpassImportedFIleFieldDeleteButton: '~Remove lastpass_vault_export (1).csv',

  /* ----- NORDPASS ----- */
  nordpassField: '~NordPass, Required Format: .CSV',
  nordpassFieldTitle: '//android.widget.TextView[@text="NordPass"]',
  nordpassFieldIcon: '//android.view.ViewGroup[@content-desc="NordPass, Required Format: .CSV"]/android.view.ViewGroup',
  nordpassFieldText: '(//android.widget.TextView[@text="Required Format: .CSV"])[3]',
  nordpassFieldIcon2: '//android.view.ViewGroup[@content-desc="NordPass, Required Format: .CSV"]/com.horcrux.svg.SvgView',

  nordpassImportFromOnePasswordPageTitle: '//android.view.View[@text="Import from NordPass"]',
  nordpassUploadFileFieldText2: '//android.widget.TextView[@text="Required formats: .CSV"]',

  nordpassImportedFIleField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
  nordpassImportedFIleFieldText: '//android.widget.TextView[@text="nordpass_2025-10-25 01_47_36 (1).csv"]',
  nordpassImportedFIleFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
  nordpassImportedFIleFieldIcon2: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  nordpassImportedFIleFieldFileSizeText: '//android.widget.TextView[@text="475 B"]',
  nordpassImportedFIleFieldDeleteButton: '~Remove nordpass_2025-10-25 01_47_36 (1).csv',

  /* ----- PROTON PASS ----- */
  protonpassField: '~Proton Pass, Required Format: .CSV, .JSON',
  protonpassFieldTitle: '//android.widget.TextView[@text="Proton Pass"]',
  protonpassFieldIcon: '//android.view.ViewGroup[@content-desc="Proton Pass, Required Format: .CSV, .JSON"]/android.view.ViewGroup',
  protonpassFieldText: '//android.widget.TextView[@text="Required Format: .CSV, .JSON"]',
  protonpassFieldIcon2: '//android.view.ViewGroup[@content-desc="Proton Pass, Required Format: .CSV, .JSON"]/com.horcrux.svg.SvgView',

  protonpassImportFromOnePasswordPageTitle: '//android.view.View[@text="Import from Proton Pass"]',
  protonpassUploadFileFieldText2: '//android.widget.TextView[@text="Required formats: .CSV, .JSON"]',

  protonpassImportedFIleField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
  protonpassImportedFIleFieldText: '//android.widget.TextView[@text="Proton Pass_export_2025-12-17_1766000222.csv"]',
  protonpassImportedFIleFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
  protonpassImportedFIleFieldIcon2: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  protonpassImportedFIleFieldFileSizeText: '//android.widget.TextView[@text="1.3 KB"]',
  protonpassImportedFIleFieldDeleteButton: '~Remove Proton Pass_export_2025-12-17_1766000222.csv',

  /* ----- ENCRYPTED FILE ----- */
  encryptedFileField: '~Encrypted file, Required Format: .JSON',
  encryptedFileFieldTitle: '//android.widget.TextView[@text="Encrypted file"]',
  encryptedFileFieldIcon: '//android.view.ViewGroup[@content-desc="Encrypted file, Required Format: .JSON"]/android.view.ViewGroup',
  encryptedFileFieldText: '//android.widget.TextView[@text="Required Format: .JSON"]',
  encryptedFileFieldIcon2: '//android.view.ViewGroup[@content-desc="Encrypted file, Required Format: .JSON"]/com.horcrux.svg.SvgView',

  encryptedFileImportFromOnePasswordPageTitle: '//android.view.View[@text="Import from Encrypted file"]',
  encryptedFileUploadFileFieldText2: '//android.widget.TextView[@text="Required formats: .JSON"]',

  encryptedFileImportedFIleField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
  encryptedFileImportedFIleFieldText: '//android.widget.TextView[@text="PearPass_ytgiu_2025_12_02T10_41_25_523Z.json"]',
  encryptedFileImportedFIleFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
  encryptedFileImportedFIleFieldIcon2: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',
  encryptedFileImportedFIleFieldFileSizeText: '//android.widget.TextView[@text="PearPass_ytgiu_2025_12_02T10_41_25_523Z.json"]',
  encryptedFileImportedFIleFieldDeleteButton: '~Remove PearPass_ytgiu_2025_12_02T10_41_25_523Z.json',

  /* ----- UNENCRYPTED FILE ----- */
  unencryptedFileField: '~Unencrypted file, Required Format: .JSON, .CSV',
  unencryptedFileFieldTitle: '//android.widget.TextView[@text="Unencrypted file"]',
  unencryptedFileFieldIcon: '//android.view.ViewGroup[@content-desc="Unencrypted file, Required Format: .JSON, .CSV"]/android.view.ViewGroup',
  unencryptedFileFieldText: '(//android.widget.TextView[@text="Required Format: .JSON, .CSV"])[2]',
  unencryptedFileFieldIcon2: '//android.view.ViewGroup[@content-desc="Unencrypted file, Required Format: .JSON, .CSV"]/com.horcrux.svg.SvgView',

  unencryptedFileImportFromOnePasswordPageTitle: '//android.view.View[@text="Import from Unencrypted file"]',
  unencryptedFileUploadFileFieldText2: '//android.widget.TextView[@text="Required formats: .JSON, .CSV"]',


  /* ----- VAULT - EXPORT ITEMS PAGE ----- */
  vaultExportItemsPageTitle: '(//android.widget.TextView[@text="Export"])[1]',
  vaultExportItemsPageDescription: '//android.widget.TextView[@text="Download the data in the desired format and optionally protect the file with a password for securely backing up or transferring your data."]',

  vaultExportItemsPageJSONField: '~JSON (Recommended), JSON preserves all data, including custom fields, attachments, and metadata, ensuring a complete export',
  vaultExportItemsPageJSONFieldTitle: '//android.widget.TextView[@text="JSON (Recommended)"]',
  vaultExportItemsPageJSONFieldText: '//android.widget.TextView[@text="JSON preserves all data, including custom fields, attachments, and metadata, ensuring a complete export"]',
  vaultExportItemsPageJSONFieldRadioButtonOn: '//android.widget.RadioButton[@content-desc="JSON (Recommended), JSON preserves all data, including custom fields, attachments, and metadata, ensuring a complete export"]/android.view.ViewGroup/android.view.ViewGroup',
  vaultExportItemsPageJSONFieldRadioButtonOff: '//android.widget.RadioButton[@content-desc="JSON (Recommended), JSON preserves all data, including custom fields, attachments, and metadata, ensuring a complete export"]/android.view.ViewGroup',
  
  vaultExportItemsPageCSVField: '~CSV, CSV exports basic item data for spreadsheets, without custom fields, attachments, or metadata.',
  vaultExportItemsPageCSVFieldTitle: '//android.widget.TextView[@text="CSV"]',
  vaultExportItemsPageCSVFieldText: '//android.widget.TextView[@text="CSV exports basic item data for spreadsheets, without custom fields, attachments, or metadata."]',
  vaultExportItemsPageCSVFieldRadioButtonOff: '//android.widget.RadioButton[@content-desc="CSV, CSV exports basic item data for spreadsheets, without custom fields, attachments, or metadata."]/android.view.ViewGroup',
  vaultExportItemsPageCSVFieldRadioButtonOn: '//android.widget.RadioButton[@content-desc="CSV, CSV exports basic item data for spreadsheets, without custom fields, attachments, or metadata."]/android.view.ViewGroup/android.view.ViewGroup',

  vaultExportItemsPageProtectWithPasswordField: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup[1]',
  vaultExportItemsPageProtectWithPasswordFieldTitle: '//android.widget.TextView[@text="Protect with Password"]',
  vaultExportItemsPageProtectWithPasswordFieldText: '//android.widget.TextView[@text="Protect your exported file so it can only be opened with the password you set"]',
  vaultExportItemsPageProtectWithPasswordFieldToggleButtonOn: '',
  vaultExportItemsPageProtectWithPasswordFieldToggleButtonOff: '~Protect with Password',
  
  vaultExportItemsPagePasswordField: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup[3]/android.view.ViewGroup[1]/android.view.ViewGroup',
  vaultExportItemsPagePasswordFieldTitle: '//android.widget.TextView[@text="Password"]',
  vaultExportItemsPagePasswordFieldInput: '//android.widget.EditText[@text="Enter file password"]',
  vaultExportItemsPagePasswordFieldShowPasswordButton: '(//android.widget.Button[@content-desc="Show password"])[1]',
  vaultExportItemsPagePasswordFieldHidePasswordButton: '~Hide password',

  vaultExportItemsPageRepeatPasswordField: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup[3]/android.view.ViewGroup[2]/android.view.ViewGroup',
  vaultExportItemsPageRepeatPasswordFieldTitle: '//android.widget.TextView[@text="Repeat Password"]',
  vaultExportItemsPageRepeatPasswordFieldInput: '//android.widget.EditText[@text="Repeat file password"]',
  vaultExportItemsPageRepeatPasswordFieldShowPasswordButton: '(//android.widget.Button[@content-desc="Show password"])[2]',
  vaultExportItemsPageRepeatPasswordFieldHidePasswordButton: '~Hide password',
  
  vaultExportItemsPageExportButton: '~Export',
  vaultExportItemsPageExportButtonText: '//android.widget.TextView[@text="Export"]',
  

  /* ----- VERIFICATION REQUIRED POPUP ----- */
  fingerPrintPopup: '//android.view.View[@resource-id="com.android.systemui:id/panel"]',
  fingerPrintPopupLogo: '~App logo',
  fingerPrintPopupTitle: '//android.widget.TextView[@resource-id="com.android.systemui:id/logo_description"]',
  fingerPrintPopupSensor: '~Fingerprint sensor',
  fingerPrintPopupCancelButton: '//android.widget.Button[@resource-id="com.android.systemui:id/button_negative"]',


  verificationRequiredPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  verificationRequiredPopupTitle: '//android.widget.TextView[@text="Verification Required"]',
  verificationRequiredPopupDescription: '//android.widget.TextView[@text="Use your Master Password or biometric ID to authorize this action."]',
  verificationRequiredPopupEnterMasterPasswordField: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup/android.view.ViewGroup[3]',
  verificationRequiredPopupEnterMasterPasswordFieldTitle: '//android.widget.TextView[@text="Password"]',
  verificationRequiredPopupEnterMasterPasswordFieldInput: '//android.widget.EditText[@text="Enter Master Password"]',
  verificationRequiredPopupEnterMasterPasswordFieldShowPasswordButton: '~Show password',
  verificationRequiredPopupEnterMasterPasswordFieldHidePasswordButton: '~Hide password',
  verificationRequiredPopupTryWIthFingerprintLink: '~Try again with Fingerprint',

  verificationRequiredPopupContinueButton: '~busy',
  verificationRequiredPopupContinueButtonIcon: '//android.widget.Button[@content-desc="busy"]/com.horcrux.svg.SvgView',
  verificationRequiredPopupContinueButtonText: '//android.widget.TextView[@text="Continue"]',

  /* ----- SHARE POPUP ----- */
  sharePopupTitle: '//android.widget.TextView[@resource-id="com.android.intentresolver:id/headline"]',
  sharePopupFileNameField: '//android.widget.RelativeLayout[@resource-id="android:id/content_preview_file_layout"]',
  sharePopupFileNameFieldText: '//android.widget.TextView[@resource-id="com.android.intentresolver:id/content_preview_filename"]',


  exportSuccessToast: '//android.view.ViewGroup[@resource-id="toastContentContainer"]',
  exportSuccessToastTitle: '//android.widget.TextView[@resource-id="toastText1"]',
  exportSuccessToastText: '//android.widget.TextView[@resource-id="toastText2"]',

  /* ============================
        APPEARANCE (section + children)
  ============================ */
  appearanceSection: '~Appearance',
  appearanceSectionText: '//android.widget.TextView[@text="Appearance"]',
  appearanceSectionIcon: '//android.widget.Button[@content-desc="Appearance"]/android.view.ViewGroup/com.horcrux.svg.SvgView[2]',
  appearanceSectionShowIcon: '//android.widget.Button[@content-desc="Appearance"]/android.view.ViewGroup/com.horcrux.svg.SvgView[1]',
  appearanceSectionHideIcon: '',

  language: '~Language',
  languageText: '//android.widget.TextView[@text="Language"]',
  languageIcon: '//android.widget.Button[@content-desc="Language"]/android.view.ViewGroup/com.horcrux.svg.SvgView',

  /* ----- Language Page ----- */
  languagePageTitle: '//android.view.View[@text="Language"]',
  languagePageDescription: '//android.widget.TextView[@text="Choose the language of the app."]',

  languagePageLanguageField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  languagePageLanguageFieldTitle: '//android.widget.TextView[@text="App Language"]',
  languagePageLanguageFieldText: '//android.widget.TextView[@text="Select the language used throughout PearPass."]',
  languagePageLanguageFieldLanguageButton: '//android.view.ViewGroup[@resource-id="language-selector"]',
  languagePageLanguageFieldLanguageButtonText: '//android.widget.TextView[@text="English"]',
  languagePageLanguageFieldLanguageButtonIcon: '//android.view.ViewGroup[@resource-id="language-selector"]/com.horcrux.svg.SvgView',

  languagePageLanguagePopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  languagePageLanguagePopupTitle: '(//android.widget.TextView[@text="App Language"])[1]',
  languagePageLanguagePopupLanguageButton: '~English',
  languagePageLanguagePopupLanguageButtonText: '(//android.widget.TextView[@text="English"])[1]',

  /* ============================
        ABOUT (section + children)
  ============================ */
  aboutSection: '~About',
  aboutSectionText: '//android.widget.TextView[@text="About"]',
  aboutSectionIcon: '//android.widget.Button[@content-desc="About"]/android.view.ViewGroup/com.horcrux.svg.SvgView[2]',
  aboutSectionShowIcon: '//android.widget.Button[@content-desc="About"]/android.view.ViewGroup/com.horcrux.svg.SvgView[1]',
  aboutSectionHideIcon: '',

  reportAProblem: '~Report a problem',
  reportAProblemText: '//android.widget.TextView[@text="Report a problem"]',
  reportAProblemIcon: '//android.widget.Button[@content-desc="Report a problem"]/android.view.ViewGroup/com.horcrux.svg.SvgView',

  reportAPorblemSuccessFeedbackToastMessage: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  reportAPorblemSuccessFeedbackToastMessageText: '//android.widget.TextView[@text="Feedback sent"]',

  appVersion: '~App Version',
  appVersionText: '//android.widget.TextView[@text="App Version"]',
  appVersionIcon: '//android.widget.Button[@content-desc="App Version"]/android.view.ViewGroup/com.horcrux.svg.SvgView',

  /* ----- Report a Problem Page ----- */
  reportAProblemPageTitle: '//android.view.View[@text="Report a problem"]',
  reportAProblemPageDescription: `//android.widget.TextView[@text="Tell us what's going wrong and leave your email so we can follow up with you."]`,
  reportAProblemPageIssueInputField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
  reportAProblemPageIssueInputFieldTitle: '//android.widget.TextView[@text="Report a problem"]',
  reportAProblemPageIssueInputFieldInput: '//android.widget.EditText[@text="Write your issue"]',

  reportAProblemPageSendButton: `~￼, Send`,
  reportAProblemPageSendButtonText: '//android.widget.TextView[@text="Send"]',
  reportAProblemPageSendButtonIcon: '//android.widget.Button[@content-desc="￼, Send"]/com.horcrux.svg.SvgView',

  successFeedbackToast: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
  successFeedbackToastText: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',

  /* ----- APP VERSION PAGE ----- */
  appVersionPageTitle: '//android.view.View[@text="App version"]',
  appVersionPageDescription: `//android.widget.TextView[@text="Here you can find all the info about your app.
Check here to see the Terms of Use and the Privacy Statement and visit our website."]`,
  appVersionPageVersionField: '//android.widget.Button[@content-desc="App version, 1.6.0"]',
  appVersionPageVersionFieldText: '//android.widget.TextView[@text="App version"]',
  appVersionPageVersionFieldVersion: '//android.widget.TextView[@text="1.6.0"]',

  termsOfUse: '~Terms of Use',
  termsOfUsePageTitle: '//android.widget.TextView[@text="PearPass Application Terms of Use"]',
  privacyStatement: '~Privacy Statement',
  privacyStatementPageTitle: '//android.widget.TextView[@text="PearPass Application Privacy Statement"]',
  visitOurWebsite: '~visit our website',
  visitOurWebsitePageTitle: '//android.widget.TextView[@text="PearPass"]',
  visitOurWebsitePageTitle1: '//android.widget.TextView[@text="Your Open-Source Password Manager"]',

  systemPickerMenuButton: '~Show roots',
  systemPickerDownloadsButton:
    '//android.widget.ListView[@resource-id="com.google.android.documentsui:id/roots_list"]/android.widget.LinearLayout[4]',
  systemPickerDownloadsFolderTitle:
    '//android.widget.TextView[@text="Downloads"]',

} as const

export default settingsLocators
