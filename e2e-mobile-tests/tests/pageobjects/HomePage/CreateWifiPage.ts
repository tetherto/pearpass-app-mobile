import BasePage from '@pages/BasePage';
import createWifiLocators from '@locators/HomeLocators/CreateWiFiLocators';
import { CREATE_WIFI_CUSTOM_FIELD, CREATE_WIFI_ENTERED_FIELDS, CREATE_WIFI_NAME_FIELD, CREATE_WIFI_NEW_NOTE_FIELD, CREATE_WIFI_NOTE_FIELD, CREATE_WIFI_PASSWORD_FIELD, CREATE_WIFI_SHOW_CUSTOM_FIELD_POPUP } from '@data/home-data/createWiFi.data';

declare const expect: any;

export class CreateWifiPage extends BasePage {
  protected selectors = createWifiLocators;

  get wifiNameField() { return this.$('wifiNameField'); }
  get wifiNameFieldIcon() { return this.$('wifiNameFieldIcon'); }
  get wifiNameFieldTitle() { return this.$('wifiNameFieldTitle'); }
  get wifiNameFieldInput() { return this.$('wifiNameFieldInput'); }
  get wifiPasswordField() { return this.$('wifiPasswordField'); }
  get wifiPasswordFieldIcon() { return this.$('wifiPasswordFieldIcon'); }
  get wifiPasswordFieldTitle() { return this.$('wifiPasswordFieldTitle'); }
  get wifiPasswordFieldInput() { return this.$('wifiPasswordFieldInput'); }
  get generatePasswordIcon() { return this.$('generatePasswordIcon'); }
  get showPasswordIcon() { return this.$('showPasswordIcon'); }
  get noteField() { return this.$('noteField'); }
  get noteFieldIcon() { return this.$('noteFieldIcon'); }
  get noteFieldTitle() { return this.$('noteFieldTitle'); }
  get noteFieldInput() { return this.$('noteFieldInput'); }
  get customField() { return this.$('customField'); }
  get customFieldIcon() { return this.$('customFieldIcon'); }
  get customFieldTitle() { return this.$('customFieldTitle'); }
  get customFieldIcon2() { return this.$('customFieldIcon2'); }
  get customFieldsIcon3() { return this.$('customFieldsIcon3'); }
  get customFieldsText2() { return this.$('customFieldsText2'); }
  get newNoteField() { return this.$('newNoteField'); }
  get newNoteFieldIcon() { return this.$('newNoteFieldIcon'); }
  get newNoteFieldTitle() { return this.$('newNoteFieldTitle'); }
  get newNoteFieldInput() { return this.$('newNoteFieldInput'); }
  get newNoteFieldDeleteButton() { return this.$('newNoteFieldDeleteButton'); }

  async tapWifiNameField(): Promise<this> {
    await this.wifiNameField.click();
    return this.self;
  }

  async tapWifiPasswordField(): Promise<this> {
    await this.wifiPasswordField.click();
    return this.self;
  }

  async tapNoteField(): Promise<this> {
    await this.noteField.click();
    return this.self;
  }

  async tapShowPasswordIconButton(): Promise<this> {
    await this.showPasswordIcon.click();
    return this.self;
  }

  async tapShowCustomFieldButton(): Promise<this> {
    await this.customFieldIcon2.click();
    return this.self;
  }

  async addNewNoteFieldButton(): Promise<this> {
    await this.customFieldsIcon3.click();
    return this.self;
  }

  async tapNewNoteField(): Promise<this> {
    await this.newNoteField.click();
    return this.self;
  }

  async tapNewNoteFieldDeleteButton(): Promise<this> {
    await this.newNoteFieldDeleteButton.click();
    return this.self;
  }

