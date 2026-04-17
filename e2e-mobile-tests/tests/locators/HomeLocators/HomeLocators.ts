const homeLocators = {
/* =====================================================
        HEADER
===================================================== */
  homeLogoLock: '//android.view.ViewGroup[@resource-id="logo-lock"]',
  searchField: '~Search field',
  searchFieldIcon: '~Search field icon',
  searchFieldInput: '~Search field input',
  threeDotsButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/com.horcrux.svg.SvgView',
/* =====================================================
        CATEGORIES (FILTERS)
===================================================== */
  homeCategoryAllButton: '~All items category button',
  homeCategoryAllButtonIcon: '~All items category icon',
  homeCategoryAllButtonText: '~All items category count',
  homeCategoryLoginsButton: '~Logins category button',
  homeCategoryLoginsButtonIcon: '~Logins category icon',
  homeCategoryLoginsButtonText: '~Logins category count',
  homeCategoryCreditCardsButton: '~Credit cards category button',
  homeCategoryCreditCardsButtonIcon: '~Credit cards category icon',
  homeCategoryCreditCardsButtonText: '~Credit cards category count',
  homeCategoryWifiButton: '~Wi-Fi category button',
  homeCategoryWifiButtonIcon: '~Wi-Fi category icon',
  homeCategoryWifiButtonText: '~Wi-Fi category count',
  homeCategoryRecoveryPhraseButton: '~Recovery phrase category button',
  homeCategoryRecoveryPhraseButtonIcon: '~Recovery phrase category icon',
  homeCategoryRecoveryPhraseButtonText: '~Recovery phrase category count',
  homeCategoryIdentitiesButton: '~Identities category button',
  homeCategoryIdentitiesButtonIcon: '~Identities category icon',
  homeCategoryIdentitiesButtonText: '~Identities category count',
  homeCategoryNotesButton: '~Notes category button',
  homeCategoryNotesButtonIcon: '~Notes category icon',
  homeCategoryNotesButtonText: '~Notes category count',
  homeCategoryCustomButton: '~Custom category button',
  homeCategoryCustomButtonIcon: '~Custom category icon',
  homeCategoryCustomButtonText: '~Custom category count',
/* =====================================================
        CREATE ITEM BUTTONS AND TEXT
===================================================== */
  emptyCollectionText: '//android.widget.TextView[@text="This collection is empty."]',
  emptyCollectionSubtitleText: '//android.widget.TextView[@text="Create a new item"]',

  createLoginButton: '~Create a login',
  createLoginButtonIcon: '//android.view.ViewGroup[@content-desc="Create a login"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  createLoginButtonText: '//android.widget.TextView[@text="Create a login"]',

  createIdentityButton: '~Create an identity',
  createIdentityButtonIcon: '//android.view.ViewGroup[@content-desc="Create an identity"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  createIdentityButtonText: '//android.widget.TextView[@text="Create an identity"]',

  createCreditCardButton: '~Create a credit card',
  createCreditCardButtonIcon: '//android.view.ViewGroup[@content-desc="Create a credit card"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  createCreditCardButtonText: '//android.widget.TextView[@text="Create a credit card"]',

  createWifiPasswordButton: '~Create a Wi-Fi password',
  createWifiPasswordButtonIcon: '//android.view.ViewGroup[@content-desc="Create a Wi-Fi password"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  createWifiPasswordButtonText: '//android.widget.TextView[@text="Create a Wi-Fi password"]',

  saveRecoveryPhraseButton: '~Save a Recovery phrase',
  saveRecoveryPhraseButtonIcon: '//android.view.ViewGroup[@content-desc="Save a Recovery phrase"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  saveRecoveryPhraseButtonText: '//android.widget.TextView[@text="Save a Recovery phrase"]',

  createNoteButton: '~Create a note',
  createNoteButtonIcon: '//android.view.ViewGroup[@content-desc="Create a note"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  createNoteButtonText: '//android.widget.TextView[@text="Create a note"]',

  createCustomElementButton: '~Create a custom element',
  createCustomElementButtonIcon: '//android.view.ViewGroup[@content-desc="Create a custom element"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  createCustomElementButtonText: '//android.widget.TextView[@text="Create a custom element"]',
/* =====================================================
        BOTTOM NAVIGATION
===================================================== */
  bottomNavHomeTab: '~Home',
  bottomNavCreateButton: '//android.view.ViewGroup[@resource-id="button-create-record"]',
  bottomNavSettingsTab: '~Settings',
/* =====================================================
        CURRENT FOLDER (FAVORITE)
===================================================== */
  homeCurrentFolderName: '//android.widget.TextView[@text="favorite"]',
  homeCurrentFolderIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  homeTestFolder: '//android.widget.TextView[@text="Test Folder"]',
  homeTestFolderIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView/com.horcrux.svg.PathView',
  homeTestFolder1: '//android.widget.TextView[@text="Test Folder1"]',
  homeTestFolder1Icon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/com.horcrux.svg.SvgView[2]',
/* =====================================================
        IMPORTED VAULTS - ONE PASSWORD
===================================================== */
  onePasswordAccount : '~1A',
  onePasswordAccountIcon : '//android.view.ViewGroup[@content-desc="1A"]/android.view.ViewGroup[1]',
  onePasswordAccountIconText : '//android.widget.TextView[@text="1A"]',
  onePasswordAccountText : '//android.widget.TextView[@text="1Password Account (Alexey)"]',

  onePasswordPassword : '~1P',
  onePasswordPasswordIcon : '//android.view.ViewGroup[@content-desc="1P"]/android.view.ViewGroup[1]',
  onePasswordPasswordIconText : '//android.widget.TextView[@text="1P"]',
  onePasswordPasswordText : '//android.widget.TextView[@text="1Password Password"]',

  onePasswordLogin : '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
  onePasswordLoginIcon : '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup[1]',
  onePasswordLoginText : '//android.widget.TextView[@text="1PasswordLogin"]',      
/* =====================================================
        IMPORTED VAULTS - BITWARDEN CSV
===================================================== */
  bitwardenNote: '~BN',
  bitwardenNoteIcon: '//android.view.ViewGroup[@content-desc="BN"]/android.view.ViewGroup[1]',
  bitwardenNoteIconText: '//android.widget.TextView[@text="BN"]',
  bitwardenNoteText: '//android.widget.TextView[@text="Bit note"]',

  bitwardenLogin: '~BL',
  bitwardenLoginIcon: '//android.view.ViewGroup[@content-desc="BL"]/android.view.ViewGroup[1]',
  bitwardenLoginIconText: '//android.widget.TextView[@text="BL"]',
  bitwardenLoginText: '//android.widget.TextView[@text="Bit login"]',
/* =====================================================
        IMPORTED VAULTS - BITWARDEN JSON
===================================================== */
  bitwardenJsonSsh: '~SS',
  bitwardenJsonSshIcon: '//android.view.ViewGroup[@content-desc="SS"]/android.view.ViewGroup[1]',
  bitwardenJsonSshIconText: '//android.widget.TextView[@text="SS"]',
  bitwardenJsonSshText: '//android.widget.TextView[@text="SSH"]',

  bitwardenJsonNote: '(//android.view.ViewGroup[@content-desc="BN"])[1]',
  bitwardenJsonNoteIcon: '(//android.view.ViewGroup[@content-desc="BN"])[1]/android.view.ViewGroup[1]',
  bitwardenJsonNoteIconText: '(//android.widget.TextView[@text="BN"])[1]',
  bitwardenJsonNoteText: '(//android.widget.TextView[@text="Bit note"])[1]',

  bitwardenJsonLogin: '(//android.view.ViewGroup[@content-desc="BL"])[1]',
  bitwardenJsonLoginIcon: '(//android.view.ViewGroup[@content-desc="BL"])[1]/android.view.ViewGroup[1]',
  bitwardenJsonLoginIconText: '(//android.widget.TextView[@text="BL"])[1]',
  bitwardenJsonLoginText: '(//android.widget.TextView[@text="Bit login"])[1]',

  bitwardenJsonCredit: '~BC',
  bitwardenJsonCreditIcon: '//android.view.ViewGroup[@content-desc="BC"]/android.view.ViewGroup[1]',
  bitwardenJsonCreditIconText: '//android.widget.TextView[@text="BC"]',
  bitwardenJsonCreditText: '//android.widget.TextView[@text="Bit credit"]',

  bitwardenJsonIdentity: '~BI',
  bitwardenJsonIdentityIcon: '//android.view.ViewGroup[@content-desc="BI"]/android.view.ViewGroup[1]',
  bitwardenJsonIdentityIconText: '//android.widget.TextView[@text="BI"]',
  bitwardenJsonIdentityText: '//android.widget.TextView[@text="Bit identity"]',
/* =====================================================
        IMPORTED VAULTS - LAST PASS CSV
===================================================== */
  lastPassCsvName: '~LN, Secure notes',
  lastPassCsvNameIcon: '//android.view.ViewGroup[@content-desc="LN, Secure notes"]/android.view.ViewGroup[1]',
  lastPassCsvNameIconText: '//android.widget.TextView[@text="LN"]',
  lastPassCsvNameText: '//android.widget.TextView[@text="lastpass name"]',

  lastPassCsvSecure: '~LS, Secure notes',
  lastPassCsvSecureIcon: '//android.view.ViewGroup[@content-desc="LS, Secure notes"]/android.view.ViewGroup[1]',
  lastPassCsvSecureIconText: '//android.widget.TextView[@text="LS"]',
  lastPassCsvSecureText: '//android.widget.TextView[@text="Lastpass secure"]',

  lastPassCsvItem: '~LI',
  lastPassCsvItemIcon: '//android.view.ViewGroup[@content-desc="LI"]/android.view.ViewGroup[1]',
  lastPassCsvItemIconText: '//android.widget.TextView[@text="LI"]',
  lastPassCsvItemText: '//android.widget.TextView[@text="Lastpass item"]',
/* =====================================================
        IMPORTED VAULTS - NORDPASS CSV
===================================================== */
  nordPassCsvCredit: '~NC, test',
  nordPassCsvCreditIcon: '//android.view.ViewGroup[@content-desc="NC, test"]/android.view.ViewGroup[1]',
  nordPassCsvCreditIconText: '//android.widget.TextView[@text="NC"]',
  nordPassCsvCreditText: '//android.widget.TextView[@text="Nordpass credit"]',

  nordPassCsvGmail: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
  nordPassCsvGmailIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[1]',
  nordPassCsvGmailText: '//android.widget.TextView[@text="Gmail.com"]',
/* =====================================================
        IMPORTED VAULTS - PROTONPASS CSV
===================================================== */
  protonPassCsvIdentity: '~PI, Personal',
  protonPassCsvIdentityIcon: '//android.view.ViewGroup[@content-desc="PI, Personal"]/android.view.ViewGroup[1]',
  protonPassCsvIdentityIconText: '//android.widget.TextView[@text="PI"]',
  protonPassCsvIdentityText: '//android.widget.TextView[@text="prot identity"]',
  protonPassCsvIdentityText2: '(//android.widget.TextView[@text="Personal"])[1]',

  protonPassCsvNote: '~PN, Personal',
  protonPassCsvNoteIcon: '//android.view.ViewGroup[@content-desc="PN, Personal"]/android.view.ViewGroup[1]',
  protonPassCsvNoteIconText: '//android.widget.TextView[@text="PN"]',
  protonPassCsvNoteText: '//android.widget.TextView[@text="prot note"]',
  protonPassCsvNoteText2: '(//android.widget.TextView[@text="Personal"])[2]',

  protonPassCsvLogin: '~PL, Personal',
  protonPassCsvLoginIcon: '//android.view.ViewGroup[@content-desc="Personal"]/android.view.ViewGroup[1]',
  protonPassCsvLoginText: '//android.widget.TextView[@text="prot login"]',
  protonPassCsvLoginText2: '(//android.widget.TextView[@text="Personal"])[3]',
/* =====================================================
        IMPORTED VAULTS - PROTONPASS CSV
===================================================== */
  protonPassJsonIdentity: '(//android.view.ViewGroup[@content-desc="PI, Personal"])[1]',
  protonPassJsonIdentityIcon: '(//android.view.ViewGroup[@content-desc="PI, Personal"])[1]/android.view.ViewGroup[1]',
  protonPassJsonIdentityIconText: '(//android.widget.TextView[@text="PI"])[1]',
  protonPassJsonIdentityText: '(//android.widget.TextView[@text="prot identity"])[1]',

  protonPassJsonNote: '(//android.view.ViewGroup[@content-desc="PN, Personal"])[1]',
  protonPassJsonNoteIcon: '(//android.view.ViewGroup[@content-desc="PN, Personal"])[1]/android.view.ViewGroup[1]',
  protonPassJsonNoteIconText: '(//android.widget.TextView[@text="PN"])[1]',
  protonPassJsonNoteText: '(//android.widget.TextView[@text="prot note"])[1]',

  protonPassJsonLogin: '(//android.view.ViewGroup[@content-desc="PL, Personal"])[1]',
  protonPassJsonLoginIcon: '(//android.view.ViewGroup[@content-desc="PL, Personal"])[1]/android.view.ViewGroup[1]',
  protonPassJsonLoginText: '(//android.widget.TextView[@text="prot login"])[1]',
  protonPassJsonLoginText2: '(//android.widget.TextView[@text="Personal"])[3]',
/* =====================================================
        IMPORTED VAULTS - UNENCRYPTED FILE CSV
===================================================== */
  unencryptedFileCsvHecht: '~HT',
  unencryptedFileCsvHechtIcon: '//android.view.ViewGroup[@content-desc="HT"]/android.view.ViewGroup[1]',
  unencryptedFileCsvHechtIconText: '//android.widget.TextView[@text="HT"]',
  unencryptedFileCsvHechtText: '//android.widget.TextView[@text="Hecht this ;$;..?)645746 chance"]',

  unencryptedFileCsvInc: '~IN, New reg',
  unencryptedFileCsvIncIcon: '//android.view.ViewGroup[@content-desc="IN, New reg"]/android.view.ViewGroup[1]',
  unencryptedFileCsvIncIconText: '//android.widget.TextView[@text="IN"]',
  unencryptedFileCsvIncText: '//android.widget.TextView[@text="Inc"]',

  unencryptedFileJsonDisplayed: '~HG',
/* =====================================================
        CREATE ITEM POPUP
===================================================== */
  createItemPopup: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]',
  loginsField: '~Logins, Save your username and password for any website or app.',
  loginsFieldIcon: '//android.view.ViewGroup[@content-desc="Logins, Save your username and password for any website or app."]/android.view.ViewGroup',
  loginsFieldIcon2: '//android.view.ViewGroup[@content-desc="Logins, Save your username and password for any website or app."]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  loginsFieldTitle: '//android.widget.TextView[@text="Logins"]',
  loginsFieldText: '//android.widget.TextView[@text="Save your username and password for any website or app."]',

  creditCardsField: '~Credit cards, Securely store card number, expiry date, and CVV.',
  creditCardsFieldIcon: '//android.view.ViewGroup[@content-desc="Credit cards, Securely store card number, expiry date, and CVV."]/android.view.ViewGroup',
  creditCardsFieldIcon2: '//android.view.ViewGroup[@content-desc="Credit cards, Securely store card number, expiry date, and CVV."]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  creditCardsFieldTitle: '//android.widget.TextView[@text="Credit cards"]',
  creditCardsFieldText: '//android.widget.TextView[@text="Securely store card number, expiry date, and CVV."]',

  wifiField: '~Wi-Fi, Keep your Wi-Fi name and password safe.',
  wifiFieldIcon: '//android.view.ViewGroup[@content-desc="Wi-Fi, Keep your Wi-Fi name and password safe."]/android.view.ViewGroup',
  wifiFieldIcon2: '//android.view.ViewGroup[@content-desc="Wi-Fi, Keep your Wi-Fi name and password safe."]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  wifiFieldTitle: '//android.widget.TextView[@text="Wi-Fi"]',
  wifiFieldText: '//android.widget.TextView[@text="Keep your Wi-Fi name and password safe."]',

  recoveryPhraseField: '~Recovery phrase, Securely store app recovery phrases.',
  recoveryPhraseFieldIcon: '//android.view.ViewGroup[@content-desc="Recovery phrase, Securely store app recovery phrases."]/android.view.ViewGroup',
  recoveryPhraseFieldIcon2: '//android.view.ViewGroup[@content-desc="Recovery phrase, Securely store app recovery phrases."]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  recoveryPhraseFieldTitle: '//android.widget.TextView[@text="Recovery phrase"]',
  recoveryPhraseFieldText: '//android.widget.TextView[@text="Securely store app recovery phrases."]',

  identitiesField: '~Identities, Keep personal info like ID numbers and addresses safe.',
  identitiesFieldIcon: '//android.view.ViewGroup[@content-desc="Identities, Keep personal info like ID numbers and addresses safe."]/android.view.ViewGroup',
  identitiesFieldIcon2: '//android.view.ViewGroup[@content-desc="Identities, Keep personal info like ID numbers and addresses safe."]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  identitiesFieldTitle: '//android.widget.TextView[@text="Identities"]',
  identitiesFieldText: '//android.widget.TextView[@text="Keep personal info like ID numbers and addresses safe."]',

  notesField: '~Notes, Encrypt and store private notes or sensitive text.',
  notesFieldIcon: '//android.view.ViewGroup[@content-desc="Notes, Encrypt and store private notes or sensitive text."]/android.view.ViewGroup',
  notesFieldIcon2: '//android.view.ViewGroup[@content-desc="Notes, Encrypt and store private notes or sensitive text."]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  notesFieldTitle: '//android.widget.TextView[@text="Notes"]',
  notesFieldText: '//android.widget.TextView[@text="Encrypt and store private notes or sensitive text."]',

  customField: '~Custom, Create your own entry with fully custom fields. ',
  customFieldIcon: '//android.view.ViewGroup[@content-desc="Custom, Create your own entry with fully custom fields. "]/android.view.ViewGroup',
  customFieldIcon2: '//android.view.ViewGroup[@content-desc="Custom, Create your own entry with fully custom fields. "]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  customFieldTitle: '//android.widget.TextView[@text="Custom"]',
  customFieldText: '//android.widget.TextView[@text="Create your own entry with fully custom fields. "]',

  passwordField: '~Password, Create a safe password or passphrase',
  passwordFieldIcon: '//android.view.ViewGroup[@content-desc="Password, Create a safe password or passphrase"]/android.view.ViewGroup',
  passwordFieldIcon2: '//android.view.ViewGroup[@content-desc="Password, Create a safe password or passphrase"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
  passwordFieldTitle: '//android.widget.TextView[@text="Password"]',
  passwordFieldText: '//android.widget.TextView[@text="Create a safe password or passphrase"]',
