export const HOME_PAGE = {
  noItemSaved: {
    title: 'No item saved',
    description:
      'Start using PearPass creating your first item or import your items from a different password manager',
  },
  vaultTab: {
    text: 'Vault',
  },
  settingsTab: {
    text: 'Settings',
  },
  addCenterItemButton: {
    text: 'Add item',
  },
  foldersButton: {
    text: 'All Folders',
  },
  searchField: {
    placeholder: 'Search in All Items',
  },
  importItemsButton: {
    text: 'Import items',
  },
  itemsCategoryPopup: {
    title: 'Categories',
    itemsCount: '0 items',
    categories: {
      allItems: { text: 'All Items' },
      logins: { text: 'Logins' },
      creditCards: { text: 'Credit Cards' },
      identities: { text: 'Identities' },
      notes: { text: 'Notes' },
      recoveryPhrases: { text: 'Recovery Phrases' },
      wifi: { text: 'Wi-Fi' },
      other: { text: 'Other' },
    },
  },
  addTopItemPopup: {
    title: 'Add Item',
    categories: {
      logins: { text: 'Logins' },
      creditCard: { text: 'Credit Card' },
      identities: { text: 'Identities' },
      notes: { text: 'Notes' },
      recoveryPhrases: { text: 'Recovery Phrases' },
      wifi: { text: 'Wi-Fi' },
      other: { text: 'Other' },
      password: { text: 'Password' },
    },
  },
  vaultsPopup: {
    title: 'Vaults',
    personalVault: {
      text: 'Personal vault',
    },
    createNewVault: {
      text: 'Create New Vault',
    },
  },
  sortItemsPopup: {
    title: 'Item Order',
    options: {
      titleAz: { text: 'Title (A-Z)' },
      lastUpdatedNewest: { text: 'Last Updated (Newest first)' },
      lastUpdatedOldest: { text: 'Last Updated (Oldest first)' },
      dateAddedNewest: { text: 'Date Added (Newest first)' },
      dateAddedOldest: { text: 'Date Added (Oldest first)' },
    },
  },
  foldersPopup: {
    title: 'Folders',
    itemsCount: '0 items',
    allFolders: {
      text: 'All Folders',
    },
    addNewFolder: {
      text: 'Add New Folder',
    },
  },
  importVaultPage: {
    title: 'Import Vault',
    scanQrCodeText: 'Scan QR code',
    cameraAccessText: 'Camera access is required to scan codes.',
    allowAccessButton: {
      text: 'Allow Access',
    },
    itemVaultLinkField: {
      title: 'Item / Vault Link',
      inputPlaceholder: 'Enter Share Link',
    },
    continueButton: {
      text: 'Continue',
    },
  },
} as const;
