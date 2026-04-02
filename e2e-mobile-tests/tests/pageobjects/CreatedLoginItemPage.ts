import BasePage from '@pages/BasePage';
import createdLoginItemLocators from '@locators/CreatedLoginItemLocators';
import { COPY_EMAIL_OR_USERNAME_BUTTON, COPY_PASSWORD_BUTTON, COPY_TOAST_LOGIN_ITEM_PAGE, CREATE_NEW_FOLDER_BUTTON, DELETE_ELEMENT_BUTTON, DELETE_POPUP, EDIT_BUTTON, EDIT_BUTTON_LOGIN_ITEM_PAGE, LoginItemCopyFieldType, MARK_AS_FAVORITE_BUTTON, MOVE_TO_ANOTHER_FOLDER_BUTTON, NEW_FOLDER_IN_POPUP_MENU, OPENED_FILE_POPUP, PasswordVisibilityType, REMOVE_FROM_FAVORITES_BUTTON, TEST_FOLDER_ON_LOGIN_ITEM_PAGE } from '@data/createdLoginItem.data';
import { CREATE_LOGIN_EMAIL_OR_USERNAME_FIELD, CREATE_LOGIN_ENTERED_FIELDS, CREATE_LOGIN_FILE_FIELD, CREATE_LOGIN_NEW_FILE_FIELD, CREATE_LOGIN_NOTE_FIELD, CREATE_LOGIN_PASSWORD_FIELD, CREATE_LOGIN_WEBSITE_FIELD } from '@data/home-data/createLogin.data';

declare const expect: any;

export class CreatedLoginItemPage extends BasePage {
  protected selectors = createdLoginItemLocators;

  get loginCreatedOnHomePage() { return this.$('loginCreatedOnHomePage'); }
  get creditCardCreatedOnHomePage() { return this.$('creditCardCreatedOnHomePage'); }
  get wifiCreatedOnHomePage() { return this.$('wifiCreatedOnHomePage'); }
  get recoveryPhraseCreatedOnHomePage() { return this.$('recoveryPhraseCreatedOnHomePage'); }
  get identityCreatedOnHomePage() { return this.$('identityCreatedOnHomePage'); }
  get noteCreatedOnHomePage() { return this.$('noteCreatedOnHomePage'); }
  get customElementCreatedOnHomePage() { return this.$('customElementCreatedOnHomePage'); }
  get emailOrUsernameThreeDotsIcon() { return this.$('emailOrUsernameThreeDotsIcon'); }
  get createdLoginThreeDotsPopup() { return this.$('createdLoginThreeDotsPopup'); }
  get copyEmailOrUsernameButton() { return this.$('copyEmailOrUsernameButton'); }
  get copyEmailOrUsernameIcon() { return this.$('copyEmailOrUsernameIcon'); }
  get copyEmailOrUsernameButtonText() { return this.$('copyEmailOrUsernameButtonText'); }
  get copyPasswordButton() { return this.$('copyPasswordButton'); }
  get copyPasswordIcon() { return this.$('copyPasswordIcon'); }
  get copyPasswordButtonText() { return this.$('copyPasswordButtonText'); }
  get passwordThreeDotsIcon() { return this.$('passwordThreeDotsIcon'); }
  get markAsFavoriteButton() { return this.$('markAsFavoriteButton'); }
  get markAsFavoriteIcon() { return this.$('markAsFavoriteIcon'); }
  get markAsFavoriteButtonText() { return this.$('markAsFavoriteButtonText'); }
  get markAsFavoriteThreeDotsIcon() { return this.$('markAsFavoriteThreeDotsIcon'); }
  get editButton() { return this.$('editButton'); }
  get editIcon() { return this.$('editIcon'); }
  get editButtonText() { return this.$('editButtonText'); }
  get editThreeDotsIcon() { return this.$('editThreeDotsIcon'); }
  get deleteElementButton() { return this.$('deleteElementButton'); }
  get deleteElementIcon() { return this.$('deleteElementIcon'); }
  get deleteElementButtonText() { return this.$('deleteElementButtonText'); }
  get deleteElementThreeDotsIcon() { return this.$('deleteElementThreeDotsIcon'); }
  get removeFromFavoritesButton() { return this.$('removeFromFavoritesButton'); }
  get removeFromFavoritesIcon() { return this.$('removeFromFavoritesIcon'); }
  get removeFromFavoritesButtonText() { return this.$('removeFromFavoritesButtonText'); }
  get removeFromFavoritesThreeDotsIcon() { return this.$('removeFromFavoritesThreeDotsIcon'); }

