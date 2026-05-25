/* =====================================================
       APP PREFERENCES SCREEN
   ===================================================== */

export const APP_PREFERENCES_PAGE = {
  title: 'App Preferences',
  subtitle: 'Control how PearPass works and keep your vault secure.',

  autofillAndBrowsingSection: {
    title: 'Autofill & Browsing',
    autofill: {
      title: 'Autofill',
      description: 'Automatically fill usernames, passwords, and codes when you sign in',
    },
    clearClipboard: {
      title: 'Clear Clipboard',
      description: 'Automatically remove copied credentials from your clipboard after a set time',
      defaultTimeout: '30 Seconds',
    },
  },

  unlockMethodSection: {
    title: 'Unlock Method',
    masterPassword: {
      title: 'Master Password',
      description: 'Use your master password to unlock PearPass and decrypt your vault',
    },
    biometrics: {
      title: 'Biometrics',
      description: `Use your device's built-in authentications (Face ID, fingerprint, or system PIN)`,
    },
  },

  securityAwarenessSection: {
    title: 'Security Awareness',
    autoLock: {
      title: 'Auto Lock',
      description: 'Automatically lock the app after selected period of inactivity',
      defaultTimeout: '30 seconds',
    },
    reminders: {
      title: 'Reminders',
      description: `Get alerts when it's time to update your passwords`,
    },
  },
} as const;

/* =====================================================
       MASTER PASSWORD SCREEN
   ===================================================== */

export const MASTER_PASSWORD_PAGE = {
  title: 'Master Password',
  description: 'Manage the password that protects your app.',

  currentPassword: {
    title: 'Current Password',
    placeholder: 'Enter Current Password',
  },
  newPassword: {
    title: 'New Password',
    placeholder: 'Enter New Password',
  },
  repeatNewPassword: {
    title: 'Repeat New Password',
    placeholder: 'Repeat New Password',
  },

  warning:
    "Don't forget your Master password. It's the only way to access your vault. We can't help recover it. Back it up securely.",

  changePasswordButton: 'Change Password',

  autofillHint: '🔐 PearPass - Tap to unlock',


  passwordWarnings: {
    invalidPassword: 'Invalid password',
    newPasswordSameAsOldPassword:
      'New password must be different from the current password',
    passwordTooShort: 'Password must be at least 8 characters long',
    passwordMissingUppercase:
      'Password must contain at least one uppercase letter',
    passwordMissingLowercase:
      'Password must contain at least one lowercase letter',
    passwordMissingNumber: 'Password must contain at least one number',
    passwordMissingSpecial:
      'Password must contain at least one special character',
  },

  successToast: {
    masterPasswordChanged: 'Master password updated successfully',
  },
} as const;

export type PasswordWarningKey =
  keyof typeof MASTER_PASSWORD_PAGE.passwordWarnings;


export type PasswordFieldName =
  | 'currentPasswordField'
  | 'newPasswordField'
  | 'repeatNewPasswordField';


export type PasswordStrength = 'Strong' | 'Decent' | 'Vulnerable';

export type PasswordMatchStatus = 'Match';

export type PasswordIndicatorStatus = PasswordStrength | PasswordMatchStatus;

export type BlindPeerField = 'automatic' | 'manual';

export type BlindPeerCheckState = 'Checked' | 'Unchecked';

/* =====================================================
      BLIND PEERING SCREEN
   ===================================================== */

export const BLIND_PEERING_PAGE = {
  title: 'Blind Peering',
  description:
    "Sync your encrypted vault with other devices to improve availability and reliability. Peers only see encrypted data - they can't access or read anything",
  enableField: {
    title: 'Enable Blind Peering',
    description: 'Allows your vault to sync through blind peers',
  },
  automaticBlindPeers: {
    title: 'Automatic Blind Peers',
    description: 'Let PearPass allocate blind peers for you to handle syncing',
  },
  manualBlindPeers: {
    title: 'Manual Blind Peers',
    description: 'Setup your own private blind peers',
    enterPeerCodeField: {
      title: 'Blind Peer',
      placeholder: 'Enter Peer Code',
    },
    addPeerButton: 'Add Peer',
  },
  saveChangesButton: 'Save Changes',
  errorAddingBlindPeersToast: 'Error adding Blind Peers',
  manualBlindPeersEnabledSuccessfullyToast:
    'Manual Blind Peers enabled sucessfully',
} as const;

export const LANGUAGE_PAGE = {
  title: 'Language',
  description: 'Choose the language of the app.',
  languageField: {
    title: 'App Language',
    text: 'Select the language used throughout PearPass.',
    selectedLanguage: 'English',
  },
  popup: {
    title: 'App Language',
    selectedLanguage: 'English',
  },
} as const;

export const TERMS_OF_USE_PAGE = {
  title: 'PearPass Application Terms of Use',
} as const;

export const PRIVACY_STATEMENT_PAGE = {
  title: 'PearPass Application Privacy Statement',
} as const;

