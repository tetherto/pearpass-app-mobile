/* =====================================================
       SETTINGS TABS DATA
  ===================================================== */

export const GENERAL_TAB = {
  tabName: 'General',
} as const;

export const VAULTS_TAB = {
  tabName: 'Vaults',
} as const;

export const EXPORT_TAB = {
  tabName: 'Export',
} as const;

export const IMPORT_TAB = {
  tabName: 'Import',
} as const;

export const ADVANCED_TAB = {
  tabName: 'Advanced',
} as const;

/* =====================================================
        LANGUAGE SECTION DATA
  ===================================================== */

export const LANGUAGE_SECTION = {
  title: 'Language',
  defaultLanguage: 'English',
} as const;

/* =====================================================
        PASSWORDS SECTION DATA
  ===================================================== */

export const PASSWORDS_SECTION = {
  title: 'Passwords',
  masterVault: 'Master Vault',
} as const;

/* =====================================================
        MODIFY MASTER PASSWORD POPUP DATA
  ===================================================== */

export const MODIFY_MASTER_PASSWORD_POPUP = {
  title: 'Modify master password',
  oldPasswordField: {
    label: 'Insert old password',
    invalidPasswordWarning: ' Invalid password ',
  },
  newPasswordField: {
    label: 'Create new password',
    passwordIsRequiredWarning: ' Password is required ',
    passwordWarningAll: ' Password must be at least 8 characters long, Password must contain at least one number, Password must contain at least one special character ',
    newPasswordDifferentFromOldPasswordWarning: ' New password must be different from the current password ',
  },
  repeatNewPasswordField: {
    label: 'Repeat new password',
    passwordIsRequiredWarning: ' Password is required ',
  },
  buttons: {
    continue: 'Continue',
    cancel: 'Cancel',
  },
} as const;

/* =====================================================
        REPORT A PROBLEM SECTION DATA
  ===================================================== */

export const REPORT_PROBLEM_SECTION = {
  title: 'Report a problem',
  issueInputPlaceholder: 'Write your issue...',
  sendButton: 'Send',
  feedbackSentToastText: 'Feedback sent',
} as const;

/* =====================================================
        VERSION SECTION DATA
  ===================================================== */

export const VERSION_SECTION = {
  title: 'Version',
  versionNumber: '1.2.2',
} as const;

/* =====================================================
        LEGAL LINKS DATA
  ===================================================== */

export const LEGAL_LINKS = {
  termsOfUse: 'Terms of Use',
  privacyStatement: 'Privacy Statement',
  termsOfUsePageTitle: 'PearPass Application Terms of Use',
  privacyStatementPageTitle: 'PearPass Application Privacy Statement',
} as const;

/* =====================================================
        VAULTS SECTION DATA
  ===================================================== */

export const VAULTS_SECTION = {
  manageVaultsTitle: 'Manage Vaults',
  vaultNames: {
    kazik: 'Kazik',
    valeron: 'Valeron',
  },
  vaultDates: {
    date1: '27/01/2026',
    date2: '27/01/2026',
  },
  firstItem: {
    name: 'Kazik',
    date: '27/01/2026',
  },
  secondItem: {
    name: 'Valeron',
    date: '27/01/2026',
  },
} as const;

export const CHANGE_VAULT_NAME_POPUP = {
  title: 'What would you like to modify?',
  changeVaultNameButton: 'Change vault name',
  windowTitle: 'Change Vault Name',
  inputFieldLabel: 'Vault name',
  buttons: {
    continue: 'Continue',
    cancel: 'Cancel',
  },
} as const;

/* =====================================================
        EXPORT SECTION DATA
  ===================================================== */

export const EXPORT_SECTION = {
  title: 'Export',
  vaults: {
    vault1: {
      name: 'Kazik',
      date: '27/01/2026',
      nameAfterChange: 'Ibrahim',
    },
    vault2: {
      name: 'Valeron',
      date: '27/01/2026',
    },
  },
  chooseFileFormatText: 'Choose the file format',
  fileFormats: {
    csv: 'csv',
    json: 'json',
  },
  exportButton: 'Export',
  popup: {
    title: 'Are you sure to export your Vault?',
    description: 'Exporting your vault may expose sensitive data. Proceed only on trusted devices.',
    inputFieldPlaceholder: 'Insert Master password',
    invalidPasswordWarning: ' Invalid password ',
    buttons: {
      export: 'Export',
      cancel: 'Cancel',
    },
  },
  successToast: {
    title: 'Export successful',
    text: 'Vault is ready to be exported',
  },
} as const;

