const createdCreditCardsLocators = {
/* =====================================================
        CREATED CREDIT CARD
===================================================== */
createdCreditCardsItemOnHomePage: '~TC',

createdCreditCardThreeDotsButton: '//android.view.ViewGroup[@content-desc="TC"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
createdCreditCardThreeDotsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',

copyNameOnCardButton: '~Copy Name on card',
copyNameOnCardIcon: '//android.view.ViewGroup[@content-desc="Copy Name on card"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyNameOnCardButtonText: '//android.widget.TextView[@text="Copy Name on card"]',
nameOnCardThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Name on card"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

copyNumberOnCardButton: '~Copy Number on card',
copyNumberOnCardIcon: '//android.view.ViewGroup[@content-desc="Copy Number on card"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyNumberOnCardButtonText: '//android.widget.TextView[@text="Copy Number on card"]',
numberOnCardThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Number on card"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

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

favoriteBadgeOnCreditCardItem: '//android.view.ViewGroup[@resource-id="favorite-badge"]',

/* =====================================================
        CREATED CREDIT CARD ITEM PAGE
===================================================== */
backButtonCreditCardsItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
favoriteButtonUncheckedCreditCardsItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/com.horcrux.svg.SvgView',
favoriteButtonCheckedCreditCardsItemPage: '',

editButtonCreditCardsItemPage: '~Edit',
editButtonIconCreditCardsItemPage: '//android.view.ViewGroup[@content-desc="Edit"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
editButtonTextCreditCardsItemPage: '//android.widget.TextView[@text="Edit"]',

threeDotsButtonCreditCardsItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[5]/com.horcrux.svg.SvgView',

avatarImageCreditCardsItemPageIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[6]',
avatarImageCreditCardsItemPage: '//android.widget.TextView[@text="TC"]',

titleCreditCardsItemPage: '//android.widget.TextView[@text="Test Credit Card"]',

nameOnCardFieldCreditCardsItemPage: '~ Name on card ',
nameOnCardFieldCreditCardsItemPageIcon: '//android.view.ViewGroup[@content-desc=" Name on card "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
nameOnCardFieldCreditCardsItemPageTitle: '//android.widget.TextView[@text=" Name on card "]',
nameOnCardFieldCreditCardsItemPageInput: '//android.widget.TextView[@text="Ivan Ivanov"]',
nameOnCardFieldCreditCardsItemPageCopyButton: '//android.view.ViewGroup[@content-desc=" Name on card "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

numberOnCardFieldCreditCardsItemPage: '~  Number on card ',
numberOnCardFieldCreditCardsItemPageIcon: '//android.view.ViewGroup[@content-desc=" Number on card "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
numberOnCardFieldCreditCardsItemPageTitle: '//android.widget.TextView[@text=" Number on card "]',
numberOnCardFieldCreditCardsItemPageInput: '//android.widget.TextView[@text="3333 3333 3333 3333"]',
numberOnCardFieldCreditCardsItemPageCopyButton: '//android.view.ViewGroup[@content-desc=" Number on card "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

expirationDateFieldCreditCardsItemPage: '~  Date of expire ',
expirationDateFieldCreditCardsItemPageIcon: '//android.view.ViewGroup[@content-desc=" Date of expire "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
expirationDateFieldCreditCardsItemPageTitle: '//android.widget.TextView[@text=" Date of expire "]',
expirationDateFieldCreditCardsItemPageInput: '//android.widget.TextView[@text="12 25"]',
expirationDateFieldCreditCardsItemPageCopyButton: '//android.view.ViewGroup[@content-desc=" Date of expire "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

securityCodeFieldCreditCardsItemPage: '~  Security code ',
securityCodeFieldCreditCardsItemPageIcon: '//android.view.ViewGroup[@content-desc=" Security code "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
securityCodeFieldCreditCardsItemPageTitle: '//android.widget.TextView[@text=" Security code "]',
securityCodeFieldCreditCardsItemPageInputHidden: '//android.widget.TextView[@text="•••"]',
securityCodeFieldCreditCardsItemPageInputVisible: '(//android.widget.TextView[@text="333"])[1]',
securityCodeFieldCreditCardsItemPageShowPasswordIconButton: '//android.view.ViewGroup[@content-desc=" Security code "]/android.view.ViewGroup[1]/com.horcrux.svg.SvgView',
securityCodeFieldCreditCardsItemPageCopyButton: '//android.view.ViewGroup[@content-desc=" Security code "]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',

pinCodeFieldCreditCardsItemPage: '~ Pin code ',
pinCodeFieldCreditCardsItemPageIcon: '//android.view.ViewGroup[@content-desc=" Pin code "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
pinCodeFieldCreditCardsItemPageTitle: '//android.widget.TextView[@text=" Pin code "]',
pinCodeFieldCreditCardsItemPageInputHidden: '//android.widget.TextView[@text="••••"]',
pinCodeFieldCreditCardsItemPageInputVisible: '(//android.widget.TextView[@text="3333"])[1]',
pinCodeFieldCreditCardsItemPageShowPasswordIconButton: '//android.view.ViewGroup[@content-desc=" Pin code "]/android.view.ViewGroup[1]/com.horcrux.svg.SvgView',
pinCodeFieldCreditCardsItemPageCopyButton: '//android.view.ViewGroup[@content-desc=" Pin code "]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',

fileFieldCreditCardsItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[6]',
fileFieldCreditCardsItemPageIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
fileFieldCreditCardsItemPageTitle: '//android.widget.TextView[@text="File"]',
fileFieldCreditCardsItemPageText: '//android.widget.TextView[@text="Test.docx"]',

notesFieldCreditCardsItemPage: '~ Note ',
notesFieldCreditCardsItemPageIcon: '//android.view.ViewGroup[@content-desc=" Note "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
notesFieldCreditCardsItemPageTitle: '//android.widget.TextView[@text=" Note "]',
notesFieldCreditCardsItemPageInput: '//android.widget.TextView[@text="Test note for credit card"]',
notesFieldCreditCardsItemPageCopyButton: '//android.view.ViewGroup[@content-desc=" Note "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

toastMessageCreditCardsItemPage: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
toastMessageTextCreditCardsItemPage: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',



};
export default createdCreditCardsLocators;
