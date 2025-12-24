import BasePage from '@pages/BasePage';
import signUpLocators from '@locators/SignUpLocators';
import { CREATE_PASSWORD_SCREEN, ENTER_PASSWORD_SCREEN, SELECT_VAULT_TYPE_SCREEN, NEW_VAULT_SCREEN, LOAD_VAULT_SCREEN } from '@data/signUp.data';

class SignUpPage extends BasePage {
  protected selectors = signUpLocators;

  /* ==================== CREATE PASSWORD SCREEN GETTERS ==================== */
  get createPasswordScreen() { return this.$('createPasswordScreen'); }
  get createPasswordLogo() { return this.$('createPasswordLogo'); }
  get createPasswordTitle() { return this.$('createPasswordTitle'); }
  get createPasswordDescription() { return this.$('createPasswordDescription'); }
  get createPasswordInput() { return this.$('createPasswordInput'); }
  get createPasswordInputToggleVisibility() { return this.$('createPasswordInputToggleVisibility'); }
  get createPasswordConfirmInput() { return this.$('createPasswordConfirmInput'); }
  get createPasswordConfirmInputToggleVisibility() { return this.$('createPasswordConfirmInputToggleVisibility'); }
  get createPasswordRequirementsContainer() { return this.$('createPasswordRequirementsContainer'); }
  get createPasswordRequirementsText() { return this.$('createPasswordRequirementsText'); }
  get createPasswordRequirementUppercase() { return this.$('createPasswordRequirementUppercase'); }
  get createPasswordRequirementLowercase() { return this.$('createPasswordRequirementLowercase'); }
  get createPasswordRequirementNumber() { return this.$('createPasswordRequirementNumber'); }
  get createPasswordRequirementSpecial() { return this.$('createPasswordRequirementSpecial'); }
  get createPasswordRequirementNote() { return this.$('createPasswordRequirementNote'); }
  get createPasswordWarning() { return this.$('createPasswordWarning'); }
  get createPasswordWarningText() { return this.$('createPasswordWarningText'); }
  get createPasswordTermsTitle() { return this.$('createPasswordTermsTitle'); }
  get createPasswordTermsCheckboxUnchecked() { return this.$('createPasswordTermsCheckboxUnchecked'); }
  get createPasswordTermsCheckboxChecked() { return this.$('createPasswordTermsCheckboxChecked'); }
  get createPasswordTermsLink() { return this.$('createPasswordTermsLink'); }
  get createPasswordContinueButton() { return this.$('createPasswordContinueButton'); }
  get createPasswordLoading() { return this.$('createPasswordLoading'); }
  get chromeUrlBar() { return this.$('chromeUrlBar'); }

  /* ==================== ENTER MASTER PASSWORD SCREEN GETTERS ==================== */
  get enterPasswordScreen() { return this.$('enterPasswordScreen'); }
  get enterPasswordLogo() { return this.$('enterPasswordLogo'); }
  get enterPasswordTitle() { return this.$('enterPasswordTitle'); }
  get enterPasswordInput() { return this.$('enterPasswordInput'); }
  get enterPasswordInputToggleVisibility() { return this.$('enterPasswordInputToggleVisibility'); }
  get enterPasswordWarning() { return this.$('enterPasswordWarning'); }
  get enterPasswordContinueButton() { return this.$('enterPasswordContinueButton'); }
  get enterPasswordBiometricButton() { return this.$('enterPasswordBiometricButton'); }
  get enterPasswordLoading() { return this.$('enterPasswordLoading'); }

  /* ==================== CREATE PASSWORD SCREEN METHODS ==================== */
  async waitForCreatePasswordScreen(): Promise<this> {
    await this.createPasswordTitle.waitForDisplayed({ timeoutMsg: 'Create password screen not visible' });
    return this.self;
  }

