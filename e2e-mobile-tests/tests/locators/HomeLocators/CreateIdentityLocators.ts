const createIdentityLocators = {
/* =====================================================
        TITLE FIELD
===================================================== */
    titleField: '~ Title ',
    titleFieldTitle: '//android.widget.TextView[@text=" Title "]',
    titleFieldInput: '//android.widget.EditText[@text="No title"]',
/* =====================================================
        PERSONAL INFORMATION
===================================================== */
    personalInformationIcon: '//android.view.ViewGroup[@content-desc="Personal information"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    personalInformationTitle: '//android.widget.TextView[@text="Personal information"]',
/* =====================================================
        FULL NAME FIELD
===================================================== */
    fullNameField: '~ Full name ',
    fullNameFieldIcon: '//android.view.ViewGroup[@content-desc=" Full name "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    fullNameFieldTitle: '//android.widget.TextView[@text=" Full name "]',
    fullNameFieldInput: '//android.widget.EditText[@text="John Smith"]',
/* =====================================================
        EMAIL FIELD
===================================================== */
    emailField: '~ Email ',
    emailFieldIcon: '//android.view.ViewGroup[@content-desc=" Email "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    emailFieldTitle: '//android.widget.TextView[@text=" Email "]',
    emailFieldInput: '//android.widget.EditText[@text="Insert email"]',
/* =====================================================
        PHONE NUMBER FIELD
===================================================== */
    phoneNumberField: '~ Phone number ',
    phoneNumberFieldIcon: '//android.view.ViewGroup[@content-desc=" Phone number "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    phoneNumberFieldTitle: '//android.widget.TextView[@text=" Phone number "]',
    phoneNumberFieldInput: '//android.widget.EditText[@text="Insert phone number"]',
/* =====================================================
        DETAIL OF ADDRESS
===================================================== */
    detailOfAddressIcon: '//android.view.ViewGroup[@content-desc="Detail of address"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    detailOfAddressTitle: '//android.widget.TextView[@text="Detail of address"]',
/* =====================================================
        ADDRESS FIELD
===================================================== */
    addressField: '~ Address ',
    addressFieldIcon: '//android.view.ViewGroup[@content-desc="Address"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    addressFieldTitle: '//android.widget.TextView[@text="Address"]',
    addressFieldInput: '//android.widget.EditText[@text="Insert address"]',
/* =====================================================
        ZIP FIELD
===================================================== */
    zipField: '~ ZIP ',
    zipFieldIcon: '//android.view.ViewGroup[@content-desc="ZIP"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    zipFieldTitle: '//android.widget.TextView[@text="ZIP"]',
    zipFieldInput: '//android.widget.EditText[@text="Insert ZIP"]',
/* =====================================================
        CITY FIELD
===================================================== */
    cityField: '~ City ',
    cityFieldIcon: '//android.view.ViewGroup[@content-desc="City"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    cityFieldTitle: '//android.widget.TextView[@text="City"]',
    cityFieldInput: '//android.widget.EditText[@text="Insert city"]',
/* =====================================================
        REGION FIELD
===================================================== */    
    regionField: '~ Region ',
    regionFieldIcon: '//android.view.ViewGroup[@content-desc="Region"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    regionFieldTitle: '//android.widget.TextView[@text="Region"]',
    regionFieldInput: '//android.widget.EditText[@text="Insert region"]',
/* =====================================================
        COUNTRY FIELD
===================================================== */
    countryField: '~ Country ',
    countryFieldIcon: '//android.view.ViewGroup[@content-desc="Country"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    countryFieldTitle: '//android.widget.TextView[@text="Country"]',
    countryFieldInput: '//android.widget.EditText[@text="Insert country"]',
/* =====================================================
        PASSPORT FIELD
===================================================== */
    passportFieldIcon: '//android.view.ViewGroup[@content-desc="Passport"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportFieldTitle: '//android.widget.TextView[@text="Passport"]',
/* =====================================================
        PASSPORT FULL NAME FIELD
===================================================== */
    passportFullNameField: '~ Full name ',
    passportFullNameFieldIcon: '//android.view.ViewGroup[@content-desc=" Full name "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportFullNameFieldTitle: '//android.widget.TextView[@text=" Full name "]',
    passportFullNameFieldInput: '//android.widget.EditText[@text="John Smith"]',
/* =====================================================
        PASSPORT NUMBER FIELD
===================================================== */
    passportNumberField: '~ Passport number ',
    passportNumberFieldIcon: '//android.view.ViewGroup[@content-desc=" Passport number "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportNumberFieldTitle: '//android.widget.TextView[@text=" Passport number "]',
    passportNumberFieldInput: '//android.widget.EditText[@text="Insert numbers"]',
/* =====================================================
        PASSPORT ISSUING COUNTRY FIELD
===================================================== */
    passportIssuingCountryField: '~ Issuing country ',
    passportIssuingCountryFieldIcon: '//android.view.ViewGroup[@content-desc=" Issuing country "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportIssuingCountryFieldTitle: '//android.widget.TextView[@text=" Issuing country "]',
    passportIssuingCountryFieldInput: '//android.widget.EditText[@text="Insert country"]',
/* =====================================================    
        PASSPORT DATE OF ISSUE FIELD    
===================================================== */
    passportDateOfIssueField: '~ Date of issue ',
    passportDateOfIssueFieldIcon: '//android.view.ViewGroup[@content-desc=" Date of issue "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportDateOfIssueFieldTitle: '//android.widget.TextView[@text=" Date of issue "]',
    passportDateOfIssueFieldInput: '(//android.widget.EditText[@text="DD.MM.YYYY"])[1]',
/* =====================================================
        PASSPORT EXPIRY DATE FIELD
===================================================== */
    passportExpiryDateField: '~ Expiry date ',
    passportExpiryDateFieldIcon: '//android.view.ViewGroup[@content-desc=" Expiry date "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportExpiryDateFieldTitle: '//android.widget.TextView[@text=" Expiry date "]',
    passportExpiryDateFieldInput: '(//android.widget.EditText[@text="DD.MM.YYYY"])[2]',
/* =====================================================
        PASSPORT NATIONALITY FIELD
===================================================== */
    passportNationalityField: '~ Nationality ',
    passportNationalityFieldIcon: '//android.view.ViewGroup[@content-desc=" Nationality "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportNationalityFieldTitle: '//android.widget.TextView[@text=" Nationality "]',
    passportNationalityFieldInput: '//android.widget.EditText[@text="Insert your nationality"]',
/* =====================================================
        PASSPORT DATE OF BIRTH FIELD
===================================================== */
    passportDateOfBirthField: '~ Date of birth ',
    passportDateOfBirthFieldIcon: '//android.view.ViewGroup[@content-desc=" Date of birth "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportDateOfBirthFieldTitle: '//android.widget.TextView[@text=" Date of birth "]',
    passportDateOfBirthFieldInput: '(//android.widget.EditText[@text="DD.MM.YYYY"])[3]',
/* =====================================================
        PASSPORT GENDER FIELD
===================================================== */
    passportGenderField: '~ Gender ',
    passportGenderFieldIcon: '//android.view.ViewGroup[@content-desc=" Gender "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportGenderFieldTitle: '//android.widget.TextView[@text=" Gender "]',
    passportGenderFieldInput: '//android.widget.EditText[@text="M/F"]',
/* =====================================================
        PASSPORT PICTURE FIELD
===================================================== */
    passportPictureField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[7]',
    passportPictureFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passportPictureFieldTitle: '//android.widget.TextView[@text="Passport picture"]',
    passportPicturePlusButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[8]',
    passportPicturePlusButtonIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[8]/com.horcrux.svg.SvgView',
/* =====================================================
        IDENTITY CARD FIELD
===================================================== */
    identityCardFieldIcon: '//android.view.ViewGroup[@content-desc="Identity card"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardFieldTitle: '//android.widget.TextView[@text="Identity card"]',
/* =====================================================
        ID NUMBER FIELD
===================================================== */
    identityCardNumberField: '~ ID number ',
    identityCardNumberFieldIcon: '//android.view.ViewGroup[@content-desc=" ID number "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardNumberFieldTitle: '//android.widget.TextView[@text=" ID number "]',
    identityCardNumberFieldInput: '//android.widget.EditText[@text="123456789"]',
/* =====================================================
        CREATION DATE FIELD
===================================================== */
    identityCardCreationDateField: '~ Creation date ',
    identityCardCreationDateFieldIcon: '//android.view.ViewGroup[@content-desc=" Creation date "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardCreationDateFieldTitle: '//android.widget.TextView[@text=" Creation date "]',
    identityCardCreationDateFieldInput: '(//android.widget.EditText[@text="DD.MM.YYYY"])[1]',
/* =====================================================
        EXPIRY DATE FIELD
===================================================== */
    identityCardExpiryDateField: '~ Expiry date ',
    identityCardExpiryDateFieldIcon: '//android.view.ViewGroup[@content-desc=" Expiry date "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardExpiryDateFieldTitle: '//android.widget.TextView[@text=" Expiry date "]',
    identityCardExpiryDateFieldInput: '(//android.widget.EditText[@text="DD.MM.YYYY"])[2]',
/* =====================================================    
        ISSUING COUNTRY FIELD
===================================================== */
    identityCardIssuingCountryField: '~ Issuing country ',
    identityCardIssuingCountryFieldIcon: '//android.view.ViewGroup[@content-desc=" Issuing country "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    identityCardIssuingCountryFieldTitle: '//android.widget.TextView[@text=" Issuing country "]',
    identityCardIssuingCountryFieldInput: '//android.widget.EditText[@text="Insert country"]',
/* =====================================================
        ID CARD PICTURE FIELD
===================================================== */
    identityCardPictureField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[7]',
    identityCardPictureFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    identityCardPictureFieldTitle: '//android.widget.TextView[@text="ID card picture"]',
    identityCardPicturePlusButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
    identityCardPicturePlusButtonIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]/com.horcrux.svg.SvgView',
