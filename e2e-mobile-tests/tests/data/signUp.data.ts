/* =====================================================
        CREATE MASTER PASSWORD SCREEN DATA
  ===================================================== */

export const CREATE_PASSWORD_SCREEN = {
  title: 'Create Master Password',
  description: 'The first thing to do is create a Master password to secure your account. You\'ll use this password to access PearPass.',
  requirementsText: 'Your password must be at least 8 characters long and include at least one of each:',
  requirementUppercase: 'Uppercase Letter (A-Z)',
  requirementLowercase: 'Lowercase Letter (a-z)',
  requirementNumber: 'Number (0-9)',
  requirementSpecial: 'Special Character (! @ # $...)',
  requirementNote: 'Note: Avoid common words and personal information.',
  warning: 'Don\'t forget your master password. It\'s the only way to access your vault. We can\'t help recover it. Back it up securely.',
  termsTitle: 'PearPass Terms of Use',
  termsText: 'I have read and agree to the',
  termsLink: 'PearPass Application Terms of Use.',
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
  emptyTitle: 'Enter Master Password',
  emptySubtitle: 'Now create a secure vault or load an existing one to get started.',
  listTitle: 'Select a vault, create a new one or load another one',
  createNew: 'Create a new vault',
  loadExisting: 'Load a vault',
} as const;

/* =====================================================
        NEW VAULT SCREEN DATA
  ===================================================== */

export const NEW_VAULT_SCREEN = {
  title: 'Create New Vault',
  subtitle: 'Create your first vault by giving it a name. You can also add a password to secure this vault for extra protection.',
  nameInputPlaceholder: 'Enter Name',
  continueButton: 'Continue',
  selectVaultsButton: 'Select Vaults',
} as const;

/* =====================================================
        LOAD VAULT SCREEN DATA
  ===================================================== */

export const LOAD_VAULT_SCREEN = {
  title: 'Load an existing Vault',
  subtitle: 'Open your vault with this code',
  inviteCodeInputPlaceholder: 'Insert your vault\'s code...',
  openButton: 'Open Vault',
  selectVaultsButton: 'Select Vaults',
  scanQrButton: 'Scan QR Code',
} as const;

/* =====================================================
        UNLOCK VAULT SCREEN DATA
  ===================================================== */

export const UNLOCK_VAULT_SCREEN = {
  title: 'Unlock Vault',
  selectVaultsButton: 'Select Vaults',
} as const;