  async verifyCreatePasswordScreenContent(): Promise<this> {
    // Pre-wait for main elements with shorter timeout before expect.soft checks
    const titleEl = this.createPasswordTitle;
    const descEl = this.createPasswordDescription;
    const reqTextEl = this.createPasswordRequirementsText;
    
    await Promise.all([
      titleEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      descEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      reqTextEl.waitForDisplayed({ timeout: 2000 }).catch(() => {})
    ]);
    
    await expect.soft(titleEl)
      .toHaveText(CREATE_PASSWORD_SCREEN.title, { message: 'Title should match' });
    
    await expect.soft(descEl)
      .toHaveText(CREATE_PASSWORD_SCREEN.description, { message: 'Description should match' });
    
    await expect.soft(reqTextEl)
      .toHaveText(CREATE_PASSWORD_SCREEN.requirementsText, { message: 'Requirements text should match' });
    
    const isUppercaseMatching = await this.isTextMatching('createPasswordRequirementUppercase', CREATE_PASSWORD_SCREEN.requirementUppercase, false);
    await expect.soft(isUppercaseMatching).toBe(true);
    
    const isLowercaseMatching = await this.isTextMatching('createPasswordRequirementLowercase', CREATE_PASSWORD_SCREEN.requirementLowercase, false);
    await expect.soft(isLowercaseMatching).toBe(true);
    
    const isNumberMatching = await this.isTextMatching('createPasswordRequirementNumber', CREATE_PASSWORD_SCREEN.requirementNumber, false);
    await expect.soft(isNumberMatching).toBe(true);
    
    const isSpecialMatching = await this.isTextMatching('createPasswordRequirementSpecial', CREATE_PASSWORD_SCREEN.requirementSpecial, false);
    await expect.soft(isSpecialMatching).toBe(true);
    
    const noteEl = this.createPasswordRequirementNote;
    await noteEl.waitForDisplayed({ timeout: 2000 }).catch(() => {});
    await expect.soft(noteEl)
      .toHaveText(CREATE_PASSWORD_SCREEN.requirementNote, { message: 'Note should match' });
    
    const isWarningMatching = await this.isTextMatching('createPasswordWarning', CREATE_PASSWORD_SCREEN.warning, false);
    await expect.soft(isWarningMatching).toBe(true);
    
    const termsTitleEl = this.createPasswordTermsTitle;
    const continueBtnEl = this.createPasswordContinueButton;
    await Promise.all([
      termsTitleEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      continueBtnEl.waitForDisplayed({ timeout: 2000 }).catch(() => {})
    ]);
    
    await expect.soft(termsTitleEl)
      .toHaveText(CREATE_PASSWORD_SCREEN.termsTitle, { message: 'Terms title should match' });
    
    await expect.soft(continueBtnEl)
      .toHaveText(CREATE_PASSWORD_SCREEN.continueButton, { message: 'Continue button text should match' });

    return this.self;
  }

  async enterPassword(password: string): Promise<this> {
    await this.createPasswordInput.setValue(password);
    return this.self;
  }
  
  async verifyCreatePasswordWarningText(): Promise<this> {
    await expect.soft(this.createPasswordWarningText)
      .toHaveText(CREATE_PASSWORD_SCREEN.warning, { message: 'Warning text should match' });
    return this.self;
  }

  async enterConfirmPassword(password: string): Promise<this> {
    await this.createPasswordConfirmInput.setValue(password);
    return this.self;
  }

  async enterPasswords(password: string): Promise<this> {
    await this.enterPassword(password);
    await this.enterConfirmPassword(password);
    return this.self;
  }

  async acceptTerms(): Promise<this> {
    await this.createPasswordTermsCheckboxUnchecked.click();
    return this.self;
  }

  async chromeUrlBarDisplayed(): Promise<this> {
    await expect.soft(this.chromeUrlBar)
      .toBeDisplayed({ message: 'Chrome URL bar should be displayed' });
    return this.self;
  }

  async verifyTermsCheckboxUnchecked(): Promise<this> {
    await expect.soft(this.createPasswordTermsCheckboxUnchecked)
      .toBeDisplayed({ message: 'Terms checkbox should be unchecked' });
    return this.self;
  }

  async verifyTermsCheckboxChecked(): Promise<this> {
    await expect.soft(this.createPasswordTermsCheckboxChecked)
      .toBeDisplayed({ message: 'Terms checkbox should be checked' });
    return this.self;
  }

  async tapContinue(): Promise<this> {
    await this.createPasswordContinueButton.click();
    return this.self;
  }

  async verifyContinueButtonDisabled(): Promise<this> {
    await expect.soft(this.createPasswordContinueButton)
      .not.toBeEnabled({ message: 'Continue button should be disabled when terms not accepted' });
    return this.self;
  }

  async verifyContinueButtonEnabled(): Promise<this> {
    await expect.soft(this.createPasswordContinueButton)
      .toBeEnabled({ message: 'Continue button should be enabled when terms accepted' });
    return this.self;
  }

  async verifyPasswordInputsVisible(): Promise<this> {
    await expect.soft(this.createPasswordInput)
      .toBeDisplayed({ message: 'Password input should be visible' });
    await expect.soft(this.createPasswordConfirmInput)
      .toBeDisplayed({ message: 'Confirm password input should be visible' });
    return this.self;
  }

