import BasePage from '@pages/BasePage';
import createPasswordLocators from '@locators/CreateItems/CreatePasswordLocators';
import { CREATE_PASSWORD_PAGE } from '@data/create-items-data/createPassword.data';


export class CreatePasswordPage extends BasePage {
  protected selectors = createPasswordLocators;

  async verifyCreateNewPasswordItemPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('newPasswordTitle', 20000);
    await this.expectDisplayed('newPasswordTitle');
    await this.expectExactText('newPasswordTitle', CREATE_PASSWORD_PAGE.title);
    return this.self;
  }
}

export default CreatePasswordPage;
