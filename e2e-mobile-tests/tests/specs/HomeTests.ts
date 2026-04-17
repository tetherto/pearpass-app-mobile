import 'mocha';
import { browser } from '@wdio/globals';
import { Pages } from '@support/page-factory';
import { restartAndNavigateToHomeWithVault } from '@helpers/test-setup';
import {
  assertFolderChipVisibleOnCreateForm,
  assertTestFolderSelectedInFolderPopup,
  closeCreateFormToHome,
  createFolderThroughNoFolderDropdown,
  openAddFilePopupAndTapChooseFile,
  systemPickerNavigateToDownloads,
  systemPickerNavigateToDownloadsViaSettings,
} from '@helpers/create-flow-helpers';
import { TEST_PASSWORDS } from '@data/signUp.data';

const DEFAULT_PASSWORD = TEST_PASSWORDS.valid.complex;
const VAULT_NAME = 'Valeron';

// ============================================================
// HOME - GENERAL TAB (Independent tests with beforeEach)
// ============================================================

describe('Home Flow - General Tab', () => {
  
  beforeEach(async () => {
    await restartAndNavigateToHomeWithVault(VAULT_NAME, DEFAULT_PASSWORD);
  });

  it('[3067] User can tap on Home tab and appear on Home page', async () => {
    const { home } = Pages;
    await home.tapBottomNavHomeTab();
    await home.waitForHomePageLoaded();
  });

  it('[3068] Verify that search field with all elements is displayed on Home page', async () => {
    const { home } = Pages;
    await home.verifySearchFieldWithAllElementsVisible();
  });

  it('[368] Verify that categories (filters) with all elements are displayed on Home page', async () => {
    const { home } = Pages;
    await home.verifyAllCategoriesVisible();
    await home.verifyLoginsCategoryVisible();
    await home.verifyCreditCardsCategoryVisible();
    await home.verifyWifiCategoryVisible();
    await home.verifyRecoveryPhraseCategoryVisible();
    await home.verifyIdentitiesCategoryVisible();
    await home.verifyNotesCategoryVisible();
    await home.verifyCustomCategoryVisible();
  });

  it('[369] User can tap on Logins category and see Create a login button', async () => {
    const { home } = Pages;
    await home.tapLoginsCategory();
    await home.verifyCreateLoginButtonVisible();
  });

  it('[371] User can tap on Credit cards category and see Create a credit card button', async () => {
    const { home } = Pages;
    await home.tapCreditCardsCategory();
    await home.verifyCreateCreditCardButtonVisible();
  });

  it('[372] User can tap on Wifi category and see Create a wifi button', async () => {
    const { home } = Pages;
    await home.tapWifiCategory();
    await home.verifyCreateWifiPasswordButtonVisible();
  });

  it('[373] User can tap on Recovery phrase category and see Save a recovery phrase button', async () => {
    const { home } = Pages;
    await home.tapRecoveryPhraseCategory();
    await home.verifySaveRecoveryPhraseButtonVisible();
  });

  it('[370] User can tap on Identities category and see Create an identity button', async () => {
    const { home } = Pages;
    await home.tapIdentitiesCategory();
    await home.verifyCreateIdentityButtonVisible();
  });

  it('[374] User can tap on Notes category and see Create a note button', async () => {
    const { home } = Pages;
    await home.tapNotesCategory();
    await home.verifyCreateNoteButtonVisible();
  });

  it('[375] User can tap on Custom category and see Create a custom element button', async () => {
    const { home } = Pages;
    await home.tapCustomCategory();
    await home.verifyCreateCustomElementButtonVisible();
  });

  it('[376] User can tap on All category and see all items buttons', async () => {
    const { home } = Pages;
    await home.tapAllCategory();
    await home.verifyEmptyCollectionTextVisible();
    await home.verifyCreateLoginButtonVisible();
    await home.verifyCreateIdentityButtonVisible();
    await home.verifyCreateCreditCardButtonVisible();
    await home.verifyCreateWifiPasswordButtonVisible();
    await home.verifySaveRecoveryPhraseButtonVisible();
    await home.verifyCreateNoteButtonVisible();
    await home.verifyCreateCustomElementButtonVisible();
  });
});

// ============================================================
// HOME - CREATE ITEM BUTTON (Independent tests with beforeEach)
// ============================================================

describe('Home Flow - Create item button', () => {

  beforeEach(async () => {
    await restartAndNavigateToHomeWithVault(VAULT_NAME, DEFAULT_PASSWORD);
  });

  it('[3069] User can tap on Create item button and see Create item popup with all elements', async () => {
    const { home } = Pages;
    await home.tapCreateItemButton();
    await home.waitForCreateItemPopupVisible();
    await home.verifyLoginsFieldVisible();
    await home.verifyCreditCardsFieldVisible();
    await home.verifyWifiFieldVisible();
    await home.verifyRecoveryPhraseFieldVisible();
    await home.verifyIdentitiesFieldVisible();
    await home.verifyNotesFieldVisible();
    await home.verifyCustomFieldVisible();
    await home.verifyPasswordFieldVisible();
  });

  it('[384] User can tap on Login field and see Create a login page', async () => {
    const { home, createLogin } = Pages;
    await home.tapCreateItemButton();
    await home.waitForCreateItemPopupVisible();
    await home.tapLoginsField();
    await createLogin.waitForCreateLoginPageLoaded();
  });

  it('[386] User can tap on Credit card field and see Create a credit card page', async () => {
    const { home, createCreditCards } = Pages;
    await home.tapCreateItemButton();
    await home.waitForCreateItemPopupVisible();
    await home.tapCreditCardsField();
    await createCreditCards.waitForCreateCreditCardPageLoaded();
  });

  it('[387] User can tap on Wifi field and see Create a wifi page', async () => {
    const { home, createWifi } = Pages;
    await home.tapCreateItemButton();
    await home.waitForCreateItemPopupVisible();
    await home.tapWifiField();
    await createWifi.waitForCreateWifiPageLoaded();
  });

  it('[388] User can tap on Recovery phrase field and see Save a recovery phrase page', async () => {
    const { home, saveRecoveryPhrase } = Pages;
    await home.tapCreateItemButton();
    await home.waitForCreateItemPopupVisible();
    await home.tapRecoveryPhraseField();
    await saveRecoveryPhrase.waitForCreateRecoveryPhrasePageLoaded();
  });

  it('[385] User can tap on Identities field and see Create an identity page', async () => {
    const { home, createIdentity } = Pages;
    await home.tapCreateItemButton();
    await home.waitForCreateItemPopupVisible();
    await home.tapIdentitiesField();
    await createIdentity.waitForCreateIdentityPageLoaded();
  });

  it('[389] User can tap on Notes field and see Create a notes page', async () => {
    const { home, createNotes } = Pages;
    await home.tapCreateItemButton();
    await home.waitForCreateItemPopupVisible();
    await home.tapNotesField();
    await createNotes.waitForCreateNotesPageLoaded();
  });

  it('[390] User can tap on Custom field and see Create a custom element page', async () => {
    const { home, createCustomElement } = Pages;
    await home.tapCreateItemButton();
    await home.waitForCreateItemPopupVisible();
    await home.tapCustomElementField();
    await createCustomElement.waitForCreateCustomElementPageLoaded();
  });

  it('[391] User can tap on Password field and see Generate password popup', async () => {
    const { home, createLogin } = Pages;
    await home.tapCreateItemButton();
    await home.waitForCreateItemPopupVisible();
    await home.tapPasswordField();
    await createLogin.waitForGeneratePasswordPopupVisible();
  });
});

