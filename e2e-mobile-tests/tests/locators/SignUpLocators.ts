const signUpLocators = {
  /* =====================================================
        CREATE MASTER PASSWORD
  ===================================================== */

  createPasswordScreen: '~create-password-screen',
  createPasswordLogo: '~create-password-logo',
  createPasswordTitle: '~create-password-title',
  createPasswordDescription: '~create-password-description',
  createPasswordInput: '~create-password-input',
  createPasswordInputToggleVisibility: '~create-password-input-toggle-visibility',
  createPasswordConfirmInput: '~create-password-confirm-input',
  createPasswordConfirmInputToggleVisibility: '~create-password-confirm-input-toggle-visibility',
  createPasswordRequirementsContainer: '~create-password-requirements-container',
  createPasswordRequirementsText: '~create-password-requirements-text',
  createPasswordRequirementUppercase: '~create-password-requirement-uppercase',
  createPasswordRequirementLowercase: '~create-password-requirement-lowercase',
  createPasswordRequirementNumber: '~create-password-requirement-number',
  createPasswordRequirementSpecial: '~create-password-requirement-special',
  createPasswordRequirementNote: '~create-password-requirement-note',
  createPasswordWarning: '~create-password-warning',
  createPasswordWarningText: '~create-password-warning-text',
  createPasswordTermsTitle: '~create-password-terms-title',
  createPasswordTermsCheckboxUnchecked: '~create-password-terms-checkbox-unchecked',
  createPasswordTermsCheckboxChecked: '~create-password-terms-checkbox-checked',
  createPasswordTermsLink: '~create-password-terms-link',
  createPasswordContinueButton: '~create-password-continue-button',
  createPasswordLoading: '~create-password-loading',
  chromeUrlBar: '//android.widget.EditText[@resource-id="com.android.chrome:id/url_bar"]',

  /* =====================================================
        ENTER MASTER PASSWORD
  ===================================================== */

  enterPasswordScreen: '~enter-password-screen',
  enterPasswordLogo: '~enter-password-logo',
  enterPasswordTitle: '~enter-password-title',
  enterPasswordInput: '~enter-password-input',
  enterPasswordInputToggleVisibility: '~enter-password-input-toggle-visibility',
  enterPasswordWarning: '~enter-password-warning',
  enterPasswordWarningText: '~enter-password-warning-text',
  enterPasswordContinueButton: '~enter-password-continue-button',
  enterPasswordContinueText: '//android.widget.TextView[@text="Continue"]',

  /* =====================================================
        SELECT VAULT TYPE
  ===================================================== */

  selectVaultTypeLogo: '//com.horcrux.svg.GroupView/com.horcrux.svg.PathView[35]',
  selectVaultTypeEmptyTitle: '~select-vault-type-empty-title',
  selectVaultTypeEmptySubtitle: '~select-vault-type-empty-subtitle',
  selectVaultTypeListTitle: '~select-vault-type-list-title',
  selectVaultTypeCreateNew: '~select-vault-type-create-new',
  selectVaultTypeCreateNewText: '//android.widget.TextView[@text="Create a new vault"]',
  selectVaultTypeLoadExisting: '~select-vault-type-load-existing',
  selectVaultTypeLoadExistingText: '//android.widget.TextView[@text="Load a vault"]',

  /* =====================================================
        LOAD VAULT
  ===================================================== */

  loadVaultTitle: '~load-vault-title',
  loadVaultSubtitle: '~load-vault-subtitle',
  loadVaultInviteCodeInput: '~load-vault-invite-code-input',
  loadVaultOpenButton: '~load-vault-open-button',
  loadVaultOpenButtonText: '//android.widget.TextView[@text="Open Vault"]',
  loadVaultSelectVaultsButton: '~load-vault-select-vaults-button',
  loadVaultSelectVaultsText: '//android.widget.TextView[@text="Select Vaults"]',
  loadVaultScanQrButton: '~load-vault-scan-qr-button',
  loadVaultScanQrButtonText: '//android.widget.TextView[@text="Scan QR Code"]',

  /* =====================================================
        NEW VAULT
  ===================================================== */

  newVaultTitle: '~new-vault-title',
  newVaultSubtitle: '~new-vault-subtitle',
  newVaultNameInput: '~new-vault-name-input',
  newVaultContinueButton: '~new-vault-continue-button',
  newVaultContinueText: '//android.widget.TextView[@text="Continue"]',
  newVaultSelectVaultsButton: '~new-vault-select-vaults-button',
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
  unlockVaultLoading: '~unlock-vault-loading'
}

export default signUpLocators
