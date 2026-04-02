import 'mocha';
import { Pages } from '@support/page-factory';


//     describe('Home Flow - General Tab', () => {

//     it('[PAS-XXX] User can tap on Home tab and appear on Home page', async () => {
//       const { home } = Pages;

//       await home.tapBottomNavHomeTab();  
//       await home.waitForHomePageLoaded();
//     });

//     it('[PAS-XXX] Verify that search field with all elements is displayed on Home page', async () => {
//         const { home } = Pages;

//         await home.verifySearchFieldWithAllElementsVisible();
//     });

//     it('[PAS-XXX] Verify that categories (filters) with all elements are displayed on Home page', async () => {
//         const { home } = Pages;

//         await home.verifyAllCategoriesVisible();
//         await home.verifyLoginsCategoryVisible();
//         await home.verifyCreditCardsCategoryVisible();
//         await home.verifyWifiCategoryVisible();
//         await home.verifyRecoveryPhraseCategoryVisible();
//         await home.verifyIdentitiesCategoryVisible();
//         await home.verifyNotesCategoryVisible();
//         await home.verifyCustomCategoryVisible();
//     });

//     it('[PAS-XXX] User can tap on Logins category and see Create a login button', async () => {
//         const { home } = Pages;
        
//         await home.tapLoginsCategory();
//         await home.verifyCreateLoginButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on Credit cards category and see Create a credit card button', async () => {
//         const { home } = Pages;
        
//         await home.tapCreditCardsCategory();
//         await home.verifyCreateCreditCardButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on Wifi category and see Create a wifi button', async () => {
//         const { home } = Pages;
        
//         await home.tapWifiCategory();
//         await home.verifyCreateWifiPasswordButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on Recovery phrase category and see Save a recovery phrase button', async () => {
//         const { home } = Pages;
        
//         await home.tapRecoveryPhraseCategory();
//         await home.verifySaveRecoveryPhraseButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on Identities category and see Create an identity button', async () => {
//         const { home } = Pages;
        
//         await home.tapIdentitiesCategory();
//         await home.verifyCreateIdentityButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on Notes category and see Create a note button', async () => {
//         const { home } = Pages;
        
//         await home.tapNotesCategory();
//         await home.verifyCreateNoteButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on Custom category and see Create a custom element button', async () => {
//         const { home } = Pages;
        
//         await home.tapCustomCategory();
//         await home.verifyCreateCustomElementButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on All category and see all items buttons', async () => {
//         const { home } = Pages;

//         await home.tapAllCategory();
//         await home.verifyEmptyCollectionTextVisible();
//         await home.verifyCreateLoginButtonVisible();
//         await home.verifyCreateIdentityButtonVisible();
//         await home.verifyCreateCreditCardButtonVisible();
//         await home.verifyCreateWifiPasswordButtonVisible();
//         await home.verifySaveRecoveryPhraseButtonVisible();
//         await home.verifyCreateNoteButtonVisible();
//         await home.verifyCreateCustomElementButtonVisible();
//     });
// });

//     describe('Home Flow - Create item button', () => {

//     it('[PAS-XXX] User can tap on Create item button and see Create item popup with all elements', async () => {
//         const { home } = Pages;

//         await home.tapCreateItemButton();
//         await home.waitForCreateItemPopupVisible();
//         await home.verifyLoginsFieldVisible();
//         await home.verifyCreditCardsFieldVisible();
//         await home.verifyWifiFieldVisible();
//         await home.verifyRecoveryPhraseFieldVisible();
//         await home.verifyIdentitiesFieldVisible();
//         await home.verifyNotesFieldVisible();
//         await home.verifyCustomFieldVisible();
//         await home.verifyPasswordFieldVisible();
//     });

//     it('[PAS-XXX] User can tap on Login field and see Create a login page', async () => {
//         const { home, createLogin } = Pages;
        
//         await home.tapLoginsField();
//         await createLogin.waitForCreateLoginPageLoaded();
//         await createLogin.tapCloseButton();
//         await home.waitForHomePageLoaded();
//     });

//     it('[PAS-XXX] User can tap on Credit card field and see Create a credit card page', async () => {
//         const { home, createCreditCards, createLogin } = Pages;

//         await home.tapCreateItemButton();
//         await home.waitForCreateItemPopupVisible();
//         await home.tapCreditCardsField();
//         await createCreditCards.waitForCreateCreditCardPageLoaded();
//         await createLogin.tapCloseButton();
//         await home.waitForHomePageLoaded();
//     });

//     it('[PAS-XXX] User can tap on Wifi field and see Create a wifi page', async () => {
//         const { home, createWifi, createLogin } = Pages;

//         await home.tapCreateItemButton();
//         await home.waitForCreateItemPopupVisible();
//         await home.tapWifiField();
//         await createWifi.waitForCreateWifiPageLoaded();
//         await createLogin.tapCloseButton();
//         await home.waitForHomePageLoaded();
//     });

//     it('[PAS-XXX] User can tap on Recovery phrase field and see Save a recovery phrase page', async () => {
//         const { home, saveRecoveryPhrase, createLogin } = Pages;

//         await home.tapCreateItemButton();
//         await home.waitForCreateItemPopupVisible();
//         await home.tapRecoveryPhraseField();
//         await saveRecoveryPhrase.waitForCreateRecoveryPhrasePageLoaded();
//         await createLogin.tapCloseButton();
//         await home.waitForHomePageLoaded();
//     });

//     it('[PAS-XXX] User can tap on Identities field and see Create an identity page', async () => {
//         const { home, createIdentity, createLogin } = Pages;

//         await home.tapCreateItemButton();
//         await home.waitForCreateItemPopupVisible();
//         await home.tapIdentitiesField();
//         await createIdentity.waitForCreateIdentityPageLoaded();
//         await createLogin.tapCloseButton();
//         await home.waitForHomePageLoaded();
//     });

//     it('[PAS-XXX] User can tap on Notes field and see Create a notes page', async () => {
//         const { home, createNotes, createLogin } = Pages;
        
//         await home.tapCreateItemButton();
//         await home.waitForCreateItemPopupVisible();
//         await home.tapNotesField();
//         await createNotes.waitForCreateNotesPageLoaded();
//         await createLogin.tapCloseButton();
//         await home.waitForHomePageLoaded();
//     });
    
