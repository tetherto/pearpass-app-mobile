import BasePage from '@pages/BasePage';
import sidebarLocators from '@locators/SidebarLocators';
import { SIDEBAR_TITLE, SIDEBAR_FOLDERS, SIDEBAR_BUTTONS, ADD_DEVICE_POPUP, CREATE_NEW_FOLDER_PAGE, EDIT_DELETE_FOLDERS_POPUP, DELETE_FOLDER_POPUP } from '@data/sidebar.data';

export class SidebarPage extends BasePage {
  protected selectors = sidebarLocators;

  get title() { return this.$('sidebarTitle'); }
  get allItems() { return this.$('sidebarAllItems'); }
  get allItemsSelected() { return this.$('sidebarAllItemsSelected'); }
  get allItemsCount() { return this.$('sidebarAllItemsCount'); }
  get favorites() { return this.$('sidebarFavorites'); }
  get favoritesCount() { return this.$('sidebarFavoritesCount'); }
  get createNew() { return this.$('sidebarCreateNew'); }
  get addDeviceButton() { return this.$('sidebarAddDeviceButton'); }
  get addDeviceText() { return this.$('sidebarAddDeviceText'); }
  get closeVaultButton() { return this.$('sidebarCloseVaultButton'); }
  get closeVaultText() { return this.$('sidebarCloseVaultText'); }
  get addDevicePopupTitle() { return this.$('addDevicePopupTitle'); }
  get addDevicePopupBackButton() { return this.$('addDevicePopupBackButton'); }
  get addDevicePopupDescription() { return this.$('addDevicePopupDescription'); }
  get addDevicePopupShareVaultTab() { return this.$('addDevicePopupShareVaultTab'); }
  get addDevicePopupShareVaultTabText() { return this.$('addDevicePopupShareVaultTabText'); }
  get addDevicePopupLoadVaultTab() { return this.$('addDevicePopupLoadVaultTab'); }
  get addDevicePopupLoadVaultTabText() { return this.$('addDevicePopupLoadVaultTabText'); }
  get addDevicePopupQrCodeTitle() { return this.$('addDevicePopupQrCodeTitle'); }
  get addDevicePopupQrCode() { return this.$('addDevicePopupQrCode'); }
  get addDevicePopupExpireText() { return this.$('addDevicePopupExpireText'); }
  get addDevicePopupCopyVaultKeyButton() { return this.$('addDevicePopupCopyVaultKeyButton'); }
  get addDevicePopupCopyVaultKeyText() { return this.$('addDevicePopupCopyVaultKeyText'); }
  get addDevicePopupWarning() { return this.$('addDevicePopupWarning'); }
  get addDevicePopupWarningText() { return this.$('addDevicePopupWarningText'); }
  get addDevicePopupWarningIcon() { return this.$('addDevicePopupWarningIcon'); }
  get vaultKeyField() { return this.$('vaultKeyField'); }
  get vaultKeyFieldInput() { return this.$('vaultKeyFieldInput'); }
  get vaultKeyFieldTitle() { return this.$('vaultKeyFieldTitle'); }
  get vaultKeyFieldQrCode() { return this.$('vaultKeyFieldQrCode'); }
  get vaultKeyFieldPasteButton() { return this.$('vaultKeyFieldPasteButton'); }
  get vaultKeyFieldPasteButtonText() { return this.$('vaultKeyFieldPasteButtonText'); }
  get vaultKeyContinueButton() { return this.$('vaultKeyContinueButton'); }
  get vaultKeyContinueButtonText() { return this.$('vaultKeyContinueButtonText'); }
  get createNewFolderPage() { return this.$('createNewFolderPage'); }
  get createNewFolderPageButton() { return this.$('createNewFolderPageButton'); }
  get createNewFolderPageButtonText() { return this.$('createNewFolderPageButtonText'); }
  get createNewFolderPageField() { return this.$('createNewFolderPageField'); }
  get createNewFolderPageFieldTitle() { return this.$('createNewFolderPageFieldTitle'); }
  get createNewFolderPageFieldInput() { return this.$('createNewFolderPageFieldInput'); }
  get createNewFolderPageWarning() { return this.$('createNewFolderPageWarning'); }
  get createNewFolderPageCloseButton() { return this.$('createNewFolderPageCloseButton'); }
  get editDeleteFoldersPopup() { return this.$('editDeleteFoldersPopup'); }
  get renameButton() { return this.$('renameButton'); }
  get deleteButton() { return this.$('deleteButton'); }
  get renameButtonIcon() { return this.$('renameButtonIcon'); }
  get deleteButtonIcon() { return this.$('deleteButtonIcon'); }
  get renameButtonThreeDots() { return this.$('renameButtonThreeDots'); }
  get deleteButtonThreeDots() { return this.$('deleteButtonThreeDots'); }
  get deleteFolderPopup() { return this.$('deleteFolderPopup'); }
  get deleteFolderPopupTitle() { return this.$('deleteFolderPopupTitle'); }
  get deleteFolderPopupDescription() { return this.$('deleteFolderPopupDescription'); }
  get deleteFolderPopupCancelButton() { return this.$('deleteFolderPopupCancelButton'); }
  get deleteFolderPopupConfirmButton() { return this.$('deleteFolderPopupConfirmButton'); }
  get deleteFolderPopupCancelButtonText() { return this.$('deleteFolderPopupCancelButtonText'); }
  get deleteFolderPopupConfirmButtonText() { return this.$('deleteFolderPopupConfirmButtonText'); }
  get favoritesSelected() { return this.$('sidebarFavoritesSelected'); }
  get testFolder() { return this.$('testFolder'); }
  get testFolderIcon() { return this.$('testFolderIcon'); }
  get testFolderCount() { return this.$('testFolderCount'); }
  get testFolderSelected() { return this.$('testFolderSelected'); }
  get testFolder1() { return this.$('testFolder1'); }
  get testFolder1Icon() { return this.$('testFolder1Icon'); }

