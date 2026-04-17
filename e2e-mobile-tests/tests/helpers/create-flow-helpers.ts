/**
 * Shared steps for create-item flows (HomeTests and similar) to reduce duplication.
 */

/** System file picker: open overflow menu → Downloads → wait for folder title. */
export async function systemPickerNavigateToDownloads(
  settings: {
    tapMenuButton: () => Promise<unknown>;
    verifyDownloadsFolderTitleDisplayed: () => Promise<unknown>;
  },
  tapDownloads: () => Promise<unknown>,
): Promise<void> {
  await settings.tapMenuButton();
  await tapDownloads();
  await settings.verifyDownloadsFolderTitleDisplayed();
}

/** On create screen: Add file → verify popup → Choose file (opens system picker). */
export async function openAddFilePopupAndTapChooseFile(
  createLogin: {
    verifyAddFilePopupVisible: (timeout?: number) => Promise<unknown>;
    verifyAllElementsInAddFilePopupVisible: () => Promise<unknown>;
    tapChooseFileButton: () => Promise<unknown>;
  },
  tapAddFileOnCurrentPage: () => Promise<unknown>,
): Promise<void> {
  await tapAddFileOnCurrentPage();
  await createLogin.verifyAddFilePopupVisible();
  await createLogin.verifyAllElementsInAddFilePopupVisible();
  await createLogin.tapChooseFileButton();
}

/** Same as systemPickerNavigateToDownloads when Downloads is triggered from Settings locator. */
export async function systemPickerNavigateToDownloadsViaSettings(settings: {
  tapMenuButton: () => Promise<unknown>;
  tapDownloadsButton: () => Promise<unknown>;
  verifyDownloadsFolderTitleDisplayed: () => Promise<unknown>;
}): Promise<void> {
  await systemPickerNavigateToDownloads(settings, () => settings.tapDownloadsButton());
}

/** No folder → Create new folder in sidebar → folder title on form. */
export async function createFolderThroughNoFolderDropdown(
  createLogin: {
    tapNoFolderButton: () => Promise<unknown>;
    verifyNoFolderButtonPopupVisible: (timeout?: number) => Promise<unknown>;
    verifyAllElementsInPopupVisible: () => Promise<unknown>;
    tapCreateNewButton: () => Promise<unknown>;
  },
  sidebar: {
    verifyCreateNewFolderPageFull: () => Promise<unknown>;
    enterFolderTitle: (title: string) => Promise<unknown>;
    tapCreateNewFolderPageButton: () => Promise<unknown>;
  },
  folderTitle: string,
): Promise<void> {
  await createLogin.tapNoFolderButton();
  await createLogin.verifyNoFolderButtonPopupVisible();
  await createLogin.verifyAllElementsInPopupVisible();
  await createLogin.tapCreateNewButton();
  await sidebar.verifyCreateNewFolderPageFull();
  await sidebar.enterFolderTitle(folderTitle);
  await sidebar.tapCreateNewFolderPageButton();
}

export type FolderFormChip = 'test' | 'testing';

/** After createFolderThroughNoFolderDropdown — chip shows Test Folder or Testing Folder. */
export async function assertFolderChipVisibleOnCreateForm(
  createLogin: {
    verifyTestFolderButtonVisible: () => Promise<unknown>;
    verifyTestingFolderButtonVisible: () => Promise<unknown>;
  },
  chip: FolderFormChip,
): Promise<void> {
  if (chip === 'test') {
    await createLogin.verifyTestFolderButtonVisible();
  } else {
    await createLogin.verifyTestingFolderButtonVisible();
  }
}

/** Open folder dropdown, confirm Test Folder is selected, close popup (Wi‑Fi / Notes / … pattern). */
export async function assertTestFolderSelectedInFolderPopup(
  createLogin: {
    verifyTestFolderButtonVisible: () => Promise<unknown>;
    tapTestFolderButton: () => Promise<unknown>;
    verifyTestFolderPopupVisible: (timeout?: number) => Promise<unknown>;
    verifyAllElementsInTestFolderPopupVisible: () => Promise<unknown>;
    verifyTestFolderSelected: () => Promise<unknown>;
  },
): Promise<void> {
  await createLogin.verifyTestFolderButtonVisible();
  await createLogin.tapTestFolderButton();
  await createLogin.verifyTestFolderPopupVisible();
  await createLogin.verifyAllElementsInTestFolderPopupVisible();
  await createLogin.verifyTestFolderSelected();
  await createLogin.tapTestFolderButton();
}

export async function closeCreateFormToHome(
  createLogin: { tapCloseButton: () => Promise<unknown> },
  home: { waitForHomePageLoaded: (timeout?: number) => Promise<unknown> },
): Promise<void> {
  await createLogin.tapCloseButton();
  await home.waitForHomePageLoaded();
}
