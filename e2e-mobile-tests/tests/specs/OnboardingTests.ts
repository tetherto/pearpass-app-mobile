import 'mocha';
import { Pages } from '@support/page-factory';
import { clearAppData } from '@helpers/test-setup';

describe('Onboarding Flow', () => {
  
  beforeEach(async () => {
    await clearAppData();
  });

  it('[PAS-203] User should see onboarding screens when opening the app for the first time', async () => {
    const onboarding = Pages.onboarding;
    
    await onboarding.waitForLoaded();
    await onboarding.verifyStep(0);
    await onboarding.verifyButtons();
  });

  it('[PAS-926] User is moved to the next screen by tapping Continue button', async () => {
    const onboarding = Pages.onboarding;
    
    await onboarding.waitForLoaded();
    await onboarding.verifyStep(0);
    
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
    
    await onboarding.waitForLoaded();
    await onboarding.verifyStep(0);
    
    await onboarding.goToStep(2);
    await onboarding.goToStep(4);
    await onboarding.goToStep(0);
    await onboarding.goToStep(5);
  });

  it('[PAS-927] User skips Onboarding screens by tapping Skip button', async () => {
    const onboarding = Pages.onboarding;
    
    await onboarding.waitForLoaded();
    await onboarding.verifyStep(0);
    
    await onboarding.tapSkip();
    await onboarding.verifyStep(5);
  });

  it('[PAS-931] User is moved to Sign-up screen after Onboarding', async () => {
    const onboarding = Pages.onboarding;
    const signUp = Pages.signUp;
    
    await onboarding.waitForLoaded();
    await onboarding.tapSkip();
    await onboarding.verifyStep(5);
    
    await onboarding.tapContinue();
    await signUp.waitForCreatePasswordScreen();
  });
});