/* =====================================================
        HOME PAGE - LOGIN CREATED ON HOME PAGE
===================================================== */
  loginCreatedOnHomePage: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup',
  loginCreatedOnHomePageIcon: '//android.view.ViewGroup[@content-desc="LT"]/android.view.ViewGroup[1]',
  loginCreatedOnHomePageText: '//android.widget.TextView[@text="Login to Google"]',
  newLoginCreatedOnHomePageText: '//android.widget.TextView[@text="Login to Google New Title"]',
  loginCreatedOnHomePageThreeDotsButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
/* =====================================================
        HOME PAGE - CREDIT CARD CREATED ON HOME PAGE
===================================================== */
  creditCardCreatedOnHomePage: '~TC',
  creditCardCreatedOnHomePageIcon: '//android.view.ViewGroup[@content-desc="TC"]/android.view.ViewGroup[1]',
  creditCardCreatedOnHomePageText: '//android.widget.TextView[@text="Test Credit Card"]',
  creditCardCreatedOnHomePageThreeDotsButton: '//android.view.ViewGroup[@content-desc="TC"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
/* =====================================================
        HOME PAGE - WIFI CREATED ON HOME PAGE
===================================================== */
  wifiCreatedOnHomePage: '~TW',
  wifiCreatedOnHomePageIcon: '//android.view.ViewGroup[@content-desc="TW"]/android.view.ViewGroup[1]',
  wifiCreatedOnHomePageText: '//android.widget.TextView[@text="Test Wi-Fi Network"]',
  wifiCreatedOnHomePageThreeDotsButton: '//android.view.ViewGroup[@content-desc="TW"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
