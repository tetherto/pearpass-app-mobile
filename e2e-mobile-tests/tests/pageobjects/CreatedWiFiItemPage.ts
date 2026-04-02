import BasePage from '@pages/BasePage';
import createdWiFiItemLocators from '@locators/CreatedWiFiItemLocators';
import { AVATAR_IMAGE_WIFI_ITEM_PAGE, COPY_WIFI_PASSWORD_BUTTON, DELETE_ELEMENT_BUTTON, EDIT_BUTTON, MARK_AS_FAVORITE_BUTTON, NOTE_FIELD_WIFI_ITEM_PAGE, PASSWORD_COPIED_TOAST_WIFI_ITEM_PAGE, QR_CODE_WIFI_ITEM_PAGE_FIELD, REMOVE_FROM_FAVORITES_BUTTON, TITLE_WIFI_ITEM_PAGE, WIFI_PASSWORD_FIELD_WIFI_ITEM_PAGE } from '@data/createdWiFiItem.data';
import { CREATE_WIFI_ENTERED_FIELDS } from '@data/home-data/createWiFi.data';

declare const expect: any;

export class CreatedWiFiItemPage extends BasePage {
  protected selectors = createdWiFiItemLocators;

  get createdWiFiItemOnHomePage() { return this.$('createdWiFiItemOnHomePage'); }

  async tapCreatedWiFiItemOnHomePage(): Promise<this> {
    await this.createdWiFiItemOnHomePage.click();
    return this;
  }

  get createdWiFiItemThreeDotsButton() { return this.$('createdWiFiItemThreeDotsButton'); }

  async tapThreeDotsButtonOnCreatedWiFi(): Promise<this> {
    await this.createdWiFiItemThreeDotsButton.click();
    return this;
  }

  get createdWiFiItemThreeDotsPopup() { return this.$('createdWiFiItemThreeDotsPopup'); }

  async verifyThreeDotsMenuPopupVisible(): Promise<this> {
    await this.createdWiFiItemThreeDotsPopup.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Three dots menu popup should be visible' });
    return this;
  }

  get copyWiFiPasswordButton() { return this.$('copyWiFiPasswordButton'); }
  get copyWiFiPasswordIcon() { return this.$('copyWiFiPasswordIcon'); }
  get copyWiFiPasswordButtonText() { return this.$('copyWiFiPasswordButtonText'); }
  get copyWifiPasswordThreeDotsIcon() { return this.$('copyWifiPasswordThreeDotsIcon'); }

