import 'mocha';
import { Pages } from '@support/page-factory';
import { ENTER_PASSWORD_SCREEN, TEST_PASSWORDS } from '@data/signUp.data';
import { CHOOSE_VAULT_POPUP } from '@data/sidebar.data';
import { browser, expect } from '@wdio/globals';
import { restartAndNavigateToHome, restartAndNavigateToHomeWithVault } from '@helpers/test-setup';

// ============================================================
// SIDEBAR ELEMENTS & NAVIGATION
// ============================================================

describe('Sidebar - Elements & Navigation', () => {
  beforeEach(async () => {
    await restartAndNavigateToHome();
  });

  it('[PAS-433, PAS-434] User should see Sidebar page with all elements', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.verifyAllElements();
  });

  it('[PAS-3017] User should see All Folders selected by default', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.verifyAllFoldersSelected();
  });

  it('[PAS-3018] User can tap on Favorites and see favorite folder on HomePage', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapFavorites();
    await home.verifyFavoriteFolder();
  });

  it('[PAS-3019] User should see Favorites selected in Sidebar after tapping on it', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapFavorites();
    await home.verifyFavoriteFolder();
    await home.tapHomeLogoLock();
    await sidebar.verifyFavoritesSelected();
  });
});

// ============================================================
// CREATE NEW FOLDER PAGE
// ============================================================

describe('Sidebar - Create New Folder Page', () => {
  beforeEach(async () => {
    await restartAndNavigateToHome();
  });

  it('[PAS-437, PAS-2488] User can open and close Create new folder page', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCreateNew();
    await sidebar.verifyCreateNewFolderPageFull();
    await sidebar.tapCreateNewFolderPageCloseButton();
    await home.waitForHomePageLoaded();
  });

  it('[PAS-2487] User can see validation warning when trying to create folder without title', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCreateNew();
    await sidebar.verifyCreateNewFolderPageFull();
    await sidebar.tapCreateNewFolderPageButton();
    await sidebar.verifyCreateNewFolderPageWarning();
    await sidebar.tapCreateNewFolderPageCloseButton();
  });

  it('[PAS-3020] User can enter folder title in Create new folder page', async () => {
    const { sidebar, home } = Pages;
    const folderTitle = 'Test Folder';

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCreateNew();
    await sidebar.verifyCreateNewFolderPageFull();
    await sidebar.enterFolderTitle(folderTitle);
    const folderTitleText =
      (await sidebar.createNewFolderPageFieldInput.getAttribute('text')) ||
      (await sidebar.createNewFolderPageFieldInput.getText());
    expect(folderTitleText).toBe(folderTitle);
    await sidebar.tapCloseButton();
  });
});

// ============================================================
// ADD DEVICE POPUP
// ============================================================

describe('Sidebar - Add Device Popup', () => {
  before(async () => {
    await restartAndNavigateToHome();
  });

  it('[PAS-1665] User can tap on Add Device button and see Add Device popup with all elements', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapAddDevice();
    await sidebar.verifyAddDevicePopupFull();
    await sidebar.addDevicePopupQrCode.waitForDisplayed({ timeout: 30000 });
    await sidebar.verifyAddDevicePopupShareVaultTab();
    await sidebar.tapAddDevicePopupBackButton();
    await home.waitForHomePageLoaded();
  });

  it('[PAS-1666, PAS-1667] User can switch between Share this Vault and Import Vault tabs', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapAddDevice();
    await sidebar.addDevicePopupQrCode.waitForDisplayed({ timeout: 30000 });
    await sidebar.verifyAddDevicePopupShareVaultTab();
    await sidebar.tapAddDevicePopupImportVaultTab();
    await sidebar.vaultKeyFieldInput.waitForDisplayed({ timeout: 30000 });
    await sidebar.verifyAddDevicePopupImportVaultTab();
    await sidebar.tapAddDevicePopupShareVaultTab();
    await sidebar.addDevicePopupQrCode.waitForDisplayed({ timeout: 30000 });
    await sidebar.verifyAddDevicePopupShareVaultTab();
    await sidebar.tapAddDevicePopupBackButton();
    await home.waitForHomePageLoaded();
  });

  it('[PAS-3021] User can see warning message in Add Device popup', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapAddDevice();
    await sidebar.verifyAddDevicePopupWarning();
    await sidebar.tapAddDevicePopupBackButton();
    await home.waitForHomePageLoaded();
  });

  it('[PAS-3022] User can see QR code and vault key in Add Device popup', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapAddDevice();
    const qrCodeDisplayed = await sidebar.addDevicePopupQrCode.isDisplayed();
    if (!qrCodeDisplayed) throw new Error('QR code should be visible');
    const vaultKeyTextDisplayed = await sidebar.addDevicePopupCopyVaultKeyText.isDisplayed();
    if (!vaultKeyTextDisplayed) throw new Error('Vault key text should be visible');
    const copyButtonDisplayed = await sidebar.addDevicePopupCopyVaultKeyButton.isDisplayed();
    if (!copyButtonDisplayed) throw new Error('Copy vault key button should be visible');
    await sidebar.tapAddDevicePopupBackButton();
    await home.waitForHomePageLoaded();
  });
});