//     it('[PAS-XXX] User can tap on Custom field and see Create a custom element page', async () => {
//         const { home, createCustomElement, createLogin } = Pages;

//         await home.tapCreateItemButton();
//         await home.waitForCreateItemPopupVisible();
//         await home.tapCustomElementField();
//         await createCustomElement.waitForCreateCustomElementPageLoaded();
//         await createLogin.tapCloseButton();
//         await home.waitForHomePageLoaded();
//     });

//     it('[PAS-XXX] User can tap on Password field and see Generate password popup', async () => {
//         const { home, createLogin } = Pages;
        
//         await home.tapCreateItemButton();
//         await home.waitForCreateItemPopupVisible();
//         await home.tapPasswordField();
//         await createLogin.waitForGeneratePasswordPopupVisible();
//         await createLogin.tapCopyAndCloseButton();
//         await home.waitForHomePageLoaded();
//     });
// });

// describe('Home Flow - Create a login flow', () => {

//     it('[PAS-XXX] User can tap on Create Login button and see Create a login page with all elements', async () => {
//         const { home, createLogin } = Pages;

//         await home.tapCreateLoginButton();  
//         await createLogin.waitForCreateLoginPageLoaded();
//         await createLogin.verifyTitleFieldVisible();
//         await createLogin.verifyEmailOrUsernameFieldVisible();
//         await createLogin.verifyPasswordFieldVisible();
//         await createLogin.verifyWebsiteFieldVisible();
//         await createLogin.verifyFileFieldVisible();
//         await createLogin.verifyNoteFieldVisible();
//         await createLogin.verifyCustomFieldVisible();
//         await createLogin.verifyNoFolderButtonVisible();
//         await createLogin.verifySaveButtonVisible();
//         await createLogin.verifyCloseButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on No folder button and create new folder', async () => {
//         const { createLogin, sidebar } = Pages;

//         await createLogin.tapNoFolderButton();
//         await createLogin.verifyNoFolderButtonPopupVisible();
//         await createLogin.verifyAllElementsInPopupVisible();
//         await createLogin.tapCreateNewButton();
//         await sidebar.verifyCreateNewFolderPageFull();
//         await sidebar.enterFolderTitle('TestFolder');
//         await sidebar.tapCreateNewFolderPageButton();

//         await createLogin.verifyTestFolderButtonVisible();
//         await createLogin.tapTestFolderButton();
//         await createLogin.verifyTestFolderPopupVisible();
//         await createLogin.verifyAllElementsInTestFolderPopupVisible();
//         await createLogin.verifyTestFolderSelected();
//         await createLogin.tapTestFolderButton();
//     });

//     it('[PAS-XXX] User can tap on Test folder button and unselect test folder', async () => {
//         const { createLogin, home } = Pages;

//         await createLogin.tapTestFolderButton();
//         await createLogin.verifyTestFolderPopupVisible();
//         await createLogin.tapOnTestFolderInPopup();
//         await createLogin.verifyNoFolderButtonVisible();
//         await createLogin.tapCloseButton();
//         await home.waitForHomePageLoaded();
//     });

//     it('[PAS-XXX] Verify that TestFolder was created at Sidebar Page', async () => {
//         const { sidebar, home, createLogin } = Pages;
    
//         await home.tapHomeLogoLock();
//         await sidebar.waitForLoaded();
//         await sidebar.verifyTestFolder();
//         await sidebar.closeSidebarPageBySwipe();
//         await home.tapCreateLoginButton();  
//         await createLogin.waitForCreateLoginPageLoaded();
//     });

//     it('[PAS-XXX] Verify that if User not filled all fields and tap on Save button warning message is displayed', async () => {
//         const { createLogin } = Pages;
        
//         await createLogin.tapSaveButton();
//         await createLogin.verifySaveButtonWarningMessageVisible();
//     });

//     it('[PAS-XXX] User can tap on Title field and enter title', async () => {
//         const { createLogin } = Pages;

//         await createLogin.tapTitleField();
//         await createLogin.enterTextInFields('title');
//         await createLogin.verifyEnteredTextInFields('title');
//     });

//     it('[PAS-XXX] User can tap on Email or username field and enter email or username', async () => {
//         const { createLogin } = Pages;

//         await createLogin.tapEmailOrUsernameField();
//         await createLogin.enterTextInFields('emailOrUsername');
//         await createLogin.verifyEnteredTextInFields('emailOrUsername');
//     });

//     it('[PAS-XXX] User can tap on Password field and enter password', async () => {
//         const { createLogin } = Pages;
        
//         await createLogin.tapPasswordField();
//         await createLogin.enterTextInFields('password');
//         await createLogin.tapShowPasswordIconButton();
//         await createLogin.tapShowPasswordIconButton();
//         await createLogin.verifyEnteredTextInFields('password');
//     });
    
//     it('[PAS-XXX] User can tap on Website field and enter website', async () => {
//         const { createLogin } = Pages;
        
//         await createLogin.tapWebsiteField();
//         await createLogin.enterTextInFields('website');
//         await createLogin.verifyEnteredTextInFields('website');
//     });

//     it('[PAS-XXX] User can tap on "Add new website field button" and see Add new website field', async () => {
//         const { createLogin } = Pages;
        
//         await createLogin.tapAddNewWebsiteFieldButton();
//         await createLogin.tapAddNewWebsiteFieldButton();
//         await createLogin.verifyAddNewWebsiteFieldVisible();
//     });

//     it('[PAS-XXX] User can delete last website field', async () => {
//         const { createLogin } = Pages;
        
//         await createLogin.tapDeleteLastWebsiteFieldButton();
//         await createLogin.verifyNewWebsiteFieldNotVisible();
//     });
    
//     it('[PAS-XXX] User can add file to File field', async () => {
//         const { createLogin, settings } = Pages;
        
//         await createLogin.tapAddFileButton();
//         await createLogin.verifyAddFilePopupVisible();
//         await createLogin.verifyAllElementsInAddFilePopupVisible();
//         await createLogin.tapChooseFileButton();
//         await settings.tapMenuButton();
//         await settings.tapDownloadsButton();
//         await settings.verifyDownloadsFolderTitleDisplayed();
//         await createLogin.chooseOwnersManualFile();
//         await createLogin.verifyNewFileFieldWithAllElementsVisible();
//     });

//     it('[PAS-XXX] User can open last added file', async () => {
//         const { createLogin } = Pages;

