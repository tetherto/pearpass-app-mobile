import BasePage from '@pages/BasePage';
import settingsLocators from '@locators/SettingsLocators';
import systemLocators, { type SystemFileKey } from '@locators/SystemLocators';
import {
  SETTINGS_PAGE,
  APP_PREFERENCES_PAGE,
  MASTER_PASSWORD_PAGE,
  BLIND_PEERING_PAGE,
  YOUR_DEVICES_PAGE,
  YOUR_VAULTS_PAGE,
  CREATE_NEW_VAULT_PAGE,
  IMPORT_ITEMS_PAGE,
  EXPORT_ITEMS_PAGE,
  SHARE_POPUP,
  CLEAR_CLIPBOARD_POPUP,
  AUTO_LOCK_POPUP,
  FINGERPRINT_POPUP,
  VERIFICATION_REQUIRED_POPUP,
  type ImportSourceKey,
  YOUR_VAULTS_TOASTS,
  NEW_CREATED_VAULT_FIELD,
  RENAMED_VAULT_FIELD,
  SHARE_VAULT_POPUP,
  COMMON_TOASTS,
  VAULT_THREE_DOTS_POPUP,
  RENAME_VAULT_PAGE,
  LANGUAGE_PAGE,
  REPORT_A_PROBLEM_PAGE,
  APP_VERSION_PAGE,
  TERMS_OF_USE_PAGE,
  PRIVACY_STATEMENT_PAGE,
  VISIT_OUR_WEBSITE_PAGE,
  type PasswordWarningKey,
  type PasswordFieldName,
  type PasswordStrength,
  type PasswordMatchStatus,
  type PasswordIndicatorStatus,
  type BlindPeerField,
  type BlindPeerCheckState,
} from '@data/settings.data';

const SETTINGS_SECTION_CHILDREN = {
  securitySection: ['appPreferences', 'masterPassword'],
  syncingSection: ['blindPeering', 'yourDevices'],
  vaultSection: ['yourVaults', 'importItems', 'exportItems'],
  appearanceSection: ['language'],
  aboutSection: ['reportAProblem', 'appVersion'],
} as const;

const IMPORT_FROM_PAGE_TITLE_LOCATOR = {
  onePassword: 'importFromOnePasswordPageTitle',
  bitwarden: 'bitwardenImportFromOnePasswordPageTitle',
  keepass: 'keepassImportFromOnePasswordPageTitle',
  keepassxc: 'keepassxcImportFromOnePasswordPageTitle',
  lastpass: 'lastpassImportFromOnePasswordPageTitle',
  nordpass: 'nordpassImportFromOnePasswordPageTitle',
  protonpass: 'protonpassImportFromOnePasswordPageTitle',
  encryptedFile: 'encryptedFileImportFromOnePasswordPageTitle',
  unencryptedFile: 'unencryptedFileImportFromOnePasswordPageTitle',
} as const satisfies Record<ImportSourceKey, string>;

const IMPORTED_FILE_LOCATOR_PREFIX = {
  onePasswordFile: 'onePassword',
  bitwardenCsvFile: 'bitwardenCSV',
  bitwardenJsonFile: 'bitwardenJSON',
  lastPassCsvFile: 'lastpass',
  nordPassCsvFile: 'nordpass',
  protonPassCsvFile: 'protonpass',
  protonPassJsonFile: 'protonpass',
  encryptedFileJsonFile: 'encryptedFile',
  unencryptedFileJsonFile: 'unencryptedFile',
  unencryptedFileCsvFile: 'unencryptedFile',

} as const satisfies Partial<Record<SystemFileKey, string>>;

type ImportedFileKey = keyof typeof IMPORTED_FILE_LOCATOR_PREFIX;

export class SettingsPage extends BasePage {
  protected selectors = { ...settingsLocators, ...systemLocators };

  /* ==================== SETTINGS PAGE — VERIFICATIONS ==================== */

  async verifySettingsPageWithAllElements(): Promise<this> {

    await this.waitForDisplayed('settingsPageSearchField', 20000);
    await this.expectDisplayed('settingsPageSearchField');
    await this.expectDisplayed('settingsPageSearchFieldInput');
    await this.expectExactText('settingsPageSearchFieldInput', SETTINGS_PAGE.searchField.placeholder);
    await this.expectDisplayed('settingsPageSearchFieldIcon');

    await this.waitForDisplayed('securitySection', 20000);
    await this.verifySectionRow('securitySection', 'securitySectionText', 'securitySectionIcon', 'securitySectionHideIcon', SETTINGS_PAGE.sections.security.title);
    await this.verifyItemRow('appPreferences', 'appPreferencesText', 'appPreferencesIcon', SETTINGS_PAGE.sections.security.items.appPreferences);
    await this.verifyItemRow('masterPassword', 'masterPasswordText', 'masterPasswordIcon', SETTINGS_PAGE.sections.security.items.masterPassword);

    await this.waitForDisplayed('syncingSection', 20000);
    await this.verifySectionRow('syncingSection', 'syncingSectionText', 'syncingSectionIcon', 'syncingSectionHideIcon', SETTINGS_PAGE.sections.syncing.title);
    await this.verifyItemRow('blindPeering', 'blindPeeringText', 'blindPeeringIcon', SETTINGS_PAGE.sections.syncing.items.blindPeering);
    await this.verifyItemRow('yourDevices', 'yourDevicesText', 'yourDevicesIcon', SETTINGS_PAGE.sections.syncing.items.yourDevices);

    await this.waitForDisplayed('vaultSection', 20000);
    await this.verifySectionRow('vaultSection', 'vaultSectionText', 'vaultSectionIcon', 'vaultSectionHideIcon', SETTINGS_PAGE.sections.vault.title);
    await this.verifyItemRow('yourVaults', 'yourVaultsText', 'yourVaultsIcon', SETTINGS_PAGE.sections.vault.items.yourVaults);
    await this.verifyItemRow('importItems', 'importItemsText', 'importItemsIcon', SETTINGS_PAGE.sections.vault.items.importItems);
    await this.waitForDisplayed('exportItemsIcon', 20000);
    await this.verifyItemRow('exportItems', 'exportItemsText', 'exportItemsIcon', SETTINGS_PAGE.sections.vault.items.exportItems);

    await this.waitForDisplayed('appearanceSection', 20000);
    await this.verifySectionRow('appearanceSection', 'appearanceSectionText', 'appearanceSectionIcon', 'appearanceSectionHideIcon', SETTINGS_PAGE.sections.appearance.title);
    await this.verifyItemRow('language', 'languageText', 'languageIcon', SETTINGS_PAGE.sections.appearance.items.language);

    await this.swipe('up');

    await this.waitForDisplayed('aboutSection', 20000);
    await this.verifySectionRow('aboutSection', 'aboutSectionText', 'aboutSectionIcon', 'aboutSectionHideIcon', SETTINGS_PAGE.sections.about.title);
    await this.verifyItemRow('reportAProblem', 'reportAProblemText', 'reportAProblemIcon', SETTINGS_PAGE.sections.about.items.reportAProblem);
    await this.verifyItemRow('appVersion', 'appVersionText', 'appVersionIcon', SETTINGS_PAGE.sections.about.items.appVersion);

    return this.self;
  }

  /* ==================== ACTIONS ==================== */

  async tapBackButton(): Promise<this> {
    await this.tap('backButton');
    return this.self;
  }

  async tapAppPreferencesButton(): Promise<this> {
    await this.tap('appPreferences');
    return this.self;
  }

  async tapOnClearClipboardField(): Promise<this> {
    await this.tap('clearClipboardTimeoutField');
    return this.self;
  }

  async tapOnClearAutoLockField(): Promise<this> {
    await this.tap('autoLockTimeoutField');
    return this.self;
  }

  async verifyAutoLockPopupWithAllElements(): Promise<this> {
    const data = AUTO_LOCK_POPUP;

    await this.waitForDisplayed('autoLockBottomSheet', 20000);
    await this.expectDisplayed('autoLockBottomSheet');
    await this.expectDisplayed('autoLockBottomSheetTitle');
    await this.expectExactText('autoLockBottomSheetTitle', data.title);
    await this.expectDisplayed('popupCloseButton');

    for (const [key, label] of Object.entries(data.options)) {
      const pascal = key[0].toUpperCase() + key.slice(1);
      await this.expectDisplayed(`autoLock${pascal}Button`);
      await this.expectDisplayed(`autoLock${pascal}ButtonText`);
      await this.expectExactText(`autoLock${pascal}ButtonText`, label);
    }

    return this.self;
  }

  async verifyAutoLockPopupNotDisplayed(): Promise<this> {
    await this.expectDisplayed('autoLockBottomSheet', false);
    return this.self;
  }

  async verifyAutoLockFieldNeverDisplayed(): Promise<this> {
    await this.waitForDisplayed('autolockFieldNever', 20000);
    await this.expectDisplayed('autolockFieldNever');
    await this.expectDisplayed('autolockFieldNeverText');
    await this.expectExactText(
      'autolockFieldNeverText',
      AUTO_LOCK_POPUP.options.never,
    );
    return this.self;
  }