  async waitForLoaded(): Promise<this> {
    await this.title.waitForDisplayed({ timeoutMsg: 'Sidebar title not visible' });
    await this.allItems.waitForDisplayed({ timeoutMsg: 'All Items option not visible' });
    return this.self;
  }

  async verifyTitle(): Promise<this> {
    await expect.soft(this.title)
      .toHaveText(SIDEBAR_TITLE, { message: 'Sidebar title should be "Folder"' });
    return this.self;
  }

  async verifyAllFolders(): Promise<this> {
    await expect.soft(this.allItems)
      .toBeDisplayed({ message: 'All Items option should be visible' });
    
    await expect.soft(this.allItems)
      .toHaveText(SIDEBAR_FOLDERS.allItems, { message: 'All Items should have correct text' });

    await expect.soft(this.allItemsCount)
      .toBeDisplayed({ message: 'All Items count should be visible' });

    return this.self;
  }

  async verifyAllFoldersSelected(): Promise<this> {
    await expect.soft(this.allItemsSelected)
      .toBeDisplayed({ message: 'All Items should be selected (checkmark visible)' });
    return this.self;
  }

  async verifyFavorites(): Promise<this> {
    await expect.soft(this.favorites)
      .toBeDisplayed({ message: 'Favorites option should be visible' });
    
    await expect.soft(this.favorites)
      .toHaveText(SIDEBAR_FOLDERS.favorites, { message: 'Favorites should have correct text' });

    await expect.soft(this.favoritesCount)
      .toBeDisplayed({ message: 'Favorites count should be visible' });

    return this.self;
  }

  async verifyCreateNew(): Promise<this> {
    await expect.soft(this.createNew)
      .toBeDisplayed({ message: 'Create new option should be visible' });
    
    await expect.soft(this.createNew)
      .toHaveText(SIDEBAR_FOLDERS.createNew, { message: 'Create new should have correct text' });

    return this.self;
  }

  async verifyAddDeviceButton(): Promise<this> {
    await expect.soft(this.addDeviceButton)
      .toBeDisplayed({ message: 'Add Device button should be visible' });
    
    await expect.soft(this.addDeviceText)
      .toHaveText(SIDEBAR_BUTTONS.addDevice, { message: 'Add Device button should have correct text' });

    return this.self;
  }

