import 'mocha';
import { Pages } from '@support/page-factory';
import { restartAndNavigateToCreateLoginItemPage } from '@helpers/test-setup';

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

  it('[] Verify that Title required error message is displayed when Title is not entered', async () => {
    const { createLogin } = Pages;

    await createLogin.tapOnAddItemButton();
    await createLogin.verifyTitleRequiredErrorMessageDisplayed();
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
});