  async verifyClearClipboardPopupWithAllElements(): Promise<this> {
    const data = CLEAR_CLIPBOARD_POPUP;

    await this.waitForDisplayed('clearClipboardPopup', 20000);
    await this.expectDisplayed('clearClipboardPopup');
    await this.expectDisplayed('clearClipboardPopupTitle');
    await this.expectExactText('clearClipboardPopupTitle', data.title);
    await this.expectDisplayed('popupCloseButton');

    for (const [key, label] of Object.entries(data.options)) {
      const pascal = key[0].toUpperCase() + key.slice(1);
      await this.expectDisplayed(`clearClipboard${pascal}Button`);
      await this.expectDisplayed(`clearClipboard${pascal}ButtonText`);
      await this.expectExactText(`clearClipboard${pascal}ButtonText`, label);
    }

    return this.self;
  }

  async verifyClearClipboardPopupNotDisplayed(): Promise<this> {
    await this.expectDisplayed('clearClipboardPopup', false);
    return this.self;
  }

  async tapOnOneHourButton(): Promise<this> {
    await this.tap('clearClipboardOneHourButton');
    return this.self;
  }

  async tapOnNeverButton(): Promise<this> {
    await this.tap('autoLockNeverButton');
    return this.self;
  }

  async verifyClearClipboardPopupTimeoutFieldOneHourDisplayed(): Promise<this> {
    await this.waitForDisplayed('clearClipboardPopupTimeoutFieldOneHour', 20000);
    await this.expectDisplayed('clearClipboardPopupTimeoutFieldOneHour');
    await this.expectDisplayed('clearClipboardPopupTimeoutFieldOneHourText');
    await this.expectExactText(
      'clearClipboardPopupTimeoutFieldOneHourText',
      CLEAR_CLIPBOARD_POPUP.options.oneHour,
    );
    return this.self;
  }

  async tapMasterPasswordButton(): Promise<this> {
    await this.tap('masterPassword');
    return this.self;
  }

  async tapBlindPeeringButton(): Promise<this> {
    await this.tap('blindPeering');
    return this.self;
  }

  async tapOnYourDevicesButton(): Promise<this> {
    await this.tap('yourDevices');
    return this.self;
  }

  async tapOnYourVaultsButton(): Promise<this> {
    await this.tap('yourVaults');
    return this.self;
  }

  async tapOnImportItemsButton(): Promise<this> {
    await this.tap('importItems');
    return this.self;
  }

  async tapOnExportItemsButton(): Promise<this> {
    await this.tap('exportItems');
    return this.self;
  }

  async verifyVaultExportItemsPageWithAllElementsDisplayed(): Promise<this> {
    const data = EXPORT_ITEMS_PAGE;

    await this.waitForDisplayed('vaultExportItemsPageTitle', 20000);
    await this.expectExactText('vaultExportItemsPageTitle', data.title);

    await this.expectDisplayed('vaultExportItemsPageDescription');
    await this.expectExactText('vaultExportItemsPageDescription', data.description);

    await this.expectDisplayed('vaultExportItemsPageJSONField');
    await this.expectDisplayed('vaultExportItemsPageJSONFieldTitle');
    await this.expectExactText('vaultExportItemsPageJSONFieldTitle', data.json.title);
    await this.expectDisplayed('vaultExportItemsPageJSONFieldText');
    await this.expectExactText('vaultExportItemsPageJSONFieldText', data.json.description);
    await this.expectDisplayed('vaultExportItemsPageJSONFieldRadioButtonOn');

    await this.expectDisplayed('vaultExportItemsPageCSVField');
    await this.expectDisplayed('vaultExportItemsPageCSVFieldTitle');
    await this.expectExactText('vaultExportItemsPageCSVFieldTitle', data.csv.title);
    await this.expectDisplayed('vaultExportItemsPageCSVFieldText');
    await this.expectExactText('vaultExportItemsPageCSVFieldText', data.csv.description);
    await this.expectDisplayed('vaultExportItemsPageCSVFieldRadioButtonOff');

    await this.expectDisplayed('vaultExportItemsPageProtectWithPasswordField');
    await this.expectDisplayed('vaultExportItemsPageProtectWithPasswordFieldTitle');
    await this.expectExactText(
      'vaultExportItemsPageProtectWithPasswordFieldTitle',
      data.protectWithPassword.title,
    );
    await this.expectDisplayed('vaultExportItemsPageProtectWithPasswordFieldText');
    await this.expectExactText(
      'vaultExportItemsPageProtectWithPasswordFieldText',
      data.protectWithPassword.description,
    );
    await this.expectDisplayed('vaultExportItemsPageProtectWithPasswordFieldToggleButtonOff');

    return this.self;
  }

  async verifyExportSuccessToastMessageDisplayedWithAllElements(): Promise<this> {
    const data = EXPORT_ITEMS_PAGE.successToast;

    await this.waitForDisplayed('exportSuccessToast', 20000);
    await this.expectDisplayed('exportSuccessToast');
    await this.expectDisplayed('exportSuccessToastTitle');
    await this.expectExactText('exportSuccessToastTitle', data.title);
    await this.expectDisplayed('exportSuccessToastText');
    await this.expectExactText('exportSuccessToastText', data.text);

    return this.self;
  }

  async tapOnJSONField(): Promise<this> {
    await this.tap('vaultExportItemsPageJSONField');
    return this.self;
  }

  async tapOnCSVField(): Promise<this> {
    await this.tap('vaultExportItemsPageCSVField');
    return this.self;
  }

  async tapOnExportButton(): Promise<this> {
    await this.tap('vaultExportItemsPageExportButton');
    return this.self;
  }

  async verifyExportButtonDisabledByDefault(): Promise<this> {
    await this.expectDisplayed('vaultExportItemsPageExportButton');
    await this.expectEnabled('vaultExportItemsPageExportButton', false);
    return this.self;
  }

  async enterPassword(password: string): Promise<this> {
    await this.type('vaultExportItemsPagePasswordFieldInput', password);
    return this.self;
  }

  async enterRepeatPassword(password: string): Promise<this> {
    await this.type('vaultExportItemsPageRepeatPasswordFieldInput', password);
    return this.self;
  }

  async tapOnProtectWithPasswordField(): Promise<this> {
    await this.tap('vaultExportItemsPageProtectWithPasswordField');
    return this.self;
  }

  async verifyPasswordFieldDisplayed(): Promise<this> {
    const data = EXPORT_ITEMS_PAGE.passwordField;

    await this.expectDisplayed('vaultExportItemsPagePasswordField');
    await this.expectDisplayed('vaultExportItemsPagePasswordFieldTitle');
    await this.expectExactText('vaultExportItemsPagePasswordFieldTitle', data.title);
    await this.expectDisplayed('vaultExportItemsPagePasswordFieldInput');
    await this.expectExactText('vaultExportItemsPagePasswordFieldInput', data.placeholder);
    await this.expectDisplayed('vaultExportItemsPagePasswordFieldShowPasswordButton');

    return this.self;
  }

  async verifyRepeatPasswordFieldDisplayed(): Promise<this> {
    const data = EXPORT_ITEMS_PAGE.repeatPasswordField;

    await this.expectDisplayed('vaultExportItemsPageRepeatPasswordField');
    await this.expectDisplayed('vaultExportItemsPageRepeatPasswordFieldTitle');
    await this.expectExactText('vaultExportItemsPageRepeatPasswordFieldTitle', data.title);
    await this.expectDisplayed('vaultExportItemsPageRepeatPasswordFieldInput');
    await this.expectExactText('vaultExportItemsPageRepeatPasswordFieldInput', data.placeholder);
    await this.expectDisplayed('vaultExportItemsPageRepeatPasswordFieldShowPasswordButton');

    return this.self;
  }

  async verifyFingerPrintPopupDisplayed(): Promise<this> {
    await this.waitForDisplayed('fingerPrintPopup', 20000);
    await this.expectDisplayed('fingerPrintPopup');
    await this.expectDisplayed('fingerPrintPopupLogo');
    await this.expectDisplayed('fingerPrintPopupTitle');
    await this.expectExactText('fingerPrintPopupTitle', FINGERPRINT_POPUP.title);
    await this.expectDisplayed('fingerPrintPopupSensor');
    await this.expectDisplayed('fingerPrintPopupCancelButton');

    return this.self;
  }

  async tapOnFingerPrintPopupCancelButton(): Promise<this> {
    await this.tap('fingerPrintPopupCancelButton');
    return this.self;
  }

