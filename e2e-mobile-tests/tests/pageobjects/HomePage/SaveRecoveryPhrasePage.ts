import BasePage from '@pages/BasePage';
import saveRecoveryPhraseLocators from '@locators/HomeLocators/SaveRecoveryPhraseLocators';
import { SAVE_RECOVERY_PHRASE_APPLICATION_NAME_FIELD, SAVE_RECOVERY_PHRASE_CUSTOM_FIELD, SAVE_RECOVERY_PHRASE_ENTERED_FIELDS, SAVE_RECOVERY_PHRASE_FIRST_PASTED_RECOVERY_PHRASE, SAVE_RECOVERY_PHRASE_NOTE_FIELD, SAVE_RECOVERY_PHRASE_PASTE_FROM_CLIPBOARD_WARNING_MESSAGE, SAVE_RECOVERY_PHRASE_RECOVERY_PHRASE_FIELD, SAVE_RECOVERY_PHRASE_RECOVERY_PHRASE_PASTED_TOAST_MESSAGE, SAVE_RECOVERY_PHRASE_RECOVERY_PHRASE_PASTED_TOAST_MESSAGE_2, SAVE_RECOVERY_PHRASE_SECOND_PASTED_RECOVERY_PHRASE, SAVE_RECOVERY_PHRASE_THIRD_PASTED_RECOVERY_PHRASE, SAVE_RECOVERY_PHRASE_FOURTH_PASTED_RECOVERY_PHRASE, SAVE_RECOVERY_PHRASE_FIFTH_PASTED_RECOVERY_PHRASE, SAVE_RECOVERY_PHRASE_SIXTH_PASTED_RECOVERY_PHRASE, SAVE_RECOVERY_PHRASE_SEVENTH_PASTED_RECOVERY_PHRASE, SAVE_RECOVERY_PHRASE_EIGHTH_PASTED_RECOVERY_PHRASE, SAVE_RECOVERY_PHRASE_NINTH_PASTED_RECOVERY_PHRASE, SAVE_RECOVERY_PHRASE_TENTH_PASTED_RECOVERY_PHRASE, SAVE_RECOVERY_PHRASE_ELEVENTH_PASTED_RECOVERY_PHRASE, SAVE_RECOVERY_PHRASE_TWELFTH_PASTED_RECOVERY_PHRASE } from '@data/home-data/saveRecoveryPhrase.data';
import { browser } from '@wdio/globals';

declare const expect: any;

export class SaveRecoveryPhrasePage extends BasePage {
  protected selectors = saveRecoveryPhraseLocators;

