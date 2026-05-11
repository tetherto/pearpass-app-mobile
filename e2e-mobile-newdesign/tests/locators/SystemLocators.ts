const systemLocators = {

    /* ----- DOWNLOADS FOLDER ----- */
    downloadsFolderTitle: '(//android.widget.TextView[@text="Downloads"])[2]',
    menuButton: '~Show roots',
    openFromTitle: '//android.widget.TextView[@text="Open from"]',
    downloadsButton: '//android.widget.ListView[@resource-id="com.google.android.documentsui:id/roots_list"]/android.widget.LinearLayout[3]/android.widget.LinearLayout',
    /* ----- FILES ----- */
    onePasswordFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="1PasswordExport-VOOZZKNJHBAA7NTCW7SJU7763Y-20251217-223358.csv"]',
    bitwardenCsvFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="bitwarden_export_20251218011811.csv"]',
    bitwardenJsonFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="bitwarden_export_20251218011800.json"]',
    lastPassCsvFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="lastpass_vault_export (1).csv"]',
    nordPassCsvFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="nordpass_2025-10-25 01_47_36 (1).csv"]',
    protonPassCsvFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="Proton Pass_export_2025-12-17_1766000222.csv"]',
    protonPassJsonFile: '//android.widget.TextView[@text="Proton pass.json"]',
    unencryptedFileCsvFile: '//android.widget.TextView[@text="PearPass_Reg_ios_10_11_1_2025_11_11T21_49_11_607Z.csv"]',
    unencryptedFileJsonFile: '//android.widget.TextView[@text="PearPass_ytgiu_2025_12_02T10_41_25_523Z.json"]',
    encryptedFileJsonFile: '//android.widget.TextView[@resource-id="android:id/title" and starts-with(@text, "PearPass_") and contains(@text, ".json")]',

    ownersManualFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="owners-manual.pdf"]',
    largeFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="LargeFile.pdf"]',
    testDocxFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="Test.docx"]',
    passportTemplateFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="passport-template.jpg"]',
    idCardTemplateFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="id-card-template.jpg"]',
    drivinhLicenseTemplateFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="driving-license-template.jpg"]',
    



    /* ----- PHONE SETTINGS → Security → fingerprint setup ----- */
    settingsButton: '(//android.widget.TextView[@content-desc="Settings"])[1]',
    securityAndPrivacyButton: '//*[@text="Security & privacy"]',
    securityAndPrivacyTitle: '~Security & privacy',
    deviceUnlockButton: '//androidx.recyclerview.widget.RecyclerView[@resource-id="com.android.permissioncontroller:id/recycler_view"]/android.widget.LinearLayout[3]/android.widget.RelativeLayout',
    deviceUnlockTitle: '~Device unlock',
    pixelImprintButton: '//androidx.recyclerview.widget.RecyclerView[@resource-id="com.android.permissioncontroller:id/recycler_view"]/android.widget.LinearLayout[3]/android.widget.RelativeLayout',
    chooseScreenLockTitle: '~Choose a screen lock',
    pixelImprintPlusPinButton: '//android.widget.LinearLayout[@resource-id="com.android.settings:id/lock_pin"]/android.widget.RelativeLayout',
    pinInputField: '~PIN area',
    nextButton: '//android.widget.Button[@text="NEXT"]',
    reenterPinInputField: '~PIN area',
    confirmButton: '//android.widget.Button[@text="CONFIRM"]',
    showAllNotificationsContentButton: '//android.widget.RadioButton[@resource-id="com.android.settings:id/show_all"]',
    doneButton: '//android.widget.Button[@text="Done"]',
    setupPixelImprintTittle: '~Set up Pixel Imprint',
    iAgreeButton: '//android.widget.Button[@text="I AGREE"]',
    touchTheSensorTitle: '~Touch the sensor',
    liftThenTouchAgainTitle: '~Lift, then touch again',
    fingerPrintAddedTitle: '~Fingerprint added',
    doneButton2: '//android.widget.Button[@text="DONE"]',

} as const

export type SystemFileKey =
  | 'onePasswordFile'
  | 'bitwardenCsvFile'
  | 'bitwardenJsonFile'
  | 'lastPassCsvFile'
  | 'nordPassCsvFile'
  | 'protonPassCsvFile'
  | 'protonPassJsonFile'
  | 'unencryptedFileCsvFile'
  | 'unencryptedFileJsonFile'
  | 'encryptedFileJsonFile';

export type AttachmentFileKey =
  | 'ownersManualFile'
  | 'largeFile'
  | 'testDocxFile'
  | 'passportTemplateFile'
  | 'idCardTemplateFile'
  | 'drivinhLicenseTemplateFile';

export default systemLocators
