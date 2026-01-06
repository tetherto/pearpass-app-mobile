const signUpLocators = {
  /* =====================================================
        CREATE MASTER PASSWORD
  ===================================================== */

  createPasswordScreen: '~create-password-screen',
  createPasswordLogo: '~create-password-logo',
  createPasswordTitle: '~create-password-title',
  createPasswordDescription: '~create-password-description',
  createPasswordInput: '//android.view.ViewGroup[@resource-id="create-password-input"]//android.widget.EditText',
  createPasswordInputToggleVisibility: '//android.view.ViewGroup[@resource-id="create-password-input"]/android.view.ViewGroup/com.horcrux.svg.SvgView',
  createPasswordConfirmInput: '//android.view.ViewGroup[@resource-id="create-password-confirm-input"]//android.widget.EditText',
  createPasswordConfirmInputToggleVisibility: '//android.view.ViewGroup[@resource-id="create-password-confirm-input"]/android.view.ViewGroup/com.horcrux.svg.SvgView',
  createPasswordRequirementsContainer: '~create-password-requirements-container',
  createPasswordRequirementsText: '~create-password-requirements-text',
  createPasswordRequirementUppercase: '~create-password-requirement-uppercase',
  createPasswordRequirementLowercase: '~create-password-requirement-lowercase',
  createPasswordRequirementNumber: '~create-password-requirement-number',
  createPasswordRequirementSpecial: '~create-password-requirement-special',
  createPasswordRequirementNote: '~create-password-requirement-note',
  createPasswordWarning: '~create-password-warning',
  createPasswordWarningText: `//android.widget.TextView[@text="Don't forget your master password. It's the only way to access your vault. We can't help recover it. Back it up securely."]`,
  createPasswordTermsTitle: '~create-password-terms-title',
  createPasswordTermsCheckboxUnchecked: '~create-password-terms-checkbox-unchecked',
  createPasswordTermsCheckboxChecked: '~create-password-terms-checkbox-checked',
  createPasswordTermsLink: '//android.widget.TextView[@text="I have read and agree to the PearPass Application Terms of Use."]',
  createPasswordTermsLinkFallback: '//android.widget.TextView[@text="I have read and agree to the PearPass Application Terms of Use."]',
  createPasswordContinueButton: '~Continue',
  chromeUrlBar: '//android.widget.EditText[@resource-id="com.android.chrome:id/url_bar"]',
  enterPasswordPasswordIsRequiredWarning: '//android.widget.TextView[@text=" Password is required "][1]',
  enterPasswordPasswordIsRequiredWarningIcon: '//android.view.ViewGroup[@resource-id="create-password-input"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
  confirmPasswordPasswordIsRequiredWarning: '//android.widget.TextView[@text=" Password is required "][2]',
  confirmPasswordPasswordIsRequiredWarningIcon: '//android.view.ViewGroup[@resource-id="create-password-confirm-input"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
  enterPasswordPasswordMustBeAtLeast8CharactersLongWarning: '//android.widget.TextView[@text=" Password must be at least 8 characters long "]',
  enterPasswordPasswordMustBeAtLeast8CharactersLongIcon: '//android.view.ViewGroup[@content-desc=" Password must be at least 8 characters long "]/com.horcrux.svg.SvgView[2]',
  enterPasswordPasswordMustContainAtLeastOneUppercaseLetterWarning: '//android.widget.TextView[@text=" Password must contain at least one uppercase letter "]',
  enterPasswordPasswordMustContainAtLeastOneUppercaseLetterWarningIcon: '//android.view.ViewGroup[@content-desc=" Password must contain at least one uppercase letter "]/com.horcrux.svg.SvgView[2]',
  enterPasswordPasswordMustContainAtLeastOneLowercaseLetterWarning: '//android.widget.TextView[@text=" Password must contain at least one lowercase letter "]',
  enterPasswordPasswordMustContainAtLeastOneLowercaseLetterWarningIcon: '//android.view.ViewGroup[@content-desc=" Password must contain at least one lowercase letter "]/com.horcrux.svg.SvgView[2]',
  enterPasswordPasswordMustContainAtLeastOneNumberWarning: '//android.widget.TextView[@text=" Password must contain at least one number "]',
  enterPasswordPasswordMustContainAtLeastOneNumberWarningIcon: '//android.view.ViewGroup[@content-desc=" Password must contain at least one number "]/com.horcrux.svg.SvgView[2]',
  enterPasswordPasswordMustContainAtLeastOneSpecialCharacterWarning: '//android.widget.TextView[@text=" Password must contain at least one special character "]',
  enterPasswordPasswordMustContainAtLeastOneSpecialCharacterWarningIcon: '//android.view.ViewGroup[@content-desc=" Password must contain at least one special character "]/com.horcrux.svg.SvgView[2]',
  confirmPasswordPasswordsDoNotMatchWarning: '//android.widget.TextView[@text=" Passwords do not match "]',
  confirmPasswordPasswordsDoNotMatchWarningIcon: '//android.view.ViewGroup[@content-desc=" Passwords do not match "]/com.horcrux.svg.SvgView[2]',

  /* =====================================================
        ENTER MASTER PASSWORD
  ===================================================== */

  enterPasswordTitle: '~enter-password-title',
  enterPasswordInput: '//android.view.ViewGroup[@resource-id="enter-password-input"]//android.widget.EditText',
  enterPasswordInputIcon: '//android.view.ViewGroup[@resource-id="enter-password-input"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
  enterPasswordInputToggleVisibility: '//android.view.ViewGroup[@resource-id="enter-password-input"]/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  enterPasswordWarning: '~enter-password-warning',
  enterPasswordWarningIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
  enterPasswordWarningText: `//android.widget.TextView[@text="Don't forget your master password. It's the only way to access your vault. We can't help recover it. Back it up securely."]`,
  enterPasswordContinueButton: '~Continue',
  enterPasswordContinueText: '//android.widget.TextView[@text="Continue"]',
  enterPasswordMasterPasswordRequiredWarning: '//android.widget.TextView[@text=" Password is required "]',
  enterPasswordIncorrectPasswordWarning: '//android.widget.TextView[contains(@text, "Incorrect password. You have")]',
  enterPasswordInvalidPasswordWarning: '//android.widget.TextView[@text=" Invalid password "]',
  enterPasswordIncorrectPassword4AttemptsWarning: '//android.widget.TextView[@text=" Incorrect password. You have 4 attempts before the app locks for 5 minutes. "]',
  enterPasswordIncorrectPassword3AttemptsWarning: '//android.widget.TextView[@text=" Incorrect password. You have 3 attempts before the app locks for 5 minutes. "]',
  enterPasswordIncorrectPassword2AttemptsWarning: '//android.widget.TextView[@text=" Incorrect password. You have 2 attempts before the app locks for 5 minutes. "]',
  enterPasswordIncorrectPassword1AttemptWarning: '//android.widget.TextView[@text=" Incorrect password. You have 1 attempt before the app locks for 5 minutes. "]',

  /* =====================================================
        SELECT VAULT TYPE
  ===================================================== */


  selectVaultTypeEmptyTitle: '~select-vault-type-empty-title',
  selectVaultTypeEmptySubtitle: '~select-vault-type-empty-subtitle',
  selectVaultTypeListTitle: '~select-vault-type-list-title',
  selectVaultTypeCreateNew: '~Create a new vault',
  selectVaultTypeCreateNewText: '//android.widget.TextView[@text="Create a new vault"]',
  selectVaultTypeLoadExisting: '~Load a vault',
  selectVaultTypeLoadExistingText: '//android.widget.TextView[@text="Load a vault"]',

  /* =====================================================
        LOAD VAULT
  ===================================================== */

  loadVaultTitle: '~load-vault-title',
  loadVaultSubtitle: '~load-vault-subtitle',
  loadVaultInviteCodeInput: '//android.view.ViewGroup[@resource-id="load-vault-invite-code-input"]',
  loadVaultInviteCodeInputText: `//android.widget.EditText[@text="Insert your vault's code..."]`,
  loadVaultOpenButton: '~Open Vault',
  loadVaultOpenButtonText: '//android.widget.TextView[@text="Open Vault"]',
  loadVaultSelectVaultsButton: '~Select Vaults',
  loadVaultSelectVaultsText: '//android.widget.TextView[@text="Select Vaults"]',
  loadVaultScanQrButton: '~Scan QR Code',
  loadVaultScanQrButtonText: '//android.widget.TextView[@text="Scan QR Code"]',
  loadVaultScanQrButtonIcon: '//android.view.ViewGroup[@content-desc="Scan QR Code"]/com.horcrux.svg.SvgView',

  /* =====================================================
        NEW VAULT
  ===================================================== */

  newVaultTitle: '~new-vault-title',
  newVaultSubtitle: '~new-vault-subtitle',
  newVaultNameInput: '//android.widget.EditText[@text="Enter Name"]',
  newVaultNameRequiredWarning: '//android.widget.TextView[@text=" Name is required "]',
  newVaultNameRequiredWarningIcon: '//android.view.ViewGroup[@content-desc=" Name is required "]/com.horcrux.svg.SvgView[2]',
  newVaultContinueButton: '~Continue',
  newVaultContinueText: '//android.widget.TextView[@text="Continue"]',
  newVaultSelectVaultsButton: '~Select Vaults',
  newVaultSelectVaultsText: '//android.widget.TextView[@text="Select Vaults"]',

  /* =====================================================
        UNLOCK VAULT
  ===================================================== */

  unlockVaultScreen: '~unlock-vault-screen',
  unlockVaultScroll: '~unlock-vault-scroll',
  unlockVaultFormContainer: '~unlock-vault-form-container',
  unlockVaultTitle: '~unlock-vault-title',
  unlockVaultPasswordInput: '~unlock-vault-password-input',
  unlockVaultContinueButton: '~unlock-vault-continue-button',
  unlockVaultSelectVaultsButton: '~unlock-vault-select-vaults-button',
  unlockVaultLoading: '~unlock-vault-loading',

  /* =====================================================
        SELECT VAULTS
  ===================================================== */

  selectVaultsTitle: '//android.widget.TextView[@resource-id="select-vault-type-list-title"]',
  selectVaultsVaultsList: '//android.view.ViewGroup[@content-desc="Valeron, 06/01/2026"]',
}

export default signUpLocators
