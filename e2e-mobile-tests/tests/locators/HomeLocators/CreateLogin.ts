const createLoginLocators = {

    closeButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[1]',    nameInput: '//android.widget.EditText[@resource-id="create-login-name-input-input"]',
    
    noFolderButton: '~No Folder',
    noFolderButtonText: '//android.widget.TextView[@text="No Folder"]',
    noFolderButtonIcon: '//android.view.ViewGroup[@content-desc="No Folder"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    noFolderButtonIcon2: '//android.view.ViewGroup[@content-desc="No Folder"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    
    noFolderButtonPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',
    testFolderButton: '//android.view.ViewGroup[@content-desc="TestFolder, 0 items"]',
    testFolderButtonIcon: '//android.view.ViewGroup[@content-desc="TestFolder, 0 items"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    testFolderButtonText: '//android.widget.TextView[@text="TestFolder"]',
    testFolderButtonText2: '//android.widget.TextView[@text="0 items"]',

    createNewButton: '~Create new',
    createNewButtonIcon: '//android.view.ViewGroup[@content-desc="Create new"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    createNewButtonText: '//android.widget.TextView[@text="Create new"]',

    saveButton: '~Save',
    saveButtonIcon: '//android.view.ViewGroup[@content-desc="Save"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    saveButtonText: '//android.widget.TextView[@text="Save"]',
    /* =====================================================
        TITLE FIELD
    ===================================================== */
    titleField: '~ Title ',
    titleFieldTitle: '//android.widget.TextView[@text=" Title "]',
    titleFieldInput: '//android.widget.EditText[@text="No title"]',
    /* =====================================================
        EMAIL OR USERNAME FIELD
    ===================================================== */
    emailOrUsernameField: '~ Email or username ',
    emailOrUsernameFieldIcon: '//android.view.ViewGroup[@content-desc=" Email or username "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    emailOrUsernameFieldTitle: '//android.widget.TextView[@text=" Email or username "]',
    emailOrUsernameFieldInput: '//android.widget.EditText[@text="Email or username"]',
    /* =====================================================
        PASSWORD FIELD
    ===================================================== */
    passwordField: '~ Password ',
    passwordFieldIcon: '//android.view.ViewGroup[@content-desc=" Password "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passwordFieldTitle: '//android.widget.TextView[@text=" Password "]',
    passwordFieldInput: '//android.widget.EditText[@text="Insert password"]',

    generatePasswordIcon: '//android.view.ViewGroup[@content-desc=" Password "]/android.view.ViewGroup[1]/com.horcrux.svg.SvgView',
    /* =====================================================
        GENERATE PASSWORD POPUP
    ===================================================== */
    generatePasswordPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',
    generatePasswordPopupTitle: '//android.widget.TextView[@text="Generate a password"]',
    generatePasswordPopupGeneratedPassword: '//android.widget.TextView[@text="Type"]',
    generatePasswordPopupIcon1: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[1]',
    generatePasswordPopupIcon2: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView[2]',
    generatePasswordPopupPasswordStatus: '//android.widget.TextView[@text="Safe"]',
    generatePasswordPopupSeparatorLine: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]',
    generatePasswordPopupTypeText: '//android.widget.TextView[@text="Type"]',
    generatePasswordPopupPasswordRadioButtonChoose: '///android.view.ViewGroup[@content-desc="Password"]/android.view.ViewGroup[1]',
    generatePasswordPopupPasswordRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="Password"]/android.view.ViewGroup',
    generatePasswordPopupPasswordRadioButtonText: '//android.widget.TextView[@text="Password"]',

    generatePasswordPopupPassphraseRadioButtonChoose: '//android.view.ViewGroup[@content-desc="Passphrase"]/android.view.ViewGroup[1]',
    generatePasswordPopupPassphraseRadioButtonUnchoose: '//android.view.ViewGroup[@content-desc="Passphrase"]/android.view.ViewGroup',
    generatePasswordPopupPassphraseRadioButtonText: '//android.widget.TextView[@text="Passphrase"]',

    generatePasswordPopupSeparatorLine1: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[4]',
    eightCharactersText: '//android.widget.TextView[@text="8 characters"]',
    passwordSlider: '//android.widget.SeekBar[@text="4.0"]',

    generatePasswordPopupSeparatorLine2: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
    
    specialCharacterText: '//android.widget.TextView[@text="Special character (!&*)"]',
    specialCharacterToggleOn: '',
    specialCharacterToggleOff: '',

    selectAllText: '//android.widget.TextView[@text="Select All"]',
    selectAllToggleOn: '',
    selectAllToggleOff: '',

    capitalLettersText: '//android.widget.TextView[@text="Capital Letters"]',
    capitalLettersToggleOn: '',
    capitalLettersToggleOff: '',

    symbolsText: '//android.widget.TextView[@text="Symbols"]',
    symbolsToggleOn: '',
    symbolsToggleOff: '',

    numbersText: '//android.widget.TextView[@text="Numbers"]',
    numbersToggleOn: '',
    numbersToggleOff: '',

    confirmButton: '~Confirm',
    confirmButtonText: '//android.widget.TextView[@text="Confirm"]',
    cancelButton: '~Cancel',
    cancelButtonText: '//android.widget.TextView[@text="Cancel"]',

    passwordFieldToggleVisibilityOn: '//android.view.ViewGroup[@content-desc=" Password "]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
    passwordFieldToggleVisibilityOff: '//android.view.ViewGroup[@content-desc=" Password "]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
    /* =====================================================
        WEBSITE FIELD
    ===================================================== */
    websiteField: '~ Website ',
    websiteFieldIcon: '//android.view.ViewGroup[@content-desc=" Website "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    websiteFieldTitle: '//android.widget.TextView[@text=" Website "]',
    websiteFieldInput: '//android.widget.EditText[@text="https://"]',
    addNewWebsiteFieldButton: '~Add new website',
    /* =====================================================
        FILE FIELD
    ===================================================== */
    fileField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
    fileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    fileFieldTitle: '//android.widget.TextView[@text="File"]',
    fileFieldText: '//android.widget.TextView[@text="Add file"]',
    addFileButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[7]/com.horcrux.svg.SvgView',
    
    addFilePopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
    addFilePopupIcon: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    addFilePopupTitle: '//android.widget.TextView[@text="Upload your files"]',
    addFilePopupText: '//android.widget.TextView[@text="Maximum file size: 6 MB."]',
    addFilePopupChooseFileButton: '~Choose File',
    addFilePopupChooseFileButtonText: '//android.widget.TextView[@text="Choose File"]',
    addFilePopupChooseMediaButton: '~Choose Photo / Video',
    addFilePopupChooseMediaButtonText: '//android.widget.TextView[@text="Choose Photo / Video"]',
    /* =====================================================
        COMMENT FIELD
    ===================================================== */
    noteField: '~ Comment ',
    noteFieldIcon: '//android.view.ViewGroup[@content-desc=" Comment "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    noteFieldTitle: '//android.widget.TextView[@text=" Comment "]',
    noteFieldInput: '//android.widget.EditText[@text="Add comment"]',
    /* =====================================================
        CUSTOM FIELD
    ===================================================== */
    customFields: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]',
    customFieldsIcon: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    customFieldsIcon2: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    customFieldsText: '//android.widget.TextView[@text="Create Custom"]',
    customFieldsIcon3: '//android.view.ViewGroup[@content-desc="Comment"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    customFieldsText2: '//android.widget.TextView[@text="Comment"]',
}
export default createLoginLocators
