const createdLoginItemLocators = {
/* =====================================================
        ALL CREATED ITEMS ON HOME PAGE (for All category)
===================================================== */
  loginCreatedOnHomePage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup',
  creditCardCreatedOnHomePage: '~TC',
  wifiCreatedOnHomePage: '~TW',
  recoveryPhraseCreatedOnHomePage: '~TA',
  identityCreatedOnHomePage: '~TI',
  noteCreatedOnHomePage: '~TN',
  customElementCreatedOnHomePage: '~CT',
/* =====================================================
        CREATED LOGIN
===================================================== */
createdLoginThreeDotsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',
copyEmailOrUsernameButton: '~Copy Email or username',
copyEmailOrUsernameIcon: '//android.view.ViewGroup[@content-desc="Copy Email or username"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyEmailOrUsernameButtonText: '//android.widget.TextView[@text="Copy Email or username"]',
emailOrUsernameThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Email or username"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

copyPasswordButton: '~Copy Password',
copyPasswordIcon: '//android.view.ViewGroup[@content-desc="Copy Password"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyPasswordButtonText: '//android.widget.TextView[@text="Copy Password"]',
passwordThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Password"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

markAsFavoriteButton: '~Mark as favorite',
markAsFavoriteIcon: '//android.view.ViewGroup[@content-desc="Mark as favorite"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
markAsFavoriteButtonText: '//android.widget.TextView[@text="Mark as favorite"]',
markAsFavoriteThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Mark as favorite"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

removeFromFavoritesButton: '~Remove from Favorites',
removeFromFavoritesIcon: '//android.view.ViewGroup[@content-desc="Remove from Favorites"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
removeFromFavoritesButtonText: '//android.widget.TextView[@text="Remove from Favorites"]',
removeFromFavoritesThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Remove from Favorites"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

editButton: '~Edit',
editIcon: '//android.view.ViewGroup[@content-desc="Edit"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
editButtonText: '//android.widget.TextView[@text="Edit"]',
editThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Edit"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

deleteElementButton: '~Delete element',
deleteElementIcon: '//android.view.ViewGroup[@content-desc="Delete element"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
deleteElementButtonText: '//android.widget.TextView[@text="Delete element"]',
deleteElementThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Delete element"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
/* =====================================================
        CREATED CREDIT CARD
===================================================== */
createdCreditCardThreeDotsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',
copyNameOnCardButton: '~Copy Name on card',
copyNameOnCardIcon: '//android.view.ViewGroup[@content-desc="Copy Name on card"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyNameOnCardButtonText: '//android.widget.TextView[@text="Copy Name on card"]',
nameOnCardThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Name on card"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

copyNumberOnCardButton: '~Copy Number on card',
copyNumberOnCardIcon: '//android.view.ViewGroup[@content-desc="Copy Number on card"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyNumberOnCardButtonText: '//android.widget.TextView[@text="Copy Number on card"]',
numberOnCardThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Number on card"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
/* =====================================================
        CREATED WIFI
===================================================== */
copyWifiPasswordButton: '~Copy Wi-Fi Password',
copyWifiPasswordIcon: '//android.view.ViewGroup[@content-desc="Copy Wi-Fi Password"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyWifiPasswordButtonText: '//android.widget.TextView[@text="Copy Wi-Fi Password"]',
wifiPasswordThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Wi-Fi Password"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
/* =====================================================
        CREATED RECOVERY PHRASE 
===================================================== */
createdRecoveryPhraseThreeDotsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',
copyRecoveryPhraseButton: '~Copy PassPhrase',
copyRecoveryPhraseIcon: '//android.view.ViewGroup[@content-desc="Copy PassPhrase"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyRecoveryPhraseButtonText: '//android.widget.TextView[@text="Copy PassPhrase"]',
recoveryPhraseThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy PassPhrase"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
/* =====================================================
        CREATED IDENTITY
===================================================== */
createdIdentityThreeDotsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',
copyFullNameButton: '~Copy Full name',
copyFullNameIcon: '//android.view.ViewGroup[@content-desc="Copy Full name"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyFullNameButtonText: '//android.widget.TextView[@text="Copy Full name"]',
fullNameThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Full name"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

copyEmailAddressButton: '~Copy Email address',
copyEmailAddressIcon: '//android.view.ViewGroup[@content-desc="Copy Email address"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyEmailAddressButtonText: '//android.widget.TextView[@text="Copy Email address"]',
emailAddressThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Email address"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
/* =====================================================
        CREATED NOTE
===================================================== */
createdNoteThreeDotsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',
copyNoteButton: '~Copy Note',
copyNoteIcon: '//android.view.ViewGroup[@content-desc="Copy Note"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyNoteButtonText: '//android.widget.TextView[@text="Copy Note"]',
noteThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Note"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
/* =====================================================
        CREATED CUSTOM ELEMENT
===================================================== */
createdCustomElementThreeDotsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',

/* =====================================================
        FAVORITE BADGES
===================================================== */
favoriteBadgeOnLoginItem: '//android.view.ViewGroup[@resource-id="favorite-badge"]',
favoriteBadgeOnCreditCardItem: '',
favoriteBadgeOnWifiItem: '',
favoriteBadgeOnRecoveryPhraseItem: '',
favoriteBadgeOnIdentityItem: '',
favoriteBadgeOnNoteItem: '',
favoriteBadgeOnCustomElementItem: '',

/* =====================================================
        CREATED LOGIN ITEM PAGE
===================================================== */
backButtonLoginItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
favoriteButtonUncheckedLoginItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/com.horcrux.svg.SvgView',
favoriteButtonCheckedLoginItemPage: '',


editButtonLoginItemPage: '~Edit',
editButtonIconLoginItemPage: '//android.view.ViewGroup[@content-desc="Edit"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
editButtonTextLoginItemPage: '//android.widget.TextView[@text="Edit"]',
threeDotsButtonLoginItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[5]/com.horcrux.svg.SvgView',

avatarImageLoginItemPage: '//android.widget.ImageView[@resource-id="avatar-image"]',
titleLoginItemPage: '//android.widget.TextView[@text="Login to Google"]',

emailOrUserNameFieldLoginItemPage: '~ Email or username ',
emailOrUserNameFieldIconLoginItemPage: '//android.view.ViewGroup[@content-desc=" Email or username "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
emailOrUserNameFieldTitleLoginItemPage: '//android.widget.TextView[@text=" Email or username "]',
emailOrUserNameFieldInputLoginItemPage: '//android.widget.TextView[@text="test@gmail.com"]',
emailOrUserNameFieldCopyButtonLoginItemPage: '//android.view.ViewGroup[@content-desc=" Email or username "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

passwordFieldLoginItemPage: '~ Password ',
passwordFieldIconLoginItemPage: '//android.view.ViewGroup[@content-desc=" Password "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
passwordFieldTitleLoginItemPage: '//android.widget.TextView[@text=" Password "]',
passwordFieldInputLoginItemPage: '//android.widget.TextView[@text="••••••"]',
passwordFieldInputShowLoginItemPage: '//android.widget.TextView[@text="123456"]',
passwordFieldCopyButtonLoginItemPage: '//android.view.ViewGroup[@content-desc=" Password "]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
passwordFieldShowPasswordButtonLoginItemPage: '//android.view.ViewGroup[@content-desc=" Password "]/android.view.ViewGroup[1]/com.horcrux.svg.SvgView',
passwordFieldHidePasswordButtonLoginItemPage: '//android.view.ViewGroup[@content-desc=" Password , 123456"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',

websiteFieldLoginItemPage: '~ Website ',
websiteFieldIconLoginItemPage: '//android.view.ViewGroup[@content-desc=" Website "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
websiteFieldTitleLoginItemPage: '//android.widget.TextView[@text=" Website "]',
websiteFieldInputLoginItemPage: '//android.widget.TextView[@text="https://google.com"]',
websiteFieldCopyButtonLoginItemPage: '//android.view.ViewGroup[@content-desc=" Website "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

fileFieldLoginItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[4]',
fileFieldIconLoginItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
fileFieldTitleLoginItemPage: '//android.widget.TextView[@text="File"]',
fileFieldInputLoginItemPage: '//android.widget.TextView[@text="owners-manual.pdf"]',

openedFilePopup: '//android.widget.TabHost[@resource-id="android:id/profile_tabhost"]',
openedFilePopupTitle: '//android.widget.TextView[@resource-id="android:id/content_preview_filename"]',
openedFilePopupQuickShareButton: '//android.widget.Button[@resource-id="android:id/chooser_nearby_button"]',

notesFieldLoginItemPage: '~ Note ',
notesFieldIconLoginItemPage: '//android.view.ViewGroup[@content-desc=" Note "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
notesFieldTitleLoginItemPage: '//android.widget.TextView[@text=" Note "]',
notesFieldInputLoginItemPage: '//android.widget.TextView[@text="This is a test note"]',
notesFieldCopyButtonLoginItemPage: '//android.view.ViewGroup[@content-desc=" Note "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

copyToastLoginItemPage: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
copyToastTextLoginItemPage: '//android.widget.TextView[@text="Copied!"]',

/* =====================================================
        THREE DOTS MENU POPUP ON LOGIN ITEM PAGE
===================================================== */
threeDotsMenuPopupOnLoginItemPage: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',

moveToAnotherFolderButton: '~Move to another folder',
moveToAnotherFolderIcon: '//android.view.ViewGroup[@content-desc="Move to another folder"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
moveToAnotherFolderButtonText: '//android.widget.TextView[@text="Move to another folder"]',
moveToAnotherFolderThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Move to another folder"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

markAsFavoriteButtonOnLoginItemPage: '~Mark as favorite',
markAsFavoriteIconOnLoginItemPage: '//android.view.ViewGroup[@content-desc="Mark as favorite"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
markAsFavoriteButtonTextOnLoginItemPage: '//android.widget.TextView[@text="Mark as favorite"]',
markAsFavoriteThreeDotsIconOnLoginItemPage: '//android.view.ViewGroup[@content-desc="Mark as favorite"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

removeFromFavoritesButtonOnLoginItemPage: '~Remove from Favorites',
removeFromFavoritesIconOnLoginItemPage: '//android.view.ViewGroup[@content-desc="Remove from Favorites"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
removeFromFavoritesButtonTextOnLoginItemPage: '//android.widget.TextView[@text="Remove from Favorites"]',
removeFromFavoritesThreeDotsIconOnLoginItemPage: '//android.view.ViewGroup[@content-desc="Remove from Favorites"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

deleteElementButtonOnLoginItemPage: '~Delete element',
deleteElementIconOnLoginItemPage: '//android.view.ViewGroup[@content-desc="Delete element"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
deleteElementButtonTextOnLoginItemPage: '//android.widget.TextView[@text="Delete element"]',
deleteElementThreeDotsIconOnLoginItemPage: '//android.view.ViewGroup[@content-desc="Delete element"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
/* =====================================================
        DELETE POPUP
===================================================== */
deletePopup: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]',
deletePopupTitle: '//android.widget.TextView[@text="Delete item"]',
deletePopupText: '//android.widget.TextView[@text="Are you sure that you want to delete this item?"]',
deletePopupConfirmButton: '~Confirm',
deletePopupConfirmButtonText: '//android.widget.TextView[@text="Confirm"]',
deletePopupCancelButton: '~Cancel',
deletePopupCancelButtonText: '//android.widget.TextView[@text="Cancel"]',
/* =====================================================
        MOVE TO ANOTHER FOLDER POPUP
===================================================== */
moveToAnotherFolderPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',
createNewFolderButton: '~Create new',
plusIcon: '//android.view.ViewGroup[@content-desc="Create new"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
createNewFolderButtonText: '//android.widget.TextView[@text="Create new"]',

newFolderButtonInPopUpMenuMoveToAnotherFolder: '~TestFolder3, 1 items',
newFolderIconInPopUpMenuMoveToAnotherFolder: '//android.view.ViewGroup[@content-desc="TestFolder3, 1 items"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
newFolderTitleInPopUpMenuMoveToAnotherFolder: '(//android.widget.TextView[@text="TestFolder3"])[1]',
newFolderButtonTextInPopUpMenuMoveToAnotherFolder: '//android.widget.TextView[@text="1 items"]',

testFolderIconOnLoginItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
testFolderTitleOnLoginItemPage: '//android.widget.TextView[@text="TestFolder3"]',





}
export default createdLoginItemLocators;