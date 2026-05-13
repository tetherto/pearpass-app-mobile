const onboardingLocators = {

  backButton: '~Go back',


  onboardingHeaderTitle: '//android.view.ViewGroup[@resource-id="onboarding-v2-logo"]',
  onboardingHeaderLogoIcon: '//android.view.ViewGroup[@resource-id="onboarding-v2-logo"]',

  slide1Title: '//android.view.View[@resource-id="onboarding-v2-data-local-title"]',
  slide1Description: '//android.widget.TextView[@resource-id="onboarding-v2-data-local-description"]',

  slide2Title: '//android.view.View[@resource-id="onboarding-v2-sync-title"]',
  slide2Description: '//android.widget.TextView[@resource-id="onboarding-v2-sync-description"]',


  continueButton: '~Continue',
  continueButtonText: '//android.widget.TextView[@text="Continue"]',
} as const

export default onboardingLocators
