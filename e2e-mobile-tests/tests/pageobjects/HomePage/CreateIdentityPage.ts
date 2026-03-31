import BasePage from '@pages/BasePage';
import createIdentityLocators from '@locators/HomeLocators/CreateIdentityLocators';
import { CREATE_IDENTITY_TITLE_FIELD, CREATE_IDENTITY_PERSONAL_INFORMATION_FIELD, CREATE_IDENTITY_FULL_NAME_FIELD, CREATE_IDENTITY_EMAIL_FIELD, CREATE_IDENTITY_PHONE_NUMBER_FIELD, CREATE_IDENTITY_DETAIL_OF_ADDRESS_FIELD, CREATE_IDENTITY_ADDRESS_FIELD, CREATE_IDENTITY_ZIP_FIELD, CREATE_IDENTITY_CITY_FIELD, CREATE_IDENTITY_REGION_FIELD, CREATE_IDENTITY_COUNTRY_FIELD, CREATE_IDENTITY_PASSPORT_FIELD, CREATE_IDENTITY_PASSPORT_FULL_NAME_FIELD, CREATE_IDENTITY_PASSPORT_NUMBER_FIELD, CREATE_IDENTITY_PASSPORT_ISSUING_COUNTRY_FIELD, CREATE_IDENTITY_PASSPORT_DATE_OF_ISSUE_FIELD, CREATE_IDENTITY_PASSPORT_EXPIRY_DATE_FIELD, CREATE_IDENTITY_PASSPORT_NATIONALITY_FIELD, CREATE_IDENTITY_PASSPORT_DATE_OF_BIRTH_FIELD, CREATE_IDENTITY_PASSPORT_GENDER_FIELD, CREATE_IDENTITY_PASSPORT_PICTURE_FIELD, CREATE_IDENTITY_IDENTITY_CARD_FIELD, CREATE_IDENTITY_IDENTITY_CARD_NUMBER_FIELD, CREATE_IDENTITY_IDENTITY_CARD_CREATION_DATE_FIELD, CREATE_IDENTITY_IDENTITY_CARD_EXPIRY_DATE_FIELD, CREATE_IDENTITY_IDENTITY_CARD_ISSUING_COUNTRY_FIELD, CREATE_IDENTITY_IDENTITY_CARD_PICTURE_FIELD, CREATE_IDENTITY_DRIVING_LICENSE_FIELD, CREATE_IDENTITY_DRIVING_LICENSE_ID_NUMBER_FIELD, CREATE_IDENTITY_DRIVING_LICENSE_CREATION_DATE_FIELD, CREATE_IDENTITY_DRIVING_LICENSE_EXPIRY_DATE_FIELD, CREATE_IDENTITY_DRIVING_LICENSE_ISSUING_COUNTRY_FIELD, CREATE_IDENTITY_DRIVING_LICENSE_PICTURE_FIELD, CREATE_IDENTITY_FILE_FIELD, CREATE_IDENTITY_NEW_FILE_FIELD, CREATE_IDENTITY_SHARED_FILE_POPUP, CREATE_IDENTITY_NOTE_FIELD, CREATE_IDENTITY_CUSTOM_FIELD, CREATE_IDENTITY_NEW_ELEMENT_IN_CUSTOM_FIELD, CREATE_IDENTITY_ENTERED_FIELDS, CREATE_IDENTITY_UPLOAD_PICTURE_POPUP, CREATE_IDENTITY_PASSPORT_PICTURE_PREVIEW_PAGE, CREATE_IDENTITY_IDENTITY_CARD_PICTURE_PREVIEW_PAGE, CREATE_IDENTITY_DRIVING_LICENSE_PICTURE_PREVIEW_PAGE, CREATE_IDENTITY_PICTURE_SHARED } from '@data/home-data/createIdentity.data';

declare const expect: any;

export class CreateIdentityPage extends BasePage {
  protected selectors = createIdentityLocators;

