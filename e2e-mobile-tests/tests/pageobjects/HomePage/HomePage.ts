import BasePage from '@pages/BasePage';
import homeLocators from '@locators/HomeLocators/HomeLocators';
import { CREATE_LOGIN_ENTERED_FIELDS } from '@data/home-data/createLogin.data';
import { CREATE_ITEM_BUTTONS, CREDIT_CARD_CREATED_ON_HOME_PAGE, CREATE_ITEM_POPUP_FIELDS, CUSTOM_ELEMENT_CREATED_ON_HOME_PAGE, HOME_CATEGORY_BUTTONS, HOME_SCREEN, HOME_SEARCH_FIELD, IDENTITY_CREATED_ON_HOME_PAGE, IMPORTED_ACCOUNTS, IMPORTED_ITEMS, LOGIN_CREATED_ON_HOME_PAGE, NOTE_CREATED_ON_HOME_PAGE, RECOVERY_PHRASE_CREATED_ON_HOME_PAGE, WIFI_CREATED_ON_HOME_PAGE } from '@data/home-data/home.data';

declare const expect: any;

export class HomePage extends BasePage {
  protected selectors = homeLocators;

  get currentFolderName() { return this.$('homeCurrentFolderName'); }
  get currentFolderIcon() { return this.$('homeCurrentFolderIcon'); }
  get homeLogoLock() { return this.$('homeLogoLock'); }
  get searchField() { return this.$('searchField'); }
  get searchFieldIcon() { return this.$('searchFieldIcon'); }
  get searchFieldInput() { return this.$('searchFieldInput'); }
  get emptyCollectionText() { return this.$('emptyCollectionText'); }
  get emptyCollectionSubtitleText() { return this.$('emptyCollectionSubtitleText'); }
  get createLoginButton() { return this.$('createLoginButton'); }
  get createLoginButtonIcon() { return this.$('createLoginButtonIcon'); }
  get createLoginButtonText() { return this.$('createLoginButtonText'); }
  get createIdentityButton() { return this.$('createIdentityButton'); }
  get createIdentityButtonIcon() { return this.$('createIdentityButtonIcon'); }
  get createIdentityButtonText() { return this.$('createIdentityButtonText'); }
  get createCreditCardButton() { return this.$('createCreditCardButton'); }
  get createCreditCardButtonIcon() { return this.$('createCreditCardButtonIcon'); }
  get createCreditCardButtonText() { return this.$('createCreditCardButtonText'); }
  get createWifiPasswordButton() { return this.$('createWifiPasswordButton'); }
  get createWifiPasswordButtonIcon() { return this.$('createWifiPasswordButtonIcon'); }
  get createWifiPasswordButtonText() { return this.$('createWifiPasswordButtonText'); }
  get saveRecoveryPhraseButton() { return this.$('saveRecoveryPhraseButton'); }
  get saveRecoveryPhraseButtonIcon() { return this.$('saveRecoveryPhraseButtonIcon'); }
  get saveRecoveryPhraseButtonText() { return this.$('saveRecoveryPhraseButtonText'); }
  get createNoteButton() { return this.$('createNoteButton'); }
  get createNoteButtonIcon() { return this.$('createNoteButtonIcon'); }
  get createNoteButtonText() { return this.$('createNoteButtonText'); }
  get createCustomElementButton() { return this.$('createCustomElementButton'); }
  get createCustomElementButtonIcon() { return this.$('createCustomElementButtonIcon'); }
  get createCustomElementButtonText() { return this.$('createCustomElementButtonText'); }
  get homeCategoryAllButton() { return this.$('homeCategoryAllButton'); }
  get homeCategoryAllButtonIcon() { return this.$('homeCategoryAllButtonIcon'); }
  get homeCategoryAllButtonText() { return this.$('homeCategoryAllButtonText'); }
  get homeCategoryLoginsButton() { return this.$('homeCategoryLoginsButton'); }
  get homeCategoryLoginsButtonIcon() { return this.$('homeCategoryLoginsButtonIcon'); }
  get homeCategoryLoginsButtonText() { return this.$('homeCategoryLoginsButtonText'); }
  get homeCategoryCreditCardsButton() { return this.$('homeCategoryCreditCardsButton'); }
  get homeCategoryCreditCardsButtonIcon() { return this.$('homeCategoryCreditCardsButtonIcon'); }
  get homeCategoryCreditCardsButtonText() { return this.$('homeCategoryCreditCardsButtonText'); }
  get homeCategoryWifiButton() { return this.$('homeCategoryWifiButton'); }
  get homeCategoryWifiButtonIcon() { return this.$('homeCategoryWifiButtonIcon'); }
  get homeCategoryWifiButtonText() { return this.$('homeCategoryWifiButtonText'); }
  get homeCategoryRecoveryPhraseButton() { return this.$('homeCategoryRecoveryPhraseButton'); }
  get homeCategoryRecoveryPhraseButtonIcon() { return this.$('homeCategoryRecoveryPhraseButtonIcon'); }
  get homeCategoryRecoveryPhraseButtonText() { return this.$('homeCategoryRecoveryPhraseButtonText'); }
  get homeCategoryIdentitiesButton() { return this.$('homeCategoryIdentitiesButton'); }
  get homeCategoryIdentitiesButtonIcon() { return this.$('homeCategoryIdentitiesButtonIcon'); }
  get homeCategoryIdentitiesButtonText() { return this.$('homeCategoryIdentitiesButtonText'); }
  get homeCategoryNotesButton() { return this.$('homeCategoryNotesButton'); }
  get homeCategoryNotesButtonIcon() { return this.$('homeCategoryNotesButtonIcon'); }
  get homeCategoryNotesButtonText() { return this.$('homeCategoryNotesButtonText'); }
  get homeCategoryCustomButton() { return this.$('homeCategoryCustomButton'); }
  get homeCategoryCustomButtonIcon() { return this.$('homeCategoryCustomButtonIcon'); }
  get homeCategoryCustomButtonText() { return this.$('homeCategoryCustomButtonText'); }
  get loginCreatedOnHomePage() { return this.$('loginCreatedOnHomePage'); }
  get loginCreatedOnHomePageIcon() { return this.$('loginCreatedOnHomePageIcon'); }
  get loginCreatedOnHomePageText() { return this.$('loginCreatedOnHomePageText'); }
  get loginCreatedOnHomePageThreeDotsButton() { return this.$('loginCreatedOnHomePageThreeDotsButton'); }
  get newLoginCreatedOnHomePageText() { return this.$('newLoginCreatedOnHomePageText'); }
  get creditCardCreatedOnHomePage() { return this.$('creditCardCreatedOnHomePage'); }
  get creditCardCreatedOnHomePageIcon() { return this.$('creditCardCreatedOnHomePageIcon'); }
  get creditCardCreatedOnHomePageText() { return this.$('creditCardCreatedOnHomePageText'); }
  get creditCardCreatedOnHomePageThreeDotsButton() { return this.$('creditCardCreatedOnHomePageThreeDotsButton'); }
  get wifiCreatedOnHomePage() { return this.$('wifiCreatedOnHomePage'); }
  get wifiCreatedOnHomePageIcon() { return this.$('wifiCreatedOnHomePageIcon'); }
  get wifiCreatedOnHomePageText() { return this.$('wifiCreatedOnHomePageText'); }
  get wifiCreatedOnHomePageThreeDotsButton() { return this.$('wifiCreatedOnHomePageThreeDotsButton'); }
  get recoveryPhraseCreatedOnHomePage() { return this.$('recoveryPhraseCreatedOnHomePage'); }
  get recoveryPhraseCreatedOnHomePageIcon() { return this.$('recoveryPhraseCreatedOnHomePageIcon'); }
  get recoveryPhraseCreatedOnHomePageText() { return this.$('recoveryPhraseCreatedOnHomePageText'); }
  get recoveryPhraseCreatedOnHomePageThreeDotsButton() { return this.$('recoveryPhraseCreatedOnHomePageThreeDotsButton'); }
  get noteCreatedOnHomePage() { return this.$('noteCreatedOnHomePage'); }
  get noteCreatedOnHomePageIcon() { return this.$('noteCreatedOnHomePageIcon'); }
  get noteCreatedOnHomePageText() { return this.$('noteCreatedOnHomePageText'); }
  get noteCreatedOnHomePageThreeDotsButton() { return this.$('noteCreatedOnHomePageThreeDotsButton'); }
  get customElementCreatedOnHomePage() { return this.$('customElementCreatedOnHomePage'); }
  get customElementCreatedOnHomePageIcon() { return this.$('customElementCreatedOnHomePageIcon'); }
  get customElementCreatedOnHomePageText() { return this.$('customElementCreatedOnHomePageText'); }
  get customElementCreatedOnHomePageThreeDotsButton() { return this.$('customElementCreatedOnHomePageThreeDotsButton'); }
  get identityCreatedOnHomePage() { return this.$('identityCreatedOnHomePage'); }
  get identityCreatedOnHomePageIcon() { return this.$('identityCreatedOnHomePageIcon'); }
  get identityCreatedOnHomePageText() { return this.$('identityCreatedOnHomePageText'); }
  get identityCreatedOnHomePageThreeDotsButton() { return this.$('identityCreatedOnHomePageThreeDotsButton'); }
  get homeTestFolder() { return this.$('homeTestFolder'); }
  get homeTestFolderIcon() { return this.$('homeTestFolderIcon'); }
  get homeTestFolder1() { return this.$('homeTestFolder1'); }
  get homeTestFolder1Icon() { return this.$('homeTestFolder1Icon'); }
  get bottomNavHomeTab() { return this.$('bottomNavHomeTab'); }
  get bottomNavCreateButton() { return this.$('bottomNavCreateButton'); }
  get bottomNavSettingsTab() { return this.$('bottomNavSettingsTab'); }
  get createItemPopup() { return this.$('createItemPopup'); }
  get loginsField() { return this.$('loginsField'); }
  get loginsFieldIcon() { return this.$('loginsFieldIcon'); }
  get loginsFieldIcon2() { return this.$('loginsFieldIcon2'); }
  get loginsFieldTitle() { return this.$('loginsFieldTitle'); }
  get loginsFieldText() { return this.$('loginsFieldText'); }
  get creditCardsField() { return this.$('creditCardsField'); }
  get creditCardsFieldIcon() { return this.$('creditCardsFieldIcon'); }
  get creditCardsFieldIcon2() { return this.$('creditCardsFieldIcon2'); }
  get creditCardsFieldTitle() { return this.$('creditCardsFieldTitle'); }
  get creditCardsFieldText() { return this.$('creditCardsFieldText'); }
  get wifiField() { return this.$('wifiField'); }
  get wifiFieldIcon() { return this.$('wifiFieldIcon'); }
  get wifiFieldIcon2() { return this.$('wifiFieldIcon2'); }
  get wifiFieldTitle() { return this.$('wifiFieldTitle'); }
  get wifiFieldText() { return this.$('wifiFieldText'); }
  get recoveryPhraseField() { return this.$('recoveryPhraseField'); }
  get recoveryPhraseFieldIcon() { return this.$('recoveryPhraseFieldIcon'); }
  get recoveryPhraseFieldIcon2() { return this.$('recoveryPhraseFieldIcon2'); }
  get recoveryPhraseFieldTitle() { return this.$('recoveryPhraseFieldTitle'); }
  get recoveryPhraseFieldText() { return this.$('recoveryPhraseFieldText'); }
  get identitiesField() { return this.$('identitiesField'); }
  get identitiesFieldIcon() { return this.$('identitiesFieldIcon'); }
  get identitiesFieldIcon2() { return this.$('identitiesFieldIcon2'); }
  get identitiesFieldTitle() { return this.$('identitiesFieldTitle'); }
  get identitiesFieldText() { return this.$('identitiesFieldText'); }
  get notesField() { return this.$('notesField'); }
  get notesFieldIcon() { return this.$('notesFieldIcon'); }
  get notesFieldIcon2() { return this.$('notesFieldIcon2'); }
  get notesFieldTitle() { return this.$('notesFieldTitle'); }
  get notesFieldText() { return this.$('notesFieldText'); }
  get customField() { return this.$('customField'); }
  get customFieldIcon() { return this.$('customFieldIcon'); }
  get customFieldIcon2() { return this.$('customFieldIcon2'); }
  get customFieldTitle() { return this.$('customFieldTitle'); }
  get customFieldText() { return this.$('customFieldText'); }
  get passwordField() { return this.$('passwordField'); }
  get passwordFieldIcon() { return this.$('passwordFieldIcon'); }
  get passwordFieldIcon2() { return this.$('passwordFieldIcon2'); }
  get passwordFieldTitle() { return this.$('passwordFieldTitle'); }
  get passwordFieldText() { return this.$('passwordFieldText'); }
  get onePasswordAccount() { return this.$('onePasswordAccount'); }
  get onePasswordAccountIcon() { return this.$('onePasswordAccountIcon'); }
  get onePasswordAccountIconText() { return this.$('onePasswordAccountIconText'); }
  get onePasswordAccountText() { return this.$('onePasswordAccountText'); }
  get onePasswordPassword() { return this.$('onePasswordPassword'); }
  get onePasswordPasswordIcon() { return this.$('onePasswordPasswordIcon'); }
  get onePasswordPasswordIconText() { return this.$('onePasswordPasswordIconText'); }
  get onePasswordPasswordText() { return this.$('onePasswordPasswordText'); }
  get onePasswordLogin() { return this.$('onePasswordLogin'); }
  get onePasswordLoginIcon() { return this.$('onePasswordLoginIcon'); }
  get onePasswordLoginText() { return this.$('onePasswordLoginText'); }
  get bitwardenNote() { return this.$('bitwardenNote'); }
  get bitwardenNoteIcon() { return this.$('bitwardenNoteIcon'); }
  get bitwardenNoteIconText() { return this.$('bitwardenNoteIconText'); }
  get bitwardenNoteText() { return this.$('bitwardenNoteText'); }
  get bitwardenLogin() { return this.$('bitwardenLogin'); }
  get bitwardenLoginIcon() { return this.$('bitwardenLoginIcon'); }
  get bitwardenLoginIconText() { return this.$('bitwardenLoginIconText'); }
  get bitwardenLoginText() { return this.$('bitwardenLoginText'); }
  get bitwardenJsonSsh() { return this.$('bitwardenJsonSsh'); }
  get bitwardenJsonSshIcon() { return this.$('bitwardenJsonSshIcon'); }
  get bitwardenJsonSshIconText() { return this.$('bitwardenJsonSshIconText'); }
  get bitwardenJsonSshText() { return this.$('bitwardenJsonSshText'); }
  get bitwardenJsonNote() { return this.$('bitwardenJsonNote'); }
  get bitwardenJsonNoteIcon() { return this.$('bitwardenJsonNoteIcon'); }
  get bitwardenJsonNoteIconText() { return this.$('bitwardenJsonNoteIconText'); }
  get bitwardenJsonNoteText() { return this.$('bitwardenJsonNoteText'); }
  get bitwardenJsonLogin() { return this.$('bitwardenJsonLogin'); }
  get bitwardenJsonLoginIcon() { return this.$('bitwardenJsonLoginIcon'); }
  get bitwardenJsonLoginIconText() { return this.$('bitwardenJsonLoginIconText'); }
  get bitwardenJsonLoginText() { return this.$('bitwardenJsonLoginText'); }
  get bitwardenJsonCredit() { return this.$('bitwardenJsonCredit'); }
  get bitwardenJsonCreditIcon() { return this.$('bitwardenJsonCreditIcon'); }
  get bitwardenJsonCreditIconText() { return this.$('bitwardenJsonCreditIconText'); }
  get bitwardenJsonCreditText() { return this.$('bitwardenJsonCreditText'); }
  get bitwardenJsonIdentity() { return this.$('bitwardenJsonIdentity'); }
  get bitwardenJsonIdentityIcon() { return this.$('bitwardenJsonIdentityIcon'); }
  get bitwardenJsonIdentityIconText() { return this.$('bitwardenJsonIdentityIconText'); }
  get bitwardenJsonIdentityText() { return this.$('bitwardenJsonIdentityText'); }
  get lastPassCsvName() { return this.$('lastPassCsvName'); }
  get lastPassCsvNameIcon() { return this.$('lastPassCsvNameIcon'); }
  get lastPassCsvNameIconText() { return this.$('lastPassCsvNameIconText'); }
  get lastPassCsvNameText() { return this.$('lastPassCsvNameText'); }
  get lastPassCsvSecure() { return this.$('lastPassCsvSecure'); }
  get lastPassCsvSecureIcon() { return this.$('lastPassCsvSecureIcon'); }
  get lastPassCsvSecureIconText() { return this.$('lastPassCsvSecureIconText'); }
  get lastPassCsvSecureText() { return this.$('lastPassCsvSecureText'); }
  get lastPassCsvItem() { return this.$('lastPassCsvItem'); }
  get lastPassCsvItemIcon() { return this.$('lastPassCsvItemIcon'); }
  get lastPassCsvItemIconText() { return this.$('lastPassCsvItemIconText'); }
  get lastPassCsvItemText() { return this.$('lastPassCsvItemText'); }
  get nordPassCsvCredit() { return this.$('nordPassCsvCredit'); }
  get nordPassCsvCreditIcon() { return this.$('nordPassCsvCreditIcon'); }
  get nordPassCsvCreditIconText() { return this.$('nordPassCsvCreditIconText'); }
  get nordPassCsvCreditText() { return this.$('nordPassCsvCreditText'); }
  get nordPassCsvGmail() { return this.$('nordPassCsvGmail'); }
  get nordPassCsvGmailIcon() { return this.$('nordPassCsvGmailIcon'); }
  get nordPassCsvGmailIconText() { return this.$('nordPassCsvGmailIconText'); }
  get nordPassCsvGmailText() { return this.$('nordPassCsvGmailText'); }
  get protonPassCsvIdentity() { return this.$('protonPassCsvIdentity'); }
  get protonPassCsvIdentityIcon() { return this.$('protonPassCsvIdentityIcon'); }
  get protonPassCsvIdentityIconText() { return this.$('protonPassCsvIdentityIconText'); }
  get protonPassCsvIdentityText() { return this.$('protonPassCsvIdentityText'); }
  get protonPassCsvIdentityText2() { return this.$('protonPassCsvIdentityText2'); }
  get protonPassCsvNote() { return this.$('protonPassCsvNote'); }
  get protonPassCsvNoteIcon() { return this.$('protonPassCsvNoteIcon'); }
  get protonPassCsvNoteIconText() { return this.$('protonPassCsvNoteIconText'); }
  get protonPassCsvNoteText() { return this.$('protonPassCsvNoteText'); }
  get protonPassCsvNoteText2() { return this.$('protonPassCsvNoteText2'); }
  get protonPassCsvLogin() { return this.$('protonPassCsvLogin'); }
  get protonPassCsvLoginIcon() { return this.$('protonPassCsvLoginIcon'); }
  get protonPassCsvLoginText2() { return this.$('protonPassCsvLoginText2'); }
  get protonPassCsvLoginText() { return this.$('protonPassCsvLoginText'); }
  get protonPassJsonIdentity() { return this.$('protonPassJsonIdentity'); }
  get protonPassJsonIdentityIcon() { return this.$('protonPassJsonIdentityIcon'); }
  get protonPassJsonIdentityIconText() { return this.$('protonPassJsonIdentityIconText'); }
  get protonPassJsonIdentityText() { return this.$('protonPassJsonIdentityText'); }
  get protonPassJsonNote() { return this.$('protonPassJsonNote'); }
  get protonPassJsonNoteIcon() { return this.$('protonPassJsonNoteIcon'); }
  get protonPassJsonNoteIconText() { return this.$('protonPassJsonNoteIconText'); }
  get protonPassJsonNoteText() { return this.$('protonPassJsonNoteText'); }
  get protonPassJsonLogin() { return this.$('protonPassJsonLogin'); }
  get protonPassJsonLoginIcon() { return this.$('protonPassJsonLoginIcon'); }
  get protonPassJsonLoginText() { return this.$('protonPassJsonLoginText'); }
  get protonPassJsonLoginText2() { return this.$('protonPassJsonLoginText2'); }
  get unencryptedFileCsvHecht() { return this.$('unencryptedFileCsvHecht'); }
  get unencryptedFileCsvHechtIcon() { return this.$('unencryptedFileCsvHechtIcon'); }
  get unencryptedFileCsvHechtIconText() { return this.$('unencryptedFileCsvHechtIconText'); }
  get unencryptedFileCsvHechtText() { return this.$('unencryptedFileCsvHechtText'); }
  get unencryptedFileCsvInc() { return this.$('unencryptedFileCsvInc'); }
  get unencryptedFileCsvIncIcon() { return this.$('unencryptedFileCsvIncIcon'); }
  get unencryptedFileCsvIncIconText() { return this.$('unencryptedFileCsvIncIconText'); }
  get unencryptedFileCsvIncText() { return this.$('unencryptedFileCsvIncText'); }
  get unencryptedFileJsonDisplayed() { return this.$('unencryptedFileJsonDisplayed'); }


