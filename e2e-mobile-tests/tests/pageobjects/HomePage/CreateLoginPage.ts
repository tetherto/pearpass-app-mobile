import BasePage from '@pages/BasePage';
import createLoginLocators from '@locators/HomeLocators/CreateLoginLocators';
import { CREATE_LOGIN_ADD_FILE_POPUP, CREATE_LOGIN_CREATE_NEW_BUTTON, CREATE_LOGIN_CUSTOM_FIELD, CREATE_LOGIN_EMAIL_OR_USERNAME_FIELD, CREATE_LOGIN_ENTERED_FIELDS, CREATE_LOGIN_FILE_FIELD, CREATE_LOGIN_NEW_FILE_FIELD, CREATE_LOGIN_NO_FOLDER_BUTTON, CREATE_LOGIN_NOTE_FIELD, CREATE_LOGIN_PASSWORD_FIELD, CREATE_LOGIN_SAVE_BUTTON, CREATE_LOGIN_SAVE_WARNING_MESSAGE, CREATE_LOGIN_SHARED_FILE_POPUP, CREATE_LOGIN_SHOW_CUSTOM_FIELD_POPUP, CREATE_LOGIN_TEST_FOLDER_POPUP, CREATE_LOGIN_TITLE_FIELD, CREATE_LOGIN_WEBSITE_FIELD } from '@data/home-data/createLogin.data';

declare const expect: any;

export class CreateLoginPage extends BasePage {
  protected selectors = createLoginLocators;