export const VISIT_OUR_WEBSITE_PAGE = {
  title: 'PearPass',
  tagline: 'Your Open-Source Password Manager',
} as const;

export const APP_VERSION_PAGE = {
  title: 'App version',
  description:
    'Here you can find all the info about your app.\n' +
    'Check here to see the Terms of Use and the Privacy Statement and visit our website.',
  versionField: {
    text: 'App version',
    version: '1.6.0',
  },
} as const;

export const REPORT_A_PROBLEM_PAGE = {
  title: 'Report a problem',
  description:
    "Tell us what's going wrong and leave your email so we can follow up with you.",
  issueInputField: {
    title: 'Report a problem',
    placeholder: 'Write your issue',
  },
  sendButton: 'Send',

  successToast: {
    feedbackSent: 'Feedback sent',
  },
} as const;

export const YOUR_VAULTS_TOASTS = {
  vaultCreatedSuccess: 'Vault created',
  invalidVaultPassword: 'Invalid vault password',
  vaultRenamedSuccess: 'Vault renamed',
} as const;

export const NEW_CREATED_VAULT_FIELD = {
  title: 'Current Vault',
  vaultName: 'Kazik',
  vaultText: 'Private',
} as const;

export const RENAMED_VAULT_FIELD = {
  title: 'Current Vault',
  vaultName: 'IbrahimNew',
  vaultText: 'Private',
} as const;


export const VAULT_THREE_DOTS_POPUP = {
  rename: 'Rename',
} as const;

export const RENAME_VAULT_PAGE = {
  title: 'Rename Vault',
  vaultNameField: {
    title: 'Vault Name',
    currentValue: 'Ibrahim',
  },
  currentPasswordField: {
    title: 'Current Password',
    placeholder: 'Enter vault password',
  },
  saveButton: 'Save',
} as const;

export const SHARE_VAULT_POPUP = {
  title: 'Share Ibrahim Vault',
  accessCodeSectionTitle: 'Access Code',
  codeExpiresLabel: 'Code expires in',
  codeExpiredLabel: 'Code expired',
  vaultLinkField: {
    title: 'Vault Link',
  },
} as const;

export const COMMON_TOASTS = {
  copied: 'Copied!',
} as const;

export const CREATE_NEW_VAULT_PAGE = {
  title: 'Create New Vault',
  subtitle: 'Create New Vault',
  description:
    'Create your vault by giving it a name. Add an optional vault password if you want an extra layer of protection on top of your master password.',
  vaultNameField: {
    title: 'Vault Name',
    placeholder: 'Enter Name',
  },
  setVaultPassword: {
    title: 'Set Vault Password',
    description: 'Add extra password on top of your master password',
  },
} as const;

export const IMPORT_ITEMS_PAGE = {
  title: 'Import',
  description:
    'To import data from another password manager, first access the password manager, export your data, and then upload the exported file into the designated field',
  importSourceSectionTitle: 'Select Import Source',
  sources: {
    onePassword: {
      title: '1Password',
      format: 'Required Format: .CSV',
      pageTitle: 'Import from 1Password',
      requiredFormats: 'Required formats: .CSV',
    },
    bitwarden: {
      title: 'Bitwarden',
      format: 'Required Format: .JSON, .CSV',
      pageTitle: 'Import from Bitwarden',
      requiredFormats: 'Required formats: .JSON, .CSV',
    },
    keepass: {
      title: 'KeePass',
      format: 'Required Format: .KDBX, .CSV, .XML',
      pageTitle: 'Import from KeePass',
      requiredFormats: 'Required formats: .KDBX, .CSV, .XML',
    },
    keepassxc: {
      title: 'KeePassXC',
      format: 'Required Format: .CSV, .XML',
      pageTitle: 'Import from KeePassXC',
      requiredFormats: 'Required formats: .CSV, .XML',
    },
    lastpass: {
      title: 'LastPass',
      format: 'Required Format: .CSV',
      pageTitle: 'Import from LastPass',
      requiredFormats: 'Required formats: .CSV',
    },
    nordpass: {
      title: 'NordPass',
      format: 'Required Format: .CSV',
      pageTitle: 'Import from NordPass',
      requiredFormats: 'Required formats: .CSV',
    },
    protonpass: {
      title: 'Proton Pass',
      format: 'Required Format: .CSV, .JSON',
      pageTitle: 'Import from Proton Pass',
      requiredFormats: 'Required formats: .CSV, .JSON',
    },
    encryptedFile: {
      title: 'Encrypted file',
      format: 'Required Format: .JSON',
      pageTitle: 'Import from Encrypted file',
      requiredFormats: 'Required formats: .JSON',
    },
    unencryptedFile: {
      title: 'Unencrypted file',
      format: 'Required Format: .JSON, .CSV',
      pageTitle: 'Import from Unencrypted file',
      requiredFormats: 'Required formats: .JSON, .CSV',
    },
  },

  importFromSourcePage: {
    description:
      'To import data from Proton Pass, open the app, go to Settings, navigate to the Export tab, and choose your preferred export format. Once the export is complete, upload the file here. Additionally, learn more about exporting data from Proton Pass.',
    uploadFieldText: 'Upload file here',
    uploadButtonText: 'Upload file',
    importButtonText: 'Import',
  },
  unencryptedFile: {
    fileName: 'PearPass_ytgiu_2025_12_02T10_41_25_523Z.json',
  },
  successToast: {
    vaultsImported: 'Vaults imported successfully!',
  },
} as const;