  async verifyFavoriteFolder(): Promise<this> {
    await this.verifyDisplayedSoft('homeCurrentFolderName', 'Favorite folder name should be visible');
    
    const folderNameText = await this.currentFolderName.getText();
    expect(folderNameText).toBe('favorite');

    await this.verifyDisplayedSoft('homeCurrentFolderIcon', 'Favorite folder icon should be visible');

    return this.self;
  }

  async verifyTestFolder(): Promise<this> {
    await this.verifyDisplayedSoft('homeTestFolder', 'Test Folder name should be visible');
    
    const testFolderText = await this.homeTestFolder.getText();
    expect(testFolderText).toBe('Test Folder');

    await this.verifyDisplayedSoft('homeTestFolderIcon', 'Test Folder icon should be visible');

    return this.self;
  }

  async verifyTestFolder1(): Promise<this> {
    await this.verifyDisplayedSoft('homeTestFolder1', 'Test Folder1 name should be visible');
    
    const testFolder1Text = await this.homeTestFolder1.getText();
    expect(testFolder1Text).toBe('Test Folder1');

    await this.verifyDisplayedSoft('homeTestFolder1Icon', 'Test Folder1 icon should be visible');

    return this.self;
  }

  async tapHomeLogoLock(): Promise<this> {
    await this.homeLogoLock.click();
    return this.self;
  }

