import BasePage from '@pages/BasePage';
import createWifiLocators from '@locators/CreateItems/CreateWiFiLocators';
import { CREATE_WIFI_PAGE } from '@data/create-items-data/createWiFi.data';


export class CreateWifiPage extends BasePage {
  protected selectors = createWifiLocators;

  async verifyCreateNewWiFiItemPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('newWiFiTitle', 20000);
    await this.expectDisplayed('newWiFiTitle');
    await this.expectExactText('newWiFiTitle', CREATE_WIFI_PAGE.title);
    return this.self;
  }
}

export default CreateWifiPage;
