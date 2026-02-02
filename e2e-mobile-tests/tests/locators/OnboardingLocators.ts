const onboardingLocators = {
/* ============================
        HEADER
============================ */
  onboardingLogo: '//android.view.ViewGroup[@resource-id="onboarding-logo"]',
/* ============================
        PROGRESS BAR
============================ */
  onboardingProgressBar: '//android.view.ViewGroup[@resource-id="onboarding-progress-bar"]',
/* ============================
        PROGRESS STEPS (0–5)
============================ */
  onboardingProgressStep0: '//android.view.ViewGroup[@resource-id="onboarding-progress-step-0"]',
  onboardingProgressStep1: '//android.view.ViewGroup[@resource-id="onboarding-progress-step-1"]',
  onboardingProgressStep2: '//android.view.ViewGroup[@resource-id="onboarding-progress-step-2"]',
  onboardingProgressStep3: '//android.view.ViewGroup[@resource-id="onboarding-progress-step-3"]',
  onboardingProgressStep4: '//android.view.ViewGroup[@resource-id="onboarding-progress-step-4"]',
  onboardingProgressStep5: '//android.view.ViewGroup[@resource-id="onboarding-progress-step-5"]',
/* ============================
        MAIN DESCRIPTION (per step)
============================ */
  onboardingMainDescription0: '//android.widget.TextView[@resource-id="onboarding-main-description-0"]',
  onboardingMainDescription1: '//android.widget.TextView[@resource-id="onboarding-main-description-1"]',
  onboardingMainDescription2: '//android.widget.TextView[@resource-id="onboarding-main-description-2"]',
  onboardingMainDescription3: '//android.widget.TextView[@resource-id="onboarding-main-description-3"]',
  onboardingMainDescription4: '//android.widget.TextView[@resource-id="onboarding-main-description-4"]',
  onboardingMainDescription5: '//android.widget.TextView[@resource-id="onboarding-main-description-5"]',
/* ============================
        SUB DESCRIPTION (per step)
============================ */
  onboardingSubDescription1: '//android.widget.TextView[@resource-id="onboarding-sub-description-1"]',
  onboardingSubDescription2: '//android.widget.TextView[@resource-id="onboarding-sub-description-2"]',
  onboardingSubDescription3: '//android.widget.TextView[@resource-id="onboarding-sub-description-3"]',
  onboardingSubDescription4: '//android.widget.TextView[@resource-id="onboarding-sub-description-4"]',
  onboardingSubDescription5: '//android.widget.TextView[@resource-id="onboarding-sub-description-5"]',
/* ============================
        MEDIA CONTENT FOR EACH STEP
============================ */
  onboardingMediaStep0: '//android.widget.FrameLayout[@resource-id="com.pears.pass:id/exo_subtitles"]/android.view.View',
  onboardingMediaStep1: '//android.view.ViewGroup[@resource-id="onboarding-media-step-1"]',
  onboardingMediaStep2: '//android.view.ViewGroup[@resource-id="onboarding-media-step-2"]',
  onboardingMediaStep3: '//android.view.ViewGroup[@resource-id="onboarding-media-step-3"]',
  onboardingMediaStep4: '//android.view.ViewGroup[@resource-id="onboarding-media-step-4"]',
  onboardingMediaStep5: '//android.widget.ImageView[@resource-id="onboarding-media-step-5"]',
/* ============================
        BUTTONS
============================ */
  onboardingContinueButton: '~Continue',
  onboardingSkipButton: '~Skip',
  onboardingContinueText: '//android.widget.TextView[@resource-id="onboarding-continue-text"]',
  onboardingSkipText: '//android.widget.TextView[@resource-id="onboarding-skip-text"]',
}

export default onboardingLocators