/* =====================================================
        IMPORT SECTION DATA
  ===================================================== */

export const IMPORT_SECTION = {
  title: 'Import',
  description: 'Import your Vaults from a file or another app. Currently, only CSV files are supported.',
  importSources: {
    onePassword: {
      name: '1Password',
      formats: '.csv',
    },
    bitwarden: {
      name: 'Bitwarden',
      formats: '.json, .csv',
    },
    lastPass: {
      name: 'LastPass',
      formats: '.csv',
    },
    nordPass: {
      name: 'NordPass',
      formats: '.csv',
    },
    protonPass: {
      name: 'Proton Pass',
      formats: '.csv, .json',
    },
    unencryptedFile: {
      name: 'Unencrypted file',
      formats: '.json, .csv',
    },
  },
  toastMessages: {
    importFailed: 'Vaults import failed!',
    importSuccess: 'Vaults imported successfully!',
  },
} as const;

/* =====================================================
        ADVANCED SECTION DATA
  ===================================================== */

export const CUSTOM_SETTINGS_SECTION = {
  title: 'Custom settings',
  description: 'Here you can choose your privacy settings and personalize your experience.',
  reminders: {
    title: 'Reminders',
    description: 'Enable the reminders to change your passwords',
  },
  copyToClipboard: {
    title: 'Copy to clipboard',
    description: 'When clicking a password you copy that into your clipboard',
  },
  autoLogout: {
    title: 'Auto Log-out',
    description: 'Automatically logs you out after you stop interacting with the app, based on the timeout you select.',
    timeoutOptions: {
      thirtySeconds: '30 seconds',
      oneMinute: '1 minute',
      fiveMinutes: '5 minutes',
      fifteenMinutes: '15 minutes',
      thirtyMinutes: '30 minutes',
      oneHour: '1 hour',
      fourHours: '4 hours',
      never: 'Never',
    },
  },
} as const;

export const BLIND_PEERING_SECTION = {
  title: 'Blind Peer',
  description: 'Private Connections',
  text: 'Sync your encrypted vault securely with blind peers to improve availability and consistency. Blind peers cannot read your data.',
  learnMoreButton: 'Learn more about blind peering.',
  learnMoreUrl: 'github.com/holepunchto/blind-peer',
  informationPopup: {
    title: 'Blind Peer',
    description: 'Choose between:',
    text1: '• Automatic Blind Peers: Let PearPass allocate Blind Peers for you to handle syncing.',
    text2: '• Manual Blind Peers: Setup your own private Blind Peers.In both cases, all data stays fully encrypted, ensuring safe, non-intrusive replication and better data consistency',
    learnMoreButton: 'Learn more about blind peering.',
  },
  chooseBlindPeerPopup: {
    title: 'Choose your Blind Peer',
    options: {
      automatic: 'Automatic Blind Peers ',
      manual: 'Manual Blind Peers',
    },
    buttons: {
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
  },
  toastMessages: {
    automaticEnabled: 'Automatic Blind Peers enabled successfully',
  },
  yourBlindPeers: {
    text: 'Your Blind Peers',
    fieldText: 'Automatic',
    status: 'Active',
    manualFieldText: 'Personal',
    manualStatus: 'Active',
    manualTextCount: '1 peers',
  },
  editButton: 'Edit',
  manualBlindPeersPopup: {
    title: 'Add Personal Blind Peers',
    blindPeer1: ' #1 Blind Peer ',
    blindPeer2: ' #2 Blind Peer ',
    inputFieldPlaceholder: 'Add here your code...',
    buttons: {
      addPeer: 'Add Peer',
      removePeer: 'Remove Peer',
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    errorMessage: 'Error adding Blind Peers',
    successMessage: 'Manual Blind Peers enabled successfully',
  },
} as const;

export const AUTOFILL_SECTION = {
  title: 'Autofill',
  description: 'Set PearPass as your default autofill provider for instant sign-ins.',
  setAsDefaultButton: 'Set as Default',
  autofillService: {
    toolbarTitle: 'Autofill service',
    pearPassAppName: 'PearPass',
  },
  autofillPopup: {
    text: `Make sure you trust this app \n\nPearPass uses what's on your screen to determine what can be autofilled.`,
  },
  autofillEnabled: {
    text: 'PearPass autofill is enabled.',
    manageAutofillSettingsLink: 'Manage autofill settings',
  },
} as const;
