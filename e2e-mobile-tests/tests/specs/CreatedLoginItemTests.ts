import 'mocha';
import { Pages } from '@support/page-factory';
import { LoginItemCopyField, PasswordVisibility } from '@data/createdLoginItem.data';

const { EmailOrUserName, Note, Password, Website } = LoginItemCopyField;
const { shown, hidden } = PasswordVisibility;
import { SIDEBAR_ITEMS_COUNT } from '@data/sidebar.data';


describe('Created Items Flow', () => {

    it('[PAS-XXX] User can tap on All category and see all created items', async () => {
        const { createdLoginItem, home } = Pages;

        await home.tapAllCategory();
        await createdLoginItem.verifyAllCreatedItemsVisible();
    });

    it('[PAS-XXX] User can check that amount of all created items are visible on Sidebar page', async () => {
        const { home, sidebar } = Pages;

        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyAllItemsCount(SIDEBAR_ITEMS_COUNT.sevenItems);
        await sidebar.closeSidebarPageBySwipe();
    });

    it('[PAS-XXX] User can choose Logins category and see all created logins', async () => {
        const { createdLoginItem, home } = Pages;

        await home.tapLoginsCategory();
        await createdLoginItem.verifyAllCreatedLoginsVisible();
    });

    it('[PAS-XXX] User can choose Credit cards category and see all created credit cards', async () => {
        const { createdLoginItem, home } = Pages;

        await home.tapCreditCardsCategory();
        await createdLoginItem.verifyAllCreatedCreditCardsVisible();
    });

    it('[PAS-XXX] User can choose Wifi category and see all created wifi', async () => {
        const { createdLoginItem, home } = Pages;

        await home.tapWifiCategory();
        await createdLoginItem.verifyAllCreatedWifiVisible();
    });

    it('[PAS-XXX] User can choose Recovery phrase category and see all created recovery phrases', async () => {
        const { createdLoginItem, home } = Pages;

        await home.tapRecoveryPhraseCategory();
        await createdLoginItem.verifyAllCreatedRecoveryPhrasesVisible();
    });

    it('[PAS-XXX] User can choose Identities category and see all created identities', async () => {
        const { createdLoginItem, home } = Pages;

        await home.tapIdentitiesCategory();
        await createdLoginItem.verifyAllCreatedIdentitiesVisible();
    });

    it('[PAS-XXX] User can choose Notes category and see all created notes', async () => {
        const { createdLoginItem, home } = Pages;

        await home.tapNotesCategory();
        await createdLoginItem.verifyAllCreatedNotesVisible();
    });

    it('[PAS-XXX] User can choose Custom category and see all created custom elements', async () => {
        const { createdLoginItem, home } = Pages;

        await home.tapCustomCategory();
        await createdLoginItem.verifyAllCreatedCustomElementsVisible();
    });
});

describe('Created Items Flow - User can interact with three dots menu on Home page', () => {

    it('[PAS-XXX] User can tap on three dots menu on Created Login Item on Home page and see three dots menu popup', async () => {
        const { createdLoginItem, home } = Pages;

        await home.tapAllCategory();
        await createdLoginItem.tapThreeDotsButtonOnCreatedLogin();
        await createdLoginItem.verifyThreeDotsMenuPopupVisible();
    });

    it('[PAS-XXX] User can verify that all options in three dots menu are visible', async () => {
        const { createdLoginItem } = Pages;

        await createdLoginItem.verifyCopyEmailOrUsernameButtonAllElementsVisible();
        await createdLoginItem.verifyCopyPasswordButtonAllElementsVisible();
        await createdLoginItem.verifyMarkAsFavoriteButtonAllElementsVisible();
        await createdLoginItem.verifyEditButtonAllElementsVisible();
        await createdLoginItem.verifyDeleteButtonAllElementsVisible();
    });

    it('[PAS-XXX] User can tap on Copy Email or username button and verify that email or username is copied', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapCopyEmailOrUsernameButton();
        await createdLoginItem.verifyEmailOrUsernameCopied();
    });

    it('[PAS-XXX] User can tap on Copy Password button and verify that password is copied', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapThreeDotsButtonOnCreatedLogin();
        await createdLoginItem.verifyThreeDotsMenuPopupVisible();
        await createdLoginItem.tapCopyPasswordButton();
        await createdLoginItem.verifyPasswordCopied();
    });
    
    it('[PAS-XXX] User can tap on Mark as favorite button and verify that item is marked as favorite', async () => {
        const { createdLoginItem, home, sidebar } = Pages;

        await createdLoginItem.tapThreeDotsButtonOnCreatedLogin();
        await createdLoginItem.verifyThreeDotsMenuPopupVisible();
        await createdLoginItem.tapMarkAsFavoriteButton();
        await createdLoginItem.verifyFavoriteBadgeOnLoginItemVisible();
        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyCountOfFavoritesItems(1);
        await sidebar.closeSidebarPageBySwipe();
    });

    it('[PAS-XXX] User can tap on Remove from favorites button and verify that item is removed from favorites', async () => {
        const { createdLoginItem, home, sidebar } = Pages;
        
        await createdLoginItem.tapThreeDotsButtonOnCreatedLogin();
        await createdLoginItem.verifyThreeDotsMenuPopupVisible();
        await createdLoginItem.verifyRemoveFromFavoritesButtonAllElementsVisible();
        await createdLoginItem.tapRemoveFromFavoritesButton();
        await createdLoginItem.verifyItemRemovedFromFavorites();
        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyCountOfFavoritesItems(0);
        await sidebar.closeSidebarPageBySwipe();
    });
});

