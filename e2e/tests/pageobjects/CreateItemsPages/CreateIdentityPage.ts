import BasePage from '@pages/BasePage';
import createIdentityLocators from '@locators/CreateItems/CreateIdentityLocators';
import { CREATE_IDENTITY_PAGE } from '@data/create-items-data/createIdentity.data';


export class CreateIdentityPage extends BasePage {
  protected selectors = createIdentityLocators;

  async verifyCreateNewIdentityItemPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('newIdentityTitle', 20000);
    await this.expectDisplayed('newIdentityTitle');
    await this.expectExactText('newIdentityTitle', CREATE_IDENTITY_PAGE.title);
    return this.self;
  }
}

export default CreateIdentityPage;