/* =====================================================
        DRIVING LICENSE FIELD
===================================================== */
    drivingLicenseFieldIcon: '//android.view.ViewGroup[@content-desc="Driving license"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    drivingLicenseFieldTitle: '//android.widget.TextView[@text="Driving license"]',
/* =====================================================
        DRIVING LICENSE ID NUMBER FIELD
===================================================== */
    drivingLicenseIdNumberField: '~ ID number ',
    drivingLicenseIdNumberFieldIcon: '//android.view.ViewGroup[@content-desc=" ID number "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    drivingLicenseIdNumberFieldTitle: '//android.widget.TextView[@text=" ID number "]',
    drivingLicenseIdNumberFieldInput: '//android.widget.EditText[@text="123456789"]',
/* =====================================================
        DRIVING LICENSE CREATION DATE FIELD
===================================================== */
    drivingLicenseCreationDateField: '~ Creation date ',
    drivingLicenseCreationDateFieldIcon: '//android.view.ViewGroup[@content-desc=" Creation date "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    drivingLicenseCreationDateFieldTitle: '//android.widget.TextView[@text=" Creation date "]',
    drivingLicenseCreationDateFieldInput: '(//android.widget.EditText[@text="DD.MM.YYYY"])[1]', 
/* =====================================================
        DRIVING LICENSE EXPIRY DATE FIELD
===================================================== */
    drivingLicenseExpiryDateField: '~ Expiry date ',
    drivingLicenseExpiryDateFieldIcon: '//android.view.ViewGroup[@content-desc=" Expiry date "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    drivingLicenseExpiryDateFieldTitle: '//android.widget.TextView[@text=" Expiry date "]',
    drivingLicenseExpiryDateFieldInput: '(//android.widget.EditText[@text="DD.MM.YYYY"])[2]',
