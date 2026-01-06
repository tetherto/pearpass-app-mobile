const sidebarLocators = {
  /* ============================
        HEADER
  ============================ */
  sidebarScreen: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[1]',
  sidebarTitle: '//android.widget.TextView[@text="Folder"]',

  /* ============================
        FOLDERS LIST
  ============================ */
  sidebarAllItems: '//android.widget.TextView[@text="All Items"]',
  sidebarAllItemsSelected: '//com.horcrux.svg.SvgView[@resource-id="sidebar-all-folders-active"]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  sidebarAllItemsCount: '//android.widget.TextView[@resource-id="sidebar-all-folders-count"]',
  sidebarFavorites: '//android.widget.TextView[@text="Favorites"]',
  sidebarFavoritesIcon: '//android.view.ViewGroup[@content-desc="Favorites, 0 items"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  sidebarFavoritesCount: '//android.widget.TextView[@resource-id="sidebar-favorites-count"]',
  sidebarFavoritesSelected: '//android.view.ViewGroup[@content-desc="Favorites, 0 items"]/com.horcrux.svg.SvgView[2]',
  sidebarCreateNew: '//android.widget.TextView[@text="Create new"]',
  sidebarCreateNewIcon: '//android.view.ViewGroup[@content-desc="Create new"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',

  /* ============================
        ACTIONS BUTTONS
  ============================ */
  sidebarAddDeviceButton: '//android.view.ViewGroup[@content-desc="Add Device"]',
  sidebarAddDeviceText: '//android.widget.TextView[@resource-id="sidebar-add-device-text"]',
  sidebarAddDeviceIcon: '//android.view.ViewGroup[@content-desc="Add Device"]/com.horcrux.svg.SvgView',
  sidebarCloseVaultButton: '//android.view.ViewGroup[@content-desc="Close Vault"]',
  sidebarCloseVaultText: '//android.widget.TextView[@resource-id="sidebar-close-vault-text"]',
  sidebarCloseVaultIcon: '//android.view.ViewGroup[@content-desc="Close Vault"]/com.horcrux.svg.SvgView',

  /* ============================
        ADD DEVICE POPUP
  ============================ */
  addDevicePopupTitle: '//android.widget.TextView[@text="Add a device"]',
  addDevicePopupBackButton: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
  addDevicePopupDescription: '//android.widget.TextView[@text="Scan this QR code or paste the vault key into the PearPass app on your other device to connect it to your account. This method keeps your account secure."]',
  addDevicePopupShareVaultTab: '//android.view.ViewGroup[@content-desc="Share this Vault"]',
  addDevicePopupShareVaultTabText: '//android.widget.TextView[@text="Share this Vault"]',
  addDevicePopupLoadVaultTab: '//android.view.ViewGroup[@content-desc="Load a Vault"]',
  addDevicePopupLoadVaultTabText: '//android.widget.TextView[@text="Load a Vault"]',
  addDevicePopupQrCodeTitle: '//android.widget.TextView[@text="Scan this QR code while in the PearPass App"]',
  addDevicePopupQrCode: '//com.horcrux.svg.SvgView[@resource-id="qr-code"]',
  addDevicePopupExpireText: '//android.widget.TextView[contains(@text, "This QR code expires in")]',
  addDevicePopupExpireTime: '//android.view.ViewGroup[contains(@content-desc, "expires")]',
  addDevicePopupCopyVaultKeyButton: '//android.widget.TextView[@text="Copy vault key"]',
  addDevicePopupCopyVaultKeyText: '//android.widget.TextView[@resource-id="copy-address"]',
  addDevicePopupWarning: '//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]',
  addDevicePopupWarningText: '//android.widget.TextView[@text="Keep this code private. Anyone with it can connect a device to your account."]',
  addDevicePopupWarningIcon: '//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
  vaultKeyField: '//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[6]',
  vaultKeyFieldInput: '//android.widget.EditText[@text="Add vault key..."]',
  vaultKeyFieldTitle: '//android.widget.TextView[@text="Vault key"]',
  vaultKeyFieldQrCode: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[7]',
  vaultKeyFieldPasteButton: '//android.view.ViewGroup[@content-desc="Paste"]',
  vaultKeyFieldPasteButtonText: '//android.widget.TextView[@text="Paste"]',
  vaultKeyFieldPasteButtonIcon: '//android.view.ViewGroup[@content-desc="Paste"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  vaultKeyContinueButton: '//android.view.ViewGroup[@content-desc="Continue"]',
  vaultKeyContinueButtonText: '//android.widget.TextView[@text="Continue"]',

  /* ============================
        CREATE NEW FOLDER PAGE
  ============================ */
  createNewFolderPageCloseButton: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]',
  createNewFolderPage: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup',
  createNewFolderPageButton: '//android.view.ViewGroup[@content-desc="Create new folder"]',
  createNewFolderPageButtonText: '//android.widget.TextView[@text="Create new folder"]',
  createNewFolderPageButtonIcon: '//android.view.ViewGroup[@content-desc="Create new folder"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  createNewFolderPageField: '//android.view.ViewGroup[@content-desc=" Title "]',
  createNewFolderPageFieldTitle: '//android.widget.TextView[@text=" Title "]',
  createNewFolderPageFieldInput: '//android.widget.EditText[@text="No title"]',
  createNewFolderPageWarning: '//android.widget.TextView[@text=" Title is required "]',
  createNewFolderPageWarningIcon: '//android.view.ViewGroup[@content-desc=" Title ,  Title is required "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',

    /* ============================
        TEST FOLDER
  ============================ */
  testFolder: '//android.widget.TextView[@text="Test Folder"]',
  testFolderIcon: '//android.view.ViewGroup[@content-desc="Test Folder, 0 items"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  testFolderCount: '(//android.widget.TextView[@text="0 items"])[3]',
  testFolderSelected: '//com.horcrux.svg.SvgView[@resource-id="sidebar-folder-undefined-active"]',
  testFolder1: '//android.widget.TextView[@text="Test Folder1"]',
  testFolder1Icon: '//android.view.ViewGroup[@content-desc="Test Folder1, 0 items"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',

  /* ============================
        RENAME, DELETE FOLDERS POPUP
  ============================ */
  editDeleteFoldersPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',
  renameButton: '//android.widget.TextView[@text="Rename"]',
  deleteButton: '//android.widget.TextView[@text="Delete"]',
  renameButtonIcon: '//android.view.ViewGroup[@content-desc="Rename"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  deleteButtonIcon: '//android.view.ViewGroup[@content-desc="Delete"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  renameButtonThreeDots: '//android.view.ViewGroup[@content-desc="Rename"]/com.horcrux.svg.SvgView[2]',
  deleteButtonThreeDots: '//android.view.ViewGroup[@content-desc="Delete"]/com.horcrux.svg.SvgView[2]',
  deleteFolderPopup: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]',
  deleteFolderPopupTitle: '//android.widget.TextView[@text="Reset all data"]',
  deleteFolderPopupDescription: '//android.widget.TextView[@text="Are you sure that you want to Reset all stored data?"]',
  deleteFolderPopupCancelButton: '//android.view.ViewGroup[@content-desc="Cancel"]',
  deleteFolderPopupConfirmButton: '//android.view.ViewGroup[@content-desc="Confirm"]',
  deleteFolderPopupCancelButtonText: '//android.widget.TextView[@text="Cancel"]',
  deleteFolderPopupConfirmButtonText: '//android.widget.TextView[@text="Confirm"]',

}

export default sidebarLocators
