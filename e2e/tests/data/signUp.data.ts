export const CREATE_MASTER_PASSWORD_PAGE = {
  title: 'Create Master password',
  description: 'This is the key to access PearPass. ',

  passwordField: {
    title: 'Password',
    placeholder: 'Enter Master Password',
    hintText:
      "Strong passwords are usually at least 8 characters long, hard to guess, use a mix of uppercase and lowercase letters, numbers, and symbols, and aren't based on personal information.",
  },
  repeatPasswordField: {
    title: 'Repeat Password',
    placeholder: 'Repeat Master Password',
  },

  termsOfUse: {
    text: 'By clicking Continue, you confirm that you have read and agree to the PearPass Application Terms of Use.',
    link: 'PearPass Application Terms of Use',
  },

  continueButton: 'Continue',
} as const;

export const TURN_ON_AUTOFILL_PAGE = {
  title: 'Faster, safer sign-ins',
  description:
    "Allow autofill to sign in instantly on apps and websites. PearPass fills your credentials securely, so you don't need to remember, copy, or retype passwords.",
  turnOnAutofillButton: 'Turn on Autofill',
  notNowButton: 'Not now',
} as const;

export const PREFERED_SERVICES_PAGE = {
  title: 'Preferred service for passwords, passkeys & autofill',
  noneButton: 'None',
  pearPassButton: 'PearPass Nightly',
  googleButton: {
    title: 'Google',
  },
} as const;

export const UNLOCK_WITH_BIOMETRICS_PAGE = {
  title: 'Unlock faster with biometrics',
  description:
    "Use your fingerprint or face to securely unlock PearPass and confirm actions. It's faster than entering your Master Password and works only with your approval.",
  enableBiometricsButton: 'Enable biometrics',
  notNowButton: 'Not now',
} as const;

export const UNLOCK_WITH_BIOMETRICS_POPUP = {
  title: 'Authenticate to enable biometric login',
  usePinButton: 'Use PIN',
} as const;

export type SignUpPasswordFieldName =
  | 'enterMasterPasswordField'
  | 'repeatMasterPasswordField';

export type SignUpPasswordStrength = 'Strong' | 'Decent' | 'Vulnerable';
export type SignUpPasswordMatchStatus = 'Match';

export type SignUpPasswordIndicatorStatus =
  | SignUpPasswordStrength
  | SignUpPasswordMatchStatus;

export const TEST_PASSWORDS = {
  masterPassword: 'Test123!@#',
  valid: {
    standard: 'Test123!@#',
    long: 'MySecurePassword123!@#$%',
    withSpecial: 'P@ssw0rd!',
    complex: 'A1b2C3d4E5f6!@#',
    masked: '••••••••••',
    maskedConfirm: '••••••••••',
    maskedComplex: '•••••••••••••••',
  },
  invalid: {
    standard: 'Test',
  },
  tooShort: {
    sevenChars: 'Test12!',
    sixChars: 'Test1!',
    fiveChars: 'Test!',
  },
  missingUppercase: 'test123!@#',
  missingLowercase: 'TEST123!@#',
  missingNumber: 'TestPass!@#',
  missingSpecial: 'TestPass123',
  commonWord: 'Password123!',
  personalInfo: 'JohnDoe123!',
  mismatch: 'Different123!',
  blindPeerCodeInvalid: 'Test123!@#',
  blindPeerCodeValid:
    'g6g8hqaju7mijj6g4f9guombuqdgprz4jbdfutydkbr97gbnkhpy',
  vaultName: 'TestVault',
  newVaultName: 'NewTestVault',
  changedVaultName: 'RenamedTestVault',
  newVaultPassword: 'VaultPass123!',
  wrongVaultPassword: 'WrongVaultPass123!',
  issueText: 'Automated report-a-problem text',
} as const;

type LeafPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends Record<string, unknown>
      ? LeafPaths<T[K], `${Prefix}${K}.`>
      : never;
}[keyof T & string];

export type TestPasswordKey = LeafPaths<typeof TEST_PASSWORDS>;

export function getTestPassword(key: TestPasswordKey): string {
  return key
    .split('.')
    .reduce<unknown>((acc, segment) => (acc as Record<string, unknown>)[segment], TEST_PASSWORDS) as string;
}
