import BasePage from '@pages/BasePage';
import homeLocators from '@locators/HomeLocators/HomeLocators';
import { IMPORTED_ACCOUNTS, IMPORTED_ITEMS } from '@data/home.data';
import { $ } from '@wdio/globals';

// Use global expect from expect-webdriverio for text comparison
declare const expect: any;

export class HomePage extends BasePage {
  protected selectors = homeLocators;

  get currentFolderName() { return this.$('homeCurrentFolderName'); }
  get currentFolderIcon() { return this.$('homeCurrentFolderIcon'); }
  get homeLogoLock() { return this.$('homeLogoLock'); }
  get homeTestFolder() { return this.$('homeTestFolder'); }
  get homeTestFolderIcon() { return this.$('homeTestFolderIcon'); }
  get homeTestFolder1() { return this.$('homeTestFolder1'); }
  get homeTestFolder1Icon() { return this.$('homeTestFolder1Icon'); }
  get bottomNavHomeTab() { return this.$('bottomNavHomeTab'); }
  get bottomNavSettingsTab() { return this.$('bottomNavSettingsTab'); }
  get onePasswordAccount() { return this.$('onePasswordAccount'); }
  get onePasswordAccountIcon() { return this.$('onePasswordAccountIcon'); }
  get onePasswordAccountIconText() { return this.$('onePasswordAccountIconText'); }
  get onePasswordAccountText() { return this.$('onePasswordAccountText'); }
  get onePasswordPassword() { return this.$('onePasswordPassword'); }
  get onePasswordPasswordIcon() { return this.$('onePasswordPasswordIcon'); }
  get onePasswordPasswordIconText() { return this.$('onePasswordPasswordIconText'); }
  get onePasswordPasswordText() { return this.$('onePasswordPasswordText'); }
  get onePasswordLogin() { return this.$('onePasswordLogin'); }
  get onePasswordLoginIcon() { return this.$('onePasswordLoginIcon'); }
  get onePasswordLoginText() { return this.$('onePasswordLoginText'); }
  get bitwardenNote() { return this.$('bitwardenNote'); }
  get bitwardenNoteIcon() { return this.$('bitwardenNoteIcon'); }
  get bitwardenNoteIconText() { return this.$('bitwardenNoteIconText'); }
  get bitwardenNoteText() { return this.$('bitwardenNoteText'); }
  get bitwardenLogin() { return this.$('bitwardenLogin'); }
  get bitwardenLoginIcon() { return this.$('bitwardenLoginIcon'); }
  get bitwardenLoginIconText() { return this.$('bitwardenLoginIconText'); }
  get bitwardenLoginText() { return this.$('bitwardenLoginText'); }
  get bitwardenJsonSsh() { return this.$('bitwardenJsonSsh'); }
  get bitwardenJsonSshIcon() { return this.$('bitwardenJsonSshIcon'); }
  get bitwardenJsonSshIconText() { return this.$('bitwardenJsonSshIconText'); }
  get bitwardenJsonSshText() { return this.$('bitwardenJsonSshText'); }
  get bitwardenJsonNote() { return this.$('bitwardenJsonNote'); }
  get bitwardenJsonNoteIcon() { return this.$('bitwardenJsonNoteIcon'); }
  get bitwardenJsonNoteIconText() { return this.$('bitwardenJsonNoteIconText'); }
  get bitwardenJsonNoteText() { return this.$('bitwardenJsonNoteText'); }
  get bitwardenJsonLogin() { return this.$('bitwardenJsonLogin'); }
  get bitwardenJsonLoginIcon() { return this.$('bitwardenJsonLoginIcon'); }
  get bitwardenJsonLoginIconText() { return this.$('bitwardenJsonLoginIconText'); }
  get bitwardenJsonLoginText() { return this.$('bitwardenJsonLoginText'); }
  get bitwardenJsonCredit() { return this.$('bitwardenJsonCredit'); }
  get bitwardenJsonCreditIcon() { return this.$('bitwardenJsonCreditIcon'); }
  get bitwardenJsonCreditIconText() { return this.$('bitwardenJsonCreditIconText'); }
  get bitwardenJsonCreditText() { return this.$('bitwardenJsonCreditText'); }
  get bitwardenJsonIdentity() { return this.$('bitwardenJsonIdentity'); }
  get bitwardenJsonIdentityIcon() { return this.$('bitwardenJsonIdentityIcon'); }
  get bitwardenJsonIdentityIconText() { return this.$('bitwardenJsonIdentityIconText'); }
  get bitwardenJsonIdentityText() { return this.$('bitwardenJsonIdentityText'); }
  get lastPassCsvName() { return this.$('lastPassCsvName'); }
  get lastPassCsvNameIcon() { return this.$('lastPassCsvNameIcon'); }
  get lastPassCsvNameIconText() { return this.$('lastPassCsvNameIconText'); }
  get lastPassCsvNameText() { return this.$('lastPassCsvNameText'); }
  get lastPassCsvSecure() { return this.$('lastPassCsvSecure'); }
  get lastPassCsvSecureIcon() { return this.$('lastPassCsvSecureIcon'); }
  get lastPassCsvSecureIconText() { return this.$('lastPassCsvSecureIconText'); }
  get lastPassCsvSecureText() { return this.$('lastPassCsvSecureText'); }
  get lastPassCsvItem() { return this.$('lastPassCsvItem'); }
  get lastPassCsvItemIcon() { return this.$('lastPassCsvItemIcon'); }
  get lastPassCsvItemIconText() { return this.$('lastPassCsvItemIconText'); }
  get lastPassCsvItemText() { return this.$('lastPassCsvItemText'); }
  get nordPassCsvCredit() { return this.$('nordPassCsvCredit'); }
  get nordPassCsvCreditIcon() { return this.$('nordPassCsvCreditIcon'); }
  get nordPassCsvCreditIconText() { return this.$('nordPassCsvCreditIconText'); }
  get nordPassCsvCreditText() { return this.$('nordPassCsvCreditText'); }
  get nordPassCsvGmail() { return this.$('nordPassCsvGmail'); }
  get nordPassCsvGmailIcon() { return this.$('nordPassCsvGmailIcon'); }
  get nordPassCsvGmailIconText() { return this.$('nordPassCsvGmailIconText'); }
  get nordPassCsvGmailText() { return this.$('nordPassCsvGmailText'); }
  get protonPassCsvIdentity() { return this.$('protonPassCsvIdentity'); }
  get protonPassCsvIdentityIcon() { return this.$('protonPassCsvIdentityIcon'); }
  get protonPassCsvIdentityIconText() { return this.$('protonPassCsvIdentityIconText'); }
  get protonPassCsvIdentityText() { return this.$('protonPassCsvIdentityText'); }
  get protonPassCsvNote() { return this.$('protonPassCsvNote'); }
  get protonPassCsvNoteIcon() { return this.$('protonPassCsvNoteIcon'); }
  get protonPassCsvNoteIconText() { return this.$('protonPassCsvNoteIconText'); }
  get protonPassCsvNoteText() { return this.$('protonPassCsvNoteText'); }
  get protonPassCsvLogin() { return this.$('protonPassCsvLogin'); }
  get protonPassCsvLoginIcon() { return this.$('protonPassCsvLoginIcon'); }
  get protonPassCsvLoginIconText() { return this.$('protonPassCsvLoginIconText'); }
  get protonPassCsvLoginText() { return this.$('protonPassCsvLoginText'); }
  get protonPassJsonIdentity() { return this.$('protonPassJsonIdentity'); }
  get protonPassJsonIdentityIcon() { return this.$('protonPassJsonIdentityIcon'); }
  get protonPassJsonIdentityIconText() { return this.$('protonPassJsonIdentityIconText'); }
  get protonPassJsonIdentityText() { return this.$('protonPassJsonIdentityText'); }
  get protonPassJsonNote() { return this.$('protonPassJsonNote'); }
  get protonPassJsonNoteIcon() { return this.$('protonPassJsonNoteIcon'); }
  get protonPassJsonNoteIconText() { return this.$('protonPassJsonNoteIconText'); }
  get protonPassJsonNoteText() { return this.$('protonPassJsonNoteText'); }
  get protonPassJsonLogin() { return this.$('protonPassJsonLogin'); }
  get protonPassJsonLoginIcon() { return this.$('protonPassJsonLoginIcon'); }
  get protonPassJsonLoginIconText() { return this.$('protonPassJsonLoginIconText'); }
  get protonPassJsonLoginText() { return this.$('protonPassJsonLoginText'); }
  get unencryptedFileCsvHecht() { return this.$('unencryptedFileCsvHecht'); }
  get unencryptedFileCsvHechtIcon() { return this.$('unencryptedFileCsvHechtIcon'); }
  get unencryptedFileCsvHechtIconText() { return this.$('unencryptedFileCsvHechtIconText'); }
  get unencryptedFileCsvHechtText() { return this.$('unencryptedFileCsvHechtText'); }
  get unencryptedFileCsvInc() { return this.$('unencryptedFileCsvInc'); }
  get unencryptedFileCsvIncIcon() { return this.$('unencryptedFileCsvIncIcon'); }
  get unencryptedFileCsvIncIconText() { return this.$('unencryptedFileCsvIncIconText'); }
  get unencryptedFileCsvIncText() { return this.$('unencryptedFileCsvIncText'); }