/* =====================================================
        HOME PAGE - RECOVERY PHRASE CREATED ON HOME PAGE
===================================================== */
  recoveryPhraseCreatedOnHomePage: '~TA',
  recoveryPhraseCreatedOnHomePageIcon: '//android.view.ViewGroup[@content-desc="TA"]/android.view.ViewGroup[1]',
  recoveryPhraseCreatedOnHomePageText: '//android.widget.TextView[@text="Test Application"]',
  recoveryPhraseCreatedOnHomePageThreeDotsButton: '//android.view.ViewGroup[@content-desc="TA"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
/* =====================================================
        HOME PAGE - IDENTITY CREATED ON HOME PAGE
===================================================== */
  identityCreatedOnHomePage: '~TI, Test Folder',
  identityCreatedOnHomePageIcon: '//android.view.ViewGroup[@content-desc="TI, Test Folder"]/android.view.ViewGroup[1]',
  identityCreatedOnHomePageText: '//android.widget.TextView[@text="Test Identity Title"]',
  identityCreatedOnHomePageThreeDotsButton: '//android.view.ViewGroup[@content-desc="TI, Test Folder"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
/* =====================================================
        HOME PAGE - NOTE CREATED ON HOME PAGE
===================================================== */
  noteCreatedOnHomePage: '~TN, Test Folder',
  noteCreatedOnHomePageIcon: '//android.view.ViewGroup[@content-desc="TN, Test Folder"]/android.view.ViewGroup[1]',
  noteCreatedOnHomePageText: '//android.widget.TextView[@text="Test Note Title"]',
  noteCreatedOnHomePageThreeDotsButton: '//android.view.ViewGroup[@content-desc="TN, Test Folder"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
/* =====================================================
        HOME PAGE - CUSTOM ELEMENT CREATED ON HOME PAGE
===================================================== */
  customElementCreatedOnHomePage: '~TC, Testing Folder',
  customElementCreatedOnHomePageIcon: '//android.view.ViewGroup[@content-desc="TC, Testing Folder"]/android.view.ViewGroup[1]',
  customElementCreatedOnHomePageText: '//android.widget.TextView[@text="Test Custom Title"]',
  customElementCreatedOnHomePageThreeDotsButton: '//android.view.ViewGroup[@content-desc="TC, Testing Folder"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',

}
export default homeLocators
