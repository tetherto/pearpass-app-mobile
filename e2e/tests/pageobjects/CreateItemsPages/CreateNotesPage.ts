import BasePage from '@pages/BasePage';
import createNotesLocators from '@locators/CreateItems/CreateNotesLocators';
import { CREATE_NOTES_PAGE } from '@data/create-items-data/createNotes.data';


export class CreateNotesPage extends BasePage {
  protected selectors = createNotesLocators;

  async verifyCreateNewNotesItemPageDisplayed(): Promise<this> {
    await this.waitForDisplayed('newNotesTitle', 20000);
    await this.expectDisplayed('newNotesTitle');
    await this.expectExactText('newNotesTitle', CREATE_NOTES_PAGE.title);
    return this.self;
  }
}

export default CreateNotesPage;
