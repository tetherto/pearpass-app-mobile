import BasePage from '@pages/BasePage';
import saveRecoveryPhraseLocators from '@locators/CreateItems/SaveRecoveryPhraseLocators';
import { SAVE_RECOVERY_PHRASE_PAGE } from '@data/create-items-data/saveRecoveryPhrase.data';

export class SaveRecoveryPhrasePage extends BasePage {
  protected selectors = saveRecoveryPhraseLocators;

  async verifyCreateNewRecoveryPhraseItemPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('newRecoveryPhraseTitle', 20000);
    await this.expectDisplayed('newRecoveryPhraseTitle');
    await this.expectExactText('newRecoveryPhraseTitle', SAVE_RECOVERY_PHRASE_PAGE.title);
    return this.self;
  }
}

export default SaveRecoveryPhrasePage;
