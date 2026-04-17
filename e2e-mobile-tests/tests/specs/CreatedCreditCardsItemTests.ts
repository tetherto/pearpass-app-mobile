import 'mocha';
import { Pages } from '@support/page-factory';


describe('Created Credit Cards Flow - User can interact with three dots menu on Home page', () => {

    it('User can tap on three dots menu on Created Credit Cards Item on Home page and see three dots menu popup', async () => {
        const { createdCreditCardsItem } = Pages;

        await createdCreditCardsItem.tapThreeDotsButtonOnCreatedCreditCards();
        await createdCreditCardsItem.verifyThreeDotsMenuPopupVisible();
    });

    it('User can verify that all options in three dots menu are visible', async () => {
        const { createdCreditCardsItem } = Pages;

        await createdCreditCardsItem.verifyCopyNameOnCardButtonAllElementsVisible();
        await createdCreditCardsItem.verifyCopyNumberOnCardButtonAllElementsVisible();
        await createdCreditCardsItem.verifyMarkAsFavoriteButtonAllElementsVisible();
        await createdCreditCardsItem.verifyEditButtonAllElementsVisible();
        await createdCreditCardsItem.verifyDeleteButtonAllElementsVisible();
    });

    it('User can tap on Copy Name on card button and verify that name on card is copied', async () => {
        const { createdCreditCardsItem } = Pages;
        
        await createdCreditCardsItem.tapCopyNameOnCardButton();
        await createdCreditCardsItem.verifyNameOnCardCopied();
    });

    it('User can tap on Copy Number on card button and verify that number on card is copied', async () => {
        const { createdCreditCardsItem } = Pages;
        
        await createdCreditCardsItem.tapThreeDotsButtonOnCreatedCreditCards();
        await createdCreditCardsItem.verifyThreeDotsMenuPopupVisible();
        await createdCreditCardsItem.tapCopyNumberOnCardButton();
        await createdCreditCardsItem.verifyNumberOnCardCopied();
    });

    it('[280] User can tap on Mark as favorite button and verify that item is marked as favorite', async () => {
        const { createdCreditCardsItem, home, sidebar } = Pages;
        
        await createdCreditCardsItem.tapThreeDotsButtonOnCreatedCreditCards();
        await createdCreditCardsItem.verifyThreeDotsMenuPopupVisible();
        await createdCreditCardsItem.tapMarkAsFavoriteButton();
        await createdCreditCardsItem.verifyItemMarkedAsFavorite();
        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyCountOfFavoritesItems(1);
        await sidebar.closeSidebarPageBySwipe();
    });

    it('[282] User can tap on Remove from favorites button and verify that item is removed from favorites', async () => {
        const { createdCreditCardsItem, home, sidebar } = Pages;
        
        await createdCreditCardsItem.tapThreeDotsButtonOnCreatedCreditCards();
        await createdCreditCardsItem.verifyThreeDotsMenuPopupVisible();
        await createdCreditCardsItem.verifyRemoveFromFavoritesButtonAllElementsVisible();
        await createdCreditCardsItem.tapRemoveFromFavoritesButton();
        await createdCreditCardsItem.verifyItemRemovedFromFavorites();
        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyCountOfFavoritesItems(0);
        await sidebar.closeSidebarPageBySwipe();
    });
});

describe('Created Credit Cards Flow - User can interact with Created Credit Cards Item page', () => {

    it('User can tap on Created Credit Cards Item and see Created Credit Cards Item page', async () => {
        const { createdCreditCardsItem } = Pages;

        await createdCreditCardsItem.tapCreatedCreditCardsItem();
        await createdCreditCardsItem.verifyTitleCreditCardsItemPageVisible();
    });

    it('User can verify that all elements on Created Credit Cards Item page are visible', async () => {
        const { createdCreditCardsItem } = Pages;

        await createdCreditCardsItem.verifyBackButtonCreditCardsItemPageVisible();
        await createdCreditCardsItem.verifyFavoriteButtonUncheckedCreditCardsItemPageVisible();
        await createdCreditCardsItem.verifyEditButtonCreditCardsItemPageAllElementsVisible();
        await createdCreditCardsItem.verifyThreeDotsButtonCreditCardsItemPageVisible();
        await createdCreditCardsItem.verifyAvatarImageCreditCardsItemPageVisible();
        await createdCreditCardsItem.verifyTitleCreditCardsItemPageVisible();
        await createdCreditCardsItem.verifyNameOnCardFieldCreditCardsItemPageAllElementsVisible();
        await createdCreditCardsItem.verifyNumberOnCardFieldCreditCardsItemPageAllElementsVisible();
        await createdCreditCardsItem.verifyExpirationDateFieldCreditCardsItemPageAllElementsVisible();
        await createdCreditCardsItem.verifySecurityCodeFieldCreditCardsItemPageAllElementsVisible();
        await createdCreditCardsItem.verifyPinCodeFieldCreditCardsItemPageAllElementsVisible();
        await createdCreditCardsItem.verifyFileFieldCreditCardsItemPageAllElementsVisible();
        await createdCreditCardsItem.verifyNotesFieldCreditCardsItemPageAllElementsVisible();
    });

    it('[277] User can tap on show security code icon button and verify that security code is shown', async () => {
        const { createdCreditCardsItem } = Pages;
        
        await createdCreditCardsItem.tapShowSecurityCodeIconButton();
        await createdCreditCardsItem.verifySecurityCodePasswordIsVisible();
    });

    it('User can tap on show pin code icon button and verify that pin code is shown', async () => {
        const { createdCreditCardsItem } = Pages;
        
        await createdCreditCardsItem.tapShowPinCodeIconButton();
        await createdCreditCardsItem.verifyPinCodeFieldCreditCardsItemPageVisible();
    });

    it('User can tap on copy name on card button and verify that name on card is copied', async () => {
        const { createdCreditCardsItem } = Pages;
        
        await createdCreditCardsItem.tapCopyNameOnCardButton();
        await createdCreditCardsItem.verifyNameOnCardCopied();
    });

    it('User can tap on copy number on card button and verify that number on card is copied', async () => {
        const { createdCreditCardsItem } = Pages;
        
        await createdCreditCardsItem.tapCopyNumberOnCardButton();
        await createdCreditCardsItem.verifyNumberOnCardCopied();
    });

    it('User can tap on copy expiration date button and verify that expiration date is copied', async () => {
        const { createdCreditCardsItem } = Pages;
        
        await createdCreditCardsItem.tapCopyExpirationDateButton();
        await createdCreditCardsItem.verifyExpirationDateCopied();
    });

    it('User can tap on copy security code button and verify that security code is copied', async () => {
        const { createdCreditCardsItem } = Pages;
        
        await createdCreditCardsItem.tapCopySecurityCodeButton();
        await createdCreditCardsItem.verifySecurityCodeCopied();
    });

    it('User can tap on copy pin code button and verify that pin code is copied', async () => {
        const { createdCreditCardsItem } = Pages;
        
        await createdCreditCardsItem.tapCopyPinCodeButton();
        await createdCreditCardsItem.verifyPinCodeCopied();
    });
    
    it('User can tap on note field button and verify that note is copied', async () => {
        const { createdCreditCardsItem } = Pages;
        
        await createdCreditCardsItem.tapCopyNoteButton();
        await createdCreditCardsItem.verifyNoteCopied();
    });
});   
