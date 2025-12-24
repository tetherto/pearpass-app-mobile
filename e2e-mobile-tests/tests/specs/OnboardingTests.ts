import 'mocha';
import { Pages } from '@support/page-factory';

describe('Onboarding Flow', () => {

  it('[PAS-203] User should see onboarding screens when opening the Mob app for the first time', async () => {
    const onboarding = Pages.onboarding;
    await onboarding.waitForLoaded();
    await onboarding.verifyStep(0);
    await onboarding.verifyButtons()
  });

  it('[PAS-926] User is moved to the next "Onboarding" screen by tapping on the "Continue" button', async () => {
    const onboarding = Pages.onboarding;
    await onboarding.tapContinue();
    await onboarding.verifyStep(1);
    await onboarding.tapContinue();
    await onboarding.verifyStep(2);
    await onboarding.tapContinue();
    await onboarding.verifyStep(3);
    await onboarding.tapContinue();
    await onboarding.verifyStep(4);
    await onboarding.tapContinue();
    await onboarding.verifyStep(5);
  });

  it('[PAS-925] User can choose any onboarding screen by tapping on the screen picker', async () => {
    const onboarding = Pages.onboarding;
    await onboarding.goToStep(2);
    await onboarding.goToStep(4);
  });

  it('[PAS-927] User skips "Onboarding" screens by tapping on "Skip" button', async () => {
    const onboarding = Pages.onboarding;
    await onboarding.tapSkip();
    await onboarding.verifyStep(5);
  });

  it('[PAS-931] User is moved to the "Sign-up" screen after the "Onboarding" screens', async () => {
    const onboarding = Pages.onboarding;
    await onboarding.tapContinue();

    const signUp = Pages.signUp;
    await signUp.waitForCreatePasswordScreen();
  });
});