  async verifyRemoveFromFavoritesButtonAllElementsVisible(): Promise<this> {
    const { text } = REMOVE_FROM_FAVORITES_BUTTON;
    await this.removeFromFavoritesButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Remove from Favorites button should be visible' });
    await this.removeFromFavoritesIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Remove from Favorites icon should be visible' });
    await this.removeFromFavoritesButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Remove from Favorites button text should be visible' });
    await this.removeFromFavoritesThreeDotsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Remove from Favorites three dots icon should be visible' });
    const textActual = (await this.removeFromFavoritesButtonText.getText()) ?? (await this.removeFromFavoritesButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async verifyDeleteButtonAllElementsVisible(): Promise<this> {
    const { text } = DELETE_ELEMENT_BUTTON;
    await this.deleteElementButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete element button should be visible' });
    await this.deleteElementIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete element icon should be visible' });
    await this.deleteElementButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete element button text should be visible' });
    await this.deleteElementThreeDotsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete element three dots icon should be visible' });
    const textActual = (await this.deleteElementButtonText.getText()) ?? (await this.deleteElementButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async verifyEditButtonAllElementsVisible(): Promise<this> {
    const { text } = EDIT_BUTTON;
    await this.editButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit button should be visible' });
    await this.editIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit icon should be visible' });
    await this.editButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit button text should be visible' });
    await this.editThreeDotsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit three dots icon should be visible' });
    const textActual = (await this.editButtonText.getText()) ?? (await this.editButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async tapEditButtonInThreeDotsMenu(): Promise<this> {
    await this.editButton.click();
    return this;
  }

  async verifyMarkAsFavoriteButtonAllElementsVisible(): Promise<this> {
    const { text } = MARK_AS_FAVORITE_BUTTON;
    await this.markAsFavoriteButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Mark as favorite button should be visible' });
    await this.markAsFavoriteIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Mark as favorite icon should be visible' });
    await this.markAsFavoriteButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Mark as favorite button text should be visible' });
    await this.markAsFavoriteThreeDotsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Mark as favorite three dots icon should be visible' });
    const textActual = (await this.markAsFavoriteButtonText.getText()) ?? (await this.markAsFavoriteButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async verifyCopyPasswordButtonAllElementsVisible(): Promise<this> {
    const { text } = COPY_PASSWORD_BUTTON;
    await this.copyPasswordButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Password button should be visible' });
    await this.copyPasswordIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Password icon should be visible' });
    await this.copyPasswordButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Password button text should be visible' });
    await this.passwordThreeDotsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password three dots icon should be visible' });
    const textActual = (await this.copyPasswordButtonText.getText()) ?? (await this.copyPasswordButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async verifyCopyEmailOrUsernameButtonAllElementsVisible(): Promise<this> {
    const { text } = COPY_EMAIL_OR_USERNAME_BUTTON;
    await this.createdLoginThreeDotsPopup.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Created login three dots popup should be visible' });
    await this.copyEmailOrUsernameButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Email or username button should be visible' });
    await this.copyEmailOrUsernameIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Email or username icon should be visible' });
    await this.copyEmailOrUsernameButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Email or username button text should be visible' });
    await this.emailOrUsernameThreeDotsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email or username three dots icon should be visible' });
    const textActual = (await this.copyEmailOrUsernameButtonText.getText()) ?? (await this.copyEmailOrUsernameButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async verifyThreeDotsMenuPopupVisible(): Promise<this> {
    await this.createdLoginThreeDotsPopup.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Three dots menu popup should be visible' });
    return this;
  }

  async tapThreeDotsButtonOnCreatedLogin(): Promise<this> {
    await this.emailOrUsernameThreeDotsIcon.click();
    return this;
  }

  async tapCopyEmailOrUsernameButton(): Promise<this> {
    await this.copyEmailOrUsernameButton.click();
    return this;
  }

  async tapCopyPasswordButton(): Promise<this> {
    await this.copyPasswordButton.click();
    return this;
  }

  async tapMarkAsFavoriteButton(): Promise<this> {
    await this.markAsFavoriteButton.click();
    return this;
  }

  async tapRemoveFromFavoritesButton(): Promise<this> {
    await this.removeFromFavoritesButton.click();
    return this;
  }

  async tapCreatedLoginItem(): Promise<this> {
    await this.loginCreatedOnHomePage.click();
    return this;
  }

  get titleLoginItemPage() { return this.$('titleLoginItemPage'); }

  async verifyTitleLoginItemPageVisible(): Promise<this> {
    const { title } = CREATE_LOGIN_ENTERED_FIELDS;
    await this.titleLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Title on login item page should be visible' });
    const titleActual = (await this.titleLoginItemPage.getText()) ?? (await this.titleLoginItemPage.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this;
  }

  get backButtonLoginItemPage() { return this.$('backButtonLoginItemPage'); }

  async verifyBackButtonLoginItemPageVisible(): Promise<this> {
    await this.backButtonLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Back button on login item page should be visible' });
    return this;
  }

  async tapBackButtonOnLoginItemPage(): Promise<this> {
    await this.backButtonLoginItemPage.click();
    return this;
  }

  get favoriteButtonUncheckedLoginItemPage() { return this.$('favoriteButtonUncheckedLoginItemPage'); }

  async verifyFavoriteButtonUncheckedLoginItemPageVisible(): Promise<this> {
    await this.favoriteButtonUncheckedLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Favorite button unchecked on login item page should be visible' });
    return this;
  }

  async tapFavoriteButtonUncheckedLoginItemPage(): Promise<this> {
    await this.favoriteButtonUncheckedLoginItemPage.click();
    return this;
  }

  get editButtonLoginItemPage() { return this.$('editButtonLoginItemPage'); }
  get editButtonIconLoginItemPage() { return this.$('editButtonIconLoginItemPage'); }
  get editButtonTextLoginItemPage() { return this.$('editButtonTextLoginItemPage'); }

  async verifyEditButtonLoginItemPageAllElementsVisible(): Promise<this> {
    const { text } = EDIT_BUTTON_LOGIN_ITEM_PAGE;
    await this.editButtonLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit button on login item page should be visible' });
    await this.editButtonIconLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit button icon on login item page should be visible' });
    await this.editButtonTextLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit button text on login item page should be visible' });
    const textActual = (await this.editButtonTextLoginItemPage.getText()) ?? (await this.editButtonTextLoginItemPage.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async tapEditButtonLoginItemPage(): Promise<this> {
    await this.editButtonLoginItemPage.click();
    return this;
  }

  get threeDotsButtonLoginItemPage() { return this.$('threeDotsButtonLoginItemPage'); }

  async verifyThreeDotsButtonLoginItemPageVisible(): Promise<this> {
    await this.threeDotsButtonLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Three dots button on login item page should be visible' });
    return this;
  }

  async tapThreeDotsButtonLoginItemPage(): Promise<this> {
    await this.threeDotsButtonLoginItemPage.click();
    return this;
  }

  get threeDotsMenuPopupOnLoginItemPage() { return this.$('threeDotsMenuPopupOnLoginItemPage'); }

  async verifyThreeDotsMenuPopupOnLoginItemPageVisible(): Promise<this> {
    await this.threeDotsMenuPopupOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Three dots menu popup on login item page should be visible' });
    return this;
  }

  get moveToAnotherFolderButton() { return this.$('moveToAnotherFolderButton'); }
  get moveToAnotherFolderIcon() { return this.$('moveToAnotherFolderIcon'); }
  get moveToAnotherFolderButtonText() { return this.$('moveToAnotherFolderButtonText'); }
  get moveToAnotherFolderThreeDotsIcon() { return this.$('moveToAnotherFolderThreeDotsIcon'); }

  async verifyMoveToAnotherFolderButtonOnLoginItemPageVisible(): Promise<this> {
    const { text } = MOVE_TO_ANOTHER_FOLDER_BUTTON;
    await this.moveToAnotherFolderButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Move to another folder button on login item page should be visible' });
    await this.moveToAnotherFolderIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Move to another folder icon on login item page should be visible' });
    await this.moveToAnotherFolderButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Move to another folder button text on login item page should be visible' });
    await this.moveToAnotherFolderThreeDotsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Move to another folder three dots icon on login item page should be visible' });
    const textActual = (await this.moveToAnotherFolderButtonText.getText()) ?? (await this.moveToAnotherFolderButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async tapMoveToAnotherFolderButtonLoginItemPage(): Promise<this> {
    await this.moveToAnotherFolderButton.click();
    return this;
  }

  get moveToAnotherFolderPopup() { return this.$('moveToAnotherFolderPopup'); }

  async verifyPopUpMenuMoveToAnotherFolderVisible(): Promise<this> {
    await this.moveToAnotherFolderPopup.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pop menu (move to another folder popup) should be visible' });
    return this;
  }

  get createNewFolderButton() { return this.$('createNewFolderButton'); }
  get plusIcon() { return this.$('plusIcon'); }
  get createNewFolderButtonText() { return this.$('createNewFolderButtonText'); }

  async verifyCreateNewFolderButtonVisible(): Promise<this> {
    const { text } = CREATE_NEW_FOLDER_BUTTON;
    await this.createNewFolderButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create new folder button should be visible' });
    await this.plusIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create new folder plus icon should be visible' });
    await this.createNewFolderButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create new folder button text should be visible' });
    const textActual = (await this.createNewFolderButtonText.getText()) ?? (await this.createNewFolderButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async tapCreateNewFolderButtonInPopUpMenuMoveToAnotherFolder(): Promise<this> {
    await this.createNewFolderButton.click();
    return this;
  }

  get testFolderIconOnLoginItemPage() { return this.$('testFolderIconOnLoginItemPage'); }
  get testFolderTitleOnLoginItemPage() { return this.$('testFolderTitleOnLoginItemPage'); }

  async verifyTestFolderIconAndTitleOnLoginItemPageVisible(): Promise<this> {
    const { title } = TEST_FOLDER_ON_LOGIN_ITEM_PAGE;
    await this.testFolderIconOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Test folder icon on login item page should be visible' });
    await this.testFolderTitleOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Test folder title on login item page should be visible' });
    const titleActual = (await this.testFolderTitleOnLoginItemPage.getText()) ?? (await this.testFolderTitleOnLoginItemPage.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this;
  }

  get newFolderButtonInPopUpMenuMoveToAnotherFolder() { return this.$('newFolderButtonInPopUpMenuMoveToAnotherFolder'); }
  get newFolderIconInPopUpMenuMoveToAnotherFolder() { return this.$('newFolderIconInPopUpMenuMoveToAnotherFolder'); }
  get newFolderTitleInPopUpMenuMoveToAnotherFolder() { return this.$('newFolderTitleInPopUpMenuMoveToAnotherFolder'); }
  get newFolderButtonTextInPopUpMenuMoveToAnotherFolder() { return this.$('newFolderButtonTextInPopUpMenuMoveToAnotherFolder'); }

  async verifyAmountOfItemsInFolder(expectedCount: number): Promise<this> {
    const expectedText = `${expectedCount} items`;
    await this.newFolderButtonTextInPopUpMenuMoveToAnotherFolder.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Folder items count text in popup menu should be visible' });
    const textActual = (await this.newFolderButtonTextInPopUpMenuMoveToAnotherFolder.getText()) ?? (await this.newFolderButtonTextInPopUpMenuMoveToAnotherFolder.getAttribute('text')) ?? '';
    expect(textActual).toBe(expectedText);
    return this;
  }

  async verifyNewFolderInPopUpMenuVisible(): Promise<this> {
    const { title } = NEW_FOLDER_IN_POPUP_MENU;
    await this.newFolderButtonInPopUpMenuMoveToAnotherFolder.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New folder button in popup menu move to another folder should be visible' });
    await this.newFolderIconInPopUpMenuMoveToAnotherFolder.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New folder icon in popup menu move to another folder should be visible' });
    await this.newFolderTitleInPopUpMenuMoveToAnotherFolder.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New folder title in popup menu move to another folder should be visible' });
    const titleActual = (await this.newFolderTitleInPopUpMenuMoveToAnotherFolder.getText()) ?? (await this.newFolderTitleInPopUpMenuMoveToAnotherFolder.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this;
  }

  async tapOnNewFolderInPopUpMenu(): Promise<this> {
    await this.newFolderButtonInPopUpMenuMoveToAnotherFolder.click();
    return this;
  }

  get markAsFavoriteButtonOnLoginItemPage() { return this.$('markAsFavoriteButtonOnLoginItemPage'); }
  get markAsFavoriteIconOnLoginItemPage() { return this.$('markAsFavoriteIconOnLoginItemPage'); }
  get markAsFavoriteButtonTextOnLoginItemPage() { return this.$('markAsFavoriteButtonTextOnLoginItemPage'); }
  get markAsFavoriteThreeDotsIconOnLoginItemPage() { return this.$('markAsFavoriteThreeDotsIconOnLoginItemPage'); }

  async verifyMarkAsFavoriteButtonOnLoginItemPageVisible(): Promise<this> {
    const { text } = MARK_AS_FAVORITE_BUTTON;
    await this.markAsFavoriteButtonOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Mark as favorite button on login item page should be visible' });
    await this.markAsFavoriteIconOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Mark as favorite icon on login item page should be visible' });
    await this.markAsFavoriteButtonTextOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Mark as favorite button text on login item page should be visible' });
    await this.markAsFavoriteThreeDotsIconOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Mark as favorite three dots icon on login item page should be visible' });
    const textActual = (await this.markAsFavoriteButtonTextOnLoginItemPage.getText()) ?? (await this.markAsFavoriteButtonTextOnLoginItemPage.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  get removeFromFavoritesButtonOnLoginItemPage() { return this.$('removeFromFavoritesButtonOnLoginItemPage'); }
  get removeFromFavoritesIconOnLoginItemPage() { return this.$('removeFromFavoritesIconOnLoginItemPage'); }
  get removeFromFavoritesButtonTextOnLoginItemPage() { return this.$('removeFromFavoritesButtonTextOnLoginItemPage'); }
  get removeFromFavoritesThreeDotsIconOnLoginItemPage() { return this.$('removeFromFavoritesThreeDotsIconOnLoginItemPage'); }

  async verifyRemoveFromFavoritesButtonOnLoginItemPageVisible(): Promise<this> {
    const { text } = REMOVE_FROM_FAVORITES_BUTTON;
    await this.removeFromFavoritesButtonOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Remove from Favorites button on login item page should be visible' });
    await this.removeFromFavoritesIconOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Remove from Favorites icon on login item page should be visible' });
    await this.removeFromFavoritesButtonTextOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Remove from Favorites button text on login item page should be visible' });
    await this.removeFromFavoritesThreeDotsIconOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Remove from Favorites three dots icon on login item page should be visible' });
    const textActual = (await this.removeFromFavoritesButtonTextOnLoginItemPage.getText()) ?? (await this.removeFromFavoritesButtonTextOnLoginItemPage.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  get deleteElementButtonOnLoginItemPage() { return this.$('deleteElementButtonOnLoginItemPage'); }
  get deleteElementIconOnLoginItemPage() { return this.$('deleteElementIconOnLoginItemPage'); }
  get deleteElementButtonTextOnLoginItemPage() { return this.$('deleteElementButtonTextOnLoginItemPage'); }
  get deleteElementThreeDotsIconOnLoginItemPage() { return this.$('deleteElementThreeDotsIconOnLoginItemPage'); }

  async verifyDeleteElementButtonOnLoginItemPageVisible(): Promise<this> {
    const { text } = DELETE_ELEMENT_BUTTON;
    await this.deleteElementButtonOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete element button on login item page should be visible' });
    await this.deleteElementIconOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete element icon on login item page should be visible' });
    await this.deleteElementButtonTextOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete element button text on login item page should be visible' });
    await this.deleteElementThreeDotsIconOnLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete element three dots icon on login item page should be visible' });
    const textActual = (await this.deleteElementButtonTextOnLoginItemPage.getText()) ?? (await this.deleteElementButtonTextOnLoginItemPage.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async tapDeleteButtonInThreeDotsMenu(): Promise<this> {
    await this.deleteElementButtonOnLoginItemPage.click();
    return this;
  }

  async tapDeleteElementButtonInThreeDotsMenuOnHomePage(): Promise<this> {
    await this.deleteElementButton.click();
    return this;
  }

  get deletePopup() { return this.$('deletePopup'); }

  async verifyDeletePopupVisible(): Promise<this> {
    await this.deletePopup.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete popup should be visible' });
    return this;
  }

  async verifyDeletePopupNotVisible(): Promise<this> {
    await this.deletePopup.waitForDisplayed({ timeout: 10000, reverse: true, timeoutMsg: 'Delete popup should not be visible' });
    return this;
  }

  get deletePopupTitle() { return this.$('deletePopupTitle'); }
  get deletePopupText() { return this.$('deletePopupText'); }
  get deletePopupConfirmButton() { return this.$('deletePopupConfirmButton'); }
  get deletePopupConfirmButtonText() { return this.$('deletePopupConfirmButtonText'); }
  get deletePopupCancelButton() { return this.$('deletePopupCancelButton'); }
  get deletePopupCancelButtonText() { return this.$('deletePopupCancelButtonText'); }

  async verifyDeletePopupAllElementsVisible(): Promise<this> {
    const { title, text, confirmButtonText, cancelButtonText } = DELETE_POPUP;
    await this.deletePopupTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete popup title should be visible' });
    await this.deletePopupText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete popup text should be visible' });
    await this.deletePopupConfirmButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete popup confirm button should be visible' });
    await this.deletePopupConfirmButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete popup confirm button text should be visible' });
    await this.deletePopupCancelButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete popup cancel button should be visible' });
    await this.deletePopupCancelButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Delete popup cancel button text should be visible' });
    const titleActual = (await this.deletePopupTitle.getText()) ?? (await this.deletePopupTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const textActual = (await this.deletePopupText.getText()) ?? (await this.deletePopupText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    const confirmTextActual = (await this.deletePopupConfirmButtonText.getText()) ?? (await this.deletePopupConfirmButtonText.getAttribute('text')) ?? '';
    expect(confirmTextActual).toBe(confirmButtonText);
    const cancelTextActual = (await this.deletePopupCancelButtonText.getText()) ?? (await this.deletePopupCancelButtonText.getAttribute('text')) ?? '';
    expect(cancelTextActual).toBe(cancelButtonText);
    return this;
  }

  async tapDeletePopupCancelButtonInThreeDotsMenu(): Promise<this> {
    await this.deletePopupCancelButton.click();
    return this;
  }

  async tapDeletePopupConfirmButtonInThreeDotsMenu(): Promise<this> {
    await this.deletePopupConfirmButton.click();
    return this;
  }

  get avatarImageLoginItemPage() { return this.$('avatarImageLoginItemPage'); }

  async verifyAvatarImageLoginItemPageVisible(): Promise<this> {
    await this.avatarImageLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Avatar image on login item page should be visible' });
    return this;
  }

  get emailOrUserNameFieldLoginItemPage() { return this.$('emailOrUserNameFieldLoginItemPage'); }
  get emailOrUserNameFieldIconLoginItemPage() { return this.$('emailOrUserNameFieldIconLoginItemPage'); }
  get emailOrUserNameFieldTitleLoginItemPage() { return this.$('emailOrUserNameFieldTitleLoginItemPage'); }
  get emailOrUserNameFieldInputLoginItemPage() { return this.$('emailOrUserNameFieldInputLoginItemPage'); }
  get emailOrUserNameFieldCopyButtonLoginItemPage() { return this.$('emailOrUserNameFieldCopyButtonLoginItemPage'); }

  async verifyEmailOrUserNameFieldLoginItemPageAllElementsVisible(): Promise<this> {
    const { title } = CREATE_LOGIN_EMAIL_OR_USERNAME_FIELD;
    const { emailOrUsername } = CREATE_LOGIN_ENTERED_FIELDS;
    await this.emailOrUserNameFieldLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email or username field on login item page should be visible' });
    await this.emailOrUserNameFieldIconLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email or username field icon on login item page should be visible' });
    await this.emailOrUserNameFieldTitleLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email or username field title on login item page should be visible' });
    await this.emailOrUserNameFieldInputLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email or username field input on login item page should be visible' });
    await this.emailOrUserNameFieldCopyButtonLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email or username field copy button on login item page should be visible' });
    const titleActual = (await this.emailOrUserNameFieldTitleLoginItemPage.getText()) ?? (await this.emailOrUserNameFieldTitleLoginItemPage.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.emailOrUserNameFieldInputLoginItemPage.getText()) ?? (await this.emailOrUserNameFieldInputLoginItemPage.getAttribute('text')) ?? '';
    expect(inputActual).toBe(emailOrUsername);
    return this;
  }

  async tapCopyButtonLoginItemPage(fieldType: LoginItemCopyFieldType): Promise<this> {
    const copyButton =
      fieldType === 'EmailOrUserName' ? this.emailOrUserNameFieldCopyButtonLoginItemPage
      : fieldType === 'Password' ? this.passwordFieldCopyButtonLoginItemPage
      : fieldType === 'Website' ? this.websiteFieldCopyButtonLoginItemPage
      : this.notesFieldCopyButtonLoginItemPage;
    await copyButton.click();
    return this;
  }

  get websiteFieldLoginItemPage() { return this.$('websiteFieldLoginItemPage'); }
  get websiteFieldIconLoginItemPage() { return this.$('websiteFieldIconLoginItemPage'); }
  get websiteFieldTitleLoginItemPage() { return this.$('websiteFieldTitleLoginItemPage'); }
  get websiteFieldInputLoginItemPage() { return this.$('websiteFieldInputLoginItemPage'); }
  get websiteFieldCopyButtonLoginItemPage() { return this.$('websiteFieldCopyButtonLoginItemPage'); }

  async verifyWebsiteFieldLoginItemPageAllElementsVisible(): Promise<this> {
    const { title } = CREATE_LOGIN_WEBSITE_FIELD;
    const { website } = CREATE_LOGIN_ENTERED_FIELDS;
    await this.websiteFieldLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Website field on login item page should be visible' });
    await this.websiteFieldIconLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Website field icon on login item page should be visible' });
    await this.websiteFieldTitleLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Website field title on login item page should be visible' });
    await this.websiteFieldInputLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Website field input on login item page should be visible' });
    await this.websiteFieldCopyButtonLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Website field copy button on login item page should be visible' });
    const titleActual = (await this.websiteFieldTitleLoginItemPage.getText()) ?? (await this.websiteFieldTitleLoginItemPage.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.websiteFieldInputLoginItemPage.getText()) ?? (await this.websiteFieldInputLoginItemPage.getAttribute('text')) ?? '';
    expect(inputActual).toBe(website);
    return this;
  }

  get fileFieldLoginItemPage() { return this.$('fileFieldLoginItemPage'); }
  get fileFieldIconLoginItemPage() { return this.$('fileFieldIconLoginItemPage'); }
  get fileFieldTitleLoginItemPage() { return this.$('fileFieldTitleLoginItemPage'); }
  get fileFieldInputLoginItemPage() { return this.$('fileFieldInputLoginItemPage'); }

  async verifyFileFieldLoginItemPageAllElementsVisible(): Promise<this> {
    const { title } = CREATE_LOGIN_FILE_FIELD;
    const { fileName } = CREATE_LOGIN_NEW_FILE_FIELD;
    await this.fileFieldLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field on login item page should be visible' });
    await this.fileFieldIconLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field icon on login item page should be visible' });
    await this.fileFieldTitleLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field title on login item page should be visible' });
    await this.fileFieldInputLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field input on login item page should be visible' });
    const titleActual = (await this.fileFieldTitleLoginItemPage.getText()) ?? (await this.fileFieldTitleLoginItemPage.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.fileFieldInputLoginItemPage.getText()) ?? (await this.fileFieldInputLoginItemPage.getAttribute('text')) ?? '';
    expect(inputActual).toBe(fileName);
    return this;
  }

  async tapFileFieldOnLoginItemPage(): Promise<this> {
    await this.fileFieldInputLoginItemPage.click();
    return this;
  }

  get openedFilePopup() { return this.$('openedFilePopup'); }
  get openedFilePopupTitle() { return this.$('openedFilePopupTitle'); }
  get openedFilePopupQuickShareButton() { return this.$('openedFilePopupQuickShareButton'); }

  async verifyFileOpened(): Promise<this> {
    const { title, quickShareButtonText } = OPENED_FILE_POPUP;
    await this.openedFilePopup.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Opened file popup should be visible' });
    await this.openedFilePopupTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Opened file popup title should be visible' });
    await this.openedFilePopupQuickShareButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Opened file popup Quick Share button should be visible' });
    const titleActual = (await this.openedFilePopupTitle.getText()) ?? (await this.openedFilePopupTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const quickShareTextActual = (await this.openedFilePopupQuickShareButton.getText()) ?? (await this.openedFilePopupQuickShareButton.getAttribute('text')) ?? '';
    expect(quickShareTextActual).toBe(quickShareButtonText);
    return this;
  }

  get passwordFieldLoginItemPage() { return this.$('passwordFieldLoginItemPage'); }
  get passwordFieldIconLoginItemPage() { return this.$('passwordFieldIconLoginItemPage'); }
  get passwordFieldTitleLoginItemPage() { return this.$('passwordFieldTitleLoginItemPage'); }
  get passwordFieldInputLoginItemPage() { return this.$('passwordFieldInputLoginItemPage'); }
  get passwordFieldInputShowLoginItemPage() { return this.$('passwordFieldInputShowLoginItemPage'); }
  get passwordFieldCopyButtonLoginItemPage() { return this.$('passwordFieldCopyButtonLoginItemPage'); }
  get passwordFieldShowPasswordButtonLoginItemPage() { return this.$('passwordFieldShowPasswordButtonLoginItemPage'); }

  async verifyPasswordFieldLoginItemPageAllElementsVisible(): Promise<this> {
    const { title } = CREATE_LOGIN_PASSWORD_FIELD;
    const { passwordHidden } = CREATE_LOGIN_ENTERED_FIELDS;
    await this.passwordFieldLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password field on login item page should be visible' });
    await this.passwordFieldIconLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password field icon on login item page should be visible' });
    await this.passwordFieldTitleLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password field title on login item page should be visible' });
    await this.passwordFieldInputLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password field hidden input on login item page should be visible' });
    await this.passwordFieldCopyButtonLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password field copy button on login item page should be visible' });
    await this.passwordFieldShowPasswordButtonLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Password field show password button on login item page should be visible' });
    const titleActual = (await this.passwordFieldTitleLoginItemPage.getText()) ?? (await this.passwordFieldTitleLoginItemPage.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.passwordFieldInputLoginItemPage.getText()) ?? (await this.passwordFieldInputLoginItemPage.getAttribute('text')) ?? '';
    expect(inputActual).toBe(passwordHidden);
    return this;
  }

  async verifyPasswordLoginItemPageVisible(mode: PasswordVisibilityType): Promise<this> {
    const { password, passwordHidden } = CREATE_LOGIN_ENTERED_FIELDS;
    const isHidden = mode === 'hidden';
    const inputElement = isHidden ? this.passwordFieldInputLoginItemPage : this.passwordFieldInputShowLoginItemPage;
    const expectedText = isHidden ? passwordHidden : password;
    await inputElement.waitForDisplayed({ timeout: 10000, timeoutMsg: `Password field ${mode} input on login item page should be visible` });
    const textActual = (await inputElement.getText()) ?? (await inputElement.getAttribute('text')) ?? '';
    expect(textActual).toBe(expectedText);
    return this;
  }

  async tapShowPasswordButtonLoginItemPage(): Promise<this> {
    await this.passwordFieldShowPasswordButtonLoginItemPage.click();
    return this;
  }

  get passwordFieldHidePasswordButtonLoginItemPage() { return this.$('passwordFieldHidePasswordButtonLoginItemPage'); }

  async tapHidePasswordButtonLoginItemPage(): Promise<this> {
    await this.passwordFieldHidePasswordButtonLoginItemPage.click();
    return this;
  }

  get notesFieldLoginItemPage() { return this.$('notesFieldLoginItemPage'); }
  get notesFieldIconLoginItemPage() { return this.$('notesFieldIconLoginItemPage'); }
  get notesFieldTitleLoginItemPage() { return this.$('notesFieldTitleLoginItemPage'); }
  get notesFieldInputLoginItemPage() { return this.$('notesFieldInputLoginItemPage'); }
  get notesFieldCopyButtonLoginItemPage() { return this.$('notesFieldCopyButtonLoginItemPage'); }

  async verifyNotesFieldLoginItemPageAllElementsVisible(): Promise<this> {
    const { title } = CREATE_LOGIN_NOTE_FIELD;
    const { note } = CREATE_LOGIN_ENTERED_FIELDS;
    await this.notesFieldLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Notes field on login item page should be visible' });
    await this.notesFieldIconLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Notes field icon on login item page should be visible' });
    await this.notesFieldTitleLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Notes field title on login item page should be visible' });
    await this.notesFieldInputLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Notes field input on login item page should be visible' });
    await this.notesFieldCopyButtonLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Notes field copy button on login item page should be visible' });
    const titleActual = (await this.notesFieldTitleLoginItemPage.getText()) ?? (await this.notesFieldTitleLoginItemPage.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.notesFieldInputLoginItemPage.getText()) ?? (await this.notesFieldInputLoginItemPage.getAttribute('text')) ?? '';
    expect(inputActual).toBe(note);
    return this;
  }

  get copyToastLoginItemPage() { return this.$('copyToastLoginItemPage'); }
  get copyToastTextLoginItemPage() { return this.$('copyToastTextLoginItemPage'); }

  async verifyCopyToastLoginItemPageVisible(): Promise<this> {
    const { text } = COPY_TOAST_LOGIN_ITEM_PAGE;
    await this.copyToastLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy toast on login item page should be visible' });
    await this.copyToastTextLoginItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy toast text on login item page should be visible' });
    const textActual = (await this.copyToastTextLoginItemPage.getText()) ?? (await this.copyToastTextLoginItemPage.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  get favoriteBadgeOnLoginItem() { return this.$('favoriteBadgeOnLoginItem'); }

  async verifyFavoriteBadgeOnLoginItemVisible(): Promise<this> {
    await this.favoriteBadgeOnLoginItem.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Favorite badge on login item should be visible' });
    return this;
  }

  async verifyItemRemovedFromFavorites(): Promise<this> {
    await this.favoriteBadgeOnLoginItem.waitForDisplayed({ timeout: 10000, reverse: true, timeoutMsg: 'Favorite badge on login item should not be visible' });
    return this;
  }

  async verifyAllCreatedLoginsVisible(): Promise<this> {
    await this.loginCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Login created on home page should be visible' });
    return this;
  }

  async verifyAllCreatedCreditCardsVisible(): Promise<this> {
    await this.creditCardCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Credit card created on home page should be visible' });
    return this;
  }

  async verifyAllCreatedWifiVisible(): Promise<this> {
    await this.wifiCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi created on home page should be visible' });
    return this;
  }

  async verifyAllCreatedRecoveryPhrasesVisible(): Promise<this> {
    await this.recoveryPhraseCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase created on home page should be visible' });
    return this;
  }

  async verifyAllCreatedIdentitiesVisible(): Promise<this> {
    await this.identityCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity created on home page should be visible' });
    return this;
  }

  async verifyAllCreatedNotesVisible(): Promise<this> {
    await this.noteCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note created on home page should be visible' });
    return this;
  }

  async verifyAllCreatedCustomElementsVisible(): Promise<this> {
    await this.customElementCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom element created on home page should be visible' });
    return this;
  }

  async verifyAllCreatedItemsVisible(): Promise<this> {
    await this.loginCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Login created on home page should be visible' });
    await this.creditCardCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Credit card created on home page should be visible' });
    await this.wifiCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi created on home page should be visible' });
    await this.recoveryPhraseCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Recovery phrase created on home page should be visible' });
    await this.identityCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity created on home page should be visible' });
    await this.noteCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note created on home page should be visible' });
    await this.customElementCreatedOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom element created on home page should be visible' });
    return this;
  }
}

export default CreatedLoginItemPage;