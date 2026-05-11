import 'mocha';
import { Pages } from '@support/page-factory';
import { clearAppData } from '@helpers/test-setup';


describe('Onboarding Flow', () => {
  beforeEach(async () => {
    await clearAppData();
  });

  it('[] User should see onboarding screens when opening the app for the first time', async () => {
    const onboarding = Pages.onboarding;

    await onboarding.waitForLoaded();
    await onboarding.verifySlide(1);
    await onboarding.verifyContinueButton();
  });

  it('[] User is moved to the next screen by tapping Continue button', async () => {
    const onboarding = Pages.onboarding;

    await onboarding.waitForLoaded();
    await onboarding.verifySlide(1);

    await onboarding.tapContinue();
    await onboarding.verifySlide(2);
  });

  it('[] User is moved to Sign-up screen after Onboarding', async () => {
    const onboarding = Pages.onboarding;
    const signUp = Pages.signUp;

    await onboarding.waitForLoaded();
    await onboarding.verifySlide(1);

    await onboarding.tapContinue();
    await onboarding.verifySlide(2);

    await onboarding.tapContinue();
    await signUp.waitForCreatePasswordScreen();
  });
});