// ============================================================
// HOME - CREATE LOGIN FLOW (Sequential - creates login item)
// ============================================================

describe('Home Flow - Create a login flow', () => {

  before(async () => {
    await restartAndNavigateToHomeWithVault(VAULT_NAME, DEFAULT_PASSWORD);
  });

  it('[3070] User can tap on Create Login button and see Create a login page with all elements', async () => {
    const { home, createLogin } = Pages;
    await home.tapCreateLoginButton();
    await createLogin.waitForCreateLoginPageLoaded();
        await createLogin.verifyTitleFieldVisible();
        await createLogin.verifyEmailOrUsernameFieldVisible();
        await createLogin.verifyPasswordFieldVisible();
        await createLogin.verifyWebsiteFieldVisible();
        await createLogin.verifyFileFieldVisible();
        await createLogin.verifyNoteFieldVisible();
        await createLogin.verifyCustomFieldVisible();
        await createLogin.verifyNoFolderButtonVisible();
        await createLogin.verifySaveButtonVisible();
        await createLogin.verifyCloseButtonVisible();
    });

    it('[252] User can tap on No folder button and create new folder', async () => {
        const { createLogin, sidebar } = Pages;

        await createFolderThroughNoFolderDropdown(createLogin, sidebar, 'Test Folder');
        await assertTestFolderSelectedInFolderPopup(createLogin);
    });

    it('[3071] User can tap on Test folder button and unselect test folder', async () => {
        const { createLogin, home } = Pages;

        await createLogin.tapTestFolderButton();
        await createLogin.verifyTestFolderPopupVisible();
        await createLogin.tapOnTestFolderInPopup();
        await createLogin.verifyNoFolderButtonVisible();
        await createLogin.tapCloseButton();
        await home.waitForHomePageLoaded();
    });

    it('[3072] Verify that TestFolder was created at Sidebar Page', async () => {
        const { sidebar, home, createLogin } = Pages;
    
        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyTestFolder();
        await sidebar.closeSidebarPageBySwipe();
        await home.tapCreateLoginButton();  
        await createLogin.waitForCreateLoginPageLoaded();
    });

    it('[3073] Verify that if User not filled all fields and tap on Save button warning message is displayed', async () => {
        const { createLogin } = Pages;
        
        await createLogin.tapSaveButton();
        await createLogin.verifySaveButtonWarningMessageVisible();
    });

    it('[949] It is possible to close the screen by tapping on the "Cross" icon', async () => {
        const { createLogin, home } = Pages;

        await closeCreateFormToHome(createLogin, home);
    });

    it('[3074] User can tap on Title field and enter title', async () => {
        const { createLogin, home } = Pages;

        await home.tapCreateLoginButton();  
        await createLogin.waitForCreateLoginPageLoaded();
        await createLogin.tapTitleField();
        await createLogin.enterTextInFields('title');
        await createLogin.hideKeyboard();
        await createLogin.verifyEnteredTextInFields('title');
    });

    it('[3075] User can tap on Email or username field and enter email or username', async () => {
        const { createLogin } = Pages;

        await createLogin.tapEmailOrUsernameField();
        await createLogin.enterTextInFields('emailOrUsername');
        await createLogin.hideKeyboard();
        await createLogin.verifyEnteredTextInFields('emailOrUsername');
    });

    it('[250, 1166] User can tap on Password field and enter password', async () => {
        const { createLogin } = Pages;
        
        await createLogin.tapPasswordField();
        await createLogin.tapShowPasswordIconButton();
        await createLogin.enterTextInFields('password');
        await createLogin.hideKeyboard();
        await createLogin.tapShowPasswordIconButton();
        await createLogin.verifyEnteredTextInFields('password');
    });
    
    it('[3076] User can tap on Website field and enter website', async () => {
        const { createLogin } = Pages;
        
        await createLogin.tapWebsiteField();
        await createLogin.enterTextInFields('website');
        await createLogin.verifyEnteredTextInFields('website');
    });

    it('[946] User can tap on "Add new website field button" and see Add new website field', async () => {
        const { createLogin } = Pages;
        
        await createLogin.tapAddNewWebsiteFieldButton();
        await createLogin.tapAddNewWebsiteFieldButton();
        await createLogin.verifyAddNewWebsiteFieldVisible();
    });

    it('[947] User can delete last website field', async () => {
        const { createLogin } = Pages;
        
        await createLogin.tapDeleteLastWebsiteFieldButton();
        await createLogin.verifyNewWebsiteFieldNotVisible();
    });
    
    it('[3077] User can add file to File field', async () => {
        const { createLogin, settings } = Pages;

        await openAddFilePopupAndTapChooseFile(createLogin, () => createLogin.tapAddFileButton());
        await systemPickerNavigateToDownloadsViaSettings(settings);
        await createLogin.chooseOwnersManualFile();
        await createLogin.verifyNewFileFieldWithAllElementsVisible();
    });

    it('[3130] User can open last added file', async () => {
        const { createLogin } = Pages;

        await createLogin.tapNewFileFieldButton();
        await createLogin.verifySharedFilePopupTitleVisible();
        await createLogin.pressBack();
    });

    it('[3078] User can delete last added file', async () => {
        const { createLogin } = Pages;

        await createLogin.tapNewFileFieldDeleteButton();
        await createLogin.verifyNewFileFieldNotVisible();
    });
    
    it('[3079] User can tap on Note field and enter note', async () => {
        const { createLogin } = Pages;

        await createLogin.tapNoteField();
        await createLogin.enterTextInFields('note');
        await createLogin.hideKeyboard();
        await createLogin.verifyEnteredTextInFields('note');
    });

    it('[3080] User can tap on Custom field and see Create a custom element field with all elements', async () => {
        const { createLogin } = Pages;

        await createLogin.tapShowCustomFieldButton();
        await createLogin.swipeToUp();
        await createLogin.verifyAllElementsInShowCustomFieldPopupVisible();
    });

    it('[3081] User can add one more Note field', async () => {
        const { createLogin } = Pages;

        await createLogin.tapNewNoteFieldButton();
        await createLogin.verifyNewNoteFieldVisibleWithAllElements();
    });

    it('[3082] User can delete last added note field', async () => {
        const { createLogin } = Pages;

        await createLogin.tapNewNoteFieldDeleteButton();
        await createLogin.verifyNewNoteFieldNotVisible();
    });

    it('[237, 257] User can tap on Save button and verify that login was created', async () => {
        const { createLogin, home } = Pages;

        await createLogin.tapSaveButton();
        await home.verifyLoginCreatedOnHomePageVisible();
    });
});

