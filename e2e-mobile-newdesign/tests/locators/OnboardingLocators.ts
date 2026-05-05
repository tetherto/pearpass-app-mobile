const onboardingLocators = {

    backButton: '~Go back',

    onboardingLogo: '//android.view.ViewGroup[@resource-id="onboarding-v2-logo"]',
    onboardingTitle: '//android.view.View[@resource-id="onboarding-v2-data-local-title"]',
    onboardingDescription: '//android.widget.TextView[@resource-id="onboarding-v2-data-local-description"]',
    onboardingContinueButton: '~Continue',
    onboarding2Picture: '//android.view.TextureView',
    onboarding2Title: '//android.view.View[@resource-id="onboarding-v2-sync-title"]',
    onboarding2Description: '//android.widget.TextView[@resource-id="onboarding-v2-sync-description"]',
} as const

export default onboardingLocators
