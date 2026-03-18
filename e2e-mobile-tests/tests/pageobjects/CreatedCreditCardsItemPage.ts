import BasePage from '@pages/BasePage';
import createdCreditCardsLocators from '@locators/CreatedCreditCardsLocators';
import { AVATAR_IMAGE_CREDIT_CARDS_ITEM_PAGE, COPIED_TOAST_CREDIT_CARDS_ITEM_PAGE, COPY_NAME_ON_CARD_BUTTON, COPY_NUMBER_ON_CARD_BUTTON, DELETE_ELEMENT_BUTTON, EDIT_BUTTON, EDIT_BUTTON_CREDIT_CARDS_ITEM_PAGE, EXPIRATION_DATE_FIELD_CREDIT_CARDS_ITEM_PAGE, FILE_FIELD_CREDIT_CARDS_ITEM_PAGE, MARK_AS_FAVORITE_BUTTON, NAME_ON_CARD_FIELD_CREDIT_CARDS_ITEM_PAGE, NOTES_FIELD_CREDIT_CARDS_ITEM_PAGE, NUMBER_ON_CARD_FIELD_CREDIT_CARDS_ITEM_PAGE, PIN_CODE_FIELD_CREDIT_CARDS_ITEM_PAGE, REMOVE_FROM_FAVORITES_BUTTON, SECURITY_CODE_FIELD_CREDIT_CARDS_ITEM_PAGE, TITLE_CREDIT_CARDS_ITEM_PAGE } from '@data/createdCreditCardsItem.data';

declare const expect: any;

export class CreatedCreditCardsItemPage extends BasePage {
  protected selectors = createdCreditCardsLocators;

  get createdCreditCardsItemOnHomePage() { return this.$('createdCreditCardsItemOnHomePage'); }

  async tapCreatedCreditCardsItem(): Promise<this> {
    await this.createdCreditCardsItemOnHomePage.click();
    return this;
  }

  get createdCreditCardThreeDotsButton() { return this.$('createdCreditCardThreeDotsButton'); }

  async tapThreeDotsButtonOnCreatedCreditCards(): Promise<this> {
    await this.createdCreditCardThreeDotsButton.click();
    return this;
  }

  get createdCreditCardThreeDotsPopup() { return this.$('createdCreditCardThreeDotsPopup'); }

  async verifyThreeDotsMenuPopupVisible(): Promise<this> {
    await this.createdCreditCardThreeDotsPopup.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Three dots menu popup should be visible' });
    return this;
  }

  get copyNameOnCardButton() { return this.$('copyNameOnCardButton'); }
  get copyNameOnCardIcon() { return this.$('copyNameOnCardIcon'); }
  get copyNameOnCardButtonText() { return this.$('copyNameOnCardButtonText'); }
  get nameOnCardThreeDotsIcon() { return this.$('nameOnCardThreeDotsIcon'); }

