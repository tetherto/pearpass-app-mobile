import BasePage from '@pages/BasePage';
import createCreditCardLocators from '@locators/HomeLocators/CreateCreditCardLocators';
import { CREATE_CREDIT_CARD_CUSTOM_FIELD, CREATE_CREDIT_CARD_ENTERED_FIELDS, CREATE_CREDIT_CARD_EXPIRY_DATE_FIELD, CREATE_CREDIT_CARD_FILE_FIELD, CREATE_CREDIT_CARD_NAME_ON_CARD_FIELD, CREATE_CREDIT_CARD_NEW_FILE_FIELD, CREATE_CREDIT_CARD_NOTE_FIELD, CREATE_CREDIT_CARD_NUMBER_ON_CARD_FIELD, CREATE_CREDIT_CARD_PIN_CODE_FIELD, CREATE_CREDIT_CARD_SECURITY_CODE_FIELD, CREATE_CREDIT_CARD_SHOW_CUSTOM_FIELD_POPUP, CREATE_CREDIT_CARD_TITLE_FIELD, CREATE_CREDIT_CARD_VALIDATION_MESSAGES, CREATE_CREDIT_CARD_WARNING_MESSAGE } from '@data/home-data/createCreditCards.data';

declare const expect: any;

export class CreateCreditCardsPage extends BasePage {
  protected selectors = createCreditCardLocators;

  get closeButton() { return this.$('closeButton'); }
  get titleField() { return this.$('titleField'); }
  get titleFieldTitle() { return this.$('titleFieldTitle'); }
  get titleFieldInput() { return this.$('titleFieldInput'); }
  get nameOnCardField() { return this.$('nameOnCardField'); }
  get nameOnCardFieldIcon() { return this.$('nameOnCardFieldIcon'); }
  get nameOnCardFieldTitle() { return this.$('nameOnCardFieldTitle'); }
  get nameOnCardFieldInput() { return this.$('nameOnCardFieldInput'); }
  get numberOnCardField() { return this.$('numberOnCardField'); }
  get numberOnCardFieldIcon() { return this.$('numberOnCardFieldIcon'); }
  get numberOnCardFieldTitle() { return this.$('numberOnCardFieldTitle'); }
  get numberOnCardFieldInput() { return this.$('numberOnCardFieldInput'); }
  get expiryDateField() { return this.$('expiryDateField'); }
  get expiryDateFieldIcon() { return this.$('expiryDateFieldIcon'); }
  get expiryDateFieldTitle() { return this.$('expiryDateFieldTitle'); }
  get expiryDateFieldInput() { return this.$('expiryDateFieldInput'); }
  get securityCodeField() { return this.$('securityCodeField'); }
  get securityCodeFieldIcon() { return this.$('securityCodeFieldIcon'); }
  get securityCodeFieldTitle() { return this.$('securityCodeFieldTitle'); }
  get securityCodeFieldInput() { return this.$('securityCodeFieldInput'); }
  get showSecurityCodeIconButton() { return this.$('showSecurityCodeIconButton'); }
  get pinCodeField() { return this.$('pinCodeField'); }
  get pinCodeFieldIcon() { return this.$('pinCodeFieldIcon'); }
  get pinCodeFieldTitle() { return this.$('pinCodeFieldTitle'); }
  get pinCodeFieldInput() { return this.$('pinCodeFieldInput'); }
  get showPinCodeIconButton() { return this.$('showPinCodeIconButton'); }
  get fileField() { return this.$('fileField'); }
  get fileFieldIcon() { return this.$('fileFieldIcon'); }
  get fileFieldTitle() { return this.$('fileFieldTitle'); }
  get fileFieldText() { return this.$('fileFieldText'); }
  get addFileButton() { return this.$('addFileButton'); }
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
  get testDocumentFile() { return this.$('testDocumentFile'); }
  get largeTestFile() { return this.$('largeTestFile'); }
  get newFileField() { return this.$('newFileField'); }
  get newFileFieldIcon() { return this.$('newFileFieldIcon'); }
  get newFileFieldTitle() { return this.$('newFileFieldTitle'); }
  get newFileFieldText() { return this.$('newFileFieldText'); }
  get newFileFieldDeleteButton() { return this.$('newFileFieldDeleteButton'); }
  get warningMessageText() { return this.$('warningMessageText'); }
  get warningMessageIcon() { return this.$('warningMessageIcon'); }
  get validationToastNumbersOnly() { return this.$('validationToastNumbersOnly'); }