/* =====================================================
        DRIVING LICENSE ISSUING COUNTRY FIELD
===================================================== */
    drivingLicenseIssuingCountryField: '~ Issuing country ',
    drivingLicenseIssuingCountryFieldIcon: '//android.view.ViewGroup[@content-desc=" Issuing country "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    drivingLicenseIssuingCountryFieldTitle: '//android.widget.TextView[@text=" Issuing country "]',
    drivingLicenseIssuingCountryFieldInput: '//android.widget.EditText[@text="Insert country"]',
/* =====================================================
        DRIVING LICENSE PICTURE FIELD
===================================================== */
    drivingLicensePictureField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[8]',
    drivingLicensePictureFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    drivingLicensePictureFieldTitle: '//android.widget.TextView[@text="Driving license picture"]',
    drivingLicensePicturePlusButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]',
    drivingLicensePicturePlusButtonIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]/com.horcrux.svg.SvgView',
/* =====================================================
        FILE FIELD
===================================================== */
    fileField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[7]',
    fileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    fileFieldTitle: '//android.widget.TextView[@text="File"]',
    fileFieldText: '//android.view.ViewGroup[@content-desc="Add file"]',
    addFileButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]',
    addFileButtonIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]/com.horcrux.svg.SvgView',

    newFileField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[10]',
    newFileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView[3]/com.horcrux.svg.GroupView',
    newFileFieldTitle: '(//android.widget.TextView[@text="File"])[2]',
    newFileFieldText: '//android.widget.TextView[@text="owners-manual.pdf"]',
    newFileFieldDeleteButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[12]/com.horcrux.svg.SvgView',

    sharedFilePopupTitle: '//android.widget.TextView[@resource-id="android:id/content_preview_filename"]',
    quickShareButtonPopup: '//android.widget.Button[@resource-id="android:id/chooser_nearby_button"]',
    sharedFilePopupText: '//android.widget.TextView[@resource-id="android:id/chooser_row_text_option"]',