// ============================================================
// FOLDER MANAGEMENT (CRUD)
// ============================================================

describe('Sidebar - Folder Management', () => {
  beforeEach(async () => {
    await restartAndNavigateToHome();
  });

  it('[PAS-871, PAS-2486] User can create new folder', async () => {
    const { sidebar, home } = Pages;
    const folderTitle = 'Test Folder';

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCreateNew();
    await sidebar.enterFolderTitle(folderTitle);
    await sidebar.tapCreateNewFolderPageButton();

    await sidebar.waitForLoaded();
    await sidebar.verifyTestFolder();

    await sidebar.tapTestFolder();
    await home.waitForHomePageLoaded();
    await home.homeTestFolderIcon.waitForDisplayed({ timeout: 30000 });
    await home.verifyTestFolder();

    await home.tapHomeLogoLock();
    await sidebar.verifyTestFolderSelected();

    await sidebar.longTapTestFolder();
    await sidebar.editDeleteFoldersPopup.waitForDisplayed({ timeout: 30000 });
    await sidebar.tapDeleteButton();
    await sidebar.tapDeleteFolderPopupConfirmButton();
  });

  it('[PAS-438, PAS-2489, PAS-2490, PAS-2491] User can rename folder', async () => {
    const { sidebar, home } = Pages;
    const originalTitle = 'Test Folder';
    const newTitle = 'Test Folder1';

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCreateNew();
    await sidebar.enterFolderTitle(originalTitle);
    await sidebar.tapCreateNewFolderPageButton();
    await sidebar.waitForLoaded();

    await sidebar.longTapTestFolder();
    await sidebar.editDeleteFoldersPopup.waitForDisplayed({ timeout: 30000 });
    await sidebar.verifyEditDeleteFoldersPopup();
    await sidebar.verifyEditDeleteFoldersPopupFull();
    await sidebar.tapRenameButton();
    await sidebar.enterFolderTitle(newTitle);
    await sidebar.verifyCreateNewFolderPageSaveButton();
    await sidebar.tapCreateNewFolderPageSaveButton();

    await sidebar.waitForLoaded();
    await sidebar.testFolder1.waitForDisplayed({ timeout: 30000 });
    await sidebar.verifyTestFolder1();

    await sidebar.tapTestFolder1();
    await home.waitForHomePageLoaded();
    await browser.pause(1000);

    await home.homeTestFolder1.waitForDisplayed({ timeout: 30000 });

    await home.tapHomeLogoLock();
    await sidebar.longTapTestFolder1();
    await sidebar.editDeleteFoldersPopup.waitForDisplayed({ timeout: 30000 });
    await sidebar.tapDeleteButton();
    await sidebar.tapDeleteFolderPopupConfirmButton();
  });

  it('[PAS-2493, PAS-2495] User can delete folder', async () => {
    const { sidebar, home } = Pages;
    const folderTitle = 'Test Folder';

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCreateNew();
    await sidebar.enterFolderTitle(folderTitle);
    await sidebar.tapCreateNewFolderPageButton();
    await sidebar.waitForLoaded();
    await sidebar.verifyTestFolder();

    await sidebar.longTapTestFolder();
    await sidebar.editDeleteFoldersPopup.waitForDisplayed({ timeout: 30000 });
    await sidebar.verifyEditDeleteFoldersPopup();
    await sidebar.tapDeleteButton();
    await sidebar.verifyDeleteFolderPopupFull();
    await sidebar.tapDeleteFolderPopupConfirmButton();

    await sidebar.verifyTestFolder1NotDisplayed();
  });

  it('[PAS-2494] Cancel button does not delete folder', async () => {
    const { sidebar, home } = Pages;
    const folderTitle = 'Test Folder';

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCreateNew();
    await sidebar.enterFolderTitle(folderTitle);
    await sidebar.tapCreateNewFolderPageButton();
    await sidebar.waitForLoaded();
    await sidebar.verifyTestFolder();

    await sidebar.longTapTestFolder();
    await sidebar.editDeleteFoldersPopup.waitForDisplayed({ timeout: 30000 });
    await sidebar.tapDeleteButton();
    await sidebar.verifyDeleteFolderPopupFull();
    await sidebar.tapDeleteFolderPopupCancelButton();

    await sidebar.waitForLoaded();
    await sidebar.verifyTestFolder();

    await sidebar.closeSidebarPageBySwipe();
    await home.waitForHomePageLoaded();
    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.longTapTestFolder();
    await sidebar.editDeleteFoldersPopup.waitForDisplayed({ timeout: 30000 });
    await sidebar.tapDeleteButton();
    await sidebar.tapDeleteFolderPopupConfirmButton();
  });

  it('[PAS-440] User can scroll list of folders', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();

    await sidebar.tapCreateNew();
    await sidebar.enterFolderTitle('Folder A');
    await sidebar.tapCreateNewFolderPageButton();
    await sidebar.waitForLoaded();

    await sidebar.tapCreateNew();
    await sidebar.enterFolderTitle('Folder B');
    await sidebar.tapCreateNewFolderPageButton();
    await sidebar.waitForLoaded();

    await sidebar.scrollFolderList();

    const folderAVisible = await sidebar.isFolderVisible('Folder A');
    const folderBVisible = await sidebar.isFolderVisible('Folder B');
    
    expect(folderAVisible || folderBVisible).toBe(true);

    if (folderAVisible) {
      await sidebar.deleteFolderByName('Folder A');
      await sidebar.waitForLoaded();
    }

    if (await sidebar.isFolderVisible('Folder B')) {
      await sidebar.deleteFolderByName('Folder B');
    }
  });


  it('[PAS-1649] Folders are displayed in alphabetical order', async () => {
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();

    await sidebar.tapCreateNew();
    await sidebar.enterFolderTitle('Zebra');
    await sidebar.tapCreateNewFolderPageButton();
    await sidebar.waitForLoaded();

    await sidebar.tapCreateNew();
    await sidebar.enterFolderTitle('Apple');
    await sidebar.tapCreateNewFolderPageButton();
    await sidebar.waitForLoaded();

    await sidebar.verifyFolderExists('Apple');
    await sidebar.verifyFolderExists('Zebra');

    const appleLocation = await sidebar.getFolderLocation('Apple');
    const zebraLocation = await sidebar.getFolderLocation('Zebra');

    expect(appleLocation.y).toBeLessThan(zebraLocation.y);

    await sidebar.deleteFolderByName('Apple');
    await sidebar.waitForLoaded();
    await sidebar.deleteFolderByName('Zebra');
  });
});