  async verifyRequirementsVisible(): Promise<this> {
    await expect.soft(this.createPasswordRequirementsContainer)
      .toBeDisplayed({ message: 'Requirements container should be visible' });
    await expect.soft(this.createPasswordRequirementUppercase)
      .toBeDisplayed({ message: 'Uppercase requirement should be visible' });
    await expect.soft(this.createPasswordRequirementLowercase)
      .toBeDisplayed({ message: 'Lowercase requirement should be visible' });
    await expect.soft(this.createPasswordRequirementNumber)
      .toBeDisplayed({ message: 'Number requirement should be visible' });
    await expect.soft(this.createPasswordRequirementSpecial)
      .toBeDisplayed({ message: 'Special character requirement should be visible' });
    return this.self;
  }

  async togglePasswordVisibility(): Promise<this> {
    await this.createPasswordInputToggleVisibility.click();
    return this.self;
  }

  async toggleConfirmPasswordVisibility(): Promise<this> {
    await this.createPasswordConfirmInputToggleVisibility.click();
    return this.self;
  }

  async verifyPasswordVisibilityToggleVisible(): Promise<this> {
    await expect.soft(this.createPasswordInputToggleVisibility)
      .toBeDisplayed({ message: 'Password visibility toggle button should be visible' });
    return this.self;
  }

  async verifyConfirmPasswordVisibilityToggleVisible(): Promise<this> {
    await expect.soft(this.createPasswordConfirmInputToggleVisibility)
      .toBeDisplayed({ message: 'Confirm password visibility toggle button should be visible' });
    return this.self;
  }

  async verifyPasswordValueAfterToggle(password: string): Promise<this> {
    await expect.soft(this.createPasswordInput)
      .toHaveValue(password, { message: 'Password value should remain accessible after toggle' });
    return this.self;
  }

  async verifyConfirmPasswordValueAfterToggle(password: string): Promise<this> {
    await expect.soft(this.createPasswordConfirmInput)
      .toHaveValue(password, { message: 'Confirm password value should remain accessible after toggle' });
    return this.self;
  }

  /* ==================== ENTER MASTER PASSWORD SCREEN METHODS ==================== */
  async waitForEnterPasswordScreen(): Promise<this> {
    await this.enterPasswordScreen.waitForDisplayed({ timeoutMsg: 'Enter password screen not visible' });
    await this.enterPasswordLogo.waitForDisplayed({ timeoutMsg: 'Enter password logo not visible' });
    return this.self;
  }

  async verifyEnterPasswordScreenContent(): Promise<this> {
    // Pre-wait for elements with shorter timeout before expect.soft checks
    const titleEl = this.enterPasswordTitle;
    const continueBtnEl = this.enterPasswordContinueButton;
    
    await Promise.all([
      titleEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      continueBtnEl.waitForDisplayed({ timeout: 2000 }).catch(() => {})
    ]);
    
    await expect.soft(titleEl)
      .toHaveText(ENTER_PASSWORD_SCREEN.title, { message: 'Title should match' });
    
    const isEnterPasswordWarningMatching = await this.isTextMatching('enterPasswordWarning', ENTER_PASSWORD_SCREEN.warning, false);
    await expect.soft(isEnterPasswordWarningMatching).toBe(true);
    
    await expect.soft(continueBtnEl)
      .toHaveText(ENTER_PASSWORD_SCREEN.continueButton, { message: 'Continue button text should match' });

    return this.self;
  }

  async enterMasterPassword(password: string): Promise<this> {
    await this.enterPasswordInput.setValue(password);
    return this.self;
  }

  async tapEnterPasswordContinue(): Promise<this> {
    await this.enterPasswordContinueButton.click();
    return this.self;
  }

  async toggleEnterPasswordVisibility(): Promise<this> {
    await this.enterPasswordInputToggleVisibility.click();
    return this.self;
  }

  async verifyEnterPasswordVisibilityToggleVisible(): Promise<this> {
    await expect.soft(this.enterPasswordInputToggleVisibility)
      .toBeDisplayed({ message: 'Enter password visibility toggle button should be visible' });
    return this.self;
  }

  async verifyEnterPasswordInputVisible(): Promise<this> {
    await expect.soft(this.enterPasswordInput)
      .toBeDisplayed({ message: 'Enter password input should be visible' });
    return this.self;
  }

  async verifyEnterPasswordWarningVisible(): Promise<this> {
    await expect.soft(this.enterPasswordWarning)
      .toBeDisplayed({ message: 'Enter password warning should be visible' });
    return this.self;
  }

  async verifyEnterPasswordValueAfterToggle(password: string): Promise<this> {
    await expect.soft(this.enterPasswordInput)
      .toHaveValue(password, { message: 'Enter password value should remain accessible after toggle' });
    return this.self;
  }