  get closeButton() { return this.$('closeButton'); }
  get copyAndCloseButton() { return this.$('copyAndCloseButton'); }
  get noFolderButton() { return this.$('noFolderButton'); }
  get noFolderButtonText() { return this.$('noFolderButtonText'); }
  get noFolderButtonIcon() { return this.$('noFolderButtonIcon'); }
  get noFolderButtonIcon2() { return this.$('noFolderButtonIcon2'); }
  get noFolderButtonPopup() { return this.$('noFolderButtonPopup'); }
  get createNewButton() { return this.$('createNewButton'); }
  get createNewButtonIcon() { return this.$('createNewButtonIcon'); }
  get createNewButtonText() { return this.$('createNewButtonText'); }
  get testFolderButton() { return this.$('testFolderButton'); }
  get testFolderButtonIcon() { return this.$('testFolderButtonIcon'); }
  get testFolderButtonText() { return this.$('testFolderButtonText'); }
  get testFolderButtonText2() { return this.$('testFolderButtonText2'); }
  get testFolderPopup() { return this.$('testFolderPopup'); }
  get testFolderPopupTestFolderButton() { return this.$('testFolderPopupTestFolderButton'); }
  get testFolderPopupIcon() { return this.$('testFolderPopupIcon'); }
  get testFolderPopupTitle() { return this.$('testFolderPopupTitle'); }
  get testFolderPopupText() { return this.$('testFolderPopupText'); }
  get testFolderPopupCheckedIcon() { return this.$('testFolderPopupCheckedIcon'); }
  get saveButton() { return this.$('saveButton'); }
  get saveButtonIcon() { return this.$('saveButtonIcon'); }
  get saveButtonText() { return this.$('saveButtonText'); }
  get titleField() { return this.$('titleField'); }
  get titleFieldTitle() { return this.$('titleFieldTitle'); }
  get titleFieldInput() { return this.$('titleFieldInput'); }
  get titleFieldWarningIcon() { return this.$('titleFieldWarningIcon'); }
  get titleFieldWarningText() { return this.$('titleFieldWarningText'); }
  get emailOrUsernameField() { return this.$('emailOrUsernameField'); }
  get emailOrUsernameFieldIcon() { return this.$('emailOrUsernameFieldIcon'); }
  get emailOrUsernameFieldTitle() { return this.$('emailOrUsernameFieldTitle'); }
  get emailOrUsernameFieldInput() { return this.$('emailOrUsernameFieldInput'); }
  get passwordField() { return this.$('passwordField'); }
  get passwordFieldIcon() { return this.$('passwordFieldIcon'); }
  get passwordFieldTitle() { return this.$('passwordFieldTitle'); }
  get passwordFieldInput() { return this.$('passwordFieldInput'); }
  get generatePasswordIcon() { return this.$('generatePasswordIcon'); }
  get showPasswordIcon() { return this.$('showPasswordIcon'); }
  get generatePasswordPopup() { return this.$('generatePasswordPopup'); }
  get generatePasswordPopupTitle() { return this.$('generatePasswordPopupTitle'); }
  get generatePasswordPopupGeneratedPassword() { return this.$('generatePasswordPopupGeneratedPassword'); }
  get websiteField() { return this.$('websiteField'); }
  get websiteFieldIcon() { return this.$('websiteFieldIcon'); }
  get websiteFieldTitle() { return this.$('websiteFieldTitle'); }
  get websiteFieldInput() { return this.$('websiteFieldInput'); }
  get addNewWebsiteFieldButton() { return this.$('addNewWebsiteFieldButton'); }
  get newWebsiteField() { return this.$('newWebsiteField'); }
  get newWebsiteFieldIcon() { return this.$('newWebsiteFieldIcon'); }
  get newWebsiteFieldTitle() { return this.$('newWebsiteFieldTitle'); }
  get newWebsiteFieldInput() { return this.$('newWebsiteFieldInput'); }
  get newWebsiteFieldDeleteButton() { return this.$('newWebsiteFieldDeleteButton'); }
  get fileField() { return this.$('fileField'); }
  get fileFieldIcon() { return this.$('fileFieldIcon'); }
  get fileFieldTitle() { return this.$('fileFieldTitle'); }
  get fileFieldText() { return this.$('fileFieldText'); }
  get addFileButton() { return this.$('addFileButton'); }
  get addFilePopup() { return this.$('addFilePopup'); }
  get addFilePopupIcon() { return this.$('addFilePopupIcon'); }
  get addFilePopupTitle() { return this.$('addFilePopupTitle'); }
  get addFilePopupText() { return this.$('addFilePopupText'); }
  get addFilePopupChooseFileButton() { return this.$('addFilePopupChooseFileButton'); }
  get addFilePopupChooseFileButtonText() { return this.$('addFilePopupChooseFileButtonText'); }
  get addFilePopupChooseMediaButton() { return this.$('addFilePopupChooseMediaButton'); }
  get addFilePopupChooseMediaButtonText() { return this.$('addFilePopupChooseMediaButtonText'); }
  get ownersManualFile() { return this.$('ownersManualFile'); }
  get newFileField() { return this.$('newFileField'); }
  get newFileFieldIcon() { return this.$('newFileFieldIcon'); }
  get newFileFieldTitle() { return this.$('newFileFieldTitle'); }
  get newFileFieldText() { return this.$('newFileFieldText'); }
  get newFileFieldDeleteButton() { return this.$('newFileFieldDeleteButton'); }
  get newFileFieldButton() { return this.$('newFileFieldButton'); }
  get sharedFilePopupTitle() { return this.$('sharedFilePopupTitle'); }
  get noteField() { return this.$('noteField'); }
  get noteFieldIcon() { return this.$('noteFieldIcon'); }
  get noteFieldTitle() { return this.$('noteFieldTitle'); }
  get noteFieldInput() { return this.$('noteFieldInput'); }
  get customFields() { return this.$('customFields'); }
  get customFieldsIcon() { return this.$('customFieldsIcon'); }
  get customFieldsIcon2() { return this.$('customFieldsIcon2'); }
  get customFieldsText() { return this.$('customFieldsText'); }
  get customFieldsIcon3() { return this.$('customFieldsIcon3'); }
  get customFieldsText2() { return this.$('customFieldsText2'); }
  get newNoteFieldButton() { return this.$('newNoteFieldButton'); }
  get newnoteField() { return this.$('newnoteField'); }
  get newNoteFieldIcon() { return this.$('newNoteFieldIcon'); }
  get newNoteFieldTitle() { return this.$('newNoteFieldTitle'); }
  get newNoteFieldInput() { return this.$('newNoteFieldInput'); }
  get newNoteFieldDeleteButton() { return this.$('newNoteFieldDeleteButton'); }