  async verifySearchFieldWithAllElementsVisible(): Promise<this> {
    const { inputPlaceholder } = HOME_SEARCH_FIELD;
    await this.verifyDisplayedSoft('searchField', 'Search field should be visible');
    await this.verifyDisplayedSoft('searchFieldIcon', 'Search field icon should be visible');
    await this.verifyDisplayedSoft('searchFieldInput', 'Search field input should be visible');
    const inputText = (await this.searchFieldInput.getText()).trim();
    const textAttr = (await this.searchFieldInput.getAttribute('text') ?? '').trim();
    const placeholderText = inputText || textAttr;
    expect(placeholderText).toBe(inputPlaceholder);
    return this.self;
  }

  /* ==================== CATEGORIES VERIFICATIONS ==================== */
  async verifyAllCategoriesVisible(): Promise<this> {
    const { buttonText } = HOME_CATEGORY_BUTTONS.all;
    await this.verifyDisplayedSoft('homeCategoryAllButton', 'All category button should be visible');
    await this.verifyDisplayedSoft('homeCategoryAllButtonIcon', 'All category button icon should be visible');
    await this.verifyDisplayedSoft('homeCategoryAllButtonText', 'All category button text should be visible');
    const text = await this.homeCategoryAllButtonText.getText();
    expect(text).toBe(buttonText);
    return this.self;
  }

  async verifyLoginsCategoryVisible(): Promise<this> {
    const { buttonText } = HOME_CATEGORY_BUTTONS.logins;
    await this.verifyDisplayedSoft('homeCategoryLoginsButton', 'Logins category button should be visible');
    await this.verifyDisplayedSoft('homeCategoryLoginsButtonIcon', 'Logins category button icon should be visible');
    await this.verifyDisplayedSoft('homeCategoryLoginsButtonText', 'Logins category button text should be visible');
    const text = await this.homeCategoryLoginsButtonText.getText();
    expect(text).toBe(buttonText);
    return this.self;
  }

  async verifyCreditCardsCategoryVisible(): Promise<this> {
    const { buttonText } = HOME_CATEGORY_BUTTONS.creditCards;
    await this.verifyDisplayedSoft('homeCategoryCreditCardsButton', 'Credit cards category button should be visible');
    await this.verifyDisplayedSoft('homeCategoryCreditCardsButtonIcon', 'Credit cards category button icon should be visible');
    await this.verifyDisplayedSoft('homeCategoryCreditCardsButtonText', 'Credit cards category button text should be visible');
    const text = await this.homeCategoryCreditCardsButtonText.getText();
    expect(text).toBe(buttonText);
    return this.self;
  }

  async verifyWifiCategoryVisible(): Promise<this> {
    const { buttonText } = HOME_CATEGORY_BUTTONS.wifi;
    await this.verifyDisplayedSoft('homeCategoryWifiButton', 'Wi-Fi category button should be visible');
    await this.verifyDisplayedSoft('homeCategoryWifiButtonIcon', 'Wi-Fi category button icon should be visible');
    await this.verifyDisplayedSoft('homeCategoryWifiButtonText', 'Wi-Fi category button text should be visible');
    const text = await this.homeCategoryWifiButtonText.getText();
    expect(text).toBe(buttonText);
    return this.self;
  }

  async verifyRecoveryPhraseCategoryVisible(): Promise<this> {
    const { buttonText } = HOME_CATEGORY_BUTTONS.recoveryPhrase;
    await this.verifyDisplayedSoft('homeCategoryRecoveryPhraseButton', 'Recovery phrase category button should be visible');
    await this.verifyDisplayedSoft('homeCategoryRecoveryPhraseButtonIcon', 'Recovery phrase category button icon should be visible');
    await this.verifyDisplayedSoft('homeCategoryRecoveryPhraseButtonText', 'Recovery phrase category button text should be visible');
    const text = await this.homeCategoryRecoveryPhraseButtonText.getText();
    expect(text).toBe(buttonText);
    return this.self;
  }

