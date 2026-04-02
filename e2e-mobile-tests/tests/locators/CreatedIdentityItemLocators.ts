const createdIdentityItemLocators = {
/* =====================================================
    CREATED IDENTITY ITEM
===================================================== */
    createdIdentityItemOnHomePage: '~TI',

    createdIdentityThreeDotsButton: '//android.view.ViewGroup[@content-desc="TI"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
    createdIdentityThreeDotsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',

    copyFullNameButton: '~Copy Full name',
    copyFullNameIcon: '//android.view.ViewGroup[@content-desc="Copy Full name"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    copyFullNameButtonText: '//android.widget.TextView[@text="Copy Full name"]',
    fullNameThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Full name"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

    copyEmailAddressButton: '~Copy Email address',
    copyEmailAddressIcon: '//android.view.ViewGroup[@content-desc="Copy Email address"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    copyEmailAddressButtonText: '//android.widget.TextView[@text="Copy Email address"]',
    emailAddressThreeDotsIcon: '//android.view.ViewGroup[@content-desc="Copy Email address"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    
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
    CREATED IDENTITY ITEM PAGE
===================================================== */

    backButtonIdentityItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',

    favoriteButtonUncheckedIdentityItemPage: '',
    favoriteButtonCheckedIdentityItemPage: '',

    editButtonIdentityItemPage: '~Edit',
    editButtonIconIdentityItemPage: '//android.view.ViewGroup[@content-desc="Edit"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    editButtonTextIdentityItemPage: '//android.widget.TextView[@text="Edit"]',

    threeDotsButtonIdentityItemPage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[5]/com.horcrux.svg.SvgView',

    avatarImageIdentityItemPageIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[6]',
    avatarImageIdentityItemPageText: '//android.widget.TextView[@text="TI"]',
    titleIdentityItemPageOnCreatedIdentityItemPage: '//android.widget.TextView[@text="Test Identity Title"]',
/* =====================================================
    PERSONAL INFORMATION
===================================================== */
    personalInformationIcon: '//android.view.ViewGroup[@content-desc="Personal information"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    personalInformationTitle: '//android.widget.TextView[@text="Personal information"]',

    fullNameField: '~ Full name ',
    fullNameFieldIcon: '//android.view.ViewGroup[@content-desc=" Full name "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    fullNameFieldTitle: '//android.widget.TextView[@text=" Full name "]',
    fullNameFieldInput: '//android.widget.TextView[@text="Ivan Ivanov"]',
    fullNameFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Full name "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    emailField: '~ Email ',
    emailFieldIcon: '//android.view.ViewGroup[@content-desc=" Email "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    emailFieldTitle: '//android.widget.TextView[@text=" Email "]',
    emailFieldInput: '//android.widget.TextView[@text="ivan.ivanov@example.com"]',
    emailFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Email "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    phoneNumberField: '~ Phone number ',
    phoneNumberFieldIcon: '//android.view.ViewGroup[@content-desc=" Phone number "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    phoneNumberFieldTitle: '//android.widget.TextView[@text=" Phone number "]',
    phoneNumberFieldInput: '//android.widget.TextView[@text="+1234567890"]',
    phoneNumberFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Phone number "]/android.view.ViewGroup/com.horcrux.svg.SvgView',
    
/* =====================================================
    DETAIL OF ADDRESS
===================================================== */

    detailOfAddressIcon: '//android.view.ViewGroup[@content-desc="Detail of address"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    detailOfAddressTitle: '//android.widget.TextView[@text="Detail of address"]',

    addressField: '~ Address ',
    addressFieldTitle: '//android.widget.TextView[@text=" Address "]',
    addressFieldInput: '//android.widget.TextView[@text="123 Main St"]',
    addressFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Address "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    zipField: '~ ZIP ',
    zipFieldTitle: '//android.widget.TextView[@text=" ZIP "]',
    zipFieldInput: '//android.widget.TextView[@text="12345"]',
    zipFieldCopyButton: '//android.view.ViewGroup[@content-desc=" ZIP "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    cityField: '~ City ',
    cityFieldTitle: '//android.widget.TextView[@text=" City "]',
    cityFieldInput: '//android.widget.TextView[@text="New York"]',
    cityFieldCopyButton: '//android.view.ViewGroup[@content-desc=" City "]/android.view.ViewGroup/com.horcrux.svg.SvgView',
    
    regionField: '~ Region ',
    regionFieldTitle: '//android.widget.TextView[@text=" Region "]',
    regionFieldInput: '//android.widget.TextView[@text="NY"]',
    regionFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Region "]/android.view.ViewGroup/com.horcrux.svg.SvgView',



    countryField: '~ Country ',
    countryFieldTitle: '//android.widget.TextView[@text=" Country "]',
    countryFieldInput: '//android.widget.TextView[@text="USA"]',
    countryFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Country "]/android.view.ViewGroup/com.horcrux.svg.SvgView',
    
/* =====================================================
    PASSPORT
===================================================== */    
    passportIcon: '//android.view.ViewGroup[@content-desc="Passport"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportTitle: '//android.widget.TextView[@text="Passport"]',

    passportFullNameField: '~ Full name ',
    passportFullNameFieldIcon: '//android.view.ViewGroup[@content-desc=" Full name "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportFullNameFieldTitle: '//android.widget.TextView[@text=" Full name "]',
    passportFullNameFieldInput: '//android.widget.TextView[@text="Ivan Ivanov"]',
    passportFullNameFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Full name "]/android.view.ViewGroup/com.horcrux.svg.SvgView',
    
    passportNumberField: '~ Passport number ',
    passportNumberFieldIcon: '//android.view.ViewGroup[@content-desc=" Passport number "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportNumberFieldTitle: '//android.widget.TextView[@text=" Passport number "]',
    passportNumberFieldInput: '//android.widget.TextView[@text="AB1234567"]',
    passportNumberFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Passport number "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    passportIssuingCountryField: '~ Issuing country ',
    passportIssuingCountryFieldIcon: '//android.view.ViewGroup[@content-desc=" Issuing country "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportIssuingCountryFieldTitle: '//android.widget.TextView[@text=" Issuing country "]',
    passportIssuingCountryFieldInput: '//android.widget.TextView[@text="USA"]',
    passportIssuingCountryFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Issuing country "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    passportDateOfIssueField: '~ Date of issue ',
    passportDateOfIssueFieldIcon: '//android.view.ViewGroup[@content-desc=" Date of issue "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportDateOfIssueFieldTitle: '//android.widget.TextView[@text=" Date of issue "]',
    passportDateOfIssueFieldInput: '//android.widget.TextView[@text="01.01.2020"]',
    passportDateOfIssueFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Date of issue "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    passportExpiryDateField: '~ Expiry date ',
    passportExpiryDateFieldIcon: '//android.view.ViewGroup[@content-desc=" Expiry date "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportExpiryDateFieldTitle: '//android.widget.TextView[@text=" Expiry date "]',
    passportExpiryDateFieldInput: '//android.widget.TextView[@text="01.01.2025"]',
    passportExpiryDateFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Expiry date "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    passportNationalityField: '~ Nationality ',
    passportNationalityFieldIcon: '//android.view.ViewGroup[@content-desc=" Nationality "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportNationalityFieldTitle: '//android.widget.TextView[@text=" Nationality "]',
    passportNationalityFieldInput: '//android.widget.TextView[@text="USA"]',
    passportNationalityFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Nationality "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    passportDateOfBirthField: '~ Date of birth ',
    passportDateOfBirthFieldIcon: '//android.view.ViewGroup[@content-desc=" Date of birth "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportDateOfBirthFieldTitle: '//android.widget.TextView[@text=" Date of birth "]',
    passportDateOfBirthFieldInput: '//android.widget.TextView[@text="01.01.1990"]',
    passportDateOfBirthFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Date of birth "]/android.view.ViewGroup/com.horcrux.svg.SvgView',
    
    passportGenderField: '~ Gender ',
    passportGenderFieldIcon: '//android.view.ViewGroup[@content-desc=" Gender "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportGenderFieldTitle: '//android.widget.TextView[@text=" Gender "]',
    passportGenderFieldInput: '//android.widget.TextView[@text="M"]',
    passportGenderFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Gender "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    passportPictureField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
    passportPictureFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportPictureFieldTitle: '//android.widget.TextView[@text="Passport picture"]',
    passportPicture: '//android.widget.ImageView',

/* =====================================================
    IDENTITY CARD
===================================================== */    

    identityCardIcon: '//android.view.ViewGroup[@content-desc="Identity card"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardTitle: '//android.widget.TextView[@text="Identity card"]',

    identityCardNumberField: '~ ID number ',
    identityCardNumberFieldIcon: '//android.view.ViewGroup[@content-desc=" ID number "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardNumberFieldTitle: '//android.widget.TextView[@text=" ID number "]',
    identityCardNumberFieldInput: '//android.widget.TextView[@text="987654321"]',
    identityCardNumberFieldCopyButton: '//android.view.ViewGroup[@content-desc=" ID number "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    identityCardCreationDateField: '~ Creation date ',
    identityCardCreationDateFieldIcon: '//android.view.ViewGroup[@content-desc=" Creation date "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardCreationDateFieldTitle: '//android.widget.TextView[@text=" Creation date "]',
    identityCardCreationDateFieldInput: '//android.widget.TextView[@text="01.01.2020"]',

    identityCardExpiryDateField: '~ Expiry date ',
    identityCardExpiryDateFieldIcon: '//android.view.ViewGroup[@content-desc=" Expiry date "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardExpiryDateFieldTitle: '//android.widget.TextView[@text=" Expiry date "]',
    identityCardExpiryDateFieldInput: '//android.widget.TextView[@text="01.01.2025"]',
    identityCardExpiryDateFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Expiry date "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    identityCardIssuingCountryField: '~ Issuing country ',
    identityCardIssuingCountryFieldIcon: '//android.view.ViewGroup[@content-desc=" Issuing country "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardIssuingCountryFieldTitle: '//android.widget.TextView[@text=" Issuing country "]',
    identityCardIssuingCountryFieldInput: '//android.widget.TextView[@text="USA"]',
    identityCardIssuingCountryFieldCopyButton: '//android.view.ViewGroup[@content-desc=" Issuing country "]/android.view.ViewGroup/com.horcrux.svg.SvgView',

    identityCardPictureField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]',
    identityCardPictureFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardPictureFieldTitle: '//android.widget.TextView[@text="ID card picture"]',
    identityCardPicture: '//android.widget.ImageView',

}

export default createdIdentityItemLocators;
