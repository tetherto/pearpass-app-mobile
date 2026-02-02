/* =====================================================
        SIDEBAR DATA
  ===================================================== */

export const SIDEBAR_TITLE = 'Folder' as const;

export const SIDEBAR_FOLDERS = {
  allItems: 'All Items',
  favorites: 'Favorites',
  createNew: 'Create new',
} as const;

export const SIDEBAR_BUTTONS = {
  addDevice: 'Add Device',
  closeVault: 'Close Vault',
} as const;

export const SIDEBAR_ITEMS_COUNT = {
  allItems: '0 items',
  favorites: '0 items',
} as const;

/* =====================================================
        ADD DEVICE POPUP DATA
  ===================================================== */

export const ADD_DEVICE_POPUP = {
  title: 'Add a device',
  descriptionShare: 'Scan this QR code or paste the vault key into the PearPass app on your other device to connect it to your account. This method keeps your account secure.',
  descriptionLoad: 'Scan the QR code or paste the vault key from the PearPass app on your other device to connect it to your account. This method keeps your account secure.',
  shareVaultTab: 'Share this Vault',
  importVaultTab: 'Import vault',
  qrCodeTitle: 'Scan this QR code while in the PearPass App',
  expireTextPrefix: 'This QR code expires in',
  copyVaultKeyButton: 'Copy vault key',
  warningText: 'Keep this code private. Anyone with it can connect a device to your vault.',
  vaultKeyFieldTitle: 'Vault key',
  vaultKeyFieldPlaceholder: 'Insert vault key...',
  pasteButton: 'Paste',
  continueButton: 'Continue',
} as const;

/* =====================================================
        CREATE NEW FOLDER PAGE DATA
  ===================================================== */

export const CREATE_NEW_FOLDER_PAGE = {
  buttonText: 'Create new folder',
  fieldTitle: ' Title ',
  fieldPlaceholder: 'No title',
  warningText: ' Title is required ',
  saveButton: 'Save',
} as const;

/* =====================================================
        RENAME, DELETE FOLDERS POPUP DATA
  ===================================================== */

export const EDIT_DELETE_FOLDERS_POPUP = {
  renameButton: 'Rename',
  deleteButton: 'Delete',
} as const;

/* =====================================================
        DELETE FOLDER CONFIRMATION POPUP DATA
  ===================================================== */

export const DELETE_FOLDER_POPUP = {
  title: 'Reset all data',
  description: 'Are you sure that you want to Reset all stored data?',
  cancelButton: 'Cancel',
  confirmButton: 'Confirm',
} as const;

/* =====================================================
        CHOOSE VAULT POPUP DATA
  ===================================================== */

export const CHOOSE_VAULT_POPUP = {
  vaultName: 'Kazik',
  valeronVault: 'Valeron',
  kazikVault: 'Kazik',
} as const;
