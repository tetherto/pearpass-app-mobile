import 'mocha';
import { Pages } from '@support/page-factory';
import { restartAndNavigateToCreateLoginItemPage, addFileToCreateLoginItemPage, addAnotherMessageToCreateLoginItemPage } from '@helpers/test-setup';

describe('Home Page - Main Navigation', () => {
  
  beforeEach(async () => {
    await restartAndNavigateToCreateLoginItemPage();
  });

  it('[] Verify that all elements are displayed on Create Login Item page', async () => {
    const { createLogin } = Pages;

    await createLogin.verifyTitleFieldDisplayed();
    await createLogin.verifyAllCredentialsElementsDisplayed();
    await createLogin.verifyAllDetailsElementsDisplayed();
    await createLogin.swipe('up');
    await createLogin.verifyAllAdditionalElementsDisplayed();
    await createLogin.addItemButtonDisplayed();
  });

  it('[] Verify that Add Item button is inactive by default', async () => {
    const { createLogin } = Pages;

    await createLogin.verifyAddItemButtonIsInactiveByDefault();
  });

  it('[] User redirect to New Password Item page when Generate Password button is tapped', async () => {
    const { createLogin, createPassword } = Pages;

    await createLogin.tapOnGeneratePasswordButton();
    await createPassword.verifyCreateNewPasswordItemPageDisplayed();
    await createLogin.tapOnBackButton();
    await createLogin.verifyCreateNewLoginItemPageDisplayed();
  });

  it('[] User can add another Website field when Add Another Website button is tapped', async () => {
    const { createLogin } = Pages;

    await createLogin.tapOnAddAnotherWebsiteButton();
    await createLogin.verifyNewWebsiteFieldDisplayed();
    await createLogin.verifyDeleteWebsiteButtonAppearsOnWebsiteField();
  });

  it('[] User can delete Website field when Delete button is tapped', async () => {
    const { createLogin } = Pages;

    await createLogin.tapOnWebsiteFieldDeleteButton();
    await createLogin.verifyNewWebsiteFieldNotDisplayed();
    await createLogin.verifyDeleteWebsiteButtonNotDisplayedOnWebsiteField();
  });

  it('[] Verify that Folders popup is displayed when User taps on Folder field', async () => {
    const { createLogin } = Pages;

    await createLogin.tapOnFolderField();
    await createLogin.verifyFoldersPopupWithAllElementsDisplayed();
    await createLogin.tapOnPopupCloseButton();
    await createLogin.verifyFoldersPopupNotDisplayed();
  });

  it('[] User can add new folder when Add New Folder button is tapped', async () => {
    const { createLogin } = Pages;

    await createLogin.tapOnChooseFolderActionButton();
    await createLogin.verifyFoldersPopupWithAllElementsDisplayed();
    await createLogin.tapOnAddNewFolderButton();
    await createLogin.verifyCreateNewFolderPageWithAllElementsDisplayed();
    await createLogin.verifyCreateNewFolderButtonIsInnactiveByDefault();
    await createLogin.enterFolderName('Test Folder');
    await createLogin.tapOnCreateNewFolderButton();
    await createLogin.verifyTestFolderDisplayedInFoldersField();
    await createLogin.tapOnChooseFolderActionButton();
    await createLogin.verifyTestFolderDisplayedInFoldersPopupList();
    await createLogin.tapOnPopupCloseButton();
  });

  it('[] User can rename Folder field when Rename button is tapped', async () => {
    const { createLogin } = Pages;

    await createLogin.tapOnChooseFolderActionButton();
    await createLogin.verifyTestFolderDisplayedInFoldersPopupList();
    await createLogin.tapOnTestFolderFieldThreeDotsButton();
    await createLogin.verifyTestFolderActionsPopupWithAllElementsDisplayed();
    await createLogin.tapOnRenameFolderButton();
    await createLogin.verifyRenameFolderPageWithAllElementsDisplayed();
    await createLogin.enterFolderName('Renamed Folder');
    await createLogin.tapOnSaveButton();
    await createLogin.verifyTestFolderDisplayedInFoldersField();
  });

  it('[] User can delete Folder field when Delete Folder button is tapped', async () => {
    const { createLogin } = Pages;

    await createLogin.tapOnChooseFolderActionButton();
    await createLogin.verifyTestFolderDisplayedInFoldersPopupList();
    await createLogin.tapOnTestFolderFieldThreeDotsButton();
    await createLogin.verifyTestFolderActionsPopupWithAllElementsDisplayed();
    await createLogin.tapOnDeleteFolderButton();
    await createLogin.deleteFolderPageWithAllElementsDisplayed();
    await createLogin.tapOnDeleteButton();
  });

  it('[] User can add file', async () => {
    const { createLogin } = Pages;

    await createLogin.swipe('up');
    await createLogin.verifyFileAndPhotoFieldDisplayed();
    await createLogin.tapOnFileAndPhotoField();
    await createLogin.verifyFileAndPhotoFieldPopupWithAllElementsDisplayed();
    await createLogin.tapOnChooseFileButton();
    await createLogin.chooseDownloadsFolder();
    await createLogin.chooseFile('ownersManualFile');
    await createLogin.verifyOwnersManualFileDisplayedInAttachmentField();
    await createLogin.verifyDeleteAttachmentButtonDisplayed();
  });

  it('[] User can delete file when Delete button is tapped', async () => {
    const { createLogin } = Pages;

    await addFileToCreateLoginItemPage();
    await createLogin.tapOnDeleteAttachmentButton();
    await createLogin.verifyOwnersManualFileNotDisplayedInAttachmentField();
    await createLogin.verifyOwnersManualFileIconNotDisplayedInAttachmentField();
    await createLogin.verifyDeleteAttachmentButtonNotDisplayedOnAttachmentField();
  });

  it('[] User can add Photo/Video', async () => {
    const { createLogin } = Pages;

    await createLogin.swipe('up');
    await createLogin.verifyFileAndPhotoFieldDisplayed();
    await createLogin.tapOnFileAndPhotoField();
    await createLogin.verifyFileAndPhotoFieldPopupWithAllElementsDisplayed();
    await createLogin.tapOnChoosePhotoVideoButton();
    await createLogin.verifyPhotoVideoPopupDisplayed();
    await createLogin.tapOnPassportTemplatePhoto();
    await createLogin.verifyPassportTemplatePhotoDisplayedInAttachmentField();
  });

  it('[] User can add Another Hidden Message field when Add Another Message button is tapped', async () => {
    const { createLogin } = Pages;

    await createLogin.swipe('up');
    await createLogin.verifyAddAnotherMessageButtonDisplayed();
    await createLogin.tapOnAddAnotherMessageButton();
    await createLogin.swipe('up');
    await createLogin.verifyNewHiddenMessageWithAllElementsDisplayed();
    await createLogin.verifyDeleteHiddenMessageButtonAppearsOnHiddenMessageField();
  });

  it('[] User can delete Hidden Message field when Delete button is tapped', async () => {
    const { createLogin } = Pages;

    await addAnotherMessageToCreateLoginItemPage();
    await createLogin.tapOnNewHiddenMessageFieldDeleteButton();
    await createLogin.verifyNewHiddenMessageFieldNotDisplayed();
    await createLogin.verifyDeleteHiddenMessageButtonNotDisplayedOnHiddenMessageField();
  });

  it('[] It is impposible to load file larger than 6MB', async () => {
    const { createLogin } = Pages;

    await createLogin.swipe('up');
    await createLogin.verifyFileAndPhotoFieldDisplayed();
    await createLogin.tapOnFileAndPhotoField();
    await createLogin.verifyFileAndPhotoFieldPopupWithAllElementsDisplayed();
    await createLogin.tapOnChooseFileButton();
    await createLogin.chooseDownloadsFolder();
    await createLogin.chooseFile('largeFile');
    await createLogin.verifyErrorMessageDisplayed();
  });
});
