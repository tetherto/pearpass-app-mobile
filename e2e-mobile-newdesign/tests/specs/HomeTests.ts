import 'mocha';
import { Pages } from '@support/page-factory';
import { restartAndNavigateToHomePage, tapOnAddTopItemButton } from '@helpers/test-setup';

describe('Home Page - Main Navigation', () => {
  
  beforeEach(async () => {
      await restartAndNavigateToHomePage();
  });

  it('[] Verify that search field with all elements is displayed on Home page', async () => {
    const { home } = Pages;

    await home.searchFieldWithAllElementsDisplayed();
  });

  it('[] Verify that import vault button is displayed on Home page', async () => {
    const { home } = Pages;

    await home.importVaultButtonWithAllElementsDisplayed();
  });

  it('[] Verify that import items button is displayed on Home page', async () => {
    const { home } = Pages;
    
    await home.importItemsButtonWithAllElementsDisplayed();
  });

  it('[] Verify that vault tab and button are displayed on Home page', async () => {
    const { home } = Pages;

    await home.vaultTabWithAllElementsDisplayed();
  });

  it('[] Verify that settings tab is displayed on Home page', async () => {
    const { home } = Pages;

    await home.settingsTabWithAllElementsDisplayed();
  });

  it('[] Verify that add item buttons are displayed on Home page', async () => {
    const { home } = Pages;

    await home.addTopItemButtonWithAllElementsDisplayed();
    await home.addCenterItemButtonWithAllElementsDisplayed();
  });

  it('[] Verify that Folders button is displayed on Home page', async () => {
    const { home } = Pages;

    await home.swipeVaultBreadcrumbLeft();
    await home.foldersButtonWithAllElementsDisplayed();
  });

  it('[] User can tap on Folders button, see folders popup and close it by clicking on Close button', async () => {
    const { home } = Pages;

    await home.tapOnAllFoldersButton();
    await home.foldersPopupWithAllElementsDisplayed();
    await home.tapOnPopupCloseButton();
    await home.verifyFoldersPopupNotDisplayed();
  });

  it('[] Verify that Items order button is displayed on Home page', async () => {
    const { home } = Pages;

    await home.sortItemsButtonWithAllElementsDisplayed();
  });

  it('[] User can tap on Sort Items button, see Sort Items popup and close it by clicking on Close button', async () => {
    const { home } = Pages;

    await home.tapOnSortItemsButton();
    await home.sortItemsPopupWithAllElementsDisplayed();
    await home.tapOnPopupCloseButton();
    await home.verifySortItemsPopupNotDisplayed();
  });

  it('[] User can see Vaults popup by clicking on Vaults button and close it by clicking on Close button', async () => {
    const { home } = Pages;

    await home.tapOnVaultsButton();
    await home.vaultsPopupWithAllElementsDisplayed();
    await home.tapOnPopupCloseButton();
    await home.verifyVaultsPopupNotDisplayed();
  });

  it('[] User can see vaults popup by long pressing on vaults tab and close it by clicking on Close button', async () => {
    const { home } = Pages;

    await home.longPressOnVaultsTab();
    await home.vaultsPopupWithAllElementsDisplayed();
    await home.tapOnPopupCloseButton();
    await home.verifyVaultsPopupNotDisplayed();
  });

  it('[] User can tap on all items category button, see items category popup and close it by clicking on Close button', async () => {
    const { home } = Pages;

    await home.tapOnAllItemsCategoryButton();
    await home.itemsCategoryPopupWithAllElementsDisplayed();
    await home.tapOnPopupCloseButton();
    await home.verifyItemsCategoryPopupNotDisplayed();
  });

  it('[] User can tap on add item button, see add item popup and close it by clicking on Close button', async () => {
    const { home } = Pages;

    await home.tapOnAddTopItemButton();
    await home.addTopItemPopupWithAllElementsDisplayed();
    await home.tapOnPopupCloseButton();
    await home.verifyAddTopItemPopupNotDisplayed();
  });

  it('[] User can tap on Import Vault button, see import vault page and close it by clicking on Go back button', async () => {
    const { home } = Pages;

    await home.tapOnImportVaultButton();
    await home.importVaultPageWithAllElementsDisplayed();
    await home.tapOnBackButton();
    await home.noItemSavedTitleDisplayed();
  });

  it('[] User can tap on Import Items button, see import items page and close it by clicking on Go back button', async () => {
    const { home, settings } = Pages;

    await home.tapOnImportItemsButton();
    await settings.verifyImportItemsPageWithAllElements();
    await home.tapOnBackButton();
    await home.noItemSavedTitleDisplayed();
  });

  it('[] User can tap on center Add Item button, see Create New Login Item page and close it by clicking on Back button', async () => {
    const { home, createLogin } = Pages;

    await home.tapOnAddCenterItemButton();
    await createLogin.verifyCreateNewLoginItemPageDisplayed();
    await home.tapOnBackButton();
    await home.noItemSavedTitleDisplayed();
  });
});

