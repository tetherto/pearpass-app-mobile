const createIdentityLocators = {
/* =====================================================
        TITLE FIELD
===================================================== */
    titleField: '~Title field',
    titleFieldTitle: '//android.widget.TextView[@text=" Title "]',
    titleFieldInput: '~Title input field',
/* =====================================================
        PERSONAL INFORMATION
===================================================== */
    personalInformationIcon: '//android.view.ViewGroup[@content-desc="Personal information"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    personalInformationTitle: '//android.widget.TextView[@text="Personal information"]',
/* =====================================================
        FULL NAME FIELD
===================================================== */
    fullNameField: '~Full name field',
    fullNameFieldIcon: '//android.view.ViewGroup[@content-desc="Full name field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    fullNameFieldTitle: '//android.widget.TextView[@text=" Full name "]',
    fullNameFieldInput: '~Full name input field',
/* =====================================================
        EMAIL FIELD
===================================================== */
    emailField: '~Email field',
    emailFieldIcon: '//android.view.ViewGroup[@content-desc="Email field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    emailFieldTitle: '//android.widget.TextView[@text=" Email "]',
    emailFieldInput: '~Email input field',
/* =====================================================
        PHONE NUMBER FIELD
===================================================== */
    phoneNumberField: '~Phone number field',
    phoneNumberFieldIcon: '//android.view.ViewGroup[@content-desc="Phone number field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    phoneNumberFieldTitle: '//android.widget.TextView[@text=" Phone number "]',
    phoneNumberFieldInput: '~Phone number input field',
/* =====================================================
        DETAIL OF ADDRESS
===================================================== */
    detailOfAddressIcon: '//android.view.ViewGroup[@content-desc="Detail of address"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    detailOfAddressTitle: '//android.widget.TextView[@text="Detail of address"]',
/* =====================================================
        ADDRESS FIELD
===================================================== */
    addressField: '~Address field',
    addressFieldTitle: '//android.widget.TextView[@text=" Address "]',
    addressFieldInput: '~Address input field',
/* =====================================================
        ZIP FIELD
===================================================== */
    zipField: '~ZIP field',
    zipFieldTitle: '//android.widget.TextView[@text=" ZIP "]',
    zipFieldInput: '~ZIP input field',
/* =====================================================
        CITY FIELD
===================================================== */
    cityField: '~City field',
    cityFieldTitle: '//android.widget.TextView[@text=" City "]',
    cityFieldInput: '~City input field',
/* =====================================================
        REGION FIELD
===================================================== */    
    regionField: '~Region field',
    regionFieldTitle: '//android.widget.TextView[@text=" Region "]',
    regionFieldInput: '~Region input field',
/* =====================================================
        COUNTRY FIELD
===================================================== */
    countryField: '~Country field',
    countryFieldTitle: '//android.widget.TextView[@text=" Country "]',
    countryFieldInput: '~Country input field',
/* =====================================================
        PASSPORT FIELD
===================================================== */
    passportFieldIcon: '//android.view.ViewGroup[@content-desc="Passport"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportFieldTitle: '//android.widget.TextView[@text="Passport"]',
/* =====================================================
        PASSPORT FULL NAME FIELD
===================================================== */
    passportFullNameField: '~Passport full name input field',
    passportFullNameFieldIcon: '//android.view.ViewGroup[@content-desc="Passport full name field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportFullNameFieldTitle: '//android.widget.TextView[@text=" Full name "]',
    passportFullNameFieldInput: '~Passport full name input field',
/* =====================================================
        PASSPORT NUMBER FIELD
===================================================== */
    passportNumberField: '~Passport number field',
    passportNumberFieldIcon: '//android.view.ViewGroup[@content-desc="Passport number field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportNumberFieldTitle: '//android.widget.TextView[@text=" Passport number "]',
    passportNumberFieldInput: '~Passport number input field',
/* =====================================================
        PASSPORT ISSUING COUNTRY FIELD
===================================================== */
    passportIssuingCountryField: '~Passport issuing country field',
    passportIssuingCountryFieldIcon: '//android.view.ViewGroup[@content-desc="Passport issuing country field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportIssuingCountryFieldTitle: '//android.widget.TextView[@text=" Issuing country "]',
    passportIssuingCountryFieldInput: '~Passport issuing country input field',
/* =====================================================    
        PASSPORT DATE OF ISSUE FIELD    
===================================================== */
    passportDateOfIssueField: '~Passport date of issue field',
    passportDateOfIssueFieldIcon: '//android.view.ViewGroup[@content-desc="Passport date of issue field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportDateOfIssueFieldTitle: '//android.widget.TextView[@text=" Date of issue "]',
    passportDateOfIssueFieldInput: '~Passport date of issue input field',
/* =====================================================
        PASSPORT EXPIRY DATE FIELD
===================================================== */
    passportExpiryDateField: '~Passport expiry date field',
    passportExpiryDateFieldIcon: '//android.view.ViewGroup[@content-desc="Passport expiry date field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportExpiryDateFieldTitle: '//android.widget.TextView[@text=" Expiry date "]',
    passportExpiryDateFieldInput: '~Passport expiry date input field',
/* =====================================================
        PASSPORT NATIONALITY FIELD
===================================================== */
    passportNationalityField: '~Passport nationality field',
    passportNationalityFieldIcon: '//android.view.ViewGroup[@content-desc="Passport nationality field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportNationalityFieldTitle: '//android.widget.TextView[@text=" Nationality "]',
    passportNationalityFieldInput: '~Passport nationality input field',
/* =====================================================
        PASSPORT DATE OF BIRTH FIELD
===================================================== */
    passportDateOfBirthField: '~Passport date of birth field',
    passportDateOfBirthFieldIcon: '//android.view.ViewGroup[@content-desc="Passport date of birth field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportDateOfBirthFieldTitle: '//android.widget.TextView[@text=" Date of birth "]',
    passportDateOfBirthFieldInput: '~Passport date of birth input field',
/* =====================================================
        PASSPORT GENDER FIELD
===================================================== */
    passportGenderField: '~Passport gender field',
    passportGenderFieldIcon: '//android.view.ViewGroup[@content-desc="Passport gender field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportGenderFieldTitle: '//android.widget.TextView[@text=" Gender "]',
    passportGenderFieldInput: '~Passport gender input field',
/* =====================================================
        PASSPORT PICTURE FIELD
===================================================== */
    passportPictureField: '~Passport picture field',
    passportPictureFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportPictureFieldTitle: '//android.widget.TextView[@text="Passport picture"]',
    passportPicturePlusButton: '~Add passport picture button',
    passportPicturePlusButtonIcon: '//android.view.ViewGroup[@content-desc="Add passport picture button"]/com.horcrux.svg.SvgView',
/* =====================================================
        IDENTITY CARD FIELD
===================================================== */
    identityCardFieldIcon: '//android.view.ViewGroup[@content-desc="Identity card"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardFieldTitle: '//android.widget.TextView[@text="Identity card"]',
/* =====================================================
        ID NUMBER FIELD
===================================================== */
    identityCardNumberField: '~ID number field',
    identityCardNumberFieldIcon: '//android.view.ViewGroup[@content-desc="ID number field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardNumberFieldTitle: '//android.widget.TextView[@text=" ID number "]',
    identityCardNumberFieldInput: '~ID number input field',
/* =====================================================
        CREATION DATE FIELD
===================================================== */
    identityCardCreationDateField: '~Identity card creation date field',
    identityCardCreationDateFieldIcon: '//android.view.ViewGroup[@content-desc="Identity card creation date field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardCreationDateFieldTitle: '//android.widget.TextView[@text=" Creation date "]',
    identityCardCreationDateFieldInput: '~Identity card creation date input field',
/* =====================================================
        EXPIRY DATE FIELD
===================================================== */
    identityCardExpiryDateField: '~Identity card expiry date field',
    identityCardExpiryDateFieldIcon: '//android.view.ViewGroup[@content-desc="Identity card expiry date field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardExpiryDateFieldTitle: '//android.widget.TextView[@text=" Expiry date "]',
    identityCardExpiryDateFieldInput: '~Identity card expiry date input field',
/* =====================================================    
        ISSUING COUNTRY FIELD
===================================================== */
    identityCardIssuingCountryField: '~Identity card issuing country field',
    identityCardIssuingCountryFieldIcon: '//android.view.ViewGroup[@content-desc="Identity card issuing country field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardIssuingCountryFieldTitle: '//android.widget.TextView[@text=" Issuing country "]',
    identityCardIssuingCountryFieldInput: '~Identity card issuing country input field',
/* =====================================================
        ID CARD PICTURE FIELD
===================================================== */
    identityCardPictureField: '~Id card picture field',
    identityCardPictureFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardPictureFieldTitle: '//android.widget.TextView[@text="ID card picture"]',
    identityCardPicturePlusButton: '~Add id card picture button',
    identityCardPicturePlusButtonIcon: '//android.view.ViewGroup[@content-desc="Add id card picture button"]/com.horcrux.svg.SvgView',
/* =====================================================
        DRIVING LICENSE FIELD
===================================================== */
    drivingLicenseFieldIcon: '//android.view.ViewGroup[@content-desc="Driving license"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    drivingLicenseFieldTitle: '//android.widget.TextView[@text="Driving license"]',
/* =====================================================
        DRIVING LICENSE ID NUMBER FIELD
===================================================== */
    drivingLicenseIdNumberField: '~Driving license ID number field',
    drivingLicenseIdNumberFieldIcon: '//android.view.ViewGroup[@content-desc="Driving license ID number field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    drivingLicenseIdNumberFieldTitle: '//android.widget.TextView[@text=" ID number "]',
    drivingLicenseIdNumberFieldInput: '~Driving license ID number input field',
/* =====================================================
        DRIVING LICENSE CREATION DATE FIELD
===================================================== */
    drivingLicenseCreationDateField: '~Driving license creation date field',
    drivingLicenseCreationDateFieldIcon: '//android.view.ViewGroup[@content-desc="Driving license creation date field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    drivingLicenseCreationDateFieldTitle: '//android.widget.TextView[@text=" Creation date "]',
    drivingLicenseCreationDateFieldInput: '~Driving license creation date input field', 
/* =====================================================
        DRIVING LICENSE EXPIRY DATE FIELD
===================================================== */
    drivingLicenseExpiryDateField: '~Driving license expiry date field',
    drivingLicenseExpiryDateFieldIcon: '//android.view.ViewGroup[@content-desc="Driving license expiry date field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    drivingLicenseExpiryDateFieldTitle: '//android.widget.TextView[@text=" Expiry date "]',
    drivingLicenseExpiryDateFieldInput: '~Driving license expiry date input field',
/* =====================================================
        DRIVING LICENSE ISSUING COUNTRY FIELD
===================================================== */
    drivingLicenseIssuingCountryField: '~Driving license issuing country field',
    drivingLicenseIssuingCountryFieldIcon: '//android.view.ViewGroup[@content-desc="Driving license issuing country field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    drivingLicenseIssuingCountryFieldTitle: '//android.widget.TextView[@text=" Issuing country "]',
    drivingLicenseIssuingCountryFieldInput: '~Driving license issuing country input field',
/* =====================================================
        DRIVING LICENSE PICTURE FIELD
===================================================== */
    drivingLicensePictureField: '~Driving license picture field',
    drivingLicensePictureFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    drivingLicensePictureFieldTitle: '//android.widget.TextView[@text="Driving license picture"]',
    drivingLicensePicturePlusButton: '~Add driving license picture button',
    drivingLicensePicturePlusButtonIcon: '//android.view.ViewGroup[@content-desc="Add driving license picture button"]/com.horcrux.svg.SvgView',
/* =====================================================
        FILE FIELD
===================================================== */
    fileField: '~Add file field',
    fileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    fileFieldTitle: '//android.widget.TextView[@text="File"]',
    fileFieldText: '//android.widget.TextView[@content-desc="Add file text"]',
    addFileButton: '~Add file button',
    addFileButtonIcon: '//android.view.ViewGroup[@content-desc="Add file button"]/com.horcrux.svg.SvgView',

    newFileField: '~New added file field',
    newFileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    newFileFieldTitle: '(//android.widget.TextView[@text="File"])[2]',
    newFileFieldText: '//android.widget.TextView[@content-desc="New added file text"]',
    newFileFieldDeleteButton: '~Delete file button',

    sharedFilePopupTitle: '//android.widget.TextView[@resource-id="com.android.intentresolver:id/headline"]',
    quickShareButtonPopup: '//android.widget.Button[@resource-id="android:id/chooser_nearby_button"]',
    sharedFilePopupText: '//android.widget.TextView[@resource-id="android:id/chooser_row_text_option"]',

    downloadsButton: '//android.widget.ListView[@resource-id="com.google.android.documentsui:id/roots_list"]/android.widget.LinearLayout[4]',
/* =====================================================
        NOTE FIELD
===================================================== */
    noteField: '~Note field',
    noteFieldIcon: '//android.view.ViewGroup[@content-desc="Note field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    noteFieldTitle: '//android.widget.TextView[@text=" Comment "]',
    noteFieldInput: '~Note input field',
/* =====================================================
        CUSTOM FIELD
===================================================== */
    customField: '~Create custom field',
    customFieldIcon: '~Create custom field plus icon',
    customFieldTitle: '~Create custom field text',  
    customFieldIcon2: '//android.view.ViewGroup[@content-desc="Expand create custom field button"]/com.horcrux.svg.SvgView[2]',
    createNoteButton: '~Comment',
    createNoteButtonIcon: '//android.view.ViewGroup[@content-desc="Comment"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    createNoteButtonText: '//android.widget.TextView[@text="Comment"]',

    newNoteField: '//android.view.ViewGroup[@content-desc="New comment input field"]',
    newNoteFieldIcon: '//android.view.ViewGroup[@content-desc="New comment input field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    newNoteFieldTitle: '//android.widget.TextView[@text=" Comment "]',
    newNoteFieldInput: '//android.widget.EditText[@content-desc="New comment input field"]',
    newNoteFieldDeleteButton: '~Delete new comment field button',

/* =====================================================
        UPLOAD PICTURE POPUP
===================================================== */
    allowPicturePopup: '//android.widget.LinearLayout[@resource-id="com.android.permissioncontroller:id/grant_dialog"]',
    whileUsingAppButton: '//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_foreground_only_button"]',


    uploadPicturePopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
    uploadPicturePopupIcon: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    uploadPicturePopupTitle: '//android.widget.TextView[@text="Upload picture"]',
    previewPicture: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup[1]/android.widget.LinearLayout',
    uploadPicturePopupText: '//android.widget.TextView[@text="Maximum file size: 6 MB."]',
    takePhotoButton: '~Take Photo',
    takePhotoButtonText: '//android.widget.TextView[@text="Take Photo"]',
    chooseFromLibraryButton: '~Choose from Library',
    chooseFromLibraryButtonText: '//android.widget.TextView[@text="Choose from Library"]',

    passportPictureInAlbum: '//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[5]/android.view.View[3]/android.view.View[2]/android.view.View',
    pasportPictureInPassportPictureField: '//android.widget.ImageView',

    identityCardPictureInAlbum: '//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[5]/android.view.View[2]/android.view.View[2]/android.view.View',
    identityCardPictureInIdentityCardPictureField: '//android.widget.ImageView',

    drivingLicensePictureInAlbum: '//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[5]/android.view.View[4]/android.view.View[2]/android.view.View',
    drivingLicensePictureInDrivingLicensePictureField: '//android.widget.ImageView',
/* =====================================================
        PASSPORT PICTURE PREVIEW PAGE
===================================================== */
    passportPicturePreviewPage: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]',
    passportPicturePreviewPageBackButton: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]',
    passportPicturePreviewPageBackButtonIcon: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    passportPicturePreviewPageShareButton: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]',
    passportPicturePreviewPageShareButtonIcon: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    passportPicturePreviewPageDeleteButton: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[4]',
    passportPicturePreviewPageDeleteButtonIcon: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[4]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    passportPicturePreviewPageImage: '//android.widget.ImageView',

    identityCardPicturePreviewPageTitle: '//android.widget.TextView[@text="1000000034.jpg"]',
    drivingLicensePicturePreviewPageTitle: '//android.widget.TextView[@text="1000000033.jpg"]',
   
    sharedPageTitle: '//android.widget.TextView[@resource-id="android:id/chooser_row_text_option"]',
    quickShareButton: '//android.widget.Button[@resource-id="android:id/chooser_nearby_button"]',

}

export default createIdentityLocators
