import { type Locator, type Page, expect } from '@playwright/test';
import { Header } from '../components/Header';

export class HomePage {
  readonly page: Page;
  readonly header: Header;
  readonly mainContainer: Locator;
  readonly mainHeading: Locator;
  readonly subtitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.mainContainer = page.getByRole('main');
    this.mainHeading = page.getByRole('heading', { level: 1 });
    this.subtitle = page.getByText('Welcome to ArmorNode.');
  }

  /**
   * Navigate to the home page and wait until main content is ready
   */
  async goto() {
    await this.page.goto('/');
    await expect(this.mainHeading).toBeVisible();
  }
}
