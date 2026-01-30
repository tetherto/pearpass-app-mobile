/* =====================================================
        CREATE MASTER PASSWORD SCREEN DATA
  ===================================================== */

export const CREATE_PASSWORD_SCREEN = {
  title: 'Create Master Password',
  description: `The first thing to do is create a Master password to secure your account.  You'll use this password to access PearPass. `,
  requirementsText: 'Your password must be at least 8 characters long and include at least one of each:',
  requirementUppercase: '• Uppercase Letter (A-Z)',
  requirementLowercase: '• Lowercase Letter (a-z)',
  requirementNumber: '• Number (0-9)',
  requirementSpecial: '• Special Character (! @ # $...)',
  requirementNote: 'Note: Avoid common words and personal information.',
  warningText: `Don't forget your master password. It's the only way to access your vault. We can't help recover it. Back it up securely.`,
  termsTitle: 'PearPass Terms of Use',
  termsText: 'I have read and agree to the PearPass Application Terms of Use.',
  continueButton: 'Continue',
} as const;

/* =====================================================
        TEST PASSWORDS
  ===================================================== */

export const TEST_PASSWORDS = {
  // Valid passwords
  valid: {
    standard: 'Test123!@#',
    long: 'MySecurePassword123!@#$%',
    withSpecial: 'P@ssw0rd!',
    complex: 'A1b2C3d4E5f6!@#',
    masked: '••••••••••',
    maskedConfirm: '••••••••••',
    maskedComplex: '•••••••••••••••'
  },
  // Invalid passwords
  invalid: {
    standard: 'Test',
  },
  // Invalid passwords - too short
  tooShort: {
    sevenChars: 'Test12!',
    sixChars: 'Test1!',
    fiveChars: 'Test!',
  },
  // Invalid passwords - missing requirements
  missingUppercase: 'test123!@#',
  missingLowercase: 'TEST123!@#',
  missingNumber: 'TestPass!@#',
  missingSpecial: 'TestPass123',
  // Invalid passwords - common words
  commonWord: 'Password123!',
  personalInfo: 'JohnDoe123!',
  // Mismatched passwords
  mismatch: 'Different123!',
  // Invalid/valid passwords - blind peer code
  blindPeerCodeInvalid: 'Test123!@#',
  blindPeerCodeValid: 'g6g8hqaju7mijj6g4f9guombuqdgprz4jbdfutydkbr97gbnkhpy',
} as const;

/* =====================================================
        ENTER MASTER PASSWORD SCREEN DATA
  ===================================================== */

export const ENTER_PASSWORD_SCREEN = {
  title: 'Enter Master Password',
  placeholder: 'Master password',
  warning: 'Don\'t forget your master password. It\'s the only way to access your vault. We can\'t help recover it. Back it up securely.',
  continueButton: 'Continue',
} as const;

/* =====================================================
        SELECT VAULT TYPE SCREEN DATA
  ===================================================== */

export const SELECT_VAULT_TYPE_SCREEN = {
  emptyTitle: 'Set Up Your Vault',
  emptySubtitle: 'Start fresh with a new vault or import an existing one to continue.',
  listTitle: 'Open an existing vault or create a new one.',
  createNew: 'Create a new vault',
  loadExisting: 'Import existing vault',
} as const;

/* =====================================================
        NEW VAULT SCREEN DATA
  ===================================================== */

export const NEW_VAULT_SCREEN = {
  title: 'Create New Vault',
  subtitle: 'Create your first vault by giving it a name.',
  nameInputPlaceholder: 'Enter Name',
  continueButton: 'Continue',
  selectVaultsButton: 'Select Vaults',
} as const;

/* =====================================================
        LOAD VAULT SCREEN DATA
  ===================================================== */

export const LOAD_VAULT_SCREEN = {
  title: 'Import an existing vault',
  subtitle: `Using PearPass on your other device, use "Add Device" to generate a QR or connection code to pair your vault. This method keeps your account secure.`,
  inviteCodeInputPlaceholder: 'Insert vault key...',
  openButton: 'Import vault',
  selectVaultsButton: 'Select Vaults',
  scanQrButton: 'Scan QR Code',
} as const;

/* =====================================================
        UNLOCK VAULT SCREEN DATA
  ===================================================== */

export const UNLOCK_VAULT_SCREEN = {
  titlePrefix: 'Unlock with the',
  titleSuffix: 'Vault password',
  selectVaultsButton: 'Select Vaults',
} as const;

/* =====================================================
        VALIDATION ERROR MESSAGES
  ===================================================== */

export const VALIDATION_ERRORS = {
  passwordRequired: 'Password is required',
  nameRequired: 'Name is required',
  passwordsDoNotMatch: 'Passwords do not match',
  invalidPassword: 'Invalid password',
  passwordTooShort: 'Password must be at least 8 characters long',
  passwordMissingLowercase: 'Password must contain at least one lowercase letter',
  passwordMissingUppercase: 'Password must contain at least one uppercase letter',
  passwordMissingNumber: 'Password must contain at least one number',
  passwordMissingSpecial: 'Password must contain at least one special character',
  incorrectPassword: 'Incorrect password. You have',
  incorrectPassword4Attempts: 'Incorrect password. You have 4 attempts before the app locks for 5 minutes.',
  incorrectPassword3Attempts: 'Incorrect password. You have 3 attempts before the app locks for 5 minutes.',
  incorrectPassword2Attempts: 'Incorrect password. You have 2 attempts before the app locks for 5 minutes.',
  incorrectPassword1Attempt: 'Incorrect password. You have 1 attempt before the app locks for 5 minutes.',


} as const;