describe('Home Page - Add Item', () => {
  
  beforeEach(async () => {
      await restartAndNavigateToHomePage();
      await tapOnAddTopItemButton();
  });

  it('[] User can tap on Add Item button, tap on Logins field, see Logins page and close it by clicking on Back button', async () => {
    const { home, createLogin } = Pages;

    await home.tapOnLoginsField();
    await createLogin.verifyCreateNewLoginItemPageDisplayed();
    await home.tapOnBackButton();
    await home.noItemSavedTitleDisplayed();
  });

  it('[] User can tap on Add Item button, tap on Credit Card field, see Credit Card page and close it by clicking on Back button', async () => {
    const { home, createCreditCard } = Pages;

    await home.tapOnCreditCardField();
    await createCreditCard.verifyCreateNewCreditCardsItemPageDisplayed();
    await home.tapOnBackButton();
    await home.noItemSavedTitleDisplayed();
  });

  it('[] User can tap on Add Item button, tap on Identities field, see Identities page and close it by clicking on Back button', async () => {
    const { home, createIdentity } = Pages;

    await home.tapOnIdentitiesField();
    await createIdentity.verifyCreateNewIdentityItemPageDisplayed();
    await home.tapOnBackButton();
    await home.noItemSavedTitleDisplayed();
  });

  it('[] User can tap on Add Item button, tap on Notes field, see Notes page and close it by clicking on Back button', async () => {
    const { home, createNotes } = Pages;

    await home.tapOnNotesField();
    await createNotes.verifyCreateNewNotesItemPageDisplayed();
    await home.tapOnBackButton();
    await home.noItemSavedTitleDisplayed();
  });

  it('[] User can tap on Add Item button, tap on Recovery Phrases field, see Recovery Phrases page and close it by clicking on Back button', async () => {
    const { home, saveRecoveryPhrase } = Pages;

    await home.tapOnRecoveryPhrasesField();
    await saveRecoveryPhrase.verifyCreateNewRecoveryPhraseItemPageDisplayed();
    await home.tapOnBackButton();
    await home.noItemSavedTitleDisplayed();
  });

  it('[] User can tap on Add Item button, tap on WiFi field, see WiFi page and close it by clicking on Back button', async () => {
    const { home, createWifi } = Pages;

    await home.tapOnWiFiField();
    await createWifi.verifyCreateNewWiFiItemPageDisplayed();
    await home.tapOnBackButton();
    await home.noItemSavedTitleDisplayed();
  });

  it('[] User can tap on Add Item button, tap on Other field, see Other page and close it by clicking on Back button', async () => {
    const { home, createOther } = Pages;

    await home.tapOnOtherField();
    await createOther.verifyCreateNewOtherItemPageDisplayed();
    await home.tapOnBackButton();
    await home.noItemSavedTitleDisplayed();
  });

  it('[] User can tap on Add Item button, tap on Password field, see Password page and close it by clicking on Back button', async () => {
    const { home, createPassword } = Pages;

    await home.tapOnPasswordField();
    await createPassword.verifyCreateNewPasswordItemPageDisplayed();
    await home.tapOnBackButton();
    await home.noItemSavedTitleDisplayed();
  });
});
