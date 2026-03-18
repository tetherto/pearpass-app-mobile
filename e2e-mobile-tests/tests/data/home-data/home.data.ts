/* =====================================================
        HOME SCREEN DATA
  ===================================================== */

export const HOME_SCREEN = {
  searchPlaceholder: 'Search...',
  emptyCollectionTitle: 'This collection is empty.',
  emptyCollectionSubtitle: 'Create a new item',
} as const;

/* =====================================================
        HOME SEARCH FIELD DATA
  ===================================================== */

export const HOME_SEARCH_FIELD = {
  inputPlaceholder: 'Search...',
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

/** Expected button text for category filter buttons (label + count, e.g. "All 0") */
export const HOME_CATEGORY_BUTTONS = {
  all: { buttonText: 'All 0' },
  logins: { buttonText: 'Logins 0' },
  creditCards: { buttonText: 'Credit cards 0' },
  wifi: { buttonText: 'Wi-Fi 0' },
  recoveryPhrase: { buttonText: 'Recovery phrase 0' },
  identities: { buttonText: 'Identities 0' },
  notes: { buttonText: 'Notes 0' },
  custom: { buttonText: 'Custom 0' },
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
        CREATE ITEM POPUP FIELDS DATA
  ===================================================== */

export const CREATE_ITEM_POPUP_FIELDS = {
  logins: {
    title: 'Logins',
    text: 'Save your username and password for any website or app.',
  },
  creditCards: {
    title: 'Credit cards',
    text: 'Securely store card number, expiry date, and CVV.',
  },
  wifi: {
    title: 'Wi-Fi',
    text: 'Keep your Wi-Fi name and password safe.',
  },
  recoveryPhrase: {
    title: 'Recovery phrase',
    text: 'Securely store app recovery phrases.',
  },
  identities: {
    title: 'Identities',
    text: 'Keep personal info like ID numbers and addresses safe.',
  },
  notes: {
    title: 'Notes',
    text: 'Encrypt and store private notes or sensitive text.',
  },
  custom: {
    title: 'Custom',
    text: 'Create your own entry with fully custom fields. ',
  },
  password: {
    title: 'Password',
    text: 'Create a safe password or passphrase',
  },
} as const;

/* =====================================================
        LOGIN CREATED ON HOME PAGE
  ===================================================== */

export const LOGIN_CREATED_ON_HOME_PAGE = {
  text: 'Login to Google',
} as const;

/* =====================================================
        CREDIT CARD CREATED ON HOME PAGE
  ===================================================== */

export const CREDIT_CARD_CREATED_ON_HOME_PAGE = {
  text: 'Test Credit Card',
} as const;

/* =====================================================
        WIFI CREATED ON HOME PAGE
  ===================================================== */

export const WIFI_CREATED_ON_HOME_PAGE = {
  text: 'Test Wi-Fi Network',
} as const;

/* =====================================================
        RECOVERY PHRASE CREATED ON HOME PAGE
  ===================================================== */

export const RECOVERY_PHRASE_CREATED_ON_HOME_PAGE = {
  text: 'Test Application',
} as const;

/* =====================================================
        NOTE CREATED ON HOME PAGE
  ===================================================== */

export const NOTE_CREATED_ON_HOME_PAGE = {
  text: 'Test Note Title',
} as const;

/* =====================================================
        CUSTOM ELEMENT CREATED ON HOME PAGE
  ===================================================== */

export const CUSTOM_ELEMENT_CREATED_ON_HOME_PAGE = {
  text: 'Custom title for test',
} as const;

/* =====================================================
        IDENTITY CREATED ON HOME PAGE
  ===================================================== */

export const IDENTITY_CREATED_ON_HOME_PAGE = {
  text: 'Test Identity Title',
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