//         await createLogin.tapNewFileFieldButton();
//         await createLogin.verifySharedFilePopupTitleVisible();
//         await createLogin.pressBack();
//     });

//     it('[PAS-XXX] User can delete last added file', async () => {
//         const { createLogin } = Pages;

//         await createLogin.tapNewFileFieldDeleteButton();
//         await createLogin.verifyNewFileFieldNotVisible();
//     });

//     it('[PAS-XXX] User can add photo/video to File field', async () => {
//         const { createLogin } = Pages;
        
//         await createLogin.tapAddFileButton();
//         await createLogin.verifyAddFilePopupVisible();
//         await createLogin.verifyAllElementsInAddFilePopupVisible();
//         await createLogin.tapChoosePhotoVideoButton();

        
//     });

//     it('[PAS-XXX] User can delete last added photo/video', async () => {
//         const { createLogin } = Pages;

//         await createLogin.tapNewFileFieldDeleteButton();
//         await createLogin.verifyNewFileFieldNotVisible();
//     });
    
//     it('[PAS-XXX] User can tap on Note field and enter note', async () => {
//         const { createLogin } = Pages;

//         await createLogin.tapNoteField();
//         await createLogin.enterTextInFields('note');
//         await createLogin.verifyEnteredTextInFields('note');
//         await createLogin.tapNoteField();
//     });

//     it('[PAS-XXX] User can tap on Custom field and see Create a custom element field with all elements', async () => {
//         const { createLogin } = Pages;

//         await createLogin.tapShowCustomFieldButton();
//         await createLogin.swipeToUp();
//         await createLogin.verifyAllElementsInShowCustomFieldPopupVisible();
//     });

//     it('[PAS-XXX] User can add one more Note field', async () => {
//         const { createLogin } = Pages;

//         await createLogin.tapNewNoteFieldButton();
//         await createLogin.verifyNewNoteFieldVisibleWithAllElements();
//     });

//     it('[PAS-XXX] User can delete last added note field', async () => {
//         const { createLogin } = Pages;

//         await createLogin.tapNewNoteFieldDeleteButton();
//         await createLogin.verifyNewNoteFieldNotVisible();
//     });

//     it('[PAS-XXX] User can tap on Save button and verify that login was created', async () => {
//         const { createLogin, home } = Pages;

//         await createLogin.tapSaveButton();
//         await home.verifyLoginCreatedOnHomePageVisible();
//     });
// });

describe('Home Flow - Create a credit card flow', () => {

    it('[PAS-XXX] User can tap on Create Credit Card button and see Create a credit card page with all elements', async () => {
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

    it('[PAS-XXX] User can tap on Title field and enter title', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapTitleField();
        await createCreditCards.enterTextInFields('title');
        await createCreditCards.hideKeyboard();
        await createCreditCards.verifyEnteredTextInFields('title');
    });

    it('[PAS-XXX] User can tap on Name on card field and enter name on card', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapNameOnCardField();
        await createCreditCards.enterTextInFields('nameOnCard');
        await createCreditCards.hideKeyboard();
        await createCreditCards.verifyEnteredTextInFields('nameOnCard');
    });

    it('[PAS-XXX] User can tap on Number on card field and enter number on card', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapNumberOnCardField();
        await createCreditCards.enterTextInFields('numberOnCard');
        await createCreditCards.hideKeyboard();
        await createCreditCards.verifyEnteredTextInFields('numberOnCard');
    });

    it('[PAS-XXX] User can tap on Expiry date field and enter expiry date', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapExpiryDateField();
        await createCreditCards.enterTextInFields('expiryDate');
        await createCreditCards.hideKeyboard();
        await createCreditCards.verifyEnteredTextInFields('expiryDate');
    });

    it('[PAS-XXX] User can tap on Security code field and enter security code', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapSecurityCodeField();
        await createCreditCards.enterTextInFields('securityCode');
        await createCreditCards.hideKeyboard();
        await createCreditCards.tapShowSecurityCodeIconButton();
        await createCreditCards.verifyEnteredTextInFields('securityCode');
    });

    it('[PAS-XXX] User can tap on Pin code field and enter pin code', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapPinCodeField();
        await createCreditCards.enterTextInFields('pinCode');
        await createCreditCards.hideKeyboard();
        await createCreditCards.tapShowPinCodeIconButton();
        await createCreditCards.verifyEnteredTextInFields('pinCode');
    });

    it('[PAS-XXX] User can tap on File field and add file', async () => {
        const { createCreditCards, settings, createLogin } = Pages;
        
        await createCreditCards.swipeToUp();
        await createCreditCards.tapAddFileButton();
        await createLogin.verifyAddFilePopupVisible();
        await createLogin.verifyAllElementsInAddFilePopupVisible();
        await createLogin.tapChooseFileButton();
        await settings.tapMenuButton();
        await settings.tapDownloadsButton();
        await settings.verifyDownloadsFolderTitleDisplayed();
        await createCreditCards.chooseTestDocumentFile();
        await createCreditCards.swipeToUp();
        await createCreditCards.verifyNewFileFieldWithAllElementsVisible();
    });

    it('[PAS-XXX] User can delete last added file', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.swipeToUp();
        await createCreditCards.tapNewFileFieldDeleteButton();
        await createCreditCards.verifyNewFileFieldNotVisible();
    });

    it('[PAS-XXX] User can not add large file to File field', async () => {
        const { createCreditCards, settings, createLogin } = Pages;
        
        await createCreditCards.swipeToUp();
        await createCreditCards.tapAddFileButton();
        await createLogin.verifyAddFilePopupVisible();
        await createLogin.verifyAllElementsInAddFilePopupVisible();
        await createLogin.tapChooseFileButton();
        await settings.tapMenuButton();
        await settings.tapDownloadsButton();
        await settings.verifyDownloadsFolderTitleDisplayed();
        await createCreditCards.chooseLargeTestFile();
        await createCreditCards.verifyWarningMessageVisible();
    });

    it('[PAS-XXX] User can tap on File field and add file again', async () => {
        const { createCreditCards, settings, createLogin } = Pages;
        
        await createLogin.tapChooseFileButton();
        await settings.tapMenuButton();
        await settings.tapDownloadsButton();
        await settings.verifyDownloadsFolderTitleDisplayed();
        await createCreditCards.chooseTestDocumentFile();
        await createCreditCards.verifyNewFileFieldWithAllElementsVisible();
    });

    it('[PAS-XXX] User can tap on Note field and enter note', async () => {
        const { createCreditCards } = Pages;
        
        await createCreditCards.tapNoteField();
        await createCreditCards.enterTextInFields('note');
        await createCreditCards.hideKeyboard();
        await createCreditCards.verifyEnteredTextInFields('note');
    });

    it('[PAS-XXX] User can tap on Custom field and see Create a custom element field with all elements', async () => {
        const { createCreditCards } = Pages;
        await createCreditCards.swipeToUp();
        await createCreditCards.tapShowCustomFieldButton();
        await createCreditCards.swipeToUp();
        await createCreditCards.verifyAllElementsInShowCustomFieldPopupVisible();
    });

    it('[PAS-XXX] User can tap on Save button and verify that login was created', async () => {
        const { createLogin, home } = Pages;

        await createLogin.tapSaveButton();
        await home.verifyCreditCardCreatedOnHomePageVisible();
    });
});