  async verifyIdentitiesCategoryVisible(): Promise<this> {
    const { buttonText } = HOME_CATEGORY_BUTTONS.identities;
    await this.verifyDisplayedSoft('homeCategoryIdentitiesButton', 'Identities category button should be visible');
    await this.verifyDisplayedSoft('homeCategoryIdentitiesButtonIcon', 'Identities category button icon should be visible');
    await this.verifyDisplayedSoft('homeCategoryIdentitiesButtonText', 'Identities category button text should be visible');
    const text = await this.homeCategoryIdentitiesButtonText.getText();
    expect(text).toBe(buttonText);
    return this.self;
  }

  async verifyNotesCategoryVisible(): Promise<this> {
    const { buttonText } = HOME_CATEGORY_BUTTONS.notes;
    await this.verifyDisplayedSoft('homeCategoryNotesButton', 'Notes category button should be visible');
    await this.verifyDisplayedSoft('homeCategoryNotesButtonIcon', 'Notes category button icon should be visible');
    await this.verifyDisplayedSoft('homeCategoryNotesButtonText', 'Notes category button text should be visible');
    const text = await this.homeCategoryNotesButtonText.getText();
    expect(text).toBe(buttonText);
    return this.self;
  }

  async verifyCustomCategoryVisible(): Promise<this> {
    const { buttonText } = HOME_CATEGORY_BUTTONS.custom;
    await this.verifyDisplayedSoft('homeCategoryCustomButton', 'Custom category button should be visible');
    await this.verifyDisplayedSoft('homeCategoryCustomButtonIcon', 'Custom category button icon should be visible');
    await this.verifyDisplayedSoft('homeCategoryCustomButtonText', 'Custom category button text should be visible');
    const text = await this.homeCategoryCustomButtonText.getText();
    expect(text).toBe(buttonText);
    return this.self;
  }