/* =====================================================
        NOTE FIELD
===================================================== */
    noteField: '~Note',
    noteFieldIcon: '//android.view.ViewGroup[@content-desc=" Note "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    noteFieldTitle: '//android.widget.TextView[@text=" Note "]',
    noteFieldInput: '//android.widget.EditText[@text="Note"]',
/* =====================================================
        CUSTOM FIELD
===================================================== */
    customField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[11]',
    customFieldIcon: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    customFieldTitle: '//android.widget.TextView[@text="Create Custom"]',  
    customFieldIcon2: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    createNoteButton: '~Note',
    createNoteButtonIcon: '//android.view.ViewGroup[@content-desc="Note"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    createNoteButtonText: '//android.widget.TextView[@text="Note"]',


/* =====================================================
        UPLOAD PICTURE POPUP
===================================================== */
    allowPicturePopup: '//android.widget.LinearLayout[@resource-id="com.android.permissioncontroller:id/grant_dialog"]',
    whileUsingAppButton: '//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_foreground_only_button"]',


    uploadPicturePopup: '//android.widget.LinearLayout[@resource-id="com.android.permissioncontroller:id/grant_dialog"]',
    uploadPicturePopupIcon: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    uploadPicturePopupTitle: '//android.widget.TextView[@text="Upload picture"]',
    previewPicture: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup[1]/android.widget.LinearLayout',
    uploadPicturePopupText: '//android.widget.TextView[@text="Maximum file size: 6 MB."]',
    takePhotoButton: '~Take Photo',
    takePhotoButtonText: '//android.widget.TextView[@text="Take Photo"]',
    chooseFromLibraryButton: '~Choose from Library',
    chooseFromLibraryButtonText: '//android.widget.TextView[@text="Choose from Library"]',

    passportPictureInAlbum: '(//android.widget.ImageView[@resource-id="com.google.android.providers.media.module:id/icon_thumbnail"])[1]',
    pasportPictureInPassportPictureField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[6]/android.view.ViewGroup',

    identityCardPictureInAlbum: '(//android.widget.ImageView[@resource-id="com.google.android.providers.media.module:id/icon_thumbnail"])[2]',
    identityCardPictureInIdentityCardPictureField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[11]/android.view.ViewGroup',

    drivingLicensePictureInAlbum: '(//android.widget.ImageView[@resource-id="com.google.android.providers.media.module:id/icon_thumbnail"])[3]',
    drivingLicensePictureInDrivingLicensePictureField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]/android.view.ViewGroup',
/* =====================================================
        PASSPORT PICTURE PREVIEW PAGE
===================================================== */
    passportPicturePreviewPage: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]',
    passportPicturePreviewPageBackButton: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]',
    passportPicturePreviewPageBackButtonIcon: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    passportPicturePreviewPageTitle: '//android.widget.TextView[@text="1000000064.jpg"]',
    passportPicturePreviewPageShareButton: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]',
    passportPicturePreviewPageShareButtonIcon: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    passportPicturePreviewPageDeleteButton: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[4]',
    passportPicturePreviewPageDeleteButtonIcon: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[4]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    passportPicturePreviewPageImage: '//android.widget.ImageView',
   
    sharedPageTitle: '//android.widget.TextView[@resource-id="android:id/chooser_row_text_option"]',
    quickShareButton: '//android.widget.Button[@resource-id="android:id/chooser_nearby_button"]',

}

export default createIdentityLocators