// ============================================================
// HOME - CREATE CREDIT CARD FLOW (Sequential - creates credit card)
// ============================================================

describe('Home Flow - Create a credit card flow', () => {

  before(async () => {
    await restartAndNavigateToHomeWithVault(VAULT_NAME, DEFAULT_PASSWORD);
  });

  it('[860] User can tap on Create Credit Card button and see Create a credit card page with all elements', async () => {
    const { home, createCreditCards, createLogin } = Pages;
    await home.tapCreditCardsCategoryButton();
        await home.verifyCreateCreditCardButtonVisible();
        await home.tapCreateCreditCardButton();
        await createCreditCards.waitForCreateCreditCardPageLoaded();
        await createCreditCards.verifyTitleFieldVisible();
        await createCreditCards.verifyNameOnCardFieldVisible();
        await createCreditCards.verifyNumberOnCardFieldVisible();
        await createCreditCards.verifyExpiryDateFieldVisible();
        await createCreditCards.verifySecurityCodeFieldVisible();
        await createCreditCards.verifyPinCodeFieldVisible();
        await createCreditCards.swipeToUp();
        await createCreditCards.verifyFileFieldVisible();
        await createCreditCards.verifyNoteFieldVisible();
        await createCreditCards.verifyCustomFieldVisible();
        await createCreditCards.swipeToDown();
        await createLogin.verifyNoFolderButtonVisible();
        await createLogin.verifySaveButtonVisible();
        await createLogin.verifyCloseButtonVisible();
    });

    it('[1028] It is possible to close the screen by clicking on the "Cross" icon', async () => {
        const { home, createLogin, createCreditCards } = Pages;

        await createLogin.tapCloseButton();
        await home.waitForHomePageLoaded();
        await home.verifyCreateCreditCardButtonVisible();

        await home.tapCreateCreditCardButton();
        await createCreditCards.waitForCreateCreditCardPageLoaded();
    });

    it('[278] User can tap on No folder button and create new folder', async () => {
        const { createLogin, sidebar } = Pages;

        await createFolderThroughNoFolderDropdown(createLogin, sidebar, 'Test Folder');
        await assertTestFolderSelectedInFolderPopup(createLogin);
    });

    it('[3083] User can tap on Test folder button and unselect test folder at Create a credit card page', async () => {
        const { createLogin, home } = Pages;

        await createLogin.tapTestFolderButton();
        await createLogin.verifyTestFolderPopupVisible();
        await createLogin.tapOnTestFolderInPopup();
        await createLogin.verifyNoFolderButtonVisible();
        await createLogin.tapCloseButton();
        await home.waitForHomePageLoaded();
    });

    it('[3084] Verify that TestFolder was created at Sidebar Page after creating credit card at Create a credit card page', async () => {
        const { sidebar, home, createCreditCards } = Pages;

        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyTestFolder();
        await sidebar.closeSidebarPageBySwipe();
        await home.tapCreditCardsCategoryButton();
        await home.verifyCreateCreditCardButtonVisible();
        await home.tapCreateCreditCardButton();
        await createCreditCards.waitForCreateCreditCardPageLoaded();
    });

    it('[3074] User can tap on Title field and enter title', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapTitleField();
        await createCreditCards.enterTextInFields('title');
        await createCreditCards.hideKeyboard();
        await createCreditCards.verifyEnteredTextInFields('title');
    });

    it('[3085] User can tap on Name on card field and enter name on card', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapNameOnCardField();
        await createCreditCards.enterTextInFields('nameOnCard');
        await createCreditCards.hideKeyboard();
        await createCreditCards.verifyEnteredTextInFields('nameOnCard');
    });

    it('[3086] User can tap on Number on card field and enter number on card', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapNumberOnCardField();
        await createCreditCards.enterTextInFields('numberOnCard');
        await createCreditCards.hideKeyboard();
        await createCreditCards.verifyEnteredTextInFields('numberOnCard');
    });

    it('[3087] User can tap on Expiry date field and enter expiry date', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapExpiryDateField();
        await createCreditCards.enterTextInFields('expiryDate');
        await createCreditCards.hideKeyboard();
        await createCreditCards.verifyEnteredTextInFields('expiryDate');
    });

    it('[3088] User can tap on Security code field and enter security code', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapSecurityCodeField();
        await createCreditCards.enterTextInFields('securityCode');
        await createCreditCards.hideKeyboard();
        await createCreditCards.tapShowSecurityCodeIconButton();
        await createCreditCards.verifyEnteredTextInFields('securityCode');
    });

    it('[277] User can tap on Pin code field and enter pin code', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapPinCodeField();
        await createCreditCards.enterTextInFields('pinCode');
        await createCreditCards.hideKeyboard();
        await createCreditCards.tapShowPinCodeIconButton();
        await createCreditCards.verifyEnteredTextInFields('pinCode');
    });

    it('[1024] User can tap on File field and add file', async () => {
        const { createCreditCards, settings, createLogin } = Pages;
        
        await createCreditCards.swipeToUp();
        await openAddFilePopupAndTapChooseFile(createLogin, () => createCreditCards.tapAddFileButton());
        await systemPickerNavigateToDownloadsViaSettings(settings);
        await createCreditCards.chooseTestDocumentFile();
        await browser.pause(2000);
        await createCreditCards.swipeToUp();
        await createCreditCards.verifyNewFileFieldWithAllElementsVisible();
    });

    it('[3078] User can delete last added file', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.swipeToUp();
        await createCreditCards.tapNewFileFieldDeleteButton();
        await createCreditCards.verifyNewFileFieldNotVisible();
    });

    it('[1209] User can not add large file to File field', async () => {
        const { createCreditCards, settings, createLogin } = Pages;
        
        await createCreditCards.swipeToUp();
        await openAddFilePopupAndTapChooseFile(createLogin, () => createCreditCards.tapAddFileButton());
        await systemPickerNavigateToDownloadsViaSettings(settings);
        await createCreditCards.chooseLargeTestFile();
        await createCreditCards.verifyWarningMessageVisible();
    });

    it('[1024] User can tap on File field and add file again', async () => {
        const { createCreditCards, settings, createLogin } = Pages;
        
        await createLogin.tapChooseFileButton();
        await systemPickerNavigateToDownloadsViaSettings(settings);
        await createCreditCards.chooseTestDocumentFile();
        await browser.pause(2000);
        await createCreditCards.swipeToUp();
        await createCreditCards.verifyNewFileFieldWithAllElementsVisible();
    });

    it('[3079] User can tap on Note field and enter note', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapNoteField();
        await createCreditCards.enterTextInFields('note');
        await createCreditCards.hideKeyboard();
        await createCreditCards.verifyEnteredTextInFields('note');
    });

    it('[3080] User can tap on Custom field and see Create a custom element field with all elements', async () => {
        const { createCreditCards } = Pages;
        await createCreditCards.swipeToUp();
        await createCreditCards.tapShowCustomFieldButton();
        await createCreditCards.swipeToUp();
        await createCreditCards.verifyAllElementsInShowCustomFieldPopupVisible();
    });

    it('[273] User can tap on Save button and verify that credit card was created', async () => {
        const { createLogin, home } = Pages;

        await createLogin.tapSaveButton();
        await home.verifyCreditCardCreatedOnHomePageVisible();
    });
});