  async verifyFavoriteFolder(): Promise<this> {
    await this.verifyDisplayedSoft('homeCurrentFolderName', 'Favorite folder name should be visible');
    
    const folderNameText = await this.currentFolderName.getText();
    expect(folderNameText).toBe('favorite');

    await this.verifyDisplayedSoft('homeCurrentFolderIcon', 'Favorite folder icon should be visible');

    return this.self;
  }

  async verifyTestFolder(): Promise<this> {
    await this.verifyDisplayedSoft('homeTestFolder', 'Test Folder name should be visible');
    
    const testFolderText = await this.homeTestFolder.getText();
    expect(testFolderText).toBe('Test Folder');

    await this.verifyDisplayedSoft('homeTestFolderIcon', 'Test Folder icon should be visible');

    return this.self;
  }

  async verifyTestFolder1(): Promise<this> {
    await this.verifyDisplayedSoft('homeTestFolder1', 'Test Folder1 name should be visible');
    
    const testFolder1Text = await this.homeTestFolder1.getText();
    expect(testFolder1Text).toBe('Test Folder1');

    await this.verifyDisplayedSoft('homeTestFolder1Icon', 'Test Folder1 icon should be visible');

    return this.self;
  }

  async tapHomeLogoLock(): Promise<this> {
    await this.homeLogoLock.click();
    return this.self;
  }