  /* ==================== SELECT VAULT TYPE SCREEN GETTERS ==================== */
  get selectVaultTypeLogo() { return this.$('selectVaultTypeLogo'); }
  get selectVaultTypeEmptyTitle() { return this.$('selectVaultTypeEmptyTitle'); }
  get selectVaultTypeEmptySubtitle() { return this.$('selectVaultTypeEmptySubtitle'); }
  get selectVaultTypeCreateNew() { return this.$('selectVaultTypeCreateNew'); }
  get selectVaultTypeCreateNewText() { return this.$('selectVaultTypeCreateNewText'); }
  get selectVaultTypeLoadExisting() { return this.$('selectVaultTypeLoadExisting'); }
  get selectVaultTypeLoadExistingText() { return this.$('selectVaultTypeLoadExistingText'); }

  /* ==================== SELECT VAULT TYPE SCREEN METHODS ==================== */
  async waitForSelectVaultTypeScreen(): Promise<this> {
    await this.selectVaultTypeEmptyTitle.waitForDisplayed({ timeoutMsg: 'Select vault type screen title not visible' });
    await this.selectVaultTypeEmptySubtitle.waitForDisplayed({ timeoutMsg: 'Select vault type screen subtitle not visible' });
    return this.self;
  }

  async verifySelectVaultTypeScreenContent(): Promise<this> {
    await expect.soft(this.selectVaultTypeEmptyTitle)
      .toHaveText(SELECT_VAULT_TYPE_SCREEN.emptyTitle, { message: 'Select vault type empty title should match' });

    await expect.soft(this.selectVaultTypeEmptySubtitle)
      .toHaveText(SELECT_VAULT_TYPE_SCREEN.emptySubtitle, { message: 'Select vault type empty subtitle should match' });

    await expect.soft(this.selectVaultTypeCreateNew)
      .toBeDisplayed({ message: 'Create new vault button should be visible' });
    
    await expect.soft(this.selectVaultTypeLoadExisting)
      .toBeDisplayed({ message: 'Load existing vault button should be visible' });

    await expect.soft(this.selectVaultTypeCreateNewText)
      .toHaveText(SELECT_VAULT_TYPE_SCREEN.createNew, { message: 'Create new vault button text should match' });

    await expect.soft(this.selectVaultTypeLoadExistingText)
      .toHaveText(SELECT_VAULT_TYPE_SCREEN.loadExisting, { message: 'Load existing vault button text should match' });

    return this.self;
  }

  async tapCreateNewVault(): Promise<this> {
    await this.selectVaultTypeCreateNew.click();
    return this.self;
  }

  async tapLoadExistingVault(): Promise<this> {
    await this.selectVaultTypeLoadExisting.click();
    return this.self;
  }

  /* ==================== NEW VAULT SCREEN GETTERS ==================== */
  get newVaultScreen() { return this.$('newVaultScreen'); }
  get newVaultTitle() { return this.$('newVaultTitle'); }
  get newVaultSubtitle() { return this.$('newVaultSubtitle'); }
  get newVaultNameInput() { return this.$('newVaultNameInput'); }
  get newVaultContinueButton() { return this.$('newVaultContinueButton'); }
  get newVaultContinueText() { return this.$('newVaultContinueText'); }
  get newVaultSelectVaultsButton() { return this.$('newVaultSelectVaultsButton'); }
  get newVaultSelectVaultsText() { return this.$('newVaultSelectVaultsText'); }

  /* ==================== NEW VAULT SCREEN METHODS ==================== */
  async waitForNewVaultScreen(): Promise<this> {
    await this.newVaultTitle.waitForDisplayed({ timeoutMsg: 'New vault title not visible' });
    return this.self;
  }