  async verifyVerificationRequiredPopupDisplayedWithAllElements(): Promise<this> {
    const data = VERIFICATION_REQUIRED_POPUP;

    await this.waitForDisplayed('verificationRequiredPopup', 20000);
    await this.expectDisplayed('verificationRequiredPopup');
    await this.expectDisplayed('verificationRequiredPopupTitle');
    await this.expectExactText('verificationRequiredPopupTitle', data.title);
    await this.expectDisplayed('popupCloseButton');
    await this.expectDisplayed('verificationRequiredPopupDescription');
    await this.expectExactText('verificationRequiredPopupDescription', data.description);

    await this.expectDisplayed('verificationRequiredPopupEnterMasterPasswordField');
    await this.expectDisplayed('verificationRequiredPopupEnterMasterPasswordFieldTitle');
    await this.expectExactText(
      'verificationRequiredPopupEnterMasterPasswordFieldTitle',
      data.password.title,
    );
    await this.expectDisplayed('verificationRequiredPopupEnterMasterPasswordFieldInput');
    await this.expectExactText(
      'verificationRequiredPopupEnterMasterPasswordFieldInput',
      data.password.placeholder,
    );
    await this.expectDisplayed('verificationRequiredPopupEnterMasterPasswordFieldShowPasswordButton');

    await this.expectDisplayed('verificationRequiredPopupTryWIthFingerprintLink');

    await this.expectDisplayed('verificationRequiredPopupContinueButton');
    await this.expectDisplayed('verificationRequiredPopupContinueButtonIcon');
    await this.expectDisplayed('verificationRequiredPopupContinueButtonText');
    await this.expectExactText(
      'verificationRequiredPopupContinueButtonText',
      data.continueButtonText,
    );

    return this.self;
  }

  async verifyContinueButtonDisabledByDefault(): Promise<this> {
    await this.expectDisplayed('verificationRequiredPopupContinueButton');
    await this.expectEnabled('verificationRequiredPopupContinueButton', false);
    return this.self;
  }

  async enterMasterPassword(password: string): Promise<this> {
    await this.type('verificationRequiredPopupEnterMasterPasswordFieldInput', password);
    return this.self;
  }

  async verifyContinueButtonEnabled(): Promise<this> {
    await this.expectDisplayed('verificationRequiredPopupContinueButton');
    await this.expectEnabled('verificationRequiredPopupContinueButton', true);
    return this.self;
  }

  async tapOnContinueButton(): Promise<this> {
    await this.tap('verificationRequiredPopupContinueButton');
    return this.self;
  }

  async verifySharePopupWithAllElementsDisplayed(): Promise<this> {
    await this.waitForDisplayed('sharePopupTitle', 20000);
    await this.expectDisplayed('sharePopupTitle');
    await this.expectExactText('sharePopupTitle', SHARE_POPUP.title);
    await this.expectDisplayed('sharePopupFileNameField');

    return this.self;
  }

  async tapOnImportSourceButton(source: ImportSourceKey): Promise<this> {
    await this.tap(`${source}Field`);
    return this.self;
  }

  async tapOnImportButton(): Promise<this> {
    await this.tap('importButton');
    return this.self;
  }

  async tapOnUploadFileButton(): Promise<this> {
    await this.tap('uploadFileButton');
    return this.self;
  }

  async verifyImportItemsPageWithAllElements(): Promise<this> {
    const data = IMPORT_ITEMS_PAGE;

    await this.waitForDisplayed('importItemsPageTitle', 20000);
    await this.expectExactText('importItemsPageTitle', data.title);

    await this.expectDisplayed('importItemsPageDescription');
    await this.expectExactText('importItemsPageDescription', data.description);

    await this.expectDisplayed('importItemsPageImportSourceField');

    await this.expectDisplayed('importItemsPageImportSourceFieldTitle');
    await this.expectExactText(
      'importItemsPageImportSourceFieldTitle',
      data.importSourceSectionTitle,
    );

    return this.self;
  }

  async verifyImportSourceButtonWithAllElements(
    source: ImportSourceKey,
  ): Promise<this> {
    const { title, format } = IMPORT_ITEMS_PAGE.sources[source];

    await this.expectDisplayed(`${source}Field`);

    await this.expectDisplayed(`${source}FieldTitle`);
    await this.expectExactText(`${source}FieldTitle`, title);

    await this.expectDisplayed(`${source}FieldIcon`);

    await this.expectDisplayed(`${source}FieldText`);
    await this.expectExactText(`${source}FieldText`, format);

    await this.expectDisplayed(`${source}FieldIcon2`);

    return this.self;
  }

  async verifyUnencryptedFileButtonWithAllElements(): Promise<this> {
    const { fileName } = IMPORT_ITEMS_PAGE.unencryptedFile;

    await this.expectDisplayed('encryptedFileImportedFIleField');

    await this.expectDisplayed('encryptedFileImportedFIleFieldText');
    await this.expectExactText('encryptedFileImportedFIleFieldText', fileName);

    await this.expectDisplayed('encryptedFileImportedFIleFieldIcon');
    await this.expectDisplayed('encryptedFileImportedFIleFieldIcon2');
    await this.expectDisplayed('encryptedFileImportedFIleFieldFileSizeText');
    await this.expectDisplayed('encryptedFileImportedFIleFieldDeleteButton');

    return this.self;
  }

  async verifyItemsImportPageWithAllElements(
    source: ImportSourceKey,
  ): Promise<this> {
    const { pageTitle, requiredFormats } = IMPORT_ITEMS_PAGE.sources[source];
    const common = IMPORT_ITEMS_PAGE.importFromSourcePage;
    const titleLocator = IMPORT_FROM_PAGE_TITLE_LOCATOR[source];
    const requiredFormatsLocator = `${source}UploadFileFieldText2`;

    await this.waitForDisplayed(titleLocator, 20000);
    await this.expectExactText(titleLocator, pageTitle);

    await this.expectDisplayed('importFormBackButton');

    await this.expectDisplayed('importFromOnePasswordPageDescription');
    await this.expectExactText(
      'importFromOnePasswordPageDescription',
      common.description,
    );

    await this.expectDisplayed('uploadFileField');
    await this.expectDisplayed('onePasswordUploadFileFieldIcon');
    await this.expectDisplayed('onePasswordUploadFileFieldIcon2');
    await this.expectDisplayed('onePasswordUploadFileFieldLink');

    await this.expectDisplayed('onePasswordUploadFileFieldText');
    await this.expectExactText(
      'onePasswordUploadFileFieldText',
      common.uploadFieldText,
    );

    await this.expectDisplayed(requiredFormatsLocator);
    await this.expectExactText(requiredFormatsLocator, requiredFormats);

    await this.expectDisplayed('uploadFileButton');
    await this.expectDisplayed('uploadFileButtonIcon');

    await this.expectDisplayed('uploadFileButtonText');
    await this.expectExactText(
      'uploadFileButtonText',
      common.uploadButtonText,
    );

    return this.self;
  }

  async tapMenuButton(): Promise<this> {
    await this.waitForDisplayed('systemPickerMenuButton', 10000);
    await this.tap('systemPickerMenuButton');
    return this.self;
  }

  async tapDownloadsButton(): Promise<this> {
    await this.waitForDisplayed('systemPickerDownloadsButton', 10000);
    await this.tap('systemPickerDownloadsButton');
    return this.self;
  }

  async verifyDownloadsFolderTitleDisplayed(): Promise<this> {
    await this.waitForDisplayed('systemPickerDownloadsFolderTitle', 10000);
    return this.self;
  }

  async chooseDownloadsFolder(): Promise<this> {
    await this.waitForDisplayed('downloadsFolderTitle', 10000);
    await this.tap('menuButton');
    await this.waitForDisplayed('openFromTitle', 10000);
    await this.tap('downloadsButton');
    return this.self;
  }

