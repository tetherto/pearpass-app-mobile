const createdWiFiItemLocators = {
/* =====================================================
CREATED WIFI ITEM
===================================================== */
createdWiFiItemOnHomePage: '~TW',

createdWiFiItemThreeDotsButton: '//android.view.ViewGroup[@content-desc="TW"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
createdWiFiItemThreeDotsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',

copyWiFiPasswordButton: '~Copy Wi-Fi Password',
copyWiFiPasswordIcon: '//android.view.ViewGroup[@content-desc="Copy Wi-Fi Password"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
copyWiFiPasswordButtonText: '//android.widget.TextView[@text="Copy Wi-Fi Password"]',
copyWifiPasswordThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Wi-Fi Password"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

markAsFavoriteButton: '~Mark as favorite',
markAsFavoriteIcon: '//android.view.ViewGroup[@content-desc="Mark as favorite"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
markAsFavoriteButtonText: '//android.widget.TextView[@text="Mark as favorite"]',
markAsFavoriteThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Mark as favorite"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
markAsFavoriteBadgeOnHomePage: '//android.view.ViewGroup[@resource-id="favorite-badge"]',

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
CREATED WIFI ITEM PAGE
===================================================== */
backButtonWiFiItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
favoriteButtonUncheckedWiFiItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/com.horcrux.svg.SvgView',
favoriteButtonCheckedWiFiItemPage: '',

editButtonWiFiItemPage: '~Edit',
editButtonIconWiFiItemPage: '//android.view.ViewGroup[@content-desc="Edit"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
editButtonTextWiFiItemPage: '//android.widget.TextView[@text="Edit"]',
threeDotsButtonWiFiItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[5]/com.horcrux.svg.SvgView',

avatarImageWiFiItemPageIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[6]',
avatarImageWiFiItemPageText: '//android.widget.TextView[@text="TW"]',
titleWiFiItemPageOnCreatedWiFiItemPage: '//android.widget.TextView[@text="Test Wi-Fi Network"]',

wifiPasswordFieldWiFiItemPage: '~ Wi-Fi Password , Scan the QR-Code to connect to the Wi-Fi',
wifiPasswordFieldWiFiItemPageIcon: '//android.view.ViewGroup[@content-desc=" Wi-Fi Password , Scan the QR-Code to connect to the Wi-Fi"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
wifiPasswordFieldWiFiItemPageTitle: '//android.widget.TextView[@text=" Wi-Fi Password "]',
wifiPasswordFieldWiFiItemPageInputHidden: '//android.widget.TextView[@text="•••••••••••••••"]',
wifiPasswordFieldWiFiItemPageInputVisible: '(//android.widget.TextView[@text="TestPassword123"])[1]',
wifiPasswordFieldWiFiItemPageShowPasswordIconButton: '//android.view.ViewGroup[@content-desc=" Wi-Fi Password , TestPassword123, Scan the QR-Code to connect to the Wi-Fi"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
wifiPasswordFieldWiFiItemPageCopyButton: '//android.view.ViewGroup[@content-desc=" Wi-Fi Password , TestPassword123, Scan the QR-Code to connect to the Wi-Fi"]/android.view.ViewGroup[3]/com.horcrux.svg.SvgView',

passwordCopiedToast: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
passwordCopiedToastText: '//android.widget.TextView[@text="Copied!"]',

qrCodeWiFiItemPageField: '//android.view.ViewGroup[@content-desc=" Wi-Fi Password , TestPassword123, Scan the QR-Code to connect to the Wi-Fi"]/android.view.ViewGroup[4]',
qrCodeWiFiItemPageFieldTitle: '//android.widget.TextView[@text="Scan the QR-Code to connect to the Wi-Fi"]',
qrCodeWiFiItemPageFieldCode: '//android.view.ViewGroup[@content-desc=" Wi-Fi Password , TestPassword123, Scan the QR-Code to connect to the Wi-Fi"]/android.view.ViewGroup[5]',

noteFieldWiFiItemPage: '~ Note ',
noteFieldWiFiItemPageIcon: '//android.view.ViewGroup[@content-desc=" Note "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
noteFieldWiFiItemPageTitle: '//android.widget.TextView[@text=" Note "]',
noteFieldWiFiItemPageInput: '//android.widget.TextView[@text="Test note for Wi-Fi"]',
noteFieldWiFiItemPageCopyButton: '//android.view.ViewGroup[@content-desc=" Note "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

updatedCommentFieldTextWiFiItemPage: '//android.widget.TextView[@text="Updated test note for Wi-Fi"]',

};

export default createdWiFiItemLocators;