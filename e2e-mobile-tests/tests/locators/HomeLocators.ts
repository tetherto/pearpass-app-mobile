const homeLocators = {
/* =====================================================
        HEADER
===================================================== */

  homeLogoLock: '//android.view.ViewGroup[@resource-id="logo-lock"]',
  homeSearchInput: '//android.widget.EditText[@text="Search..."]',
  homeSearchPlaceholder: '',
  homeSearchCount: '',
  homeMenuButton: '',

/* =====================================================
        CATEGORIES (FILTERS)
===================================================== */

  homeCategoryAll: '',
  homeCategoryLogins: '',
  homeCategoryCreditCards: '',
  homeCategoryWifi: '',
  homeCategoryRecoveryPhrase: '',
  homeCategoryIdentities: '',
  homeCategoryNotes: '',
  homeCategoryCustom: '',

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

  nordPassCsvGmail: '~GM',
  nordPassCsvGmailIcon: '//android.view.ViewGroup[@content-desc="GM"]/android.view.ViewGroup[1]',
  nordPassCsvGmailIconText: '//android.widget.TextView[@text="GM"]',
  nordPassCsvGmailText: '//android.widget.TextView[@text="Gmail.com"]',

/* =====================================================
        IMPORTED VAULTS - PROTONPASS CSV
===================================================== */

  protonPassCsvIdentity: '~PI, Personal',
  protonPassCsvIdentityIcon: '//android.view.ViewGroup[@content-desc="PI, Personal"]/android.view.ViewGroup[1]',
  protonPassCsvIdentityIconText: '//android.widget.TextView[@text="PI"]',
  protonPassCsvIdentityText: '//android.widget.TextView[@text="prot identity"]',

  protonPassCsvNote: '~PN, Personal',
  protonPassCsvNoteIcon: '//android.view.ViewGroup[@content-desc="PN, Personal"]/android.view.ViewGroup[1]',
  protonPassCsvNoteIconText: '//android.widget.TextView[@text="PN"]',
  protonPassCsvNoteText: '//android.widget.TextView[@text="prot note"]',

  protonPassCsvLogin: '~PL, Personal',
  protonPassCsvLoginIcon: '//android.view.ViewGroup[@content-desc="PL, Personal"]/android.view.ViewGroup[1]',
  protonPassCsvLoginIconText: '//android.widget.TextView[@text="PL"]',
  protonPassCsvLoginText: '//android.widget.TextView[@text="prot login"]',


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
  protonPassJsonLoginIconText: '(//android.widget.TextView[@text="PL"])[1]',
  protonPassJsonLoginText: '(//android.widget.TextView[@text="prot login"])[1]',


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




}
export default homeLocators
