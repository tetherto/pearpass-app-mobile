import 'mocha';
import { Pages } from '@support/page-factory';


describe('Created Identity Flow - User can interact with three dots menu on Home page', () => {

    it('[PAS-XXX] User can tap on three dots menu on Created Identity Item on Home page and see three dots menu popup', async () => {
        const { createdIdentityItem } = Pages;

        await createdIdentityItem.tapThreeDotsButtonOnCreatedIdentity();
        await createdIdentityItem.verifyThreeDotsMenuPopupVisible();
    });

    it('[PAS-XXX] User can verify that all options in three dots menu are visible', async () => {
        const { createdIdentityItem } = Pages;

        await createdIdentityItem.verifyCopyFullNameButtonAllElementsVisible();
        await createdIdentityItem.verifyCopyEmailAddressButtonAllElementsVisible();
        await createdIdentityItem.verifyMarkAsFavoriteButtonAllElementsVisible();
        await createdIdentityItem.verifyEditButtonAllElementsVisible();
        await createdIdentityItem.verifyDeleteButtonAllElementsVisible();
    });

    it('[PAS-XXX] User can tap on Copy Full name button and verify that full name is copied', async () => {
        const { createdIdentityItem } = Pages;

        await createdIdentityItem.tapCopyFullNameButton();
        await createdIdentityItem.verifyFullNameCopied();
    });

    it('[PAS-XXX] User can tap on Copy Email address button and verify that email address is copied', async () => {
        const { createdIdentityItem } = Pages;
        
        await createdIdentityItem.tapThreeDotsButtonOnCreatedIdentity();
        await createdIdentityItem.verifyThreeDotsMenuPopupVisible();
        await createdIdentityItem.tapCopyEmailAddressButton();
        await createdIdentityItem.verifyEmailAddressCopied();
    });

    it('[PAS-XXX] User can tap on Mark as favorite button and verify that identity item is marked as favorite', async () => {
        const { createdIdentityItem, home, sidebar } = Pages;
        
        await createdIdentityItem.tapThreeDotsButtonOnCreatedIdentity();
        await createdIdentityItem.verifyThreeDotsMenuPopupVisible();
        await createdIdentityItem.tapMarkAsFavoriteButton();
        await createdIdentityItem.verifyIdentityItemMarkedAsFavorite();
        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyCountOfFavoritesItems(1);
        await sidebar.closeSidebarPageBySwipe();
    });
    
    it('[PAS-XXX] User can tap on Remove from favorites button and verify that item is removed from favorites', async () => {
        const { createdIdentityItem, home, sidebar } = Pages;
        
        await createdIdentityItem.tapThreeDotsButtonOnCreatedIdentity();
        await createdIdentityItem.verifyThreeDotsMenuPopupVisible();
        await createdIdentityItem.tapRemoveFromFavoritesButton();
        await createdIdentityItem.verifyIdentityItemRemovedFromFavoritesOnHomePage();
        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyCountOfFavoritesItems(0);
        await sidebar.closeSidebarPageBySwipe();
    });
});

describe('Created Identity Flow - User can interact with Created Identity Item page', () => {

    it('[PAS-XXX] User can tap on Created Identity Item and see Created Identity Item page', async () => {
        const { createdIdentityItem } = Pages;

        await createdIdentityItem.tapCreatedIdentityItemOnHomePage();
        await createdIdentityItem.verifyTitleIdentityItemPageVisibleOnCreatedIdentityItemPage();
    });

    it('[PAS-XXX] User can verify that all elements on Created Identity Item page are visible', async () => {
        const { createdIdentityItem } = Pages;
        
        