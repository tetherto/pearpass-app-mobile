import 'mocha';
import { Pages } from '@support/page-factory';
import { ENTER_PASSWORD_SCREEN } from '@data/signUp.data';
import { TEST_PASSWORDS } from '@data/signUp.data';
import { CHOOSE_VAULT_POPUP } from '@data/sidebar.data';
import { browser } from '@wdio/globals';

describe('Sidebar Flow', () => {

  it('[PAS-XXX] User Enter master password and see Select a Vault screen', async () => {
    const { signUp, home } = Pages;
    
    await signUp.waitForEnterPasswordScreen();
    await signUp.enterMasterPassword(TEST_PASSWORDS.valid.complex);
    await signUp.tapEnterPasswordContinue();
    await signUp.enterPasswordIncorrectPassword4AttemptsWarning.waitForDisplayed({ timeout: 5000 });
    await signUp.verifyValidationError('incorrectPassword4Attempts', 'enterMasterPassword');
    await signUp.enterMasterPassword(TEST_PASSWORDS.valid.standard);
    await signUp.tapEnterPasswordContinue();
    await signUp.verifySelectVaultsTitle();
    await signUp.tapSelectVaultsVaultItem();
    await home.verifyHomeLogoLockVisible();
  });


  it('[PAS-XXX] User should see Sidebar page with all elements', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.verifyAllElements();
  });

  it('[PAS-XXX] User should see All Folders selected by default', async () => {
    const { sidebar } = Pages;

    await sidebar.verifyAllFoldersSelected();
  });

  it('[PAS-XXX] User can tap on Favorites and see favorite folder on HomePage', async () => {
    const { sidebar, home } = Pages;
    
    await sidebar.tapFavorites();
    await home.verifyFavoriteFolder();
  });

  it('[PAS-XXX] User should see Favorites selected in Sidebar after tapping on it', async () => {
    const { sidebar, home } = Pages;
    
    await home.tapHomeLogoLock();
    await sidebar.verifyFavoritesSelected();
  });

  it('[PAS-XXX] User can tap on Create new and navigate to Create new folder page', async () => {
    const { sidebar } = Pages;

    await sidebar.tapCreateNew();
    // Verify navigation to Create new folder page with all elements
    await sidebar.verifyCreateNewFolderPageFull();
    // Go back to Sidebar
    await sidebar.tapCreateNewFolderPageCloseButton();
  });
  

  it('[PAS-XXX] User can tap on Add Device button and see Add Device popup with all elements', async () => {
    const { sidebar, home } = Pages;

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
    const { sidebar, home } = Pages;
    
    await home.tapHomeLogoLock();
    await sidebar.tapAddDevice();
    // Verify Share this Vault tab is active by default
    await sidebar.verifyAddDevicePopupShareVaultTab();
    // Switch to Import vault tab
    await sidebar.tapAddDevicePopupImportVaultTab();
    await sidebar.vaultKeyFieldInput.waitForDisplayed({ timeout: 5000 });
    // Verify Import vault tab content
    await sidebar.verifyAddDevicePopupImportVaultTab();
    // Switch back to Share this Vault tab
    await sidebar.tapAddDevicePopupShareVaultTab();
    // Verify Share this Vault tab content again
    await sidebar.verifyAddDevicePopupShareVaultTab();
    // Close the popup
    await sidebar.tapAddDevicePopupBackButton();
  });

  it('[PAS-XXX] User can see warning message in Add Device popup', async () => {
    const { sidebar, home } = Pages;
    
    await home.tapHomeLogoLock();
    await sidebar.tapAddDevice();
    // Verify warning is visible
    await sidebar.verifyAddDevicePopupWarning();
    // Close the popup
    await sidebar.tapAddDevicePopupBackButton();
  });

  it('[PAS-XXX] User can see QR code and vault key in Add Device popup', async () => {
    const { sidebar, home } = Pages;
    
    await home.tapHomeLogoLock();
    await sidebar.tapAddDevice();
    // Wait for QR code to load
    await browser.pause(1000);
    // Verify QR code is visible
    const qrCodeDisplayed = await sidebar.addDevicePopupQrCode.isDisplayed();
    if (!qrCodeDisplayed) throw new Error('QR code should be visible');
    // Verify vault key text is visible
    const vaultKeyTextDisplayed = await sidebar.addDevicePopupCopyVaultKeyText.isDisplayed();
    if (!vaultKeyTextDisplayed) throw new Error('Vault key text should be visible');
    // Verify copy button is visible
    const copyButtonDisplayed = await sidebar.addDevicePopupCopyVaultKeyButton.isDisplayed();
    if (!copyButtonDisplayed) throw new Error('Copy vault key button should be visible');
    // Close the popup
    await sidebar.tapAddDevicePopupBackButton();
  });

  it('[PAS-XXX] User can see validation warning when trying to create folder without title', async () => {
    const { sidebar, home } = Pages;
    
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
    const { sidebar, home } = Pages;
    const folderTitle = 'Test Folder';
    const folderTitleText = await sidebar.createNewFolderPageFieldInput.getText();
    
    await home.tapHomeLogoLock();
    await sidebar.tapCreateNew();
    // Verify page is loaded
    await sidebar.verifyCreateNewFolderPageFull();
    // Enter folder title
    await sidebar.enterFolderTitle(folderTitle);
    // Verify title was entered
    expect(folderTitleText).toBe(folderTitle);
    // Go back without saving
    await sidebar.tapCloseButton();
  });
  
  it('[PAS-XXX] User can create New folder', async () => {
    const { sidebar, home } = Pages;
    const folderTitle = 'Test Folder';
    
    await home.tapHomeLogoLock();
    await sidebar.tapCreateNew();
    await sidebar.enterFolderTitle(folderTitle);
    await sidebar.tapCreateNewFolderPageButton();
    await sidebar.waitForLoaded();
    await sidebar.verifyTestFolder();
    await sidebar.tapTestFolder();
    await home.waitForHomePageLoaded();
    await home.homeTestFolderIcon.waitForDisplayed({ timeout: 5000 });
    await home.verifyTestFolder();
    await home.tapHomeLogoLock();
    await sidebar.verifyTestFolderSelected();
  });

  it('[PAS-XXX] User can rename Test Folder', async () => {
    const { sidebar } = Pages;
    const folderTitle = 'Test Folder1';

    await sidebar.testFolder.waitForDisplayed({ timeout: 5000 });
    await sidebar.longTapTestFolder();
    await sidebar.editDeleteFoldersPopup.waitForDisplayed({ timeout: 5000 });
    await sidebar.verifyEditDeleteFoldersPopup();
    await sidebar.verifyEditDeleteFoldersPopupFull();
    await sidebar.tapRenameButton();
    await sidebar.enterFolderTitle(folderTitle);
    await sidebar.verifyCreateNewFolderPageSaveButton();
    await sidebar.tapCreateNewFolderPageSaveButton();
    await sidebar.waitForLoaded();
    await sidebar.testFolder1.waitForDisplayed({ timeout: 5000 });
    await sidebar.verifyTestFolder1();
  });

  it('[PAS-XXX] Check that Folder name changes after renaming on HomePage', async () => {
    const { sidebar, home } = Pages;

    await sidebar.closeHomePageBySwipe();
    await home.waitForHomePageLoaded();
    await home.homeTestFolderIcon.waitForDisplayed({ timeout: 5000 });
    await home.verifyTestFolder1();
  });

  it('[PAS-XXX] User can delete Test Folder', async () => {
    const { sidebar, home } = Pages;
    
    await home.tapHomeLogoLock();
    await sidebar.longTapTestFolder1();
    await sidebar.editDeleteFoldersPopup.waitForDisplayed({ timeout: 5000 });
    await sidebar.verifyEditDeleteFoldersPopup();
    await sidebar.tapDeleteButton();
    await sidebar.verifyDeleteFolderPopupFull();
    await sidebar.tapDeleteFolderPopupConfirmButton();
    await sidebar.verifyTestFolder1NotDisplayed();
  });


  it('[PAS-XXX] User can tap on Close Vault button and navigate to Enter Master Password page', async () => {
    const { sidebar, signUp, home } = Pages;
    
    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCloseVault();
    await signUp.waitForEnterPasswordScreen();
    const enterPasswordTitleText = await signUp.enterPasswordTitle.getText();
    expect(enterPasswordTitleText).toBe(ENTER_PASSWORD_SCREEN.title);
  });

  it('[PAS-XXX] User can create new vault', async () => {
    const { home, signUp } = Pages;
    const vaultName = 'Kazik';
    const vaultNameText = await signUp.newVaultNameInput.getText();

    await signUp.enterMasterPassword(TEST_PASSWORDS.valid.standard);
    await signUp.tapEnterPasswordContinue();
    await signUp.verifySelectVaultsTitle();
    await signUp.tapCreateNewVault();
    await signUp.waitForNewVaultScreen();
    await signUp.enterVaultName(vaultName);
    expect(vaultNameText).toBe(vaultName);
    await signUp.tapNewVaultContinue();
    await home.verifyHomeLogoLockVisible();
  });

  it('[PAS-XXX] User can see and choose created vault in Sidebar', async () => {
    const { sidebar, home } = Pages;
    
    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.verifyChooseVaultButton();
    await sidebar.tapChooseVaultButton();
    await sidebar.chooseVaultDropdownMenu.waitForDisplayed({ timeout: 10000 });
    await sidebar.verifyChooseVaultPopupFull();
    await sidebar.taphideDropdownMenuIcon();
    await sidebar.chooseVaultDropdownMenuIsNotVisible();
    await sidebar.tapChooseVaultButton();
    await sidebar.chooseValeronVault();
    await browser.pause(3000);
    await home.waitForHomePageLoaded();
    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.chooseVaultButtonText1.waitForDisplayed({ timeout: 5000 });
    await sidebar.verifyChooseVaultButtonText1(CHOOSE_VAULT_POPUP.valeronVault);
    await sidebar.closeHomePageBySwipe();
  });

  it('[PAS-XXX] User is logged out after tapping on System Home button', async () => {
    const { home, signUp } = Pages;

    await home.tapSystemHomeButton();
    await home.activateApp();
    await signUp.waitForEnterPasswordScreen();
    const enterPasswordTitleText = await signUp.enterPasswordTitle.getText();
    expect(enterPasswordTitleText).toBe(ENTER_PASSWORD_SCREEN.title);
  });
});
