const createLoginLocators = {
    backButton: '~Go back',

    createLoginPageTitle: '//android.widget.TextView[@text="New Login Item"]',

    titleField: '//android.view.ViewGroup[@resource-id="title-field"]',
    titleFieldTitle: '//android.widget.TextView[@text="Title"]',
    titleFieldInput: '//android.widget.EditText[@text="Enter Title"]',

    titleRequiredErrorMessage: '//android.widget.TextView[@text="Title is required"]',
    titleRequiredErrorMessageIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView',

    credentialsTitle: '//android.widget.TextView[@text="Credentials"]',
    emailUsernameField: '//android.view.ViewGroup[@resource-id="credentials-multi-slot-input-slot-0"]',
    emailUsernameFieldTitle: '//android.widget.TextView[@text="Email / Username"]',
    emailUsernameFieldInput: '//android.widget.EditText[@text="Enter Email / Username"]',
    passwordField: '//android.view.ViewGroup[@resource-id="credentials-multi-slot-input-slot-1"]',
    passwordFieldTitle: '//android.widget.TextView[@text="Password"]',
    passwordFieldInput: '//android.widget.EditText[@text="Enter Password"]',
    showPasswordButton: '~Show password',
    hidePasswordButton: '~Hide password',
    generatePasswordButton: '~Generate Password',
    generatePasswordButtonText: '//android.widget.TextView[@text="Generate Password"]',
    generatePasswordButtonIcon: '//android.widget.Button[@content-desc="Generate Password"]/com.horcrux.svg.SvgView',

    detailsTitle: '//android.widget.TextView[@text="Details"]',
    websiteField: '//android.view.ViewGroup[@resource-id="website-multi-slot-input-slot-0"]',
    websiteFieldTitle: '//android.widget.TextView[@text="Website"]',
    websiteFieldInput: '//android.widget.EditText[@text="Enter Website"]',
    websiteFieldDeleteButton: '(//android.widget.Button[@content-desc="Delete website"])[1]',
    
    addAnotherWebsiteButton: '~Add Another Website',
    addAnotherWebsiteButtonText: '//android.widget.TextView[@text="Add Another Website"]',
    addAnotherWebsiteButtonIcon: '//android.widget.Button[@content-desc="Add Another Website"]/com.horcrux.svg.SvgView',

    newWebsiteField: '//android.view.ViewGroup[@resource-id="website-multi-slot-input-slot-1"]',
    newWebsiteFieldTitle: '(//android.widget.TextView[@text="Website"])[2]',
    newWebsiteFieldInput: '(//android.widget.EditText[@text="Enter Website"])[2]',
    newWebsiteFieldDeleteButton: '(//android.widget.Button[@content-desc="Delete website"])[2]',

    folderField: '~Folder',
    folderFieldTitle: '//android.widget.TextView[@text="Folder"]',
    chooseFolderText: '//android.widget.TextView[@text="Choose Folder"]',
    chooseFolderActionButton: '~Action',

    foldersPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup',
    popupCloseButton: '~Close',
    foldersPopupTitle: '//android.widget.TextView[@text="Folders"]',
    foldersPopupAddNewFolder: '~Add New Folder',
    foldersPopupAddNewFolderText: '//android.widget.TextView[@text="Add New Folder"]',
    foldersPopupAddNewFolderIcon: '//android.widget.Button[@content-desc="Add New Folder"]/android.view.ViewGroup',


    testFolderField: '~Test Folder, 0 items, ￼',
    testFolderFieldText: '(//android.widget.TextView[@text="Test Folder"])[1]',
    testFolderFieldItemsCount: '~0 items',
    testFolderFieldIcon: '//android.widget.Button[@content-desc="Test Folder, 0 items, ￼"]/android.view.ViewGroup',
    testFolderFieldThreeDotsButton: '~Folder actions',

    testFolderActionsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup',
    testFolderActionsPopupTitle: '(//android.widget.TextView[@text="Test Folder"])[1]',
    testFolderActionsPopupRenameButton: '~Rename',
    testFolderActionsPopupRenameButtonText: '//android.widget.TextView[@text="Rename"]',
    testFolderActionsPopupRenameButtonIcon: '//android.widget.Button[@content-desc="Rename"]/android.view.ViewGroup',
    testFolderActionsPopupDeleteFolderButton: '~Delete Folder',
    testFolderActionsPopupDeleteFolderButtonText: '//android.widget.TextView[@text="Delete Folder"]',
    testFolderActionsPopupDeleteFolderButtonIcon: '//android.widget.Button[@content-desc="Delete Folder"]/android.view.ViewGroup',


    /* ============================
        CREATE NEW FOLDER PAGE
    ============================ */

    createNewFolderPageTitle: '(//android.widget.TextView[@text="Create New Folder"])[1]',
    createNewFolderPageNameField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
    createNewFolderPageNameFieldTitle: '//android.widget.TextView[@text="Folder Name"]',
    createNewFolderPageNameFieldInput: '//android.widget.EditText[@text="Enter name"]',

    createNewFolderButton: '~Create New Folder',
    createNewFolderButtonText: '(//android.widget.TextView[@text="Create New Folder"])[2]',

    /* ============================
        RENAME FOLDER PAGE
    ============================ */
    renameFolderPageTitle: '//android.widget.TextView[@text="Rename Folder"]',
    renameFolderPageNameField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
    renameFolderPageNameFieldTitle: '//android.widget.TextView[@text="Folder Name"]',
    renameFolderPageNameFieldInput: '//android.widget.EditText[@text="Test Folder"]',

    saveButton: '~Save',
    saveButtonText: '//android.widget.TextView[@text="Save"]',

    /* ============================
        DELETE FOLDER PAGE
    ============================ */
    deleteFolderPageTitle: '(//android.widget.TextView[@text="Delete Folder"])[1]',
    deleteFolderPageText: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.widget.TextView',
    deleteFolderPageField: '~Delete Folder, Only the folder will be removed.\nYour items will be moved to the All Folder list.',
    deleteFolderPageFieldTitle: '(//android.widget.TextView[@text="Delete Folder"])[2]',
    deleteFolderPageFieldText: `//android.widget.TextView[@text="Only the folder will be removed.\nYour items will be moved to the All Folder list."]`,
    deleteFolderPageFieldRadioButton: `//android.widget.RadioButton[@content-desc="Delete Folder, Only the folder will be removed.\nYour items will be moved to the All Folder list."]/android.view.ViewGroup`,

    deleteButton: '~Delete Folder',
    deleteButtonText: '(//android.widget.TextView[@text="Delete Folder"])[3]',



    additionalTitle: '//android.widget.TextView[@text="Additional"]',
    commentField: '//android.view.ViewGroup[@resource-id="comments-multi-slot-input-slot-0"]',
    commentFieldTitle: '//android.widget.TextView[@text="Comment"]',
    commentFieldInput: '//android.widget.EditText[@text="Enter Comment"]',

    hiddenMessagesField: '//android.view.ViewGroup[@resource-id="hidden-messages-multi-slot-input-slot-0"]',
    hiddenMessagesFieldTitle: '//android.widget.TextView[@text="Hidden Message"]',
    hiddenMessagesFieldInput: '//android.widget.EditText[@text="Enter Hidden Message"]',
    hiddenMessagesFieldShowPasswordButton: '~Show Password',
    hiddenMessagesFieldHidePasswordButton: '~Hide Password',

    addAnotherMessageButton: '~Add Another Message',
    addAnotherMessageButtonText: '//android.widget.TextView[@text="Add Another Message"]',
    addAnotherMessageButtonIcon: '//android.widget.Button[@content-desc="Add Another Message"]/com.horcrux.svg.SvgView',

    attachmentsField: '//android.view.ViewGroup[@resource-id="attachment-field-empty"]',
    attachmentsFieldTitle: '//android.widget.TextView[@text="Attachment"]',
    attachmentsFieldText: '//android.widget.TextView[@text="Add File / Photos Here"]',
    uploadAttachmentButton: '~Upload attachment',

    addAnotherAttachmentButton: '~Add Another Attachment',
    addAnotherAttachmentButtonText: '//android.widget.TextView[@text="Add Another Attachment"]',
    addAnotherAttachmentButtonIcon: '//android.widget.Button[@content-desc="Add Another Attachment"]/com.horcrux.svg.SvgView',

    uploadAttachmentPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup',
    uploadAttachmentPopupTitle: '//android.widget.TextView[@text="Upload Attachment"]',
    uploadAttachmentPopupText: '//android.widget.TextView[@text="Maximum file size: 6MB"]',
    uploadAttachmentPopupChooseFileButton: '~Choose File',
    uploadAttachmentPopupChooseFileButtonText: '//android.widget.TextView[@text="Choose File"]',
    uploadAttachmentPopupChoosePhotoVidoeButton: '~Choose Photo / Video',
    uploadAttachmentPopupChoosePhotoVidoeButtonText: '//android.widget.TextView[@text="Choose Photo / Video"]',

    
    


    addItemButton: '~Add Item',
    addItemButtonText: '//android.widget.TextView[@text="Add Item"]',
   







} as const

export default createLoginLocators;
