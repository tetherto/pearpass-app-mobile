import 'mocha';
import { Pages } from '@support/page-factory';
import { ENTER_PASSWORD_SCREEN } from '@data/signUp.data';
import { TEST_PASSWORDS } from '@data/signUp.data';

describe('Sidebar Flow', () => {

  it('[PAS-XXX] User Enter master password and see Select a Vault screen', async () => {
    const signUp = Pages.signUp;
    const home = Pages.home;
    await signUp.waitForEnterPasswordScreen();
    await signUp.enterMasterPassword(TEST_PASSWORDS.valid.complex);
    await signUp.tapEnterPasswordContinue();
    await signUp.verifyValidationError('incorrectPassword3Attempts', 'enterMasterPassword');
    await signUp.enterMasterPassword(TEST_PASSWORDS.valid.standard);
    await signUp.tapEnterPasswordContinue();
    await signUp.verifySelectVaultsTitle();
    await signUp.tapSelectVaultsVaultItem();
    await home.verifyHomeLogoLockVisible();
  });


  it('[PAS-XXX] User should see Sidebar page with all elements', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.verifyAllElements();
  });

  it('[PAS-XXX] User should see All Folders selected by default', async () => {
    const sidebar = Pages.sidebar;

    await sidebar.verifyAllFoldersSelected();
  });

  it('[PAS-XXX] User can tap on Favorites and see favorite folder on HomePage', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;
    
    await sidebar.tapFavorites();
    await home.verifyFavoriteFolder();
  });

  it('[PAS-XXX] User should see Favorites selected in Sidebar after tapping on it', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;
    
    await home.tapHomeLogoLock();
    await sidebar.verifyFavoritesSelected();
  });

  it('[PAS-XXX] User can tap on Create new and navigate to Create new folder page', async () => {
    const sidebar = Pages.sidebar;

    await sidebar.tapCreateNew();
    
    // Verify navigation to Create new folder page with all elements
    await sidebar.verifyCreateNewFolderPageFull();
    
    // Go back to Sidebar
    await sidebar.tapCreateNewFolderPageCloseButton();
  });
  

  it('[PAS-XXX] User can tap on Add Device button and see Add Device popup with all elements', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;

    await home.tapHomeLogoLock();
    await sidebar.tapAddDevice();
    
    // Verify that Add Device popup appears with all elements
    await sidebar.verifyAddDevicePopupFull();
    
    // Verify Share this Vault tab content
    await sidebar.verifyAddDevicePopupShareVaultTab();
    
    // Close the popup by pressing back
    await sidebar.tapAddDevicePopupBackButton();
  });

  it('[PAS-XXX] User can switch between Share this Vault and Load a Vault tabs in Add Device popup', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;
    
    await home.tapHomeLogoLock();
    await sidebar.tapAddDevice();
    
    // Verify Share this Vault tab is active by default
    await sidebar.verifyAddDevicePopupShareVaultTab();
    
    // Switch to Load a Vault tab
    await sidebar.tapAddDevicePopupLoadVaultTab();
    
    // Verify Load a Vault tab content
    await sidebar.verifyAddDevicePopupLoadVaultTab();
    
    // Switch back to Share this Vault tab
    await sidebar.tapAddDevicePopupShareVaultTab();
    
    // Verify Share this Vault tab content again
    await sidebar.verifyAddDevicePopupShareVaultTab();
    
    // Close the popup
    await sidebar.tapAddDevicePopupBackButton();
  });

  it('[PAS-XXX] User can see warning message in Add Device popup', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;
    
    await home.tapHomeLogoLock();
    await sidebar.tapAddDevice();
    
    // Verify warning is visible
    await sidebar.verifyAddDevicePopupWarning();
    
    // Close the popup
    await sidebar.tapAddDevicePopupBackButton();
  });

  it('[PAS-XXX] User can see QR code and vault key in Add Device popup', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;
    
    await home.tapHomeLogoLock();
    await sidebar.tapAddDevice();
    
    // Wait for QR code to load
    await browser.pause(1000);
    
    // Verify QR code is visible
    await expect.soft(sidebar.addDevicePopupQrCode)
      .toBeDisplayed({ message: 'QR code should be visible' });
    
    // Verify vault key text is visible
    await expect.soft(sidebar.addDevicePopupCopyVaultKeyText)
      .toBeDisplayed({ message: 'Vault key text should be visible' });
    
    // Verify copy button is visible
    await expect.soft(sidebar.addDevicePopupCopyVaultKeyButton)
      .toBeDisplayed({ message: 'Copy vault key button should be visible' });
    
    // Close the popup
    await sidebar.tapAddDevicePopupBackButton();
  });

  it('[PAS-XXX] User can see validation warning when trying to create folder without title', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;
    
    await home.tapHomeLogoLock();
    await sidebar.tapCreateNew();
    
    // Verify page is loaded
    await sidebar.verifyCreateNewFolderPageFull();
    
    // Try to create folder without title
    await sidebar.tapCreateNewFolderPageButton();
    
    // Verify warning appears
    await sidebar.verifyCreateNewFolderPageWarning();
    
    // Go back
    await sidebar.pressBack();
  });

  it('[PAS-XXX] User can enter folder title in Create new folder page', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;
    
    await home.tapHomeLogoLock();
    
    await sidebar.tapCreateNew();
    
    // Verify page is loaded
    await sidebar.verifyCreateNewFolderPageFull();
    
    // Enter folder title
    const folderTitle = 'Test Folder';
    await sidebar.enterFolderTitle(folderTitle);
    
    // Verify title was entered
    await expect(sidebar.createNewFolderPageFieldInput).toHaveValue(folderTitle);
    
    // Go back without saving
    await sidebar.pressBack();
  });
  
  it('[PAS-XXX] User can create New folder', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;
    
    await home.tapHomeLogoLock();
    
    await sidebar.tapCreateNew();
    const folderTitle = 'Test Folder';
    await sidebar.enterFolderTitle(folderTitle);
    await sidebar.tapCreateNewFolderPageButton();
    await sidebar.verifyTestFolder();
    await sidebar.tapTestFolder();
    await home.verifyTestFolder();
    await home.tapHomeLogoLock();
    await sidebar.verifyTestFolderSelected();
  });

  it('[PAS-XXX] User can rename Test Folder', async () => {
    const sidebar = Pages.sidebar;
    const folderTitle = 'Test Folder1';

    await sidebar.longTapTestFolder();
    await sidebar.verifyEditDeleteFoldersPopup();
    await sidebar.verifyEditDeleteFoldersPopupFull();
    await sidebar.tapRenameButton();
    await sidebar.enterFolderTitle(folderTitle);
    await sidebar.tapRenameButton();
    await sidebar.verifyTestFolder1();
  });

  it('[PAS-XXX] Check that Folder name changes after renaming on HomePage', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;
    await sidebar.closeHomePageBySwipe();
    await home.verifyTestFolder1();
  });

  it('[PAS-XXX] User can delete Test Folder', async () => {
    const sidebar = Pages.sidebar;
    const home = Pages.home;
    
    await home.tapHomeLogoLock();
    await sidebar.longTapTestFolder1();
    await sidebar.verifyEditDeleteFoldersPopup();
    await sidebar.tapDeleteButton();
    await sidebar.verifyDeleteFolderPopupFull();
    await sidebar.tapDeleteFolderPopupConfirmButton();
    await sidebar.verifyTestFolder1NotDisplayed();
  });


  it('[PAS-XXX] User can tap on Close Vault button and navigate to Enter Master Password page', async () => {
    const sidebar = Pages.sidebar;
    const signUp = Pages.signUp;
    const home = Pages.home;
    
    await home.tapHomeLogoLock();
    
    await sidebar.waitForLoaded();
    await sidebar.tapCloseVault();
    
    // Verify navigation to Enter Master Password page
    await signUp.waitForEnterPasswordScreen();
    await expect.soft(signUp.enterPasswordTitle)
      .toHaveText(ENTER_PASSWORD_SCREEN.title, { message: 'Enter Master Password title should match' });
  });
});