// describe('Home Flow - Create a Wifi password flow', () => {

//     it('[PAS-XXX] User can tap on Create Wifi Password button and see Create a wifi password page with all elements', async () => {
//         const { home, createWifi, createLogin } = Pages;

//         await home.tapWifiCategory();
//         await home.verifyCreateWifiPasswordButtonVisible();
//         await home.tapCreateWifiPasswordButton();
//         await createWifi.waitForCreateWifiPageLoaded
//         await createWifi.verifyWifiNameFieldVisible();
//         await createWifi.verifyWifiPasswordFieldVisible();
//         await createWifi.verifyNoteFieldVisible();
//         await createWifi.verifyCustomFieldVisible();
//         await createLogin.verifyNoFolderButtonVisible();
//         await createLogin.verifySaveButtonVisible();
//         await createLogin.verifyCloseButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on Wifi name field and enter wifi name', async () => {
//         const { createWifi } = Pages;
        
//         await createWifi.tapWifiNameField();
//         await createWifi.enterTextInFields('wifiName');
//         await createWifi.verifyEnteredTextInFields('wifiName');
//     });

//     it('[PAS-XXX] User can tap on Wifi password field and enter wifi password', async () => {
//         const { createWifi } = Pages;
        
//         await createWifi.tapWifiPasswordField();
//         await createWifi.enterTextInFields('wifiPassword');
//         await createWifi.tapShowPasswordIconButton();
//         await createWifi.verifyEnteredTextInFields('wifiPassword');
//     });

//     it('[PAS-XXX] User can tap on Note field and enter note', async () => {
//         const { createWifi } = Pages;
        
//         await createWifi.tapNoteField();
//         await createWifi.enterTextInFields('note');
//         await createWifi.verifyEnteredTextInFields('note');
//     });

//     it('[PAS-XXX] User can tap on Custom field and see Create a custom element field with all elements', async () => {
//         const { createWifi } = Pages;
//         await createWifi.tapShowCustomFieldButton();
//         await createWifi.verifyAllElementsInShowCustomFieldPopupVisible();
//     });

//     it('[PAS-XXX] User can add one more Note field and add note', async () => {
//         const { createWifi } = Pages;
//         await createWifi.addNewNoteFieldButton();
//         await createWifi.verifyNewNoteFieldVisibleWithAllElements();
//         await createWifi.enterTextInFields('note');
//         await createWifi.verifyEnteredTextInFields('note');
//     });

//     it('[PAS-XXX] User can delete last added note field', async () => {
//         const { createWifi } = Pages;
//         await createWifi.tapNewNoteFieldDeleteButton();
//         await createWifi.verifyNewNoteFieldNotVisible();
//     });

//     it('[PAS-XXX] User can tap on Save button and verify that login was created', async () => {
//         const { createLogin, home } = Pages;
//         await createLogin.tapSaveButton();
//         await home.verifyWifiCreatedOnHomePageVisible();
//     });
// });

// describe('Home Flow - Create a recovery phrase flow', () => {

//     it('[PAS-XXX] User can tap on Create Recovery Phrase button and see Create a recovery phrase page with all elements', async () => {
//         const { home, saveRecoveryPhrase, createLogin} = Pages;

//         await home.tapRecoveryPhraseCategory();
//         await home.verifySaveRecoveryPhraseButtonVisible();
//         await home.tapSaveRecoveryPhraseButton();
//         await saveRecoveryPhrase.waitForCreateRecoveryPhrasePageLoaded();
//         await saveRecoveryPhrase.verifyApplicationNameFieldVisible();
//         await saveRecoveryPhrase.verifyRecoveryPhraseFieldVisible();
//         await saveRecoveryPhrase.verifyNoteFieldVisible();
//         await saveRecoveryPhrase.verifyCustomFieldVisible();
//         await createLogin.verifySaveButtonVisible();
//         await createLogin.verifyCloseButtonVisible();
//         await createLogin.verifyNoFolderButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on Application name field and enter application name', async () => {
//         const { saveRecoveryPhrase } = Pages;
//         await saveRecoveryPhrase.tapApplicationNameField();
//         await saveRecoveryPhrase.enterTextInFields('applicationName');
//         await saveRecoveryPhrase.verifyEnteredTextInFields('applicationName');
//     });

//     it('[PAS-XXX] User can tap on Paste from clipboard button and verify that warning message is visible', async () => {
//         const { saveRecoveryPhrase } = Pages;
//         await saveRecoveryPhrase.tapPasteFromClipboardButton();
//         await saveRecoveryPhrase.verifyPasteFromClipboardWarningMessageVisible();
//     });

//     it('[PAS-XXX] User can tap on Note field and enter note', async () => {
//         const { saveRecoveryPhrase } = Pages;
//         await saveRecoveryPhrase.tapNoteField();
//         await saveRecoveryPhrase.enterTextInFields('note');
//         await saveRecoveryPhrase.verifyEnteredTextInFields('note');
//         await saveRecoveryPhrase.copyNoteFieldContentToClipboard();
//     });

//     // it('[PAS-XXX] Verify that 12 words radio button is chosen by default and random words toggle is off', async () => {
//     //     const { saveRecoveryPhrase } = Pages;
//     //     await saveRecoveryPhrase.verifyTwelveWordsRadioButtonChosen();
//     //     await saveRecoveryPhrase.verifyTwentyFourWordsRadioButtonUnchosen();
//     //     await saveRecoveryPhrase.verifyRandomWordsToggleOff();
//     // });

