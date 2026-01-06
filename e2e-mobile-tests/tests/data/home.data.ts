/* =====================================================
        HOME SCREEN DATA
  ===================================================== */

export const HOME_SCREEN = {
  searchPlaceholder: 'Search...',
  emptyCollectionTitle: 'This collection is empty.',
  emptyCollectionSubtitle: 'Create a new item',
} as const;

/* =====================================================
        CATEGORIES DATA
  ===================================================== */

export const CATEGORIES = {
  all: 'All',
  logins: 'Logins',
  creditCards: 'Credit cards',
  wifi: 'Wi-Fi',
  recoveryPhrase: 'Recovery phrase',
  identities: 'Identities',
  notes: 'Notes',
  custom: 'Custom',
} as const;

/* =====================================================
        CREATE ITEM BUTTONS DATA
  ===================================================== */

export const CREATE_ITEM_BUTTONS = {
  createLogin: 'Create a login',
  createIdentity: 'Create an identity',
  createCreditCard: 'Create a credit card',
  createWifiPassword: 'Create a Wi-Fi password',
  saveRecoveryPhrase: 'Save a Recovery phrase',
  createNote: 'Create a note',
  createCustomElement: 'Create a custom element',
} as const;

/* =====================================================
        BOTTOM NAVIGATION DATA
  ===================================================== */

export const BOTTOM_NAVIGATION = {
  home: 'Home',
  settings: 'Settings',
} as const;
