import BasePage from '@pages/BasePage';
import createNotesLocators from '@locators/HomeLocators/CreateNotesLocators';
import { CREATE_NOTES_TITLE_FIELD, CREATE_NOTES_WRITE_NOTE_FIELD, CREATE_NOTES_ADD_FILE_FIELD, CREATE_NOTES_NEW_ADDED_FILE_FIELD, CREATE_NOTES_CUSTOM_FIELD, CREATE_NOTES_NEW_ELEMENT_IN_CUSTOM_FIELD, CREATE_NOTES_ENTERED_FIELDS } from '@data/home-data/createNotes.data';

declare const expect: any;

export class CreateNotesPage extends BasePage {
  protected selectors = createNotesLocators;

  get titleField() { return this.$('titleField'); }
  get titleFieldTitle() { return this.$('titleFieldTitle'); }
  get titleFieldInput() { return this.$('titleFieldInput'); }
  get writeNoteField() { return this.$('writeNoteField'); }
  get writeNoteText() { return this.$('writeNoteText'); }
  get addFileField() { return this.$('addFileField'); }
  get addFileFieldIcon() { return this.$('addFileFieldIcon'); }
  get addFileFieldTitle() { return this.$('addFileFieldTitle'); }
  get addFileFieldInput() { return this.$('addFileFieldInput'); }
  get addFileFieldButton() { return this.$('addFileFieldButton'); }
  get customField() { return this.$('customField'); }
  get customFieldIcon() { return this.$('customFieldIcon'); }
  get customFieldTitle() { return this.$('customFieldTitle'); }
  get customFieldIcon2() { return this.$('customFieldIcon2'); }
  get newAddedFileField() { return this.$('newAddedFileField'); }
  get newAddedFileFieldIcon() { return this.$('newAddedFileFieldIcon'); }
  get newAddedFileFieldTitle() { return this.$('newAddedFileFieldTitle'); }
  get newAddedFileFieldText() { return this.$('newAddedFileFieldText'); }
  get newAddedFileFieldDeleteButton() { return this.$('newAddedFileFieldDeleteButton'); }
  get customFieldsIcon3() { return this.$('customFieldsIcon3'); }
  get customFieldsText2() { return this.$('customFieldsText2'); }

  async tapTitleField(): Promise<this> {
    await this.titleField.click();
    return this.self;
  }

  async tapWriteNoteField(): Promise<this> {
    await this.writeNoteField.click();
    return this.self;
  }

  async tapAddFileButton(): Promise<this> {
    await this.addFileFieldButton.click();
    return this.self;
  }

  async tapCustomField(): Promise<this> {
    await this.customFieldIcon2.click();
    return this.self;
  }

  async enterTextInFields(
    fieldName: keyof typeof CREATE_NOTES_ENTERED_FIELDS
  ): Promise<this> {
    const value = CREATE_NOTES_ENTERED_FIELDS[fieldName];
    const inputByField = {
      title: this.titleFieldInput,
      writeNote: this.writeNoteText,
    } as const;
    const input = inputByField[fieldName];
    await input.setValue(value);
    return this.self;
  }

  async verifyEnteredTextInFields(
    fieldName: keyof typeof CREATE_NOTES_ENTERED_FIELDS
  ): Promise<this> {
    const expected = CREATE_NOTES_ENTERED_FIELDS[fieldName];
    const inputByField = {
      title: this.titleFieldInput,
      writeNote: this.writeNoteText,
    } as const;
    const input = inputByField[fieldName];
    const actual = (await input.getText()) ?? (await input.getAttribute('text')) ?? '';
    expect(actual).toBe(expected);
    return this.self;
  }

  async verifyTitleFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_NOTES_TITLE_FIELD;
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

  async verifyWriteNoteFieldVisible(): Promise<this> {
    const { placeholder } = CREATE_NOTES_WRITE_NOTE_FIELD;
    await this.writeNoteField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Write note field should be visible' });
    await this.writeNoteText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Write note text should be visible' });
    const textActual = (await this.writeNoteText.getText()) ?? (await this.writeNoteText.getAttribute('text')) ?? '';
    expect(textActual).toBe(placeholder);
    return this.self;
  }

  async verifyAddFileFieldVisible(): Promise<this> {
    const { title, inputText } = CREATE_NOTES_ADD_FILE_FIELD;
    await this.addFileField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file field should be visible' });
    await this.addFileFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file field icon should be visible' });
    await this.addFileFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file field title should be visible' });
    await this.addFileFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file field input should be visible' });
    await this.addFileFieldButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file field button should be visible' });
    const titleActual = await this.addFileFieldTitle.getText();
    expect(titleActual).toBe(title);
    const inputActual = (await this.addFileFieldInput.getText()) ?? (await this.addFileFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputText);
    return this.self;
  }

  async verifyCustomFieldVisible(): Promise<this> {
    const { title } = CREATE_NOTES_CUSTOM_FIELD;
    await this.customField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field should be visible' });
    await this.customFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field icon should be visible' });
    await this.customFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field title should be visible' });
    await this.customFieldIcon2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field icon 2 should be visible' });
    const titleActual = await this.customFieldTitle.getText();
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyNewElementInCustomFieldVisible(): Promise<this> {
    const { text } = CREATE_NOTES_NEW_ELEMENT_IN_CUSTOM_FIELD;
    await this.customFieldsIcon3.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New element in custom field icon should be visible' });
    await this.customFieldsText2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New element in custom field text should be visible' });
    const textActual = (await this.customFieldsText2.getText()) ?? (await this.customFieldsText2.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyNewFileFieldWithAllElementsVisible(): Promise<this> {
    const { title, text } = CREATE_NOTES_NEW_ADDED_FILE_FIELD;
    await this.newAddedFileField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New added file field should be visible' });
    await this.newAddedFileFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New added file field icon should be visible' });
    await this.newAddedFileFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New added file field title should be visible' });
    await this.newAddedFileFieldText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New added file field text should be visible' });
    await this.newAddedFileFieldDeleteButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New added file field delete button should be visible' });
    const titleActual = await this.newAddedFileFieldTitle.getText();
    expect(titleActual).toBe(title);
    const textActual = (await this.newAddedFileFieldText.getText()) ?? (await this.newAddedFileFieldText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async waitForCreateNotesPageLoaded(timeout = 10000): Promise<this> {
    await this.titleField.waitForDisplayed({
      timeout,
      timeoutMsg: 'Create notes page title field not visible',
    });
    return this.self;
  }
}
export default CreateNotesPage;