  async waitForHomePageLoaded(timeout: number = 10000): Promise<this> {
    await this.homeLogoLock.waitForDisplayed({ timeout, timeoutMsg: 'Home page logo lock not visible' });
    return this.self;
  }

  async verifyHomeLogoLockVisible(): Promise<this> {
    await this.homeLogoLock.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Home logo lock not visible after waiting' });
    await this.verifyDisplayedSoft('homeLogoLock', 'Home logo lock should be visible');
    return this.self;
  }

  async tapSystemHomeButton(): Promise<this> {
    await super.tapSystemHomeButton();
    return this.self;
  }

  async tapBottomNavHomeTab(): Promise<this> {
    await this.bottomNavHomeTab.click();
    return this.self;
  }

  async tapBottomNavSettingsTab(): Promise<this> {
    await this.bottomNavSettingsTab.click();
    return this.self;
  }

  async verifyOnePasswordAccountDisplayed(): Promise<this> {
    // Verify 1Password Account
    await this.verifyDisplayedSoft('onePasswordAccount', '1Password account should be visible');
    
    // Verify Account Icon
    await this.verifyDisplayedSoft('onePasswordAccountIcon', '1Password account icon should be visible');
    
    // Verify Account Icon Text
    await this.verifyDisplayedSoft('onePasswordAccountIconText', '1Password account icon text should be visible');
    const iconText = await this.onePasswordAccountIconText.getText();
    expect(iconText).toBe(IMPORTED_ACCOUNTS.onePassword.iconText);
    
    // Verify Account Text
    await this.verifyDisplayedSoft('onePasswordAccountText', '1Password account text should be visible');
    const accountText = await this.onePasswordAccountText.getText();
    expect(accountText).toBe(IMPORTED_ACCOUNTS.onePassword.accountText);
    
    return this.self;
  }

