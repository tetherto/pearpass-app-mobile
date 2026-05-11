import BasePage from '@pages/BasePage';
import createOtherLocators from '@locators/CreateItems/CreateOtherLocators';
import { CREATE_OTHER_PAGE } from '@data/create-items-data/createOther.data';


export class CreateOtherPage extends BasePage {
  protected selectors = createOtherLocators;

  async verifyCreateNewOtherItemPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('newOtherTitle', 20000);
    await this.expectDisplayed('newOtherTitle');
    await this.expectExactText('newOtherTitle', CREATE_OTHER_PAGE.title);
    return this.self;
  }
}

export default CreateOtherPage;
