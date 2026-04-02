import BasePage from '@pages/BasePage';
import createCustomElementLocators from '@locators/HomeLocators/CreateCustomElementLocators';
import { CREATE_CUSTOM_ELEMENT_TITLE_FIELD, CREATE_CUSTOM_ELEMENT_FIELD, CREATE_CUSTOM_ELEMENT_FILE_FIELD, CREATE_CUSTOM_ELEMENT_ENTERED_FIELDS, CREATE_CUSTOM_ELEMENT_NEW_FILE_FIELD, CREATE_CUSTOM_ELEMENT_NEW_ELEMENT_IN_CUSTOM_FIELD } from '@data/home-data/createCustomElement.data';

declare const expect: any;

export class CreateCustomElementPage extends BasePage {
  protected selectors = createCustomElementLocators;

  get titleField() { return this.$('titleField'); }
  get titleFieldTitle() { return this.$('titleFieldTitle'); }
  get titleFieldInput() { return this.$('titleFieldInput'); }
  get createCustomField() { return this.$('createCustomField'); }
  get createCustomFieldIcon() { return this.$('createCustomFieldIcon'); }
  get createCustomFieldTitle() { return this.$('createCustomFieldTitle'); }
  get createCustomFieldIcon2() { return this.$('createCustomFieldIcon2'); }
  get addFileField() { return this.$('addFileField'); }
  get addFileFieldIcon() { return this.$('addFileFieldIcon'); }
  get addFileFieldTitle() { return this.$('addFileFieldTitle'); }
  get addFileFieldText() { return this.$('addFileFieldText'); }
  get addFileButton() { return this.$('addFileButton'); }
  get newFileField() { return this.$('newFileField'); }
  get newFileFieldIcon() { return this.$('newFileFieldIcon'); }
  get newFileFieldTitle() { return this.$('newFileFieldTitle'); }
  get newFileFieldText() { return this.$('newFileFieldText'); }
  get createCustomFieldIcon3() { return this.$('createCustomFieldIcon3'); }
  get createCustomFieldText2() { return this.$('createCustomFieldText2'); }

  async verifyTitleFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_CUSTOM_ELEMENT_TITLE_FIELD;
    await this.titleField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Title field should be visible' });
    await this.titleFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Title field title should be visible' });
    await this.titleFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Title field input should be visible' });
    const titleText = await this.titleFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = (await this.titleFieldInput.getText()) ?? '';
    const inputAttr = (await this.titleFieldInput.getAttribute('text')) ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyFileFieldVisible(): Promise<this> {
    const { title, inputText } = CREATE_CUSTOM_ELEMENT_FILE_FIELD;
    await this.addFileField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field should be visible' });
    await this.addFileFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field icon should be visible' });
    await this.addFileFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field title should be visible' });
    await this.addFileFieldText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field text should be visible' });
    await this.addFileButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field button should be visible' });
    const titleActual = await this.addFileFieldTitle.getText();
    expect(titleActual).toBe(title);
    const inputActual = (await this.addFileFieldText.getText()) ?? (await this.addFileFieldText.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputText);
    return this.self;
  }

  async tapTitleField(): Promise<this> {
    await this.titleField.click();
    return this.self;
  }

  async tapAddFileButton(): Promise<this> {
    await this.addFileButton.click();
    return this.self;
  }

  async tapCreateCustomFieldButton(): Promise<this> {
    await this.createCustomFieldIcon2.click();
    return this.self;
  }

  async enterTextInFields(
    fieldName: keyof typeof CREATE_CUSTOM_ELEMENT_ENTERED_FIELDS
  ): Promise<this> {
    const value = CREATE_CUSTOM_ELEMENT_ENTERED_FIELDS[fieldName];
    const inputByField = {
      title: this.titleFieldInput,
    } as const;
    const input = inputByField[fieldName];
    await input.setValue(value);
    return this.self;
  }

  async verifyEnteredTextInFields(
    fieldName: keyof typeof CREATE_CUSTOM_ELEMENT_ENTERED_FIELDS
  ): Promise<this> {
    const expected = CREATE_CUSTOM_ELEMENT_ENTERED_FIELDS[fieldName];
    const inputByField = {
      title: this.titleFieldInput,
    } as const;
    const input = inputByField[fieldName];
    const actual = (await input.getText()) ?? (await input.getAttribute('text')) ?? '';
    expect(actual).toBe(expected);
    return this.self;
  }

  async verifyCustomElementFieldVisible(): Promise<this> {
    const { title } = CREATE_CUSTOM_ELEMENT_FIELD;
    await this.createCustomField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create custom field should be visible' });
    await this.createCustomFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create custom field icon should be visible' });
    await this.createCustomFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create custom field title should be visible' });
    await this.createCustomFieldIcon2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create custom field icon 2 should be visible' });
    const titleActual = await this.createCustomFieldTitle.getText();
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyNewFileFieldWithAllElementsVisible(): Promise<this> {
    const { title, text } = CREATE_CUSTOM_ELEMENT_NEW_FILE_FIELD;
    await this.newFileField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field should be visible' });
    await this.newFileFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field icon should be visible' });
    await this.newFileFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field title should be visible' });
    await this.newFileFieldText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field text should be visible' });
    const titleActual = await this.newFileFieldTitle.getText();
    expect(titleActual).toBe(title);
    const textActual = (await this.newFileFieldText.getText()) ?? (await this.newFileFieldText.getAttribute('content-desc')) ?? (await this.newFileFieldText.getAttribute('contentDescription')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyNewElementInCustomFieldVisible(): Promise<this> {
    const { text } = CREATE_CUSTOM_ELEMENT_NEW_ELEMENT_IN_CUSTOM_FIELD;
    await this.createCustomFieldIcon3.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New element in custom field icon should be visible' });
    await this.createCustomFieldText2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New element in custom field text should be visible' });
    const textActual = (await this.createCustomFieldText2.getText()) ?? (await this.createCustomFieldText2.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async waitForCreateCustomElementPageLoaded(timeout = 10000): Promise<this> {
    await this.titleField.waitForDisplayed({
      timeout,
      timeoutMsg: 'Create custom element page title field not visible',
    });
    return this.self;
  }
}
export default CreateCustomElementPage;