//     // it('[PAS-XXX] User can choose 12 words or 24 words radio button and add random words toggle', async () => {
//     //     const { saveRecoveryPhrase } = Pages;

//     //     await saveRecoveryPhrase.verifyTwelveWordsRadioButtonChosen();
//     //     await saveRecoveryPhrase.verifyTwentyFourWordsRadioButtonUnchosen();
//     //     await saveRecoveryPhrase.verifyRandomWordsToggleOff();
//     //     await saveRecoveryPhrase.tapTwentyFourWordsRadioButton();
//     //     await saveRecoveryPhrase.verifyTwentyFourWordsRadioButtonChosen();
//     //     await saveRecoveryPhrase.verifyTwelveWordsRadioButtonUnchosen();
//     //     await saveRecoveryPhrase.tapRandomWordsToggle();
//     //     await saveRecoveryPhrase.verifyRandomWordsToggleOn();
//     //     await saveRecoveryPhrase.tapTwelveWordsRadioButton();
//     //     await saveRecoveryPhrase.verifyTwelveWordsRadioButtonChosen();
//     //     await saveRecoveryPhrase.verifyTwentyFourWordsRadioButtonUnchosen();
//     // });

//     it('[PAS-XXX] User can tap on Paste from clipboard button and verify that recovery phrase is pasted', async () => {
//         const { saveRecoveryPhrase } = Pages;

//         await saveRecoveryPhrase.tapPasteFromClipboardButton();
//         await saveRecoveryPhrase.verifyRecoveryPhrasePastedToastMessageVisible();
//         await saveRecoveryPhrase.verifyRecoveryPhrasePastedToastMessage2Visible();
//     });

//     it('[PAS-XXX] Verify that all pasted recovery phrases are visible and correct', async () => {
//         const { saveRecoveryPhrase } = Pages;

//         await saveRecoveryPhrase.verifyFirstPastedRecoveryPhraseVisible();
//         await saveRecoveryPhrase.verifySecondPastedRecoveryPhraseVisible();
//         await saveRecoveryPhrase.verifyThirdPastedRecoveryPhraseVisible();
//         await saveRecoveryPhrase.verifyFourthPastedRecoveryPhraseVisible();
//         await saveRecoveryPhrase.verifyFifthPastedRecoveryPhraseVisible();
//         await saveRecoveryPhrase.verifySixthPastedRecoveryPhraseVisible();
//         await saveRecoveryPhrase.verifySeventhPastedRecoveryPhraseVisible();
//         await saveRecoveryPhrase.verifyEighthPastedRecoveryPhraseVisible();
//         await saveRecoveryPhrase.verifyNinthPastedRecoveryPhraseVisible();
//         await saveRecoveryPhrase.verifyTenthPastedRecoveryPhraseVisible();
//         await saveRecoveryPhrase.verifyEleventhPastedRecoveryPhraseVisible();
//         await saveRecoveryPhrase.verifyTwelfthPastedRecoveryPhraseVisible();
//     });

//     it('[PAS-XXX] User can tap on Save button and verify that recovery phrase was saved', async () => {
//         const { home, createLogin } = Pages;

//         await createLogin.tapSaveButton();
//         await home.verifyRecoveryPhraseCreatedOnHomePageVisible();
//     });
// });

// describe('Home Flow - Create notes flow', () => {

//     it('[PAS-XXX] User can tap on Create Notes button and see Create a notes page with all elements', async () => {
//         const { home, createNotes, createLogin } = Pages;

//         await home.tapNotesCategory();
//         await home.verifyCreateNoteButtonVisible();
//         await home.tapCreateNoteButton();
//         await createNotes.waitForCreateNotesPageLoaded();
//         await createNotes.verifyTitleFieldVisible();
//         await createNotes.verifyWriteNoteFieldVisible();
//         await createNotes.verifyAddFileFieldVisible();
//         await createNotes.verifyCustomFieldVisible();
//         await createLogin.verifySaveButtonVisible();
//         await createLogin.verifyCloseButtonVisible();
//         await createLogin.verifyNoFolderButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on Title field and enter title', async () => {
//         const { createNotes } = Pages;
//         await createNotes.tapTitleField();
//         await createNotes.enterTextInFields('title');
//         await createNotes.verifyEnteredTextInFields('title');
//     });

//     it('[PAS-XXX] User can tap on Write note field and enter write note', async () => {
//         const { createNotes } = Pages;

//         await createNotes.tapWriteNoteField();
//         await createNotes.enterTextInFields('writeNote');
//         await createNotes.verifyEnteredTextInFields('writeNote');
//     });

//     it('[PAS-XXX] User can tap on Add file button and add file', async () => {
//         const { createNotes, createLogin, settings } = Pages;

//         await createNotes.tapAddFileButton();
//         await createLogin.verifyAddFilePopupVisible();
//         await createLogin.verifyAllElementsInAddFilePopupVisible();
//         await createLogin.tapChooseFileButton();
//         await settings.tapMenuButton();
//         await settings.tapDownloadsButton();
//         await settings.verifyDownloadsFolderTitleDisplayed();
//         await createLogin.chooseOwnersManualFile();
//         await createNotes.verifyNewFileFieldWithAllElementsVisible();
//     });

//     it('[PAS-XXX] User can tap on Custom field and see Create a custom element field with all elements', async () => {
//         const { createNotes } = Pages;

//         await createNotes.tapCustomField();
//         await createNotes.verifyNewElementInCustomFieldVisible();
//     });

//     it('[PAS-XXX] User can tap on Save button and verify that note was created', async () => {
//         const { home, createLogin } = Pages;

//         await createLogin.tapSaveButton();
//         await home.verifyNoteCreatedOnHomePageVisible();
//     });
// });

// describe('Home Flow - Create a custom element flow', () => {

//     it('[PAS-XXX] User can tap on Create Custom Element button and see Create a custom element page with all elements', async () => {
//         const { home, createCustomElement, createLogin } = Pages;

//         await home.tapCustomCategory();
//         await home.verifyCreateCustomElementButtonVisible();
//         await home.tapCreateCustomElementButton();
//         await createCustomElement.waitForCreateCustomElementPageLoaded();
//         await createCustomElement.verifyTitleFieldVisible();
//         await createCustomElement.verifyFileFieldVisible();
//         await createCustomElement.verifyCustomElementFieldVisible();
//         await createLogin.verifySaveButtonVisible();
//         await createLogin.verifyCloseButtonVisible();
//         await createLogin.verifyNoFolderButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on Title field and enter title', async () => {
//         const { createCustomElement } = Pages;
//         await createCustomElement.tapTitleField();
//         await createCustomElement.enterTextInFields('title');
//         await createCustomElement.verifyEnteredTextInFields('title');
//     });