  async verifyLoginCreatedOnHomePageVisible(): Promise<this> {
    const { text } = LOGIN_CREATED_ON_HOME_PAGE;
    await this.loginCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Login created on home page should be visible' });
    await this.loginCreatedOnHomePageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Login created on home page icon should be visible' });
    await this.loginCreatedOnHomePageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Login created on home page text should be visible' });
    await this.loginCreatedOnHomePageThreeDotsButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Login created on home page three dots button should be visible' });
    const textActual = (await this.loginCreatedOnHomePageText.getText()) ?? (await this.loginCreatedOnHomePageText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyNewTitleLoginItemPageVisible(): Promise<this> {
    const { newTitle } = CREATE_LOGIN_ENTERED_FIELDS;
    await this.newLoginCreatedOnHomePageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New title login item on home page should be visible' });
    const textActual = (await this.newLoginCreatedOnHomePageText.getText()) ?? (await this.newLoginCreatedOnHomePageText.getAttribute('text')) ?? '';
    expect(textActual).toBe(newTitle);
    return this.self;
  }

  async verifyCreditCardCreatedOnHomePageVisible(): Promise<this> {
    const { text } = CREDIT_CARD_CREATED_ON_HOME_PAGE;
    await this.creditCardCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Credit card created on home page should be visible' });
    await this.creditCardCreatedOnHomePageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Credit card created on home page icon should be visible' });
    await this.creditCardCreatedOnHomePageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Credit card created on home page text should be visible' });
    await this.creditCardCreatedOnHomePageThreeDotsButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Credit card created on home page three dots button should be visible' });
    const textActual = (await this.creditCardCreatedOnHomePageText.getText()) ?? (await this.creditCardCreatedOnHomePageText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyWifiCreatedOnHomePageVisible(): Promise<this> {
    const { text } = WIFI_CREATED_ON_HOME_PAGE;
    await this.wifiCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi created on home page should be visible' });
    await this.wifiCreatedOnHomePageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi created on home page icon should be visible' });
    await this.wifiCreatedOnHomePageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi created on home page text should be visible' });
    await this.wifiCreatedOnHomePageThreeDotsButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi created on home page three dots button should be visible' });
    const textActual = (await this.wifiCreatedOnHomePageText.getText()) ?? (await this.wifiCreatedOnHomePageText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyRecoveryPhraseCreatedOnHomePageVisible(): Promise<this> {
    const { text } = RECOVERY_PHRASE_CREATED_ON_HOME_PAGE;
    await this.recoveryPhraseCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase created on home page should be visible' });
    await this.recoveryPhraseCreatedOnHomePageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase created on home page icon should be visible' });
    await this.recoveryPhraseCreatedOnHomePageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase created on home page text should be visible' });
    await this.recoveryPhraseCreatedOnHomePageThreeDotsButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase created on home page three dots button should be visible' });
    const textActual = (await this.recoveryPhraseCreatedOnHomePageText.getText()) ?? (await this.recoveryPhraseCreatedOnHomePageText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyNoteCreatedOnHomePageVisible(): Promise<this> {
    const { text } = NOTE_CREATED_ON_HOME_PAGE;
    await this.noteCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note created on home page should be visible' });
    await this.noteCreatedOnHomePageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note created on home page icon should be visible' });
    await this.noteCreatedOnHomePageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note created on home page text should be visible' });
    await this.noteCreatedOnHomePageThreeDotsButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note created on home page three dots button should be visible' });
    const textActual = (await this.noteCreatedOnHomePageText.getText()) ?? (await this.noteCreatedOnHomePageText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyCustomElementCreatedOnHomePageVisible(): Promise<this> {
    const { text } = CUSTOM_ELEMENT_CREATED_ON_HOME_PAGE;
    await this.customElementCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom element created on home page should be visible' });
    await this.customElementCreatedOnHomePageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom element created on home page icon should be visible' });
    await this.customElementCreatedOnHomePageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom element created on home page text should be visible' });
    await this.customElementCreatedOnHomePageThreeDotsButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom element created on home page three dots button should be visible' });
    const textActual = (await this.customElementCreatedOnHomePageText.getText()) ?? (await this.customElementCreatedOnHomePageText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyIdentityCreatedOnHomePageVisible(): Promise<this> {
    const { text } = IDENTITY_CREATED_ON_HOME_PAGE;
    await this.identityCreatedOnHomePage.waitForDisplayed({ timeout: 30000, timeoutMsg: 'Identity created on home page should be visible' });
    await this.identityCreatedOnHomePageIcon.waitForDisplayed({ timeout: 30000, timeoutMsg: 'Identity created on home page icon should be visible' });
    await this.identityCreatedOnHomePageText.waitForDisplayed({ timeout: 30000, timeoutMsg: 'Identity created on home page text should be visible' });
    await this.identityCreatedOnHomePageThreeDotsButton.waitForDisplayed({ timeout: 30000, timeoutMsg: 'Identity created on home page three dots button should be visible' });
    const textActual = (await this.identityCreatedOnHomePageText.getText()) ?? (await this.identityCreatedOnHomePageText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  /* ==================== EMPTY COLLECTION TEXT VERIFICATIONS ==================== */
  async verifyEmptyCollectionTextVisible(): Promise<this> {
    const { emptyCollectionTitle, emptyCollectionSubtitle } = HOME_SCREEN;
    await this.verifyDisplayedSoft('emptyCollectionText', 'Empty collection title should be visible');
    await this.verifyDisplayedSoft('emptyCollectionSubtitleText', 'Empty collection subtitle should be visible');
    const titleText = await this.emptyCollectionText.getText();
    expect(titleText).toBe(emptyCollectionTitle);
    const subtitleText = await this.emptyCollectionSubtitleText.getText();
    expect(subtitleText).toBe(emptyCollectionSubtitle);
    return this.self;
  }

  /* ==================== CREATE ITEM BUTTONS VERIFICATIONS ==================== */
  async verifyCreateLoginButtonVisible(): Promise<this> {
    const expectedText = CREATE_ITEM_BUTTONS.createLogin;
    await this.verifyDisplayedSoft('createLoginButton', 'Create a login button should be visible');
    await this.verifyDisplayedSoft('createLoginButtonIcon', 'Create a login button icon should be visible');
    await this.verifyDisplayedSoft('createLoginButtonText', 'Create a login button text should be visible');
    const buttonText = await this.createLoginButtonText.getText();
    expect(buttonText).toBe(expectedText);
    return this.self;
  }

  async verifyCreateIdentityButtonVisible(): Promise<this> {
    const expectedText = CREATE_ITEM_BUTTONS.createIdentity;
    await this.verifyDisplayedSoft('createIdentityButton', 'Create an identity button should be visible');
    await this.verifyDisplayedSoft('createIdentityButtonIcon', 'Create an identity button icon should be visible');
    await this.verifyDisplayedSoft('createIdentityButtonText', 'Create an identity button text should be visible');
    const buttonText = await this.createIdentityButtonText.getText();
    expect(buttonText).toBe(expectedText);
    return this.self;
  }

  async verifyCreateCreditCardButtonVisible(): Promise<this> {
    const expectedText = CREATE_ITEM_BUTTONS.createCreditCard;
    await this.verifyDisplayedSoft('createCreditCardButton', 'Create a credit card button should be visible');
    await this.verifyDisplayedSoft('createCreditCardButtonIcon', 'Create a credit card button icon should be visible');
    await this.verifyDisplayedSoft('createCreditCardButtonText', 'Create a credit card button text should be visible');
    const buttonText = await this.createCreditCardButtonText.getText();
    expect(buttonText).toBe(expectedText);
    return this.self;
  }

  async verifyCreateWifiPasswordButtonVisible(): Promise<this> {
    const expectedText = CREATE_ITEM_BUTTONS.createWifiPassword;
    await this.verifyDisplayedSoft('createWifiPasswordButton', 'Create a Wi-Fi password button should be visible');
    await this.verifyDisplayedSoft('createWifiPasswordButtonIcon', 'Create a Wi-Fi password button icon should be visible');
    await this.verifyDisplayedSoft('createWifiPasswordButtonText', 'Create a Wi-Fi password button text should be visible');
    const buttonText = await this.createWifiPasswordButtonText.getText();
    expect(buttonText).toBe(expectedText);
    return this.self;
  }

  async verifySaveRecoveryPhraseButtonVisible(): Promise<this> {
    const expectedText = CREATE_ITEM_BUTTONS.saveRecoveryPhrase;
    await this.verifyDisplayedSoft('saveRecoveryPhraseButton', 'Save a Recovery phrase button should be visible');
    await this.verifyDisplayedSoft('saveRecoveryPhraseButtonIcon', 'Save a Recovery phrase button icon should be visible');
    await this.verifyDisplayedSoft('saveRecoveryPhraseButtonText', 'Save a Recovery phrase button text should be visible');
    const buttonText = await this.saveRecoveryPhraseButtonText.getText();
    expect(buttonText).toBe(expectedText);
    return this.self;
  }

  async verifyCreateNoteButtonVisible(): Promise<this> {
    const expectedText = CREATE_ITEM_BUTTONS.createNote;
    await this.verifyDisplayedSoft('createNoteButton', 'Create a note button should be visible');
    await this.verifyDisplayedSoft('createNoteButtonIcon', 'Create a note button icon should be visible');
    await this.verifyDisplayedSoft('createNoteButtonText', 'Create a note button text should be visible');
    const buttonText = await this.createNoteButtonText.getText();
    expect(buttonText).toBe(expectedText);
    return this.self;
  }

  async verifyCreateCustomElementButtonVisible(): Promise<this> {
    const expectedText = CREATE_ITEM_BUTTONS.createCustomElement;
    await this.verifyDisplayedSoft('createCustomElementButton', 'Create a custom element button should be visible');
    await this.verifyDisplayedSoft('createCustomElementButtonIcon', 'Create a custom element button icon should be visible');
    await this.verifyDisplayedSoft('createCustomElementButtonText', 'Create a custom element button text should be visible');
    const buttonText = await this.createCustomElementButtonText.getText();
    expect(buttonText).toBe(expectedText);
    return this.self;
  }

  /* ==================== HOME PAGE LOADED VERIFICATIONS ==================== */
  async waitForHomePageLoaded(timeout: number = 20000): Promise<this> {
    await this.homeLogoLock.waitForDisplayed({ timeout, timeoutMsg: 'Home page logo lock not visible' });
    return this.self;
  }

  async verifyHomeLogoLockVisible(): Promise<this> {
    await this.homeLogoLock.waitForDisplayed({ timeout: 20000, timeoutMsg: 'Home logo lock not visible after waiting' });
    await this.verifyDisplayedSoft('homeLogoLock', 'Home logo lock should be visible');
    return this.self;
  }

  async tapSystemHomeButton(): Promise<this> {
    await super.tapSystemHomeButton();
    return this.self;
  }

  async tapBottomNavHomeTab(): Promise<this> {
    await this.bottomNavHomeTab.click();
    return this.self;
  }

  async tapBottomNavSettingsTab(): Promise<this> {
    await this.bottomNavSettingsTab.click();
    return this.self;
  }

  async tapCreateItemButton(): Promise<this> {
    await this.bottomNavCreateButton.click();
    return this.self;
  }

  async tapAllCategory(): Promise<this> {
    await this.homeCategoryAllButton.click();
    return this.self;
  }

  async tapLoginsCategory(): Promise<this> {
    await this.homeCategoryLoginsButton.click();
    return this.self;
  }

  async tapCreditCardsCategory(): Promise<this> {
    await this.homeCategoryCreditCardsButton.click();
    return this.self;
  }

  async tapCreditCardsCategoryButton(): Promise<this> {
    await this.homeCategoryCreditCardsButton.click();
    return this.self;
  }

  async tapWifiCategory(): Promise<this> {
    await this.homeCategoryWifiButton.click();
    return this.self;
  }

  async tapRecoveryPhraseCategory(): Promise<this> {
    await this.homeCategoryRecoveryPhraseButton.click();
    return this.self;
  }

  async tapIdentitiesCategory(): Promise<this> {
    await this.homeCategoryIdentitiesButton.click();
    return this.self;
  }

  async tapNotesCategory(): Promise<this> {
    await this.homeCategoryNotesButton.click();
    return this.self;
  }

  async tapCustomCategory(): Promise<this> {
    await this.homeCategoryCustomButton.click();
    return this.self;
  }

  async tapCreateLoginButton(): Promise<this> {
    await this.createLoginButton.click();
    return this.self;
  }

  async tapCreateCreditCardButton(): Promise<this> {
    await this.createCreditCardButton.click();
    return this.self;
  }

  async tapCreateWifiPasswordButton(): Promise<this> {
    await this.createWifiPasswordButton.click();
    return this.self;
  }

  async tapSaveRecoveryPhraseButton(): Promise<this> {
    await this.saveRecoveryPhraseButton.click();
    return this.self;
  }

  async tapCreateNoteButton(): Promise<this> {
    await this.createNoteButton.click();
    return this.self;
  }

  async tapCreateIdentityButton(): Promise<this> {
    await this.createIdentityButton.click();
    return this.self;
  }

  async tapLoginsField(): Promise<this> {
    await this.loginsField.click();
    return this.self;
  }

  async tapCreditCardsField(): Promise<this> {
    await this.creditCardsField.click();
    return this.self;
  }

  async tapWifiField(): Promise<this> {
    await this.wifiField.click();
    return this.self;
  }

  async tapRecoveryPhraseField(): Promise<this> {
    await this.recoveryPhraseField.click();
    return this.self;
  }

  async tapIdentitiesField(): Promise<this> {
    await this.identitiesField.click();
    return this.self;
  }

  async tapNotesField(): Promise<this> {
    await this.notesField.click();
    return this.self;
  }

  async tapCustomElementField(): Promise<this> {
    await this.customField.click();
    return this.self;
  }

  async tapCreateCustomElementButton(): Promise<this> {
    await this.createCustomElementButton.click();
    return this.self;
  }

  async tapPasswordField(): Promise<this> {
    await this.passwordField.click();
    return this.self;
  }

  async waitForCreateItemPopupVisible(timeout = 10000): Promise<this> {
    await this.createItemPopup.waitForDisplayed({
      timeout,
      timeoutMsg: 'Create item popup not visible',
    });
    return this.self;
  }

  /* ==================== CREATE ITEM POPUP FIELDS VERIFICATIONS ==================== */
  async verifyLoginsFieldVisible(): Promise<this> {
    const { title, text } = CREATE_ITEM_POPUP_FIELDS.logins;
    await this.verifyDisplayedSoft('loginsField', 'Logins field should be visible');
    await this.verifyDisplayedSoft('loginsFieldIcon', 'Logins field icon should be visible');
    await this.verifyDisplayedSoft('loginsFieldIcon2', 'Logins field icon 2 should be visible');
    await this.verifyDisplayedSoft('loginsFieldTitle', 'Logins field title should be visible');
    await this.verifyDisplayedSoft('loginsFieldText', 'Logins field text should be visible');
    const titleText = await this.loginsFieldTitle.getText();
    expect(titleText).toBe(title);
    const fieldText = await this.loginsFieldText.getText();
    expect(fieldText).toBe(text);
    return this.self;
  }

  async verifyCreditCardsFieldVisible(): Promise<this> {
    const { title, text } = CREATE_ITEM_POPUP_FIELDS.creditCards;
    await this.verifyDisplayedSoft('creditCardsField', 'Credit cards field should be visible');
    await this.verifyDisplayedSoft('creditCardsFieldIcon', 'Credit cards field icon should be visible');
    await this.verifyDisplayedSoft('creditCardsFieldIcon2', 'Credit cards field icon 2 should be visible');
    await this.verifyDisplayedSoft('creditCardsFieldTitle', 'Credit cards field title should be visible');
    await this.verifyDisplayedSoft('creditCardsFieldText', 'Credit cards field text should be visible');
    const titleText = await this.creditCardsFieldTitle.getText();
    expect(titleText).toBe(title);
    const fieldText = await this.creditCardsFieldText.getText();
    expect(fieldText).toBe(text);
    return this.self;
  }

  async verifyWifiFieldVisible(): Promise<this> {
    const { title, text } = CREATE_ITEM_POPUP_FIELDS.wifi;
    await this.verifyDisplayedSoft('wifiField', 'Wi-Fi field should be visible');
    await this.verifyDisplayedSoft('wifiFieldIcon', 'Wi-Fi field icon should be visible');
    await this.verifyDisplayedSoft('wifiFieldIcon2', 'Wi-Fi field icon 2 should be visible');
    await this.verifyDisplayedSoft('wifiFieldTitle', 'Wi-Fi field title should be visible');
    await this.verifyDisplayedSoft('wifiFieldText', 'Wi-Fi field text should be visible');
    const titleText = await this.wifiFieldTitle.getText();
    expect(titleText).toBe(title);
    const fieldText = await this.wifiFieldText.getText();
    expect(fieldText).toBe(text);
    return this.self;
  }

  async verifyRecoveryPhraseFieldVisible(): Promise<this> {
    const { title, text } = CREATE_ITEM_POPUP_FIELDS.recoveryPhrase;
    await this.verifyDisplayedSoft('recoveryPhraseField', 'Recovery phrase field should be visible');
    await this.verifyDisplayedSoft('recoveryPhraseFieldIcon', 'Recovery phrase field icon should be visible');
    await this.verifyDisplayedSoft('recoveryPhraseFieldIcon2', 'Recovery phrase field icon 2 should be visible');
    await this.verifyDisplayedSoft('recoveryPhraseFieldTitle', 'Recovery phrase field title should be visible');
    await this.verifyDisplayedSoft('recoveryPhraseFieldText', 'Recovery phrase field text should be visible');
    const titleText = await this.recoveryPhraseFieldTitle.getText();
    expect(titleText).toBe(title);
    const fieldText = await this.recoveryPhraseFieldText.getText();
    expect(fieldText).toBe(text);
    return this.self;
  }

  async verifyIdentitiesFieldVisible(): Promise<this> {
    const { title, text } = CREATE_ITEM_POPUP_FIELDS.identities;
    await this.verifyDisplayedSoft('identitiesField', 'Identities field should be visible');
    await this.verifyDisplayedSoft('identitiesFieldIcon', 'Identities field icon should be visible');
    await this.verifyDisplayedSoft('identitiesFieldIcon2', 'Identities field icon 2 should be visible');
    await this.verifyDisplayedSoft('identitiesFieldTitle', 'Identities field title should be visible');
    await this.verifyDisplayedSoft('identitiesFieldText', 'Identities field text should be visible');
    const titleText = await this.identitiesFieldTitle.getText();
    expect(titleText).toBe(title);
    const fieldText = await this.identitiesFieldText.getText();
    expect(fieldText).toBe(text);
    return this.self;
  }

  async verifyNotesFieldVisible(): Promise<this> {
    const { title, text } = CREATE_ITEM_POPUP_FIELDS.notes;
    await this.verifyDisplayedSoft('notesField', 'Notes field should be visible');
    await this.verifyDisplayedSoft('notesFieldIcon', 'Notes field icon should be visible');
    await this.verifyDisplayedSoft('notesFieldIcon2', 'Notes field icon 2 should be visible');
    await this.verifyDisplayedSoft('notesFieldTitle', 'Notes field title should be visible');
    await this.verifyDisplayedSoft('notesFieldText', 'Notes field text should be visible');
    const titleText = await this.notesFieldTitle.getText();
    expect(titleText).toBe(title);
    const fieldText = await this.notesFieldText.getText();
    expect(fieldText).toBe(text);
    return this.self;
  }

  async verifyCustomFieldVisible(): Promise<this> {
    const { title, text } = CREATE_ITEM_POPUP_FIELDS.custom;
    await this.verifyDisplayedSoft('customField', 'Custom field should be visible');
    await this.verifyDisplayedSoft('customFieldIcon', 'Custom field icon should be visible');
    await this.verifyDisplayedSoft('customFieldIcon2', 'Custom field icon 2 should be visible');
    await this.verifyDisplayedSoft('customFieldTitle', 'Custom field title should be visible');
    await this.verifyDisplayedSoft('customFieldText', 'Custom field text should be visible');
    const titleText = await this.customFieldTitle.getText();
    expect(titleText).toBe(title);
    const fieldText = await this.customFieldText.getText();
    expect(fieldText).toBe(text);
    return this.self;
  }

  async verifyPasswordFieldVisible(): Promise<this> {
    const { title, text } = CREATE_ITEM_POPUP_FIELDS.password;
    await this.verifyDisplayedSoft('passwordField', 'Password field should be visible');
    await this.verifyDisplayedSoft('passwordFieldIcon', 'Password field icon should be visible');
    await this.verifyDisplayedSoft('passwordFieldIcon2', 'Password field icon 2 should be visible');
    await this.verifyDisplayedSoft('passwordFieldTitle', 'Password field title should be visible');
    await this.verifyDisplayedSoft('passwordFieldText', 'Password field text should be visible');
    const titleText = await this.passwordFieldTitle.getText();
    expect(titleText).toBe(title);
    const fieldText = await this.passwordFieldText.getText();
    expect(fieldText).toBe(text);
    return this.self;
  }

  /* ==================== IMPORTED ITEMS VERIFICATIONS ==================== */
  async verifyOnePasswordAccountDisplayed(): Promise<this> {
    // Verify 1Password Account
    await this.verifyDisplayedSoft('onePasswordAccount', '1Password account should be visible');
    
    // Verify Account Icon
    await this.verifyDisplayedSoft('onePasswordAccountIcon', '1Password account icon should be visible');
    
    // Verify Account Icon Text
    await this.verifyDisplayedSoft('onePasswordAccountIconText', '1Password account icon text should be visible');
    const iconText = await this.onePasswordAccountIconText.getText();
    expect(iconText).toBe(IMPORTED_ACCOUNTS.onePassword.iconText);
    
    // Verify Account Text
    await this.verifyDisplayedSoft('onePasswordAccountText', '1Password account text should be visible');
    const accountText = await this.onePasswordAccountText.getText();
    expect(accountText).toBe(IMPORTED_ACCOUNTS.onePassword.accountText);
    
    return this.self;
  }

  async verifyOnePasswordPasswordDisplayed(): Promise<this> {
    // Verify 1Password Password
    await this.verifyDisplayedSoft('onePasswordPassword', '1Password password should be visible');
    
    // Verify Password Icon
    await this.verifyDisplayedSoft('onePasswordPasswordIcon', '1Password password icon should be visible');
    
    // Verify Password Icon Text
    await this.verifyDisplayedSoft('onePasswordPasswordIconText', '1Password password icon text should be visible');
    const iconText = await this.onePasswordPasswordIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.onePasswordPassword.iconText);
    
    // Verify Password Text
    await this.verifyDisplayedSoft('onePasswordPasswordText', '1Password password text should be visible');
    const passwordText = await this.onePasswordPasswordText.getText();
    expect(passwordText).toBe(IMPORTED_ITEMS.onePasswordPassword.passwordText);
    
    return this.self;
  }

  async verifyOnePasswordLoginDisplayed(): Promise<this> {
    // Verify 1Password Login
    await this.verifyDisplayedSoft('onePasswordLogin', '1Password login should be visible');
    
    // Verify Login Icon
    await this.verifyDisplayedSoft('onePasswordLoginIcon', '1Password login icon should be visible');
    
    // Verify Login Text
    await this.verifyDisplayedSoft('onePasswordLoginText', '1Password login text should be visible');
    const loginText = await this.onePasswordLoginText.getText();
    expect(loginText).toBe(IMPORTED_ITEMS.onePasswordLogin.loginText);
    
    return this.self;
  }

  async verifyBitwardenCsvNoteDisplayed(): Promise<this> {
    // Verify Bitwarden Note
    await this.verifyDisplayedSoft('bitwardenNote', 'Bitwarden note should be visible');
    
    // Verify Note Icon
    await this.verifyDisplayedSoft('bitwardenNoteIcon', 'Bitwarden note icon should be visible');
    
    // Verify Note Icon Text
    await this.verifyDisplayedSoft('bitwardenNoteIconText', 'Bitwarden note icon text should be visible');
    const iconText = await this.bitwardenNoteIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenNote.iconText);
    
    // Verify Note Text
    await this.verifyDisplayedSoft('bitwardenNoteText', 'Bitwarden note text should be visible');
    const noteText = await this.bitwardenNoteText.getText();
    expect(noteText).toBe(IMPORTED_ITEMS.bitwardenNote.noteText);
    
    return this.self;
  }

  async verifyBitwardenCsvLoginDisplayed(): Promise<this> {
    // Verify Bitwarden Login
    await this.verifyDisplayedSoft('bitwardenLogin', 'Bitwarden login should be visible');
    
    // Verify Login Icon
    await this.verifyDisplayedSoft('bitwardenLoginIcon', 'Bitwarden login icon should be visible');
    
    // Verify Login Icon Text
    await this.verifyDisplayedSoft('bitwardenLoginIconText', 'Bitwarden login icon text should be visible');
    const iconText = await this.bitwardenLoginIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenLogin.iconText);
    
    // Verify Login Text
    await this.verifyDisplayedSoft('bitwardenLoginText', 'Bitwarden login text should be visible');
    const loginText = await this.bitwardenLoginText.getText();
    expect(loginText).toBe(IMPORTED_ITEMS.bitwardenLogin.loginText);
    
    return this.self;
  }

  async verifyBitwardenJsonSshDisplayed(): Promise<this> {
    // Verify Bitwarden JSON SSH
    await this.verifyDisplayedSoft('bitwardenJsonSsh', 'Bitwarden JSON SSH should be visible');
    
    // Verify SSH Icon
    await this.verifyDisplayedSoft('bitwardenJsonSshIcon', 'Bitwarden JSON SSH icon should be visible');
    
    // Verify SSH Icon Text
    await this.verifyDisplayedSoft('bitwardenJsonSshIconText', 'Bitwarden JSON SSH icon text should be visible');
    const iconText = await this.bitwardenJsonSshIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenJsonSsh.iconText);
    
    // Verify SSH Text
    await this.verifyDisplayedSoft('bitwardenJsonSshText', 'Bitwarden JSON SSH text should be visible');
    const sshText = await this.bitwardenJsonSshText.getText();
    expect(sshText).toBe(IMPORTED_ITEMS.bitwardenJsonSsh.sshText);
    
    return this.self;
  }

  async verifyBitwardenJsonNoteDisplayed(): Promise<this> {
    // Verify Bitwarden JSON Note
    await this.verifyDisplayedSoft('bitwardenJsonNote', 'Bitwarden JSON note should be visible');
    
    // Verify Note Icon
    await this.verifyDisplayedSoft('bitwardenJsonNoteIcon', 'Bitwarden JSON note icon should be visible');
    
    // Verify Note Icon Text
    await this.verifyDisplayedSoft('bitwardenJsonNoteIconText', 'Bitwarden JSON note icon text should be visible');
    const iconText = await this.bitwardenJsonNoteIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenJsonNote.iconText);
    
    // Verify Note Text
    await this.verifyDisplayedSoft('bitwardenJsonNoteText', 'Bitwarden JSON note text should be visible');
    const noteText = await this.bitwardenJsonNoteText.getText();
    expect(noteText).toBe(IMPORTED_ITEMS.bitwardenJsonNote.noteText);
    
    return this.self;
  }

  async verifyBitwardenJsonLoginDisplayed(): Promise<this> {
    // Verify Bitwarden JSON Login
    await this.verifyDisplayedSoft('bitwardenJsonLogin', 'Bitwarden JSON login should be visible');
    
    // Verify Login Icon
    await this.verifyDisplayedSoft('bitwardenJsonLoginIcon', 'Bitwarden JSON login icon should be visible');
    
    // Verify Login Icon Text
    await this.verifyDisplayedSoft('bitwardenJsonLoginIconText', 'Bitwarden JSON login icon text should be visible');
    const iconText = await this.bitwardenJsonLoginIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenJsonLogin.iconText);
    
    // Verify Login Text
    await this.verifyDisplayedSoft('bitwardenJsonLoginText', 'Bitwarden JSON login text should be visible');
    const loginText = await this.bitwardenJsonLoginText.getText();
    expect(loginText).toBe(IMPORTED_ITEMS.bitwardenJsonLogin.loginText);
    
    return this.self;
  }

  async verifyBitwardenJsonCreditDisplayed(): Promise<this> {
    // Verify Bitwarden JSON Credit
    await this.verifyDisplayedSoft('bitwardenJsonCredit', 'Bitwarden JSON credit should be visible');
    
    // Verify Credit Icon
    await this.verifyDisplayedSoft('bitwardenJsonCreditIcon', 'Bitwarden JSON credit icon should be visible');
    
    // Verify Credit Icon Text
    await this.verifyDisplayedSoft('bitwardenJsonCreditIconText', 'Bitwarden JSON credit icon text should be visible');
    const iconText = await this.bitwardenJsonCreditIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenJsonCredit.iconText);
    
    // Verify Credit Text
    await this.verifyDisplayedSoft('bitwardenJsonCreditText', 'Bitwarden JSON credit text should be visible');
    const creditText = await this.bitwardenJsonCreditText.getText();
    expect(creditText).toBe(IMPORTED_ITEMS.bitwardenJsonCredit.creditText);
    
    return this.self;
  }

  async verifyBitwardenJsonIdentityDisplayed(): Promise<this> {
    // Verify Bitwarden JSON Identity
    await this.verifyDisplayedSoft('bitwardenJsonIdentity', 'Bitwarden JSON identity should be visible');
    
    // Verify Identity Icon
    await this.verifyDisplayedSoft('bitwardenJsonIdentityIcon', 'Bitwarden JSON identity icon should be visible');
    
    // Verify Identity Icon Text
    await this.verifyDisplayedSoft('bitwardenJsonIdentityIconText', 'Bitwarden JSON identity icon text should be visible');
    const iconText = await this.bitwardenJsonIdentityIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenJsonIdentity.iconText);
    
    // Verify Identity Text
    await this.verifyDisplayedSoft('bitwardenJsonIdentityText', 'Bitwarden JSON identity text should be visible');
    const identityText = await this.bitwardenJsonIdentityText.getText();
    expect(identityText).toBe(IMPORTED_ITEMS.bitwardenJsonIdentity.identityText);
    
    return this.self;
  }

  async verifyLastPassCsvNameDisplayed(): Promise<this> {
    // Verify LastPass CSV Name
    await this.verifyDisplayedSoft('lastPassCsvName', 'LastPass CSV name should be visible');
    
    // Verify Name Icon
    await this.verifyDisplayedSoft('lastPassCsvNameIcon', 'LastPass CSV name icon should be visible');
    
    // Verify Name Icon Text
    await this.verifyDisplayedSoft('lastPassCsvNameIconText', 'LastPass CSV name icon text should be visible');
    const iconText = await this.lastPassCsvNameIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.lastPassCsvName.iconText);
    
    // Verify Name Text
    await this.verifyDisplayedSoft('lastPassCsvNameText', 'LastPass CSV name text should be visible');
    const nameText = await this.lastPassCsvNameText.getText();
    expect(nameText).toBe(IMPORTED_ITEMS.lastPassCsvName.nameText);
    
    return this.self;
  }

  async verifyLastPassCsvSecureDisplayed(): Promise<this> {
    // Verify LastPass CSV Secure
    await this.verifyDisplayedSoft('lastPassCsvSecure', 'LastPass CSV secure should be visible');
    
    // Verify Secure Icon
    await this.verifyDisplayedSoft('lastPassCsvSecureIcon', 'LastPass CSV secure icon should be visible');
    
    // Verify Secure Icon Text
    await this.verifyDisplayedSoft('lastPassCsvSecureIconText', 'LastPass CSV secure icon text should be visible');
    const iconText = await this.lastPassCsvSecureIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.lastPassCsvSecure.iconText);
    
    // Verify Secure Text
    await this.verifyDisplayedSoft('lastPassCsvSecureText', 'LastPass CSV secure text should be visible');
    const secureText = await this.lastPassCsvSecureText.getText();
    expect(secureText).toBe(IMPORTED_ITEMS.lastPassCsvSecure.secureText);
    
    return this.self;
  }

  async verifyLastPassCsvItemDisplayed(): Promise<this> {
    // Verify LastPass CSV Item
    await this.verifyDisplayedSoft('lastPassCsvItem', 'LastPass CSV item should be visible');
    
    // Verify Item Icon
    await this.verifyDisplayedSoft('lastPassCsvItemIcon', 'LastPass CSV item icon should be visible');
    
    // Verify Item Icon Text
    await this.verifyDisplayedSoft('lastPassCsvItemIconText', 'LastPass CSV item icon text should be visible');
    const iconText = await this.lastPassCsvItemIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.lastPassCsvItem.iconText);
    
    // Verify Item Text
    await this.verifyDisplayedSoft('lastPassCsvItemText', 'LastPass CSV item text should be visible');
    const itemText = await this.lastPassCsvItemText.getText();
    expect(itemText).toBe(IMPORTED_ITEMS.lastPassCsvItem.itemText);
    
    return this.self;
  }

  async verifyNordPassCsvCreditDisplayed(): Promise<this> {
    // Verify NordPass CSV Credit
    await this.verifyDisplayedSoft('nordPassCsvCredit', 'NordPass CSV credit should be visible');
    
    // Verify Credit Icon
    await this.verifyDisplayedSoft('nordPassCsvCreditIcon', 'NordPass CSV credit icon should be visible');
    
    // Verify Credit Icon Text
    await this.verifyDisplayedSoft('nordPassCsvCreditIconText', 'NordPass CSV credit icon text should be visible');
    const iconText = await this.nordPassCsvCreditIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.nordPassCsvCredit.iconText);
    
    // Verify Credit Text
    await this.verifyDisplayedSoft('nordPassCsvCreditText', 'NordPass CSV credit text should be visible');
    const creditText = await this.nordPassCsvCreditText.getText();
    expect(creditText).toBe(IMPORTED_ITEMS.nordPassCsvCredit.creditText);
    
    return this.self;
  }

  async verifyNordPassCsvGmailDisplayed(): Promise<this> {
    // Verify NordPass CSV Gmail
    await this.verifyDisplayedSoft('nordPassCsvGmail', 'NordPass CSV Gmail should be visible');
    
    // Verify Gmail Icon
    await this.verifyDisplayedSoft('nordPassCsvGmailIcon', 'NordPass CSV Gmail icon should be visible');
    
    // Verify Gmail Text
    await this.verifyDisplayedSoft('nordPassCsvGmailText', 'NordPass CSV Gmail text should be visible');
    const gmailText = await this.nordPassCsvGmailText.getText();
    expect(gmailText).toBe(IMPORTED_ITEMS.nordPassCsvGmail.gmailText);
    
    return this.self;
  }

  async verifyProtonPassCsvNoteDisplayed(): Promise<this> {
    // Verify ProtonPass CSV Note
    await this.verifyDisplayedSoft('protonPassCsvNote', 'ProtonPass CSV note should be visible');
    
    return this.self;
  }

  async verifyProtonPassCsvIdentityDisplayed(): Promise<this> {
    // Verify ProtonPass CSV Identity
    await this.verifyDisplayedSoft('protonPassCsvIdentity', 'ProtonPass CSV identity should be visible');
    
    return this.self;
  }

  async verifyProtonPassCsvLoginDisplayed(): Promise<this> {
    // Verify ProtonPass CSV Login
    await this.verifyDisplayedSoft('protonPassCsvLogin', 'ProtonPass CSV login should be visible');
    
    return this.self;
  }

  async verifyProtonPassJsonIdentityDisplayed(): Promise<this> {
    // Verify ProtonPass JSON Identity
    await this.verifyDisplayedSoft('protonPassJsonIdentity', 'ProtonPass JSON identity should be visible');
    
    // Verify Identity Icon
    await this.verifyDisplayedSoft('protonPassJsonIdentityIcon', 'ProtonPass JSON identity icon should be visible');
    
    // Verify Identity Icon Text
    await this.verifyDisplayedSoft('protonPassJsonIdentityIconText', 'ProtonPass JSON identity icon text should be visible');
    const iconText = await this.protonPassJsonIdentityIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.protonPassJsonIdentity.iconText);
    
    // Verify Identity Text
    await this.verifyDisplayedSoft('protonPassJsonIdentityText', 'ProtonPass JSON identity text should be visible');
    const identityText = await this.protonPassJsonIdentityText.getText();
    expect(identityText).toBe(IMPORTED_ITEMS.protonPassJsonIdentity.identityText);
    
    return this.self;
  }

  async verifyProtonPassJsonNoteDisplayed(): Promise<this> {
    // Verify ProtonPass JSON Note
    await this.verifyDisplayedSoft('protonPassJsonNote', 'ProtonPass JSON note should be visible');
    
    // Verify Note Icon
    await this.verifyDisplayedSoft('protonPassJsonNoteIcon', 'ProtonPass JSON note icon should be visible');
    
    // Verify Note Icon Text
    await this.verifyDisplayedSoft('protonPassJsonNoteIconText', 'ProtonPass JSON note icon text should be visible');
    const iconText = await this.protonPassJsonNoteIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.protonPassJsonNote.iconText);
    
    // Verify Note Text
    await this.verifyDisplayedSoft('protonPassJsonNoteText', 'ProtonPass JSON note text should be visible');
    const noteText = await this.protonPassJsonNoteText.getText();
    expect(noteText).toBe(IMPORTED_ITEMS.protonPassJsonNote.noteText);
    
    return this.self;
  }

