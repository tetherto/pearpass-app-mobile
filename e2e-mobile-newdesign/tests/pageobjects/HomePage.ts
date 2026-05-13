import { browser } from '@wdio/globals';
import BasePage from '@pages/BasePage';
import homeLocators from '@locators/HomeLocators';
import { HOME_PAGE } from '@data/home.data';


const ITEMS_CATEGORY_POPUP_LOCATOR_PREFIX = {
  allItems: 'allItemsCategoryPopup',
  logins: 'loginsItemsCategoryPopup',
  creditCards: 'creditCardsItemsCategoryPopup',
  identities: 'identitiesItemsCategoryPopup',
  notes: 'notesItemsCategoryPopup',
  recoveryPhrases: 'recoveryPhrasesItemsCategoryPopup',
  wifi: 'wifiCategoryPopup',
  other: 'otherCategoryPopup',
} as const satisfies Record<keyof typeof HOME_PAGE.itemsCategoryPopup.categories, string>;

const SORT_ITEMS_POPUP_LOCATOR_PREFIX = {
  titleAz: 'titleAzButton',
  lastUpdatedNewest: 'lastUpdatedNewestButton',
  lastUpdatedOldest: 'lastUpdatedOldestButton',
  dateAddedNewest: 'dateAddedNewestButton',
  dateAddedOldest: 'dateAddedOldestButton',
} as const satisfies Record<keyof typeof HOME_PAGE.sortItemsPopup.options, string>;

const ADD_TOP_ITEM_POPUP_LOCATOR_PREFIX = {
  logins: 'addTopItemPopupLogins',
  creditCard: 'addTopItemPopupCreditCard',
  identities: 'addTopItemPopupIdentities',
  notes: 'addTopItemPopupNotes',
  recoveryPhrases: 'addTopItemPopupRecoveryPhrases',
  wifi: 'addTopItemPopupWifi',
  other: 'addTopItemPopupOther',
  password: 'addTopItemPopupPassword',
} as const satisfies Record<keyof typeof HOME_PAGE.addTopItemPopup.categories, string>;


export class HomePage extends BasePage {
  protected selectors = homeLocators;


  async addItemButtonDisplayed(): Promise<this> {
    await this.waitForDisplayed('addItemButton', 30000);
    return this.self;
  }

  async noItemSavedTitleDisplayed(): Promise<this> {
    await this.waitForDisplayed('noItemSavedTitle', 30000);
    await this.expectDisplayed('noItemSavedTitle');
    await this.expectExactText('noItemSavedTitle', HOME_PAGE.noItemSaved.title);
    await this.expectDisplayed('noItemSavedDescription');
    await this.expectExactText('noItemSavedDescription', HOME_PAGE.noItemSaved.description);
    return this.self;
  }

  async searchInItemsFieldDisplayed(): Promise<this> {
    await this.waitForDisplayed('searchInItemsField', 30000);
    return this.self;
  }

  async tapOnVaultsButton(): Promise<this> {
    await this.waitForDisplayed('vaultButton', 20000);
    await this.tap('vaultButton');
    return this.self;
  }

  async tapOnAllItemsCategoryButton(): Promise<this> {
    await this.waitForDisplayed('allItemsCategoryButton', 20000);
    await this.tap('allItemsCategoryButton');
    return this.self;
  }

  async longPressOnVaultsTab(): Promise<this> {
    await this.waitForDisplayed('vaultTab', 20000);
    await this.longPress('vaultTab');
    return this.self;
  }

  async swipeVaultBreadcrumbLeft(): Promise<this> {
    await this.waitForDisplayed('vaultButton', 20000);

    const isFoldersIconRendered = async (): Promise<boolean> => {
      try {
        return await this.$('foldersButtonIcon2').isExisting();
      } catch {
        return false;
      }
    };

    const maxSwipes = 10;
    for (let i = 0; i < maxSwipes; i++) {
      if (await isFoldersIconRendered()) return this.self;
      await this.swipeOnElement('vaultButton', 'left');
      await browser.pause(300);
    }

    await this.waitForDisplayed('foldersButtonIcon2', 5000);
    return this.self;
  }