//     it('[PAS-XXX] User can tap on File field and add file', async () => {
//         const { createCustomElement, createLogin, settings } = Pages;
//         await createCustomElement.tapAddFileButton();
//         await createLogin.verifyAddFilePopupVisible();
//         await createLogin.verifyAllElementsInAddFilePopupVisible();
//         await createLogin.tapChooseFileButton();
//         await settings.tapMenuButton();
//         await settings.tapDownloadsButton();
//         await settings.verifyDownloadsFolderTitleDisplayed();
//         await createLogin.chooseOwnersManualFile();
//         await createCustomElement.verifyNewFileFieldWithAllElementsVisible();
//     });

//     it('[PAS-XXX] User can tap on Custom field and see Create a custom element field with all elements', async () => {
//         const { createCustomElement } = Pages;

//         await createCustomElement.tapCreateCustomFieldButton();
//         await createCustomElement.verifyNewElementInCustomFieldVisible();
//     });

//     it('[PAS-XXX] User can tap 5on Save button and verify that custom element was created', async () => {
//         const { home, createLogin } = Pages;

//         await createLogin.tapSaveButton();
//         await home.verifyCustomElementCreatedOnHomePageVisible();
//     });
// });

// describe('Home Flow - Create an identity flow', () => {

//     it('[PAS-XXX] User can tap on Create Identity button and see Create an identity page with all elements', async () => {
//         const { home, createIdentity, createLogin } = Pages;

//         await home.tapIdentitiesCategory();
//         await home.verifyCreateIdentityButtonVisible();
//         await home.tapCreateIdentityButton();
//         await createIdentity.waitForCreateIdentityPageLoaded();
//         await createIdentity.verifyTitleFieldVisible();
//         await createIdentity.showOrHideFields('hide', 'personalInformation');
//         await createIdentity.hideDetailOfAddressField();
//         await createIdentity.verifyPersonalInformationFieldVisible();
//         await createIdentity.verifyDetailOfAddressFieldVisible();
//         await createIdentity.verifyPassportFieldVisible();
//         await createIdentity.verifyIdentityCardFieldVisible();
//         await createIdentity.verifyDrivingLicenseFieldVisible();
//         await createIdentity.verifyFileFieldVisible();
//         await createIdentity.verifyNoteFieldVisible();
//         await createIdentity.verifyCustomFieldVisible();
//         await createLogin.verifySaveButtonVisible();
//         await createLogin.verifyCloseButtonVisible();
//         await createLogin.verifyNoFolderButtonVisible();
//     });

//     it('[PAS-XXX] User can tap on Title field and enter title', async () => {
//         const { createIdentity } = Pages;

//         await createIdentity.tapTitleField();
//         await createIdentity.enterTextInFields('title');
//         await createIdentity.verifyEnteredTextInFields('title');
//     });

//     it('[PAS-XXX] User can show and hide Personal information field', async () => {
//         const { createIdentity } = Pages;

//         await createIdentity.showOrHideFields('show', 'personalInformation');
//         await createIdentity.verifyFullNameFieldInPersonalInformationFieldVisible();
//         await createIdentity.showOrHideFields('hide', 'personalInformation');
//         await createIdentity.verifyFullNameFieldInPersonalInformationFieldNotVisible();

//     });

//     it('[PAS-XXX] User can tap on Personal information field and see Personal information field with all elements', async () => {
//         const { createIdentity } = Pages;

//         await createIdentity.showOrHideFields('show', 'personalInformation');
//         await createIdentity.verifyAllElementsInFullNameFieldInPersonalInformationFieldVisible();
//         await createIdentity.verifyAllElementsInEmailFieldInPersonalInformationFieldVisible();
//         await createIdentity.verifyAllElementsInPhoneNumberFieldInPersonalInformationFieldVisible();
//     });

//     it('[PAS-XXX] User can fill all fields in Personal information field and then hide it', async () => {
//         const { createIdentity } = Pages;

//         await createIdentity.enterTextInFields('fullName');
//         await createIdentity.verifyEnteredTextInFields('fullName');
//         await createIdentity.enterTextInFields('email');
//         await createIdentity.verifyEnteredTextInFields('email');
//         await createIdentity.enterTextInFields('phoneNumber');
//         await createIdentity.verifyEnteredTextInFields('phoneNumber');
//         await createIdentity.showOrHideFields('hide', 'personalInformation');
//     });

//     it('[PAS-XXX] User can show and hide Detail of address field', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.showOrHideFields('show', 'detailOfAddress');
//         await createIdentity.verifyAddressFieldVisible();
//         await createIdentity.showOrHideFields('hide', 'detailOfAddress');
//         await createIdentity.verifyAddressFieldNotVisible();
//     });

//     it('[PAS-XXX] User can tap on Detail of address field and see Detail of address field with all elements', async () => {
//         const { createIdentity } = Pages;

//         await createIdentity.showOrHideFields('show', 'detailOfAddress');
//         await createIdentity.verifyAllElementsInAddressFieldInDetailOfAddressFieldVisible();
//         await createIdentity.verifyAllElementsInZipFieldInDetailOfAddressFieldVisible();
//         await createIdentity.verifyAllElementsInCityFieldInDetailOfAddressFieldVisible();
//         await createIdentity.verifyAllElementsInRegionFieldInDetailOfAddressFieldVisible();
//         await createIdentity.verifyAllElementsInCountryFieldInDetailOfAddressFieldVisible();
//     });

//     it('[PAS-XXX] User can fill all fields in Detail of address field and then hide it', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.enterTextInFields('address');
//         await createIdentity.verifyEnteredTextInFields('address');
//         await createIdentity.enterTextInFields('zip');
//         await createIdentity.verifyEnteredTextInFields('zip');
//         await createIdentity.enterTextInFields('city');
//         await createIdentity.verifyEnteredTextInFields('city');
//         await createIdentity.enterTextInFields('region');
//         await createIdentity.verifyEnteredTextInFields('region');
//         await createIdentity.enterTextInFields('country');
//         await createIdentity.verifyEnteredTextInFields('country');
//         await createIdentity.showOrHideFields('hide', 'detailOfAddress');
//     });

