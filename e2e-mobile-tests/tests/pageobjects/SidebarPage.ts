import BasePage from '@pages/BasePage';
import sidebarLocators from '@locators/SidebarLocators';
import { SIDEBAR_TITLE, SIDEBAR_FOLDERS, SIDEBAR_BUTTONS, ADD_DEVICE_POPUP, CREATE_NEW_FOLDER_PAGE, EDIT_DELETE_FOLDERS_POPUP, DELETE_FOLDER_POPUP, CHOOSE_VAULT_POPUP } from '@data/sidebar.data';

// Use global expect from expect-webdriverio for text comparison
declare const expect: any;

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
  get addDevicePopupImportVaultTab() { return this.$('addDevicePopupImportVaultTab'); }
  get addDevicePopupImportVaultTabText() { return this.$('addDevicePopupImportVaultTabText'); }
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
  get createNewFolderPageSaveButton() { return this.$('createNewFolderPageSaveButton'); }
  get createNewFolderPageSaveButtonText() { return this.$('createNewFolderPageSaveButtonText'); }
  get createNewFolderPageSaveButtonIcon() { return this.$('createNewFolderPageSaveButtonIcon'); }
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
  get chooseVaultButton() { return this.$('chooseVaultButton'); }
  get chooseVaultButtonText() { return this.$('chooseVaultButtonText'); }
  get chooseVaultButtonIcon() { return this.$('chooseVaultButtonIcon'); }
  get chooseVaultDropdownIcon() { return this.$('chooseVaultDropdownIcon'); }
  get chooseVaultDropdownMenu() { return this.$('chooseVaultDropdownMenu'); }
  get chooseVaultDropdownItem() { return this.$('chooseVaultDropdownItem'); }
  get chooseVaultDropdownSecondItem() { return this.$('chooseVaultDropdownSecondItem'); }
  get hideDropdownMenuIcon() { return this.$('hideDropdownMenuIcon'); }
  get chooseVaultButtonText1() { return this.$('chooseVaultButtonText1'); }
  get newVaultNameAtSidebar() { return this.$('newVaultNameAtSidebar'); }

  async waitForLoaded(): Promise<this> {
    await this.title.waitForDisplayed({ timeoutMsg: 'Sidebar title not visible' });
    await this.allItems.waitForDisplayed({ timeoutMsg: 'All Items option not visible' });
    return this.self;
  }

  async verifyTitle(): Promise<this> {
    const titleText = await this.title.getText();
    expect(titleText).toBe(SIDEBAR_TITLE);
    return this.self;
  }

  async verifyAllFolders(): Promise<this> {
    await this.verifyElementDisplayed(this.allItems, 'sidebarAllItems', 'All Items option should be visible');
    
    const allItemsText = await this.allItems.getText();
    expect(allItemsText).toBe(SIDEBAR_FOLDERS.allItems);

    await this.verifyElementDisplayed(this.allItemsCount, 'sidebarAllItemsCount', 'All Items count should be visible');

    return this.self;
  }

  async verifyAllFoldersSelected(): Promise<this> {
    await this.verifyElementDisplayed(this.allItemsSelected, 'sidebarAllItemsSelected', 'All Items should be selected (checkmark visible)');
    return this.self;
  }

  async verifyFavorites(): Promise<this> {
    await this.verifyElementDisplayed(this.favorites, 'sidebarFavorites', 'Favorites option should be visible');
    
    const favoritesText = await this.favorites.getText();
    expect(favoritesText).toBe(SIDEBAR_FOLDERS.favorites);

    await this.verifyElementDisplayed(this.favoritesCount, 'sidebarFavoritesCount', 'Favorites count should be visible');

    return this.self;
  }

  async verifyCreateNew(): Promise<this> {
    await this.verifyElementDisplayed(this.createNew, 'sidebarCreateNew', 'Create new option should be visible');
    
    const createNewText = await this.createNew.getText();
    expect(createNewText).toBe(SIDEBAR_FOLDERS.createNew);

    return this.self;
  }

  async verifyAddDeviceButton(): Promise<this> {
    await this.verifyElementDisplayed(this.addDeviceButton, 'sidebarAddDeviceButton', 'Add Device button should be visible');
    
    const addDeviceText = await this.addDeviceText.getText();
    expect(addDeviceText).toBe(SIDEBAR_BUTTONS.addDevice);

    return this.self;
  }

  async verifyCloseVaultButton(): Promise<this> {
    await this.verifyElementDisplayed(this.closeVaultButton, 'sidebarCloseVaultButton', 'Close Vault button should be visible');
    
    const closeVaultText = await this.closeVaultText.getText();
    expect(closeVaultText).toBe(SIDEBAR_BUTTONS.closeVault);

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
    await this.verifyElementDisplayed(this.favoritesSelected, 'sidebarFavoritesSelected', 'Favorites should be selected (checkmark visible)');
    return this.self;
  }

  async verifyTestFolder(): Promise<this> {
    await this.verifyElementDisplayed(this.testFolder, 'testFolder', 'Test Folder option should be visible');
    
    const testFolderText = await this.testFolder.getText();
    expect(testFolderText).toBe('Test Folder');

    await this.verifyElementDisplayed(this.testFolderIcon, 'testFolderIcon', 'Test Folder icon should be visible');

    await this.verifyElementDisplayed(this.testFolderCount, 'testFolderCount', 'Test Folder count should be visible');

    return this.self;
  }

  async verifyTestFolder1(): Promise<this> {
    await this.verifyElementDisplayed(this.testFolder1, 'testFolder1', 'Test Folder option should be visible');
    
    const testFolder1Text = await this.testFolder1.getText();
    expect(testFolder1Text).toBe('Test Folder1');

    await this.verifyElementDisplayed(this.testFolder1Icon, 'testFolder1Icon', 'Test Folder icon should be visible');

    await this.verifyElementDisplayed(this.testFolderCount, 'testFolderCount', 'Test Folder count should be visible');

    return this.self;
  }

  async verifyTestFolder1NotDisplayed(): Promise<this> {
    const isDisplayed = await this.testFolder1.isDisplayed();
    if (isDisplayed) {
      throw new Error('Test Folder1 should not be displayed');
    }
    return this.self;
  }

  async verifyTestFolderSelected(): Promise<this> {
    await this.verifyElementDisplayed(this.testFolderSelected, 'testFolderSelected', 'Test Folder should be selected (checkmark visible)');
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
    await this.verifyElementDisplayed(this.addDevicePopupTitle, 'addDevicePopupTitle', 'Add Device popup should be visible');
    
    const addDevicePopupTitleText = await this.addDevicePopupTitle.getText();
    expect(addDevicePopupTitleText).toBe(ADD_DEVICE_POPUP.title);
    
    return this.self;
  }

  async verifyAddDevicePopupFull(): Promise<this> {
    await this.verifyAddDevicePopup();
    
    // Verify back button
    await this.verifyElementDisplayed(this.addDevicePopupBackButton, 'addDevicePopupBackButton', 'Add Device popup back button should be visible');
    
    // Verify description
    await this.verifyElementDisplayed(this.addDevicePopupDescription, 'addDevicePopupDescription', 'Add Device popup description should be visible');
    
    // Verify tabs
    await this.verifyElementDisplayed(this.addDevicePopupShareVaultTabText, 'addDevicePopupShareVaultTabText', 'Share this Vault tab should be visible');
    
    const shareVaultTabText = await this.addDevicePopupShareVaultTabText.getText();
    expect(shareVaultTabText).toBe(ADD_DEVICE_POPUP.shareVaultTab);
    
    await this.verifyElementDisplayed(this.addDevicePopupImportVaultTabText, 'addDevicePopupImportVaultTabText', 'Import vault tab should be visible');
    
    const importVaultTabText = await this.addDevicePopupImportVaultTabText.getText();
    expect(importVaultTabText).toBe(ADD_DEVICE_POPUP.importVaultTab);
    
    return this.self;
  }

  async verifyAddDevicePopupShareVaultTab(): Promise<this> {
    // Verify QR code title
    await this.verifyElementDisplayed(this.addDevicePopupQrCodeTitle, 'addDevicePopupQrCodeTitle', 'QR code title should be visible');
    
    const qrCodeTitleText = await this.addDevicePopupQrCodeTitle.getText();
    expect(qrCodeTitleText).toBe(ADD_DEVICE_POPUP.qrCodeTitle);
    
    // Verify QR code
    await this.verifyElementDisplayed(this.addDevicePopupQrCode, 'addDevicePopupQrCode', 'QR code should be visible');
    
    // // Verify expire text
    // await this.verifyElementDisplayed(this.addDevicePopupExpireText, 'addDevicePopupExpireText', 'Expire text should be visible');
    
    // Verify copy vault key button
    await this.verifyElementDisplayed(this.addDevicePopupCopyVaultKeyButton, 'addDevicePopupCopyVaultKeyButton', 'Copy vault key button should be visible');
    
    const copyVaultKeyButtonText = await this.addDevicePopupCopyVaultKeyButton.getText();
    expect(copyVaultKeyButtonText).toBe(ADD_DEVICE_POPUP.copyVaultKeyButton);
    
    // Verify vault key text
    await this.verifyElementDisplayed(this.addDevicePopupCopyVaultKeyText, 'addDevicePopupCopyVaultKeyText', 'Vault key text should be visible');
    
    // Verify warning
    await this.verifyElementDisplayed(this.addDevicePopupWarningText, 'addDevicePopupWarningText', 'Warning text should be visible');
    
    const warningText = await this.addDevicePopupWarningText.getText();
    expect(warningText).toBe(ADD_DEVICE_POPUP.warningText);
    
    return this.self;
  }

  async verifyAddDevicePopupImportVaultTab(): Promise<this> {
    // Verify vault key field
    await this.verifyElementDisplayed(this.vaultKeyField, 'vaultKeyField', 'Vault key field should be visible');
    
    // Verify vault key field title
    await this.verifyElementDisplayed(this.vaultKeyFieldTitle, 'vaultKeyFieldTitle', 'Vault key field title should be visible');
    
    const vaultKeyFieldTitleText = await this.vaultKeyFieldTitle.getText();
    expect(vaultKeyFieldTitleText).toBe(ADD_DEVICE_POPUP.vaultKeyFieldTitle);
    
    // Verify vault key input
    await this.verifyElementDisplayed(this.vaultKeyFieldInput, 'vaultKeyFieldInput', 'Vault key input should be visible');
    
    // Verify paste button
    await this.verifyElementDisplayed(this.vaultKeyFieldPasteButtonText, 'vaultKeyFieldPasteButtonText', 'Paste button should be visible');
    
    const pasteButtonText = await this.vaultKeyFieldPasteButtonText.getText();
    expect(pasteButtonText).toBe(ADD_DEVICE_POPUP.pasteButton);
    
    // Verify continue button
    await this.verifyElementDisplayed(this.vaultKeyContinueButtonText, 'vaultKeyContinueButtonText', 'Continue button should be visible');
    
    const continueButtonText = await this.vaultKeyContinueButtonText.getText();
    expect(continueButtonText).toBe(ADD_DEVICE_POPUP.continueButton);
    
    return this.self;
  }

  async verifyAddDevicePopupWarning(): Promise<this> {
    // Verify warning container
    await this.verifyElementDisplayed(this.addDevicePopupWarning, 'addDevicePopupWarning', 'Warning container should be visible');
    
    // Verify warning text
    await this.verifyElementDisplayed(this.addDevicePopupWarningText, 'addDevicePopupWarningText', 'Warning text should be visible');
    
    const warningText = await this.addDevicePopupWarningText.getText();
    expect(warningText).toBe(ADD_DEVICE_POPUP.warningText);
    
    // Verify warning icon
    await this.verifyElementDisplayed(this.addDevicePopupWarningIcon, 'addDevicePopupWarningIcon', 'Warning icon should be visible');
    
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

  async tapAddDevicePopupImportVaultTab(): Promise<this> {
    await this.addDevicePopupImportVaultTab.click();
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
    await this.verifyElementDisplayed(this.createNewFolderPageButton, 'createNewFolderPageButton', 'Create new folder page should be visible');
    
    const createNewFolderButtonText = await this.createNewFolderPageButtonText.getText();
    expect(createNewFolderButtonText).toBe(CREATE_NEW_FOLDER_PAGE.buttonText);
    
    return this.self;
  }

  async verifyCreateNewFolderPageFull(): Promise<this> {
    await this.verifyCreateNewFolderPage();
    
    // Verify field
    await this.verifyElementDisplayed(this.createNewFolderPageField, 'createNewFolderPageField', 'Title field should be visible');
    
    // Verify field title
    await this.verifyElementDisplayed(this.createNewFolderPageFieldTitle, 'createNewFolderPageFieldTitle', 'Title field label should be visible');
    
    const fieldTitleText = await this.createNewFolderPageFieldTitle.getText();
    expect(fieldTitleText).toBe(CREATE_NEW_FOLDER_PAGE.fieldTitle);
    
    // Verify input placeholder
    await this.verifyElementDisplayed(this.createNewFolderPageFieldInput, 'createNewFolderPageFieldInput', 'Title input should be visible');
    
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
    await this.verifyElementDisplayed(this.createNewFolderPageWarning, 'createNewFolderPageWarning', 'Title required warning should be visible');
    
    const warningText = await this.createNewFolderPageWarning.getText();
    expect(warningText).toBe(CREATE_NEW_FOLDER_PAGE.warningText);
    
    return this.self;
  }

  async tapCreateNewFolderPageCloseButton(): Promise<this> {
    await this.createNewFolderPageCloseButton.click();
    return this.self;
  }

  async tapCloseButton(): Promise<this> {
    await this.createNewFolderPageCloseButton.click();
    return this.self;
  }

  async verifyCreateNewFolderPageSaveButton(): Promise<this> {
    await this.verifyElementDisplayed(this.createNewFolderPageSaveButton, 'createNewFolderPageSaveButton', 'Save button should be visible');
    
    await this.verifyElementDisplayed(this.createNewFolderPageSaveButtonText, 'createNewFolderPageSaveButtonText', 'Save button text should be visible');
    
    const saveButtonText = await this.createNewFolderPageSaveButtonText.getText();
    expect(saveButtonText).toBe(CREATE_NEW_FOLDER_PAGE.saveButton);
    
    await this.verifyElementDisplayed(this.createNewFolderPageSaveButtonIcon, 'createNewFolderPageSaveButtonIcon', 'Save button icon should be visible');
    
    return this.self;
  }

  async tapCreateNewFolderPageSaveButton(): Promise<this> {
    await this.createNewFolderPageSaveButton.click();
    return this.self;
  }

  /* ==================== RENAME, DELETE FOLDERS POPUP METHODS ==================== */
  async verifyEditDeleteFoldersPopup(): Promise<this> {
    await this.verifyElementDisplayed(this.editDeleteFoldersPopup, 'editDeleteFoldersPopup', 'Edit/Delete folders popup should be visible');
    
    // Verify Rename button
    await this.verifyElementDisplayed(this.renameButton, 'renameButton', 'Rename button should be visible');
    
    const renameButtonText = await this.renameButton.getText();
    expect(renameButtonText).toBe(EDIT_DELETE_FOLDERS_POPUP.renameButton);
    
    // Verify Delete button
    await this.verifyElementDisplayed(this.deleteButton, 'deleteButton', 'Delete button should be visible');
    
    const deleteButtonText = await this.deleteButton.getText();
    expect(deleteButtonText).toBe(EDIT_DELETE_FOLDERS_POPUP.deleteButton);
    
    return this.self;
  }

  async verifyEditDeleteFoldersPopupFull(): Promise<this> {
    await this.verifyEditDeleteFoldersPopup();
    
    // Verify icons
    await this.verifyElementDisplayed(this.renameButtonIcon, 'renameButtonIcon', 'Rename button icon should be visible');
    
    await this.verifyElementDisplayed(this.deleteButtonIcon, 'deleteButtonIcon', 'Delete button icon should be visible');
    
    // Verify three dots icons
    await this.verifyElementDisplayed(this.renameButtonThreeDots, 'renameButtonThreeDots', 'Rename button three dots should be visible');
    
    await this.verifyElementDisplayed(this.deleteButtonThreeDots, 'deleteButtonThreeDots', 'Delete button three dots should be visible');
    
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
    await this.verifyElementDisplayed(this.deleteFolderPopup, 'deleteFolderPopup', 'Delete folder confirmation popup should be visible');
    
    // Verify title
    await this.verifyElementDisplayed(this.deleteFolderPopupTitle, 'deleteFolderPopupTitle', 'Delete folder popup title should be visible');
    
    const deleteFolderPopupTitleText = await this.deleteFolderPopupTitle.getText();
    expect(deleteFolderPopupTitleText).toBe(DELETE_FOLDER_POPUP.title);
    
    // Verify description
    await this.verifyElementDisplayed(this.deleteFolderPopupDescription, 'deleteFolderPopupDescription', 'Delete folder popup description should be visible');
    
    const deleteFolderPopupDescriptionText = await this.deleteFolderPopupDescription.getText();
    expect(deleteFolderPopupDescriptionText).toBe(DELETE_FOLDER_POPUP.description);
    
    return this.self;
  }

  async verifyDeleteFolderPopupButtons(): Promise<this> {
    // Verify Cancel button
    await this.verifyElementDisplayed(this.deleteFolderPopupCancelButton, 'deleteFolderPopupCancelButton', 'Cancel button should be visible');
    
    const cancelButtonText = await this.deleteFolderPopupCancelButtonText.getText();
    expect(cancelButtonText).toBe(DELETE_FOLDER_POPUP.cancelButton);
    
    // Verify Confirm button
    await this.verifyElementDisplayed(this.deleteFolderPopupConfirmButton, 'deleteFolderPopupConfirmButton', 'Confirm button should be visible');
    
    const confirmButtonText = await this.deleteFolderPopupConfirmButtonText.getText();
    expect(confirmButtonText).toBe(DELETE_FOLDER_POPUP.confirmButton);
    
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

  /* ==================== CHOOSE VAULT METHODS ==================== */
  async verifyChooseVaultButton(): Promise<this> {
    await this.verifyElementDisplayed(this.chooseVaultButton, 'chooseVaultButton', 'Choose Vault button should be visible');
    
    await this.verifyElementDisplayed(this.chooseVaultButtonText, 'chooseVaultButtonText', 'Choose Vault button text should be visible');
    
    const chooseVaultButtonText = await this.chooseVaultButtonText.getText();
    expect(chooseVaultButtonText).toBe(CHOOSE_VAULT_POPUP.vaultName);
    
    await this.verifyElementDisplayed(this.chooseVaultButtonIcon, 'chooseVaultButtonIcon', 'Choose Vault button icon should be visible');
    
    return this.self;
  }

  async verifyChooseVaultButtonText(expectedText: string): Promise<this> {
    await this.verifyElementDisplayed(this.chooseVaultButtonText, 'chooseVaultButtonText', 'Choose Vault button text should be visible');
    
    const chooseVaultButtonText = await this.chooseVaultButtonText.getText();
    expect(chooseVaultButtonText).toBe(expectedText);
    
    return this.self;
  }

  async verifyChooseVaultButtonText1(expectedText: string): Promise<this> {
    await this.verifyElementDisplayed(this.chooseVaultButtonText1, 'chooseVaultButtonText1', 'Choose Vault button text should be visible');
    
    const chooseVaultButtonText1 = await this.chooseVaultButtonText1.getText();
    expect(chooseVaultButtonText1).toBe(expectedText);
    
    return this.self;
  }

  async verifyNewVaultNameAtSidebar(expectedText: string): Promise<this> {
    await this.newVaultNameAtSidebar.waitForDisplayed({ timeout: 5000, timeoutMsg: 'New vault name at sidebar not visible' });
    await this.verifyElementDisplayed(this.newVaultNameAtSidebar, 'newVaultNameAtSidebar', 'Vault name at sidebar should be visible');
    const displayedText = await this.newVaultNameAtSidebar.getText();
    expect(displayedText).toBe(expectedText);
    return this.self;
  }

  async tapChooseVaultButton(): Promise<this> {
    await this.chooseVaultButton.click();
    return this.self;
  }

  async verifyChooseVaultPopupFull(): Promise<this> {
    // Verify dropdown menu is visible
    await this.verifyElementDisplayed(this.chooseVaultDropdownMenu, 'chooseVaultDropdownMenu', 'Choose Vault dropdown menu should be visible');
    
    // Verify dropdown icon
    await this.verifyElementDisplayed(this.chooseVaultDropdownIcon, 'chooseVaultDropdownIcon', 'Choose Vault dropdown icon should be visible');
    
    await this.verifyElementDisplayed(this.hideDropdownMenuIcon, 'hideDropdownMenuIcon', 'Hide dropdown menu icon should be visible');
    
    // Verify first dropdown item (Valeron)
    await this.verifyElementDisplayed(this.chooseVaultDropdownItem, 'chooseVaultDropdownItem', 'Valeron vault option should be visible');
    
    // Verify second dropdown item (Kazik)
    await this.verifyElementDisplayed(this.chooseVaultDropdownSecondItem, 'chooseVaultDropdownSecondItem', 'Kazik vault option should be visible');
    
    return this.self;
  }

  async taphideDropdownMenuIcon(): Promise<this> {
    await this.hideDropdownMenuIcon.click();
    return this.self;
  }

  async chooseVaultDropdownMenuIsNotVisible(): Promise<this> {
    const isDisplayed = await this.chooseVaultDropdownMenu.isDisplayed();
    if (isDisplayed) {
      throw new Error('Choose Vault dropdown menu should not be visible');
    }
    return this.self;
  }
  
  async chooseValeronVault(): Promise<this> {
    await this.chooseVaultDropdownItem.click();
    return this.self;
  }

}

export default SidebarPage;