  async chooseImportFile(fileKey: SystemFileKey): Promise<this> {
    const maxAttempts = 5;
    const waitTimeout = 20000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.waitForDisplayed(fileKey, waitTimeout);
        await this.tap(fileKey);
        return this.self;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < maxAttempts - 1) {
          await this.swipe('up');
        }
      }
    }

    throw (
      lastError ??
      new Error(
        `File "${fileKey}" not found after ${maxAttempts} attempts (scrolling up).`,
      )
    );
  }

  async verifyImportedFileFieldDisplayed(
    fileKey: ImportedFileKey,
  ): Promise<this> {
    const prefix = IMPORTED_FILE_LOCATOR_PREFIX[fileKey];

    await this.expectDisplayed(`${prefix}ImportedFIleField`);
    await this.expectDisplayed(`${prefix}ImportedFIleFieldText`);
    await this.expectDisplayed(`${prefix}ImportedFIleFieldIcon`);
    await this.expectDisplayed(`${prefix}ImportedFIleFieldIcon2`);
    await this.expectDisplayed(`${prefix}ImportedFIleFieldFileSizeText`);
    await this.expectDisplayed(`${prefix}ImportedFIleFieldDeleteButton`);

    await this.expectDisplayed('importButton');
    await this.expectDisplayed('importButtonText');
    await this.expectExactText(
      'importButtonText',
      IMPORT_ITEMS_PAGE.importFromSourcePage.importButtonText,
    );

    return this.self;
  }

  async verifyVaultsImportedSuccessToastMessageDisplayed(): Promise<this> {
    await this.waitForDisplayed('vaultsImportedSuccessToastMessage', 20000);
    await this.expectDisplayed('vaultsImportedSuccessToastMessage');
    await this.expectDisplayed('vaultsImportedSuccessToastMessageText');
    await this.expectExactText(
      'vaultsImportedSuccessToastMessageText',
      IMPORT_ITEMS_PAGE.successToast.vaultsImported,
    );
    return this.self;
  }

  async tapOnCreateNewVaultButton(): Promise<this> {
    await this.tap('createNewVaultButton');
    return this.self;
  }

  async tapOnNewCreatedVaultFieldShareVaultButton(): Promise<this> {
    await this.tap('newCreatedVaultFieldIbrahimShareVaultButton');
    return this.self;
  }

  async tapOnNewCreatedVaultFieldThreeDotsButton(): Promise<this> {
    await this.tap('newCreatedVaultFieldIbrahimThreeDotsButton');
    return this.self;
  }

  async tapOnThreeDotsRenameButton(): Promise<this> {
    await this.tap('threeDotsRenameButton');
    return this.self;
  }

  async verifyRenameVaultPageWithAllElements(): Promise<this> {
    const data = RENAME_VAULT_PAGE;

    await this.waitForDisplayed('renameVaultPageTitle', 20000);
    await this.expectExactText('renameVaultPageTitle', data.title);

    await this.expectDisplayed('renameVaultPageField');

    await this.expectDisplayed('renameVaultPageFieldTitle');
    await this.expectExactText(
      'renameVaultPageFieldTitle',
      data.vaultNameField.title,
    );

    await this.expectDisplayed('renameVaultPageFieldInput');
    await this.expectExactText(
      'renameVaultPageFieldInput',
      data.vaultNameField.currentValue,
    );

    await this.expectDisplayed('renameVaultPageCurrentPasswordField');

    await this.expectDisplayed('renameVaultPageCurrentPasswordFieldTitle');
    await this.expectExactText(
      'renameVaultPageCurrentPasswordFieldTitle',
      data.currentPasswordField.title,
    );

    await this.expectDisplayed('renameVaultPageCurrentPasswordFieldInput');
    await this.expectExactText(
      'renameVaultPageCurrentPasswordFieldInput',
      data.currentPasswordField.placeholder,
    );

    await this.expectDisplayed(
      'renameVaultPageCurrentPasswordFieldShowPasswordButton',
    );

    await this.expectDisplayed('saveButton');
    await this.expectDisplayed('saveButtonText');
    await this.expectExactText('saveButtonText', data.saveButton);

    return this.self;
  }

  async verifyThreeDotsPopupWithAllElements(): Promise<this> {
    const data = VAULT_THREE_DOTS_POPUP;

    await this.waitForDisplayed('threeDotsPopUp', 20000);
    await this.expectDisplayed('threeDotsPopUp');

    await this.expectDisplayed('threeDotsRenameButton');
    await this.expectDisplayed('threeDotsRenameButtonIcon');

    await this.expectDisplayed('threeDotsRenameButtonText');
    await this.expectExactText('threeDotsRenameButtonText', data.rename);

    return this.self;
  }

  async tapOnShareVaultPageVaultLinkCopyIcon(): Promise<this> {
    await this.tap('yourVaultsShareVaultsPageVaultLinkCopyIcon');
    return this.self;
  }

  async verifyCodeExpireTextDisplayed(): Promise<this> {
    await this.waitForDisplayed('codeExpireText', 20000);
    await this.expectDisplayed('codeExpireText');
    await this.expectExactText(
      'codeExpireText',
      SHARE_VAULT_POPUP.codeExpiresLabel,
    );

    await this.expectDisplayed('codeExpireTime');

    return this.self;
  }

  async waitForTextToChange(timeout: number): Promise<this> {
    await this.waitForDisplayed('codeExpiredText', timeout);
    return this.self;
  }

  async verifyCodeExpiredTextDisplayed(): Promise<this> {
    await this.waitForDisplayed('codeExpiredText', 20000);
    await this.expectDisplayed('codeExpiredText');
    await this.expectExactText(
      'codeExpiredText',
      SHARE_VAULT_POPUP.codeExpiredLabel,
    );
    return this.self;
  }

  async verifyShareVaultPageVaultLinkCopiedToastMessageDisplayed(): Promise<this> {
    await this.waitForDisplayed('copiedToast', 20000);
    await this.expectDisplayed('copiedToast');
    await this.expectDisplayed('copiedToastText');
    await this.expectExactText('copiedToastText', COMMON_TOASTS.copied);
    return this.self;
  }

  async verifyShareVaultPageWithAllElements(): Promise<this> {
    const data = SHARE_VAULT_POPUP;

    await this.waitForDisplayed('shareVaultPageTitle', 20000);
    await this.expectExactText('shareVaultPageTitle', data.title);

    await this.expectDisplayed('yourVaultsShareVaultsPageDescription');
    await this.expectExactText(
      'yourVaultsShareVaultsPageDescription',
      data.accessCodeSectionTitle,
    );

    await this.expectDisplayed('yourVaultsShareVaultsPageQrCodePicture');

    await this.expectDisplayed('codeExpireText');
    await this.expectExactText('codeExpireText', data.codeExpiresLabel);

    await this.expectDisplayed('codeExpireTimeIcon');

    await this.expectDisplayed('yourVaultsShareVaultsPageVaultLinkField');

    await this.expectDisplayed('yourVaultsShareVaultsPageVaultLinkFieldTitle');
    await this.expectExactText(
      'yourVaultsShareVaultsPageVaultLinkFieldTitle',
      data.vaultLinkField.title,
    );

    await this.expectDisplayed('yourVaultsShareVaultsPageVaultLinkCopyIcon');

    return this.self;
  }

  async tapOnSetVaultPasswordToggle(): Promise<this> {
    await this.tap('toggleOffButton');
    return this.self;
  }

  async verifySetVaultPasswordToggleOn(): Promise<this> {
    await this.waitForDisplayed('toggleOnButton', 20000);
    await this.expectDisplayed('toggleOnButton');
    return this.self;
  }

  async verifySetVaultPasswordToggleOff(): Promise<this> {
    await this.waitForDisplayed('toggleOffButton', 20000);
    await this.expectDisplayed('toggleOffButton');
    return this.self;
  }

  async verifyCreateNewVaultButtonDisabled(): Promise<this> {
    await this.waitForDisplayed('createNewVaultButton', 20000);
    await this.expectEnabled('createNewVaultButton', false);
    return this.self;
  }

  async verifyCreateNewVaultButtonEnabled(): Promise<this> {
    await this.waitForDisplayed('createNewVaultButton', 20000);
    await this.expectEnabled('createNewVaultButton', true);
    return this.self;
  }

  async enterVaultName(name: string): Promise<this> {
    await this.type('vaultNameFieldInput', name);
    return this.self;
  }

  async enterVaultPassword(password: string): Promise<this> {
    await this.type('enterVaultPasswordFieldInput', password);
    return this.self;
  }

  async enterVaultPasswordConfirm(password: string): Promise<this> {
    await this.type('repeatVaultPasswordFieldInput', password);
    return this.self;
  }

  async enterCurrentPassword(password: string): Promise<this> {
    await this.type('renameVaultPageCurrentPasswordFieldInput', password);
    return this.self;
  }

  async tapOnSaveButton(): Promise<this> {
    await this.tap('saveButton');
    return this.self;
  }

  async verifyNewCreatedVaultFieldDisplayedInCurrentVaultSection(): Promise<this> {
    const data = NEW_CREATED_VAULT_FIELD;

    await this.waitForDisplayed('newCreatedVaultField', 20000);
    await this.expectDisplayed('newCreatedVaultField');

    await this.expectDisplayed('newCreatedVaultFieldTitle');
    await this.expectExactText('newCreatedVaultFieldTitle', data.title);

    await this.expectDisplayed('newCreatedVaultFieldIcon1');
    await this.expectDisplayed('newCreatedVaultFieldIcon2');

    await this.expectDisplayed('newCreatedVaultFieldVaultName');
    await this.expectExactText(
      'newCreatedVaultFieldVaultName',
      data.vaultName,
    );

    await this.expectDisplayed('newCreatedVaultFieldVaultText');
    await this.expectExactText(
      'newCreatedVaultFieldVaultText',
      data.vaultText,
    );

    await this.expectDisplayed('newCreatedVaultFieldShareVaultButton');
    await this.expectDisplayed('newCreatedVaultFieldThreeDotsButton');

    return this.self;
  }

  async verifyYourVaultsPageTitle(): Promise<this> {
    const data = YOUR_VAULTS_PAGE;

    await this.waitForDisplayed('yourVaultsPageTitle', 20000);
    await this.expectDisplayed('yourVaultsPageTitle');
    await this.expectExactText('yourVaultsPageTitle', data.title);

    await this.expectDisplayed('yourVaultsPageDescription');
    await this.expectExactText(
      'yourVaultsPageDescription',
      data.description,
    );

    return this.self;
  }

  async verifyRenamedVaultFieldDisplayedInCurrentVaultSection(): Promise<this> {
    const data = RENAMED_VAULT_FIELD;

    await this.waitForDisplayed('renamedVaultField', 20000);
    await this.expectDisplayed('renamedVaultField');

    await this.expectDisplayed('renamedVaultFieldTitle');
    await this.expectExactText('renamedVaultFieldTitle', data.title);

    await this.expectDisplayed('renamedVaultFieldIcon1');
    await this.expectDisplayed('renamedVaultFieldIcon2');

    await this.expectDisplayed('renamedVaultFieldVaultName');
    await this.expectExactText('renamedVaultFieldVaultName', data.vaultName);

    await this.expectDisplayed('renamedVaultFieldVaultText');
    await this.expectExactText('renamedVaultFieldVaultText', data.vaultText);

    await this.expectDisplayed('renamedVaultFieldShareVaultButton');
    await this.expectDisplayed('renamedVaultFieldThreeDotsButton');

    return this.self;
  }

  async verifyOldVaultFieldDisplayedInOtherVaultsSection(): Promise<this> {
    await this.waitForDisplayed('yourVaultsPageVaultsFieldTitleOtherVaults', 20000);
    await this.expectDisplayed('yourVaultsPageVaultsFieldTitleOtherVaults');
    await this.expectExactText(
      'yourVaultsPageVaultsFieldTitleOtherVaults',
      YOUR_VAULTS_PAGE.otherVaultsSectionTitle,
    );

    await this.expectDisplayed('yourVaultsPageVaultsFieldShareVaultButton', false);

    return this.self;
  }

  async verifyVaultCreatedSuccessToastMessageDisplayed(): Promise<this> {
    await this.waitForDisplayed('vaultCreatedSuccessToast', 20000);
    await this.expectDisplayed('vaultCreatedSuccessToast');
    await this.expectDisplayed('vaultCreatedSuccessToastText');
    await this.expectExactText(
      'vaultCreatedSuccessToastText',
      YOUR_VAULTS_TOASTS.vaultCreatedSuccess,
    );
    return this.self;
  }

  async verifyInvalidPasswordToastMessageDisplayed(): Promise<this> {
    await this.waitForDisplayed('invalidPasswordToastMessage', 20000);
    await this.expectDisplayed('invalidPasswordToastMessage');
    await this.expectDisplayed('invalidPasswordToastMessageText');
    await this.expectExactText(
      'invalidPasswordToastMessageText',
      YOUR_VAULTS_TOASTS.invalidVaultPassword,
    );
    return this.self;
  }

  async verifyVaultRenamedSuccessToastMessageDisplayed(): Promise<this> {
    await this.waitForDisplayed('successPasswordToastMessage', 20000);
    await this.expectDisplayed('successPasswordToastMessage');
    await this.expectDisplayed('successPasswordToastMessageText');
    await this.expectExactText(
      'successPasswordToastMessageText',
      YOUR_VAULTS_TOASTS.vaultRenamedSuccess,
    );
    return this.self;
  }

  async verifyCreateNewVaultPageWithAllElements(): Promise<this> {
    const data = CREATE_NEW_VAULT_PAGE;

    await this.waitForDisplayed('createNewVaultPageTitle', 20000);
    await this.expectExactText('createNewVaultPageTitle', data.title);

    await this.expectDisplayed('createNewVaultPageSubtitle');
    await this.expectExactText('createNewVaultPageSubtitle', data.subtitle);

    await this.expectDisplayed('createNewVaultPageDescription');
    await this.expectExactText(
      'createNewVaultPageDescription',
      data.description,
    );

    await this.expectDisplayed('vaultNameField');

    await this.expectDisplayed('vaultNameFieldTitle');
    await this.expectExactText(
      'vaultNameFieldTitle',
      data.vaultNameField.title,
    );

    await this.expectDisplayed('vaultNameFieldInput');
    await this.expectExactText(
      'vaultNameFieldInput',
      data.vaultNameField.placeholder,
    );

    await this.expectDisplayed('setVaultPasswordTitle');
    await this.expectExactText(
      'setVaultPasswordTitle',
      data.setVaultPassword.title,
    );

    await this.expectDisplayed('setVaultPasswordDescription');
    await this.expectExactText(
      'setVaultPasswordDescription',
      data.setVaultPassword.description,
    );

    await this.expectDisplayed('toggleOffButton');

    return this.self;
  }

  async verifyYourVaultsPageWithAllElements(): Promise<this> {
    const data = YOUR_VAULTS_PAGE;

    await this.waitForDisplayed('yourVaultsPageTitle', 20000);
    await this.expectExactText('yourVaultsPageTitle', data.title);

    await this.expectDisplayed('yourVaultsPageDescription');
    await this.expectExactText(
      'yourVaultsPageDescription',
      data.description,
    );

    await this.expectDisplayed('yourVaultsPageVaultsField');

    await this.expectDisplayed('yourVaultsPageVaultsFieldTitle');
    await this.expectExactText(
      'yourVaultsPageVaultsFieldTitle',
      data.currentVaultField.title,
    );

    await this.expectDisplayed('yourVaultsPageVaultsFieldIcon1');
    await this.expectDisplayed('yourVaultsPageVaultsFieldIcon2');

    await this.expectDisplayed('yourVaultsPageVaultsFieldVaultText');
    await this.expectExactText(
      'yourVaultsPageVaultsFieldVaultText',
      data.currentVaultField.vaultText,
    );

    await this.expectDisplayed('yourVaultsPageVaultsFieldShareVaultButton');
    await this.expectDisplayed('yourVaultsPageVaultsFieldThreeDotsButton');

    await this.expectDisplayed('createNewVaultButton');

    await this.expectDisplayed('createNewVaultButtonText');
    await this.expectExactText(
      'createNewVaultButtonText',
      data.createNewVaultButton,
    );

    await this.expectDisplayed('createNewVaultButtonIcon');

    return this.self;
  }

  async tapOnLanguageButton(): Promise<this> {
    await this.tap('language');
    return this.self;
  }

  async tapOnReportAProblemButton(): Promise<this> {
    await this.tap('reportAProblem');
    return this.self;
  }

  async tapOnAppVersionButton(): Promise<this> {
    await this.tap('appVersion');
    return this.self;
  }

  async tapOnTermsOfUseButton(): Promise<this> {
    await this.tap('termsOfUse');
    return this.self;
  }

  async verifyTermsOfUsePageDisplayed(): Promise<this> {
    await this.waitForDisplayed('termsOfUsePageTitle', 20000);
    await this.expectDisplayed('termsOfUsePageTitle');
    await this.expectExactText('termsOfUsePageTitle', TERMS_OF_USE_PAGE.title);
    return this.self;
  }

  async tapOnPrivacyStatementButton(): Promise<this> {
    await this.tap('privacyStatement');
    return this.self;
  }

  async verifyPrivacyStatementPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('privacyStatementPageTitle', 20000);
    await this.expectDisplayed('privacyStatementPageTitle');
    await this.expectExactText(
      'privacyStatementPageTitle',
      PRIVACY_STATEMENT_PAGE.title,
    );
    return this.self;
  }

  async tapOnVisitOurWebsiteButton(): Promise<this> {
    await this.tap('visitOurWebsite');
    return this.self;
  }

  async verifyVisitOurWebsitePageDisplayed(): Promise<this> {
    const data = VISIT_OUR_WEBSITE_PAGE;

    await this.waitForDisplayed('visitOurWebsitePageTitle', 20000);
    await this.expectDisplayed('visitOurWebsitePageTitle');
    await this.expectExactText('visitOurWebsitePageTitle', data.title);

    await this.expectDisplayed('visitOurWebsitePageTitle1');
    await this.expectExactText('visitOurWebsitePageTitle1', data.tagline);

    return this.self;
  }

  async verifyAppVersionPageWithAllElementsDisplayed(): Promise<this> {
    const data = APP_VERSION_PAGE;

    await this.waitForDisplayed('appVersionPageTitle', 20000);

    await this.expectDisplayed('backButton');

    await this.expectDisplayed('settingsTitle');
    await this.expectExactText('settingsTitle', SETTINGS_PAGE.title);

    await this.expectExactText('appVersionPageTitle', data.title);

    await this.expectDisplayed('appVersionPageDescription');
    await this.expectExactText('appVersionPageDescription', data.description);

    await this.expectDisplayed('appVersionPageVersionField');

    await this.expectDisplayed('appVersionPageVersionFieldText');
    await this.expectExactText(
      'appVersionPageVersionFieldText',
      data.versionField.text,
    );

    await this.expectDisplayed('appVersionPageVersionFieldVersion');
    await this.expectExactText(
      'appVersionPageVersionFieldVersion',
      data.versionField.version,
    );

    await this.expectDisplayed('termsOfUse');
    await this.expectDisplayed('privacyStatement');
    await this.expectDisplayed('visitOurWebsite');

    return this.self;
  }

  async verifyReportAProblemPageSendButtonDisabled(): Promise<this> {
    await this.waitForDisplayed('reportAProblemPageSendButton', 20000);
    await this.expectEnabled('reportAProblemPageSendButton', false);
    return this.self;
  }

  async verifyReportAProblemPageSendButtonEnabled(): Promise<this> {
    await this.waitForDisplayed('reportAProblemPageSendButton', 20000);
    await this.expectEnabled('reportAProblemPageSendButton', true);
    return this.self;
  }

  async enterIssue(text: string): Promise<this> {
    await this.type('reportAProblemPageIssueInputFieldInput', text);
    return this.self;
  }

  async tapOnReportAProblemPageSendButton(): Promise<this> {
    await this.tap('reportAProblemPageSendButton');
    return this.self;
  }

  async verifyReportAPorblemSuccessFeedbackToastMessageDisplayed(): Promise<this> {
    await this.waitForDisplayed('reportAPorblemSuccessFeedbackToastMessage', 20000);
    await this.expectDisplayed('reportAPorblemSuccessFeedbackToastMessage');
    await this.expectDisplayed('reportAPorblemSuccessFeedbackToastMessageText');
    await this.expectExactText(
      'reportAPorblemSuccessFeedbackToastMessageText',
      REPORT_A_PROBLEM_PAGE.successToast.feedbackSent,
    );
    return this.self;
  }

  async verifyReportAProblemPageWithAllElementsDisplayed(): Promise<this> {
    const data = REPORT_A_PROBLEM_PAGE;

    await this.waitForDisplayed('reportAProblemPageTitle', 20000);
    await this.expectExactText('reportAProblemPageTitle', data.title);

    await this.expectDisplayed('reportAProblemPageDescription');
    await this.expectExactText(
      'reportAProblemPageDescription',
      data.description,
    );

    await this.expectDisplayed('reportAProblemPageIssueInputField');

    await this.expectDisplayed('reportAProblemPageIssueInputFieldTitle');
    await this.expectExactText(
      'reportAProblemPageIssueInputFieldTitle',
      data.issueInputField.title,
    );

    await this.expectDisplayed('reportAProblemPageIssueInputFieldInput');
    await this.expectExactText(
      'reportAProblemPageIssueInputFieldInput',
      data.issueInputField.placeholder,
    );

    await this.expectDisplayed('reportAProblemPageSendButton');

    await this.expectDisplayed('reportAProblemPageSendButtonText');
    await this.expectExactText(
      'reportAProblemPageSendButtonText',
      data.sendButton,
    );

    await this.expectDisplayed('reportAProblemPageSendButtonIcon');

    return this.self;
  }

  async tapOnLanguageButtonOnLanguagePage(): Promise<this> {
    await this.tap('languagePageLanguageFieldLanguageButton');
    return this.self;
  }

  async tapOnLanguagePopupLanguageButton(): Promise<this> {
    await this.tap('languagePageLanguagePopupLanguageButton');
    return this.self;
  }

  async verifyLanguagePopupNotDisplayed(): Promise<this> {
    await this.expectDisplayed('languagePageLanguagePopup', false);
    return this.self;
  }

  async verifyLanguagePopupWithAllElements(): Promise<this> {
    const data = LANGUAGE_PAGE.popup;

    await this.waitForDisplayed('languagePageLanguagePopup', 20000);
    await this.expectDisplayed('languagePageLanguagePopup');

    await this.expectDisplayed('languagePageLanguagePopupTitle');
    await this.expectExactText('languagePageLanguagePopupTitle', data.title);

    await this.expectDisplayed('popupCloseButton');

    await this.expectDisplayed('languagePageLanguagePopupLanguageButton');

    await this.expectDisplayed('languagePageLanguagePopupLanguageButtonText');
    await this.expectExactText(
      'languagePageLanguagePopupLanguageButtonText',
      data.selectedLanguage,
    );

    return this.self;
  }

  async verifyLanguagePageWithAllElements(): Promise<this> {
    const data = LANGUAGE_PAGE;

    await this.waitForDisplayed('languagePageTitle', 20000);
    await this.expectExactText('languagePageTitle', data.title);

    await this.expectDisplayed('languagePageDescription');
    await this.expectExactText('languagePageDescription', data.description);

    await this.expectDisplayed('languagePageLanguageField');

    await this.expectDisplayed('languagePageLanguageFieldTitle');
    await this.expectExactText(
      'languagePageLanguageFieldTitle',
      data.languageField.title,
    );

    await this.expectDisplayed('languagePageLanguageFieldText');
    await this.expectExactText(
      'languagePageLanguageFieldText',
      data.languageField.text,
    );

    await this.expectDisplayed('languagePageLanguageFieldLanguageButton');

    await this.expectDisplayed('languagePageLanguageFieldLanguageButtonText');
    await this.expectExactText(
      'languagePageLanguageFieldLanguageButtonText',
      data.languageField.selectedLanguage,
    );

    await this.expectDisplayed('languagePageLanguageFieldLanguageButtonIcon');

    return this.self;
  }

  async verifyYourDevicesPageWithAllElements(): Promise<this> {
    const data = YOUR_DEVICES_PAGE;

    await this.waitForDisplayed('yourDevicesPageTitle', 20000);
    await this.expectExactText('yourDevicesPageTitle', data.title);

    await this.expectDisplayed('yourDevicesPageDescription');
    await this.expectExactText('yourDevicesPageDescription', data.description);

    await this.expectDisplayed('yourDevicesPageText');
    await this.expectExactText(
      'yourDevicesPageText',
      data.syncedPersonalDevicesSectionText,
    );

    await this.expectDisplayed('syncedPersonalDevicesField');

    await this.expectDisplayed('syncedPersonalDevicesFieldTitle');
    await this.expectExactText(
      'syncedPersonalDevicesFieldTitle',
      data.syncedPersonalDevicesField.title,
    );

    await this.expectDisplayed('syncedPersonalDevicesFieldData');

    await this.expectDisplayed('syncedPersonalDevicesFieldIcon1');
    await this.expectDisplayed('syncedPersonalDevicesFieldIcon2');

    return this.self;
  }

  async tapOnCurrentPasswordInputField(): Promise<this> {
    await this.tap('currentPasswordFieldInput');
    return this.self;
  }

  async enterOldPassword(password: string): Promise<this> {
    await this.type('currentPasswordFieldInput', password);
    return this.self;
  }

  async enterCreateNewPassword(password: string): Promise<this> {
    await this.type('newPasswordFieldInput', password);
    return this.self;
  }

  async enterRepeatNewPassword(password: string): Promise<this> {
    await this.type('repeatNewPasswordFieldInput', password);
    return this.self;
  }

  async tapOnChangePasswordButton(): Promise<this> {
    await this.tap('changePasswordButton');
    return this.self;
  }

  async verifyChangePasswordButtonDisabled(): Promise<this> {
    await this.waitForDisplayed('changePasswordButton', 20000);
    await this.expectEnabled('changePasswordButton', false);
    return this.self;
  }

  async verifyChangePasswordButtonEnabled(): Promise<this> {
    await this.waitForDisplayed('changePasswordButton', 20000);
    await this.expectEnabled('changePasswordButton', true);
    return this.self;
  }

  async verifyMasterPasswordChangedSuccessToastMessageDisplayed(): Promise<this> {
    await this.waitForDisplayed('masterPasswordChangedSuccessToastMessage', 20000);
    await this.expectDisplayed('masterPasswordChangedSuccessToastMessage');
    await this.expectDisplayed('masterPasswordChangedSuccessToastMessageText');
    await this.expectExactText(
      'masterPasswordChangedSuccessToastMessageText',
      MASTER_PASSWORD_PAGE.successToast.masterPasswordChanged,
    );
    return this.self;
  }

  async verifyPasswordWarningTextDisplayed(
    key: PasswordWarningKey,
  ): Promise<this> {
    const textLocator = `${key}WarningText`;
    const iconLocator = `${key}WarningTextIcon`;
    const expectedText = MASTER_PASSWORD_PAGE.passwordWarnings[key];

    await this.waitForDisplayed(textLocator, 20000);
    await this.expectExactText(textLocator, expectedText);
    await this.expectDisplayed(iconLocator);
    return this.self;
  }

  async verifyPasswordsIndicatorsDisplayed(
    field: PasswordFieldName,
    strength: PasswordStrength,
  ): Promise<this>;
  async verifyPasswordsIndicatorsDisplayed(
    field: 'repeatNewPasswordField',
    strength: PasswordMatchStatus,
  ): Promise<this>;
  async verifyPasswordsIndicatorsDisplayed(
    field: PasswordFieldName,
    strength: PasswordIndicatorStatus,
  ): Promise<this> {
    const barLocator = `${field}PasswordIndicator${strength}`;
    const iconLocator = `${field}PasswordIndicatorIcon${strength}`;

    await this.waitForDisplayed(barLocator, 20000);
    await this.expectDisplayed(barLocator);
    await this.expectDisplayed(iconLocator);
    return this.self;
  }

  async verifyAutofillHintDisplayed(): Promise<this> {
    await this.waitForDisplayed('autofillHint', 20000);
    await this.expectExactText('autofillHint', MASTER_PASSWORD_PAGE.autofillHint);
    return this.self;
  }

  async verifyMasterPasswordPageDisplayed(): Promise<this> {
    const data = MASTER_PASSWORD_PAGE;

    await this.waitForDisplayed('masterPasswordTitle', 20000);
    await this.expectDisplayed('masterPasswordTitle');
    await this.expectExactText('masterPasswordTitle', data.title);
    await this.expectDisplayed('masterPasswordDescription');
    await this.expectExactText('masterPasswordDescription', data.description);
    return this.self;
  }

  async verifyMasterPasswordPageWithAllElementsDisplayed(): Promise<this> {
    const data = MASTER_PASSWORD_PAGE;

    await this.waitForDisplayed('masterPasswordTitle', 20000);
    await this.expectExactText('masterPasswordTitle', data.title);
    await this.expectDisplayed('masterPasswordDescription');
    await this.expectExactText('masterPasswordDescription', data.description);

    await this.verifyPasswordFieldRow(
      'currentPasswordField',
      'currentPasswordFieldTitle',
      'currentPasswordFieldInput',
      'currentPasswordFieldShowPasswordButton',
      data.currentPassword.title,
    );
    await this.verifyPasswordFieldRow(
      'newPasswordField',
      'newPasswordFieldTitle',
      'newPasswordFieldInput',
      'newPasswordFieldShowPasswordButton',
      data.newPassword.title,
    );
    await this.verifyPasswordFieldRow(
      'repeatNewPasswordField',
      'repeatNewPasswordFieldTitle',
      'repeatNewPasswordFieldInput',
      'repeatNewPasswordFieldShowPasswordButton',
      data.repeatNewPassword.title,
    );

    await this.expectDisplayed('masterPasswordWarningTextField');
    await this.expectDisplayed('masterPasswordWarningTextFieldText');
    await this.expectExactText('masterPasswordWarningTextFieldText', data.warning);

    await this.expectDisplayed('changePasswordButton');
    await this.expectDisplayed('changePasswordButtonText');
    await this.expectExactText('changePasswordButtonText', data.changePasswordButton);

    return this.self;
  }

  async verifyAppPreferencesPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('appPreferencesScreenTitle', 20000);
    await this.expectExactText('appPreferencesScreenTitle', APP_PREFERENCES_PAGE.title);
    await this.expectDisplayed('appPreferencesScreenSubtitle');
    await this.expectExactText('appPreferencesScreenSubtitle', APP_PREFERENCES_PAGE.subtitle);
    return this.self;
  }

  async verifyBlindPeeringPageWithAllElementsDisplayed(): Promise<this> {
    const data = BLIND_PEERING_PAGE;

    await this.waitForDisplayed('blindPeeringPageTitle', 20000);
    await this.expectExactText('blindPeeringPageTitle', data.title);

    await this.expectDisplayed('blindPeeringPageDescription');
    await this.expectExactText('blindPeeringPageDescription', data.description);

    await this.expectDisplayed('blindPeeringPageEnableField');
    await this.expectDisplayed('blindPeeringPageEnableFieldTitle');
    await this.expectExactText(
      'blindPeeringPageEnableFieldTitle',
      data.enableField.title,
    );
    await this.expectDisplayed('blindPeeringPageEnableFieldText');
    await this.expectExactText(
      'blindPeeringPageEnableFieldText',
      data.enableField.description,
    );
    await this.expectDisplayed('blindPeeringPageEnableFieldToggleOff');

    return this.self;
  }

  async tapOnBlindPeeringPageEnableFieldToggleOff(): Promise<this> {
    await this.tap('blindPeeringPageEnableFieldToggleOff');
    return this.self;
  }

  async tapOnBlindPeeringPageEnableFieldToggleOn(): Promise<this> {
    await this.tap('blindPeeringPageEnableFieldToggleOn');
    return this.self;
  }

  async verifyBlindPeeringPageEnableFieldToggleOn(): Promise<this> {
    await this.waitForDisplayed('blindPeeringPageEnableFieldToggleOn', 20000);
    await this.expectDisplayed('blindPeeringPageEnableFieldToggleOn');
    return this.self;
  }

  async verifyBlindPeeringPageEnableFieldToggleOff(): Promise<this> {
    await this.waitForDisplayed('blindPeeringPageEnableFieldToggleOff', 20000);
    await this.expectDisplayed('blindPeeringPageEnableFieldToggleOff');
    return this.self;
  }

  async verifyAutomaticBlindPeersFieldDisplayed(): Promise<this> {
    const data = BLIND_PEERING_PAGE.automaticBlindPeers;

    await this.waitForDisplayed('automaticBlindPeersField', 20000);
    await this.expectDisplayed('automaticBlindPeersField');

    await this.expectDisplayed('automaticBlindPeersFieldTitle');
    await this.expectExactText('automaticBlindPeersFieldTitle', data.title);

    await this.expectDisplayed('automaticBlindPeersFieldText');
    await this.expectExactText('automaticBlindPeersFieldText', data.description);

    await this.expectDisplayed('automaticBlindPeersFieldCheckboxChecked');
    return this.self;
  }

  async verifyManualBlindPeersFieldDisplayed(): Promise<this> {
    const data = BLIND_PEERING_PAGE.manualBlindPeers;

    await this.waitForDisplayed('manualBlindPeersField', 20000);
    await this.expectDisplayed('manualBlindPeersField');

    await this.expectDisplayed('manualBlindPeersFieldTitle');
    await this.expectExactText('manualBlindPeersFieldTitle', data.title);

    await this.expectDisplayed('manualBlindPeersFieldText');
    await this.expectExactText('manualBlindPeersFieldText', data.description);

    await this.expectDisplayed('manualBlindPeersFieldCheckboxUnchecked');
    return this.self;
  }

  async verifyAutomaticBlindPeersFieldNotDisplayed(): Promise<this> {
    await this.expectDisplayed('automaticBlindPeersField', false);
    return this.self;
  }

  async verifyBlindPeerRadio(
    field: BlindPeerField,
    state: BlindPeerCheckState,
  ): Promise<this> {
    const locator = `${field}BlindPeersFieldCheckbox${state}`;

    await this.waitForDisplayed(locator, 20000);
    await this.expectDisplayed(locator);
    return this.self;
  }

  private resolveManualPeerCodeFieldSelectors(index: number): {
    container: string;
    title: string;
    input: string;
    removeButton: string;
  } {
    const names = {
      container: `manualBlindPeersPeerCodeField__${index}`,
      title: `manualBlindPeersPeerCodeFieldTitle__${index}`,
      input: `manualBlindPeersPeerCodeFieldInput__${index}`,
      removeButton: `manualBlindPeersPeerCodeFieldRemoveButton__${index}`,
    };
    const vars = { index };

    this.registerSelector(
      names.container,
      this.buildSelector(settingsLocators.manualBlindPeersPeerCodeFieldTpl, vars),
    );
    this.registerSelector(
      names.title,
      this.buildSelector(
        settingsLocators.manualBlindPeersPeerCodeFieldTitleTpl,
        vars,
      ),
    );
    this.registerSelector(
      names.input,
      this.buildSelector(
        settingsLocators.manualBlindPeersPeerCodeFieldInputTpl,
        vars,
      ),
    );
    this.registerSelector(
      names.removeButton,
      this.buildSelector(
        settingsLocators.manualBlindPeersPeerCodeFieldRemoveButtonTpl,
        vars,
      ),
    );

    return names;
  }

  async verifyManualBlindPeersEnterPeerCodeFieldDisplayed(
    index = 1,
  ): Promise<this> {
    const data = BLIND_PEERING_PAGE.manualBlindPeers.enterPeerCodeField;
    const names = this.resolveManualPeerCodeFieldSelectors(index);

    await this.waitForDisplayed(names.container, 20000);
    await this.expectDisplayed(names.container);

    await this.expectDisplayed(names.title);
    await this.expectExactText(names.title, data.title);

    await this.expectDisplayed(names.input);
    await this.expectExactText(names.input, data.placeholder);

    return this.self;
  }

  async tapOnManualBlindPeersRemovePeerButton(index = 1): Promise<this> {
    const { removeButton } = this.resolveManualPeerCodeFieldSelectors(index);
    await this.tap(removeButton);
    return this.self;
  }

  async verifyManualBlindPeersEnterPeerCodeFieldNotDisplayed(
    index = 1,
  ): Promise<this> {
    const { container } = this.resolveManualPeerCodeFieldSelectors(index);
    await this.expectDisplayed(container, false);
    return this.self;
  }

  async enterPeerCodeForBlindPeer(code: string, index = 1): Promise<this> {
    const { input } = this.resolveManualPeerCodeFieldSelectors(index);
    await this.type(input, code);
    return this.self;
  }

  async clearPeerCodeForBlindPeerField(index = 1): Promise<this> {
    const { input } = this.resolveManualPeerCodeFieldSelectors(index);
    const el = await this.getElement(input);
    await el.click();
    await el.clearValue();
    return this.self;
  }

  async verifyErrorToastMessageDisplayed(): Promise<this> {
    await this.waitForDisplayed('errorToast', 20000);
    await this.expectDisplayed('errorToast');
    await this.expectDisplayed('errorToastText');
    await this.expectExactText(
      'errorToastText',
      BLIND_PEERING_PAGE.errorAddingBlindPeersToast,
    );
    return this.self;
  }

  async verifySuccessToastMessageDisplayed(): Promise<this> {
    await this.waitForDisplayed('toastMessage', 20000);
    await this.expectDisplayed('toastMessage');
    await this.expectDisplayed('toastMessageText');
    await this.expectExactText(
      'toastMessageText',
      BLIND_PEERING_PAGE.manualBlindPeersEnabledSuccessfullyToast,
    );
    return this.self;
  }

  async verifyManualBlindPeersAddPeerButtonNotDisplayed(): Promise<this> {
    await this.expectDisplayed('manualBlindPeersAddPeerButton', false);
    return this.self;
  }

  async verifyManualBlindPeersAddPeerButtonDisplayed(): Promise<this> {
    const data = BLIND_PEERING_PAGE.manualBlindPeers;

    await this.waitForDisplayed('manualBlindPeersAddPeerButton', 20000);
    await this.expectDisplayed('manualBlindPeersAddPeerButton');

    await this.expectDisplayed('manualBlindPeersAddPeerButtonText');
    await this.expectExactText(
      'manualBlindPeersAddPeerButtonText',
      data.addPeerButton,
    );

    await this.expectDisplayed('manualBlindPeersAddPeerButtonIcon');

    return this.self;
  }

  async tapOnAutomaticBlindPeersField(): Promise<this> {
    await this.tap('automaticBlindPeersField');
    return this.self;
  }

  async tapOnManualBlindPeersField(): Promise<this> {
    await this.tap('manualBlindPeersField');
    return this.self;
  }

  async tapOnManualBlindPeersAddPeerButton(): Promise<this> {
    await this.tap('manualBlindPeersAddPeerButton');
    return this.self;
  }

  async tapOnSaveChangesButton(): Promise<this> {
    await this.tap('saveChangesButton');
    return this.self;
  }

  async verifySaveChangesButtonDisplayed(): Promise<this> {
    await this.waitForDisplayed('saveChangesButton', 20000);
    await this.expectDisplayed('saveChangesButton');
    await this.expectDisplayed('saveChangesButtonText');
    await this.expectExactText(
      'saveChangesButtonText',
      BLIND_PEERING_PAGE.saveChangesButton,
    );
    return this.self;
  }

  async verifyManualBlindPeersFieldNotDisplayed(): Promise<this> {
    await this.expectDisplayed('manualBlindPeersField', false);
    return this.self;
  }

  async verifyAutofillAndBrowsingSectionWithAllElements(): Promise<this> {
    const data = APP_PREFERENCES_PAGE.autofillAndBrowsingSection;

    await this.waitForDisplayed('autofillAndBrowsingSectionTitle', 20000);
    await this.expectExactText('autofillAndBrowsingSectionTitle', data.title);

    await this.expectDisplayed('autofillSettingTitle');
    await this.expectExactText('autofillSettingTitle', data.autofill.title);
    await this.expectDisplayed('autofillSettingDescription');
    await this.expectExactText('autofillSettingDescription', data.autofill.description);
    await this.expectDisplayedIfHasSelector('autofillToggleOn');

    await this.expectDisplayed('clearClipboardTitle');
    await this.expectExactText('clearClipboardTitle', data.clearClipboard.title);
    await this.expectDisplayed('clearClipboardDescription');
    await this.expectExactText('clearClipboardDescription', data.clearClipboard.description);
    await this.expectDisplayed('clearClipboardTimeoutField');
    await this.expectDisplayed('clearClipboardTimeoutText');
    await this.expectExactText('clearClipboardTimeoutText', data.clearClipboard.defaultTimeout);
    await this.expectDisplayed('clearClipboardTimeoutTextIcon');

    return this.self;
  }

  async verifyUnlockMethodSectionWithAllElements(): Promise<this> {
    const data = APP_PREFERENCES_PAGE.unlockMethodSection;

    await this.waitForDisplayed('unlockMethodSectionTitle', 20000);
    await this.expectExactText('unlockMethodSectionTitle', data.title);
    await this.expectDisplayed('unlockMethodInfoIcon');

    await this.expectDisplayed('unlockMethodMasterPasswordTitle');
    await this.expectExactText('unlockMethodMasterPasswordTitle', data.masterPassword.title);
    await this.expectDisplayed('unlockMethodMasterPasswordDescription');
    await this.expectExactText('unlockMethodMasterPasswordDescription', data.masterPassword.description);
    await this.expectDisplayedIfHasSelector('unlockMethodMasterPasswordCheckboxChecked');
    await this.expectDisplayedIfHasSelector('unlockMethodMasterPasswordCheckboxUnchecked');

    await this.expectDisplayed('biometricsUnlockTitle');
    await this.expectExactText('biometricsUnlockTitle', data.biometrics.title);
    await this.expectDisplayed('biometricsUnlockDescription');
    await this.expectExactText('biometricsUnlockDescription', data.biometrics.description);
    await this.expectDisplayedIfHasSelector('biometricsUnlockCheckboxChecked');

    return this.self;
  }

  async verifySecurityAwarenessSectionWithAllElements(): Promise<this> {
    const data = APP_PREFERENCES_PAGE.securityAwarenessSection;

    await this.swipe('up');
    await this.waitForDisplayed('securityAwarenessSectionTitle', 20000);
    await this.expectExactText('securityAwarenessSectionTitle', data.title);

    await this.expectDisplayed('autoLockTitle');
    await this.expectExactText('autoLockTitle', data.autoLock.title);
    await this.expectDisplayed('autoLockDescription');
    await this.expectExactText('autoLockDescription', data.autoLock.description);
    await this.expectDisplayed('autoLockTimeoutField');
    await this.expectDisplayed('autoLockTimeoutText');
    await this.expectExactText('autoLockTimeoutText', data.autoLock.defaultTimeout);
    await this.expectDisplayed('autoLockTimeoutTextIcon');

    await this.expectDisplayed('remindersTitle');
    await this.expectExactText('remindersTitle', data.reminders.title);
    await this.expectDisplayed('remindersDescription');
    await this.expectExactText('remindersDescription', data.reminders.description);
    await this.expectDisplayedIfHasSelector('remindersToggleOn');
    await this.swipe('down');
    return this.self;
  }

  async showHideSections(
    action: 'show' | 'hide',
    sectionKey:
      | 'securitySection'
      | 'syncingSection'
      | 'vaultSection'
      | 'appearanceSection'
      | 'aboutSection',
  ): Promise<this> {
    await this.tap(sectionKey);

    const shouldBeDisplayed = action === 'show';
    for (const childKey of SETTINGS_SECTION_CHILDREN[sectionKey]) {
      await this.expectDisplayed(childKey, shouldBeDisplayed);
    }

    return this.self;
  }

  async verifySettingsPageSecuritySubSectionsNotDisplayed(): Promise<this> {
    for (const childKey of SETTINGS_SECTION_CHILDREN.securitySection) {
      await this.expectDisplayed(childKey, false);
    }
    return this.self;
  }

  async verifySettingsPageSyncingSubSectionsNotDisplayed(): Promise<this> {
    for (const childKey of SETTINGS_SECTION_CHILDREN.syncingSection) {
      await this.expectDisplayed(childKey, false);
    }
    return this.self;
  }

  async verifySettingsPageVaultSubSectionsNotDisplayed(): Promise<this> {
    for (const childKey of SETTINGS_SECTION_CHILDREN.vaultSection) {
      await this.expectDisplayed(childKey, false);
    }
    return this.self;
  }

  async verifySettingsPageAppearanceSubSectionsNotDisplayed(): Promise<this> {
    for (const childKey of SETTINGS_SECTION_CHILDREN.appearanceSection) {
      await this.expectDisplayed(childKey, false);
    }
    return this.self;
  }

  async verifySettingsPageAboutSubSectionsNotDisplayed(): Promise<this> {
    for (const childKey of SETTINGS_SECTION_CHILDREN.aboutSection) {
      await this.expectDisplayed(childKey, false);
    }
    return this.self;
  }

  private async verifySectionRow(
    rowKey: string,
    textKey: string,
    iconKey: string,
    hideIconKey: string,
    expectedText: string,
  ): Promise<void> {
    await this.expectDisplayed(rowKey);
    await this.expectDisplayed(textKey);
    await this.expectExactText(textKey, expectedText);
    await this.expectDisplayedIfHasSelector(iconKey);
    await this.expectDisplayedIfHasSelector(hideIconKey);
  }

  private async verifyItemRow(
    rowKey: string,
    textKey: string,
    iconKey: string,
    expectedText: string,
  ): Promise<void> {
    await this.expectDisplayed(rowKey);
    await this.expectDisplayed(textKey);
    await this.expectExactText(textKey, expectedText);
    await this.expectDisplayedIfHasSelector(iconKey);
  }

  private async verifyPasswordFieldRow(
    fieldKey: string,
    titleKey: string,
    inputKey: string,
    showPasswordButtonKey: string,
    expectedTitle: string,
  ): Promise<void> {
    await this.expectDisplayed(fieldKey);
    await this.expectDisplayed(titleKey);
    await this.expectExactText(titleKey, expectedTitle);
    await this.expectDisplayed(inputKey);
    await this.expectDisplayed(showPasswordButtonKey);
  }

  private async expectDisplayedIfHasSelector(name: string): Promise<void> {
    const selector = (this.selectors as Record<string, string>)[name];
    if (!selector || selector.trim().length === 0) return;
    await this.expectDisplayed(name);
  }
}

export default SettingsPage;