  async verifyCloseVaultButton(): Promise<this> {
    await expect.soft(this.closeVaultButton)
      .toBeDisplayed({ message: 'Close Vault button should be visible' });
    
    await expect.soft(this.closeVaultText)
      .toHaveText(SIDEBAR_BUTTONS.closeVault, { message: 'Close Vault button should have correct text' });

    return this.self;
  }

  async verifyAllElements(): Promise<this> {
    await this.waitForLoaded();
    await this.verifyTitle();
    await this.verifyAllFolders();
    await this.verifyAllFoldersSelected();
    await this.verifyFavorites();
    await this.verifyCreateNew();
    await this.verifyAddDeviceButton();
    await this.verifyCloseVaultButton();
    return this.self;
  }

  async tapAllFolders(): Promise<this> {
    await this.allItems.click();
    return this.self;
  }

  async tapFavorites(): Promise<this> {
    await this.favorites.click();
    return this.self;
  }

  async tapCreateNew(): Promise<this> {
    await this.createNew.click();
    return this.self;
  }

  async tapAddDevice(): Promise<this> {
    await this.addDeviceButton.click();
    return this.self;
  }

  async tapCloseVault(): Promise<this> {
    await this.closeVaultButton.click();
    return this.self;
  }

  async verifyFavoritesSelected(): Promise<this> {
    await expect.soft(this.favoritesSelected)
      .toBeDisplayed({ message: 'Favorites should be selected (checkmark visible)' });
    return this.self;
  }

  async verifyTestFolder(): Promise<this> {
    await expect.soft(this.testFolder)
      .toBeDisplayed({ message: 'Test Folder option should be visible' });
    
    await expect.soft(this.testFolder)
      .toHaveText('Test Folder', { message: 'Test Folder should have correct text' });

    await expect.soft(this.testFolderIcon)
      .toBeDisplayed({ message: 'Test Folder icon should be visible' });

    await expect.soft(this.testFolderCount)
      .toBeDisplayed({ message: 'Test Folder count should be visible' });

    return this.self;
  }

  async verifyTestFolder1(): Promise<this> {
    await expect.soft(this.testFolder1)
      .toBeDisplayed({ message: 'Test Folder option should be visible' });
    
    await expect.soft(this.testFolder1)
      .toHaveText('Test Folder', { message: 'Test Folder should have correct text' });

    await expect.soft(this.testFolder1Icon)
      .toBeDisplayed({ message: 'Test Folder icon should be visible' });

    await expect.soft(this.testFolderCount)
      .toBeDisplayed({ message: 'Test Folder count should be visible' });

    return this.self;
  }

  async verifyTestFolder1NotDisplayed(): Promise<this> {
    await expect.soft(this.testFolder1)
      .not.toBeDisplayed({ message: 'Test Folder1 should not be displayed' });
    return this.self;
  }

  async verifyTestFolderSelected(): Promise<this> {
    await expect.soft(this.testFolderSelected)
      .toBeDisplayed({ message: 'Test Folder should be selected (checkmark visible)' });
    return this.self;
  }

  async tapTestFolder(): Promise<this> {
    await this.testFolder.click();
    return this.self;
  }
  
  async longTapTestFolder(): Promise<this> {
    await this.testFolder.longPress();
    return this.self;
  }

  async longTapTestFolder1(): Promise<this> {
    await this.testFolder1.longPress();
    return this.self;
  }

  async verifyAddDevicePopup(): Promise<this> {
    await expect.soft(this.addDevicePopupTitle)
      .toBeDisplayed({ message: 'Add Device popup should be visible' });
    
    await expect.soft(this.addDevicePopupTitle)
      .toHaveText(ADD_DEVICE_POPUP.title, { message: 'Add Device popup title should match' });
    
    return this.self;
  }