// ============================================================
// HOME - CREATE WIFI PASSWORD FLOW (Sequential - creates wifi)
// ============================================================

describe('Home Flow - Create a Wifi password flow', () => {

  before(async () => {
    await restartAndNavigateToHomeWithVault(VAULT_NAME, DEFAULT_PASSWORD);
  });

  it('[3089] User can tap on Create Wifi Password button and see Create a wifi password page with all elements', async () => {
    const { home, createWifi, createLogin } = Pages;
    await home.tapWifiCategory();
        await home.verifyCreateWifiPasswordButtonVisible();
        await home.tapCreateWifiPasswordButton();
        await createWifi.waitForCreateWifiPageLoaded();
        await createWifi.verifyWifiNameFieldVisible();
        await createWifi.verifyWifiPasswordFieldVisible();
        await createWifi.verifyNoteFieldVisible();
        await createWifi.verifyCustomFieldVisible();
        await createLogin.verifyNoFolderButtonVisible();
        await createLogin.verifySaveButtonVisible();
        await createLogin.verifyCloseButtonVisible();
    });

    it('[1045] It is possible to close the screen by tapping on the "Cross" icon', async () => {
        const { home, createLogin, createWifi } = Pages;

        await createLogin.tapCloseButton();
        await home.waitForHomePageLoaded();
        await home.verifyCreateWifiPasswordButtonVisible();

        await home.tapCreateWifiPasswordButton();
        await createWifi.waitForCreateWifiPageLoaded();
    });

    it('[292] User can tap on No folder button and create new folder', async () => {
        const { createLogin, sidebar } = Pages;

        await createFolderThroughNoFolderDropdown(createLogin, sidebar, 'Test Folder');
        await assertTestFolderSelectedInFolderPopup(createLogin);
    });

    it('[3090] User can tap on Test folder button and unselect test folder at Create a wifi password page', async () => {
        const { createLogin, home } = Pages;

        await createLogin.tapTestFolderButton();
        await createLogin.verifyTestFolderPopupVisible();
        await createLogin.tapOnTestFolderInPopup();
        await createLogin.verifyNoFolderButtonVisible();
        await createLogin.tapCloseButton();
        await home.waitForHomePageLoaded();
    });

    it('[3091] Verify that TestFolder was created at Sidebar Page after creating at Create a wifi password page', async () => {
        const { sidebar, home, createWifi } = Pages;

        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyTestFolder();
        await sidebar.closeSidebarPageBySwipe();
        await home.verifyCreateWifiPasswordButtonVisible();
        await home.tapCreateWifiPasswordButton();
        await createWifi.waitForCreateWifiPageLoaded();
    });

    it('[3092] User can tap on Wifi name field and enter wifi name', async () => {
        const { createWifi } = Pages;

        await createWifi.tapWifiNameField();
        await createWifi.enterTextInFields('wifiName');
        await createWifi.verifyEnteredTextInFields('wifiName');
    });

    it('[291] User can tap on Wifi password field and enter wifi password', async () => {
        const { createWifi } = Pages;
        
        await createWifi.tapWifiPasswordField();
        await createWifi.enterTextInFields('wifiPassword');
        await createWifi.hideKeyboard();
        await createWifi.tapShowPasswordIconButton();
        await createWifi.verifyEnteredTextInFields('wifiPassword');
    });

    it('[3079] User can tap on Note field and enter note', async () => {
        const { createWifi } = Pages;
        
        await createWifi.tapNoteField();
        await createWifi.enterTextInFields('note');
        await createWifi.hideKeyboard();
        await createWifi.verifyEnteredTextInFields('note');
    });

    it('[3080] User can tap on Custom field and see Create a custom element field with all elements', async () => {
        const { createWifi } = Pages;
        await createWifi.tapShowCustomFieldButton();
        await createWifi.verifyAllElementsInShowCustomFieldPopupVisible();
    });

    it('[1042] User can add one more Note field and add note', async () => {
        const { createWifi } = Pages;
        await createWifi.addNewNoteFieldButton();
        await createWifi.verifyNewNoteFieldVisibleWithAllElements();
        await createWifi.enterTextInFields('newNote');
        await createWifi.hideKeyboard();
        await createWifi.verifyEnteredTextInFields('newNote');
    });

    it('[3082] User can delete last added note field', async () => {
        const { createWifi } = Pages;
        await createWifi.tapNewNoteFieldDeleteButton();
        await createWifi.verifyNewNoteFieldNotVisible();
    });

    it('[287] User can tap on Save button and verify that login was created', async () => {
        const { createLogin, home } = Pages;
        await createLogin.tapSaveButton();
        await home.verifyWifiCreatedOnHomePageVisible();
    });
});

// ============================================================
// HOME - CREATE RECOVERY PHRASE FLOW (Sequential)
// ============================================================