  async verifyCopyWiFiPasswordButtonAllElementsVisible(): Promise<this> {
    const { text } = COPY_WIFI_PASSWORD_BUTTON;
    await this.copyWiFiPasswordButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Wi-Fi Password button should be visible' });
    await this.copyWiFiPasswordIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Wi-Fi Password icon should be visible' });
    await this.copyWiFiPasswordButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Wi-Fi Password button text should be visible' });
    await this.copyWifiPasswordThreeDotsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Wi-Fi Password three dots icon should be visible' });
    const textActual = (await this.copyWiFiPasswordButtonText.getText()) ?? (await this.copyWiFiPasswordButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async tapCopyWiFiPasswordButton(): Promise<this> {
    await this.copyWiFiPasswordButton.click();
    return this;
  }

  get markAsFavoriteButton() { return this.$('markAsFavoriteButton'); }
  get markAsFavoriteIcon() { return this.$('markAsFavoriteIcon'); }
  get markAsFavoriteButtonText() { return this.$('markAsFavoriteButtonText'); }
  get markAsFavoriteThreeDotsIcon() { return this.$('markAsFavoriteThreeDotsIcon'); }

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

  async tapMarkAsFavoriteButtonOnCreatedWiFiPage(): Promise<this> {
    await this.markAsFavoriteButton.click();
    return this;
  }

  get editButton() { return this.$('editButton'); }
  get editIcon() { return this.$('editIcon'); }
  get editButtonText() { return this.$('editButtonText'); }
  get editThreeDotsIcon() { return this.$('editThreeDotsIcon'); }

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

  get deleteElementButton() { return this.$('deleteElementButton'); }
  get deleteElementIcon() { return this.$('deleteElementIcon'); }
  get deleteElementButtonText() { return this.$('deleteElementButtonText'); }
  get deleteElementThreeDotsIcon() { return this.$('deleteElementThreeDotsIcon'); }

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

  get markAsFavoriteBadgeOnHomePage() { return this.$('markAsFavoriteBadgeOnHomePage'); }

  async verifyWiFiItemMarkedAsFavorite(): Promise<this> {
    await this.markAsFavoriteBadgeOnHomePage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Favorite badge on Wi-Fi item should be visible' });
    return this;
  }

  async verifyWiFiItemRemovedFromFavoritesOnHomePage(): Promise<this> {
    await this.markAsFavoriteBadgeOnHomePage.waitForDisplayed({ timeout: 10000, reverse: true, timeoutMsg: 'Favorite badge on Wi-Fi item should not be visible' });
    return this;
  }

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

  async tapRemoveFromFavoritesButtonOnCreatedWiFiPage(): Promise<this> {
    await this.removeFromFavoritesButton.click();
    return this;
  }

  get titleWiFiItemPageOnCreatedWiFiItemPage() { return this.$('titleWiFiItemPageOnCreatedWiFiItemPage'); }

  async verifyTitleWiFiItemPageVisibleOnCreatedWiFiItemPage(): Promise<this> {
    const { title } = TITLE_WIFI_ITEM_PAGE;
    await this.titleWiFiItemPageOnCreatedWiFiItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Title on Wi-Fi item page should be visible' });
    const titleActual = (await this.titleWiFiItemPageOnCreatedWiFiItemPage.getText()) ?? (await this.titleWiFiItemPageOnCreatedWiFiItemPage.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this;
  }

  get backButtonWiFiItemPage() { return this.$('backButtonWiFiItemPage'); }

  async verifyBackButtonWiFiItemPageVisibleOnCreatedWiFiItemPage(): Promise<this> {
    await this.backButtonWiFiItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Back button on Wi-Fi item page should be visible' });
    return this;
  }

  async tapBackButtonOnCreatedWiFiItemPage(): Promise<this> {
    await this.backButtonWiFiItemPage.click();
    return this;
  }

  get favoriteButtonUncheckedWiFiItemPage() { return this.$('favoriteButtonUncheckedWiFiItemPage'); }

  async verifyFavoriteButtonUncheckedWiFiItemPageVisibleOnCreatedWiFiItemPage(): Promise<this> {
    await this.favoriteButtonUncheckedWiFiItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Favorite button unchecked on Wi-Fi item page should be visible' });
    return this;
  }

  get editButtonWiFiItemPage() { return this.$('editButtonWiFiItemPage'); }
  get editButtonIconWiFiItemPage() { return this.$('editButtonIconWiFiItemPage'); }
  get editButtonTextWiFiItemPage() { return this.$('editButtonTextWiFiItemPage'); }

  async verifyEditButtonWiFiItemPageAllElementsVisibleOnCreatedWiFiItemPage(): Promise<this> {
    const { text } = EDIT_BUTTON;
    await this.editButtonWiFiItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit button on Wi-Fi item page should be visible' });
    await this.editButtonIconWiFiItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit button icon on Wi-Fi item page should be visible' });
    await this.editButtonTextWiFiItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit button text on Wi-Fi item page should be visible' });
    const textActual = (await this.editButtonTextWiFiItemPage.getText()) ?? (await this.editButtonTextWiFiItemPage.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async tapEditButtonOnCreatedWiFiItemPage(): Promise<this> {
    await this.editButtonWiFiItemPage.click();
    return this;
  }

  get threeDotsButtonWiFiItemPage() { return this.$('threeDotsButtonWiFiItemPage'); }

  async verifyThreeDotsButtonWiFiItemPageVisibleOnCreatedWiFiItemPage(): Promise<this> {
    await this.threeDotsButtonWiFiItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Three dots button on Wi-Fi item page should be visible' });
    return this;
  }

  get avatarImageWiFiItemPageIcon() { return this.$('avatarImageWiFiItemPageIcon'); }
  get avatarImageWiFiItemPageText() { return this.$('avatarImageWiFiItemPageText'); }

  async verifyAvatarImageWiFiItemPageVisibleOnCreatedWiFiItemPage(): Promise<this> {
    const { text } = AVATAR_IMAGE_WIFI_ITEM_PAGE;
    await this.avatarImageWiFiItemPageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Avatar image icon on Wi-Fi item page should be visible' });
    await this.avatarImageWiFiItemPageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Avatar image text on Wi-Fi item page should be visible' });
    const textActual = (await this.avatarImageWiFiItemPageText.getText()) ?? (await this.avatarImageWiFiItemPageText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  get wifiPasswordFieldWiFiItemPage() { return this.$('wifiPasswordFieldWiFiItemPage'); }
  get wifiPasswordFieldWiFiItemPageIcon() { return this.$('wifiPasswordFieldWiFiItemPageIcon'); }
  get wifiPasswordFieldWiFiItemPageTitle() { return this.$('wifiPasswordFieldWiFiItemPageTitle'); }
  get wifiPasswordFieldWiFiItemPageInputHidden() { return this.$('wifiPasswordFieldWiFiItemPageInputHidden'); }
  get wifiPasswordFieldWiFiItemPageInputVisible() { return this.$('wifiPasswordFieldWiFiItemPageInputVisible'); }
  get wifiPasswordFieldWiFiItemPageShowPasswordIconButton() { return this.$('wifiPasswordFieldWiFiItemPageShowPasswordIconButton'); }
  get wifiPasswordFieldWiFiItemPageCopyButton() { return this.$('wifiPasswordFieldWiFiItemPageCopyButton'); }
  get passwordCopiedToast() { return this.$('passwordCopiedToast'); }
  get passwordCopiedToastText() { return this.$('passwordCopiedToastText'); }

  async verifyWiFiPasswordFieldWiFiItemPageAllElementsVisibleOnCreatedWiFiItemPage(): Promise<this> {
    const { title, inputHidden } = WIFI_PASSWORD_FIELD_WIFI_ITEM_PAGE;
    await this.wifiPasswordFieldWiFiItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Password field on Wi-Fi item page should be visible' });
    await this.wifiPasswordFieldWiFiItemPageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Password field icon should be visible' });
    await this.wifiPasswordFieldWiFiItemPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Password field title should be visible' });
    await this.wifiPasswordFieldWiFiItemPageInputHidden.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Password field hidden input should be visible' });
    await this.wifiPasswordFieldWiFiItemPageShowPasswordIconButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Password show password button should be visible' });
    await this.wifiPasswordFieldWiFiItemPageCopyButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Password copy button should be visible' });
    const titleActual = (await this.wifiPasswordFieldWiFiItemPageTitle.getText()) ?? (await this.wifiPasswordFieldWiFiItemPageTitle.getAttribute('text')) ?? '';
    const inputHiddenActual = (await this.wifiPasswordFieldWiFiItemPageInputHidden.getText()) ?? (await this.wifiPasswordFieldWiFiItemPageInputHidden.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    expect(inputHiddenActual).toBe(inputHidden);
    return this;
  }

  async tapShowPasswordIconButtonOnCreatedWiFiItemPage(): Promise<this> {
    await this.wifiPasswordFieldWiFiItemPageShowPasswordIconButton.click();
    return this;
  }

  async tapCopyWiFiPasswordButtonOnCreatedWiFiItemPage(): Promise<this> {
    await this.wifiPasswordFieldWiFiItemPageCopyButton.click();
    return this;
  }

  async verifyWiFiPasswordCopiedToastDisplayed(): Promise<this> {
    const { text } = PASSWORD_COPIED_TOAST_WIFI_ITEM_PAGE;
    await this.passwordCopiedToast.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Password copied toast on Wi-Fi item page should be visible',
    });
    await this.passwordCopiedToastText.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Password copied toast text on Wi-Fi item page should be visible',
    });
    const textActual =
      (await this.passwordCopiedToastText.getText()) ??
      (await this.passwordCopiedToastText.getAttribute('text')) ??
      '';
    expect(textActual).toBe(text);
    return this;
  }

  async verifyWiFiPasswordFieldWiFiItemPageInputVisible(): Promise<this> {
    const { inputVisible } = WIFI_PASSWORD_FIELD_WIFI_ITEM_PAGE;
    await this.wifiPasswordFieldWiFiItemPageInputVisible.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Wi-Fi Password visible input should be visible' });
    const textActual = (await this.wifiPasswordFieldWiFiItemPageInputVisible.getText()) ?? (await this.wifiPasswordFieldWiFiItemPageInputVisible.getAttribute('text')) ?? '';
    expect(textActual).toBe(inputVisible);
    return this;
  }

  get qrCodeWiFiItemPageField() { return this.$('qrCodeWiFiItemPageField'); }
  get qrCodeWiFiItemPageFieldTitle() { return this.$('qrCodeWiFiItemPageFieldTitle'); }
  get qrCodeWiFiItemPageFieldCode() { return this.$('qrCodeWiFiItemPageFieldCode'); }

  async verifyQRCodeWiFiItemPageFieldAllElementsVisibleOnCreatedWiFiItemPage(): Promise<this> {
    const { title } = QR_CODE_WIFI_ITEM_PAGE_FIELD;
    await this.qrCodeWiFiItemPageField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'QR Code field on Wi-Fi item page should be visible' });
    await this.qrCodeWiFiItemPageFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'QR Code field title should be visible' });
    await this.qrCodeWiFiItemPageFieldCode.waitForDisplayed({ timeout: 10000, timeoutMsg: 'QR Code field code should be visible' });
    const titleActual = (await this.qrCodeWiFiItemPageFieldTitle.getText()) ?? (await this.qrCodeWiFiItemPageFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this;
  }

  get noteFieldWiFiItemPage() { return this.$('noteFieldWiFiItemPage'); }
  get noteFieldWiFiItemPageIcon() { return this.$('noteFieldWiFiItemPageIcon'); }
  get noteFieldWiFiItemPageTitle() { return this.$('noteFieldWiFiItemPageTitle'); }
  get noteFieldWiFiItemPageInput() { return this.$('noteFieldWiFiItemPageInput'); }
  get noteFieldWiFiItemPageCopyButton() { return this.$('noteFieldWiFiItemPageCopyButton'); }
  get updatedCommentFieldTextWiFiItemPage() { return this.$('updatedCommentFieldTextWiFiItemPage'); }

  async verifyNoteFieldWiFiItemPageAllElementsVisibleOnCreatedWiFiItemPage(): Promise<this> {
    const { title, input } = NOTE_FIELD_WIFI_ITEM_PAGE;
    await this.noteFieldWiFiItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field on Wi-Fi item page should be visible' });
    await this.noteFieldWiFiItemPageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field icon should be visible' });
    await this.noteFieldWiFiItemPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field title should be visible' });
    await this.noteFieldWiFiItemPageInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field input should be visible' });
    await this.noteFieldWiFiItemPageCopyButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field copy button should be visible' });
    const titleActual = (await this.noteFieldWiFiItemPageTitle.getText()) ?? (await this.noteFieldWiFiItemPageTitle.getAttribute('text')) ?? '';
    const inputActual = (await this.noteFieldWiFiItemPageInput.getText()) ?? (await this.noteFieldWiFiItemPageInput.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    expect(inputActual).toBe(input);
    return this;
  }

  async verifyUpdatedCommentFieldTextWiFiItemPageVisible(): Promise<this> {
    const { updatedNote } = CREATE_WIFI_ENTERED_FIELDS;
    await this.updatedCommentFieldTextWiFiItemPage.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Updated Wi-Fi note text should be visible',
    });
    const textActual =
      (await this.updatedCommentFieldTextWiFiItemPage.getText()) ??
      (await this.updatedCommentFieldTextWiFiItemPage.getAttribute('text')) ??
      '';
    expect(textActual).toBe(updatedNote);
    return this;
  }
}

export default CreatedWiFiItemPage;