  async verifyTitleFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_CREDIT_CARD_TITLE_FIELD;
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

  async tapTitleField(): Promise<this> {
    await this.titleField.click();
    return this.self;
  }

  async tapNameOnCardField(): Promise<this> {
    await this.nameOnCardField.click();
    return this.self;
  }

  async tapNumberOnCardField(): Promise<this> {
    await this.numberOnCardField.click();
    return this.self;
  }

  async tapExpiryDateField(): Promise<this> {
    await this.expiryDateField.click();
    return this.self;
  }

  async tapSecurityCodeField(): Promise<this> {
    await this.securityCodeField.click();
    return this.self;
  }

  async tapShowSecurityCodeIconButton(): Promise<this> {
    await this.showSecurityCodeIconButton.click();
    return this.self;
  }

  async tapPinCodeField(): Promise<this> {
    await this.pinCodeField.click();
    return this.self;
  }

  async tapShowPinCodeIconButton(): Promise<this> {
    await this.showPinCodeIconButton.click();
    return this.self;
  }

  async tapNoteField(): Promise<this> {
    await this.noteField.click();
    return this.self;
  }

  async tapShowCustomFieldButton(): Promise<this> {
    await this.customFields.click();
    return this.self;
  }

  async tapAddFileButton(): Promise<this> {
    await this.addFileButton.click();
    return this.self;
  }

  async tapNewFileFieldDeleteButton(): Promise<this> {
    await this.newFileFieldDeleteButton.click();
    return this.self;
  }

  async enterTextInFields(
    fieldName: keyof typeof CREATE_CREDIT_CARD_ENTERED_FIELDS
  ): Promise<this> {
    const value = CREATE_CREDIT_CARD_ENTERED_FIELDS[fieldName];
    const inputByField = {
      title: this.titleFieldInput,
      nameOnCard: this.nameOnCardFieldInput,
      numberOnCard: this.numberOnCardFieldInput,
      expiryDate: this.expiryDateFieldInput,
      securityCode: this.securityCodeFieldInput,
      pinCode: this.pinCodeFieldInput,
      note: this.noteFieldInput,
    } as const;
    const input = inputByField[fieldName];
    await input.setValue(value);
    return this.self;
  }

  async verifyEnteredTextInFields(
    fieldName: keyof typeof CREATE_CREDIT_CARD_ENTERED_FIELDS
  ): Promise<this> {
    const expected = CREATE_CREDIT_CARD_ENTERED_FIELDS[fieldName];
    const inputByField = {
      title: this.titleFieldInput,
      nameOnCard: this.nameOnCardFieldInput,
      numberOnCard: this.numberOnCardFieldInput,
      expiryDate: this.expiryDateFieldInput,
      securityCode: this.securityCodeFieldInput,
      pinCode: this.pinCodeFieldInput,
      note: this.noteFieldInput,
    } as const;
    const input = inputByField[fieldName];
    const actual = await input.getText() ?? await input.getAttribute('text') ?? '';
    expect(actual).toBe(expected);
    return this.self;
  }

