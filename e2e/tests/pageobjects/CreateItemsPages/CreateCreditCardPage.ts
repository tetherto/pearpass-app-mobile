import BasePage from '@pages/BasePage';
import createCreditCardLocators from '@locators/CreateItems/CreateCreditCardLocators';
import { CREATE_CREDIT_CARD_PAGE } from '@data/create-items-data/createCreditCard.data';

export class CreateCreditCardPage extends BasePage {
  protected selectors = createCreditCardLocators;

  async verifyCreateNewCreditCardsItemPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('newCreditCardTitle', 20000);
    await this.expectDisplayed('newCreditCardTitle');
    await this.expectExactText('newCreditCardTitle', CREATE_CREDIT_CARD_PAGE.title);
    return this.self;
  }
}

export default CreateCreditCardPage;