  async verifyWifiNameFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_WIFI_NAME_FIELD;
    await this.wifiNameField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Name field should be visible' });
    await this.wifiNameFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Name field icon should be visible' });
    await this.wifiNameFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Name field title should be visible' });
    await this.wifiNameFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Name field input should be visible' });
    const titleText = await this.wifiNameFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.wifiNameFieldInput.getText() ?? '';
    const inputAttr = await this.wifiNameFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyWifiPasswordFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_WIFI_PASSWORD_FIELD;
    await this.wifiPasswordField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Password field should be visible' });
    await this.wifiPasswordFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Password field icon should be visible' });
    await this.wifiPasswordFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Password field title should be visible' });
    await this.wifiPasswordFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Password field input should be visible' });
    await this.generatePasswordIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Generate password icon should be visible' });
    await this.showPasswordIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Show password icon should be visible' });
    const titleText = await this.wifiPasswordFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.wifiPasswordFieldInput.getText() ?? '';
    const inputAttr = await this.wifiPasswordFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyNoteFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_WIFI_NOTE_FIELD;
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
    const { title } = CREATE_WIFI_CUSTOM_FIELD;
    await this.customField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field should be visible' });
    await this.customFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field icon should be visible' });
    await this.customFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field title should be visible' });
    await this.customFieldIcon2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field icon 2 should be visible' });
    const titleText = await this.customFieldTitle.getText();
    expect(titleText).toBe(title);
    return this.self;
  }

  async verifyAllElementsInShowCustomFieldPopupVisible(): Promise<this> {
    const { noteText } = CREATE_WIFI_SHOW_CUSTOM_FIELD_POPUP;
    await this.customFieldsIcon3.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Show custom field popup: Note icon should be visible' });
    await this.customFieldsText2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Show custom field popup: Note text should be visible' });
    const noteTextActual = await this.customFieldsText2.getText();
    expect(noteTextActual).toBe(noteText);
    return this.self;
  }

  async verifyNewNoteFieldVisibleWithAllElements(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_WIFI_NEW_NOTE_FIELD;
    await this.newNoteField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New note field should be visible' });
    await this.newNoteFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New note field icon should be visible' });
    await this.newNoteFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New note field title should be visible' });
    await this.newNoteFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New note field input should be visible' });
    await this.newNoteFieldDeleteButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New note field delete button should be visible' });
    const titleText = await this.newNoteFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.newNoteFieldInput.getText() ?? '';
    const inputAttr = await this.newNoteFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyNewNoteFieldNotVisible(timeout = 5000): Promise<this> {
    await this.newNoteField.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: 'New note field should not be visible',
    });
    return this.self;
  }

  async enterTextInFields(
    fieldName: keyof typeof CREATE_WIFI_ENTERED_FIELDS
  ): Promise<this> {
    const value = CREATE_WIFI_ENTERED_FIELDS[fieldName];
    const inputByField = {
      wifiName: this.wifiNameFieldInput,
      wifiPassword: this.wifiPasswordFieldInput,
      note: this.noteFieldInput,
      newNote: this.newNoteFieldInput,
      updatedNote: this.noteFieldInput,
    } as const;
    const input = inputByField[fieldName];
    await input.setValue(value);
    return this.self;
  }

  async verifyEnteredTextInFields(
    fieldName: keyof typeof CREATE_WIFI_ENTERED_FIELDS
  ): Promise<this> {
    const expected = CREATE_WIFI_ENTERED_FIELDS[fieldName];
    const inputByField = {
      wifiName: this.wifiNameFieldInput,
      wifiPassword: this.wifiPasswordFieldInput,
      note: this.noteFieldInput,
      newNote: this.newNoteFieldInput,
      updatedNote: this.noteFieldInput,
    } as const;
    const input = inputByField[fieldName];
    const actual = await input.getText() ?? await input.getAttribute('text') ?? '';
    expect(actual).toBe(expected);
    return this.self;
  }

  async waitForCreateWifiPageLoaded(timeout = 10000): Promise<this> {
    await this.wifiNameField.waitForDisplayed({
      timeout,
      timeoutMsg: 'Create Wi-Fi page wifi name field not visible',
    });
    return this.self;
  }
}
export default CreateWifiPage;