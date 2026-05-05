import BasePage from '@pages/BasePage';
import createLoginLocators from '@locators/CreateItems/CreateLoginLocators';
import { CREATE_LOGIN_PAGE } from '@data/create-items-data/createLogin.data';


export class CreateLoginPage extends BasePage {
  protected selectors = createLoginLocators;

  async verifyCreateNewLoginItemPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('createLoginPageTitle', 20000);
    await this.expectDisplayed('createLoginPageTitle');
    await this.expectExactText('createLoginPageTitle', CREATE_LOGIN_PAGE.title);
    return this.self;
  }

  async verifyTitleFieldDisplayed(): Promise<this> {
    await this.waitForDisplayed('titleField', 20000);
    await this.expectDisplayed('titleField');
    await this.expectDisplayed('titleFieldTitle');
    await this.expectExactText('titleFieldTitle', CREATE_LOGIN_PAGE.titleField.title);
    await this.expectDisplayed('titleFieldInput');
    await this.expectExactText('titleFieldInput', CREATE_LOGIN_PAGE.titleField.inputPlaceholder);
    return this.self;
  }

  async verifyTitleRequiredErrorMessageDisplayed(): Promise<this> {
    await this.waitForDisplayed('titleRequiredErrorMessage', 20000);
    await this.expectDisplayed('titleRequiredErrorMessage');
    await this.expectExactText(
      'titleRequiredErrorMessage',
      CREATE_LOGIN_PAGE.titleField.requiredErrorMessage,
    );
    await this.expectDisplayed('titleRequiredErrorMessageIcon');
    return this.self;
  }

  async verifyAllCredentialsElementsDisplayed(): Promise<this> {
    const { credentials } = CREATE_LOGIN_PAGE;

    await this.waitForDisplayed('credentialsTitle', 20000);
    await this.expectDisplayed('credentialsTitle');
    await this.expectExactText('credentialsTitle', credentials.title);

    await this.expectDisplayed('emailUsernameField');
    await this.expectDisplayed('emailUsernameFieldTitle');
    await this.expectExactText('emailUsernameFieldTitle', credentials.emailUsernameField.title);
    await this.expectDisplayed('emailUsernameFieldInput');
    await this.expectExactText(
      'emailUsernameFieldInput',
      credentials.emailUsernameField.inputPlaceholder,
    );

    await this.expectDisplayed('passwordField');
    await this.expectDisplayed('passwordFieldTitle');
    await this.expectExactText('passwordFieldTitle', credentials.passwordField.title);
    await this.expectDisplayed('passwordFieldInput');
    await this.expectExactText(
      'passwordFieldInput',
      credentials.passwordField.inputPlaceholder,
    );
    await this.expectDisplayed('showPasswordButton');

    await this.expectDisplayed('generatePasswordButton');
    await this.expectDisplayed('generatePasswordButtonText');
    await this.expectExactText(
      'generatePasswordButtonText',
      credentials.generatePasswordButton.text,
    );
    await this.expectDisplayed('generatePasswordButtonIcon');

    return this.self;
  }

  async verifyAllDetailsElementsDisplayed(): Promise<this> {
    const { details } = CREATE_LOGIN_PAGE;

    await this.waitForDisplayed('detailsTitle', 20000);
    await this.expectDisplayed('detailsTitle');
    await this.expectExactText('detailsTitle', details.title);

    await this.expectDisplayed('websiteField');
    await this.expectDisplayed('websiteFieldTitle');
    await this.expectExactText('websiteFieldTitle', details.websiteField.title);
    await this.expectDisplayed('websiteFieldInput');
    await this.expectExactText('websiteFieldInput', details.websiteField.inputPlaceholder);

    await this.expectDisplayed('addAnotherWebsiteButton');
    await this.expectDisplayed('addAnotherWebsiteButtonText');
    await this.expectExactText(
      'addAnotherWebsiteButtonText',
      details.addAnotherWebsiteButton.text,
    );
    await this.expectDisplayed('addAnotherWebsiteButtonIcon');

    await this.expectDisplayed('folderField');
    await this.expectDisplayed('folderFieldTitle');
    await this.expectExactText('folderFieldTitle', details.folderField.title);
    await this.expectDisplayed('chooseFolderText');
    await this.expectExactText('chooseFolderText', details.folderField.chooseFolderText);
    await this.expectDisplayed('chooseFolderActionButton');

    return this.self;
  }

  async verifyAllAdditionalElementsDisplayed(): Promise<this> {
    const { additional } = CREATE_LOGIN_PAGE;

    await this.waitForDisplayed('additionalTitle', 20000);
    await this.expectDisplayed('additionalTitle');
    await this.expectExactText('additionalTitle', additional.title);

    await this.expectDisplayed('commentField');
    await this.expectDisplayed('commentFieldTitle');
    await this.expectExactText('commentFieldTitle', additional.commentField.title);
    await this.expectDisplayed('commentFieldInput');
    await this.expectExactText('commentFieldInput', additional.commentField.inputPlaceholder);

    await this.expectDisplayed('hiddenMessagesField');
    await this.expectDisplayed('hiddenMessagesFieldTitle');
    await this.expectExactText('hiddenMessagesFieldTitle', additional.hiddenMessagesField.title);
    await this.expectDisplayed('hiddenMessagesFieldInput');
    await this.expectExactText(
      'hiddenMessagesFieldInput',
      additional.hiddenMessagesField.inputPlaceholder,
    );
    await this.expectDisplayed('hiddenMessagesFieldShowPasswordButton');

    await this.expectDisplayed('addAnotherMessageButton');
    await this.expectDisplayed('addAnotherMessageButtonText');
    await this.expectExactText(
      'addAnotherMessageButtonText',
      additional.addAnotherMessageButton.text,
    );
    await this.expectDisplayed('addAnotherMessageButtonIcon');

    return this.self;
  }

  async addItemButtonDisplayed(): Promise<this> {
    await this.waitForDisplayed('addItemButton', 20000);
    await this.expectDisplayed('addItemButton');
    await this.expectDisplayed('addItemButtonText');
    await this.expectExactText('addItemButtonText', CREATE_LOGIN_PAGE.addItemButton.text);
    return this.self;
  }

  async tapOnAddItemButton(): Promise<this> {
    await this.waitForDisplayed('addItemButton', 20000);
    await this.tap('addItemButton');
    return this.self;
  }

  async tapOnGeneratePasswordButton(): Promise<this> {
    await this.waitForDisplayed('generatePasswordButton', 20000);
    await this.tap('generatePasswordButton');
    return this.self;
  }

  async tapOnAddAnotherWebsiteButton(): Promise<this> {
    await this.waitForDisplayed('addAnotherWebsiteButton', 20000);
    await this.tap('addAnotherWebsiteButton');
    return this.self;
  }

  async verifyDeleteWebsiteButtonAppearsOnWebsiteField(): Promise<this> {
    await this.waitForDisplayed('websiteFieldDeleteButton', 20000);
    await this.expectDisplayed('websiteFieldDeleteButton');
    return this.self;
  }

  async verifyDeleteWebsiteButtonNotDisplayedOnWebsiteField(): Promise<this> {
    await this.expectDisplayed('websiteFieldDeleteButton', false);
    return this.self;
  }

  async tapOnWebsiteFieldDeleteButton(): Promise<this> {
    await this.waitForDisplayed('newWebsiteFieldDeleteButton', 20000);
    await this.tap('newWebsiteFieldDeleteButton');
    return this.self;
  }

  async tapOnFolderField(): Promise<this> {
    await this.waitForDisplayed('folderField', 20000);
    await this.tap('folderField');
    return this.self;
  }

  async tapOnChooseFolderActionButton(): Promise<this> {
    await this.waitForDisplayed('chooseFolderActionButton', 20000);
    await this.tap('chooseFolderActionButton');
    return this.self;
  }

  async tapOnAddNewFolderButton(): Promise<this> {
    await this.waitForDisplayed('foldersPopupAddNewFolder', 20000);
    await this.tap('foldersPopupAddNewFolder');
    return this.self;
  }

  async verifyFoldersPopupWithAllElementsDisplayed(): Promise<this> {
    const { foldersPopup } = CREATE_LOGIN_PAGE;

    await this.waitForDisplayed('foldersPopup', 20000);
    await this.expectDisplayed('foldersPopup');
    await this.expectDisplayed('foldersPopupTitle');
    await this.expectExactText('foldersPopupTitle', foldersPopup.title);
    await this.expectDisplayed('popupCloseButton');

    await this.expectDisplayed('foldersPopupAddNewFolder');
    await this.expectDisplayed('foldersPopupAddNewFolderText');
    await this.expectExactText(
      'foldersPopupAddNewFolderText',
      foldersPopup.addNewFolder.text,
    );
    await this.expectDisplayed('foldersPopupAddNewFolderIcon');

    return this.self;
  }

  async verifyFoldersPopupNotDisplayed(): Promise<this> {
    await this.expectDisplayed('foldersPopup', false);
    return this.self;
  }

  async verifyTestFolderActionsPopupWithAllElementsDisplayed(): Promise<this> {
    const { testFolderActionsPopup } = CREATE_LOGIN_PAGE;

    await this.waitForDisplayed('testFolderActionsPopup', 20000);
    await this.expectDisplayed('testFolderActionsPopup');
    await this.expectDisplayed('testFolderActionsPopupTitle');
    await this.expectExactText(
      'testFolderActionsPopupTitle',
      testFolderActionsPopup.title,
    );
    await this.expectDisplayed('popupCloseButton');

    await this.expectDisplayed('testFolderActionsPopupRenameButton');
    await this.expectDisplayed('testFolderActionsPopupRenameButtonText');
    await this.expectExactText(
      'testFolderActionsPopupRenameButtonText',
      testFolderActionsPopup.rename.text,
    );
    await this.expectDisplayed('testFolderActionsPopupRenameButtonIcon');

    await this.expectDisplayed('testFolderActionsPopupDeleteFolderButton');
    await this.expectDisplayed('testFolderActionsPopupDeleteFolderButtonText');
    await this.expectExactText(
      'testFolderActionsPopupDeleteFolderButtonText',
      testFolderActionsPopup.deleteFolder.text,
    );
    await this.expectDisplayed('testFolderActionsPopupDeleteFolderButtonIcon');

    return this.self;
  }

  async tapOnTestFolderFieldThreeDotsButton(): Promise<this> {
    await this.waitForDisplayed('testFolderFieldThreeDotsButton', 20000);
    await this.tap('testFolderFieldThreeDotsButton');
    return this.self;
  }

  async tapOnRenameFolderButton(): Promise<this> {
    await this.waitForDisplayed('testFolderActionsPopupRenameButton', 20000);
    await this.tap('testFolderActionsPopupRenameButton');
    return this.self;
  }

  async tapOnDeleteFolderButton(): Promise<this> {
    await this.waitForDisplayed('testFolderActionsPopupDeleteFolderButton', 20000);
    await this.tap('testFolderActionsPopupDeleteFolderButton');
    return this.self;
  }

  async tapOnSaveButton(): Promise<this> {
    await this.waitForDisplayed('saveButton', 20000);
    await this.tap('saveButton');
    return this.self;
  }

  async verifyTestFolderDisplayedInFoldersPopupList(): Promise<this> {
    const { testFolder } = CREATE_LOGIN_PAGE.foldersPopup;

    await this.waitForDisplayed('testFolderField', 20000);
    await this.expectDisplayed('testFolderField');

    await this.expectDisplayed('testFolderFieldText');
    await this.expectExactText('testFolderFieldText', testFolder.text);

    await this.expectDisplayed('testFolderFieldItemsCount');
    await this.expectDisplayed('testFolderFieldIcon');
    await this.expectDisplayed('testFolderFieldThreeDotsButton');

    return this.self;
  }

  async tapOnCreateNewFolderButton(): Promise<this> {
    await this.waitForDisplayed('createNewFolderButton', 20000);
    await this.tap('createNewFolderButton');
    return this.self;
  }

  async enterFolderName(folderName: string): Promise<this> {
    await this.waitForDisplayed('createNewFolderPageNameFieldInput', 20000);
    await this.tap('createNewFolderPageNameFieldInput');
    await this.type('createNewFolderPageNameFieldInput', folderName);
    return this.self;
  }

  async verifyCreateNewFolderButtonIsInnactiveByDefault(): Promise<this> {
    await this.waitForDisplayed('createNewFolderButton', 20000);
    await this.expectEnabled('createNewFolderButton', false);
    return this.self;
  }

  async verifyCreateNewFolderPageWithAllElementsDisplayed(): Promise<this> {
    const { createNewFolderPage } = CREATE_LOGIN_PAGE;

    await this.waitForDisplayed('createNewFolderPageTitle', 20000);
    await this.expectDisplayed('createNewFolderPageTitle');
    await this.expectExactText(
      'createNewFolderPageTitle',
      createNewFolderPage.title,
    );

    await this.expectDisplayed('createNewFolderPageNameField');
    await this.expectDisplayed('createNewFolderPageNameFieldTitle');
    await this.expectExactText(
      'createNewFolderPageNameFieldTitle',
      createNewFolderPage.nameField.title,
    );
    await this.expectDisplayed('createNewFolderPageNameFieldInput');

    await this.expectDisplayed('createNewFolderButton');
    await this.expectDisplayed('createNewFolderButtonText');
    await this.expectExactText(
      'createNewFolderButtonText',
      createNewFolderPage.createNewFolderButton.text,
    );

    return this.self;
  }

  async verifyRenameFolderPageWithAllElementsDisplayed(): Promise<this> {
    const { renameFolderPage } = CREATE_LOGIN_PAGE;

    await this.waitForDisplayed('renameFolderPageTitle', 20000);
    await this.expectDisplayed('backButton');
    await this.expectDisplayed('renameFolderPageTitle');
    await this.expectExactText(
      'renameFolderPageTitle',
      renameFolderPage.title,
    );

    await this.expectDisplayed('renameFolderPageNameField');
    await this.expectDisplayed('renameFolderPageNameFieldTitle');
    await this.expectExactText(
      'renameFolderPageNameFieldTitle',
      renameFolderPage.nameField.title,
    );
    await this.expectDisplayed('renameFolderPageNameFieldInput');
    await this.expectExactText(
      'renameFolderPageNameFieldInput',
      renameFolderPage.nameField.currentName,
    );

    await this.expectDisplayed('saveButton');
    await this.expectDisplayed('saveButtonText');
    await this.expectExactText('saveButtonText', renameFolderPage.saveButton.text);

    return this.self;
  }

  async verifyNewWebsiteFieldNotDisplayed(): Promise<this> {
    await this.expectDisplayed('newWebsiteField', false);
    return this.self;
  }

  async verifyNewWebsiteFieldDisplayed(): Promise<this> {
    const { websiteField } = CREATE_LOGIN_PAGE.details;

    await this.waitForDisplayed('newWebsiteField', 20000);
    await this.expectDisplayed('newWebsiteField');
    await this.expectDisplayed('newWebsiteFieldTitle');
    await this.expectExactText('newWebsiteFieldTitle', websiteField.title);
    await this.expectDisplayed('newWebsiteFieldInput');
    await this.expectExactText('newWebsiteFieldInput', websiteField.inputPlaceholder);
    await this.expectDisplayed('newWebsiteFieldDeleteButton');
    return this.self;
  }
}

export default CreateLoginPage;
