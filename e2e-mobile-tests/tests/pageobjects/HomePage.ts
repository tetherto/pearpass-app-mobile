import BasePage from '@pages/BasePage';
import homeLocators from '@locators/HomeLocators';
import {} from '@data/home.data';

export class HomePage extends BasePage {
  protected selectors = homeLocators;

  get currentFolderName() { return this.$('homeCurrentFolderName'); }
  get currentFolderIcon() { return this.$('homeCurrentFolderIcon'); }
  get homeLogoLock() { return this.$('homeLogoLock'); }
  get homeTestFolder() { return this.$('homeTestFolder'); }
  get homeTestFolderIcon() { return this.$('homeTestFolderIcon'); }
  get homeTestFolder1() { return this.$('homeTestFolder1'); }
  get homeTestFolder1Icon() { return this.$('homeTestFolder1Icon'); }


  async verifyFavoriteFolder(): Promise<this> {
    await expect.soft(this.currentFolderName)
      .toBeDisplayed({ message: 'Favorite folder name should be visible' });
    
    await expect.soft(this.currentFolderName)
      .toHaveText('favorite', { message: 'Current folder should be "favorite"' });

    await expect.soft(this.currentFolderIcon)
      .toBeDisplayed({ message: 'Favorite folder icon should be visible' });

    return this.self;
  }

  async verifyTestFolder(): Promise<this> {
    await expect.soft(this.homeTestFolder)
      .toBeDisplayed({ message: 'Test Folder name should be visible' });
    
    await expect.soft(this.homeTestFolder)
      .toHaveText('Test Folder', { message: 'Current folder should be "Test Folder"' });

    await expect.soft(this.homeTestFolderIcon)
      .toBeDisplayed({ message: 'Test Folder icon should be visible' });

    return this.self;
  }

  async verifyTestFolder1(): Promise<this> {
    await expect.soft(this.homeTestFolder1)
      .toBeDisplayed({ message: 'Test Folder1 name should be visible' });
    
    await expect.soft(this.homeTestFolder1)
      .toHaveText('Test Folder1', { message: 'Current folder should be "Test Folder1"' });

    await expect.soft(this.homeTestFolder1Icon)
      .toBeDisplayed({ message: 'Test Folder1 icon should be visible' });

    return this.self;
  }

  async tapHomeLogoLock(): Promise<this> {
    await this.homeLogoLock.click();
    return this.self;
  }

  async waitForHomePageLoaded(): Promise<this> {
    await this.homeLogoLock.waitForDisplayed({ timeoutMsg: 'Home page logo lock not visible' });
    return this.self;
  }

  async verifyHomeLogoLockVisible(): Promise<this> {
    await expect.soft(this.homeLogoLock)
      .toBeDisplayed({ message: 'Home logo lock should be visible' });
    return this.self;
  }
}

export default HomePage;
