import 'mocha';
import { Pages } from '@support/page-factory';


describe('Created Wi-Fi Flow - User can interact with three dots menu on Home page', () => {

    it('[PAS-XXX] User can tap on three dots menu on Created Wi-Fi Item on Home page and see three dots menu popup', async () => {
        const { createdWiFiItem } = Pages;

        await createdWiFiItem.tapThreeDotsButtonOnCreatedWiFi();
        await createdWiFiItem.verifyThreeDotsMenuPopupVisible();
    });

    it('[PAS-XXX] User can verify that all options in three dots menu are visible', async () => {
        const { createdWiFiItem } = Pages;

        await createdWiFiItem.verifyCopyWiFiPasswordButtonAllElementsVisible();
        await createdWiFiItem.verifyMarkAsFavoriteButtonAllElementsVisible();
        await createdWiFiItem.verifyEditButtonAllElementsVisible();
        await createdWiFiItem.verifyDeleteButtonAllElementsVisible();
    });

    it('[PAS-XXX] User can tap on Copy Wi-Fi Password button and verify that Wi-Fi password is copied', async () => {
        const { createdWiFiItem } = Pages;
        
        await createdWiFiItem.tapCopyWiFiPasswordButton();
        await createdWiFiItem.verifyWiFiPasswordCopied();
    });

    it('[PAS-XXX] User can tap on Mark as favorite button and verify that Wi-Fi item is marked as favorite', async () => {
        const { createdWiFiItem, home, sidebar } = Pages;
        
        await createdWiFiItem.tapThreeDotsButtonOnCreatedWiFi();
        await createdWiFiItem.verifyThreeDotsMenuPopupVisible();
        await createdWiFiItem.tapMarkAsFavoriteButtonOnCreatedWiFiPage();
        await createdWiFiItem.verifyWiFiItemMarkedAsFavorite();
        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyCountOfFavoritesItems(1);
        await sidebar.closeSidebarPageBySwipe();
    });
    
    it('[PAS-XXX] User can tap on Remove from favorites button and verify that item is removed from favorites', async () => {
        const { createdWiFiItem, home, sidebar } = Pages;
        
        await createdWiFiItem.tapThreeDotsButtonOnCreatedWiFi();
        await createdWiFiItem.verifyThreeDotsMenuPopupVisible();
        await createdWiFiItem.verifyRemoveFromFavoritesButtonAllElementsVisible();
        await createdWiFiItem.tapRemoveFromFavoritesButtonOnCreatedWiFiPage();
        await createdWiFiItem.verifyWiFiItemRemovedFromFavoritesOnHomePage();
        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyCountOfFavoritesItems(0);
        await sidebar.closeSidebarPageBySwipe();
    });
});

describe('Created Wi-Fi Flow - User can interact with Created Wi-Fi Item page', () => {

    it('[PAS-XXX] User can tap on Created Credit Cards Item and see Created Credit Cards Item page', async () => {
        const { createdWiFiItem } = Pages;

        await createdWiFiItem.tapCreatedWiFiItemOnHomePage();
        await createdWiFiItem.verifyTitleWiFiItemPageVisibleOnCreatedWiFiItemPage();
    });

    it('[PAS-XXX] User can verify that all elements on Created Wi-Fi Item page are visible', async () => {
        const { createdWiFiItem } = Pages;

        await createdWiFiItem.verifyBackButtonWiFiItemPageVisibleOnCreatedWiFiItemPage();
        await createdWiFiItem.verifyFavoriteButtonUncheckedWiFiItemPageVisibleOnCreatedWiFiItemPage();
        await createdWiFiItem.verifyEditButtonWiFiItemPageAllElementsVisibleOnCreatedWiFiItemPage();
        await createdWiFiItem.verifyThreeDotsButtonWiFiItemPageVisibleOnCreatedWiFiItemPage();
        await createdWiFiItem.verifyAvatarImageWiFiItemPageVisibleOnCreatedWiFiItemPage();
        await createdWiFiItem.verifyTitleWiFiItemPageVisibleOnCreatedWiFiItemPage();
        await createdWiFiItem.verifyWiFiPasswordFieldWiFiItemPageAllElementsVisibleOnCreatedWiFiItemPage();
        await createdWiFiItem.verifyQRCodeWiFiItemPageFieldAllElementsVisibleOnCreatedWiFiItemPage();
        await createdWiFiItem.verifyNoteFieldWiFiItemPageAllElementsVisibleOnCreatedWiFiItemPage();
    });

    it('[PAS-XXX] User can tap on show password icon button and verify that password is visible', async () => {
        const { createdWiFiItem } = Pages;
        
        await createdWiFiItem.tapShowPasswordIconButtonOnCreatedWiFiItemPage();
        await createdWiFiItem.verifyWiFiPasswordFieldWiFiItemPageInputVisible();
    });

    it('[PAS-XXX] User can tap on copy password button and verify that password is copied', async () => {
        const { createdWiFiItem } = Pages;
        
        await createdWiFiItem.tapCopyWiFiPasswordButtonOnCreatedWiFiItemPage();
        await createdWiFiItem.verifyWiFiPasswordCopiedToastDisplayed();
    });

    it('[PAS-XXX] User can tap on Edit button and verify that user is redirected to Edit Wi-Fi Item page', async () => {
        const { createdWiFiItem, createWifi, createLogin } = Pages;
        
        await createdWiFiItem.tapEditButtonOnCreatedWiFiItemPage();
        await createWifi.waitForCreateWifiPageLoaded();
        await createWifi.verifyWifiNameFieldVisible();
        await createWifi.verifyWifiPasswordFieldVisible();
        await createWifi.verifyNoteFieldVisible();
        await createWifi.verifyCustomFieldVisible();
        await createLogin.verifyNoFolderButtonVisible();
        await createLogin.verifySaveButtonVisible();
        await createLogin.verifyCloseButtonVisible();
    });

    it('[PAS-298] User can edit Wi-Fi note and verify that note is updated', async () => {
        const { createdWiFiItem, createWifi, createLogin } = Pages;

        await createWifi.enterTextInFields('updatedNote');
        await createWifi.waitForCreateWifiPageLoaded();
        await createWifi.tapNoteField();
        await createWifi.enterTextInFields('updatedNote');
        await createWifi.verifyEnteredTextInFields('updatedNote');
        await createLogin.tapSaveButton();
        await createdWiFiItem.verifyUpdatedCommentFieldTextWiFiItemPageVisible();
    });

    it('[PAS-XXX] User can tap on Back button and verify that user is redirected to Home page', async () => {
        const { createdWiFiItem, home } = Pages;

        await createdWiFiItem.tapBackButtonOnCreatedWiFiItemPage();
        await home.waitForHomePageLoaded();
    });




});