  async verifyCloseButtonVisible(): Promise<this> {
    await this.closeButton.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Close button not visible',
    });
    return this.self;
  }

  async verifyNoFolderButtonVisible(): Promise<this> {
    const { text } = CREATE_LOGIN_NO_FOLDER_BUTTON;
    await this.noFolderButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'No Folder button should be visible' });
    await this.noFolderButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'No Folder button text should be visible' });
    await this.noFolderButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'No Folder button icon should be visible' });
    await this.noFolderButtonIcon2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'No Folder button icon 2 should be visible' });
    const buttonText = await this.noFolderButtonText.getText();
    expect(buttonText).toBe(text);
    return this.self;
  }

  async verifySaveButtonVisible(): Promise<this> {
    const { text } = CREATE_LOGIN_SAVE_BUTTON;
    await this.saveButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Save button should be visible' });
    await this.saveButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Save button icon should be visible' });
    await this.saveButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Save button text should be visible' });
    const buttonText = await this.saveButtonText.getText();
    expect(buttonText).toBe(text);
    return this.self;
  }

  async tapCloseButton(): Promise<this> {
    await this.closeButton.click();
    return this.self;
  }

  async tapCopyAndCloseButton(): Promise<this> {
    await this.copyAndCloseButton.click();
    return this.self;
  }

  async tapSaveButton(): Promise<this> {
    await this.saveButton.click();
    return this.self;
  }

  async tapTitleField(): Promise<this> {
    await this.titleField.click();
    return this.self;
  }

  async tapEmailOrUsernameField(): Promise<this> {
    await this.emailOrUsernameField.click();
    return this.self;
  }

  async tapPasswordField(): Promise<this> {
    await this.passwordField.click();
    return this.self;
  }

  async tapShowPasswordIconButton(): Promise<this> {
    await this.showPasswordIcon.click();
    return this.self;
  }

  async tapWebsiteField(): Promise<this> {
    await this.websiteField.click();
    return this.self;
  }

  async tapNoteField(): Promise<this> {
    await this.noteField.click();
    return this.self;
  }

  async tapShowCustomFieldButton(): Promise<this> {
    await this.customFieldsIcon2.click();
    return this.self;
  }

  async tapNewNoteFieldButton(): Promise<this> {
    await this.newNoteFieldButton.click();
    return this.self;
  }

  async tapNewNoteFieldDeleteButton(): Promise<this> {
    await this.newNoteFieldDeleteButton.click();
    return this.self;
  }

  async tapAddNewWebsiteFieldButton(): Promise<this> {
    await this.addNewWebsiteFieldButton.click();
    return this.self;
  }

  async tapDeleteLastWebsiteFieldButton(): Promise<this> {
    await this.newWebsiteFieldDeleteButton.click();
    return this.self;
  }

  async tapAddFileButton(): Promise<this> {
    await this.addFileButton.click();
    return this.self;
  }

  async tapChooseFileButton(): Promise<this> {
    await this.addFilePopupChooseFileButton.click();
    return this.self;
  }

  async tapChoosePhotoVideoButton(): Promise<this> {
    await this.addFilePopupChooseMediaButton.click();
    return this.self;
  }

  async tapNewFileFieldButton(): Promise<this> {
    await this.newFileFieldButton.click();
    return this.self;
  }

  async tapNewFileFieldDeleteButton(): Promise<this> {
    await this.newFileFieldDeleteButton.click();
    return this.self;
  }

  async chooseOwnersManualFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.ownersManualFile.waitForDisplayed({ timeout: waitTimeout });
        await this.ownersManualFile.click();
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

  async verifyNewWebsiteFieldNotVisible(timeout = 5000): Promise<this> {
    await this.newWebsiteField.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: 'New website field should not be visible',
    });
    return this.self;
  }

  async verifyAddNewWebsiteFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_LOGIN_WEBSITE_FIELD;
    await this.newWebsiteField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New website field should be visible' });
    await this.newWebsiteFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New website field icon should be visible' });
    await this.newWebsiteFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New website field title should be visible' });
    await this.newWebsiteFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New website field input should be visible' });
    await this.newWebsiteFieldDeleteButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New website field delete button should be visible' });
    const titleText = await this.newWebsiteFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.newWebsiteFieldInput.getText() ?? '';
    const inputAttr = await this.newWebsiteFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async enterTextInFields(
    fieldName: keyof typeof CREATE_LOGIN_ENTERED_FIELDS
  ): Promise<this> {
    const value = CREATE_LOGIN_ENTERED_FIELDS[fieldName];
    const inputByField: Record<keyof typeof CREATE_LOGIN_ENTERED_FIELDS, ReturnType<typeof this.$>> = {
      title: this.titleFieldInput,
      newTitle: this.titleFieldInput,
      emailOrUsername: this.emailOrUsernameFieldInput,
      password: this.passwordFieldInput,
      passwordHidden: this.passwordFieldInput,
      website: this.websiteFieldInput,
      note: this.noteFieldInput,
    };
    const input = inputByField[fieldName];
    await input.setValue(value);
    return this.self;
  }

  async verifyEnteredTextInFields(
    fieldName: keyof typeof CREATE_LOGIN_ENTERED_FIELDS
  ): Promise<this> {
    const expected = CREATE_LOGIN_ENTERED_FIELDS[fieldName];
    const inputByField: Record<keyof typeof CREATE_LOGIN_ENTERED_FIELDS, ReturnType<typeof this.$>> = {
      title: this.titleFieldInput,
      newTitle: this.titleFieldInput,
      emailOrUsername: this.emailOrUsernameFieldInput,
      password: this.passwordFieldInput,
      passwordHidden: this.passwordFieldInput,
      website: this.websiteFieldInput,
      note: this.noteFieldInput,
    };
    const input = inputByField[fieldName];
    const actual = await input.getText() ?? await input.getAttribute('text') ?? '';
    expect(actual).toBe(expected);
    return this.self;
  }

  async verifySaveButtonWarningMessageVisible(): Promise<this> {
    const { warningText } = CREATE_LOGIN_SAVE_WARNING_MESSAGE;
    await this.titleFieldWarningIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Title field warning icon should be visible' });
    await this.titleFieldWarningText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Title field warning text should be visible' });
    const text = await this.titleFieldWarningText.getText();
    expect(text).toBe(warningText);
    return this.self;
  }

  async tapNoFolderButton(): Promise<this> {
    await this.noFolderButton.click();
    return this.self;
  }

  async tapCreateNewButton(): Promise<this> {
    await this.createNewButton.click();
    return this.self;
  }
  
  async waitForCreateLoginPageLoaded(timeout = 10000): Promise<this> {
    await this.titleField.waitForDisplayed({
      timeout,
      timeoutMsg: 'Create login page title field not visible',
    });
    return this.self;
  }

  async verifyTitleFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_LOGIN_TITLE_FIELD;
    await this.titleField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Title field should be visible' });
    await this.titleFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Title field title should be visible' });
    await this.titleFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Title field input should be visible' });
    const titleText = await this.titleFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.titleFieldInput.getText() ?? '';
    const inputAttr = await this.titleFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyEmailOrUsernameFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_LOGIN_EMAIL_OR_USERNAME_FIELD;
    await this.emailOrUsernameField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email or username field should be visible' });
    await this.emailOrUsernameFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email or username field icon should be visible' });
    await this.emailOrUsernameFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email or username field title should be visible' });
    await this.emailOrUsernameFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email or username field input should be visible' });
    const titleText = await this.emailOrUsernameFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.emailOrUsernameFieldInput.getText() ?? '';
    const inputAttr = await this.emailOrUsernameFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyPasswordFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_LOGIN_PASSWORD_FIELD;
    await this.passwordField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password field should be visible' });
    await this.passwordFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password field icon should be visible' });
    await this.passwordFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password field title should be visible' });
    await this.passwordFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password field input should be visible' });
    await this.generatePasswordIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Generate password icon should be visible' });
    await this.showPasswordIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Show password icon should be visible' });
    const titleText = await this.passwordFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.passwordFieldInput.getText() ?? '';
    const inputAttr = await this.passwordFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyWebsiteFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_LOGIN_WEBSITE_FIELD;
    await this.websiteField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Website field should be visible' });
    await this.websiteFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Website field icon should be visible' });
    await this.websiteFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Website field title should be visible' });
    await this.websiteFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Website field input should be visible' });
    await this.addNewWebsiteFieldButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add new website button should be visible' });
    const titleText = await this.websiteFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.websiteFieldInput.getText() ?? '';
    const inputAttr = await this.websiteFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyFileFieldVisible(): Promise<this> {
    const { title, text } = CREATE_LOGIN_FILE_FIELD;
    await this.fileField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field should be visible' });
    await this.fileFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field icon should be visible' });
    await this.fileFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field title should be visible' });
    await this.fileFieldText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field text should be visible' });
    await this.addFileButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file button should be visible' });
    const titleText = await this.fileFieldTitle.getText();
    expect(titleText).toBe(title);
    const fieldText = await this.fileFieldText.getText();
    expect(fieldText).toBe(text);
    return this.self;
  }

  async verifyNewFileFieldWithAllElementsVisible(): Promise<this> {
    const { title, fileName } = CREATE_LOGIN_NEW_FILE_FIELD;
    await this.newFileField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field should be visible' });
    await this.newFileFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field icon should be visible' });
    await this.newFileFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field title should be visible' });
    await this.newFileFieldText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field text should be visible' });
    await this.newFileFieldDeleteButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field delete button should be visible' });
    const titleActual = await this.newFileFieldTitle.getText();
    expect(titleActual).toBe(title);
    const fileNameActual = await this.newFileFieldText.getText();
    expect(fileNameActual).toBe(fileName);
    return this.self;
  }

  async verifyNewFileFieldNotVisible(timeout = 5000): Promise<this> {
    await this.newFileField.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: 'New file field should not be visible',
    });
    return this.self;
  }

  async verifyNewNoteFieldNotVisible(timeout = 5000): Promise<this> {
    await this.newnoteField.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: 'New note field should not be visible',
    });
    return this.self;
  }

  async verifySharedFilePopupTitleVisible(timeout = 10000): Promise<this> {
    const { title } = CREATE_LOGIN_SHARED_FILE_POPUP;
    await this.sharedFilePopupTitle.waitForDisplayed({
      timeout,
      timeoutMsg: 'Shared file popup title not visible',
    });
    const titleActual = await this.sharedFilePopupTitle.getText();
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyNoteFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_LOGIN_NOTE_FIELD;
    await this.noteField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field should be visible' });
    await this.noteFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field icon should be visible' });
    await this.noteFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field title should be visible' });
    await this.noteFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field input should be visible' });
    const titleText = await this.noteFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.noteFieldInput.getText() ?? '';
    const inputAttr = await this.noteFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyNewNoteFieldVisibleWithAllElements(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_LOGIN_NOTE_FIELD;
    await this.newnoteField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New note field should be visible' });
    await this.newNoteFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New note field icon should be visible' });
    await this.newNoteFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New note field title should be visible' });
    await this.newNoteFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New note field input should be visible' });
    await this.newNoteFieldDeleteButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New note field delete button should be visible' });
    const titleActual = await this.newNoteFieldTitle.getText();
    expect(titleActual).toBe(title);
    const inputText = await this.newNoteFieldInput.getText() ?? '';
    const inputAttr = await this.newNoteFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyCustomFieldVisible(): Promise<this> {
    const { text } = CREATE_LOGIN_CUSTOM_FIELD;
    await this.customFields.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom fields should be visible' });
    await this.customFieldsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom fields icon should be visible' });
    await this.customFieldsIcon2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom fields icon 2 should be visible' });
    await this.customFieldsText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom fields text should be visible' });
    const fieldText = await this.customFieldsText.getText();
    expect(fieldText).toBe(text);
    return this.self;
  }

  async verifyAllElementsInShowCustomFieldPopupVisible(): Promise<this> {
    const { text } = CREATE_LOGIN_SHOW_CUSTOM_FIELD_POPUP;
    await this.customFieldsIcon3.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Show custom field popup icon should be visible' });
    await this.customFieldsText2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Show custom field popup text should be visible' });
    const textActual = await this.customFieldsText2.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyNoFolderButtonPopupVisible(timeout = 10000): Promise<this> {
    await this.noFolderButtonPopup.waitForDisplayed({
      timeout,
      timeoutMsg: 'No Folder button popup not visible',
    });
    return this.self;
  }

  async verifyAddFilePopupVisible(timeout = 10000): Promise<this> {
    await this.addFilePopup.waitForDisplayed({
      timeout,
      timeoutMsg: 'Add file popup not visible',
    });
    return this.self;
  }

  async verifyAllElementsInAddFilePopupVisible(): Promise<this> {
    const { title, text, chooseFileButtonText, chooseMediaButtonText } = CREATE_LOGIN_ADD_FILE_POPUP;
    await this.addFilePopupIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file popup icon should be visible' });
    await this.addFilePopupTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file popup title should be visible' });
    await this.addFilePopupText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file popup text should be visible' });
    await this.addFilePopupChooseFileButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file popup Choose File button should be visible' });
    await this.addFilePopupChooseFileButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file popup Choose File button text should be visible' });
    await this.addFilePopupChooseMediaButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file popup Choose Photo / Video button should be visible' });
    await this.addFilePopupChooseMediaButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file popup Choose Photo / Video button text should be visible' });
    const titleActual = await this.addFilePopupTitle.getText();
    expect(titleActual).toBe(title);
    const textActual = await this.addFilePopupText.getText();
    expect(textActual).toBe(text);
    const chooseFileTextActual = await this.addFilePopupChooseFileButtonText.getText();
    expect(chooseFileTextActual).toBe(chooseFileButtonText);
    const chooseMediaTextActual = await this.addFilePopupChooseMediaButtonText.getText();
    expect(chooseMediaTextActual).toBe(chooseMediaButtonText);
    return this.self;
  }

  async verifyAllElementsInPopupVisible(): Promise<this> {
    const { text } = CREATE_LOGIN_CREATE_NEW_BUTTON;
    await this.createNewButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create new button should be visible' });
    await this.createNewButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create new button icon should be visible' });
    await this.createNewButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create new button text should be visible' });
    const buttonText = await this.createNewButtonText.getText();
    expect(buttonText).toBe(text);
    return this.self;
  }

  async verifyTestFolderButtonVisible(): Promise<this> {
    await this.testFolderButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Test Folder button should be visible' });
    return this.self;
  }

  async tapTestFolderButton(): Promise<this> {
    await this.testFolderButton.click();
    return this.self;
  }

  async tapOnTestFolderInPopup(): Promise<this> {
    await this.testFolderPopupTestFolderButton.click();
    return this.self;
  }

  async verifyTestFolderPopupVisible(timeout = 10000): Promise<this> {
    await this.testFolderPopup.waitForDisplayed({
      timeout,
      timeoutMsg: 'Test Folder popup not visible',
    });
    return this.self;
  }

  async verifyTestFolderSelected(): Promise<this> {
    await this.testFolderPopupCheckedIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Test Folder selected (checked icon) should be visible' });
    return this.self;
  }

  async verifyAllElementsInTestFolderPopupVisible(): Promise<this> {
    const { title, itemsText } = CREATE_LOGIN_TEST_FOLDER_POPUP;
    const { text: createNewText } = CREATE_LOGIN_CREATE_NEW_BUTTON;
    await this.testFolderPopupIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Test Folder popup icon should be visible' });
    await this.testFolderPopupTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Test Folder popup title should be visible' });
    await this.testFolderPopupText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Test Folder popup text should be visible' });
    await this.testFolderPopupCheckedIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Test Folder popup checked icon should be visible' });
    await this.createNewButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create new button should be visible' });
    await this.createNewButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create new button icon should be visible' });
    await this.createNewButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create new button text should be visible' });
    const titleText = await this.testFolderPopupTitle.getText();
    expect(titleText).toBe(title);
    const itemsTextActual = await this.testFolderPopupText.getText();
    expect(itemsTextActual).toBe(itemsText);
    const buttonText = await this.createNewButtonText.getText();
    expect(buttonText).toBe(createNewText);
    return this.self;
  }

  async waitForGeneratePasswordPopupVisible(timeout = 10000): Promise<this> {
    await this.generatePasswordPopup.waitForDisplayed({
      timeout,
      timeoutMsg: 'Generate password popup not visible',
    });
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
}

export default CreateLoginPage;