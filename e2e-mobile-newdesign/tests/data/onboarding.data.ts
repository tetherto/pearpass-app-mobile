export type OnboardingSlide = {
  index: 1 | 2;
  title: string;
  description: string;
  secondaryDescription?: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    index: 1,
    title: 'Your data stays on your devices',
    description: `Your items are stored locally, not on our servers.\nOnly you have access to them.`,
  },
  {
    index: 2,
    title: 'Sync without the cloud',
    description: `Your devices connect directly to each other using peer-to-peer technology.\n\nNo cloud. No copies. No middlemen.`,
  },
];

/* =====================================================
        HEADER (shown on every onboarding slide)
  ===================================================== */
export const ONBOARDING_HEADER = {
  title: 'PearPass',
} as const;

/* =====================================================
        BUTTONS DATA
  ===================================================== */
export const ONBOARDING_BUTTONS = {
  continue: 'Continue',
} as const;