describe('Home Flow - Create a recovery phrase flow', () => {

  before(async () => {
    await restartAndNavigateToHomeWithVault(VAULT_NAME, DEFAULT_PASSWORD);
  });

  it('[3093] User can tap on Create Recovery Phrase button and see Create a recovery phrase page with all elements', async () => {
    const { home, saveRecoveryPhrase, createLogin } = Pages;
    await home.tapRecoveryPhraseCategory();
        await home.verifySaveRecoveryPhraseButtonVisible();
        await home.tapSaveRecoveryPhraseButton();
        await saveRecoveryPhrase.waitForCreateRecoveryPhrasePageLoaded();
        await saveRecoveryPhrase.verifyApplicationNameFieldVisible();
        await saveRecoveryPhrase.verifyRecoveryPhraseFieldVisible();
        await saveRecoveryPhrase.verifyNoteFieldVisible();
        await saveRecoveryPhrase.verifyCustomFieldVisible();
        await createLogin.verifySaveButtonVisible();
        await createLogin.verifyCloseButtonVisible();
        await createLogin.verifyNoFolderButtonVisible();
    });

    it('[1053] It is possible to close the screen by clicking on the "Cross" icon', async () => {
        const { home, createLogin, saveRecoveryPhrase } = Pages;
        await createLogin.tapCloseButton();
        await home.waitForHomePageLoaded();
        await home.verifySaveRecoveryPhraseButtonVisible();
        await home.tapSaveRecoveryPhraseButton();
        await saveRecoveryPhrase.waitForCreateRecoveryPhrasePageLoaded();
    });

    it('[306] User can tap on No folder button and create new folder at Create a recovery phrase page', async () => {
        const { createLogin, sidebar } = Pages;

        await createFolderThroughNoFolderDropdown(createLogin, sidebar, 'Test Folder');
        await assertTestFolderSelectedInFolderPopup(createLogin);
    });

    it('[3094] User can tap on Test folder button and unselect test folder at Create a recovery phrase page', async () => {
        const { createLogin, home } = Pages;

        await createLogin.tapTestFolderButton();
        await createLogin.verifyTestFolderPopupVisible();
        await createLogin.tapOnTestFolderInPopup();
        await createLogin.verifyNoFolderButtonVisible();
        await createLogin.tapCloseButton();
        await home.waitForHomePageLoaded();
    });

    it('[3095] Verify that TestFolder was created at Sidebar Page after creating at Create a recovery phrase page', async () => {
        const { sidebar, home, saveRecoveryPhrase } = Pages;

        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyTestFolder();
        await sidebar.closeSidebarPageBySwipe();
        await home.verifySaveRecoveryPhraseButtonVisible();
        await home.tapSaveRecoveryPhraseButton();
        await saveRecoveryPhrase.waitForCreateRecoveryPhrasePageLoaded();
    });

    it('[3096] User can tap on Application name field and enter application name', async () => {
        const { saveRecoveryPhrase } = Pages;
        await saveRecoveryPhrase.tapApplicationNameField();
        await saveRecoveryPhrase.enterTextInFields('applicationName');
        await saveRecoveryPhrase.hideKeyboard();
        await saveRecoveryPhrase.verifyEnteredTextInFields('applicationName');
    });

    it('[3097] User can tap on Paste from clipboard button and verify that warning message is visible', async () => {
        const { saveRecoveryPhrase } = Pages;
        await saveRecoveryPhrase.tapPasteFromClipboardButton();
        await saveRecoveryPhrase.verifyPasteFromClipboardWarningMessageVisible();
    });

    it('[3098] User can tap on Note field and enter note at Create a recovery phrase page', async () => {
        const { saveRecoveryPhrase } = Pages;
        await saveRecoveryPhrase.tapNoteField();
        await saveRecoveryPhrase.enterTextInFields('note');
        await saveRecoveryPhrase.hideKeyboard();
        await saveRecoveryPhrase.verifyEnteredTextInFields('note');
        await saveRecoveryPhrase.copyNoteFieldContentToClipboard();
    });

    it('[3099] Verify that 12 words radio button is chosen by default and random words toggle is off', async () => {
        const { saveRecoveryPhrase } = Pages;
        await saveRecoveryPhrase.verifyTwelveWordsRadioButtonChosen();
        await saveRecoveryPhrase.verifyTwentyFourWordsRadioButtonUnchosen();
        await saveRecoveryPhrase.verifyRandomWordsToggleOff();
    });

    it('[3100] User can tap on Paste from clipboard button and verify that recovery phrase is pasted', async () => {
        const { saveRecoveryPhrase } = Pages;

        await saveRecoveryPhrase.tapPasteFromClipboardButton();
        await saveRecoveryPhrase.verifyRecoveryPhrasePastedToastMessageVisible();
    });

    it('[866, 303] Verify that all pasted recovery phrases are visible and correct', async () => {
        const { saveRecoveryPhrase } = Pages;

        await saveRecoveryPhrase.verifyFirstPastedRecoveryPhraseVisible();
        await saveRecoveryPhrase.verifySecondPastedRecoveryPhraseVisible();
        await saveRecoveryPhrase.verifyThirdPastedRecoveryPhraseVisible();
        await saveRecoveryPhrase.verifyFourthPastedRecoveryPhraseVisible();
        await saveRecoveryPhrase.verifyFifthPastedRecoveryPhraseVisible();
        await saveRecoveryPhrase.verifySixthPastedRecoveryPhraseVisible();
        await saveRecoveryPhrase.verifySeventhPastedRecoveryPhraseVisible();
        await saveRecoveryPhrase.verifyEighthPastedRecoveryPhraseVisible();
        await saveRecoveryPhrase.verifyNinthPastedRecoveryPhraseVisible();
        await saveRecoveryPhrase.verifyTenthPastedRecoveryPhraseVisible();
        await saveRecoveryPhrase.verifyEleventhPastedRecoveryPhraseVisible();
        await saveRecoveryPhrase.verifyTwelfthPastedRecoveryPhraseVisible();
    });

    it('[1050] User can add one more Note field and add note', async () => {
        const { saveRecoveryPhrase } = Pages;

        await saveRecoveryPhrase.swipeToUp();
        await saveRecoveryPhrase.tapShowCustomFieldButton();
        await saveRecoveryPhrase.addNewNoteFieldButton();
        await saveRecoveryPhrase.verifyNewNoteFieldVisibleWithAllElements();
        await saveRecoveryPhrase.enterTextInFields('newNote');
        await saveRecoveryPhrase.hideKeyboard();
        await saveRecoveryPhrase.verifyEnteredTextInFields('newNote');
    });

    it('[3082] User can delete last added note field', async () => {
        const { saveRecoveryPhrase } = Pages;

        await saveRecoveryPhrase.swipeToUp();
        await saveRecoveryPhrase.tapNewNoteFieldDeleteButton();
        await saveRecoveryPhrase.verifyNewNoteFieldNotVisible();
    });

    it('[301] User can tap on Save button and verify that recovery phrase was saved', async () => {
        const { home, createLogin } = Pages;

        await createLogin.tapSaveButton();
        await home.verifyRecoveryPhraseCreatedOnHomePageVisible();
    });
});

// ============================================================
// HOME - CREATE NOTES FLOW (Sequential - creates note)
// ============================================================

