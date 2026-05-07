import { browser, $ } from '@wdio/globals';
import { Pages } from '@support/page-factory';

const APP_PACKAGE = process.env.APP_PACKAGE || 'com.pears.pass.nightly';

export async function clearAppData(): Promise<void> {
  try {
    await browser.terminateApp(APP_PACKAGE);
    await browser.execute('mobile: clearApp', { appId: APP_PACKAGE });
    await browser.activateApp(APP_PACKAGE);
    await browser.pause(2000);
  } catch (error: any) {
    console.warn('clearAppData failed, trying alternative approach:', error.message);
    await restartApp();
  }
}

export async function restartApp(): Promise<void> {
  await browser.terminateApp(APP_PACKAGE);
  await browser.pause(500);
  await browser.activateApp(APP_PACKAGE);
  await browser.pause(1500);
}

export async function restartAndNavigateToSettingsPage(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('masterPassword');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
}

export async function restartAndNavigateToAppPreferencesPage(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('masterPassword');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
  await settings.tapAppPreferencesButton();
  await settings.verifyAppPreferencesPageDisplayed();
}

export async function restartAndNavigateToMasterPasswordPage(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('masterPassword');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
  await settings.tapMasterPasswordButton();
  await settings.verifyMasterPasswordPageDisplayed();
}

export async function restartAndNavigateToSettingsPageWithNewPassword(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('valid.complex');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
}

export async function restartAndNavigateToSettingsPageWithMasterPassword(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('masterPassword');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
  await settings.tapMasterPasswordButton();
  await settings.verifyMasterPasswordPageWithAllElementsDisplayed();
}

export async function restartAndNavigateToBlindPeeringPage(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('valid.complex');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
  await settings.tapBlindPeeringButton();
  await settings.verifyBlindPeeringPageWithAllElementsDisplayed();
}

export async function restartAndNavigateToYourDevicesPage(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('valid.complex');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
  await settings.tapOnYourDevicesButton();
  await settings.verifyYourDevicesPageWithAllElements();
}

export async function restartAndNavigateToAppVersionPage(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('valid.complex');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
  await settings.tapOnYourDevicesButton();
  await settings.verifyYourDevicesPageWithAllElements();
  await settings.tapOnAppVersionButton();
  await settings.verifyAppVersionPageWithAllElementsDisplayed();
}

export async function restartAndNavigateToReportAProblemPage(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('valid.complex');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
  await settings.tapOnYourDevicesButton();
  await settings.verifyYourDevicesPageWithAllElements();
  await settings.tapOnReportAProblemButton();
  await settings.verifyReportAProblemPageWithAllElementsDisplayed();
}

export async function restartAndNavigateToLanguagePage(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('valid.complex');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
  await settings.tapOnLanguageButton();
  await settings.verifyLanguagePageWithAllElements();
}

export async function restartAndNavigateToYourVaultsPage(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('valid.complex');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
  await settings.tapOnYourVaultsButton();
  await settings.verifyYourVaultsPageWithAllElements();
}

export async function restartAndNavigateToImportItemsPage(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('valid.complex');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
  await settings.tapOnYourVaultsButton();
  await settings.verifyYourVaultsPageWithAllElements();
}

export async function restartAndNavigateToExportItemsPage(): Promise<void> {
  await restartApp();
  const { home, settings, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('valid.complex');
  await signUp.tap('continueButton');
  await home.addItemButtonDisplayed();
  await home.tap('settingsTab');
  await settings.waitForDisplayed('settingsTitle', 20000);
  await settings.tapOnExportItemsButton();
  await settings.verifyVaultExportItemsPageWithAllElementsDisplayed();
}

export async function restartAndNavigateToHomePage(): Promise<void> {
  await restartApp();
  const { home, signUp } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('masterPassword');
  await signUp.tap('continueButton');
  await home.noItemSavedTitleDisplayed();;
}

export async function tapOnAddTopItemButton(): Promise<void> {
  const { home } = Pages;
  await home.tapOnAddTopItemButton();
}

export async function restartAndNavigateToCreateLoginItemPage(): Promise<void> {
  await restartApp();
  const { home, signUp, createLogin } = Pages;

  await signUp.verifyEnterMasterPasswordPageWithAllElements();
  await signUp.enterMasterPassword('masterPassword');
  await signUp.tap('continueButton');
  await home.noItemSavedTitleDisplayed();;
  await home.tapOnAddTopItemButton();
  await home.tapOnLoginsField();
  await createLogin.verifyCreateNewLoginItemPageDisplayed();
}

export async function addFileToCreateLoginItemPage(): Promise<void> {
  const { createLogin } = Pages;

  await createLogin.swipe('up');
  await createLogin.verifyFileAndPhotoFieldDisplayed();
  await createLogin.tapOnFileAndPhotoField();
  await createLogin.verifyFileAndPhotoFieldPopupWithAllElementsDisplayed();
  await createLogin.tapOnChooseFileButton();
  await createLogin.chooseDownloadsFolder();
  await createLogin.chooseFile('ownersManualFile');
  await createLogin.verifyOwnersManualFileDisplayedInAttachmentField();
  await createLogin.verifyDeleteAttachmentButtonDisplayed();
}

export async function addAnotherMessageToCreateLoginItemPage(): Promise<void> {
  const { createLogin } = Pages;

  await createLogin.swipe('up');
  await createLogin.verifyAddAnotherMessageButtonDisplayed();
  await createLogin.tapOnAddAnotherMessageButton();
  await createLogin.swipe('up');
  await createLogin.verifyNewHiddenMessageWithAllElementsDisplayed();
  await createLogin.verifyDeleteHiddenMessageButtonAppearsOnHiddenMessageField();
}