  async verifyProtonPassJsonLoginDisplayed(): Promise<this> {
    // Verify ProtonPass JSON Login
    await this.verifyDisplayedSoft('protonPassJsonLogin', 'ProtonPass JSON login should be visible');
    
    // Verify Login Icon
    await this.verifyDisplayedSoft('protonPassJsonLoginIcon', 'ProtonPass JSON login icon should be visible');
    
    // Verify Login Text
    await this.verifyDisplayedSoft('protonPassJsonLoginText', 'ProtonPass JSON login text should be visible');
    const loginText = await this.protonPassJsonLoginText.getText();
    expect(loginText).toBe(IMPORTED_ITEMS.protonPassJsonLogin.loginText);
    
    await this.verifyDisplayedSoft('protonPassJsonLoginText2', 'ProtonPass JSON login text should be visible');
    const loginText2 = await this.protonPassJsonLoginText2.getText();
    expect(loginText2).toBe(IMPORTED_ITEMS.protonPassJsonLogin.protonPassJsonLoginText2);
    
    return this.self;
  }

  async verifyUnencryptedFileCsvHechtDisplayed(): Promise<this> {
    // Verify Unencrypted File CSV Hecht
    await this.verifyDisplayedSoft('unencryptedFileCsvHecht', 'Unencrypted File CSV Hecht should be visible');
    
    // Verify Hecht Icon
    await this.verifyDisplayedSoft('unencryptedFileCsvHechtIcon', 'Unencrypted File CSV Hecht icon should be visible');
    
    // Verify Hecht Icon Text
    await this.verifyDisplayedSoft('unencryptedFileCsvHechtIconText', 'Unencrypted File CSV Hecht icon text should be visible');
    const iconText = await this.unencryptedFileCsvHechtIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.unencryptedFileCsvHecht.iconText);
    