describe('Home Flow - Create notes flow', () => {

  before(async () => {
    await restartAndNavigateToHomeWithVault(VAULT_NAME, DEFAULT_PASSWORD);
  });

  it('[3101] User can tap on Create Notes button and see Create a notes page with all elements', async () => {
    const { home, createNotes, createLogin } = Pages;
    await home.tapNotesCategory();
        await home.verifyCreateNoteButtonVisible();
        await home.tapCreateNoteButton();
        await createNotes.waitForCreateNotesPageLoaded();
        await createNotes.verifyTitleFieldVisible();
        await createNotes.verifyWriteNoteFieldVisible();
        await createNotes.verifyAddFileFieldVisible();
        await createNotes.verifyCustomFieldVisible();
        await createLogin.verifySaveButtonVisible();
        await createLogin.verifyCloseButtonVisible();
        await createLogin.verifyNoFolderButtonVisible();
    });

    it('[1062] User can tap on Close button and verify that create notes page is not visible', async () => {
        const { home, createLogin, createNotes } = Pages;

        await createLogin.tapCloseButton();
        await home.waitForHomePageLoaded();
        await home.verifyCreateNoteButtonVisible();

        await home.tapCreateNoteButton();
        await createNotes.waitForCreateNotesPageLoaded();
    });

    it('[322] Item is moved to the folder selected in "Folder" dropdown', async () => {
        const { createLogin, sidebar } = Pages;

        await createFolderThroughNoFolderDropdown(createLogin, sidebar, 'Test Folder');
        await assertTestFolderSelectedInFolderPopup(createLogin);
    });

    it('[3074] User can tap on Title field and enter title', async () => {
        const { createNotes } = Pages;

        await createNotes.tapTitleField();
        await createNotes.enterTextInFields('title');
        await createNotes.hideKeyboard();
        await createNotes.verifyEnteredTextInFields('title');
    });

    it('[3102] User can tap on Write note field and enter write note at Create a notes page', async () => {
        const { createNotes } = Pages;

        await createNotes.tapWriteNoteField();
        await createNotes.enterTextInFields('writeNote');
        await createNotes.hideKeyboard();
        await createNotes.verifyEnteredTextInFields('writeNote');
    });

    it('[3103] User can tap on Add file button and add file at Create a notes page', async () => {
        const { createNotes, createLogin, settings } = Pages;

        await openAddFilePopupAndTapChooseFile(createLogin, () => createNotes.tapAddFileButton());
        await systemPickerNavigateToDownloadsViaSettings(settings);
        await createLogin.chooseOwnersManualFile();
        await createNotes.verifyNewFileFieldWithAllElementsVisible();
    });

    it('[3081] User can add one more Note field', async () => {
        const { createNotes } = Pages;

        await createNotes.tapCustomField();
        await createNotes.verifyNewElementInCustomFieldVisible();
        await createNotes.tapAddCommentButton();
        await createNotes.verifyNewNoteFieldVisibleWithAllElements();
    });

    it('[3082] User can delete last added note field', async () => {
        const { createNotes } = Pages;
        await createNotes.tapNewNoteFieldDeleteButton();
        await createNotes.verifyNewNoteFieldNotVisible();
    });

    it('[318] User can tap on Save button and verify that note was created', async () => {
        const { home, createLogin } = Pages;

        await createLogin.tapSaveButton();
        await home.verifyNoteCreatedOnHomePageVisible();
    });
});

// ============================================================
// HOME - CREATE CUSTOM ELEMENT FLOW (Sequential)
// ============================================================

describe('Home Flow - Create a custom element flow', () => {

  before(async () => {
    await restartAndNavigateToHomeWithVault(VAULT_NAME, DEFAULT_PASSWORD);
  });

  it('[3104] User can tap on Create Custom Element button and see Create a custom element page with all elements', async () => {
    const { home, createCustomElement, createLogin } = Pages;
    await home.tapCustomCategory();
        await home.verifyCreateCustomElementButtonVisible();
        await home.tapCreateCustomElementButton();
        await createCustomElement.waitForCreateCustomElementPageLoaded();
        await createCustomElement.verifyTitleFieldVisible();
        await createCustomElement.verifyFileFieldVisible();
        await createCustomElement.verifyCustomElementFieldVisible();
        await createLogin.verifySaveButtonVisible();
        await createLogin.verifyCloseButtonVisible();
        await createLogin.verifyNoFolderButtonVisible();
    });

    it('[336] Item is moved to the folder selected in "Folder" dropdown', async () => {
        const { createLogin, sidebar } = Pages;

        await createFolderThroughNoFolderDropdown(createLogin, sidebar, 'Test Folder');
        await assertFolderChipVisibleOnCreateForm(createLogin, 'test');
    });

    it('[3105] User can tap on Title field and enter title at Create a custom element page', async () => {
        const { createCustomElement } = Pages;
        await createCustomElement.tapTitleField();
        await createCustomElement.enterTextInFields('title');
        await createCustomElement.hideKeyboard();
        await createCustomElement.verifyEnteredTextInFields('title');
    });

    it('[3106] User can tap on File field and add file at Create a custom element page', async () => {
        const { createCustomElement, createLogin, settings } = Pages;
        await openAddFilePopupAndTapChooseFile(createLogin, () => createCustomElement.tapAddFileButton());
        await systemPickerNavigateToDownloadsViaSettings(settings);
        await createLogin.chooseOwnersManualFile();
        await createCustomElement.verifyNewFileFieldWithAllElementsVisible();
    });

    it('[3081] User can add one more Note field', async () => {
        const { createCustomElement } = Pages;

        await createCustomElement.tapCreateCustomFieldButton();
        await createCustomElement.verifyNewElementInCustomFieldVisible();
        await createCustomElement.tapAddCommentButton();
        await createCustomElement.verifyNewNoteFieldVisibleWithAllElements();
    });

    it('[3082] User can delete last added note field', async () => {
        const { createCustomElement } = Pages;
        await createCustomElement.tapNewNoteFieldDeleteButton();
        await createCustomElement.verifyNewNoteFieldNotVisible();
    });

    it('[332] User can tap on Save button and verify that custom element was created', async () => {
        const { home, createLogin } = Pages;

        await createLogin.tapSaveButton();
        await home.verifyCustomElementCreatedOnHomePageVisible();
    });
});

// ============================================================
// HOME - CREATE IDENTITY FLOW (Sequential - creates identity)
// ============================================================