  async verifyNewVaultScreenContent(): Promise<this> {
    // Pre-wait for elements with shorter timeout before expect.soft checks
    const titleEl = this.newVaultTitle;
    const subtitleEl = this.newVaultSubtitle;
    const nameInputEl = this.newVaultNameInput;
    const continueBtnEl = this.newVaultContinueButton;
    const selectVaultsBtnEl = this.newVaultSelectVaultsButton;
    
    await Promise.all([
      titleEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      subtitleEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      nameInputEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      continueBtnEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      selectVaultsBtnEl.waitForDisplayed({ timeout: 2000 }).catch(() => {})
    ]);
    
    await expect.soft(titleEl)
      .toHaveText(NEW_VAULT_SCREEN.title, { message: 'New vault title should match' });

    await expect.soft(subtitleEl)
      .toHaveText(NEW_VAULT_SCREEN.subtitle, { message: 'New vault subtitle should match' });

    await expect.soft(nameInputEl)
      .toBeDisplayed({ message: 'Name input field should be visible' });

    await expect.soft(continueBtnEl)
      .toBeDisplayed({ message: 'Continue button should be visible' });

    await expect.soft(selectVaultsBtnEl)
      .toBeDisplayed({ message: 'Select Vaults button should be visible' });

    const continueTextEl = this.newVaultContinueText;
    const selectVaultsTextEl = this.newVaultSelectVaultsText;
    await Promise.all([
      continueTextEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      selectVaultsTextEl.waitForDisplayed({ timeout: 2000 }).catch(() => {})
    ]);
    
    await expect.soft(continueTextEl)
      .toHaveText(NEW_VAULT_SCREEN.continueButton, { message: 'Continue button text should match' });

    await expect.soft(selectVaultsTextEl)
      .toHaveText(NEW_VAULT_SCREEN.selectVaultsButton, { message: 'Select Vaults button text should match' });

    return this.self;
  }

  async enterVaultName(name: string): Promise<this> {
    await this.newVaultNameInput.setValue(name);
    return this.self;
  }

  async tapNewVaultContinue(): Promise<this> {
    await this.newVaultContinueButton.click();
    return this.self;
  }

  async tapNewVaultSelectVaults(): Promise<this> {
    await this.newVaultSelectVaultsButton.click();
    return this.self;
  }

  /* ==================== LOAD VAULT SCREEN GETTERS ==================== */
  get loadVaultScreen() { return this.$('loadVaultScreen'); }
  get loadVaultTitle() { return this.$('loadVaultTitle'); }
  get loadVaultSubtitle() { return this.$('loadVaultSubtitle'); }
  get loadVaultInviteCodeInput() { return this.$('loadVaultInviteCodeInput'); }
  get loadVaultOpenButton() { return this.$('loadVaultOpenButton'); }
  get loadVaultOpenButtonText() { return this.$('loadVaultOpenButtonText'); }
  get loadVaultSelectVaultsButton() { return this.$('loadVaultSelectVaultsButton'); }
  get loadVaultSelectVaultsText() { return this.$('loadVaultSelectVaultsText'); }
  get loadVaultScanQrButton() { return this.$('loadVaultScanQrButton'); }
  get loadVaultScanQrButtonText() { return this.$('loadVaultScanQrButtonText'); }

  /* ==================== LOAD VAULT SCREEN METHODS ==================== */
  async waitForLoadVaultScreen(): Promise<this> {
    await this.loadVaultTitle.waitForDisplayed({ timeoutMsg: 'Load vault title not visible' });
    return this.self;
  }

  async verifyLoadVaultScreenContent(): Promise<this> {
    await expect.soft(this.loadVaultTitle)
      .toHaveText(LOAD_VAULT_SCREEN.title, { message: 'Load vault title should match' });

    await expect.soft(this.loadVaultSubtitle)
      .toHaveText(LOAD_VAULT_SCREEN.subtitle, { message: 'Load vault subtitle should match' });

    await expect.soft(this.loadVaultInviteCodeInput)
      .toBeDisplayed({ message: 'Invite code input field should be visible' });

    await expect.soft(this.loadVaultOpenButton)
      .toBeDisplayed({ message: 'Open Vault button should be visible' });

    await expect.soft(this.loadVaultSelectVaultsButton)
      .toBeDisplayed({ message: 'Select Vaults button should be visible' });

    await expect.soft(this.loadVaultScanQrButton)
      .toBeDisplayed({ message: 'Scan QR Code button should be visible' });

    await expect.soft(this.loadVaultOpenButtonText)
      .toHaveText(LOAD_VAULT_SCREEN.openButton, { message: 'Open Vault button text should match' });

    await expect.soft(this.loadVaultSelectVaultsText)
      .toHaveText(LOAD_VAULT_SCREEN.selectVaultsButton, { message: 'Select Vaults button text should match' });

    await expect.soft(this.loadVaultScanQrButtonText)
      .toHaveText(LOAD_VAULT_SCREEN.scanQrButton, { message: 'Scan QR Code button text should match' });

    return this.self;
  }

  async tapLoadVaultOpen(): Promise<this> {
    await this.loadVaultOpenButton.click();
    return this.self;
  }

  async tapLoadVaultSelectVaults(): Promise<this> {
    await this.loadVaultSelectVaultsButton.click();
    return this.self;
  }

  async tapLoadVaultScanQr(): Promise<this> {
    await this.loadVaultScanQrButton.click();
    return this.self;
  }
}

export default SignUpPage;
