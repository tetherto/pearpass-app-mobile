const signUpLocators = {
  backButton: '~Go back',

  /* ============================
    CREATE MASTER PASSWORD PAGE
  ============================ */
  createMasterPasswordTitle: '//android.view.View[@resource-id="onboarding-v2-create-password-title"]',
  createMasterPasswordDescription: '//android.widget.TextView[@resource-id="onboarding-v2-create-password-subtitle"]',

  enterMasterPasswordField: '//android.view.ViewGroup[@resource-id="onboarding-v2-password-input"]',
  enterMasterPasswordFieldTitle: '//android.widget.TextView[@text="Password"]',
  enterMasterPasswordFieldInput: '//android.widget.EditText[@text="Enter Master Password"]',
  enterMasterPasswordFieldShowPasswordButton: '(//android.widget.Button[@content-desc="Show password"])[1]',
  enterMasterPasswordFieldHidePasswordButton: '~Hide password',

  enterMasterPasswordFieldPasswordIndicatorStrong: '//android.widget.TextView[@text="Strong"]',
  enterMasterPasswordFieldPasswordIndicatorStrongIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[1]',
  enterMasterPasswordFieldPasswordIndicatorDecent: '//android.widget.TextView[@text="Decent"]',
  enterMasterPasswordFieldPasswordIndicatorDecentIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[1]',
  enterMasterPasswordFieldPasswordIndicatorVulnerable: '//android.widget.TextView[@text="Vulnerable"]',
  enterMasterPasswordFieldPasswordIndicatorVulnerableIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[1]',

  enterMasterPasswordFieldInfoBox: '//android.view.ViewGroup[@resource-id="password-field-info-box"]',
  enterMasterPasswordFieldInfoBoxText: `//android.widget.TextView[@text="Strong passwords are usually at least 8 characters long, hard to guess, use a mix of uppercase and lowercase letters, numbers, and symbols, and aren't based on personal information."]`,
  enterMasterPasswordFieldInfoBoxIcon: '//android.view.ViewGroup[@resource-id="password-field-info-box"]/com.horcrux.svg.SvgView',


  repeatMasterPasswordField: '//android.view.ViewGroup[@resource-id="onboarding-v2-password-confirm-input"]',
  repeatMasterPasswordFieldTitle: '//android.widget.TextView[@text="Repeat Password"]',
  repeatMasterPasswordFieldInput: '//android.widget.EditText[@text="Repeat Master Password"]',
  repeatMasterPasswordFieldShowPasswordButton: '~Show password',
  repeatMasterPasswordFieldHidePasswordButton: '(//android.widget.Button[@content-desc="Hide password"])[2]',
  repeatMasterPasswordFieldPasswordIndicatorStrong: '',
  repeatMasterPasswordFieldPasswordIndicatorDecent: '',
  repeatMasterPasswordFieldPasswordIndicatorMatch: '',

  passwordNotMatchWarningText: '//android.widget.TextView[@text="Passwords do not match"]',
  passwordNotMatchWarningIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',

  termsOfUseText: '//android.widget.TextView[@resource-id="onboarding-v2-terms-text"]',
  termsOfUseLink: '~PearPass Application Terms of Use',

  continueButton: '~Continue',
  continueButtonText: '//android.widget.TextView[@text="Continue"]',
  continueButtonIcon: '//android.widget.Button[@content-desc="Continue"]/com.horcrux.svg.SvgView',


  /* ============================
    TURN ON AUTOFILL PAGE
  ============================ */
  turnOnAutofillMedia: '//android.view.TextureView',
  turnOnAutofillTitle: '//android.view.View[@resource-id="onboarding-v2-autofill-title"]',
  turnOnAutofillDescription: '//android.widget.TextView[@resource-id="onboarding-v2-autofill-description"]',
  turnOnAutofillButton: '~Turn on Autofill',
  turnOnAutofillButtonText: '//android.widget.TextView[@text="Turn on Autofill"]',
  turnOnAutofillButtonIcon: '//android.widget.Button[@content-desc="Turn on Autofill"]/com.horcrux.svg.SvgView',

  preferedServicesTitle: '~Preferred service for passwords, passkeys & autofill',
  noneButton: '//androidx.recyclerview.widget.RecyclerView[@resource-id="com.android.settings:id/recycler_view"]/android.widget.LinearLayout[1]',
  noneButtonText: '//android.widget.TextView[@resource-id="android:id/title" and @text="None"]',

  pearPassButton: '//androidx.recyclerview.widget.RecyclerView[@resource-id="com.android.settings:id/recycler_view"]/android.widget.LinearLayout[2]',
  pearPassButtonText: '//android.widget.TextView[@resource-id="android:id/title" and @text="PearPass Nightly"]',
  pearPassButtonIcon: '(//android.widget.LinearLayout[@resource-id="com.android.settings:id/icon_frame"])[2]',

  googleButton: '//androidx.recyclerview.widget.RecyclerView[@resource-id="com.android.settings:id/recycler_view"]/android.widget.LinearLayout[3]',
  googleButtonTitle: '//android.widget.TextView[@resource-id="android:id/title" and @text="Google"]',
  googleButtonDescription: '//android.widget.TextView[@resource-id="android:id/summary"]',
  googleButtonIcon: '(//android.widget.LinearLayout[@resource-id="com.android.settings:id/icon_frame"])[3]',

  preferredServicesPopup: '//android.widget.TextView[@resource-id="android:id/message"]',
  preferredServicesPopupChangeButton: '//android.widget.Button[@resource-id="android:id/button1"]',
  preferredServicesPopupCancelButton: '//android.widget.Button[@resource-id="android:id/button2"]',

  preferedServicesBackButton: '~Navigate up',





  /* ============================
    UNLOCK WITH BIOMETRICS PAGE
  ============================ */
  notNowButton: '~Not now',
  unlockWithBiometricsMedia: '//android.view.ViewGroup[@resource-id="onboarding-v2-biometrics-media"]',
  unlockWithBiometricsTitle: '//android.view.View[@resource-id="onboarding-v2-biometrics-title"]',
  unlockWithBiometricsDescription: '//android.widget.TextView[@resource-id="onboarding-v2-biometrics-description"]',
  enableBiometricsButton: '~Enable biometrics',
  enableBiometricsButtonText: '//android.widget.TextView[@text="Enable biometrics"]',
  enableBiometricsButtonIcon: '//android.widget.Button[@content-desc="Enable biometrics"]/com.horcrux.svg.SvgView',

  fingerPrintPopup: '//android.view.View[@resource-id="com.android.systemui:id/panel"]',
  fingerPrintPopupLogo: '~App logo',
  fingerPrintPopupTitle: '//android.widget.TextView[@resource-id="com.android.systemui:id/logo_description"]',
  fingerPrintPopupSensor: '~Fingerprint sensor',
  fingerPrintPopupUsePinButton: '//android.widget.Button[@resource-id="com.android.systemui:id/button_use_credential"]',

  /* ============================
    ENTER MASTER PASSWORD PAGE
  ============================ */

  pearPassLogo: '//android.view.ViewGroup[@resource-id="onboarding-v2-logo"]',
  enterMasterPasswordTitle: '//android.widget.TextView[@text="Please enter your master password to continue"]',


} as const

export default signUpLocators