  get titleField() { return this.$('titleField'); }
  get titleFieldTitle() { return this.$('titleFieldTitle'); }
  get titleFieldInput() { return this.$('titleFieldInput'); }
  get personalInformationIcon() { return this.$('personalInformationIcon'); }
  get personalInformationTitle() { return this.$('personalInformationTitle'); }
  get fullNameField() { return this.$('fullNameField'); }
  get fullNameFieldIcon() { return this.$('fullNameFieldIcon'); }
  get fullNameFieldTitle() { return this.$('fullNameFieldTitle'); }
  get emailField() { return this.$('emailField'); }
  get emailFieldIcon() { return this.$('emailFieldIcon'); }
  get emailFieldTitle() { return this.$('emailFieldTitle'); }
  get phoneNumberField() { return this.$('phoneNumberField'); }
  get phoneNumberFieldIcon() { return this.$('phoneNumberFieldIcon'); }
  get phoneNumberFieldTitle() { return this.$('phoneNumberFieldTitle'); }
  get detailOfAddressIcon() { return this.$('detailOfAddressIcon'); }
  get detailOfAddressTitle() { return this.$('detailOfAddressTitle'); }
  get passportFieldIcon() { return this.$('passportFieldIcon'); }
  get passportFieldTitle() { return this.$('passportFieldTitle'); }
  get passportPictureField() { return this.$('passportPictureField'); }
  get passportPictureFieldIcon() { return this.$('passportPictureFieldIcon'); }
  get passportPictureFieldTitle() { return this.$('passportPictureFieldTitle'); }
  get passportPicturePlusButton() { return this.$('passportPicturePlusButton'); }
  get passportPicturePlusButtonIcon() { return this.$('passportPicturePlusButtonIcon'); }
  get allowPicturePopup() { return this.$('allowPicturePopup'); }
  get whileUsingAppButton() { return this.$('whileUsingAppButton'); }
  get uploadPicturePopup() { return this.$('uploadPicturePopup'); }
  get uploadPicturePopupIcon() { return this.$('uploadPicturePopupIcon'); }
  get uploadPicturePopupTitle() { return this.$('uploadPicturePopupTitle'); }
  get previewPicture() { return this.$('previewPicture'); }
  get uploadPicturePopupText() { return this.$('uploadPicturePopupText'); }
  get takePhotoButton() { return this.$('takePhotoButton'); }
  get takePhotoButtonText() { return this.$('takePhotoButtonText'); }
  get chooseFromLibraryButton() { return this.$('chooseFromLibraryButton'); }
  get chooseFromLibraryButtonText() { return this.$('chooseFromLibraryButtonText'); }
  get passportPictureInAlbum() { return this.$('passportPictureInAlbum'); }
  get pasportPictureInPassportPictureField() { return this.$('pasportPictureInPassportPictureField'); }
  get passportPicturePreviewPage() { return this.$('passportPicturePreviewPage'); }
  get passportPicturePreviewPageBackButton() { return this.$('passportPicturePreviewPageBackButton'); }
  get passportPicturePreviewPageBackButtonIcon() { return this.$('passportPicturePreviewPageBackButtonIcon'); }
  get passportPicturePreviewPageTitle() { return this.$('passportPicturePreviewPageTitle'); }
  get passportPicturePreviewPageShareButton() { return this.$('passportPicturePreviewPageShareButton'); }
  get passportPicturePreviewPageShareButtonIcon() { return this.$('passportPicturePreviewPageShareButtonIcon'); }
  get passportPicturePreviewPageDeleteButton() { return this.$('passportPicturePreviewPageDeleteButton'); }
  get passportPicturePreviewPageDeleteButtonIcon() { return this.$('passportPicturePreviewPageDeleteButtonIcon'); }
  get passportPicturePreviewPageImage() { return this.$('passportPicturePreviewPageImage'); }
  get sharedPageTitle() { return this.$('sharedPageTitle'); }
  get quickShareButton() { return this.$('quickShareButton'); }
  get identityCardFieldIcon() { return this.$('identityCardFieldIcon'); }
  get identityCardFieldTitle() { return this.$('identityCardFieldTitle'); }
  get identityCardNumberField() { return this.$('identityCardNumberField'); }
  get identityCardNumberFieldIcon() { return this.$('identityCardNumberFieldIcon'); }
  get identityCardNumberFieldTitle() { return this.$('identityCardNumberFieldTitle'); }
  get identityCardPictureField() { return this.$('identityCardPictureField'); }
  get identityCardPictureFieldIcon() { return this.$('identityCardPictureFieldIcon'); }
  get identityCardPictureFieldTitle() { return this.$('identityCardPictureFieldTitle'); }
  get identityCardPicturePlusButton() { return this.$('identityCardPicturePlusButton'); }
  get identityCardPicturePlusButtonIcon() { return this.$('identityCardPicturePlusButtonIcon'); }
  get identityCardPictureInAlbum() { return this.$('identityCardPictureInAlbum'); }
  get identityCardPictureInIdentityCardPictureField() { return this.$('identityCardPictureInIdentityCardPictureField'); }
  get drivingLicenseFieldIcon() { return this.$('drivingLicenseFieldIcon'); }
  get drivingLicenseFieldTitle() { return this.$('drivingLicenseFieldTitle'); }
  get drivingLicenseIdNumberField() { return this.$('drivingLicenseIdNumberField'); }
  get drivingLicenseIdNumberFieldIcon() { return this.$('drivingLicenseIdNumberFieldIcon'); }
  get drivingLicenseIdNumberFieldTitle() { return this.$('drivingLicenseIdNumberFieldTitle'); }
  get drivingLicensePictureField() { return this.$('drivingLicensePictureField'); }
  get drivingLicensePictureFieldIcon() { return this.$('drivingLicensePictureFieldIcon'); }
  get drivingLicensePictureFieldTitle() { return this.$('drivingLicensePictureFieldTitle'); }
  get drivingLicensePicturePlusButton() { return this.$('drivingLicensePicturePlusButton'); }
  get drivingLicensePicturePlusButtonIcon() { return this.$('drivingLicensePicturePlusButtonIcon'); }
  get drivingLicensePictureInAlbum() { return this.$('drivingLicensePictureInAlbum'); }
  get drivingLicensePictureInDrivingLicensePictureField() { return this.$('drivingLicensePictureInDrivingLicensePictureField'); }
  get fileField() { return this.$('fileField'); }
  get fileFieldIcon() { return this.$('fileFieldIcon'); }
  get fileFieldTitle() { return this.$('fileFieldTitle'); }
  get fileFieldText() { return this.$('fileFieldText'); }
  get addFileButton() { return this.$('addFileButton'); }
  get addFileButtonIcon() { return this.$('addFileButtonIcon'); }
  get newFileField() { return this.$('newFileField'); }
  get newFileFieldIcon() { return this.$('newFileFieldIcon'); }
  get newFileFieldTitle() { return this.$('newFileFieldTitle'); }
  get newFileFieldText() { return this.$('newFileFieldText'); }
  get newFileFieldDeleteButton() { return this.$('newFileFieldDeleteButton'); }
  get sharedFilePopupTitle() { return this.$('sharedFilePopupTitle'); }
  get quickShareButtonPopup() { return this.$('quickShareButtonPopup'); }
  get sharedFilePopupText() { return this.$('sharedFilePopupText'); }
  get noteField() { return this.$('noteField'); }
  get noteFieldIcon() { return this.$('noteFieldIcon'); }
  get noteFieldTitle() { return this.$('noteFieldTitle'); }
  get noteFieldInput() { return this.$('noteFieldInput'); }
  get customField() { return this.$('customField'); }
  get customFieldIcon() { return this.$('customFieldIcon'); }
  get customFieldTitle() { return this.$('customFieldTitle'); }
  get customFieldIcon2() { return this.$('customFieldIcon2'); }
  get createNoteButtonIcon() { return this.$('createNoteButtonIcon'); }
  get createNoteButtonText() { return this.$('createNoteButtonText'); }
  get fullNameFieldInput() { return this.$('fullNameFieldInput'); }
  get emailFieldInput() { return this.$('emailFieldInput'); }
  get phoneNumberFieldInput() { return this.$('phoneNumberFieldInput'); }
  get addressField() { return this.$('addressField'); }
  get addressFieldIcon() { return this.$('addressFieldIcon'); }
  get addressFieldTitle() { return this.$('addressFieldTitle'); }
  get addressFieldInput() { return this.$('addressFieldInput'); }
  get zipField() { return this.$('zipField'); }
  get zipFieldIcon() { return this.$('zipFieldIcon'); }
  get zipFieldTitle() { return this.$('zipFieldTitle'); }
  get zipFieldInput() { return this.$('zipFieldInput'); }
  get cityField() { return this.$('cityField'); }
  get cityFieldIcon() { return this.$('cityFieldIcon'); }
  get cityFieldTitle() { return this.$('cityFieldTitle'); }
  get cityFieldInput() { return this.$('cityFieldInput'); }
  get regionField() { return this.$('regionField'); }
  get regionFieldIcon() { return this.$('regionFieldIcon'); }
  get regionFieldTitle() { return this.$('regionFieldTitle'); }
  get regionFieldInput() { return this.$('regionFieldInput'); }
  get countryField() { return this.$('countryField'); }
  get countryFieldIcon() { return this.$('countryFieldIcon'); }
  get countryFieldTitle() { return this.$('countryFieldTitle'); }
  get countryFieldInput() { return this.$('countryFieldInput'); }
  get passportFullNameField() { return this.$('passportFullNameField'); }
  get passportFullNameFieldIcon() { return this.$('passportFullNameFieldIcon'); }
  get passportFullNameFieldTitle() { return this.$('passportFullNameFieldTitle'); }
  get passportFullNameFieldInput() { return this.$('passportFullNameFieldInput'); }
  get passportNumberField() { return this.$('passportNumberField'); }
  get passportNumberFieldIcon() { return this.$('passportNumberFieldIcon'); }
  get passportNumberFieldTitle() { return this.$('passportNumberFieldTitle'); }
  get passportNumberFieldInput() { return this.$('passportNumberFieldInput'); }
  get passportIssuingCountryField() { return this.$('passportIssuingCountryField'); }
  get passportIssuingCountryFieldIcon() { return this.$('passportIssuingCountryFieldIcon'); }
  get passportIssuingCountryFieldTitle() { return this.$('passportIssuingCountryFieldTitle'); }
  get passportIssuingCountryFieldInput() { return this.$('passportIssuingCountryFieldInput'); }
  get passportDateOfIssueField() { return this.$('passportDateOfIssueField'); }
  get passportDateOfIssueFieldIcon() { return this.$('passportDateOfIssueFieldIcon'); }
  get passportDateOfIssueFieldTitle() { return this.$('passportDateOfIssueFieldTitle'); }
  get passportDateOfIssueFieldInput() { return this.$('passportDateOfIssueFieldInput'); }
  get passportExpiryDateField() { return this.$('passportExpiryDateField'); }
  get passportExpiryDateFieldIcon() { return this.$('passportExpiryDateFieldIcon'); }
  get passportExpiryDateFieldTitle() { return this.$('passportExpiryDateFieldTitle'); }
  get passportExpiryDateFieldInput() { return this.$('passportExpiryDateFieldInput'); }
  get passportNationalityField() { return this.$('passportNationalityField'); }
  get passportNationalityFieldIcon() { return this.$('passportNationalityFieldIcon'); }
  get passportNationalityFieldTitle() { return this.$('passportNationalityFieldTitle'); }
  get passportNationalityFieldInput() { return this.$('passportNationalityFieldInput'); }
  get passportDateOfBirthField() { return this.$('passportDateOfBirthField'); }
  get passportDateOfBirthFieldIcon() { return this.$('passportDateOfBirthFieldIcon'); }
  get passportDateOfBirthFieldTitle() { return this.$('passportDateOfBirthFieldTitle'); }
  get passportDateOfBirthFieldInput() { return this.$('passportDateOfBirthFieldInput'); }
  get passportGenderField() { return this.$('passportGenderField'); }
  get passportGenderFieldIcon() { return this.$('passportGenderFieldIcon'); }
  get passportGenderFieldTitle() { return this.$('passportGenderFieldTitle'); }
  get passportGenderFieldInput() { return this.$('passportGenderFieldInput'); }
  get identityCardNumberFieldInput() { return this.$('identityCardNumberFieldInput'); }
  get identityCardCreationDateField() { return this.$('identityCardCreationDateField'); }
  get identityCardCreationDateFieldIcon() { return this.$('identityCardCreationDateFieldIcon'); }
  get identityCardCreationDateFieldTitle() { return this.$('identityCardCreationDateFieldTitle'); }
  get identityCardCreationDateFieldInput() { return this.$('identityCardCreationDateFieldInput'); }
  get identityCardExpiryDateField() { return this.$('identityCardExpiryDateField'); }
  get identityCardExpiryDateFieldIcon() { return this.$('identityCardExpiryDateFieldIcon'); }
  get identityCardExpiryDateFieldTitle() { return this.$('identityCardExpiryDateFieldTitle'); }
  get identityCardExpiryDateFieldInput() { return this.$('identityCardExpiryDateFieldInput'); }
  get identityCardIssuingCountryField() { return this.$('identityCardIssuingCountryField'); }
  get identityCardIssuingCountryFieldIcon() { return this.$('identityCardIssuingCountryFieldIcon'); }
  get identityCardIssuingCountryFieldTitle() { return this.$('identityCardIssuingCountryFieldTitle'); }
  get identityCardIssuingCountryFieldInput() { return this.$('identityCardIssuingCountryFieldInput'); }
  get drivingLicenseIdNumberFieldInput() { return this.$('drivingLicenseIdNumberFieldInput'); }
  get drivingLicenseCreationDateField() { return this.$('drivingLicenseCreationDateField'); }
  get drivingLicenseCreationDateFieldIcon() { return this.$('drivingLicenseCreationDateFieldIcon'); }
  get drivingLicenseCreationDateFieldTitle() { return this.$('drivingLicenseCreationDateFieldTitle'); }
  get drivingLicenseCreationDateFieldInput() { return this.$('drivingLicenseCreationDateFieldInput'); }
  get drivingLicenseExpiryDateField() { return this.$('drivingLicenseExpiryDateField'); }
  get drivingLicenseExpiryDateFieldIcon() { return this.$('drivingLicenseExpiryDateFieldIcon'); }
  get drivingLicenseExpiryDateFieldTitle() { return this.$('drivingLicenseExpiryDateFieldTitle'); }
  get drivingLicenseExpiryDateFieldInput() { return this.$('drivingLicenseExpiryDateFieldInput'); }
  get drivingLicenseIssuingCountryField() { return this.$('drivingLicenseIssuingCountryField'); }
  get drivingLicenseIssuingCountryFieldIcon() { return this.$('drivingLicenseIssuingCountryFieldIcon'); }
  get drivingLicenseIssuingCountryFieldTitle() { return this.$('drivingLicenseIssuingCountryFieldTitle'); }
  get drivingLicenseIssuingCountryFieldInput() { return this.$('drivingLicenseIssuingCountryFieldInput'); }