export type ImportSourceKey = keyof typeof IMPORT_ITEMS_PAGE.sources;

/* =====================================================
       EXPORT ITEMS PAGE
   ===================================================== */

export const EXPORT_ITEMS_PAGE = {
  title: 'Export',
  description:
    'Download the data in the desired format and optionally protect the file with a password for securely backing up or transferring your data.',
  json: {
    title: 'JSON (Recommended)',
    description:
      'JSON preserves all data, including custom fields, attachments, and metadata, ensuring a complete export',
  },
  csv: {
    title: 'CSV',
    description:
      'CSV exports basic item data for spreadsheets, without custom fields, attachments, or metadata.',
  },
  protectWithPassword: {
    title: 'Protect with Password',
    description: 'Protect your exported file so it can only be opened with the password you set',
  },

  passwordField: {
    title: 'Password',
    placeholder: 'Enter file password',
  },

  repeatPasswordField: {
    title: 'Repeat Password',
    placeholder: 'Repeat file password',
  },

  successToast: {
    title: 'Export successful',
    text: 'Vault is ready to be exported',
  },
} as const;

export const SHARE_POPUP = {
  title: 'Sharing 1 file',
} as const;

const CLEAR_CLIPBOARD_TIMEOUT_OPTIONS = {
  thirtySecond: '30 Seconds',
  oneMinute: '1 Minute',
  threeMinutes: '3 Minutes',
  fiveMinutes: '5 Minutes',
  tenMinutes: '10 Minutes',
  thirtyMinutes: '30 Minutes',
  oneHour: '1 Hour',
  threeHours: '3 Hours',
  never: 'Never',
} as const;

const AUTO_LOCK_TIMEOUT_OPTIONS = {
  thirtySecond: '30 seconds',
  oneMinute: '1 minute',
  fiveMinutes: '5 minutes',
  fifteenMinutes: '15 minutes',
  thirtyMinutes: '30 minutes',
  oneHour: '1 hour',
  fourHours: '4 hours',
  never: 'Never',
} as const;

export const CLEAR_CLIPBOARD_POPUP = {
  title: 'Clear Clipboard',
  options: CLEAR_CLIPBOARD_TIMEOUT_OPTIONS,
} as const;

export const AUTO_LOCK_POPUP = {
  title: 'Auto Lock',
  options: AUTO_LOCK_TIMEOUT_OPTIONS,
} as const;

export const FINGERPRINT_POPUP = {
  title: 'PearPass Nightly',
} as const;

export const VERIFICATION_REQUIRED_POPUP = {
  title: 'Verification Required',
  description: 'Use your Master Password or biometric ID to authorize this action.',
  password: {
    title: 'Password',
    placeholder: 'Enter Master Password',
  },
  continueButtonText: 'Continue',
} as const;

export const YOUR_VAULTS_PAGE = {
  title: 'Your Vaults',
  description:
    'Manage your vaults, control access permissions, and take protective measures if needed.',
  currentVaultField: {
    title: 'Current Vault',
    vaultText: 'Private',
  },
  otherVaultsSectionTitle: 'Other Vaults',
  createNewVaultButton: 'Create New Vault',
} as const;

export const YOUR_DEVICES_PAGE = {
  title: 'Your Devices',
  description:
    'Devices listed here stay in sync. Changes made on one device update across all your vaults on every synced device.',
  syncedPersonalDevicesSectionText: 'Synced Personal Devices',
  syncedPersonalDevicesField: {
    title: 'Android',
  },
} as const;

export const SETTINGS_PAGE = {
  title: 'Settings',

  searchField: {
    placeholder: 'Search in Settings',
  },

  sections: {
    security: {
      title: 'Security',
      items: {
        appPreferences: 'App Preferences',
        masterPassword: 'Master Password',
      },
    },
    syncing: {
      title: 'Syncing',
      items: {
        blindPeering: 'Blind Peering',
        yourDevices: 'Your Devices',
      },
    },
    vault: {
      title: 'Vault',
      items: {
        yourVaults: 'Your Vaults',
        importItems: 'Import Items',
        exportItems: 'Export Items',
      },
    },
    appearance: {
      title: 'Appearance',
      items: {
        language: 'Language',
      },
    },
    about: {
      title: 'About',
      items: {
        reportAProblem: 'Report a problem',
        appVersion: 'App Version',
      },
    },
  },
} as const;