describe('Created Items Flow - User can interact with Created Login Item page', () => {

    it('[PAS-XXX] User can tap on Created Login Item and see Created Login Item page', async () => {
        const { createdLoginItem } = Pages;

        await createdLoginItem.tapCreatedLoginItem();
        await createdLoginItem.verifyTitleLoginItemPageVisible();
    });

    it('[PAS-XXX] User can verify that all elements on Created Login Item page are visible', async () => {
        const { createdLoginItem } = Pages;

        await createdLoginItem.verifyBackButtonLoginItemPageVisible();
        await createdLoginItem.verifyFavoriteButtonUncheckedLoginItemPageVisible();
        await createdLoginItem.verifyEditButtonLoginItemPageAllElementsVisible();
        await createdLoginItem.verifyThreeDotsButtonLoginItemPageVisible();
        await createdLoginItem.verifyAvatarImageLoginItemPageVisible();
        await createdLoginItem.verifyTitleLoginItemPageVisible();
        await createdLoginItem.verifyEmailOrUserNameFieldLoginItemPageAllElementsVisible();
        await createdLoginItem.verifyPasswordFieldLoginItemPageAllElementsVisible();
        await createdLoginItem.verifyWebsiteFieldLoginItemPageAllElementsVisible();
        await createdLoginItem.verifyFileFieldLoginItemPageAllElementsVisible();
        await createdLoginItem.verifyNotesFieldLoginItemPageAllElementsVisible();
    });

    it('[PAS-XXX] User can tap on Favorite button on Created Login Item page and verify that item is marked as favorite', async () => {
        const { createdLoginItem, home, sidebar } = Pages;
        
        await createdLoginItem.tapFavoriteButtonUncheckedLoginItemPage();
        await createdLoginItem.verifyFavoriteButtonCheckedOnLoginItemPageVisible();
        await createdLoginItem.verifyFavoriteBadgeOnLoginItemVisible();
        await createdLoginItem.tapThreeDotsButtonLoginItemPage();
        await createdLoginItem.verifyRemoveFromFavoritesButtonOnLoginItemPageVisible();


        await createdLoginItem.tapBackButtonOnLoginItemPage();
        await createdLoginItem.verifyFavoriteBadgeOnLoginItemVisible();

        await home.tapHomeLogoLock();
        await sidebar.waitForLoaded();
        await sidebar.verifyCountOfFavoritesItems(1);
        await sidebar.closeSidebarPageBySwipe();
    });

    it('[PAS-XXX] User can tap on Copy Email or username button and verify that email or username is copied', async () => {
        const { createdLoginItem } = Pages;

        await createdLoginItem.tapCreatedLoginItem();
        await createdLoginItem.verifyTitleLoginItemPageVisible();
        await createdLoginItem.tapCopyButtonLoginItemPage(EmailOrUserName);
        await createdLoginItem.verifyCopyToastLoginItemPageVisible();
    });

    it('[PAS-XXX] User can tap on Copy Password button and verify that password is copied', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapCopyButtonLoginItemPage(Password);
        await createdLoginItem.verifyCopyToastLoginItemPageVisible();
    });

    it('[PAS-XXX] User can tap on Copy Website button and verify that website is copied', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapCopyButtonLoginItemPage(Website);
        await createdLoginItem.verifyCopyToastLoginItemPageVisible();
    });

    it('[PAS-XXX] User can tap on Copy Note button and verify that note is copied', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapCopyButtonLoginItemPage(Note);
        await createdLoginItem.verifyCopyToastLoginItemPageVisible();
    });

    it('[PAS-XXX] User can tap on Show Password button and verify that password is shown', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapShowPasswordButtonLoginItemPage();
        await createdLoginItem.verifyPasswordLoginItemPageVisible(shown);
    });

    it('[PAS-XXX] User can tap on Hide Password button and verify that password is hidden', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapHidePasswordButtonLoginItemPage();
        await createdLoginItem.verifyPasswordLoginItemPageVisible(hidden);
    });

    it('[PAS-XXX] User can view uploaded file on Created Login Item page', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapFileFieldOnLoginItemPage();
        await createdLoginItem.verifyFileOpened();
        await createdLoginItem.pressBack();
    });

    it('[PAS-XXX] User can tap on Three dots button and verify that three dots menu popup is visible', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapThreeDotsButtonLoginItemPage();
        await createdLoginItem.verifyThreeDotsMenuPopupOnLoginItemPageVisible();
    });

    it('[PAS-XXX] User can verify that all options in three dots menu are visible', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.verifyMoveToAnotherFolderButtonOnLoginItemPageVisible();
        await createdLoginItem.verifyMarkAsFavoriteButtonOnLoginItemPageVisible();
        await createdLoginItem.verifyDeleteElementButtonOnLoginItemPageVisible();
    });

    it('[PAS-XXX] User can tap on Move to another folder button and verify that pop menu visible and item is moved to another folder', async () => {
        const { createdLoginItem, sidebar } = Pages;
        
        await createdLoginItem.tapMoveToAnotherFolderButtonLoginItemPage();
        await createdLoginItem.verifyPopUpMenuMoveToAnotherFolderVisible();
        await createdLoginItem.verifyCreateNewFolderButtonVisible();
        await createdLoginItem.tapCreateNewFolderButtonInPopUpMenuMoveToAnotherFolder();
        await sidebar.verifyCreateNewFolderPageFull();
        await sidebar.enterFolderTitle('TestFolder3');
        await sidebar.tapCreateNewFolderPageButton();
        await createdLoginItem.verifyTestFolderIconAndTitleOnLoginItemPageVisible();
        await createdLoginItem.tapThreeDotsButtonLoginItemPage();
        await createdLoginItem.verifyThreeDotsMenuPopupOnLoginItemPageVisible();
        await createdLoginItem.tapMoveToAnotherFolderButtonLoginItemPage();
        await createdLoginItem.verifyPopUpMenuMoveToAnotherFolderVisible();
        await createdLoginItem.verifyNewFolderInPopUpMenuVisible();
        await createdLoginItem.verifyAmountOfItemsInFolder(1);
        await createdLoginItem.tapOnNewFolderInPopUpMenu();
        await createdLoginItem.tapBackButtonOnLoginItemPage();
    });

    it('[PAS-XXX] User can tap on Delete button in three dots menu and verify that delete popup is visible', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapThreeDotsButtonOnCreatedLogin();
        await createdLoginItem.verifyThreeDotsMenuPopupVisible();
        await createdLoginItem.tapDeleteButtonInThreeDotsMenu();
        await createdLoginItem.verifyDeletePopupVisible();
        await createdLoginItem.verifyDeletePopupAllElementsVisible();
    });

    it('[PAS-XXX] User can tap on Cancel button in delete popup and verify that popup is closed', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapDeletePopupCancelButtonInThreeDotsMenu();
        await createdLoginItem.verifyDeletePopupNotVisible();
    });

    it('[PAS-XXX] User can tap on Edit button on Home page and see Edit Login Item page', async () => {
        const { createdLoginItem, createLogin } = Pages;
        
        await createdLoginItem.tapEditButtonLoginItemPage();
        await createLogin.verifyTitleFieldVisible();
        await createLogin.tapCloseButton();
        await createdLoginItem.tapBackButtonOnLoginItemPage();
    });

    it('[PAS-XXX] User can tap on Edit button in three dots menu and see Edit Login Item page', async () => {
        const { createdLoginItem, createLogin } = Pages;

        await createdLoginItem.tapThreeDotsButtonOnCreatedLogin();
        await createdLoginItem.verifyThreeDotsMenuPopupVisible();
        await createdLoginItem.tapEditButtonInThreeDotsMenu();
        await createLogin.verifyTitleFieldVisible();
    });

    it('[PAS-XXX] User can open attached file on Edit Login Item page', async () => {
        const { createdLoginItem } = Pages;
        
        await createdLoginItem.tapFileFieldOnLoginItemPage();
        await createdLoginItem.verifyFileOpened();
        await createdLoginItem.pressBack();
    });

    it('[PAS-XXX] User can Change title on Edit Login Item page and verify that title is changed', async () => {
        const { createLogin, home } = Pages;

        await createLogin.tapTitleField();
        await createLogin.enterTextInFields('newTitle');
        await createLogin.tapSaveButton();
        await home.verifyNewTitleLoginItemPageVisible();
    });

    it('[PAS-XXX] User can tap on Delete button in three dots menu on Home page and verify that delete popup is visible', async () => {
        const { createdLoginItem } = Pages;

        await createdLoginItem.tapThreeDotsButtonOnCreatedLogin();
        await createdLoginItem.verifyThreeDotsMenuPopupVisible();
        await createdLoginItem.tapDeleteElementButtonInThreeDotsMenuOnHomePage();
        await createdLoginItem.verifyDeletePopupVisible();
        await createdLoginItem.verifyDeletePopupAllElementsVisible();
        await createdLoginItem.tapDeletePopupConfirmButtonInThreeDotsMenu();
    });
});