  async verifyOnePasswordPasswordDisplayed(): Promise<this> {
    // Verify 1Password Password
    await this.verifyDisplayedSoft('onePasswordPassword', '1Password password should be visible');
    
    // Verify Password Icon
    await this.verifyDisplayedSoft('onePasswordPasswordIcon', '1Password password icon should be visible');
    
    // Verify Password Icon Text
    await this.verifyDisplayedSoft('onePasswordPasswordIconText', '1Password password icon text should be visible');
    const iconText = await this.onePasswordPasswordIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.onePasswordPassword.iconText);
    
    // Verify Password Text
    await this.verifyDisplayedSoft('onePasswordPasswordText', '1Password password text should be visible');
    const passwordText = await this.onePasswordPasswordText.getText();
    expect(passwordText).toBe(IMPORTED_ITEMS.onePasswordPassword.passwordText);
    
    return this.self;
  }

  async verifyOnePasswordLoginDisplayed(): Promise<this> {
    // Verify 1Password Login
    await this.verifyDisplayedSoft('onePasswordLogin', '1Password login should be visible');
    
    // Verify Login Icon
    await this.verifyDisplayedSoft('onePasswordLoginIcon', '1Password login icon should be visible');
    
    // Verify Login Text
    await this.verifyDisplayedSoft('onePasswordLoginText', '1Password login text should be visible');
    const loginText = await this.onePasswordLoginText.getText();
    expect(loginText).toBe(IMPORTED_ITEMS.onePasswordLogin.loginText);
    
    return this.self;
  }

  async verifyBitwardenCsvNoteDisplayed(): Promise<this> {
    // Verify Bitwarden Note
    await this.verifyDisplayedSoft('bitwardenNote', 'Bitwarden note should be visible');
    
    // Verify Note Icon
    await this.verifyDisplayedSoft('bitwardenNoteIcon', 'Bitwarden note icon should be visible');
    
    // Verify Note Icon Text
    await this.verifyDisplayedSoft('bitwardenNoteIconText', 'Bitwarden note icon text should be visible');
    const iconText = await this.bitwardenNoteIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenNote.iconText);
    
    // Verify Note Text
    await this.verifyDisplayedSoft('bitwardenNoteText', 'Bitwarden note text should be visible');
    const noteText = await this.bitwardenNoteText.getText();
    expect(noteText).toBe(IMPORTED_ITEMS.bitwardenNote.noteText);
    
    return this.self;
  }

  async verifyBitwardenCsvLoginDisplayed(): Promise<this> {
    // Verify Bitwarden Login
    await this.verifyDisplayedSoft('bitwardenLogin', 'Bitwarden login should be visible');
    
    // Verify Login Icon
    await this.verifyDisplayedSoft('bitwardenLoginIcon', 'Bitwarden login icon should be visible');
    
    // Verify Login Icon Text
    await this.verifyDisplayedSoft('bitwardenLoginIconText', 'Bitwarden login icon text should be visible');
    const iconText = await this.bitwardenLoginIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenLogin.iconText);
    
    // Verify Login Text
    await this.verifyDisplayedSoft('bitwardenLoginText', 'Bitwarden login text should be visible');
    const loginText = await this.bitwardenLoginText.getText();
    expect(loginText).toBe(IMPORTED_ITEMS.bitwardenLogin.loginText);
    
    return this.self;
  }

  async verifyBitwardenJsonSshDisplayed(): Promise<this> {
    // Verify Bitwarden JSON SSH
    await this.verifyDisplayedSoft('bitwardenJsonSsh', 'Bitwarden JSON SSH should be visible');
    
    // Verify SSH Icon
    await this.verifyDisplayedSoft('bitwardenJsonSshIcon', 'Bitwarden JSON SSH icon should be visible');
    
    // Verify SSH Icon Text
    await this.verifyDisplayedSoft('bitwardenJsonSshIconText', 'Bitwarden JSON SSH icon text should be visible');
    const iconText = await this.bitwardenJsonSshIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenJsonSsh.iconText);
    
    // Verify SSH Text
    await this.verifyDisplayedSoft('bitwardenJsonSshText', 'Bitwarden JSON SSH text should be visible');
    const sshText = await this.bitwardenJsonSshText.getText();
    expect(sshText).toBe(IMPORTED_ITEMS.bitwardenJsonSsh.sshText);
    
    return this.self;
  }

  async verifyBitwardenJsonNoteDisplayed(): Promise<this> {
    // Verify Bitwarden JSON Note
    await this.verifyDisplayedSoft('bitwardenJsonNote', 'Bitwarden JSON note should be visible');
    
    // Verify Note Icon
    await this.verifyDisplayedSoft('bitwardenJsonNoteIcon', 'Bitwarden JSON note icon should be visible');
    
    // Verify Note Icon Text
    await this.verifyDisplayedSoft('bitwardenJsonNoteIconText', 'Bitwarden JSON note icon text should be visible');
    const iconText = await this.bitwardenJsonNoteIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenJsonNote.iconText);
    
    // Verify Note Text
    await this.verifyDisplayedSoft('bitwardenJsonNoteText', 'Bitwarden JSON note text should be visible');
    const noteText = await this.bitwardenJsonNoteText.getText();
    expect(noteText).toBe(IMPORTED_ITEMS.bitwardenJsonNote.noteText);
    
    return this.self;
  }

  async verifyBitwardenJsonLoginDisplayed(): Promise<this> {
    // Verify Bitwarden JSON Login
    await this.verifyDisplayedSoft('bitwardenJsonLogin', 'Bitwarden JSON login should be visible');
    
    // Verify Login Icon
    await this.verifyDisplayedSoft('bitwardenJsonLoginIcon', 'Bitwarden JSON login icon should be visible');
    
    // Verify Login Icon Text
    await this.verifyDisplayedSoft('bitwardenJsonLoginIconText', 'Bitwarden JSON login icon text should be visible');
    const iconText = await this.bitwardenJsonLoginIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenJsonLogin.iconText);
    
    // Verify Login Text
    await this.verifyDisplayedSoft('bitwardenJsonLoginText', 'Bitwarden JSON login text should be visible');
    const loginText = await this.bitwardenJsonLoginText.getText();
    expect(loginText).toBe(IMPORTED_ITEMS.bitwardenJsonLogin.loginText);
    
    return this.self;
  }

  async verifyBitwardenJsonCreditDisplayed(): Promise<this> {
    // Verify Bitwarden JSON Credit
    await this.verifyDisplayedSoft('bitwardenJsonCredit', 'Bitwarden JSON credit should be visible');
    
    // Verify Credit Icon
    await this.verifyDisplayedSoft('bitwardenJsonCreditIcon', 'Bitwarden JSON credit icon should be visible');
    
    // Verify Credit Icon Text
    await this.verifyDisplayedSoft('bitwardenJsonCreditIconText', 'Bitwarden JSON credit icon text should be visible');
    const iconText = await this.bitwardenJsonCreditIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenJsonCredit.iconText);
    
    // Verify Credit Text
    await this.verifyDisplayedSoft('bitwardenJsonCreditText', 'Bitwarden JSON credit text should be visible');
    const creditText = await this.bitwardenJsonCreditText.getText();
    expect(creditText).toBe(IMPORTED_ITEMS.bitwardenJsonCredit.creditText);
    
    return this.self;
  }

  async verifyBitwardenJsonIdentityDisplayed(): Promise<this> {
    // Verify Bitwarden JSON Identity
    await this.verifyDisplayedSoft('bitwardenJsonIdentity', 'Bitwarden JSON identity should be visible');
    
    // Verify Identity Icon
    await this.verifyDisplayedSoft('bitwardenJsonIdentityIcon', 'Bitwarden JSON identity icon should be visible');
    
    // Verify Identity Icon Text
    await this.verifyDisplayedSoft('bitwardenJsonIdentityIconText', 'Bitwarden JSON identity icon text should be visible');
    const iconText = await this.bitwardenJsonIdentityIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.bitwardenJsonIdentity.iconText);
    
    // Verify Identity Text
    await this.verifyDisplayedSoft('bitwardenJsonIdentityText', 'Bitwarden JSON identity text should be visible');
    const identityText = await this.bitwardenJsonIdentityText.getText();
    expect(identityText).toBe(IMPORTED_ITEMS.bitwardenJsonIdentity.identityText);
    
    return this.self;
  }

  async verifyLastPassCsvNameDisplayed(): Promise<this> {
    // Verify LastPass CSV Name
    await this.verifyDisplayedSoft('lastPassCsvName', 'LastPass CSV name should be visible');
    
    // Verify Name Icon
    await this.verifyDisplayedSoft('lastPassCsvNameIcon', 'LastPass CSV name icon should be visible');
    
    // Verify Name Icon Text
    await this.verifyDisplayedSoft('lastPassCsvNameIconText', 'LastPass CSV name icon text should be visible');
    const iconText = await this.lastPassCsvNameIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.lastPassCsvName.iconText);
    
    // Verify Name Text
    await this.verifyDisplayedSoft('lastPassCsvNameText', 'LastPass CSV name text should be visible');
    const nameText = await this.lastPassCsvNameText.getText();
    expect(nameText).toBe(IMPORTED_ITEMS.lastPassCsvName.nameText);
    
    return this.self;
  }

  async verifyLastPassCsvSecureDisplayed(): Promise<this> {
    // Verify LastPass CSV Secure
    await this.verifyDisplayedSoft('lastPassCsvSecure', 'LastPass CSV secure should be visible');
    
    // Verify Secure Icon
    await this.verifyDisplayedSoft('lastPassCsvSecureIcon', 'LastPass CSV secure icon should be visible');
    
    // Verify Secure Icon Text
    await this.verifyDisplayedSoft('lastPassCsvSecureIconText', 'LastPass CSV secure icon text should be visible');
    const iconText = await this.lastPassCsvSecureIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.lastPassCsvSecure.iconText);
    
    // Verify Secure Text
    await this.verifyDisplayedSoft('lastPassCsvSecureText', 'LastPass CSV secure text should be visible');
    const secureText = await this.lastPassCsvSecureText.getText();
    expect(secureText).toBe(IMPORTED_ITEMS.lastPassCsvSecure.secureText);
    
    return this.self;
  }

  async verifyLastPassCsvItemDisplayed(): Promise<this> {
    // Verify LastPass CSV Item
    await this.verifyDisplayedSoft('lastPassCsvItem', 'LastPass CSV item should be visible');
    
    // Verify Item Icon
    await this.verifyDisplayedSoft('lastPassCsvItemIcon', 'LastPass CSV item icon should be visible');
    
    // Verify Item Icon Text
    await this.verifyDisplayedSoft('lastPassCsvItemIconText', 'LastPass CSV item icon text should be visible');
    const iconText = await this.lastPassCsvItemIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.lastPassCsvItem.iconText);
    
    // Verify Item Text
    await this.verifyDisplayedSoft('lastPassCsvItemText', 'LastPass CSV item text should be visible');
    const itemText = await this.lastPassCsvItemText.getText();
    expect(itemText).toBe(IMPORTED_ITEMS.lastPassCsvItem.itemText);
    
    return this.self;
  }

  async verifyNordPassCsvCreditDisplayed(): Promise<this> {
    // Verify NordPass CSV Credit
    await this.verifyDisplayedSoft('nordPassCsvCredit', 'NordPass CSV credit should be visible');
    
    // Verify Credit Icon
    await this.verifyDisplayedSoft('nordPassCsvCreditIcon', 'NordPass CSV credit icon should be visible');
    
    // Verify Credit Icon Text
    await this.verifyDisplayedSoft('nordPassCsvCreditIconText', 'NordPass CSV credit icon text should be visible');
    const iconText = await this.nordPassCsvCreditIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.nordPassCsvCredit.iconText);
    
    // Verify Credit Text
    await this.verifyDisplayedSoft('nordPassCsvCreditText', 'NordPass CSV credit text should be visible');
    const creditText = await this.nordPassCsvCreditText.getText();
    expect(creditText).toBe(IMPORTED_ITEMS.nordPassCsvCredit.creditText);
    
    return this.self;
  }

  async verifyNordPassCsvGmailDisplayed(): Promise<this> {
    // Verify NordPass CSV Gmail
    await this.verifyDisplayedSoft('nordPassCsvGmail', 'NordPass CSV Gmail should be visible');
    
    // Verify Gmail Icon
    await this.verifyDisplayedSoft('nordPassCsvGmailIcon', 'NordPass CSV Gmail icon should be visible');
    
    // Verify Gmail Icon Text
    await this.verifyDisplayedSoft('nordPassCsvGmailIconText', 'NordPass CSV Gmail icon text should be visible');
    const iconText = await this.nordPassCsvGmailIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.nordPassCsvGmail.iconText);
    
    // Verify Gmail Text
    await this.verifyDisplayedSoft('nordPassCsvGmailText', 'NordPass CSV Gmail text should be visible');
    const gmailText = await this.nordPassCsvGmailText.getText();
    expect(gmailText).toBe(IMPORTED_ITEMS.nordPassCsvGmail.gmailText);
    
    return this.self;
  }

  async verifyProtonPassCsvNoteDisplayed(): Promise<this> {
    // Verify ProtonPass CSV Note
    await this.verifyDisplayedSoft('protonPassCsvNote', 'ProtonPass CSV note should be visible');
    
    // Verify Note Icon
    await this.verifyDisplayedSoft('protonPassCsvNoteIcon', 'ProtonPass CSV note icon should be visible');
    
    // Verify Note Icon Text
    await this.verifyDisplayedSoft('protonPassCsvNoteIconText', 'ProtonPass CSV note icon text should be visible');
    const iconText = await this.protonPassCsvNoteIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.protonPassCsvNote.iconText);
    
    // Verify Note Text
    await this.verifyDisplayedSoft('protonPassCsvNoteText', 'ProtonPass CSV note text should be visible');
    const noteText = await this.protonPassCsvNoteText.getText();
    expect(noteText).toBe(IMPORTED_ITEMS.protonPassCsvNote.noteText);
    
    return this.self;
  }

  async verifyProtonPassCsvIdentityDisplayed(): Promise<this> {
    // Verify ProtonPass CSV Identity
    await this.verifyDisplayedSoft('protonPassCsvIdentity', 'ProtonPass CSV identity should be visible');
    
    // Verify Identity Icon
    await this.verifyDisplayedSoft('protonPassCsvIdentityIcon', 'ProtonPass CSV identity icon should be visible');
    
    // Verify Identity Icon Text
    await this.verifyDisplayedSoft('protonPassCsvIdentityIconText', 'ProtonPass CSV identity icon text should be visible');
    const iconText = await this.protonPassCsvIdentityIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.protonPassCsvIdentity.iconText);
    
    // Verify Identity Text
    await this.verifyDisplayedSoft('protonPassCsvIdentityText', 'ProtonPass CSV identity text should be visible');
    const identityText = await this.protonPassCsvIdentityText.getText();
    expect(identityText).toBe(IMPORTED_ITEMS.protonPassCsvIdentity.identityText);
    
    return this.self;
  }

  async verifyProtonPassCsvLoginDisplayed(): Promise<this> {
    // Verify ProtonPass CSV Login
    await this.verifyDisplayedSoft('protonPassCsvLogin', 'ProtonPass CSV login should be visible');
    
    // Verify Login Icon
    await this.verifyDisplayedSoft('protonPassCsvLoginIcon', 'ProtonPass CSV login icon should be visible');
    
    // Verify Login Icon Text
    await this.verifyDisplayedSoft('protonPassCsvLoginIconText', 'ProtonPass CSV login icon text should be visible');
    const iconText = await this.protonPassCsvLoginIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.protonPassCsvLogin.iconText);
    
    // Verify Login Text
    await this.verifyDisplayedSoft('protonPassCsvLoginText', 'ProtonPass CSV login text should be visible');
    const loginText = await this.protonPassCsvLoginText.getText();
    expect(loginText).toBe(IMPORTED_ITEMS.protonPassCsvLogin.loginText);
    
    return this.self;
  }

  async verifyProtonPassJsonIdentityDisplayed(): Promise<this> {
    // Verify ProtonPass JSON Identity
    await this.verifyDisplayedSoft('protonPassJsonIdentity', 'ProtonPass JSON identity should be visible');
    
    // Verify Identity Icon
    await this.verifyDisplayedSoft('protonPassJsonIdentityIcon', 'ProtonPass JSON identity icon should be visible');
    
    // Verify Identity Icon Text
    await this.verifyDisplayedSoft('protonPassJsonIdentityIconText', 'ProtonPass JSON identity icon text should be visible');
    const iconText = await this.protonPassJsonIdentityIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.protonPassJsonIdentity.iconText);
    
    // Verify Identity Text
    await this.verifyDisplayedSoft('protonPassJsonIdentityText', 'ProtonPass JSON identity text should be visible');
    const identityText = await this.protonPassJsonIdentityText.getText();
    expect(identityText).toBe(IMPORTED_ITEMS.protonPassJsonIdentity.identityText);
    
    return this.self;
  }

  async verifyProtonPassJsonNoteDisplayed(): Promise<this> {
    // Verify ProtonPass JSON Note
    await this.verifyDisplayedSoft('protonPassJsonNote', 'ProtonPass JSON note should be visible');
    
    // Verify Note Icon
    await this.verifyDisplayedSoft('protonPassJsonNoteIcon', 'ProtonPass JSON note icon should be visible');
    
    // Verify Note Icon Text
    await this.verifyDisplayedSoft('protonPassJsonNoteIconText', 'ProtonPass JSON note icon text should be visible');
    const iconText = await this.protonPassJsonNoteIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.protonPassJsonNote.iconText);
    
    // Verify Note Text
    await this.verifyDisplayedSoft('protonPassJsonNoteText', 'ProtonPass JSON note text should be visible');
    const noteText = await this.protonPassJsonNoteText.getText();
    expect(noteText).toBe(IMPORTED_ITEMS.protonPassJsonNote.noteText);
    
    return this.self;
  }

  async verifyProtonPassJsonLoginDisplayed(): Promise<this> {
    // Verify ProtonPass JSON Login
    await this.verifyDisplayedSoft('protonPassJsonLogin', 'ProtonPass JSON login should be visible');
    
    // Verify Login Icon
    await this.verifyDisplayedSoft('protonPassJsonLoginIcon', 'ProtonPass JSON login icon should be visible');
    
    // Verify Login Icon Text
    await this.verifyDisplayedSoft('protonPassJsonLoginIconText', 'ProtonPass JSON login icon text should be visible');
    const iconText = await this.protonPassJsonLoginIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.protonPassJsonLogin.iconText);
    
    // Verify Login Text
    await this.verifyDisplayedSoft('protonPassJsonLoginText', 'ProtonPass JSON login text should be visible');
    const loginText = await this.protonPassJsonLoginText.getText();
    expect(loginText).toBe(IMPORTED_ITEMS.protonPassJsonLogin.loginText);
    
    return this.self;
  }

  async verifyUnencryptedFileCsvHechtDisplayed(): Promise<this> {
    // Verify Unencrypted File CSV Hecht
    await this.verifyDisplayedSoft('unencryptedFileCsvHecht', 'Unencrypted File CSV Hecht should be visible');
    
    // Verify Hecht Icon
    await this.verifyDisplayedSoft('unencryptedFileCsvHechtIcon', 'Unencrypted File CSV Hecht icon should be visible');
    
    // Verify Hecht Icon Text
    await this.verifyDisplayedSoft('unencryptedFileCsvHechtIconText', 'Unencrypted File CSV Hecht icon text should be visible');
    const iconText = await this.unencryptedFileCsvHechtIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.unencryptedFileCsvHecht.iconText);
    
    // Verify Hecht Text
    await this.verifyDisplayedSoft('unencryptedFileCsvHechtText', 'Unencrypted File CSV Hecht text should be visible');
    const hechtText = await this.unencryptedFileCsvHechtText.getText();
    expect(hechtText).toBe(IMPORTED_ITEMS.unencryptedFileCsvHecht.hechtText);
    
    return this.self;
  }

  async verifyUnencryptedFileCsvIncDisplayed(): Promise<this> {
    // Verify Unencrypted File CSV Inc
    await this.verifyDisplayedSoft('unencryptedFileCsvInc', 'Unencrypted File CSV Inc should be visible');
    
    // Verify Inc Icon
    await this.verifyDisplayedSoft('unencryptedFileCsvIncIcon', 'Unencrypted File CSV Inc icon should be visible');
    
    // Verify Inc Icon Text
    await this.verifyDisplayedSoft('unencryptedFileCsvIncIconText', 'Unencrypted File CSV Inc icon text should be visible');
    const iconText = await this.unencryptedFileCsvIncIconText.getText();
    expect(iconText).toBe(IMPORTED_ITEMS.unencryptedFileCsvInc.iconText);
    
    // Verify Inc Text
    await this.verifyDisplayedSoft('unencryptedFileCsvIncText', 'Unencrypted File CSV Inc text should be visible');
    const incText = await this.unencryptedFileCsvIncText.getText();
    expect(incText).toBe(IMPORTED_ITEMS.unencryptedFileCsvInc.incText);
    
    return this.self;
  }
}

export default HomePage;
