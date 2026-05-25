import BasePage from '@pages/BasePage';
import createdIdentityItemLocators from '@locators/CreatedItems/CreatedIdentityItemLocators';


declare const expect: any;

export class CreatedIdentityItemPage extends BasePage {
  protected selectors = createdIdentityItemLocators;


}

export default CreatedIdentityItemPage;