  async verifyAddDevicePopupFull(): Promise<this> {
    await this.verifyAddDevicePopup();
    
    // Verify back button
    await expect.soft(this.addDevicePopupBackButton)
      .toBeDisplayed({ message: 'Add Device popup back button should be visible' });
    
    // Verify description
    await expect.soft(this.addDevicePopupDescription)
      .toBeDisplayed({ message: 'Add Device popup description should be visible' });
    
    // Verify tabs
    await expect.soft(this.addDevicePopupShareVaultTabText)
      .toBeDisplayed({ message: 'Share this Vault tab should be visible' });
    
    await expect.soft(this.addDevicePopupShareVaultTabText)
      .toHaveText(ADD_DEVICE_POPUP.shareVaultTab, { message: 'Share this Vault tab text should match' });
    
    await expect.soft(this.addDevicePopupLoadVaultTabText)
      .toBeDisplayed({ message: 'Load a Vault tab should be visible' });
    
    await expect.soft(this.addDevicePopupLoadVaultTabText)
      .toHaveText(ADD_DEVICE_POPUP.loadVaultTab, { message: 'Load a Vault tab text should match' });
    
    return this.self;
  }

  async verifyAddDevicePopupShareVaultTab(): Promise<this> {
    // Verify QR code title
    await expect.soft(this.addDevicePopupQrCodeTitle)
      .toBeDisplayed({ message: 'QR code title should be visible' });
    
    await expect.soft(this.addDevicePopupQrCodeTitle)
      .toHaveText(ADD_DEVICE_POPUP.qrCodeTitle, { message: 'QR code title should match' });
    
    // Verify QR code
    await expect.soft(this.addDevicePopupQrCode)
      .toBeDisplayed({ message: 'QR code should be visible' });
    
    // Verify expire text
    await expect.soft(this.addDevicePopupExpireText)
      .toBeDisplayed({ message: 'Expire text should be visible' });
    
    // Verify copy vault key button
    await expect.soft(this.addDevicePopupCopyVaultKeyButton)
      .toBeDisplayed({ message: 'Copy vault key button should be visible' });
    
    await expect.soft(this.addDevicePopupCopyVaultKeyButton)
      .toHaveText(ADD_DEVICE_POPUP.copyVaultKeyButton, { message: 'Copy vault key button text should match' });
    
    // Verify vault key text
    await expect.soft(this.addDevicePopupCopyVaultKeyText)
      .toBeDisplayed({ message: 'Vault key text should be visible' });
    
    // Verify warning
    await expect.soft(this.addDevicePopupWarningText)
      .toBeDisplayed({ message: 'Warning text should be visible' });
    
    await expect.soft(this.addDevicePopupWarningText)
      .toHaveText(ADD_DEVICE_POPUP.warningText, { message: 'Warning text should match' });
    
    return this.self;
  }

  async verifyAddDevicePopupLoadVaultTab(): Promise<this> {
    // Verify vault key field
    await expect.soft(this.vaultKeyField)
      .toBeDisplayed({ message: 'Vault key field should be visible' });
    
    // Verify vault key field title
    await expect.soft(this.vaultKeyFieldTitle)
      .toBeDisplayed({ message: 'Vault key field title should be visible' });
    
    await expect.soft(this.vaultKeyFieldTitle)
      .toHaveText(ADD_DEVICE_POPUP.vaultKeyFieldTitle, { message: 'Vault key field title should match' });
    
    // Verify vault key input
    await expect.soft(this.vaultKeyFieldInput)
      .toBeDisplayed({ message: 'Vault key input should be visible' });
    
    // Verify paste button
    await expect.soft(this.vaultKeyFieldPasteButtonText)
      .toBeDisplayed({ message: 'Paste button should be visible' });
    
    await expect.soft(this.vaultKeyFieldPasteButtonText)
      .toHaveText(ADD_DEVICE_POPUP.pasteButton, { message: 'Paste button text should match' });
    
    // Verify continue button
    await expect.soft(this.vaultKeyContinueButtonText)
      .toBeDisplayed({ message: 'Continue button should be visible' });
    
    await expect.soft(this.vaultKeyContinueButtonText)
      .toHaveText(ADD_DEVICE_POPUP.continueButton, { message: 'Continue button text should match' });
    
    return this.self;
  }