  async swipeVaultBreadcrumbRight(): Promise<this> {
    await this.waitForDisplayed('vaultButton', 20000);
    await this.swipeOnElement('vaultButton', 'right');
    return this.self;
  }

  async vaultTabWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('vaultTab', 20000);
    await this.expectDisplayed('vaultTab');
    await this.expectDisplayed('vaultTabText');
    await this.expectExactText('vaultTabText', HOME_PAGE.vaultTab.text);
    await this.expectDisplayed('vaultTabIcon');
    return this.self;
  }

  async settingsTabWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('settingsTab', 20000);
    await this.expectDisplayed('settingsTab');
    await this.expectDisplayed('settingsTabText');
    await this.expectExactText('settingsTabText', HOME_PAGE.settingsTab.text);
    await this.expectDisplayed('settingsTabIcon');
    return this.self;
  }

  async addTopItemButtonWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('addTopItemButton', 20000);
    await this.expectDisplayed('addTopItemButton');
    await this.expectDisplayed('addTopItemButtonIcon');
    return this.self;
  }

  async addCenterItemButtonWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('addCenterItemButton', 20000);
    await this.expectDisplayed('addCenterItemButton');
    await this.expectDisplayed('addCenterItemButtonIcon');
    await this.expectDisplayed('addCenterItemButtonText');
    await this.expectExactText('addCenterItemButtonText', HOME_PAGE.addCenterItemButton.text);
    return this.self;
  }

  async foldersButtonWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('foldersButton', 20000);
    await this.expectDisplayed('foldersButton');
    await this.expectDisplayed('foldersButtonIcon');
    await this.expectDisplayed('foldersButtonText');
    await this.expectExactText('foldersButtonText', HOME_PAGE.foldersButton.text);
    await this.expectDisplayed('foldersButtonIcon2');
    return this.self;
  }

  async tapOnAllFoldersButton(): Promise<this> {
    await this.waitForDisplayed('foldersButton', 20000);
    await this.tap('foldersButton');
    return this.self;
  }

  async verifyFoldersPopupNotDisplayed(): Promise<this> {
    await this.expectDisplayed('foldersPopup', false);
    return this.self;
  }

  async foldersPopupWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('foldersPopup', 20000);
    await this.expectDisplayed('foldersPopup');
    await this.expectDisplayed('foldersPopupTitle');
    await this.expectExactText('foldersPopupTitle', HOME_PAGE.foldersPopup.title);
    await this.expectDisplayed('popupCloseButton');

    await this.expectDisplayed('allFoldersPopupField');
    await this.expectDisplayed('allFoldersPopupFieldIcon');
    await this.expectDisplayed('allFoldersPopupFieldText');
    await this.expectExactText('allFoldersPopupFieldText', HOME_PAGE.foldersPopup.allFolders.text);
    await this.expectDisplayed('allFoldersPopupFieldItemsCount');

    await this.expectDisplayed('addNewFolderPopupField');
    await this.expectDisplayed('addNewFolderPopupFieldIcon');
    await this.expectDisplayed('addNewFolderPopupFieldText');
    await this.expectExactText(
      'addNewFolderPopupFieldText',
      HOME_PAGE.foldersPopup.addNewFolder.text,
    );

    return this.self;
  }

  async sortItemsButtonWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('sortItemsButton', 20000);
    await this.expectDisplayed('sortItemsButton');
    await this.expectDisplayed('sortItemsButtonIcon');
    return this.self;
  }

  async tapOnSortItemsButton(): Promise<this> {
    await this.waitForDisplayed('sortItemsButton', 20000);
    await this.tap('sortItemsButton');
    return this.self;
  }

  async verifySortItemsPopupNotDisplayed(): Promise<this> {
    await this.expectDisplayed('sortItemsPopup', false);
    return this.self;
  }

  async tapOnLoginsField(): Promise<this> {
    await this.waitForDisplayed('addTopItemPopupLoginsField', 20000);
    await this.tap('addTopItemPopupLoginsField');
    return this.self;
  }

  async tapOnCreditCardField(): Promise<this> {
    await this.waitForDisplayed('addTopItemPopupCreditCardField', 20000);
    await this.tap('addTopItemPopupCreditCardField');
    return this.self;
  }

  async tapOnIdentitiesField(): Promise<this> {
    await this.waitForDisplayed('addTopItemPopupIdentitiesField', 20000);
    await this.tap('addTopItemPopupIdentitiesField');
    return this.self;
  }

  async tapOnNotesField(): Promise<this> {
    await this.waitForDisplayed('addTopItemPopupNotesField', 20000);
    await this.tap('addTopItemPopupNotesField');
    return this.self;
  }

  async tapOnRecoveryPhrasesField(): Promise<this> {
    await this.waitForDisplayed('addTopItemPopupRecoveryPhrasesField', 20000);
    await this.tap('addTopItemPopupRecoveryPhrasesField');
    return this.self;
  }

  async tapOnWiFiField(): Promise<this> {
    await this.waitForDisplayed('addTopItemPopupWifiField', 20000);
    await this.tap('addTopItemPopupWifiField');
    return this.self;
  }

  async tapOnOtherField(): Promise<this> {
    await this.waitForDisplayed('addTopItemPopupOtherField', 20000);
    await this.tap('addTopItemPopupOtherField');
    return this.self;
  }

  async tapOnPasswordField(): Promise<this> {
    await this.waitForDisplayed('addTopItemPopupPasswordField', 20000);
    await this.tap('addTopItemPopupPasswordField');
    return this.self;
  }

  async sortItemsPopupWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('sortItemsPopup', 20000);
    await this.expectDisplayed('sortItemsPopup');
    await this.expectDisplayed('sortItemsPopupTitle');
    await this.expectExactText('sortItemsPopupTitle', HOME_PAGE.sortItemsPopup.title);
    await this.expectDisplayed('popupCloseButton');

    for (const [optionKey, prefix] of Object.entries(SORT_ITEMS_POPUP_LOCATOR_PREFIX)) {
      const expectedText =
        HOME_PAGE.sortItemsPopup.options[
          optionKey as keyof typeof HOME_PAGE.sortItemsPopup.options
        ].text;

      await this.expectDisplayed(prefix);
      await this.expectDisplayed(`${prefix}Icon`);
      await this.expectDisplayed(`${prefix}Text`);
      await this.expectExactText(`${prefix}Text`, expectedText);
    }

    return this.self;
  }

  async searchFieldWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('searchInItemsField', 20000);
    await this.expectDisplayed('searchInItemsField');
    await this.expectDisplayed('searchInItemsFieldInput');
    await this.expectExactText('searchInItemsFieldInput', HOME_PAGE.searchField.placeholder);
    await this.expectDisplayed('searchInItemsFieldIcon');
    return this.self;
  }

  async importVaultButtonWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('importVaultButton', 20000);
    await this.expectDisplayed('importVaultButton');
    await this.expectDisplayed('importVaultButtonIcon');
    return this.self;
  }

  async importItemsButtonWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('importItemsButton', 20000);
    await this.expectDisplayed('importItemsButton');
    await this.expectDisplayed('importItemsButtonIcon');
    await this.expectDisplayed('importItemsButtonText');
    await this.expectExactText('importItemsButtonText', HOME_PAGE.importItemsButton.text);
    return this.self;
  }

  async tapOnAddTopItemButton(): Promise<this> {
    await this.waitForDisplayed('addTopItemButton', 20000);
    await this.tap('addTopItemButton');
    return this.self;
  }

  async tapOnAddCenterItemButton(): Promise<this> {
    await this.waitForDisplayed('addCenterItemButton', 20000);
    await this.tap('addCenterItemButton');
    return this.self;
  }

  async tapOnImportVaultButton(): Promise<this> {
    await this.waitForDisplayed('importVaultButton', 20000);
    await this.tap('importVaultButton');
    return this.self;
  }

  async tapOnImportItemsButton(): Promise<this> {
    await this.waitForDisplayed('importItemsButton', 20000);
    await this.tap('importItemsButton');
    return this.self;
  }

  async importVaultPageWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('importVaultPageTitle', 20000);
    await this.expectDisplayed('importVaultPageTitle');
    await this.expectExactText('importVaultPageTitle', HOME_PAGE.importVaultPage.title);

    await this.expectDisplayed('importVaultPageBackButton');

    await this.expectDisplayed('importVaultPageText');
    await this.expectExactText('importVaultPageText', HOME_PAGE.importVaultPage.scanQrCodeText);

    await this.expectDisplayed('importVaultPageText2');
    await this.expectExactText('importVaultPageText2', HOME_PAGE.importVaultPage.cameraAccessText);

    await this.expectDisplayed('importVaultPageAllowAccessButton');
    await this.expectDisplayed('importVaultPageAllowAccessButtonText');
    await this.expectExactText(
      'importVaultPageAllowAccessButtonText',
      HOME_PAGE.importVaultPage.allowAccessButton.text,
    );

    await this.expectDisplayed('itemVaultLinkField');
    await this.expectDisplayed('itemVaultLinkFieldTitle');
    await this.expectExactText(
      'itemVaultLinkFieldTitle',
      HOME_PAGE.importVaultPage.itemVaultLinkField.title,
    );
    await this.expectDisplayed('itemVaultLinkFieldInput');
    await this.expectExactText(
      'itemVaultLinkFieldInput',
      HOME_PAGE.importVaultPage.itemVaultLinkField.inputPlaceholder,
    );
    await this.expectDisplayed('itemVaultLinkFieldPasteButton');

    await this.expectDisplayed('importVaultPageContinueButton');
    await this.expectDisplayed('importVaultPageContinueButtonText');
    await this.expectExactText(
      'importVaultPageContinueButtonText',
      HOME_PAGE.importVaultPage.continueButton.text,
    );

    return this.self;
  }

  async verifyAddTopItemPopupNotDisplayed(): Promise<this> {
    await this.expectDisplayed('addTopItemPopup', false);
    return this.self;
  }

  async verifyItemsCategoryPopupNotDisplayed(): Promise<this> {
    await this.expectDisplayed('itemsCategoryPopup', false);
    return this.self;
  }

  async itemsCategoryPopupWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('itemsCategoryPopup', 20000);
    await this.expectDisplayed('itemsCategoryPopup');
    await this.expectDisplayed('itemsCategoryPopupTitle');
    await this.expectExactText('itemsCategoryPopupTitle', HOME_PAGE.itemsCategoryPopup.title);
    await this.expectDisplayed('popupCloseButton');

    for (const [catKey, prefix] of Object.entries(ITEMS_CATEGORY_POPUP_LOCATOR_PREFIX)) {
      const expectedText =
        HOME_PAGE.itemsCategoryPopup.categories[
          catKey as keyof typeof HOME_PAGE.itemsCategoryPopup.categories
        ].text;

      await this.expectDisplayed(`${prefix}Field`);
      await this.expectDisplayed(`${prefix}FieldIcon`);
      await this.expectDisplayed(`${prefix}FieldText`);
      await this.expectExactText(`${prefix}FieldText`, expectedText);
      await this.expectDisplayed(`${prefix}FieldItemsCount`);
    }

    return this.self;
  }

  async addTopItemPopupWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('addTopItemPopup', 20000);
    await this.expectDisplayed('addTopItemPopup');
    await this.expectDisplayed('addTopItemPopupTitle');
    await this.expectExactText('addTopItemPopupTitle', HOME_PAGE.addTopItemPopup.title);
    await this.expectDisplayed('popupCloseButton');

    for (const [catKey, prefix] of Object.entries(ADD_TOP_ITEM_POPUP_LOCATOR_PREFIX)) {
      const expectedText =
        HOME_PAGE.addTopItemPopup.categories[
          catKey as keyof typeof HOME_PAGE.addTopItemPopup.categories
        ].text;

      await this.expectDisplayed(`${prefix}Field`);
      await this.expectDisplayed(`${prefix}FieldIcon`);
      await this.expectDisplayed(`${prefix}FieldText`);
      await this.expectExactText(`${prefix}FieldText`, expectedText);
    }

    return this.self;
  }

  async verifyVaultsPopupNotDisplayed(): Promise<this> {
    await this.expectDisplayed('vaultsPopup', false);
    return this.self;
  }

  async vaultsPopupWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('vaultsPopup', 20000);
    await this.expectDisplayed('vaultsPopup');
    await this.expectDisplayed('vaultsPopupTitle');
    await this.expectExactText('vaultsPopupTitle', HOME_PAGE.vaultsPopup.title);
    await this.expectDisplayed('popupCloseButton');

    await this.expectDisplayed('vaultsPopupPersonalVaultsField');
    await this.expectDisplayed('vaultsPopupPersonalVaultsFieldIcon');
    await this.expectDisplayed('vaultsPopupPersonalVaultsFieldText');
    await this.expectExactText(
      'vaultsPopupPersonalVaultsFieldText',
      HOME_PAGE.vaultsPopup.personalVault.text,
    );
    await this.expectDisplayed('vaultsPopupPersonalVaultsFieldVaultActionsButton');

    await this.expectDisplayed('vaultsPopupCreateNewVaultField');
    await this.expectDisplayed('vaultsPopupCreateNewVaultFieldIcon');
    await this.expectDisplayed('vaultsPopupCreateNewVaultFieldText');
    await this.expectExactText(
      'vaultsPopupCreateNewVaultFieldText',
      HOME_PAGE.vaultsPopup.createNewVault.text,
    );
    return this.self;
  }

  async tapOnVaultTab(): Promise<this> {
    await this.tap('vaultTab');
    return this.self;
  }

  async verifyOnePasswordAccountFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('onePassworAccountField');
    return this.self;
  }

  async verifyOnePasswordPasswordFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('onePasswordPasswordField');
    return this.self;
  }

  async verifyOnePasswordLoginFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('onePasswordLoginField');
    return this.self;
  }

  async verifyBitwardenJsonSshFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('bitwardenJsonSshField');
    return this.self;
  }

  async verifyBitwardenJsonNotFoundFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('bitwardenJsonNotFoundField');
    return this.self;
  }

  async verifyBitwardenJsonLoginFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('bitwardenJsonLoginField');
    return this.self;
  }

  async verifyBitwardenJsonIdentityFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('bitwardenJsonIdentityField');
    return this.self;
  }

  async verifyBitwardenJsonCreditCardFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('bitwardenJsonCreditCardField');
    return this.self;
  }

  async verifyBitwardenCsvNoteFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('bitwardenCsvNoteField');
    return this.self;
  }

  async verifyBitwardenCsvLoginFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('bitwardenCsvLoginField');
    return this.self;
  }

  async verifyLastPassCsvNameFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('lastPassCsvNameField');
    return this.self;
  }

  async verifyLastPassCsvSecureFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('lastPassCsvSecureField');
    return this.self;
  }

  async verifyLastPassCsvItemFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('lastPassCsvItemField');
    return this.self;
  }

  async verifyNordPassCsvGmailFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('nordPassCsvGmailField');
    return this.self;
  }

  async verifyNordPassCsvCreditFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('nordPassCsvCreditField');
    return this.self;
  }

  async verifyProtonPassCsvLoginFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('protonPassCsvLoginField');
    return this.self;
  }

  async verifyProtonPassCsvNoteFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('protonPassCsvNoteField');
    return this.self;
  }

  async verifyProtonPassCsvIdentityFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('protonPassCsvIdentityField');
    return this.self;
  }

  async verifyProtonPassJsonLoginFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('protonPassJsonLoginField');
    return this.self;
  }

  async verifyProtonPassJsonNoteFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('protonPassJsonNoteField');
    return this.self;
  }

  async verifyProtonPassJsonIdentityFieldDisplayed(): Promise<this> {
    await this.expectDisplayed('protonPassJsonIdentityField');
    return this.self;
  }

  async verifyEncryptedFileJsonHgfgFileDisplayed(): Promise<this> {
    await this.expectDisplayed('unencryptedFileJsonHgfgFile');
    return this.self;
  }

  async verifyEncryptedFileCsvIncFileDisplayed(): Promise<this> {
    await this.expectDisplayed('unencryptedFileCsvIncFile');
    return this.self;
  }

  async verifyEncryptedFileCsvHechtFileDisplayed(): Promise<this> {
    await this.expectDisplayed('unencryptedFileCsvHechtFile');
    return this.self;
  }
}

export default HomePage;