  async verifyTitleFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_TITLE_FIELD;
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

  async tapTitleField(): Promise<this> {
    await this.titleField.click();
    return this.self;
  }

  async tapPassportPicturePlusButton(): Promise<this> {
    await this.passportPicturePlusButton.click();
    return this.self;
  }

  async verifyAllowPicturePopupVisible(timeout = 15000): Promise<this> {
    await browser.pause(500);
    await this.allowPicturePopup.waitForDisplayed({
      timeout,
      timeoutMsg: 'Allow picture popup should be visible',
    });
    return this.self;
  }

  async tapWhileUsingAppButton(): Promise<this> {
    await this.whileUsingAppButton.click();
    return this.self;
  }

  async verifyUploadPicturePopupVisible(timeout = 15000): Promise<this> {
    await browser.pause(500);
    await this.uploadPicturePopup.waitForDisplayed({
      timeout,
      timeoutMsg: 'Upload picture popup should be visible',
    });
    return this.self;
  }

  async verifyAllElementsInUploadPicturePopupVisible(): Promise<this> {
    const { title, popupText, takePhotoButtonText, chooseFromLibraryButtonText } = CREATE_IDENTITY_UPLOAD_PICTURE_POPUP;
    await this.uploadPicturePopupIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Upload picture popup icon should be visible' });
    await this.uploadPicturePopupTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Upload picture popup title should be visible' });
    await this.previewPicture.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Preview picture should be visible' });
    await this.uploadPicturePopupText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Upload picture popup text should be visible' });
    await this.takePhotoButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Take photo button should be visible' });
    await this.takePhotoButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Take photo button text should be visible' });
    await this.chooseFromLibraryButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Choose from library button should be visible' });
    await this.chooseFromLibraryButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Choose from library button text should be visible' });
    const titleActual = await this.uploadPicturePopupTitle.getText();
    expect(titleActual).toBe(title);
    const popupTextActual = (await this.uploadPicturePopupText.getText()) ?? (await this.uploadPicturePopupText.getAttribute('text')) ?? '';
    expect(popupTextActual).toBe(popupText);
    const takePhotoActual = (await this.takePhotoButtonText.getText()) ?? (await this.takePhotoButtonText.getAttribute('text')) ?? '';
    expect(takePhotoActual).toBe(takePhotoButtonText);
    const chooseFromLibraryActual = (await this.chooseFromLibraryButtonText.getText()) ?? (await this.chooseFromLibraryButtonText.getAttribute('text')) ?? '';
    expect(chooseFromLibraryActual).toBe(chooseFromLibraryButtonText);
    return this.self;
  }

  async tapChooseFromLibraryButton(): Promise<this> {
    await this.chooseFromLibraryButton.click();
    return this.self;
  }

  async verifyPassportPictureInAlbumVisible(): Promise<this> {
    await this.passportPictureInAlbum.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture in album should be visible' });
    return this.self;
  }

