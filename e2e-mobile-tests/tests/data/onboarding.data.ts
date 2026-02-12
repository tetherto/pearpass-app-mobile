export type OnboardingStep = {
  index: 0 | 1 | 2 | 3 | 4 | 5;
  mainDescription: string;
  subDescription: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    index: 0,
    mainDescription: 'Fully local, Open-source, Password manager.',
    subDescription: '',
  },
  {
    index: 1,
    mainDescription: 'Your passwords. Your rules.',
    subDescription:
      `PearPass is the first truly local, peer-to-peer password manager. Your data never touches a server it lives with you, syncs between your devices, and stays entirely in your control.`,
  },
  {
    index: 2,
    mainDescription: 'You hold the keys',
    subDescription:
      `No one can unlock your data, not even us. Your data stays fully encrypted and local to your device. Keep your master password safe, because if you lose it, it's gone forever.`,
  },
  {
    index: 3,
    mainDescription: 'Store more than passwords',
    subDescription:
      `Your digital life. from passwords to payment cards, IDs and private notes Grouped how you like. Accessible only to you.`
  },
  {
    index: 4,
    mainDescription: 'All in one encrypted place.',
    subDescription:
      'Store everything from passwords to payment cards, IDs and private notes',
  },
  {
    index: 5,
    mainDescription: 'Sync, without the Cloud',
    subDescription:
      'No servers. No middlemen Pearpass syncs directly across your devices using peer-to-peer technology, powered by Pear Runtime.',
  },
] as const;
/* =====================================================
        BUTTONS DATA
  ===================================================== */

export const ONBOARDING_BUTTONS = {
  continue: 'Continue',
  skip: 'Skip',
} as const;