//     it('[PAS-XXX] User can show and hide Passport field', async () => {
//         const { createIdentity } = Pages;

//         await createIdentity.showOrHideFields('show', 'passport');
//         await createIdentity.verifyPassportFullNameFieldVisible();
//         await createIdentity.showOrHideFields('hide', 'passport');
//         await createIdentity.verifyPassportFullNameFieldNotVisible();
//     });

//     it('[PAS-XXX] User can tap on Passport field and see Passport field with all elements', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.showOrHideFields('show', 'passport');
//         await createIdentity.verifyAllElementsInPassportFullNameFieldInPassportFieldVisible();
//         await createIdentity.verifyAllElementsInPassportNumberFieldInPassportFieldVisible();
//         await createIdentity.verifyAllElementsInPassportIssuingCountryFieldInPassportFieldVisible();
//         await createIdentity.verifyAllElementsInPassportDateOfIssueFieldInPassportFieldVisible();
//         await createIdentity.verifyAllElementsInPassportExpiryDateFieldInPassportFieldVisible();
//         await createIdentity.verifyAllElementsInPassportNationalityFieldInPassportFieldVisible();
//         await createIdentity.swipeToUp();
//         await createIdentity.verifyAllElementsInPassportDateOfBirthFieldInPassportFieldVisible();
//         await createIdentity.verifyAllElementsInPassportGenderFieldInPassportFieldVisible();
//         await createIdentity.verifyAllElementsInPassportPictureFieldInPassportFieldVisible();
//         await createIdentity.swipeToDown();
//     });

//     it('[PAS-XXX] User can fill all fields in Passport field', async () => {
//         const { createIdentity } = Pages;

//         await createIdentity.enterTextInFields('passportFullName');
//         await createIdentity.verifyEnteredTextInFields('passportFullName');
//         await createIdentity.enterTextInFields('passportNumber');
//         await createIdentity.verifyEnteredTextInFields('passportNumber');
//         await createIdentity.enterTextInFields('passportIssuingCountry');
//         await createIdentity.verifyEnteredTextInFields('passportIssuingCountry');
//         await createIdentity.enterTextInFields('passportDateOfIssue');
//         await createIdentity.verifyEnteredTextInFields('passportDateOfIssue');
//         await createIdentity.enterTextInFields('passportExpiryDate');
//         await createIdentity.verifyEnteredTextInFields('passportExpiryDate');
//         await createIdentity.enterTextInFields('passportNationality');
//         await createIdentity.verifyEnteredTextInFields('passportNationality');
//         await createIdentity.swipeToUp();
//         await createIdentity.enterTextInFields('passportDateOfBirth');
//         await createIdentity.verifyEnteredTextInFields('passportDateOfBirth');
//         await createIdentity.enterTextInFields('passportGender');
//         await createIdentity.verifyEnteredTextInFields('passportGender');
//     });

//     it('[PAS-XXX] User can add passport picture', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.tapPassportPicturePlusButton();
//         await createIdentity.verifyAllowPicturePopupVisible();
//         await createIdentity.tapWhileUsingAppButton();
//         await createIdentity.verifyUploadPicturePopupVisible();
//         await createIdentity.verifyAllElementsInUploadPicturePopupVisible();
//         await createIdentity.tapChooseFromLibraryButton();
//         await createIdentity.verifyPassportPictureInAlbumVisible();
//         await createIdentity.tapPassportPictureInAlbum();
//         await createIdentity.verifyPassportPictureInPassportPictureFieldVisible();
//     });

//     it('[PAS-XXX] User can tap on Passport picture in passport picture field and verify that picture is visible', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.tapPassportPictureInPassportPictureField();
//         await createIdentity.verifyPassportPicturePreviewPageWithAllElementsVisible();
//     });

//     it('[PAS-XXX] User can tap on Share button and verify that picture is shared', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.tapShareButton();
//         await createIdentity.verifyPictureShared();
//         await createIdentity.pressBack();
//     });

//     it('[PAS-XXX] User can tap on Delete button and verify that picture is deleted', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.tapDeleteButton();
//         await createIdentity.verifyPassportPictureInPassportPictureFieldUnvisible();
//         await createIdentity.swipeToDown();
//         await createIdentity.showOrHideFields('hide', 'passport');
//     });

//     it('[PAS-XXX] User can show and hide Identity card field', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.showOrHideFields('show', 'identityCard');
//         await createIdentity.verifyIdentityCardIdNumberFieldVisible();
//         await createIdentity.showOrHideFields('hide', 'identityCard');
//         await createIdentity.verifyIdentityCardIdNumberFieldNotVisible();
//     });

//     it('[PAS-XXX] User can tap on Identity card field and see Identity card field with all elements', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.showOrHideFields('show', 'identityCard');
//         await createIdentity.verifyAllElementsInIdentityCardIdNumberFieldInIdentityCardFieldVisible();
//         await createIdentity.verifyAllElementsInIdentityCardCreationDateFieldInIdentityCardFieldVisible();
//         await createIdentity.verifyAllElementsInIdentityCardExpiryDateFieldInIdentityCardFieldVisible();
//         await createIdentity.verifyAllElementsInIdentityCardIssuingCountryFieldInIdentityCardFieldVisible();
//         await createIdentity.verifyAllElementsInIdentityCardPictureFieldInIdentityCardFieldVisible();
//     });

//     it('[PAS-XXX] User can fill all fields in Identity card field', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.enterTextInFields('identityCardNumber');
//         await createIdentity.verifyEnteredTextInFields('identityCardNumber');
//         await createIdentity.enterTextInFields('identityCardCreationDate');
//         await createIdentity.verifyEnteredTextInFields('identityCardCreationDate');
//         await createIdentity.enterTextInFields('identityCardExpiryDate');
//         await createIdentity.verifyEnteredTextInFields('identityCardExpiryDate');
//         await createIdentity.enterTextInFields('identityCardIssuingCountry');
//         await createIdentity.verifyEnteredTextInFields('identityCardIssuingCountry');
//     });