  async verifyAddDevicePopupWarning(): Promise<this> {
    // Verify warning container
    await expect.soft(this.addDevicePopupWarning)
      .toBeDisplayed({ message: 'Warning container should be visible' });
    
    // Verify warning text
    await expect.soft(this.addDevicePopupWarningText)
      .toBeDisplayed({ message: 'Warning text should be visible' });
    
    await expect.soft(this.addDevicePopupWarningText)
      .toHaveText(ADD_DEVICE_POPUP.warningText, { message: 'Warning text should match' });
    
    // Verify warning icon
    await expect.soft(this.addDevicePopupWarningIcon)
      .toBeDisplayed({ message: 'Warning icon should be visible' });
    
    return this.self;
  }

  async tapAddDevicePopupBackButton(): Promise<this> {
    await this.addDevicePopupBackButton.click();
    return this.self;
  }

  async tapAddDevicePopupShareVaultTab(): Promise<this> {
    await this.addDevicePopupShareVaultTab.click();
    return this.self;
  }

  async tapAddDevicePopupLoadVaultTab(): Promise<this> {
    await this.addDevicePopupLoadVaultTab.click();
    return this.self;
  }

  async tapAddDevicePopupCopyVaultKeyButton(): Promise<this> {
    await this.addDevicePopupCopyVaultKeyButton.click();
    return this.self;
  }

  async tapVaultKeyFieldPasteButton(): Promise<this> {
    await this.vaultKeyFieldPasteButton.click();
    return this.self;
  }

  async tapVaultKeyContinueButton(): Promise<this> {
    await this.vaultKeyContinueButton.click();
    return this.self;
  }

  async enterVaultKey(vaultKey: string): Promise<this> {
    await this.vaultKeyFieldInput.click();
    await this.vaultKeyFieldInput.clearValue();
    await this.vaultKeyFieldInput.addValue(vaultKey);
    return this.self;
  }

  async verifyCreateNewFolderPage(): Promise<this> {
    await expect.soft(this.createNewFolderPageButton)
      .toBeDisplayed({ message: 'Create new folder page should be visible' });
    
    await expect.soft(this.createNewFolderPageButtonText)
      .toHaveText(CREATE_NEW_FOLDER_PAGE.buttonText, { message: 'Create new folder button text should match' });
    
    return this.self;
  }

  async verifyCreateNewFolderPageFull(): Promise<this> {
    await this.verifyCreateNewFolderPage();
    
    // Verify field
    await expect.soft(this.createNewFolderPageField)
      .toBeDisplayed({ message: 'Title field should be visible' });
    
    // Verify field title
    await expect.soft(this.createNewFolderPageFieldTitle)
      .toBeDisplayed({ message: 'Title field label should be visible' });
    
    await expect.soft(this.createNewFolderPageFieldTitle)
      .toHaveText(CREATE_NEW_FOLDER_PAGE.fieldTitle, { message: 'Title field label should match' });
    
    // Verify input placeholder
    await expect.soft(this.createNewFolderPageFieldInput)
      .toBeDisplayed({ message: 'Title input should be visible' });
    
    return this.self;
  }

  async enterFolderTitle(title: string): Promise<this> {
    await this.createNewFolderPageFieldInput.click();
    await this.createNewFolderPageFieldInput.clearValue();
    await this.createNewFolderPageFieldInput.addValue(title);
    return this.self;
  }

  async tapCreateNewFolderPageButton(): Promise<this> {
    await this.createNewFolderPageButton.click();
    return this.self;
  }

  async verifyCreateNewFolderPageWarning(): Promise<this> {
    await expect.soft(this.createNewFolderPageWarning)
      .toBeDisplayed({ message: 'Title required warning should be visible' });
    
    await expect.soft(this.createNewFolderPageWarning)
      .toHaveText(CREATE_NEW_FOLDER_PAGE.warningText, { message: 'Warning text should match' });
    
    return this.self;
  }

  async tapCreateNewFolderPageCloseButton(): Promise<this> {
    await this.createNewFolderPageCloseButton.click();
    return this.self;
  }

