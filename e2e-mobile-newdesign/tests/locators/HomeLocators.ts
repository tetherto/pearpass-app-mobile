const homeLocators = {

    backButton: '~Go back',
    popupCloseButton: '~Close',
    vaultTab: '~Vault',
    vaultTabText: '//android.widget.TextView[@text="Vault"]',
    vaultTabIcon: '//android.view.View[@content-desc="Vault"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
    vaultButton: '~Personal vault',
    vaultButtonText: '//android.widget.TextView[@text="Personal vault"]',
    vaultButtonIcon: '//android.widget.Button[@content-desc="Personal vault"]/com.horcrux.svg.SvgView[1]',
    vaultButtonIcon2: '//android.widget.Button[@content-desc="Personal vault"]/com.horcrux.svg.SvgView[2]',

    vaultBreadcrumbRow: '//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[5]/android.view.ViewGroup',

    vaultsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup',
    vaultsPopupTitle: '//android.widget.TextView[@text="Vaults"]',
    vaultsPopupPersonalVaultsField: '//android.view.ViewGroup[@content-desc="Personal vault"]',
    vaultsPopupPersonalVaultsFieldIcon: '//android.view.ViewGroup[@content-desc="Personal vault"]/com.horcrux.svg.SvgView',
    vaultsPopupPersonalVaultsFieldText: '(//android.widget.TextView[@text="Personal vault"])[2]',
    vaultsPopupPersonalVaultsFieldVaultActionsButton: '~Vault actions',

    personalVaultsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup',
    personalVaultsPopupTitle: '(//android.widget.TextView[@text="Personal vault"])[2]',
    personalVaultsPopupBackButton: '~Back',

    personalVaultsPopupRenameVaultField: '~Rename vault',
    personalVaultsPopupRenameVaultFieldIcon: '//android.widget.Button[@content-desc="Rename Vault"]/android.view.ViewGroup',
    personalVaultsPopupRenameVaultFieldText: '//android.widget.TextView[@text="Rename Vault"]',
    personalVaultsPopupManageAccessField: '~Manage access',
    personalVaultsPopupManageAccessFieldIcon: '//android.widget.Button[@content-desc="Manage Access"]/android.view.ViewGroup',
    personalVaultsPopupManageAccessFieldText: '//android.widget.TextView[@text="Manage Access"]',

    vaultsPopupCreateNewVaultField: '~Create New Vault',
    vaultsPopupCreateNewVaultFieldIcon: '//android.view.ViewGroup[@content-desc="Create New Vault"]/com.horcrux.svg.SvgView',
    vaultsPopupCreateNewVaultFieldText: '//android.widget.TextView[@text="Create New Vault"]',

    /* ============================
        CATEGORIES BUTTONS
    ============================ */
    allItemsCategoryButton: '~All Items',
    allItemsCategoryButtonIcon: '//android.widget.Button[@content-desc="All Items"]/com.horcrux.svg.SvgView[1]',
    allItemsCategoryButtonText: '//android.widget.TextView[@text="All Items"]',
    allItemsCategoryButtonIcon2: '//android.widget.Button[@content-desc="All Items"]/com.horcrux.svg.SvgView[2]',

    itemsCategoryPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup',
    itemsCategoryPopupTitle: '//android.widget.TextView[@text="Categories"]',

    allItemsCategoryPopupField: '~All Items, 0 items',
    allItemsCategoryPopupFieldIcon: '//android.widget.Button[@content-desc="All Items, 0 items"]/android.view.ViewGroup',
    allItemsCategoryPopupFieldText: '(//android.widget.TextView[@text="All Items"])[2]',
    allItemsCategoryPopupFieldItemsCount: '(//android.widget.TextView[@content-desc="0 items"])[1]',

    loginsItemsCategoryPopupField: '~Logins, 0 items',
    loginsItemsCategoryPopupFieldIcon: '//android.widget.Button[@content-desc="Logins, 0 items"]/android.view.ViewGroup',
    loginsItemsCategoryPopupFieldText: '//android.widget.TextView[@text="Logins"]',
    loginsItemsCategoryPopupFieldItemsCount: '(//android.widget.TextView[@content-desc="0 items"])[1]',

    creditCardsItemsCategoryPopupField: '~Credit Cards, 0 items',
    creditCardsItemsCategoryPopupFieldIcon: '//android.widget.Button[@content-desc="Credit Cards, 0 items"]/android.view.ViewGroup',
    creditCardsItemsCategoryPopupFieldText: '//android.widget.TextView[@text="Credit Cards"]',
    creditCardsItemsCategoryPopupFieldItemsCount: '(//android.widget.TextView[@content-desc="0 items"])[1]',

    identitiesItemsCategoryPopupField: '~Identities, 0 items',
    identitiesItemsCategoryPopupFieldIcon: '//android.widget.Button[@content-desc="Identities, 0 items"]/android.view.ViewGroup',
    identitiesItemsCategoryPopupFieldText: '//android.widget.TextView[@text="Identities"]',
    identitiesItemsCategoryPopupFieldItemsCount: '(//android.widget.TextView[@content-desc="0 items"])[1]',

    notesItemsCategoryPopupField: '~Notes, 0 items',
    notesItemsCategoryPopupFieldIcon: '//android.widget.Button[@content-desc="Notes, 0 items"]/android.view.ViewGroup',
    notesItemsCategoryPopupFieldText: '//android.widget.TextView[@text="Notes"]',
    notesItemsCategoryPopupFieldItemsCount: '(//android.widget.TextView[@content-desc="0 items"])[1]',

    recoveryPhrasesItemsCategoryPopupField: '~Recovery Phrases, 0 items',
    recoveryPhrasesItemsCategoryPopupFieldIcon: '//android.widget.Button[@content-desc="Recovery Phrases, 0 items"]/android.view.ViewGroup',
    recoveryPhrasesItemsCategoryPopupFieldText: '//android.widget.TextView[@text="Recovery Phrases"]',
    recoveryPhrasesItemsCategoryPopupFieldItemsCount: '(//android.widget.TextView[@content-desc="0 items"])[1]',

    wifiCategoryPopupField: '~Wi-Fi, 0 items',
    wifiCategoryPopupFieldIcon: '//android.widget.Button[@content-desc="Wi-Fi, 0 items"]/android.view.ViewGroup',
    wifiCategoryPopupFieldText: '//android.widget.TextView[@text="Wi-Fi"]',
    wifiCategoryPopupFieldItemsCount: '(//android.widget.TextView[@content-desc="0 items"])[1]',

    otherCategoryPopupField: '~Other, 0 items',
    otherCategoryPopupFieldIcon: '//android.widget.Button[@content-desc="Other, 0 items"]/android.view.ViewGroup',
    otherCategoryPopupFieldText: '//android.widget.TextView[@text="Other"]',
    otherCategoryPopupFieldItemsCount: '(//android.widget.TextView[@content-desc="0 items"])[1]',
    
    /* ============================
        FOLDERS BUTTON
    ============================ */
    foldersButton: '~All Folders',
    foldersButtonIcon: '//android.widget.Button[@content-desc="All Folders"]/com.horcrux.svg.SvgView[1]',
    foldersButtonText: '//android.widget.TextView[@text="All Folders"]',
    foldersButtonIcon2: '//android.widget.Button[@content-desc="All Folders"]/com.horcrux.svg.SvgView[2]',

    foldersPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup',
    foldersPopupTitle: '//android.widget.TextView[@text="Folders"]',

    allFoldersPopupField: '~All Folders, 0 items',
    allFoldersPopupFieldIcon: '//android.widget.Button[@content-desc="All Folders, 0 items"]/android.view.ViewGroup',
    allFoldersPopupFieldText: '(//android.widget.TextView[@text="All Folders"])[2]',
    allFoldersPopupFieldItemsCount: '~0 items',

    addNewFolderPopupField: '~Add New Folder',
    addNewFolderPopupFieldIcon: '//android.widget.Button[@content-desc="Add New Folder"]/android.view.ViewGroup',
    addNewFolderPopupFieldText: '//android.widget.TextView[@text="Add New Folder"]',

    /* ============================
        SORT ITEMS BUTTON
    ============================ */
    sortItemsButton: '~Sort items',
    sortItemsButtonIcon: '//android.widget.Button[@content-desc="Sort items"]/com.horcrux.svg.SvgView',

    sortItemsPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup',
    sortItemsPopupTitle: '//android.widget.TextView[@text="Item Order"]',
    titleAzButton: '~Title (A-Z)',
    titleAzButtonIcon: '//android.widget.Button[@content-desc="Title (A-Z)"]/android.view.ViewGroup',
    titleAzButtonText: '//android.widget.TextView[@text="Title (A-Z)"]',

    lastUpdatedNewestButton: '~Last Updated (Newest first)',
    lastUpdatedNewestButtonIcon: '//android.widget.Button[@content-desc="Last Updated (Newest first)"]/android.view.ViewGroup',
    lastUpdatedNewestButtonText: '//android.widget.TextView[@text="Last Updated (Newest first)"]',

    lastUpdatedOldestButton: '~Last Updated (Oldest first)',
    lastUpdatedOldestButtonIcon: '//android.widget.Button[@content-desc="Last Updated (Oldest first)"]/android.view.ViewGroup',
    lastUpdatedOldestButtonText: '//android.widget.TextView[@text="Last Updated (Oldest first)"]',

    dateAddedNewestButton: '~Date Added (Newest first)',
    dateAddedNewestButtonIcon: '//android.widget.Button[@content-desc="Date Added (Newest first)"]/android.view.ViewGroup',
    dateAddedNewestButtonText: '//android.widget.TextView[@text="Date Added (Newest first)"]',

    dateAddedOldestButton: '~Date Added (Oldest first)',
    dateAddedOldestButtonIcon: '//android.widget.Button[@content-desc="Date Added (Oldest first)"]/android.view.ViewGroup',
    dateAddedOldestButtonText: '//android.widget.TextView[@text="Date Added (Oldest first)"]',


    settingsTab: '~Settings',
    settingsTabText: '//android.widget.TextView[@text="Settings"]',
    settingsTabIcon: '//android.widget.Button[@content-desc="Settings"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',

    /* ============================
        ADD ITEM BUTTONS
    ============================ */
    addTopItemButton: '(//android.widget.Button[@content-desc="Add item"])[1]',
    addTopItemButtonIcon: '(//android.widget.Button[@content-desc="Add item"])[1]/com.horcrux.svg.SvgView',

    addTopItemPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/android.view.ViewGroup',
    addTopItemPopupTitle: '//android.widget.TextView[@text="Add Item"]',

    addTopItemPopupLoginsField: '~Logins',
    addTopItemPopupLoginsFieldIcon: '//android.widget.Button[@content-desc="Logins"]/android.view.ViewGroup',
    addTopItemPopupLoginsFieldText: '//android.widget.TextView[@text="Logins"]',

    addTopItemPopupCreditCardField: '~Credit Card',
    addTopItemPopupCreditCardFieldIcon: '//android.widget.Button[@content-desc="Credit Card"]/android.view.ViewGroup',
    addTopItemPopupCreditCardFieldText: '//android.widget.TextView[@text="Credit Card"]',

    addTopItemPopupIdentitiesField: '~Identities',
    addTopItemPopupIdentitiesFieldIcon: '//android.widget.Button[@content-desc="Identities"]/android.view.ViewGroup',
    addTopItemPopupIdentitiesFieldText: '//android.widget.TextView[@text="Identities"]',

    addTopItemPopupNotesField: '~Notes',
    addTopItemPopupNotesFieldIcon: '//android.widget.Button[@content-desc="Notes"]/android.view.ViewGroup',
    addTopItemPopupNotesFieldText: '//android.widget.TextView[@text="Notes"]',

    addTopItemPopupRecoveryPhrasesField: '~Recovery Phrases',
    addTopItemPopupRecoveryPhrasesFieldIcon: '//android.widget.Button[@content-desc="Recovery Phrases"]/android.view.ViewGroup',
    addTopItemPopupRecoveryPhrasesFieldText: '//android.widget.TextView[@text="Recovery Phrases"]',

    addTopItemPopupWifiField: '~Wi-Fi',
    addTopItemPopupWifiFieldIcon: '//android.widget.Button[@content-desc="Wi-Fi"]/android.view.ViewGroup',
    addTopItemPopupWifiFieldText: '//android.widget.TextView[@text="Wi-Fi"]',

    addTopItemPopupOtherField: '~Other',
    addTopItemPopupOtherFieldIcon: '//android.widget.Button[@content-desc="Other"]/android.view.ViewGroup',
    addTopItemPopupOtherFieldText: '//android.widget.TextView[@text="Other"]',

    addTopItemPopupPasswordField: '~Password',
    addTopItemPopupPasswordFieldIcon: '//android.widget.Button[@content-desc="Password"]/android.view.ViewGroup',
    addTopItemPopupPasswordFieldText: '//android.widget.TextView[@text="Password"]',




    addCenterItemButton: '(//android.widget.Button[@content-desc="Add item"])[2]',
    addCenterItemButtonIcon: '(//android.widget.Button[@content-desc="Add item"])[2]/com.horcrux.svg.SvgView',
    addCenterItemButtonText: '//android.widget.TextView[@text="Add item"]',

    /* ============================
        SEARCH IN ITEMS FIELD
    ============================ */
    searchInItemsField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]',
    searchInItemsFieldInput: '~Search in All Items',
    searchInItemsFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/com.horcrux.svg.SvgView',

    /* ============================
        IMPORT VAULT BUTTON
    ============================ */
    importVaultButton: '~Import',
    importVaultButtonIcon: '//android.widget.Button[@content-desc="Import"]/com.horcrux.svg.SvgView',

    importVaultPageTitle: '//android.widget.TextView[@text="Import Vault"]',
    importVaultPageBackButton: '~Go back',
    importVaultPageText: '//android.widget.TextView[@text="Scan QR code"]',
    importVaultPageText2: '//android.widget.TextView[@text="Camera access is required to scan codes."]',
    importVaultPageAllowAccessButton: '~Allow Access',
    importVaultPageAllowAccessButtonText: '//android.widget.TextView[@text="Allow Access"]',

    importVaultPageAllowAccessPopup: '//android.widget.LinearLayout[@resource-id="com.android.permissioncontroller:id/grant_dialog"]',
    importVaultPageAllowAccessPopupIcon: '//android.widget.ImageView[@resource-id="com.android.permissioncontroller:id/permission_icon"]',
    importVaultPageAllowAccessPopupTitle: '//android.widget.TextView[@resource-id="com.android.permissioncontroller:id/permission_message"]',
    whileUsingAppButton: '//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_foreground_only_button"]',
    onlyThisTimeButton: '//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_one_time_button"]',
    dontAllowButton: '//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_deny_button"]',

    itemVaultLinkField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup',
    itemVaultLinkFieldTitle: '//android.widget.TextView[@text="Item / Vault Link"]',
    itemVaultLinkFieldInput: '//android.widget.EditText[@text="Enter Share Link"]',
    itemVaultLinkFieldPasteButton: '~Paste',

    importVaultPageContinueButton: '~Continue',
    importVaultPageContinueButtonText: '//android.widget.TextView[@text="Continue"]',

    /* ============================
        IMPORT ITEMS BUTTON
    ============================ */
    importItemsButton: '~Import items',
    importItemsButtonIcon: '//android.widget.Button[@content-desc="Import items"]/com.horcrux.svg.SvgView',
    importItemsButtonText: '//android.widget.TextView[@text="Import items"]',



    noItemSavedTitle: '//android.view.View[@text="No item saved"]',
    noItemSavedDescription: '//android.widget.TextView[@text="Start using PearPass creating your first item or import your items from a different password manager"]',
    /* ============================
        LOADED ITEMS
    ============================ */

  onePassworAccountField: '~1Password Account (Alexey), alyaksey.bachila@gmail.com, 1A',

  
  onePasswordPasswordField: '~1Password Password, alyaksey.bachila@gmail.com, 1P',


  onePasswordLoginField: '~1PasswordLogin, alyaksey.bachila@gmail.com',


  bitwardenJsonSshField: '~SSH, SS',


  bitwardenJsonNotFoundField: '~Bit note, BN',


  bitwardenJsonLoginField: '~Bit login, Bit_login, BL',


  bitwardenJsonIdentityField: '~Bit identity, bit@email.com, BI',


  bitwardenJsonCreditCardField: '~Bit credit, Bit name, BC',



  bitwardenCsvNoteField: '(//android.view.ViewGroup[@content-desc="Bit note, BN"])[1]',


  bitwardenCsvLoginField: '(//android.view.ViewGroup[@content-desc="Bit login, Bit_login, BL"])[1]',



  lastPassCsvNameField: '~lastpass name, lastpass name, LN',


  lastPassCsvSecureField: '~Lastpass secure, LS',


  lastPassCsvItemField: '~Lastpass item, lastpass name, LI',



  nordPassCsvGmailField: '~Gmail.com, alyaksey.bachila@gmail.com',


  nordPassCsvCreditField: '~Nordpass credit, nordpass name, NC',



  protonPassCsvLoginField: '~prot login, prot nane',


  protonPassCsvNoteField: '~prot note, PN',


  protonPassCsvIdentityField: '~prot identity, protemail@gjvj.com, PI',


  protonPassJsonLoginField: '(//android.view.ViewGroup[@content-desc="prot login, prot nane"])[1]',


  protonPassJsonNoteField: '(//android.view.ViewGroup[@content-desc="prot note, PN"])[1]',


  protonPassJsonIdentityField: '(//android.view.ViewGroup[@content-desc="prot identity, protemail@gjvj.com, PI"])[1]',


  unencryptedFileJsonHgfgFile: '~hgfghg, HG',


  unencryptedFileCsvIncFile: '~Inc, Hfctg, IN',


  unencryptedFileCsvHechtFile: '~Hecht this ;$;..?)645746 chance, Fruits fh5574;:.?!( juicing, HT',



} as const

export default homeLocators