  async verifyCopyNameOnCardButtonAllElementsVisible(): Promise<this> {
    const { text } = COPY_NAME_ON_CARD_BUTTON;
    await this.copyNameOnCardButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Name on card button should be visible' });
    await this.copyNameOnCardIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Name on card icon should be visible' });
    await this.copyNameOnCardButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Name on card button text should be visible' });
    await this.nameOnCardThreeDotsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Name on card three dots icon should be visible' });
    const textActual = (await this.copyNameOnCardButtonText.getText()) ?? (await this.copyNameOnCardButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async tapCopyNameOnCardButton(): Promise<this> {
    await this.copyNameOnCardButton.click();
    return this;
  }

  get copyNumberOnCardButton() { return this.$('copyNumberOnCardButton'); }
  get copyNumberOnCardIcon() { return this.$('copyNumberOnCardIcon'); }
  get copyNumberOnCardButtonText() { return this.$('copyNumberOnCardButtonText'); }
  get numberOnCardThreeDotsIcon() { return this.$('numberOnCardThreeDotsIcon'); }

  async verifyCopyNumberOnCardButtonAllElementsVisible(): Promise<this> {
    const { text } = COPY_NUMBER_ON_CARD_BUTTON;
    await this.copyNumberOnCardButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Number on card button should be visible' });
    await this.copyNumberOnCardIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Number on card icon should be visible' });
    await this.copyNumberOnCardButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Number on card button text should be visible' });
    await this.numberOnCardThreeDotsIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy Number on card three dots icon should be visible' });
    const textActual = (await this.copyNumberOnCardButtonText.getText()) ?? (await this.copyNumberOnCardButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async tapCopyNumberOnCardButton(): Promise<this> {
    await this.copyNumberOnCardButton.click();
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

  async tapMarkAsFavoriteButton(): Promise<this> {
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

  async tapRemoveFromFavoritesButton(): Promise<this> {
    await this.removeFromFavoritesButton.click();
    return this;
  }

  get favoriteBadgeOnCreditCardItem() { return this.$('favoriteBadgeOnCreditCardItem'); }

  async verifyItemMarkedAsFavorite(): Promise<this> {
    await this.favoriteBadgeOnCreditCardItem.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Favorite badge on credit card item should be visible' });
    return this;
  }

  async verifyItemRemovedFromFavorites(): Promise<this> {
    await this.favoriteBadgeOnCreditCardItem.waitForDisplayed({ timeout: 10000, reverse: true, timeoutMsg: 'Favorite badge on credit card item should not be visible' });
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

  get avatarImageCreditCardsItemPage() { return this.$('avatarImageCreditCardsItemPage'); }

  async verifyTitleCreditCardsItemPageVisible(): Promise<this> {
    const { title } = TITLE_CREDIT_CARDS_ITEM_PAGE;
    await this.avatarImageCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Title on credit cards item page should be visible' });
    const titleActual = (await this.avatarImageCreditCardsItemPage.getText()) ?? (await this.avatarImageCreditCardsItemPage.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this;
  }

  get backButtonCreditCardsItemPage() { return this.$('backButtonCreditCardsItemPage'); }

  async verifyBackButtonCreditCardsItemPageVisible(): Promise<this> {
    await this.backButtonCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Back button on credit cards item page should be visible' });
    return this;
  }

  get favoriteButtonUncheckedCreditCardsItemPage() { return this.$('favoriteButtonUncheckedCreditCardsItemPage'); }

  async verifyFavoriteButtonUncheckedCreditCardsItemPageVisible(): Promise<this> {
    await this.favoriteButtonUncheckedCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Favorite button unchecked on credit cards item page should be visible' });
    return this;
  }

  get editButtonCreditCardsItemPage() { return this.$('editButtonCreditCardsItemPage'); }
  get editButtonIconCreditCardsItemPage() { return this.$('editButtonIconCreditCardsItemPage'); }
  get editButtonTextCreditCardsItemPage() { return this.$('editButtonTextCreditCardsItemPage'); }

  async verifyEditButtonCreditCardsItemPageAllElementsVisible(): Promise<this> {
    const { text } = EDIT_BUTTON_CREDIT_CARDS_ITEM_PAGE;
    await this.editButtonCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit button on credit cards item page should be visible' });
    await this.editButtonIconCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit button icon on credit cards item page should be visible' });
    await this.editButtonTextCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Edit button text on credit cards item page should be visible' });
    const textActual = (await this.editButtonTextCreditCardsItemPage.getText()) ?? (await this.editButtonTextCreditCardsItemPage.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  get threeDotsButtonCreditCardsItemPage() { return this.$('threeDotsButtonCreditCardsItemPage'); }

  async verifyThreeDotsButtonCreditCardsItemPageVisible(): Promise<this> {
    await this.threeDotsButtonCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Three dots button on credit cards item page should be visible' });
    return this;
  }

  get avatarImageCreditCardsItemPageIcon() { return this.$('avatarImageCreditCardsItemPageIcon'); }

  async verifyAvatarImageCreditCardsItemPageVisible(): Promise<this> {
    const { text } = AVATAR_IMAGE_CREDIT_CARDS_ITEM_PAGE;
    await this.avatarImageCreditCardsItemPageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Avatar image icon on credit cards item page should be visible' });
    await this.avatarImageCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Avatar image (title) on credit cards item page should be visible' });
    const textActual = (await this.avatarImageCreditCardsItemPage.getText()) ?? (await this.avatarImageCreditCardsItemPage.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  get nameOnCardFieldCreditCardsItemPage() { return this.$('nameOnCardFieldCreditCardsItemPage'); }
  get nameOnCardFieldCreditCardsItemPageIcon() { return this.$('nameOnCardFieldCreditCardsItemPageIcon'); }
  get nameOnCardFieldCreditCardsItemPageTitle() { return this.$('nameOnCardFieldCreditCardsItemPageTitle'); }
  get nameOnCardFieldCreditCardsItemPageInput() { return this.$('nameOnCardFieldCreditCardsItemPageInput'); }
  get nameOnCardFieldCreditCardsItemPageCopyButton() { return this.$('nameOnCardFieldCreditCardsItemPageCopyButton'); }

  async verifyNameOnCardFieldCreditCardsItemPageAllElementsVisible(): Promise<this> {
    const { title, input } = NAME_ON_CARD_FIELD_CREDIT_CARDS_ITEM_PAGE;
    await this.nameOnCardFieldCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Name on card field on credit cards item page should be visible' });
    await this.nameOnCardFieldCreditCardsItemPageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Name on card field icon on credit cards item page should be visible' });
    await this.nameOnCardFieldCreditCardsItemPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Name on card field title on credit cards item page should be visible' });
    await this.nameOnCardFieldCreditCardsItemPageInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Name on card field input on credit cards item page should be visible' });
    await this.nameOnCardFieldCreditCardsItemPageCopyButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Name on card field copy button on credit cards item page should be visible' });
    const titleActual = (await this.nameOnCardFieldCreditCardsItemPageTitle.getText()) ?? (await this.nameOnCardFieldCreditCardsItemPageTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.nameOnCardFieldCreditCardsItemPageInput.getText()) ?? (await this.nameOnCardFieldCreditCardsItemPageInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(input);
    return this;
  }

  get numberOnCardFieldCreditCardsItemPage() { return this.$('numberOnCardFieldCreditCardsItemPage'); }
  get numberOnCardFieldCreditCardsItemPageIcon() { return this.$('numberOnCardFieldCreditCardsItemPageIcon'); }
  get numberOnCardFieldCreditCardsItemPageTitle() { return this.$('numberOnCardFieldCreditCardsItemPageTitle'); }
  get numberOnCardFieldCreditCardsItemPageInput() { return this.$('numberOnCardFieldCreditCardsItemPageInput'); }
  get numberOnCardFieldCreditCardsItemPageCopyButton() { return this.$('numberOnCardFieldCreditCardsItemPageCopyButton'); }

  async verifyNumberOnCardFieldCreditCardsItemPageAllElementsVisible(): Promise<this> {
    const { title, input } = NUMBER_ON_CARD_FIELD_CREDIT_CARDS_ITEM_PAGE;
    await this.numberOnCardFieldCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Number on card field on credit cards item page should be visible' });
    await this.numberOnCardFieldCreditCardsItemPageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Number on card field icon on credit cards item page should be visible' });
    await this.numberOnCardFieldCreditCardsItemPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Number on card field title on credit cards item page should be visible' });
    await this.numberOnCardFieldCreditCardsItemPageInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Number on card field input on credit cards item page should be visible' });
    await this.numberOnCardFieldCreditCardsItemPageCopyButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Number on card field copy button on credit cards item page should be visible' });
    const titleActual = (await this.numberOnCardFieldCreditCardsItemPageTitle.getText()) ?? (await this.numberOnCardFieldCreditCardsItemPageTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.numberOnCardFieldCreditCardsItemPageInput.getText()) ?? (await this.numberOnCardFieldCreditCardsItemPageInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(input);
    return this;
  }

  get expirationDateFieldCreditCardsItemPage() { return this.$('expirationDateFieldCreditCardsItemPage'); }
  get expirationDateFieldCreditCardsItemPageIcon() { return this.$('expirationDateFieldCreditCardsItemPageIcon'); }
  get expirationDateFieldCreditCardsItemPageTitle() { return this.$('expirationDateFieldCreditCardsItemPageTitle'); }
  get expirationDateFieldCreditCardsItemPageInput() { return this.$('expirationDateFieldCreditCardsItemPageInput'); }
  get expirationDateFieldCreditCardsItemPageCopyButton() { return this.$('expirationDateFieldCreditCardsItemPageCopyButton'); }

  async verifyExpirationDateFieldCreditCardsItemPageAllElementsVisible(): Promise<this> {
    const { title, input } = EXPIRATION_DATE_FIELD_CREDIT_CARDS_ITEM_PAGE;
    await this.expirationDateFieldCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Expiration date field on credit cards item page should be visible' });
    await this.expirationDateFieldCreditCardsItemPageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Expiration date field icon on credit cards item page should be visible' });
    await this.expirationDateFieldCreditCardsItemPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Expiration date field title on credit cards item page should be visible' });
    await this.expirationDateFieldCreditCardsItemPageInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Expiration date field input on credit cards item page should be visible' });
    await this.expirationDateFieldCreditCardsItemPageCopyButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Expiration date field copy button on credit cards item page should be visible' });
    const titleActual = (await this.expirationDateFieldCreditCardsItemPageTitle.getText()) ?? (await this.expirationDateFieldCreditCardsItemPageTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.expirationDateFieldCreditCardsItemPageInput.getText()) ?? (await this.expirationDateFieldCreditCardsItemPageInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(input);
    return this;
  }

  async tapCopyExpirationDateButton(): Promise<this> {
    await this.expirationDateFieldCreditCardsItemPageCopyButton.click();
    return this;
  }

  get securityCodeFieldCreditCardsItemPage() { return this.$('securityCodeFieldCreditCardsItemPage'); }
  get securityCodeFieldCreditCardsItemPageIcon() { return this.$('securityCodeFieldCreditCardsItemPageIcon'); }
  get securityCodeFieldCreditCardsItemPageTitle() { return this.$('securityCodeFieldCreditCardsItemPageTitle'); }
  get securityCodeFieldCreditCardsItemPageInputHidden() { return this.$('securityCodeFieldCreditCardsItemPageInputHidden'); }
  get securityCodeFieldCreditCardsItemPageInputVisible() { return this.$('securityCodeFieldCreditCardsItemPageInputVisible'); }
  get securityCodeFieldCreditCardsItemPageShowPasswordIconButton() { return this.$('securityCodeFieldCreditCardsItemPageShowPasswordIconButton'); }
  get securityCodeFieldCreditCardsItemPageCopyButton() { return this.$('securityCodeFieldCreditCardsItemPageCopyButton'); }

  async verifySecurityCodeFieldCreditCardsItemPageAllElementsVisible(): Promise<this> {
    const { title, inputHidden } = SECURITY_CODE_FIELD_CREDIT_CARDS_ITEM_PAGE;
    await this.securityCodeFieldCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Security code field on credit cards item page should be visible' });
    await this.securityCodeFieldCreditCardsItemPageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Security code field icon on credit cards item page should be visible' });
    await this.securityCodeFieldCreditCardsItemPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Security code field title on credit cards item page should be visible' });
    await this.securityCodeFieldCreditCardsItemPageInputHidden.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Security code field hidden input on credit cards item page should be visible' });
    await this.securityCodeFieldCreditCardsItemPageShowPasswordIconButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Security code field show password button on credit cards item page should be visible' });
    await this.securityCodeFieldCreditCardsItemPageCopyButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Security code field copy button on credit cards item page should be visible' });
    const titleActual = (await this.securityCodeFieldCreditCardsItemPageTitle.getText()) ?? (await this.securityCodeFieldCreditCardsItemPageTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.securityCodeFieldCreditCardsItemPageInputHidden.getText()) ?? (await this.securityCodeFieldCreditCardsItemPageInputHidden.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputHidden);
    return this;
  }

  async tapShowSecurityCodeIconButton(): Promise<this> {
    await this.securityCodeFieldCreditCardsItemPageShowPasswordIconButton.click();
    return this;
  }

  async tapCopySecurityCodeButton(): Promise<this> {
    await this.securityCodeFieldCreditCardsItemPageCopyButton.click();
    return this;
  }

  async verifySecurityCodePasswordIsVisible(): Promise<this> {
    const { inputVisible } = SECURITY_CODE_FIELD_CREDIT_CARDS_ITEM_PAGE;
    await this.securityCodeFieldCreditCardsItemPageInputVisible.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Security code visible input on credit cards item page should be visible' });
    const textActual = (await this.securityCodeFieldCreditCardsItemPageInputVisible.getText()) ?? (await this.securityCodeFieldCreditCardsItemPageInputVisible.getAttribute('text')) ?? '';
    expect(textActual).toBe(inputVisible);
    return this;
  }

  get pinCodeFieldCreditCardsItemPage() { return this.$('pinCodeFieldCreditCardsItemPage'); }
  get pinCodeFieldCreditCardsItemPageIcon() { return this.$('pinCodeFieldCreditCardsItemPageIcon'); }
  get pinCodeFieldCreditCardsItemPageTitle() { return this.$('pinCodeFieldCreditCardsItemPageTitle'); }
  get pinCodeFieldCreditCardsItemPageInputHidden() { return this.$('pinCodeFieldCreditCardsItemPageInputHidden'); }
  get pinCodeFieldCreditCardsItemPageInputVisible() { return this.$('pinCodeFieldCreditCardsItemPageInputVisible'); }
  get pinCodeFieldCreditCardsItemPageShowPasswordIconButton() { return this.$('pinCodeFieldCreditCardsItemPageShowPasswordIconButton'); }
  get pinCodeFieldCreditCardsItemPageCopyButton() { return this.$('pinCodeFieldCreditCardsItemPageCopyButton'); }

  async verifyPinCodeFieldCreditCardsItemPageAllElementsVisible(): Promise<this> {
    const { title, inputHidden } = PIN_CODE_FIELD_CREDIT_CARDS_ITEM_PAGE;
    await this.pinCodeFieldCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pin code field on credit cards item page should be visible' });
    await this.pinCodeFieldCreditCardsItemPageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pin code field icon on credit cards item page should be visible' });
    await this.pinCodeFieldCreditCardsItemPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pin code field title on credit cards item page should be visible' });
    await this.pinCodeFieldCreditCardsItemPageInputHidden.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pin code field hidden input on credit cards item page should be visible' });
    await this.pinCodeFieldCreditCardsItemPageShowPasswordIconButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pin code field show password button on credit cards item page should be visible' });
    await this.pinCodeFieldCreditCardsItemPageCopyButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pin code field copy button on credit cards item page should be visible' });
    const titleActual = (await this.pinCodeFieldCreditCardsItemPageTitle.getText()) ?? (await this.pinCodeFieldCreditCardsItemPageTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.pinCodeFieldCreditCardsItemPageInputHidden.getText()) ?? (await this.pinCodeFieldCreditCardsItemPageInputHidden.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputHidden);
    return this;
  }

  async tapShowPinCodeIconButton(): Promise<this> {
    await this.pinCodeFieldCreditCardsItemPageShowPasswordIconButton.click();
    return this;
  }

  async verifyPinCodeFieldCreditCardsItemPageVisible(): Promise<this> {
    const { inputVisible } = PIN_CODE_FIELD_CREDIT_CARDS_ITEM_PAGE;
    await this.pinCodeFieldCreditCardsItemPageInputVisible.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Pin code visible input on credit cards item page should be visible' });
    const textActual = (await this.pinCodeFieldCreditCardsItemPageInputVisible.getText()) ?? (await this.pinCodeFieldCreditCardsItemPageInputVisible.getAttribute('text')) ?? '';
    expect(textActual).toBe(inputVisible);
    return this;
  }

  async tapCopyPinCodeButton(): Promise<this> {
    await this.pinCodeFieldCreditCardsItemPageCopyButton.click();
    return this;
  }

  get fileFieldCreditCardsItemPage() { return this.$('fileFieldCreditCardsItemPage'); }
  get fileFieldCreditCardsItemPageIcon() { return this.$('fileFieldCreditCardsItemPageIcon'); }
  get fileFieldCreditCardsItemPageTitle() { return this.$('fileFieldCreditCardsItemPageTitle'); }
  get fileFieldCreditCardsItemPageText() { return this.$('fileFieldCreditCardsItemPageText'); }

  async verifyFileFieldCreditCardsItemPageAllElementsVisible(): Promise<this> {
    const { title, text } = FILE_FIELD_CREDIT_CARDS_ITEM_PAGE;
    await this.fileFieldCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field on credit cards item page should be visible' });
    await this.fileFieldCreditCardsItemPageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field icon on credit cards item page should be visible' });
    await this.fileFieldCreditCardsItemPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field title on credit cards item page should be visible' });
    await this.fileFieldCreditCardsItemPageText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field text on credit cards item page should be visible' });
    const titleActual = (await this.fileFieldCreditCardsItemPageTitle.getText()) ?? (await this.fileFieldCreditCardsItemPageTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const textActual = (await this.fileFieldCreditCardsItemPageText.getText()) ?? (await this.fileFieldCreditCardsItemPageText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  get notesFieldCreditCardsItemPage() { return this.$('notesFieldCreditCardsItemPage'); }
  get notesFieldCreditCardsItemPageIcon() { return this.$('notesFieldCreditCardsItemPageIcon'); }
  get notesFieldCreditCardsItemPageTitle() { return this.$('notesFieldCreditCardsItemPageTitle'); }
  get notesFieldCreditCardsItemPageInput() { return this.$('notesFieldCreditCardsItemPageInput'); }
  get notesFieldCreditCardsItemPageCopyButton() { return this.$('notesFieldCreditCardsItemPageCopyButton'); }

  async verifyNotesFieldCreditCardsItemPageAllElementsVisible(): Promise<this> {
    const { title, input } = NOTES_FIELD_CREDIT_CARDS_ITEM_PAGE;
    await this.notesFieldCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Notes field on credit cards item page should be visible' });
    await this.notesFieldCreditCardsItemPageIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Notes field icon on credit cards item page should be visible' });
    await this.notesFieldCreditCardsItemPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Notes field title on credit cards item page should be visible' });
    await this.notesFieldCreditCardsItemPageInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Notes field input on credit cards item page should be visible' });
    await this.notesFieldCreditCardsItemPageCopyButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Notes field copy button on credit cards item page should be visible' });
    const titleActual = (await this.notesFieldCreditCardsItemPageTitle.getText()) ?? (await this.notesFieldCreditCardsItemPageTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.notesFieldCreditCardsItemPageInput.getText()) ?? (await this.notesFieldCreditCardsItemPageInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(input);
    return this;
  }

  async tapCopyNoteButton(): Promise<this> {
    await this.notesFieldCreditCardsItemPageCopyButton.click();
    return this;
  }

  get toastMessageCreditCardsItemPage() { return this.$('toastMessageCreditCardsItemPage'); }
  get toastMessageTextCreditCardsItemPage() { return this.$('toastMessageTextCreditCardsItemPage'); }

  async verifyCopyToastVisible(): Promise<this> {
    const { text } = COPIED_TOAST_CREDIT_CARDS_ITEM_PAGE;
    await this.toastMessageCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy toast on credit cards item page should be visible' });
    await this.toastMessageTextCreditCardsItemPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Copy toast text on credit cards item page should be visible' });
    const textActual = (await this.toastMessageTextCreditCardsItemPage.getText()) ?? (await this.toastMessageTextCreditCardsItemPage.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this;
  }

  async verifyNameOnCardCopied(): Promise<this> {
    return this.verifyCopyToastVisible();
  }

  async verifyNumberOnCardCopied(): Promise<this> {
    return this.verifyCopyToastVisible();
  }

  async verifyExpirationDateCopied(): Promise<this> {
    return this.verifyCopyToastVisible();
  }

  async verifySecurityCodeCopied(): Promise<this> {
    return this.verifyCopyToastVisible();
  }

  async verifyPinCodeCopied(): Promise<this> {
    return this.verifyCopyToastVisible();
  }

  async verifyNoteCopied(): Promise<this> {
    return this.verifyCopyToastVisible();
  }
}

export default CreatedCreditCardsItemPage;