    // Verify Hecht Text
    await this.verifyDisplayedSoft('unencryptedFileCsvHechtText', 'Unencrypted File CSV Hecht text should be visible');
    const hechtText = await this.unencryptedFileCsvHechtText.getText();
    expect(hechtText).toBe(IMPORTED_ITEMS.unencryptedFileCsvHecht.hechtText);
    
    return this.self;
  }

  async verifyUnencryptedFileCsvIncDisplayed(): Promise<this> {
    // Verify Unencrypted File CSV Inc
    await this.verifyDisplayedSoft('unencryptedFileCsvInc', 'Unencrypted File CSV Inc should be visible');
    
    // Verify Inc Icon
    await this.verifyDisplayedSoft('unencryptedFileCsvIncIcon', 'Unencrypted File CSV Inc icon should be visible');
    
    // Verify Inc Icon Text
    await this.verifyDisplayedSoft('unencryptedFileCsvIncIconText', 'Unencrypted File CSV Inc icon text should be visible');
    const iconText = await this.unencryptedFileCsvIncIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.unencryptedFileCsvInc.iconText);
    
    // Verify Inc Text
    await this.verifyDisplayedSoft('unencryptedFileCsvIncText', 'Unencrypted File CSV Inc text should be visible');
    const incText = await this.unencryptedFileCsvIncText.getText();
    expect(incText).toBe(IMPORTED_ITEMS.unencryptedFileCsvInc.incText);
    
    return this.self;
  }

  async verifyUnencryptedFileJsonDisplayed(): Promise<this> {
    await this.unencryptedFileJsonDisplayed.waitForDisplayed({ timeout: 2000 });
    return this.self;
  }
}

export default HomePage;