  get applicationNameField() { return this.$('applicationNameField'); }
  get applicationNameFieldIcon() { return this.$('applicationNameFieldIcon'); }
  get applicationNameFieldTitle() { return this.$('applicationNameFieldTitle'); }
  get applicationNameFieldInput() { return this.$('applicationNameFieldInput'); }
  get recoveryPhraseField() { return this.$('recoveryPhraseField'); }
  get recoveryPhraseFieldIcon() { return this.$('recoveryPhraseFieldIcon'); }
  get recoveryPhraseFieldTitle() { return this.$('recoveryPhraseFieldTitle'); }
  get pasteFromClipboardButton() { return this.$('pasteFromClipboardButton'); }
  get pasteFromClipboardIcon() { return this.$('pasteFromClipboardIcon'); }
  get pasteFromClipboardText() { return this.$('pasteFromClipboardText'); }
  get pasteFromClipboardWarningMessage() { return this.$('pasteFromClipboardWarningMessage'); }
  get pasteFromClipboardWarningMessageText() { return this.$('pasteFromClipboardWarningMessageText'); }
  get recoveryPhrasePastedToastMessage() { return this.$('recoveryPhrasePastedToastMessage'); }
  get recoveryPhrasePastedToastMessageText() { return this.$('recoveryPhrasePastedToastMessageText'); }
  get recoveryPhrasePastedToastMessage2Text() { return this.$('recoveryPhrasePastedToastMessage2Text'); }
  get firstPastedRecoveryPhrase() { return this.$('firstPastedRecoveryPhrase'); }
  get firstPastedRecoveryPhraseNumber() { return this.$('firstPastedRecoveryPhraseNumber'); }
  get firstPastedRecoveryPhraseText() { return this.$('firstPastedRecoveryPhraseText'); }
  get secondPastedRecoveryPhrase() { return this.$('secondPastedRecoveryPhrase'); }
  get secondPastedRecoveryPhraseNumber() { return this.$('secondPastedRecoveryPhraseNumber'); }
  get secondPastedRecoveryPhraseText() { return this.$('secondPastedRecoveryPhraseText'); }
  get thirdPastedRecoveryPhrase() { return this.$('thirdPastedRecoveryPhrase'); }
  get thirdPastedRecoveryPhraseNumber() { return this.$('thirdPastedRecoveryPhraseNumber'); }
  get thirdPastedRecoveryPhraseText() { return this.$('thirdPastedRecoveryPhraseText'); }
  get fourthPastedRecoveryPhrase() { return this.$('fourthPastedRecoveryPhrase'); }
  get fourthPastedRecoveryPhraseNumber() { return this.$('fourthPastedRecoveryPhraseNumber'); }
  get fourthPastedRecoveryPhraseText() { return this.$('fourthPastedRecoveryPhraseText'); }
  get fifthPastedRecoveryPhrase() { return this.$('fifthPastedRecoveryPhrase'); }
  get fifthPastedRecoveryPhraseNumber() { return this.$('fifthPastedRecoveryPhraseNumber'); }
  get fifthPastedRecoveryPhraseText() { return this.$('fifthPastedRecoveryPhraseText'); }
  get sixthPastedRecoveryPhrase() { return this.$('sixthPastedRecoveryPhrase'); }
  get sixthPastedRecoveryPhraseNumber() { return this.$('sixthPastedRecoveryPhraseNumber'); }
  get sixthPastedRecoveryPhraseText() { return this.$('sixthPastedRecoveryPhraseText'); }
  get seventhPastedRecoveryPhrase() { return this.$('seventhPastedRecoveryPhrase'); }
  get seventhPastedRecoveryPhraseNumber() { return this.$('seventhPastedRecoveryPhraseNumber'); }
  get seventhPastedRecoveryPhraseText() { return this.$('seventhPastedRecoveryPhraseText'); }
  get eighthPastedRecoveryPhrase() { return this.$('eighthPastedRecoveryPhrase'); }
  get eighthPastedRecoveryPhraseNumber() { return this.$('eighthPastedRecoveryPhraseNumber'); }
  get eighthPastedRecoveryPhraseText() { return this.$('eighthPastedRecoveryPhraseText'); }
  get ninthPastedRecoveryPhrase() { return this.$('ninthPastedRecoveryPhrase'); }
  get ninthPastedRecoveryPhraseNumber() { return this.$('ninthPastedRecoveryPhraseNumber'); }
  get ninthPastedRecoveryPhraseText() { return this.$('ninthPastedRecoveryPhraseText'); }
  get tenthPastedRecoveryPhrase() { return this.$('tenthPastedRecoveryPhrase'); }
  get tenthPastedRecoveryPhraseNumber() { return this.$('tenthPastedRecoveryPhraseNumber'); }
  get tenthPastedRecoveryPhraseText() { return this.$('tenthPastedRecoveryPhraseText'); }
  get eleventhPastedRecoveryPhrase() { return this.$('eleventhPastedRecoveryPhrase'); }
  get eleventhPastedRecoveryPhraseNumber() { return this.$('eleventhPastedRecoveryPhraseNumber'); }
  get eleventhPastedRecoveryPhraseText() { return this.$('eleventhPastedRecoveryPhraseText'); }
  get twelfthPastedRecoveryPhrase() { return this.$('twelfthPastedRecoveryPhrase'); }
  get twelfthPastedRecoveryPhraseNumber() { return this.$('twelfthPastedRecoveryPhraseNumber'); }
  get twelfthPastedRecoveryPhraseText() { return this.$('twelfthPastedRecoveryPhraseText'); }
  get typeField() { return this.$('typeField'); }
  get typeFieldText() { return this.$('typeFieldText'); }
  get twelveWordsRadioButton() { return this.$('twelveWordsRadioButton'); }
  get twelveWordsRadioButtonText() { return this.$('twelveWordsRadioButtonText'); }
  get twelveWordsRadioButtonChosen() { return this.$('twelveWordsRadioButtonChosen'); }
  get twentyFourWordsRadioButton() { return this.$('twentyFourWordsRadioButton'); }
  get twentyFourWordsRadioButtonText() { return this.$('twentyFourWordsRadioButtonText'); }
  get twentyFourWordsRadioButtonUnchosen() { return this.$('twentyFourWordsRadioButtonUnchosen'); }
  get randomWordsToggleText() { return this.$('randomWordsToggleText'); }
  get randomWordsToggleOn() { return this.$('randomWordsToggleOn'); }
  get randomWordsToggleOff() { return this.$('randomWordsToggleOff'); }
  get noteField() { return this.$('noteField'); }
  get noteFieldIcon() { return this.$('noteFieldIcon'); }
  get noteFieldTitle() { return this.$('noteFieldTitle'); }
  get noteFieldInput() { return this.$('noteFieldInput'); }
  get customField() { return this.$('customField'); }
  get createCustomFieldButton() { return this.$('createCustomFieldButton'); }
  get customFieldIcon() { return this.$('customFieldIcon'); }
  get customFieldTitle() { return this.$('customFieldTitle'); }
  get customFieldIcon2() { return this.$('customFieldIcon2'); }