// ============================================================
// CHOOSE VAULT
// ============================================================

describe('Sidebar - Choose Vault', () => {
  
  it('[PAS-3023] User can create new vault (Kazik) from sidebar', async () => {
    await restartAndNavigateToHome();
    
    const { home, signUp, sidebar } = Pages;
    const vaultName = 'Kazik';

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCloseVault();

    await signUp.waitForEnterPasswordScreen();
    await signUp.enterMasterPassword(TEST_PASSWORDS.valid.standard);
    await signUp.tapEnterPasswordContinue();
    await signUp.verifySelectVaultsTitle();
    await signUp.tapCreateNewVault();
    await signUp.waitForNewVaultScreen();
    await signUp.enterVaultName(vaultName);
    const vaultNameText =
      (await signUp.newVaultNameInput.getAttribute('text')) ||
      (await signUp.newVaultNameInput.getText());
    expect(vaultNameText).toBe(vaultName);
    await signUp.tapNewVaultContinue();
    await home.verifyHomeLogoLockVisible();
  });

  it('[PAS-402, PAS-1463] User can see and choose vault in Sidebar', async () => {
    await restartAndNavigateToHomeWithVault('Kazik');
    
    const { sidebar, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.verifyChooseVaultButton();
    await sidebar.tapChooseVaultButton();
    await sidebar.chooseVaultDropdownMenu.waitForDisplayed({ timeout: 30000 });
    await sidebar.verifyChooseVaultPopupFull();
    await sidebar.taphideDropdownMenuIcon();
    await sidebar.chooseVaultDropdownMenuIsNotVisible();
    await sidebar.tapChooseVaultButton();
    await sidebar.chooseValeronVault();
    await home.waitForHomePageLoaded();
    await home.verifyHomeLogoLockVisible();
  });
});

// ============================================================
// CLOSE VAULT & LOGOUT
// ============================================================

describe('Sidebar - Close Vault & Logout', () => {
  beforeEach(async () => {
    await restartAndNavigateToHome();
  });

  it('[PAS-212] User can tap on Close Vault button and navigate to Enter Master Password page', async () => {
    const { sidebar, signUp, home } = Pages;

    await home.tapHomeLogoLock();
    await sidebar.waitForLoaded();
    await sidebar.tapCloseVault();
    await signUp.waitForEnterPasswordScreen();
    const enterPasswordTitleText = await signUp.enterPasswordTitle.getText();
    expect(enterPasswordTitleText).toBe(ENTER_PASSWORD_SCREEN.title);
  });

  it('[PAS-1643] User is logged out when closing the app', async () => {
    const { home, signUp } = Pages;

    await home.closeApp();
    await home.activateApp();
    await signUp.waitForEnterPasswordScreen();
    const enterPasswordTitleText = await signUp.enterPasswordTitle.getText();
    expect(enterPasswordTitleText).toBe(ENTER_PASSWORD_SCREEN.title);
  });
});