describe('Home Flow - Create an identity flow', () => {

  before(async () => {
    await restartAndNavigateToHomeWithVault(VAULT_NAME, DEFAULT_PASSWORD);
  });

  it('[3107] User can tap on Create Identity button and see Create an identity page with all elements', async () => {
    const { home, createIdentity, createLogin } = Pages;
    await home.tapIdentitiesCategory();
        await home.verifyCreateIdentityButtonVisible();
        await home.tapCreateIdentityButton();
        await createIdentity.waitForCreateIdentityPageLoaded();
        await createIdentity.verifyTitleFieldVisible();
        await createIdentity.showOrHideFields('hide', 'personalInformation');
        await createIdentity.showOrHideFields('hide', 'detailOfAddress');
        await createIdentity.verifyFileFieldVisible();
        await createIdentity.verifyNoteFieldVisible();
        await createIdentity.verifyCustomFieldVisible();
        await createLogin.verifySaveButtonVisible();
        await createLogin.verifyCloseButtonVisible();
        await createLogin.verifyNoFolderButtonVisible();
    });

    it('[1022] User can tap on Close button and verify that create notes page is not visible', async () => {
        const { home, createLogin, createIdentity } = Pages;

        await createLogin.tapCloseButton();
        await home.waitForHomePageLoaded();
        await home.verifyCreateIdentityButtonVisible();
        await home.tapCreateIdentityButton();
        await createIdentity.waitForCreateIdentityPageLoaded();
        await createIdentity.showOrHideFields('hide', 'personalInformation');
        await createIdentity.showOrHideFields('hide', 'detailOfAddress');
    });

    it('[264] Item is moved to the folder selected in "Folder" dropdown at Create an identity page', async () => {
        const { createLogin, sidebar } = Pages;

        await createFolderThroughNoFolderDropdown(createLogin, sidebar, 'Test Folder');
        await assertFolderChipVisibleOnCreateForm(createLogin, 'test');
    });

    it('[3108] User can tap on Title field and enter title at Create an identity page', async () => {
        const { createIdentity } = Pages;

        await createIdentity.tapTitleField();
        await createIdentity.enterTextInFields('title');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('title');
    });

    it('[3109] User can show and hide Personal information field', async () => {
        const { createIdentity } = Pages;

        await createIdentity.showOrHideFields('show', 'personalInformation');
        await createIdentity.verifyFullNameFieldInPersonalInformationFieldVisible();
        await createIdentity.showOrHideFields('hide', 'personalInformation');
        await createIdentity.verifyFullNameFieldInPersonalInformationFieldNotVisible();
    });

    it('[3110] User can tap on Personal information field and see Personal information field with all elements', async () => {
        const { createIdentity } = Pages;

        await createIdentity.showOrHideFields('show', 'personalInformation');
        await createIdentity.verifyAllElementsInFullNameFieldInPersonalInformationFieldVisible();
        await createIdentity.verifyAllElementsInEmailFieldInPersonalInformationFieldVisible();
        await createIdentity.verifyAllElementsInPhoneNumberFieldInPersonalInformationFieldVisible();
    });

    it('[3111] User can fill all fields in Personal information field and then hide it', async () => {
        const { createIdentity } = Pages;

        await createIdentity.enterTextInFields('fullName');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('fullName');
        await createIdentity.enterTextInFields('email');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('email');
        await createIdentity.enterTextInFields('phoneNumber');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('phoneNumber');
        await createIdentity.showOrHideFields('hide', 'personalInformation');
    });

    it('[3112] User can show and hide Detail of address field', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.showOrHideFields('show', 'detailOfAddress');
        await createIdentity.verifyAddressFieldVisible();
        await createIdentity.showOrHideFields('hide', 'detailOfAddress');
        await createIdentity.verifyAddressFieldNotVisible();
    });

    it('[3113] User can tap on Detail of address field and see Detail of address field with all elements', async () => {
        const { createIdentity } = Pages;

        await createIdentity.showOrHideFields('show', 'detailOfAddress');
        await createIdentity.verifyAllElementsInAddressFieldInDetailOfAddressFieldVisible();
        await createIdentity.verifyAllElementsInZipFieldInDetailOfAddressFieldVisible();
        await createIdentity.verifyAllElementsInCityFieldInDetailOfAddressFieldVisible();
        await createIdentity.verifyAllElementsInRegionFieldInDetailOfAddressFieldVisible();
        await createIdentity.verifyAllElementsInCountryFieldInDetailOfAddressFieldVisible();
    });

    it('[3114] User can fill all fields in Detail of address field and then hide it', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.enterTextInFields('address');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('address');
        await createIdentity.enterTextInFields('zip');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('zip');
        await createIdentity.enterTextInFields('city');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('city');
        await createIdentity.enterTextInFields('region');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('region');
        await createIdentity.enterTextInFields('country');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('country');
        await createIdentity.showOrHideFields('hide', 'detailOfAddress');
    });

    it('[3115] User can show and hide Passport field', async () => {
        const { createIdentity } = Pages;

        await createIdentity.showOrHideFields('show', 'passport');
        await createIdentity.verifyPassportFullNameFieldVisible();
        await createIdentity.showOrHideFields('hide', 'passport');
        await createIdentity.verifyPassportFullNameFieldNotVisible();
    });

    it('[3116] User can tap on Passport field and see Passport field with all elements at Create an identity page', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.showOrHideFields('show', 'passport');
        await createIdentity.verifyAllElementsInPassportFullNameFieldInPassportFieldVisible();
        await createIdentity.verifyAllElementsInPassportNumberFieldInPassportFieldVisible();
        await createIdentity.verifyAllElementsInPassportIssuingCountryFieldInPassportFieldVisible();
        await createIdentity.verifyAllElementsInPassportDateOfIssueFieldInPassportFieldVisible();
        await createIdentity.verifyAllElementsInPassportExpiryDateFieldInPassportFieldVisible();
        await createIdentity.verifyAllElementsInPassportNationalityFieldInPassportFieldVisible();
        await createIdentity.swipeToUp();
        await createIdentity.verifyAllElementsInPassportDateOfBirthFieldInPassportFieldVisible();
        await createIdentity.verifyAllElementsInPassportGenderFieldInPassportFieldVisible();
        await createIdentity.swipeToUp();
        await createIdentity.verifyAllElementsInPassportPictureFieldInPassportFieldVisible();
        await createIdentity.swipeToDown();

    });

    it('[3117] User can fill all fields in Passport field at Create an identity page', async () => {
        const { createIdentity } = Pages;

        await createIdentity.enterTextInFields('passportFullName');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('passportFullName');
        await createIdentity.enterTextInFields('passportNumber');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('passportNumber');
        await createIdentity.enterTextInFields('passportIssuingCountry');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('passportIssuingCountry');
        await createIdentity.enterTextInFields('passportDateOfIssue');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('passportDateOfIssue');
        await createIdentity.enterTextInFields('passportExpiryDate');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('passportExpiryDate');
        await createIdentity.enterTextInFields('passportNationality');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('passportNationality');
        await createIdentity.swipeToUp();
        await createIdentity.enterTextInFields('passportDateOfBirth');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('passportDateOfBirth');
        await createIdentity.enterTextInFields('passportGender');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('passportGender');
    });

    it('[3118] User can add passport picture', async () => {
        const { createIdentity } = Pages;
        await browser.pause(1000);
        await createIdentity.tapPassportPicturePlusButton();
        const allowPicturePopupShown = await createIdentity.verifyAllowPicturePopupVisible();
        if (allowPicturePopupShown) {
          await createIdentity.tapWhileUsingAppButton();
        }
        await createIdentity.verifyUploadPicturePopupVisible();
        await createIdentity.verifyAllElementsInUploadPicturePopupVisible();
        await createIdentity.tapChooseFromLibraryButton();
        await createIdentity.verifyPassportPictureInAlbumVisible();
        await createIdentity.tapPassportPictureInAlbum();
        await browser.pause(3000);
        await createIdentity.verifyPassportPictureInPassportPictureFieldVisible();
    });

    it('[3119] User can tap on Passport picture in passport picture field and verify that picture is visible', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.tapPassportPictureInPassportPictureField();
        await createIdentity.verifyPassportPicturePreviewPageWithAllElementsVisible();
        await createIdentity.pressBack();
        await createIdentity.swipeToDown();
        await createIdentity.showOrHideFields('hide', 'passport');
    });

    it('[3120] User can show and hide Identity card field', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.showOrHideFields('show', 'identityCard');
        await createIdentity.verifyIdentityCardIdNumberFieldVisible();
        await createIdentity.showOrHideFields('hide', 'identityCard');
        await createIdentity.verifyIdentityCardIdNumberFieldNotVisible();
    });

    it('[3121] User can tap on Identity card field and see Identity card field with all elements', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.showOrHideFields('show', 'identityCard');
        await createIdentity.verifyAllElementsInIdentityCardIdNumberFieldInIdentityCardFieldVisible();
        await createIdentity.verifyAllElementsInIdentityCardCreationDateFieldInIdentityCardFieldVisible();
        await createIdentity.verifyAllElementsInIdentityCardExpiryDateFieldInIdentityCardFieldVisible();
        await createIdentity.verifyAllElementsInIdentityCardIssuingCountryFieldInIdentityCardFieldVisible();
        await createIdentity.verifyAllElementsInIdentityCardPictureFieldInIdentityCardFieldVisible();
    });

    it('[3122] User can fill all fields in Identity card field', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.enterTextInFields('identityCardNumber');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('identityCardNumber');
        await createIdentity.enterTextInFields('identityCardCreationDate');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('identityCardCreationDate');
        await createIdentity.enterTextInFields('identityCardExpiryDate');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('identityCardExpiryDate');
        await createIdentity.enterTextInFields('identityCardIssuingCountry');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('identityCardIssuingCountry');
    });

    it('[3123] User can add identity card picture', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.tapIdentityCardPicturePlusButton();
        await createIdentity.verifyUploadPicturePopupVisible();
        await createIdentity.verifyAllElementsInUploadPicturePopupVisible();
        await createIdentity.tapChooseFromLibraryButton();
        await createIdentity.verifyIdentityCardPictureInAlbumVisible();
        await createIdentity.tapIdentityCardPictureInAlbum();
        await createIdentity.verifyIdentityCardPictureInIdentityCardPictureFieldVisible();
    });

    it('[3124] User can tap on Identity card picture in identity card picture field and verify that picture is visible', async () => {
        const { createIdentity } = Pages;

        await createIdentity.tapIdentityCardPictureInIdentityCardPictureField();
        await createIdentity.verifyIdentityCardPicturePreviewPageWithAllElementsVisible();
        await createIdentity.pressBack();
        await createIdentity.showOrHideFields('hide', 'identityCard');
    });

    it('[3125] User can show and hide Driving license field', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.showOrHideFields('show', 'drivingLicense');
        await createIdentity.verifyDrivingLicenseIdNumberFieldVisible();
        await createIdentity.showOrHideFields('hide', 'drivingLicense');
        await createIdentity.verifyDrivingLicenseIdNumberFieldNotVisible();
    });

    it('[3126] User can tap on Driving license field and see Driving license field with all elements', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.showOrHideFields('show', 'drivingLicense');
        await createIdentity.verifyAllElementsInDrivingLicenseIdNumberFieldInDrivingLicenseFieldVisible();
        await createIdentity.verifyAllElementsInDrivingLicenseCreationDateFieldInDrivingLicenseFieldVisible();
        await createIdentity.verifyAllElementsInDrivingLicenseExpiryDateFieldInDrivingLicenseFieldVisible();
        await createIdentity.verifyAllElementsInDrivingLicenseIssuingCountryFieldInDrivingLicenseFieldVisible();
        await createIdentity.swipeToUp();
        await createIdentity.verifyAllElementsInDrivingLicensePictureFieldInDrivingLicenseFieldVisible();
    });

    it('[3127] User can fill all fields in Driving license field', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.enterTextInFields('drivingLicenseIdNumber');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('drivingLicenseIdNumber');
        await createIdentity.enterTextInFields('drivingLicenseCreationDate');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('drivingLicenseCreationDate');
        await createIdentity.enterTextInFields('drivingLicenseExpiryDate');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('drivingLicenseExpiryDate');
        await createIdentity.enterTextInFields('drivingLicenseIssuingCountry');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('drivingLicenseIssuingCountry');
    });

    it('[3128] User can add driving license picture', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.tapDrivingLicensePicturePlusButton();
        await createIdentity.verifyUploadPicturePopupVisible();
        await createIdentity.verifyAllElementsInUploadPicturePopupVisible();
        await createIdentity.tapChooseFromLibraryButton();
        await createIdentity.verifyDrivingLicensePictureInAlbumVisible();
        await createIdentity.tapDrivingLicensePictureInAlbum();
        await createIdentity.verifyDrivingLicensePictureInDrivingLicensePictureFieldVisible();
    });

    it('[3129] User can tap on Driving license picture in driving license picture field and verify that picture is visible', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.tapDrivingLicensePictureInDrivingLicensePictureField();
        await createIdentity.verifyDrivingLicensePicturePreviewPageWithAllElementsVisible();
        await createIdentity.pressBack();
        await createIdentity.showOrHideFields('hide', 'drivingLicense');
    });

    it('[3077] User can add file to File field', async () => {
        const { createIdentity, settings, createLogin } = Pages;
        
        await createIdentity.verifyFileFieldVisible();
        await createIdentity.verifyAllElementsInFileFieldVisible();
        await openAddFilePopupAndTapChooseFile(createLogin, () => createIdentity.tapAddFileButton());
        await systemPickerNavigateToDownloads(settings, () => createIdentity.tapDownloadsButton());
        await createLogin.chooseOwnersManualFile();
        await createIdentity.verifyNewFileFieldWithAllElementsVisible();
    });

    it('[3130] User can open last added file', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.tapNewFileFieldButton();
        await createIdentity.verifySharedFilePopupTitleVisible();
        await createIdentity.verifySharedFilePopupTextVisible();
        await createIdentity.pressBack();
    });

    it('[3131] User can verify Note field with all elements', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.verifyNoteFieldVisible();
        await createIdentity.verifyAllElementsInNoteFieldVisible();
    });

    it('[3132] User can add note to Note field', async () => {
        const { createIdentity } = Pages;
        
        await createIdentity.enterTextInFields('note');
        await createIdentity.hideKeyboard();
        await createIdentity.verifyEnteredTextInFields('note');
    });

    it('[3081] User can add one more Note field', async () => {
        const { createIdentity } = Pages;

        await createIdentity.tapCreateCustomFieldButton();
        await createIdentity.verifyNewElementInCustomFieldVisible();
        await createIdentity.tapAddCommentButton();
        await createIdentity.verifyNewNoteFieldVisibleWithAllElements();
    });

    it('[3082] User can delete last added note field', async () => {
        const { createIdentity } = Pages;

        await createIdentity.tapNewNoteFieldDeleteButton();
        await createIdentity.verifyNewNoteFieldNotVisible();
    });

    it('[260] User can tap on Save button and verify that Identity was created', async () => {
        const { home, createLogin } = Pages;

        await createLogin.tapSaveButton();
        await home.verifyIdentityCreatedOnHomePageVisible();
    });
});