  async tapNoteField(): Promise<this> {
    await this.noteField.click();
    return this.self;
  }

  async tapApplicationNameField(): Promise<this> {
    await this.applicationNameField.click();
    return this.self;
  }

  async tapPasteFromClipboardButton(): Promise<this> {
    await this.pasteFromClipboardButton.click();
    return this.self;
  }

  async verifyPasteFromClipboardWarningMessageVisible(): Promise<this> {
    const { text } = SAVE_RECOVERY_PHRASE_PASTE_FROM_CLIPBOARD_WARNING_MESSAGE;
    await this.pasteFromClipboardWarningMessage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Paste from clipboard warning message should be visible' });
    await this.pasteFromClipboardWarningMessageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Paste from clipboard warning message text should be visible' });
    const textActual = await this.pasteFromClipboardWarningMessageText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyRecoveryPhrasePastedToastMessageVisible(): Promise<this> {
    const { text } = SAVE_RECOVERY_PHRASE_RECOVERY_PHRASE_PASTED_TOAST_MESSAGE;
    await this.recoveryPhrasePastedToastMessage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase pasted toast message should be visible' });
    await this.recoveryPhrasePastedToastMessageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase pasted toast message text should be visible' });
    const textActual = await this.recoveryPhrasePastedToastMessageText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyRecoveryPhrasePastedToastMessage2Visible(): Promise<this> {
    const { text } = SAVE_RECOVERY_PHRASE_RECOVERY_PHRASE_PASTED_TOAST_MESSAGE_2;
    await this.recoveryPhrasePastedToastMessage2Text.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase pasted toast message 2 should be visible' });
    const textActual = await this.recoveryPhrasePastedToastMessage2Text.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyFirstPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_FIRST_PASTED_RECOVERY_PHRASE;
    await this.firstPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'First pasted recovery phrase should be visible' });
    await this.firstPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'First pasted recovery phrase number should be visible' });
    await this.firstPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'First pasted recovery phrase text should be visible' });
    const numberActual = await this.firstPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.firstPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifySecondPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_SECOND_PASTED_RECOVERY_PHRASE;
    await this.secondPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Second pasted recovery phrase should be visible' });
    await this.secondPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Second pasted recovery phrase number should be visible' });
    await this.secondPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Second pasted recovery phrase text should be visible' });
    const numberActual = await this.secondPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.secondPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyThirdPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_THIRD_PASTED_RECOVERY_PHRASE;
    await this.thirdPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Third pasted recovery phrase should be visible' });
    await this.thirdPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Third pasted recovery phrase number should be visible' });
    await this.thirdPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Third pasted recovery phrase text should be visible' });
    const numberActual = await this.thirdPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.thirdPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyFourthPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_FOURTH_PASTED_RECOVERY_PHRASE;
    await this.fourthPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Fourth pasted recovery phrase should be visible' });
    await this.fourthPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Fourth pasted recovery phrase number should be visible' });
    await this.fourthPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Fourth pasted recovery phrase text should be visible' });
    const numberActual = await this.fourthPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.fourthPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyFifthPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_FIFTH_PASTED_RECOVERY_PHRASE;
    await this.fifthPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Fifth pasted recovery phrase should be visible' });
    await this.fifthPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Fifth pasted recovery phrase number should be visible' });
    await this.fifthPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Fifth pasted recovery phrase text should be visible' });
    const numberActual = await this.fifthPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.fifthPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifySixthPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_SIXTH_PASTED_RECOVERY_PHRASE;
    await this.sixthPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Sixth pasted recovery phrase should be visible' });
    await this.sixthPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Sixth pasted recovery phrase number should be visible' });
    await this.sixthPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Sixth pasted recovery phrase text should be visible' });
    const numberActual = await this.sixthPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.sixthPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifySeventhPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_SEVENTH_PASTED_RECOVERY_PHRASE;
    await this.seventhPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Seventh pasted recovery phrase should be visible' });
    await this.seventhPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Seventh pasted recovery phrase number should be visible' });
    await this.seventhPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Seventh pasted recovery phrase text should be visible' });
    const numberActual = await this.seventhPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.seventhPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyEighthPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_EIGHTH_PASTED_RECOVERY_PHRASE;
    await this.eighthPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Eighth pasted recovery phrase should be visible' });
    await this.eighthPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Eighth pasted recovery phrase number should be visible' });
    await this.eighthPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Eighth pasted recovery phrase text should be visible' });
    const numberActual = await this.eighthPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.eighthPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyNinthPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_NINTH_PASTED_RECOVERY_PHRASE;
    await this.ninthPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Ninth pasted recovery phrase should be visible' });
    await this.ninthPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Ninth pasted recovery phrase number should be visible' });
    await this.ninthPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Ninth pasted recovery phrase text should be visible' });
    const numberActual = await this.ninthPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.ninthPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyTenthPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_TENTH_PASTED_RECOVERY_PHRASE;
    await this.tenthPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Tenth pasted recovery phrase should be visible' });
    await this.tenthPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Tenth pasted recovery phrase number should be visible' });
    await this.tenthPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Tenth pasted recovery phrase text should be visible' });
    const numberActual = await this.tenthPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.tenthPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyEleventhPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_ELEVENTH_PASTED_RECOVERY_PHRASE;
    await this.eleventhPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Eleventh pasted recovery phrase should be visible' });
    await this.eleventhPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Eleventh pasted recovery phrase number should be visible' });
    await this.eleventhPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Eleventh pasted recovery phrase text should be visible' });
    const numberActual = await this.eleventhPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.eleventhPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyTwelfthPastedRecoveryPhraseVisible(): Promise<this> {
    const { number, text } = SAVE_RECOVERY_PHRASE_TWELFTH_PASTED_RECOVERY_PHRASE;
    await this.twelfthPastedRecoveryPhrase.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Twelfth pasted recovery phrase should be visible' });
    await this.twelfthPastedRecoveryPhraseNumber.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Twelfth pasted recovery phrase number should be visible' });
    await this.twelfthPastedRecoveryPhraseText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Twelfth pasted recovery phrase text should be visible' });
    const numberActual = await this.twelfthPastedRecoveryPhraseNumber.getText();
    expect(numberActual).toBe(number);
    const textActual = await this.twelfthPastedRecoveryPhraseText.getText();
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyApplicationNameFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = SAVE_RECOVERY_PHRASE_APPLICATION_NAME_FIELD;
    await this.applicationNameField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Application name field should be visible' });
    await this.applicationNameFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Application name field icon should be visible' });
    await this.applicationNameFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Application name field title should be visible' });
    await this.applicationNameFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Application name field input should be visible' });
    const titleText = await this.applicationNameFieldTitle.getText();
    expect(titleText).toBe(title);
    const inputText = await this.applicationNameFieldInput.getText() ?? '';
    const inputAttr = await this.applicationNameFieldInput.getAttribute('text') ?? '';
    const placeholderText = inputText || inputAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyRecoveryPhraseFieldVisible(): Promise<this> {
    const {
      recoveryPhraseTitle,
      pasteFromClipboardText,
      typeFieldText,
      twelveWordsText,
      twentyFourWordsText,
      randomWordsToggleText,
    } = SAVE_RECOVERY_PHRASE_RECOVERY_PHRASE_FIELD;
    await this.recoveryPhraseField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase field should be visible' });
    await this.recoveryPhraseFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase field icon should be visible' });
    await this.recoveryPhraseFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase field title should be visible' });
    await this.pasteFromClipboardButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Paste from clipboard button should be visible' });
    await this.pasteFromClipboardIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Paste from clipboard icon should be visible' });
    await this.pasteFromClipboardText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Paste from clipboard text should be visible' });
    await this.typeField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Type field should be visible' });
    await this.typeFieldText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Type field text should be visible' });
    await this.twelveWordsRadioButton.waitForDisplayed({ timeout: 10000, timeoutMsg: '12 words radio button should be visible' });
    await this.twelveWordsRadioButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: '12 words radio button text should be visible' });
    await this.twelveWordsRadioButtonChosen.waitForDisplayed({ timeout: 10000, timeoutMsg: '12 words radio button chosen should be visible' });
    await this.twentyFourWordsRadioButton.waitForDisplayed({ timeout: 10000, timeoutMsg: '24 words radio button should be visible' });
    await this.twentyFourWordsRadioButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: '24 words radio button text should be visible' });
    await this.twentyFourWordsRadioButtonUnchosen.waitForDisplayed({ timeout: 10000, timeoutMsg: '24 words radio button unchosen should be visible' });
    await this.randomWordsToggleText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Random words toggle text should be visible' });
    await this.randomWordsToggleOn.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Random words toggle on should be visible' });
    await this.randomWordsToggleOff.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Random words toggle off should be visible' });
    const titleActual = await this.recoveryPhraseFieldTitle.getText();
    expect(titleActual).toBe(recoveryPhraseTitle);
    const pasteTextActual = await this.pasteFromClipboardText.getText();
    expect(pasteTextActual).toBe(pasteFromClipboardText);
    const typeTextActual = await this.typeFieldText.getText();
    expect(typeTextActual).toBe(typeFieldText);
    const twelveActual = await this.twelveWordsRadioButtonText.getText();
    expect(twelveActual).toBe(twelveWordsText);
    const twentyFourActual = await this.twentyFourWordsRadioButtonText.getText();
    expect(twentyFourActual).toBe(twentyFourWordsText);
    const randomToggleActual = await this.randomWordsToggleText.getText();
    expect(randomToggleActual).toBe(randomWordsToggleText);
    return this.self;
  }

  async verifyNoteFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = SAVE_RECOVERY_PHRASE_NOTE_FIELD;
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
    const { title } = SAVE_RECOVERY_PHRASE_CUSTOM_FIELD;
    await this.customField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field should be visible' });
    await this.createCustomFieldButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create Custom button should be visible' });
    await this.customFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field icon should be visible' });
    await this.customFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field title should be visible' });
    await this.customFieldIcon2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field icon 2 should be visible' });
    const titleText = await this.customFieldTitle.getText();
    expect(titleText).toBe(title);
    return this.self;
  }

  async enterTextInFields(
    fieldName: keyof typeof SAVE_RECOVERY_PHRASE_ENTERED_FIELDS
  ): Promise<this> {
    const value = SAVE_RECOVERY_PHRASE_ENTERED_FIELDS[fieldName];
    const inputByField = {
      applicationName: this.applicationNameFieldInput,
      note: this.noteFieldInput,
    } as const;
    const input = inputByField[fieldName];
    await input.setValue(value);
    return this.self;
  }

  async verifyEnteredTextInFields(
    fieldName: keyof typeof SAVE_RECOVERY_PHRASE_ENTERED_FIELDS
  ): Promise<this> {
    const expected = SAVE_RECOVERY_PHRASE_ENTERED_FIELDS[fieldName];
    const inputByField = {
      applicationName: this.applicationNameFieldInput,
      note: this.noteFieldInput,
    } as const;
    const input = inputByField[fieldName];
    const actual = await input.getText() ?? await input.getAttribute('text') ?? '';
    expect(actual).toBe(expected);
    return this.self;
  }

  /**
   * Reads the current text from the Note field and sets it to the device clipboard.
   * Call after enterTextInFields('note') so that "Paste from clipboard" can use the recovery phrase.
   */
  async copyNoteFieldContentToClipboard(): Promise<this> {
    const text = await this.noteFieldInput.getText() ?? await this.noteFieldInput.getAttribute('text') ?? '';
    await browser.setClipboard(text, 'plaintext');
    return this.self;
  }

  async waitForCreateRecoveryPhrasePageLoaded(timeout = 10000): Promise<this> {
    await this.applicationNameField.waitForDisplayed({
      timeout,
      timeoutMsg: 'Save recovery phrase page application name field not visible',
    });
    return this.self;
  }
}
export default SaveRecoveryPhrasePage;