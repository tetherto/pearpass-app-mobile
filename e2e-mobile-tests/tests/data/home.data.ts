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

/* =====================================================
        IMPORTED ACCOUNTS DATA
  ===================================================== */

export const IMPORTED_ACCOUNTS = {
  onePassword: {
    iconText: '1A',
    accountText: '1Password Account (Alexey)',
  },
} as const;

/* =====================================================
        IMPORTED ITEMS DATA
  ===================================================== */

export const IMPORTED_ITEMS = {
  onePasswordPassword: {
    iconText: '1P',
    passwordText: '1Password Password',
  },
  onePasswordLogin: {
    loginText: '1PasswordLogin',
  },
  bitwardenNote: {
    iconText: 'BN',
    noteText: 'Bit note',
  },
  bitwardenLogin: {
    iconText: 'BL',
    loginText: 'Bit login',
  },
  bitwardenJsonSsh: {
    iconText: 'SS',
    sshText: 'SSH',
  },
  bitwardenJsonNote: {
    iconText: 'BN',
    noteText: 'Bit note',
  },
  bitwardenJsonLogin: {
    iconText: 'BL',
    loginText: 'Bit login',
  },
  bitwardenJsonCredit: {
    iconText: 'BC',
    creditText: 'Bit credit',
  },
  bitwardenJsonIdentity: {
    iconText: 'BI',
    identityText: 'Bit identity',
  },
  lastPassCsvName: {
    iconText: 'LN',
    nameText: 'lastpass name',
  },
  lastPassCsvSecure: {
    iconText: 'LS',
    secureText: 'Lastpass secure',
  },
  lastPassCsvItem: {
    iconText: 'LI',
    itemText: 'Lastpass item',
  },
  nordPassCsvCredit: {
    iconText: 'NC',
    creditText: 'Nordpass credit',
  },
  nordPassCsvGmail: {
    iconText: 'GM',
    gmailText: 'Gmail.com',
  },
  protonPassCsvIdentity: {
    iconText: 'PI',
    identityText: 'prot identity',
  },
  protonPassCsvNote: {
    iconText: 'PN',
    noteText: 'prot note',
  },
  protonPassCsvLogin: {
    iconText: 'PL',
    loginText: 'prot login',
  },
  protonPassJsonIdentity: {
    iconText: 'PI',
    identityText: 'prot identity',
  },
  protonPassJsonNote: {
    iconText: 'PN',
    noteText: 'prot note',
  },
  protonPassJsonLogin: {
    iconText: 'PL',
    loginText: 'prot login',
  },
  unencryptedFileCsvHecht: {
    iconText: 'HT',
    hechtText: 'Hecht this ;$;..?)645746 chance',
  },
  unencryptedFileCsvInc: {
    iconText: 'IN',
    incText: 'Inc',
  },
} as const;