//     it('[PAS-XXX] User can add identity card picture', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.tapIdentityCardPicturePlusButton();
//         await createIdentity.verifyUploadPicturePopupVisible();
//         await createIdentity.verifyAllElementsInUploadPicturePopupVisible();
//         await createIdentity.tapChooseFromLibraryButton();
//         await createIdentity.verifyIdentityCardPictureInAlbumVisible();
//         await createIdentity.tapIdentityCardPictureInAlbum();
//         await createIdentity.verifyIdentityCardPictureInIdentityCardPictureFieldVisible();
//     });

//     it('[PAS-XXX] User can tap on Identity card picture in identity card picture field and verify that picture is visible', async () => {
//         const { createIdentity } = Pages;

//         await createIdentity.tapIdentityCardPictureInIdentityCardPictureField();
//         await createIdentity.verifyIdentityCardPicturePreviewPageWithAllElementsVisible();
//     });

//     it('[PAS-XXX] User can tap on Share button and verify that picture is shared', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.tapShareButton();
//         await createIdentity.verifyPictureShared();
//         await createIdentity.pressBack();
//         await createIdentity.tapBackButtonOnSharedPage();
//         await createIdentity.verifyIdentityCardIdNumberFieldVisible();
//         await createIdentity.showOrHideFields('hide', 'identityCard');
//     });


//     it('[PAS-XXX] User can show and hide Driving license field', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.showOrHideFields('show', 'drivingLicense');
//         await createIdentity.verifyDrivingLicenseIdNumberFieldVisible();
//         await createIdentity.showOrHideFields('hide', 'drivingLicense');
//         await createIdentity.verifyDrivingLicenseIdNumberFieldNotVisible();
//     });

//     it('[PAS-XXX] User can tap on Driving license field and see Driving license field with all elements', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.showOrHideFields('show', 'drivingLicense');
//         await createIdentity.verifyAllElementsInDrivingLicenseIdNumberFieldInDrivingLicenseFieldVisible();
//         await createIdentity.verifyAllElementsInDrivingLicenseCreationDateFieldInDrivingLicenseFieldVisible();
//         await createIdentity.verifyAllElementsInDrivingLicenseExpiryDateFieldInDrivingLicenseFieldVisible();
//         await createIdentity.verifyAllElementsInDrivingLicenseIssuingCountryFieldInDrivingLicenseFieldVisible();
//         await createIdentity.swipeToUp();
//         await createIdentity.verifyAllElementsInDrivingLicensePictureFieldInDrivingLicenseFieldVisible();
//     });

//     it('[PAS-XXX] User can fill all fields in Driving license field', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.enterTextInFields('drivingLicenseIdNumber');
//         await createIdentity.verifyEnteredTextInFields('drivingLicenseIdNumber');
//         await createIdentity.enterTextInFields('drivingLicenseCreationDate');
//         await createIdentity.verifyEnteredTextInFields('drivingLicenseCreationDate');
//         await createIdentity.enterTextInFields('drivingLicenseExpiryDate');
//         await createIdentity.verifyEnteredTextInFields('drivingLicenseExpiryDate');
//         await createIdentity.enterTextInFields('drivingLicenseIssuingCountry');
//         await createIdentity.verifyEnteredTextInFields('drivingLicenseIssuingCountry');
//     });

//     it('[PAS-XXX] User can add driving license picture', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.tapDrivingLicensePicturePlusButton();
//         await createIdentity.verifyUploadPicturePopupVisible();
//         await createIdentity.verifyAllElementsInUploadPicturePopupVisible();
//         await createIdentity.tapChooseFromLibraryButton();
//         await createIdentity.verifyDrivingLicensePictureInAlbumVisible();
//         await createIdentity.tapDrivingLicensePictureInAlbum();
//         await createIdentity.verifyDrivingLicensePictureInDrivingLicensePictureFieldVisible();
//     });

//     it('[PAS-XXX] User can tap on Driving license picture in driving license picture field and verify that picture is visible', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.tapDrivingLicensePictureInDrivingLicensePictureField();
//         await createIdentity.verifyDrivingLicensePicturePreviewPageWithAllElementsVisible();
//     });

//     it('[PAS-XXX] User can tap on Share button and verify that picture is shared', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.tapShareButton();
//         await createIdentity.verifyPictureShared();
//         await createIdentity.pressBack();
//         await createIdentity.tapBackButtonOnSharedPage();
//         await createIdentity.verifyDrivingLicenseIdNumberFieldVisible();
//         await createIdentity.showOrHideFields('hide', 'drivingLicense');
//     });

//     it('[PAS-XXX] User can add file to File field', async () => {
//         const { createIdentity, settings, createLogin } = Pages;
        
//         await createIdentity.verifyFileFieldVisible();
//         await createIdentity.verifyAllElementsInFileFieldVisible();
//         await createIdentity.tapAddFileButton();
//         await createLogin.verifyAddFilePopupVisible();
//         await createLogin.verifyAllElementsInAddFilePopupVisible();
//         await createLogin.tapChooseFileButton();
//         await settings.tapMenuButton();
//         await settings.tapDownloadsButton();
//         await settings.verifyDownloadsFolderTitleDisplayed();
//         await createLogin.chooseOwnersManualFile();
//         await createIdentity.verifyNewFileFieldWithAllElementsVisible();
//     });

//     it('[PAS-XXX] User can open last added file', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.tapNewFileFieldButton();
//         await createIdentity.verifySharedFilePopupTitleVisible();
//         await createIdentity.verifyQuickShareButtonPopupVisible();
//         await createIdentity.verifySharedFilePopupTextVisible();
//         await createIdentity.pressBack();
//     });

//     it('[PAS-XXX] User can verify Note field with all elements', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.verifyNoteFieldVisible();
//         await createIdentity.verifyAllElementsInNoteFieldVisible();
//     });

//     it('[PAS-XXX] User can add note to Note field', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.enterTextInFields('note');
//         await createIdentity.verifyEnteredTextInFields('note');
//     });

//     it('[PAS-XXX] User can verify Create a custom element field with all elements', async () => {
//         const { createIdentity } = Pages;
        
//         await createIdentity.verifyAllElementsInCreateCustomElementFieldVisible();
//         await createIdentity.tapCreateCustomElementFieldButton();
//         await createIdentity.verifyNewElementInCustomFieldVisible();
//     });

//     it('[PAS-XXX] User can tap on Save button and verify that Identity was created', async () => {
//         const { home, createLogin } = Pages;

//         await createLogin.tapSaveButton();
//         await home.verifyIdentityCreatedOnHomePageVisible();
//     });
// });