  async tapPassportPictureInAlbum(): Promise<this> {
    await this.passportPictureInAlbum.click();
    return this.self;
  }

  async verifyPassportPictureInPassportPictureFieldVisible(): Promise<this> {
    await browser.pause(3000);
    await this.pasportPictureInPassportPictureField.waitForDisplayed({ timeout: 12000, timeoutMsg: 'Passport picture in passport picture field should be visible' });
    return this.self;
  }

  async tapPassportPictureInPassportPictureField(): Promise<this> {
    await this.pasportPictureInPassportPictureField.click();
    return this.self;
  }

  async verifyPassportPictureInPassportPictureFieldUnvisible(timeout = 5000): Promise<this> {
    await this.pasportPictureInPassportPictureField.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: 'Passport picture in passport picture field should not be visible',
    });
    return this.self;
  }

  async verifyPassportPicturePreviewPageWithAllElementsVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_PASSPORT_PICTURE_PREVIEW_PAGE;
    await this.passportPicturePreviewPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture preview page should be visible' });
    await this.passportPicturePreviewPageBackButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture preview back button should be visible' });
    await this.passportPicturePreviewPageBackButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture preview back button icon should be visible' });
    await this.passportPicturePreviewPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture preview page title should be visible' });
    await this.passportPicturePreviewPageShareButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture preview share button should be visible' });
    await this.passportPicturePreviewPageShareButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture preview share button icon should be visible' });
    await this.passportPicturePreviewPageDeleteButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture preview delete button should be visible' });
    await this.passportPicturePreviewPageDeleteButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture preview delete button icon should be visible' });
    await this.passportPicturePreviewPageImage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture preview page image should be visible' });
    const titleActual = (await this.passportPicturePreviewPageTitle.getText()) ?? (await this.passportPicturePreviewPageTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyIdentityCardPicturePreviewPageWithAllElementsVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_IDENTITY_CARD_PICTURE_PREVIEW_PAGE;
    await this.passportPicturePreviewPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture preview page should be visible' });
    await this.passportPicturePreviewPageBackButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture preview back button should be visible' });
    await this.passportPicturePreviewPageBackButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture preview back button icon should be visible' });
    await this.passportPicturePreviewPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture preview page title should be visible' });
    await this.passportPicturePreviewPageShareButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture preview share button should be visible' });
    await this.passportPicturePreviewPageShareButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture preview share button icon should be visible' });
    await this.passportPicturePreviewPageDeleteButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture preview delete button should be visible' });
    await this.passportPicturePreviewPageDeleteButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture preview delete button icon should be visible' });
    await this.passportPicturePreviewPageImage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture preview page image should be visible' });
    const titleActual = (await this.passportPicturePreviewPageTitle.getText()) ?? (await this.passportPicturePreviewPageTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyDrivingLicensePicturePreviewPageWithAllElementsVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_DRIVING_LICENSE_PICTURE_PREVIEW_PAGE;
    await this.passportPicturePreviewPage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture preview page should be visible' });
    await this.passportPicturePreviewPageBackButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture preview back button should be visible' });
    await this.passportPicturePreviewPageBackButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture preview back button icon should be visible' });
    await this.passportPicturePreviewPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture preview page title should be visible' });
    await this.passportPicturePreviewPageShareButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture preview share button should be visible' });
    await this.passportPicturePreviewPageShareButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture preview share button icon should be visible' });
    await this.passportPicturePreviewPageDeleteButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture preview delete button should be visible' });
    await this.passportPicturePreviewPageDeleteButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture preview delete button icon should be visible' });
    await this.passportPicturePreviewPageImage.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture preview page image should be visible' });
    const titleActual = (await this.passportPicturePreviewPageTitle.getText()) ?? (await this.passportPicturePreviewPageTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this.self;
  }

  async tapShareButton(): Promise<this> {
    await this.passportPicturePreviewPageShareButton.click();
    return this.self;
  }

  async verifyPictureShared(): Promise<this> {
    const { sharedPageTitle: expectedTitle, quickShareButtonText } = CREATE_IDENTITY_PICTURE_SHARED;
    await this.sharedPageTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Shared page title should be visible' });
    await this.quickShareButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Quick Share button should be visible' });
    const titleActual = (await this.sharedPageTitle.getText()) ?? (await this.sharedPageTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(expectedTitle);
    const quickShareActual = (await this.quickShareButton.getText()) ?? (await this.quickShareButton.getAttribute('text')) ?? '';
    expect(quickShareActual).toBe(quickShareButtonText);
    return this.self;
  }

  async tapDeleteButton(): Promise<this> {
    await this.passportPicturePreviewPageDeleteButton.click();
    return this.self;
  }

  async tapBackButtonOnSharedPage(): Promise<this> {
    await this.passportPicturePreviewPageBackButton.click();
    return this.self;
  }

  async enterTextInFields(
    fieldName: keyof typeof CREATE_IDENTITY_ENTERED_FIELDS
  ): Promise<this> {
    const value = CREATE_IDENTITY_ENTERED_FIELDS[fieldName];
    const inputByField = {
      title: this.titleFieldInput,
      fullName: this.fullNameFieldInput,
      email: this.emailFieldInput,
      phoneNumber: this.phoneNumberFieldInput,
      address: this.addressFieldInput,
      zip: this.zipFieldInput,
      city: this.cityFieldInput,
      region: this.regionFieldInput,
      country: this.countryFieldInput,
      passportFullName: this.passportFullNameFieldInput,
      passportNumber: this.passportNumberFieldInput,
      passportIssuingCountry: this.passportIssuingCountryFieldInput,
      passportDateOfIssue: this.passportDateOfIssueFieldInput,
      passportExpiryDate: this.passportExpiryDateFieldInput,
      passportNationality: this.passportNationalityFieldInput,
      passportDateOfBirth: this.passportDateOfBirthFieldInput,
      passportGender: this.passportGenderFieldInput,
      identityCardNumber: this.identityCardNumberFieldInput,
      identityCardCreationDate: this.identityCardCreationDateFieldInput,
      identityCardExpiryDate: this.identityCardExpiryDateFieldInput,
      identityCardIssuingCountry: this.identityCardIssuingCountryFieldInput,
      drivingLicenseIdNumber: this.drivingLicenseIdNumberFieldInput,
      drivingLicenseCreationDate: this.drivingLicenseCreationDateFieldInput,
      drivingLicenseExpiryDate: this.drivingLicenseExpiryDateFieldInput,
      drivingLicenseIssuingCountry: this.drivingLicenseIssuingCountryFieldInput,
      note: this.noteFieldInput,
    } as const;
    const input = inputByField[fieldName];
    await input.setValue(value);
    return this.self;
  }

  async verifyEnteredTextInFields(
    fieldName: keyof typeof CREATE_IDENTITY_ENTERED_FIELDS
  ): Promise<this> {
    const expected = CREATE_IDENTITY_ENTERED_FIELDS[fieldName];
    const inputByField = {
      title: this.titleFieldInput,
      fullName: this.fullNameFieldInput,
      email: this.emailFieldInput,
      phoneNumber: this.phoneNumberFieldInput,
      address: this.addressFieldInput,
      zip: this.zipFieldInput,
      city: this.cityFieldInput,
      region: this.regionFieldInput,
      country: this.countryFieldInput,
      passportFullName: this.passportFullNameFieldInput,
      passportNumber: this.passportNumberFieldInput,
      passportIssuingCountry: this.passportIssuingCountryFieldInput,
      passportDateOfIssue: this.passportDateOfIssueFieldInput,
      passportExpiryDate: this.passportExpiryDateFieldInput,
      passportNationality: this.passportNationalityFieldInput,
      passportDateOfBirth: this.passportDateOfBirthFieldInput,
      passportGender: this.passportGenderFieldInput,
      identityCardNumber: this.identityCardNumberFieldInput,
      identityCardCreationDate: this.identityCardCreationDateFieldInput,
      identityCardExpiryDate: this.identityCardExpiryDateFieldInput,
      identityCardIssuingCountry: this.identityCardIssuingCountryFieldInput,
      drivingLicenseIdNumber: this.drivingLicenseIdNumberFieldInput,
      drivingLicenseCreationDate: this.drivingLicenseCreationDateFieldInput,
      drivingLicenseExpiryDate: this.drivingLicenseExpiryDateFieldInput,
      drivingLicenseIssuingCountry: this.drivingLicenseIssuingCountryFieldInput,
      note: this.noteFieldInput,
    } as const;
    const input = inputByField[fieldName];
    const actual = (await input.getText()) ?? (await input.getAttribute('text')) ?? '';
    expect(actual).toBe(expected);
    return this.self;
  }

  async verifyPersonalInformationFieldVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_PERSONAL_INFORMATION_FIELD;
    await this.personalInformationIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Personal information icon should be visible' });
    await this.personalInformationTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Personal information title should be visible' });
    const titleActual = await this.personalInformationTitle.getText();
    expect(titleActual).toBe(title);
    return this.self;
  }

  async showOrHideFields(
    _action: 'show' | 'hide',
    fieldName: 'personalInformation' | 'detailOfAddress' | 'passport' | 'identityCard' | 'drivingLicense'
  ): Promise<this> {
    const iconByField = {
      personalInformation: this.personalInformationIcon,
      detailOfAddress: this.detailOfAddressIcon,
      passport: this.passportFieldIcon,
      identityCard: this.identityCardFieldIcon,
      drivingLicense: this.drivingLicenseFieldIcon,
    } as const;
    const icon = iconByField[fieldName];
    await icon.click();
    return this.self;
  }

  async showOrHidePersonalInformationField(action: 'show' | 'hide'): Promise<this> {
    return this.showOrHideFields(action, 'personalInformation');
  }

  async hidePersonalInformationField(): Promise<this> {
    await this.personalInformationIcon.click();
    return this.self;
  }

  async showPersonalInformationField(): Promise<this> {
    await this.personalInformationIcon.click();
    return this.self;
  }

  async verifyFullNameFieldInPersonalInformationFieldVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_FULL_NAME_FIELD;
    await this.fullNameField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Full name field should be visible' });
    await this.fullNameFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Full name field icon should be visible' });
    await this.fullNameFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Full name field title should be visible' });
    const titleActual = await this.fullNameFieldTitle.getText();
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyAllElementsInFullNameFieldInPersonalInformationFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_FULL_NAME_FIELD;
    await this.fullNameField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Full name field should be visible' });
    await this.fullNameFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Full name field icon should be visible' });
    await this.fullNameFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Full name field title should be visible' });
    await this.fullNameFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Full name field input should be visible' });
    const titleActual = (await this.fullNameFieldTitle.getText()) ?? (await this.fullNameFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.fullNameFieldInput.getText()) ?? (await this.fullNameFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInEmailFieldInPersonalInformationFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_EMAIL_FIELD;
    await this.emailField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email field should be visible' });
    await this.emailFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email field icon should be visible' });
    await this.emailFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email field title should be visible' });
    await this.emailFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email field input should be visible' });
    const titleActual = (await this.emailFieldTitle.getText()) ?? (await this.emailFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.emailFieldInput.getText()) ?? (await this.emailFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInPhoneNumberFieldInPersonalInformationFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_PHONE_NUMBER_FIELD;
    await this.phoneNumberField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Phone number field should be visible' });
    await this.phoneNumberFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Phone number field icon should be visible' });
    await this.phoneNumberFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Phone number field title should be visible' });
    await this.phoneNumberFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Phone number field input should be visible' });
    const titleActual = (await this.phoneNumberFieldTitle.getText()) ?? (await this.phoneNumberFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.phoneNumberFieldInput.getText()) ?? (await this.phoneNumberFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyFullNameFieldInPersonalInformationFieldNotVisible(timeout = 5000): Promise<this> {
    await this.fullNameField.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: 'Full name field should not be visible',
    });
    return this.self;
  }

  async verifyDetailOfAddressFieldVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_DETAIL_OF_ADDRESS_FIELD;
    await this.detailOfAddressIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Detail of address icon should be visible' });
    await this.detailOfAddressTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Detail of address title should be visible' });
    const titleActual = await this.detailOfAddressTitle.getText();
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyAddressFieldVisible(): Promise<this> {
    await this.addressField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Address field should be visible' });
    return this.self;
  }

  async verifyAllElementsInAddressFieldInDetailOfAddressFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_ADDRESS_FIELD;
    await this.addressField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Address field should be visible' });
    await this.addressFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Address field icon should be visible' });
    await this.addressFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Address field title should be visible' });
    await this.addressFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Address field input should be visible' });
    const titleActual = (await this.addressFieldTitle.getText()) ?? (await this.addressFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.addressFieldInput.getText()) ?? (await this.addressFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInZipFieldInDetailOfAddressFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_ZIP_FIELD;
    await this.zipField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'ZIP field should be visible' });
    await this.zipFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'ZIP field icon should be visible' });
    await this.zipFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'ZIP field title should be visible' });
    await this.zipFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'ZIP field input should be visible' });
    const titleActual = (await this.zipFieldTitle.getText()) ?? (await this.zipFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.zipFieldInput.getText()) ?? (await this.zipFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInCityFieldInDetailOfAddressFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_CITY_FIELD;
    await this.cityField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'City field should be visible' });
    await this.cityFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'City field icon should be visible' });
    await this.cityFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'City field title should be visible' });
    await this.cityFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'City field input should be visible' });
    const titleActual = (await this.cityFieldTitle.getText()) ?? (await this.cityFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.cityFieldInput.getText()) ?? (await this.cityFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInRegionFieldInDetailOfAddressFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_REGION_FIELD;
    await this.regionField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Region field should be visible' });
    await this.regionFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Region field icon should be visible' });
    await this.regionFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Region field title should be visible' });
    await this.regionFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Region field input should be visible' });
    const titleActual = (await this.regionFieldTitle.getText()) ?? (await this.regionFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.regionFieldInput.getText()) ?? (await this.regionFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInCountryFieldInDetailOfAddressFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_COUNTRY_FIELD;
    await this.countryField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Country field should be visible' });
    await this.countryFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Country field icon should be visible' });
    await this.countryFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Country field title should be visible' });
    await this.countryFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Country field input should be visible' });
    const titleActual = (await this.countryFieldTitle.getText()) ?? (await this.countryFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.countryFieldInput.getText()) ?? (await this.countryFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAddressFieldNotVisible(timeout = 5000): Promise<this> {
    await this.addressField.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: 'Address field should not be visible',
    });
    return this.self;
  }

  async hideDetailOfAddressField(): Promise<this> {
    await this.detailOfAddressIcon.click();
    return this.self;
  }

  async verifyPassportFieldVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_PASSPORT_FIELD;
    await this.passportFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport field icon should be visible' });
    await this.passportFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport field title should be visible' });
    const titleActual = await this.passportFieldTitle.getText();
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyPassportFullNameFieldVisible(): Promise<this> {
    await this.passportFullNameField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport full name field should be visible' });
    return this.self;
  }

  async verifyPassportFullNameFieldNotVisible(timeout = 5000): Promise<this> {
    await this.passportFullNameField.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: 'Passport full name field should not be visible',
    });
    return this.self;
  }

  async verifyAllElementsInPassportFullNameFieldInPassportFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_PASSPORT_FULL_NAME_FIELD;
    await this.passportFullNameField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport full name field should be visible' });
    await this.passportFullNameFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport full name field icon should be visible' });
    await this.passportFullNameFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport full name field title should be visible' });
    await this.passportFullNameFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport full name field input should be visible' });
    const titleActual = (await this.passportFullNameFieldTitle.getText()) ?? (await this.passportFullNameFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.passportFullNameFieldInput.getText()) ?? (await this.passportFullNameFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInPassportNumberFieldInPassportFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_PASSPORT_NUMBER_FIELD;
    await this.passportNumberField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport number field should be visible' });
    await this.passportNumberFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport number field icon should be visible' });
    await this.passportNumberFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport number field title should be visible' });
    await this.passportNumberFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport number field input should be visible' });
    const titleActual = (await this.passportNumberFieldTitle.getText()) ?? (await this.passportNumberFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.passportNumberFieldInput.getText()) ?? (await this.passportNumberFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInPassportIssuingCountryFieldInPassportFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_PASSPORT_ISSUING_COUNTRY_FIELD;
    await this.passportIssuingCountryField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport issuing country field should be visible' });
    await this.passportIssuingCountryFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport issuing country field icon should be visible' });
    await this.passportIssuingCountryFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport issuing country field title should be visible' });
    await this.passportIssuingCountryFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport issuing country field input should be visible' });
    const titleActual = (await this.passportIssuingCountryFieldTitle.getText()) ?? (await this.passportIssuingCountryFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.passportIssuingCountryFieldInput.getText()) ?? (await this.passportIssuingCountryFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInPassportDateOfIssueFieldInPassportFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_PASSPORT_DATE_OF_ISSUE_FIELD;
    await this.passportDateOfIssueField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport date of issue field should be visible' });
    await this.passportDateOfIssueFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport date of issue field icon should be visible' });
    await this.passportDateOfIssueFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport date of issue field title should be visible' });
    await this.passportDateOfIssueFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport date of issue field input should be visible' });
    const titleActual = (await this.passportDateOfIssueFieldTitle.getText()) ?? (await this.passportDateOfIssueFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.passportDateOfIssueFieldInput.getText()) ?? (await this.passportDateOfIssueFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInPassportExpiryDateFieldInPassportFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_PASSPORT_EXPIRY_DATE_FIELD;
    await this.passportExpiryDateField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport expiry date field should be visible' });
    await this.passportExpiryDateFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport expiry date field icon should be visible' });
    await this.passportExpiryDateFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport expiry date field title should be visible' });
    await this.passportExpiryDateFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport expiry date field input should be visible' });
    const titleActual = (await this.passportExpiryDateFieldTitle.getText()) ?? (await this.passportExpiryDateFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.passportExpiryDateFieldInput.getText()) ?? (await this.passportExpiryDateFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInPassportNationalityFieldInPassportFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_PASSPORT_NATIONALITY_FIELD;
    await this.passportNationalityField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport nationality field should be visible' });
    await this.passportNationalityFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport nationality field icon should be visible' });
    await this.passportNationalityFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport nationality field title should be visible' });
    await this.passportNationalityFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport nationality field input should be visible' });
    const titleActual = (await this.passportNationalityFieldTitle.getText()) ?? (await this.passportNationalityFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.passportNationalityFieldInput.getText()) ?? (await this.passportNationalityFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInPassportDateOfBirthFieldInPassportFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_PASSPORT_DATE_OF_BIRTH_FIELD;
    await this.passportDateOfBirthField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport date of birth field should be visible' });
    await this.passportDateOfBirthFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport date of birth field icon should be visible' });
    await this.passportDateOfBirthFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport date of birth field title should be visible' });
    await this.passportDateOfBirthFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport date of birth field input should be visible' });
    const titleActual = (await this.passportDateOfBirthFieldTitle.getText()) ?? (await this.passportDateOfBirthFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.passportDateOfBirthFieldInput.getText()) ?? (await this.passportDateOfBirthFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInPassportGenderFieldInPassportFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_PASSPORT_GENDER_FIELD;
    await this.passportGenderField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport gender field should be visible' });
    await this.passportGenderFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport gender field icon should be visible' });
    await this.passportGenderFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport gender field title should be visible' });
    await this.passportGenderFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport gender field input should be visible' });
    const titleActual = (await this.passportGenderFieldTitle.getText()) ?? (await this.passportGenderFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.passportGenderFieldInput.getText()) ?? (await this.passportGenderFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInPassportPictureFieldInPassportFieldVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_PASSPORT_PICTURE_FIELD;
    await this.passportPictureField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture field should be visible' });
    await this.passportPictureFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture field icon should be visible' });
    await this.passportPictureFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture field title should be visible' });
    await this.passportPicturePlusButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture plus button should be visible' });
    await this.passportPicturePlusButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Passport picture plus button icon should be visible' });
    const titleActual = (await this.passportPictureFieldTitle.getText()) ?? (await this.passportPictureFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyIdentityCardFieldVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_IDENTITY_CARD_FIELD;
    await this.identityCardFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card field icon should be visible' });
    await this.identityCardFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card field title should be visible' });
    const titleActual = await this.identityCardFieldTitle.getText();
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyIdentityCardIdNumberFieldVisible(): Promise<this> {
    await this.identityCardNumberField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card ID number field should be visible' });
    return this.self;
  }

  async verifyIdentityCardIdNumberFieldNotVisible(timeout = 5000): Promise<this> {
    await this.identityCardNumberField.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: 'Identity card ID number field should not be visible',
    });
    return this.self;
  }

  async verifyAllElementsInIdentityCardIdNumberFieldInIdentityCardFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_IDENTITY_CARD_NUMBER_FIELD;
    await this.identityCardNumberField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card ID number field should be visible' });
    await this.identityCardNumberFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card ID number field icon should be visible' });
    await this.identityCardNumberFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card ID number field title should be visible' });
    await this.identityCardNumberFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card ID number field input should be visible' });
    const titleActual = (await this.identityCardNumberFieldTitle.getText()) ?? (await this.identityCardNumberFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.identityCardNumberFieldInput.getText()) ?? (await this.identityCardNumberFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInIdentityCardCreationDateFieldInIdentityCardFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_IDENTITY_CARD_CREATION_DATE_FIELD;
    await this.identityCardCreationDateField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card creation date field should be visible' });
    await this.identityCardCreationDateFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card creation date field icon should be visible' });
    await this.identityCardCreationDateFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card creation date field title should be visible' });
    await this.identityCardCreationDateFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card creation date field input should be visible' });
    const titleActual = (await this.identityCardCreationDateFieldTitle.getText()) ?? (await this.identityCardCreationDateFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.identityCardCreationDateFieldInput.getText()) ?? (await this.identityCardCreationDateFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInIdentityCardExpiryDateFieldInIdentityCardFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_IDENTITY_CARD_EXPIRY_DATE_FIELD;
    await this.identityCardExpiryDateField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card expiry date field should be visible' });
    await this.identityCardExpiryDateFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card expiry date field icon should be visible' });
    await this.identityCardExpiryDateFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card expiry date field title should be visible' });
    await this.identityCardExpiryDateFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card expiry date field input should be visible' });
    const titleActual = (await this.identityCardExpiryDateFieldTitle.getText()) ?? (await this.identityCardExpiryDateFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.identityCardExpiryDateFieldInput.getText()) ?? (await this.identityCardExpiryDateFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInIdentityCardIssuingCountryFieldInIdentityCardFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_IDENTITY_CARD_ISSUING_COUNTRY_FIELD;
    await this.identityCardIssuingCountryField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card issuing country field should be visible' });
    await this.identityCardIssuingCountryFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card issuing country field icon should be visible' });
    await this.identityCardIssuingCountryFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card issuing country field title should be visible' });
    await this.identityCardIssuingCountryFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card issuing country field input should be visible' });
    const titleActual = (await this.identityCardIssuingCountryFieldTitle.getText()) ?? (await this.identityCardIssuingCountryFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.identityCardIssuingCountryFieldInput.getText()) ?? (await this.identityCardIssuingCountryFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInIdentityCardPictureFieldInIdentityCardFieldVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_IDENTITY_CARD_PICTURE_FIELD;
    await this.identityCardPictureField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture field should be visible' });
    await this.identityCardPictureFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture field icon should be visible' });
    await this.identityCardPictureFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture field title should be visible' });
    await this.identityCardPicturePlusButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture plus button should be visible' });
    await this.identityCardPicturePlusButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture plus button icon should be visible' });
    const titleActual = (await this.identityCardPictureFieldTitle.getText()) ?? (await this.identityCardPictureFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this.self;
  }

  async tapIdentityCardPicturePlusButton(): Promise<this> {
    await this.identityCardPicturePlusButton.click();
    return this.self;
  }

  async verifyIdentityCardPictureInAlbumVisible(): Promise<this> {
    await this.identityCardPictureInAlbum.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture in album should be visible' });
    return this.self;
  }

  async tapIdentityCardPictureInAlbum(): Promise<this> {
    await this.identityCardPictureInAlbum.click();
    return this.self;
  }

  async verifyIdentityCardPictureInIdentityCardPictureFieldVisible(): Promise<this> {
    await this.identityCardPictureInIdentityCardPictureField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Identity card picture in identity card picture field should be visible' });
    return this.self;
  }

  async tapIdentityCardPictureInIdentityCardPictureField(): Promise<this> {
    await this.identityCardPictureInIdentityCardPictureField.click();
    return this.self;
  }

  async verifyDrivingLicenseFieldVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_DRIVING_LICENSE_FIELD;
    await this.drivingLicenseFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license field icon should be visible' });
    await this.drivingLicenseFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license field title should be visible' });
    const titleActual = await this.drivingLicenseFieldTitle.getText();
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyDrivingLicenseIdNumberFieldVisible(): Promise<this> {
    await this.drivingLicenseIdNumberField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license ID number field should be visible' });
    return this.self;
  }

  async verifyDrivingLicenseIdNumberFieldNotVisible(timeout = 5000): Promise<this> {
    await this.drivingLicenseIdNumberField.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: 'Driving license ID number field should not be visible',
    });
    return this.self;
  }

  async verifyAllElementsInDrivingLicenseIdNumberFieldInDrivingLicenseFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_DRIVING_LICENSE_ID_NUMBER_FIELD;
    await this.drivingLicenseIdNumberField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license ID number field should be visible' });
    await this.drivingLicenseIdNumberFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license ID number field icon should be visible' });
    await this.drivingLicenseIdNumberFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license ID number field title should be visible' });
    await this.drivingLicenseIdNumberFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license ID number field input should be visible' });
    const titleActual = (await this.drivingLicenseIdNumberFieldTitle.getText()) ?? (await this.drivingLicenseIdNumberFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.drivingLicenseIdNumberFieldInput.getText()) ?? (await this.drivingLicenseIdNumberFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInDrivingLicenseCreationDateFieldInDrivingLicenseFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_DRIVING_LICENSE_CREATION_DATE_FIELD;
    await this.drivingLicenseCreationDateField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license creation date field should be visible' });
    await this.drivingLicenseCreationDateFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license creation date field icon should be visible' });
    await this.drivingLicenseCreationDateFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license creation date field title should be visible' });
    await this.drivingLicenseCreationDateFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license creation date field input should be visible' });
    const titleActual = (await this.drivingLicenseCreationDateFieldTitle.getText()) ?? (await this.drivingLicenseCreationDateFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.drivingLicenseCreationDateFieldInput.getText()) ?? (await this.drivingLicenseCreationDateFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInDrivingLicenseExpiryDateFieldInDrivingLicenseFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_DRIVING_LICENSE_EXPIRY_DATE_FIELD;
    await this.drivingLicenseExpiryDateField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license expiry date field should be visible' });
    await this.drivingLicenseExpiryDateFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license expiry date field icon should be visible' });
    await this.drivingLicenseExpiryDateFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license expiry date field title should be visible' });
    await this.drivingLicenseExpiryDateFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license expiry date field input should be visible' });
    const titleActual = (await this.drivingLicenseExpiryDateFieldTitle.getText()) ?? (await this.drivingLicenseExpiryDateFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.drivingLicenseExpiryDateFieldInput.getText()) ?? (await this.drivingLicenseExpiryDateFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInDrivingLicenseIssuingCountryFieldInDrivingLicenseFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_DRIVING_LICENSE_ISSUING_COUNTRY_FIELD;
    await this.drivingLicenseIssuingCountryField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license issuing country field should be visible' });
    await this.drivingLicenseIssuingCountryFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license issuing country field icon should be visible' });
    await this.drivingLicenseIssuingCountryFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license issuing country field title should be visible' });
    await this.drivingLicenseIssuingCountryFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license issuing country field input should be visible' });
    const titleActual = (await this.drivingLicenseIssuingCountryFieldTitle.getText()) ?? (await this.drivingLicenseIssuingCountryFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.drivingLicenseIssuingCountryFieldInput.getText()) ?? (await this.drivingLicenseIssuingCountryFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInDrivingLicensePictureFieldInDrivingLicenseFieldVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_DRIVING_LICENSE_PICTURE_FIELD;
    await this.drivingLicensePictureField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture field should be visible' });
    await this.drivingLicensePictureFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture field icon should be visible' });
    await this.drivingLicensePictureFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture field title should be visible' });
    await this.drivingLicensePicturePlusButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture plus button should be visible' });
    await this.drivingLicensePicturePlusButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture plus button icon should be visible' });
    const titleActual = (await this.drivingLicensePictureFieldTitle.getText()) ?? (await this.drivingLicensePictureFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this.self;
  }

  async tapDrivingLicensePicturePlusButton(): Promise<this> {
    await this.drivingLicensePicturePlusButton.click();
    return this.self;
  }

  async verifyDrivingLicensePictureInAlbumVisible(): Promise<this> {
    await this.drivingLicensePictureInAlbum.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture in album should be visible' });
    return this.self;
  }

  async tapDrivingLicensePictureInAlbum(): Promise<this> {
    await this.drivingLicensePictureInAlbum.click();
    return this.self;
  }

  async verifyDrivingLicensePictureInDrivingLicensePictureFieldVisible(): Promise<this> {
    await this.drivingLicensePictureInDrivingLicensePictureField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Driving license picture in driving license picture field should be visible' });
    return this.self;
  }

  async tapDrivingLicensePictureInDrivingLicensePictureField(): Promise<this> {
    await this.drivingLicensePictureInDrivingLicensePictureField.click();
    return this.self;
  }

  async verifyFileFieldVisible(): Promise<this> {
    const { title, inputText } = CREATE_IDENTITY_FILE_FIELD;
    await this.fileField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field should be visible' });
    await this.fileFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field icon should be visible' });
    await this.fileFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field title should be visible' });
    await this.fileFieldText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field text should be visible' });
    await this.addFileButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file button should be visible' });
    await this.addFileButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file button icon should be visible' });
    const titleActual = await this.fileFieldTitle.getText();
    expect(titleActual).toBe(title);
    const textActual = (await this.fileFieldText.getText()) ?? (await this.fileFieldText.getAttribute('content-desc')) ?? (await this.fileFieldText.getAttribute('contentDescription')) ?? '';
    expect(textActual).toBe(inputText);
    return this.self;
  }

  async verifyAllElementsInFileFieldVisible(): Promise<this> {
    const { title, inputText } = CREATE_IDENTITY_FILE_FIELD;
    await this.fileField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field should be visible' });
    await this.fileFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field icon should be visible' });
    await this.fileFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field title should be visible' });
    await this.fileFieldText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'File field text should be visible' });
    await this.addFileButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file button should be visible' });
    await this.addFileButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Add file button icon should be visible' });
    const titleActual = (await this.fileFieldTitle.getText()) ?? (await this.fileFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const textActual = (await this.fileFieldText.getText()) ?? (await this.fileFieldText.getAttribute('content-desc')) ?? (await this.fileFieldText.getAttribute('contentDescription')) ?? '';
    expect(textActual).toBe(inputText);
    return this.self;
  }

  async tapAddFileButton(): Promise<this> {
    await this.addFileButton.click();
    return this.self;
  }

  async verifyNewFileFieldWithAllElementsVisible(): Promise<this> {
    const { title, fileText } = CREATE_IDENTITY_NEW_FILE_FIELD;
    await this.newFileField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field should be visible' });
    await this.newFileFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field icon should be visible' });
    await this.newFileFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field title should be visible' });
    await this.newFileFieldText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field text should be visible' });
    await this.newFileFieldDeleteButton.waitForDisplayed({ timeout: 10000, timeoutMsg: 'New file field delete button should be visible' });
    const titleActual = (await this.newFileFieldTitle.getText()) ?? (await this.newFileFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const fileTextActual = (await this.newFileFieldText.getText()) ?? (await this.newFileFieldText.getAttribute('text')) ?? '';
    expect(fileTextActual).toBe(fileText);
    return this.self;
  }

  async tapNewFileFieldButton(): Promise<this> {
    await this.newFileFieldText.click();
    return this.self;
  }

  async verifySharedFilePopupTitleVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_SHARED_FILE_POPUP;
    await this.sharedFilePopupTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Shared file popup title should be visible' });
    const titleActual = (await this.sharedFilePopupTitle.getText()) ?? (await this.sharedFilePopupTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyQuickShareButtonPopupVisible(): Promise<this> {
    await this.quickShareButtonPopup.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Quick Share button popup should be visible' });
    return this.self;
  }

  async verifySharedFilePopupTextVisible(): Promise<this> {
    const { text } = CREATE_IDENTITY_SHARED_FILE_POPUP;
    await this.sharedFilePopupText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Shared file popup text should be visible' });
    const textActual = (await this.sharedFilePopupText.getText()) ?? (await this.sharedFilePopupText.getAttribute('text')) ?? (await this.sharedFilePopupText.getAttribute('content-desc')) ?? (await this.sharedFilePopupText.getAttribute('contentDescription')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async verifyNoteFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_NOTE_FIELD;
    await this.noteField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field should be visible' });
    await this.noteFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field icon should be visible' });
    await this.noteFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field title should be visible' });
    await this.noteFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field input should be visible' });
    const titleActual = await this.noteFieldTitle.getText();
    expect(titleActual).toBe(title);
    const inputActual = (await this.noteFieldInput.getText()) ?? (await this.noteFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyAllElementsInNoteFieldVisible(): Promise<this> {
    const { title, inputPlaceholder } = CREATE_IDENTITY_NOTE_FIELD;
    await this.noteField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field should be visible' });
    await this.noteFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field icon should be visible' });
    await this.noteFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field title should be visible' });
    await this.noteFieldInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Note field input should be visible' });
    const titleActual = (await this.noteFieldTitle.getText()) ?? (await this.noteFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    const inputActual = (await this.noteFieldInput.getText()) ?? (await this.noteFieldInput.getAttribute('text')) ?? '';
    expect(inputActual).toBe(inputPlaceholder);
    return this.self;
  }

  async verifyCustomFieldVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_CUSTOM_FIELD;
    await this.customField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field should be visible' });
    await this.customFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field icon should be visible' });
    await this.customFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field title should be visible' });
    await this.customFieldIcon2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field icon 2 should be visible' });
    const titleActual = await this.customFieldTitle.getText();
    expect(titleActual).toBe(title);
    return this.self;
  }

  async verifyAllElementsInCreateCustomElementFieldVisible(): Promise<this> {
    const { title } = CREATE_IDENTITY_CUSTOM_FIELD;
    await this.customField.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field should be visible' });
    await this.customFieldIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field icon should be visible' });
    await this.customFieldTitle.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field title should be visible' });
    await this.customFieldIcon2.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Custom field icon 2 should be visible' });
    const titleActual = (await this.customFieldTitle.getText()) ?? (await this.customFieldTitle.getAttribute('text')) ?? '';
    expect(titleActual).toBe(title);
    return this.self;
  }

  async tapCreateCustomElementFieldButton(): Promise<this> {
    await this.customField.click();
    return this.self;
  }

  async verifyNewElementInCustomFieldVisible(): Promise<this> {
    const { text } = CREATE_IDENTITY_NEW_ELEMENT_IN_CUSTOM_FIELD;
    await this.createNoteButtonIcon.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create note button icon should be visible' });
    await this.createNoteButtonText.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Create note button text should be visible' });
    const textActual = (await this.createNoteButtonText.getText()) ?? (await this.createNoteButtonText.getAttribute('text')) ?? '';
    expect(textActual).toBe(text);
    return this.self;
  }

  async waitForCreateIdentityPageLoaded(timeout = 10000): Promise<this> {
    await this.personalInformationIcon.waitForDisplayed({
      timeout,
      timeoutMsg: 'Create identity page personal information icon not visible',
    });
    return this.self;
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
export default CreateIdentityPage;