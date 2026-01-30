import BasePage from '@pages/BasePage';
import signUpLocators from '@locators/SignUpLocators';
import { CREATE_PASSWORD_SCREEN, ENTER_PASSWORD_SCREEN, SELECT_VAULT_TYPE_SCREEN, NEW_VAULT_SCREEN, LOAD_VAULT_SCREEN, VALIDATION_ERRORS } from '@data/signUp.data';

// Use global expect from expect-webdriverio for text comparison
declare const expect: any;

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
  get createPasswordTermsLinkFallback() { return this.$('createPasswordTermsLinkFallback'); }
  get createPasswordContinueButton() { return this.$('createPasswordContinueButton'); }
  get createPasswordContinueText() { return this.$('createPasswordContinueText'); }
  get createPasswordLoading() { return this.$('createPasswordLoading'); }
  get chromeUrlBar() { return this.$('chromeUrlBar'); }
  
  /* ==================== VALIDATION ERROR GETTERS ==================== */
  get enterPasswordPasswordIsRequiredWarning() { return this.$('enterPasswordPasswordIsRequiredWarning'); }
  get confirmPasswordPasswordIsRequiredWarning() { return this.$('confirmPasswordPasswordIsRequiredWarning'); }
  get enterPasswordPasswordMustBeAtLeast8CharactersLongWarning() { return this.$('enterPasswordPasswordMustBeAtLeast8CharactersLongWarning'); }
  get enterPasswordPasswordMustContainAtLeastOneUppercaseLetterWarning() { return this.$('enterPasswordPasswordMustContainAtLeastOneUppercaseLetterWarning'); }
  get enterPasswordPasswordMustContainAtLeastOneLowercaseLetterWarning() { return this.$('enterPasswordPasswordMustContainAtLeastOneLowercaseLetterWarning'); }
  get enterPasswordPasswordMustContainAtLeastOneNumberWarning() { return this.$('enterPasswordPasswordMustContainAtLeastOneNumberWarning'); }
  get enterPasswordPasswordMustContainAtLeastOneSpecialCharacterWarning() { return this.$('enterPasswordPasswordMustContainAtLeastOneSpecialCharacterWarning'); }
  get confirmPasswordPasswordsDoNotMatchWarning() { return this.$('confirmPasswordPasswordsDoNotMatchWarning'); }
  get confirmPasswordPasswordsDoNotMatchWarningIcon() { return this.$('confirmPasswordPasswordsDoNotMatchWarningIcon'); }
  get enterPasswordMasterPasswordRequiredWarning() { return this.$('enterPasswordMasterPasswordRequiredWarning'); }
  get enterPasswordIncorrectPasswordWarning() { return this.$('enterPasswordIncorrectPasswordWarning'); }
  get enterPasswordIncorrectPassword4AttemptsWarning() { return this.$('enterPasswordIncorrectPassword4AttemptsWarning'); }
  get enterPasswordIncorrectPassword3AttemptsWarning() { return this.$('enterPasswordIncorrectPassword3AttemptsWarning'); }
  get enterPasswordIncorrectPassword2AttemptsWarning() { return this.$('enterPasswordIncorrectPassword2AttemptsWarning'); }
  get enterPasswordIncorrectPassword1AttemptWarning() { return this.$('enterPasswordIncorrectPassword1AttemptWarning'); }
  get enterPasswordInvalidPasswordWarning() { return this.$('enterPasswordInvalidPasswordWarning'); }
  get newVaultNameRequiredWarning() { return this.$('newVaultNameRequiredWarning'); }

  /* ==================== ENTER MASTER PASSWORD SCREEN GETTERS ==================== */
  get enterPasswordScreen() { return this.$('enterPasswordScreen'); }
  get enterPasswordLogo() { return this.$('enterPasswordLogo'); }
  get enterPasswordTitle() { return this.$('enterPasswordTitle'); }
  get enterPasswordInput() { return this.$('enterPasswordInput'); }
  get enterPasswordInputIcon() { return this.$('enterPasswordInputIcon'); }
  get enterPasswordInputToggleVisibility() { return this.$('enterPasswordInputToggleVisibility'); }
  get enterPasswordWarning() { return this.$('enterPasswordWarning'); }
  get enterPasswordWarningIcon() { return this.$('enterPasswordWarningIcon'); }
  get enterPasswordWarningText() { return this.$('enterPasswordWarningText'); }
  get enterPasswordContinueButton() { return this.$('enterPasswordContinueButton'); }
  get enterPasswordContinueText() { return this.$('enterPasswordContinueText'); }
  get enterPasswordBiometricButton() { return this.$('enterPasswordBiometricButton'); }
  get enterPasswordLoading() { return this.$('enterPasswordLoading'); }

  /* ==================== CREATE PASSWORD SCREEN METHODS ==================== */
  async waitForCreatePasswordScreen(): Promise<this> {
    await this.createPasswordTitle.waitForDisplayed({ timeoutMsg: 'Create password screen not visible' });
    return this.self;
  }

  async verifyCreatePasswordScreenContent(): Promise<this> {
    const titleEl = this.createPasswordTitle;
    const descEl = this.createPasswordDescription;
    const reqTextEl = this.createPasswordRequirementsText;
    const uppercaseEl = this.createPasswordRequirementUppercase;
    const lowercaseEl = this.createPasswordRequirementLowercase;
    const numberEl = this.createPasswordRequirementNumber;
    const specialEl = this.createPasswordRequirementSpecial;
    const noteEl = this.createPasswordRequirementNote;
    
    await Promise.all([
      titleEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      descEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      reqTextEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      uppercaseEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      lowercaseEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      numberEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      specialEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      noteEl.waitForDisplayed({ timeout: 2000 }).catch(() => {})
    ]);
    
    const titleText = await titleEl.getText();
    expect(titleText).toBe(CREATE_PASSWORD_SCREEN.title);
    
    const descText = await descEl.getText();
    expect(descText).toBe(CREATE_PASSWORD_SCREEN.description);
    
    const reqText = await reqTextEl.getText();
    expect(reqText).toBe(CREATE_PASSWORD_SCREEN.requirementsText);
    
    const uppercaseText = await uppercaseEl.getText();
    expect(uppercaseText).toBe(CREATE_PASSWORD_SCREEN.requirementUppercase);
    
    const lowercaseText = await lowercaseEl.getText();
    expect(lowercaseText).toBe(CREATE_PASSWORD_SCREEN.requirementLowercase);
    
    const numberText = await numberEl.getText();
    expect(numberText).toBe(CREATE_PASSWORD_SCREEN.requirementNumber);
    
    const specialText = await specialEl.getText();
    expect(specialText).toBe(CREATE_PASSWORD_SCREEN.requirementSpecial);
    
    const noteText = await noteEl.getText();
    expect(noteText).toBe(CREATE_PASSWORD_SCREEN.requirementNote);
    
    await this.verifyCreatePasswordWarningText();
    
    const termsTitleEl = this.createPasswordTermsTitle;
    const continueBtnEl = this.createPasswordContinueButton;
    await Promise.all([
      termsTitleEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      continueBtnEl.waitForDisplayed({ timeout: 2000 }).catch(() => {})
    ]);
    
    const termsTitleText = await termsTitleEl.getText();
    expect(termsTitleText).toBe(CREATE_PASSWORD_SCREEN.termsTitle);
    
    // Use createPasswordContinueText locator for text verification (finds element by text)
    const continueTextEl = this.createPasswordContinueText;
    await continueTextEl.waitForDisplayed({ timeout: 2000 }).catch(() => {});
    const continueBtnText = await continueTextEl.getText();
    expect(continueBtnText).toBe(CREATE_PASSWORD_SCREEN.continueButton);

    return this.self;
  }

  async enterPassword(password: string): Promise<this> {
    await this.createPasswordInput.setValue(password);
    return this.self;
  }
  
  async verifyCreatePasswordWarningText(): Promise<this> {
    const warningText = await this.createPasswordWarningText.getText();
    expect(warningText).toBe(CREATE_PASSWORD_SCREEN.warningText);
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

  async declineTerms(): Promise<this> {
    try {
      const isChecked = await this.createPasswordTermsCheckboxChecked.isDisplayed();
      if (isChecked) {
        await this.createPasswordTermsCheckboxChecked.click();
      }
    } catch (e) {
    }
    return this.self;
  }

  async chromeUrlBarDisplayed(): Promise<this> {
    await this.verifyDisplayedSoft('chromeUrlBar', 'Chrome URL bar should be displayed');
    return this.self;
  }

  async tapTermsLink(): Promise<this> {
    try {
      const termsTextElement = await $('//android.widget.TextView[@text="I have read and agree to the PearPass Application Terms of Use."]');
      await termsTextElement.waitForDisplayed({ timeout: 3000 });

      const location = await termsTextElement.getLocation();
      const size = await termsTextElement.getSize();
      
      const clickX = location.x + (size.width * 0.8);
      const clickY = location.y + (size.height / 2);
      
      console.log(`Element: x=${location.x}, y=${location.y}, width=${size.width}, height=${size.height}`);
      console.log(`Click on: x=${Math.round(clickX)}, y=${Math.round(clickY)}`);
      
      await browser.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: Math.round(clickX), y: Math.round(clickY) },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerUp', button: 0 }
          ]
        }
      ]);
      
      await browser.releaseActions();
      console.log('Tap on the link completed');
      
      await browser.pause(1000);
      
    } catch (error) {
      console.error('Failed to click the link:', error.message);

      try {
        const termsTextElement = await $('//android.widget.TextView[@text="I have read and agree to the PearPass Application Terms of Use."]');
        const rect = await termsTextElement.getLocation();
        const size = await termsTextElement.getSize();
        
        const clickX = rect.x + (size.width * 0.8);
        const clickY = rect.y + (size.height / 2);
        
        await browser.execute('mobile: tap', {
          x: Math.round(clickX),
          y: Math.round(clickY)
        });
        
      } catch (fallbackError) {
        console.error('The alternative method did not work:', fallbackError.message);
        throw error;
      }
    }
    return this.self;
  }

  async verifyTermsCheckboxUnchecked(): Promise<this> {
    await this.verifyDisplayedSoft('createPasswordTermsCheckboxUnchecked', 'Terms checkbox should be unchecked');
    return this.self;
  }

  async verifyTermsCheckboxChecked(): Promise<this> {
    await this.verifyDisplayedSoft('createPasswordTermsCheckboxChecked', 'Terms checkbox should be checked');
    return this.self;
  }

  async tapContinue(): Promise<this> {
    await this.createPasswordContinueButton.click();
    return this.self;
  }

  async verifyContinueButtonDisabled(): Promise<this> {
    await this.verifyEnabledSoft('createPasswordContinueButton', false, 'Continue button should be disabled when terms not accepted');
    return this.self;
  }

  async verifyContinueButtonEnabled(): Promise<this> {
    await this.verifyEnabledSoft('createPasswordContinueButton', true, 'Continue button should be enabled when terms accepted');
    return this.self;
  }

  async verifyPasswordInputsVisible(): Promise<this> {
    await this.verifyDisplayedSoft('createPasswordInput', 'Password input should be visible');
    await this.verifyDisplayedSoft('createPasswordConfirmInput', 'Confirm password input should be visible');
    return this.self;
  }

  async verifyRequirementsVisible(): Promise<this> {
    await this.verifyDisplayedSoft('createPasswordRequirementsContainer', 'Requirements container should be visible');
    await this.verifyDisplayedSoft('createPasswordRequirementUppercase', 'Uppercase requirement should be visible');
    await this.verifyDisplayedSoft('createPasswordRequirementLowercase', 'Lowercase requirement should be visible');
    await this.verifyDisplayedSoft('createPasswordRequirementNumber', 'Number requirement should be visible');
    await this.verifyDisplayedSoft('createPasswordRequirementSpecial', 'Special character requirement should be visible');
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
    await this.verifyDisplayedSoft('createPasswordInputToggleVisibility', 'Password visibility toggle button should be visible');
    return this.self;
  }

  async verifyConfirmPasswordVisibilityToggleVisible(): Promise<this> {
    await this.verifyDisplayedSoft('createPasswordConfirmInputToggleVisibility', 'Confirm password visibility toggle button should be visible');
    return this.self;
  }

  async verifyPasswordValueAfterToggle(password: string): Promise<this> {
    const passwordText = await this.createPasswordInput.getText();
    expect(passwordText).toBe(password);
    return this.self;
  }

  async verifyConfirmPasswordValueAfterToggle(password: string): Promise<this> {
    const confirmPasswordText = await this.createPasswordConfirmInput.getText();
    expect(confirmPasswordText).toBe(password);
    return this.self;
  }

  /* ==================== VALIDATION ERROR METHODS ==================== */

  async verifyValidationError(
    errorType: keyof typeof VALIDATION_ERRORS,
    field: 'enterPassword' | 'newVaultName' | 'enterMasterPassword' = 'enterPassword'
  ): Promise<this> {
    const expectedText = VALIDATION_ERRORS[errorType];
    let errorElement;

    switch (errorType) {
      case 'passwordRequired':
        if (field === 'enterPassword') {
          errorElement = this.enterPasswordPasswordIsRequiredWarning;
        } else if (field === 'enterMasterPassword') {
          errorElement = this.enterPasswordMasterPasswordRequiredWarning;
        } else if (field === 'newVaultName') {
          errorElement = this.newVaultNameRequiredWarning;
        } else {
          throw new Error(`passwordRequired error is not applicable for field: ${field}`);
        }
        break;

      case 'passwordTooShort':
        if (field === 'enterPassword') {
          errorElement = this.enterPasswordPasswordMustBeAtLeast8CharactersLongWarning;
        } else {
          throw new Error(`passwordTooShort error is not applicable for field: ${field}`);
        }
        break;

      case 'passwordMissingUppercase':
        if (field === 'enterPassword') {
          errorElement = this.enterPasswordPasswordMustContainAtLeastOneUppercaseLetterWarning;
        } else {
          throw new Error(`passwordMissingUppercase error is not applicable for field: ${field}`);
        }
        break;

      case 'passwordMissingLowercase':
        if (field === 'enterPassword') {
          errorElement = this.enterPasswordPasswordMustContainAtLeastOneLowercaseLetterWarning;
        } else {
          throw new Error(`passwordMissingLowercase error is not applicable for field: ${field}`);
        }
        break;

      case 'passwordMissingNumber':
        if (field === 'enterPassword') {
          errorElement = this.enterPasswordPasswordMustContainAtLeastOneNumberWarning;
        } else {
          throw new Error(`passwordMissingNumber error is not applicable for field: ${field}`);
        }
        break;

      case 'passwordMissingSpecial':
        if (field === 'enterPassword') {
          errorElement = this.enterPasswordPasswordMustContainAtLeastOneSpecialCharacterWarning;
        } else {
          throw new Error(`passwordMissingSpecial error is not applicable for field: ${field}`);
        }
        break;

      case 'nameRequired':
        if (field === 'newVaultName') {
          errorElement = this.newVaultNameRequiredWarning;
        } else {
          throw new Error(`nameRequired error is only applicable for newVaultName field`);
        }
        break;

      case 'incorrectPassword':
        if (field === 'enterMasterPassword') {
          errorElement = this.enterPasswordIncorrectPasswordWarning;
        } else {
          throw new Error(`incorrectPassword error is only applicable for enterMasterPassword field`);
        }
        break;

      case 'incorrectPassword4Attempts':
        if (field === 'enterMasterPassword') {
          errorElement = this.enterPasswordIncorrectPassword4AttemptsWarning;
        } else {
          throw new Error(`incorrectPassword4Attempts error is only applicable for enterMasterPassword field`);
        }
        break;

      case 'incorrectPassword3Attempts':
        if (field === 'enterMasterPassword') {
          errorElement = this.enterPasswordIncorrectPassword3AttemptsWarning;
        } else {
          throw new Error(`incorrectPassword3Attempts error is only applicable for enterMasterPassword field`);
        }
        break;

      case 'incorrectPassword2Attempts':
        if (field === 'enterMasterPassword') {
          errorElement = this.enterPasswordIncorrectPassword2AttemptsWarning;
        } else {
          throw new Error(`incorrectPassword2Attempts error is only applicable for enterMasterPassword field`);
        }
        break;

      case 'incorrectPassword1Attempt':
        if (field === 'enterMasterPassword') {
          errorElement = this.enterPasswordIncorrectPassword1AttemptWarning;
        } else {
          throw new Error(`incorrectPassword1Attempt error is only applicable for enterMasterPassword field`);
        }
        break;

      case 'invalidPassword':
        if (field === 'enterMasterPassword') {
          errorElement = this.enterPasswordInvalidPasswordWarning;
        } else {
          throw new Error(`invalidPassword error is only applicable for enterMasterPassword field`);
        }
        break;

      default:
        throw new Error(`Unknown validation error type: ${errorType}`);
    }

    // Verify error element is displayed
    const isDisplayed = await errorElement.isDisplayed();
    if (!isDisplayed) {
      throw new Error(`Validation error "${errorType}" should be displayed`);
    }

    if (errorType === 'incorrectPassword') {
      const actualText = await errorElement.getText();
      const containsExpected = actualText.includes(expectedText);
      if (!containsExpected) {
        throw new Error(
          `Validation error text should contain "${expectedText}", but got "${actualText}"`
        );
      }
    } else {
      const errorText = await errorElement.getText();
      expect(errorText).toBe(` ${expectedText} `);
    }

    return this.self;
  }

  /* ==================== ENTER MASTER PASSWORD SCREEN METHODS ==================== */
  async waitForEnterPasswordScreen(): Promise<this> {
    await this.enterPasswordTitle.waitForDisplayed({ timeoutMsg: 'Enter password screen not visible' });
    return this.self;
  }

  async verifyEnterPasswordScreenContent(): Promise<this> {
    const titleEl = this.enterPasswordTitle;
    const continueBtnEl = this.enterPasswordContinueButton;
    const continueTextEl = this.enterPasswordContinueText;
    const warningTextEl = this.enterPasswordWarningText;
    
    await Promise.all([
      titleEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      continueBtnEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      continueTextEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      warningTextEl.waitForDisplayed({ timeout: 2000 }).catch(() => {})
    ]);
    
    const titleText = await titleEl.getText();
    expect(titleText).toBe(ENTER_PASSWORD_SCREEN.title);
    
    const warningText = await warningTextEl.getText();
    expect(warningText).toBe(ENTER_PASSWORD_SCREEN.warning);
    
    const continueBtnText = await continueTextEl.getText();
    expect(continueBtnText).toBe(ENTER_PASSWORD_SCREEN.continueButton);

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
    await this.verifyDisplayedSoft('enterPasswordInputToggleVisibility', 'Enter password visibility toggle button should be visible');
    return this.self;
  }

  async verifyEnterPasswordInputVisible(): Promise<this> {
    await this.verifyDisplayedSoft('enterPasswordInput', 'Enter password input should be visible');
    return this.self;
  }

  async verifyEnterPasswordInputIconVisible(): Promise<this> {
    await this.verifyDisplayedSoft('enterPasswordInputIcon', 'Enter password input icon should be visible');
    return this.self;
  }

  async verifyEnterPasswordWarningIconVisible(): Promise<this> {
    await this.verifyDisplayedSoft('enterPasswordWarningIcon', 'Enter password warning icon should be visible');
    return this.self;
  }

  async verifyEnterPasswordWarningVisible(): Promise<this> {
    await this.verifyDisplayedSoft('enterPasswordWarning', 'Enter password warning should be visible');
    return this.self;
  }

  async verifyPasswordMismatchWarningVisible(): Promise<this> {
    await this.verifyDisplayedSoft('confirmPasswordPasswordsDoNotMatchWarning', 'Password mismatch warning text should be visible');
    await this.verifyDisplayedSoft('confirmPasswordPasswordsDoNotMatchWarningIcon', 'Password mismatch warning icon should be visible');
    return this.self;
  }

  async verifyEnterPasswordValueAfterToggle(password: string): Promise<this> {
    const passwordText = await this.enterPasswordInput.getText();
    expect(passwordText).toBe(password);
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
    const emptyTitleText = await this.selectVaultTypeEmptyTitle.getText();
    expect(emptyTitleText).toBe(SELECT_VAULT_TYPE_SCREEN.emptyTitle);

    const emptySubtitleText = await this.selectVaultTypeEmptySubtitle.getText();
    expect(emptySubtitleText).toBe(SELECT_VAULT_TYPE_SCREEN.emptySubtitle);

    await this.verifyDisplayedSoft('selectVaultTypeCreateNew', 'Create new vault button should be visible');
    
    await this.verifyDisplayedSoft('selectVaultTypeLoadExisting', 'Load existing vault button should be visible');

    const createNewText = await this.selectVaultTypeCreateNewText.getText();
    expect(createNewText).toBe(SELECT_VAULT_TYPE_SCREEN.createNew);

    const loadExistingText = await this.selectVaultTypeLoadExistingText.getText();
    expect(loadExistingText).toBe(SELECT_VAULT_TYPE_SCREEN.loadExisting);

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
    
    const titleText = await titleEl.getText();
    expect(titleText).toBe(NEW_VAULT_SCREEN.title);

    const subtitleText = await subtitleEl.getText();
    expect(subtitleText).toBe(NEW_VAULT_SCREEN.subtitle);

    const nameInputDisplayed = await nameInputEl.isDisplayed();
    if (!nameInputDisplayed) throw new Error('Name input field should be visible');

    const continueBtnDisplayed = await continueBtnEl.isDisplayed();
    if (!continueBtnDisplayed) throw new Error('Continue button should be visible');

    const selectVaultsBtnDisplayed = await selectVaultsBtnEl.isDisplayed();
    if (!selectVaultsBtnDisplayed) throw new Error('Select Vaults button should be visible');

    const continueTextEl = this.newVaultContinueText;
    const selectVaultsTextEl = this.newVaultSelectVaultsText;
    await Promise.all([
      continueTextEl.waitForDisplayed({ timeout: 2000 }).catch(() => {}),
      selectVaultsTextEl.waitForDisplayed({ timeout: 2000 }).catch(() => {})
    ]);
    
    const continueText = await continueTextEl.getText();
    expect(continueText).toBe(NEW_VAULT_SCREEN.continueButton);

    const selectVaultsText = await selectVaultsTextEl.getText();
    expect(selectVaultsText).toBe(NEW_VAULT_SCREEN.selectVaultsButton);

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
  get loadVaultInviteCodeInputText() { return this.$('loadVaultInviteCodeInputText'); }
  get loadVaultOpenButton() { return this.$('loadVaultOpenButton'); }
  get loadVaultOpenButtonText() { return this.$('loadVaultOpenButtonText'); }
  get loadVaultSelectVaultsButton() { return this.$('loadVaultSelectVaultsButton'); }
  get loadVaultSelectVaultsText() { return this.$('loadVaultSelectVaultsText'); }
  get loadVaultScanQrButton() { return this.$('loadVaultScanQrButton'); }
  get loadVaultScanQrButtonText() { return this.$('loadVaultScanQrButtonText'); }

  /* ==================== SELECT VAULTS SCREEN GETTERS ==================== */
  get selectVaultsTitle() { return this.$('selectVaultsTitle'); }
  get authVaultItem() { return this.$('authVaultItem'); }
  get newVaultNameAtSelectVaultsPage() { return this.$('newVaultNameAtSelectVaultsPage'); }

  /* ==================== LOAD VAULT SCREEN METHODS ==================== */
  async waitForLoadVaultScreen(): Promise<this> {
    await this.loadVaultTitle.waitForDisplayed({ timeoutMsg: 'Load vault title not visible' });
    return this.self;
  }

  async verifyLoadVaultScreenContent(): Promise<this> {
    const loadVaultTitleText = await this.loadVaultTitle.getText();
    expect(loadVaultTitleText).toBe(LOAD_VAULT_SCREEN.title);

    const loadVaultSubtitleText = await this.loadVaultSubtitle.getText();
    expect(loadVaultSubtitleText).toBe(LOAD_VAULT_SCREEN.subtitle);

    await this.verifyDisplayedSoft('loadVaultInviteCodeInput', 'Invite code input field should be visible');

    await this.verifyDisplayedSoft('loadVaultOpenButton', 'Open Vault button should be visible');

    await this.verifyDisplayedSoft('loadVaultSelectVaultsButton', 'Select Vaults button should be visible');

    await this.verifyDisplayedSoft('loadVaultScanQrButton', 'Scan QR Code button should be visible');

    const openButtonText = await this.loadVaultOpenButtonText.getText();
    expect(openButtonText).toBe(LOAD_VAULT_SCREEN.openButton);

    const selectVaultsButtonText = await this.loadVaultSelectVaultsText.getText();
    expect(selectVaultsButtonText).toBe(LOAD_VAULT_SCREEN.selectVaultsButton);

    const scanQrButtonText = await this.loadVaultScanQrButtonText.getText();
    expect(scanQrButtonText).toBe(LOAD_VAULT_SCREEN.scanQrButton);

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

  /* ==================== SELECT VAULTS SCREEN METHODS ==================== */

  async verifySelectVaultsTitle(): Promise<this> {
    const titleEl = this.selectVaultsTitle;
    await titleEl.waitForDisplayed({ timeoutMsg: 'Select Vaults title not visible' });
    
    const titleText = await titleEl.getText();
    expect(titleText).toBe(SELECT_VAULT_TYPE_SCREEN.listTitle);
    
    return this.self;
  }

  async verifyNewVaultNameAtSelectVaultsPage(expectedText: string): Promise<this> {
    await this.newVaultNameAtSelectVaultsPage.waitForDisplayed({ timeout: 5000, timeoutMsg: 'New vault name at Select Vaults page not visible' });
    await this.verifyElementDisplayed(this.newVaultNameAtSelectVaultsPage, 'newVaultNameAtSelectVaultsPage', 'Vault name at Select Vaults page should be visible');
    const displayedText = await this.newVaultNameAtSelectVaultsPage.getText();
    expect(displayedText).toBe(expectedText);
    return this.self;
  }

  async tapSelectVaultsVaultItem(): Promise<this> {
    const vaultItem = this.authVaultItem;
    await vaultItem.waitForDisplayed({ timeoutMsg: 'Vault item not found in the list' });
    await vaultItem.click();
    return this.self;
  }
}

export default SignUpPage;