  /* ==================== RENAME, DELETE FOLDERS POPUP METHODS ==================== */
  async verifyEditDeleteFoldersPopup(): Promise<this> {
    await expect.soft(this.editDeleteFoldersPopup)
      .toBeDisplayed({ message: 'Edit/Delete folders popup should be visible' });
    
    // Verify Rename button
    await expect.soft(this.renameButton)
      .toBeDisplayed({ message: 'Rename button should be visible' });
    
    await expect.soft(this.renameButton)
      .toHaveText(EDIT_DELETE_FOLDERS_POPUP.renameButton, { message: 'Rename button text should match' });
    
    // Verify Delete button
    await expect.soft(this.deleteButton)
      .toBeDisplayed({ message: 'Delete button should be visible' });
    
    await expect.soft(this.deleteButton)
      .toHaveText(EDIT_DELETE_FOLDERS_POPUP.deleteButton, { message: 'Delete button text should match' });
    
    return this.self;
  }

  async verifyEditDeleteFoldersPopupFull(): Promise<this> {
    await this.verifyEditDeleteFoldersPopup();
    
    // Verify icons
    await expect.soft(this.renameButtonIcon)
      .toBeDisplayed({ message: 'Rename button icon should be visible' });
    
    await expect.soft(this.deleteButtonIcon)
      .toBeDisplayed({ message: 'Delete button icon should be visible' });
    
    // Verify three dots icons
    await expect.soft(this.renameButtonThreeDots)
      .toBeDisplayed({ message: 'Rename button three dots should be visible' });
    
    await expect.soft(this.deleteButtonThreeDots)
      .toBeDisplayed({ message: 'Delete button three dots should be visible' });
    
    return this.self;
  }

  async tapRenameButton(): Promise<this> {
    await this.renameButton.click();
    return this.self;
  }

  async tapDeleteButton(): Promise<this> {
    await this.deleteButton.click();
    return this.self;
  }

  /* ==================== DELETE FOLDER CONFIRMATION POPUP METHODS ==================== */
  async verifyDeleteFolderPopup(): Promise<this> {
    await expect.soft(this.deleteFolderPopup)
      .toBeDisplayed({ message: 'Delete folder confirmation popup should be visible' });
    
    // Verify title
    await expect.soft(this.deleteFolderPopupTitle)
      .toBeDisplayed({ message: 'Delete folder popup title should be visible' });
    
    await expect.soft(this.deleteFolderPopupTitle)
      .toHaveText(DELETE_FOLDER_POPUP.title, { message: 'Delete folder popup title should match' });
    
    // Verify description
    await expect.soft(this.deleteFolderPopupDescription)
      .toBeDisplayed({ message: 'Delete folder popup description should be visible' });
    
    await expect.soft(this.deleteFolderPopupDescription)
      .toHaveText(DELETE_FOLDER_POPUP.description, { message: 'Delete folder popup description should match' });
    
    return this.self;
  }

  async verifyDeleteFolderPopupButtons(): Promise<this> {
    // Verify Cancel button
    await expect.soft(this.deleteFolderPopupCancelButton)
      .toBeDisplayed({ message: 'Cancel button should be visible' });
    
    await expect.soft(this.deleteFolderPopupCancelButtonText)
      .toHaveText(DELETE_FOLDER_POPUP.cancelButton, { message: 'Cancel button text should match' });
    
    // Verify Confirm button
    await expect.soft(this.deleteFolderPopupConfirmButton)
      .toBeDisplayed({ message: 'Confirm button should be visible' });
    
    await expect.soft(this.deleteFolderPopupConfirmButtonText)
      .toHaveText(DELETE_FOLDER_POPUP.confirmButton, { message: 'Confirm button text should match' });
    
    return this.self;
  }

  async closeHomePageBySwipe(): Promise<this> {
    await this.swipe('left');
    return this.self;
  }

  async verifyDeleteFolderPopupFull(): Promise<this> {
    await this.verifyDeleteFolderPopup();
    await this.verifyDeleteFolderPopupButtons();
    return this.self;
  }

  async tapDeleteFolderPopupCancelButton(): Promise<this> {
    await this.deleteFolderPopupCancelButton.click();
    return this.self;
  }

  async tapDeleteFolderPopupConfirmButton(): Promise<this> {
    await this.deleteFolderPopupConfirmButton.click();
    return this.self;
  }
}

export default SidebarPage;