  async verifyNameOnCardFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_CREDIT_CARD_NAME_ON_CARD_FIELD;
    await this.nameOnCardField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Name on card field should be visible' });
    await this.nameOnCardFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Name on card field icon should be visible' });
    await this.nameOnCardFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Name on card field title should be visible' });
    await this.nameOnCardFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Name on card field input should be visible' });
    const titleText = await this.nameOnCardFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.nameOnCardFieldInput.getText() ?? '';
    const inputAttr = await this.nameOnCardFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyNumberOnCardFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_CREDIT_CARD_NUMBER_ON_CARD_FIELD;
    await this.numberOnCardField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Number on card field should be visible' });
    await this.numberOnCardFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Number on card field icon should be visible' });
    await this.numberOnCardFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Number on card field title should be visible' });
    await this.numberOnCardFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Number on card field input should be visible' });
    const titleText = await this.numberOnCardFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.numberOnCardFieldInput.getText() ?? '';
    const inputAttr = await this.numberOnCardFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyExpiryDateFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_CREDIT_CARD_EXPIRY_DATE_FIELD;
    await this.expiryDateField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Expiry date field should be visible' });
    await this.expiryDateFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Expiry date field icon should be visible' });
    await this.expiryDateFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Expiry date field title should be visible' });
    await this.expiryDateFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Expiry date field input should be visible' });
    const titleText = await this.expiryDateFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.expiryDateFieldInput.getText() ?? '';
    const inputAttr = await this.expiryDateFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifySecurityCodeFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_CREDIT_CARD_SECURITY_CODE_FIELD;
    await this.securityCodeField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Security code field should be visible' });
    await this.securityCodeFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Security code field icon should be visible' });
    await this.securityCodeFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Security code field title should be visible' });
    await this.securityCodeFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Security code field input should be visible' });
    const titleText = await this.securityCodeFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.securityCodeFieldInput.getText() ?? '';
    const inputAttr = await this.securityCodeFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyPinCodeFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_CREDIT_CARD_PIN_CODE_FIELD;
    await this.pinCodeField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pin code field should be visible' });
    await this.pinCodeFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pin code field icon should be visible' });
    await this.pinCodeFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pin code field title should be visible' });
    await this.pinCodeFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pin code field input should be visible' });
    const titleText = await this.pinCodeFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.pinCodeFieldInput.getText() ?? '';
    const inputAttr = await this.pinCodeFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyFileFieldVisible(): Promise<this> {
    const { title, text } = CREATE_CREDIT_CARD_FILE_FIELD;
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

  async verifyNoteFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_CREDIT_CARD_NOTE_FIELD;
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

  async verifyCustomFieldVisible(): Promise<this> {
    const { text } = CREATE_CREDIT_CARD_CUSTOM_FIELD;
    await this.customFields.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom fields should be visible' });
    await this.customFieldsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom fields icon should be visible' });
    await this.customFieldsIcon2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom fields icon 2 should be visible' });
    await this.customFieldsText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom fields text should be visible' });
    const customTextActual = await this.customFieldsText.getText();
    expect(customTextActual).toBe(text);
    return this.self;
  }

  async verifyAllElementsInShowCustomFieldPopupVisible(): Promise<this> {
    const { noteText } = CREATE_CREDIT_CARD_SHOW_CUSTOM_FIELD_POPUP;
    await this.customFieldsIcon3.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Show custom field popup: Note icon should be visible' });
    await this.customFieldsText2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Show custom field popup: Note text should be visible' });
    const noteTextActual = await this.customFieldsText2.getText();
    expect(noteTextActual).toBe(noteText);
    return this.self;
  }

  async verifyNewFileFieldWithAllElementsVisible(): Promise<this> {
    const { title, fileName } = CREATE_CREDIT_CARD_NEW_FILE_FIELD;
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
    // After delete, the file name row disappears; the indexed ViewGroup (newFileField) may stay in the hierarchy.
    await this.newFileFieldText.waitForDisplayed({
      timeout: timeout + 2000,
      reverse: true,
      timeoutMsg: 'Attached file name should not be visible after deletion',
    });
    return this.self;
  }

  async verifyWarningMessageVisible(): Promise<this> {
    const { text } = CREATE_CREDIT_CARD_WARNING_MESSAGE;
    await this.warningMessageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Warning message text should be visible' });
    await this.warningMessageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Warning message icon should be visible' });
    const textActual = await this.warningMessageText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyNumericOnlyValidationToastDisplayed(): Promise<this> {
    const { numbersOnly } = CREATE_CREDIT_CARD_VALIDATION_MESSAGES;
    await this.validationToastNumbersOnly.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Numeric-only validation toast should be visible',
    });
    const textActual =
      (await this.validationToastNumbersOnly.getText()) ??
      (await this.validationToastNumbersOnly.getAttribute('text')) ??
      '';
    expect(textActual).toBe(numbersOnly);
    return this.self;
  }

  async waitForCreateCreditCardPageLoaded(timeout = 10000): Promise<this> {
    await this.nameOnCardField.waitForDisplayed({
      timeout,
      timeoutMsg: 'Create credit card page name on card field not visible',
    });
    return this.self;
  }

  async chooseTestDocumentFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.testDocumentFile.waitForDisplayed({ timeout: waitTimeout });
        await this.testDocumentFile.click();
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

  async chooseLargeTestFile(): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 3000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.largeTestFile.waitForDisplayed({ timeout: waitTimeout });
        await this.largeTestFile.click();
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
    await browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: 900, y: 1200 },
          { type: 'pointerDown' },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 600, x: 900, y: 1700 },
          { type: 'pointerUp' },
        ],
      },
    ]);
    await browser.releaseActions();
    await browser.pause(1500);
    return this.self;
  }
}
export default CreateCreditCardsPage;