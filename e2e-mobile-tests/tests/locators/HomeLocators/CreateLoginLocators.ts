const createLoginLocators = {

    closeButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[1]',    nameInput: '//android.widget.EditText[@resource-id="create-login-name-input-input"]',
    
    noFolderButton: '~No Folder',
    noFolderButtonText: '//android.widget.TextView[@text="No Folder"]',
    noFolderButtonIcon: '//android.view.ViewGroup[@content-desc="No Folder"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    noFolderButtonIcon2: '//android.view.ViewGroup[@content-desc="No Folder"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    noFolderButtonPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView',


    testFolderButton: '~Test Folder',
    testingFolderButton: '~Testing Folder',
    testFolderButtonIcon: '//android.view.ViewGroup[@content-desc="Test Folder"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    testFolderButtonText: '//android.widget.TextView[@text="Test Folder"]',
    testFolderButtonIcon2: '//android.view.ViewGroup[@content-desc="Test Folder"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    testFolderPopup: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup',
    testFolderPopupTestFolderButton: '~Test Folder, 0 items',
    testFolderPopupIcon: '//android.view.ViewGroup[@content-desc="Test Folder, 0 items"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    testFolderPopupTitle: '(//android.widget.TextView[@text="Test Folder"])[1]',
    testFolderPopupText: '//android.widget.TextView[@text="0 items"]',
    testFolderPopupCheckedIcon: '//com.horcrux.svg.SvgView[@resource-id="sidebar-folder-undefined-active"]/com.horcrux.svg.GroupView',


    createNewButton: '~Create new',
    createNewButtonIcon: '//android.view.ViewGroup[@content-desc="Create new"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    createNewButtonText: '//android.widget.TextView[@text="Create new"]',

    saveButton: '~Save',
    saveButtonIcon: '//android.view.ViewGroup[@content-desc="Save"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    saveButtonText: '//android.widget.TextView[@text="Save"]',
/* =====================================================
        TITLE FIELD
===================================================== */
    titleField: '~Title field',
    titleFieldTitle: '//android.widget.TextView[@text=" Title "]',
    titleFieldInput: '~Title input field',
    titleFieldWarningIcon: '//android.view.ViewGroup[@content-desc="Title field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    titleFieldWarningText: '//android.widget.TextView[@text=" Title is required "]',
/* =====================================================
        EMAIL OR USERNAME FIELD
===================================================== */
    emailOrUsernameField: '~Email or Username field',
    emailOrUsernameFieldIcon: '//android.view.ViewGroup[@content-desc="Email or Username field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    emailOrUsernameFieldTitle: '//android.widget.TextView[@text=" Email or username "]',
    emailOrUsernameFieldInput: '~Email or username input field',
/* =====================================================
        PASSWORD FIELD
===================================================== */
    passwordField: '//android.view.ViewGroup[@content-desc="Password input field"]',
    passwordFieldIcon: '//android.view.ViewGroup[@content-desc="Password input field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    passwordFieldTitle: '//android.widget.TextView[@text=" Password "]',
    passwordFieldInput: '//android.widget.EditText[@content-desc="Password input field"]',

    generatePasswordIcon: '~Password generator button',
    showPasswordIcon: '~Toggle password visibility',
/* =====================================================
        GENERATE PASSWORD POPUP
===================================================== */
    generatePasswordPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup',
    generatePasswordPopupTitle: '//android.widget.TextView[@text="Generate a password"]',
    generatePasswordPopupGeneratedPassword: '~Generated Password',
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
    eightCharactersText: '~Generate password popup length label',
    passwordSlider: '~Password length slider',

    generatePasswordPopupSeparatorLine2: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
    
    specialCharacterText: '//android.widget.TextView[@text="Special character (!&*)"]',
    specialCharacterToggleOn: '~Special character toggle',
    specialCharacterToggleOff: '//android.widget.Switch[@content-desc="Special character toggle"]',

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
    copyAndCloseButton: '~Copy and close',
    copyAndCloseButtonText: '//android.widget.TextView[@text="Copy and close"]',

/* =====================================================
        WEBSITE FIELD
===================================================== */
    websiteField: '//android.view.ViewGroup[@content-desc="Website URL input field"]',
    websiteFieldIcon: '//android.view.ViewGroup[@content-desc="Website URL input field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    websiteFieldTitle: '//android.widget.TextView[@text=" Website "]',
    websiteFieldInput: '//android.widget.EditText[@content-desc="Website URL input field"]',
    addNewWebsiteFieldButton: '~Add another website field',

    newWebsiteField: '(//android.view.ViewGroup[@content-desc="Website URL input field"])[2]',
    newWebsiteFieldIcon: '(//android.view.ViewGroup[@content-desc="Website URL input field"])[2]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    newWebsiteFieldTitle: '(//android.widget.TextView[@text=" Website "])[2]',
    newWebsiteFieldInput: '(//android.widget.EditText[@content-desc="Website URL input field"])[2]',
    newWebsiteFieldDeleteButton: '(//android.view.ViewGroup[@content-desc="Website URL input field"])[2]/android.view.ViewGroup/com.horcrux.svg.SvgView',
/* =====================================================
        FILE FIELD
===================================================== */
    fileField: '~File field',
    fileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    fileFieldTitle: '//android.widget.TextView[@text="File"]',
    fileFieldText: '//android.widget.TextView[@text="Add file"]',
    addFileButton: '~Add file button',
    
    addFilePopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
    addFilePopupIcon: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    addFilePopupTitle: '//android.widget.TextView[@text="Upload your files"]',
    addFilePopupText: '//android.widget.TextView[@text="Maximum file size: 6 MB."]',
    addFilePopupChooseFileButton: '~Choose File',
    addFilePopupChooseFileButtonText: '//android.widget.TextView[@text="Choose File"]',
    addFilePopupChooseMediaButton: '~Choose Photo / Video',
    addFilePopupChooseMediaButtonText: '//android.widget.TextView[@text="Choose Photo / Video"]',
    ownersManualFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="owners-manual.pdf"]',

    newFileField: '(//android.view.ViewGroup[@content-desc="File field"])[2]',
    newFileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    newFileFieldTitle: '(//android.widget.TextView[@text="File"])[2]',
    newFileFieldText: '//android.widget.TextView[@text="owners-manual.pdf"]',
    newFileFieldDeleteButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[12]/com.horcrux.svg.SvgView',

    newFileFieldButton: '~owners-manual.pdf',
    sharedFilePopupTitle: '//android.widget.TextView[@resource-id="com.android.intentresolver:id/content_preview_filename"]',
/* =====================================================
        NOTE FIELD
===================================================== */
    noteField: '~Add comment field',
    noteFieldIcon: '//android.view.ViewGroup[@content-desc="Add comment field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    noteFieldTitle: '//android.widget.TextView[@text=" Comment "]',
    noteFieldInput: '~Add comment input field',

    newnoteField: '~ Comment ',
    newNoteFieldIcon: '//android.view.ViewGroup[@content-desc=" Comment "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    newNoteFieldTitle: '(//android.widget.TextView[@text=" Comment "])[2]',
    newNoteFieldInput: '//android.widget.EditText[@text="Add comment"]',
    newNoteFieldDeleteButton: '//android.view.ViewGroup[@content-desc=" Comment "]/android.view.ViewGroup/com.horcrux.svg.SvgView',
/* =====================================================
        CUSTOM FIELD
===================================================== */
    customFields: '~Create custom field',
    customFieldsIcon: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    customFieldsIcon2: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    customFieldsText: '//android.widget.TextView[@text="Create Custom"]',
    customFieldsIcon3: '//android.view.ViewGroup[@content-desc="Comment"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    customFieldsText2: '//android.widget.TextView[@text="Comment"]',
    newNoteFieldButton: '~Comment',
}
export default createLoginLocators
