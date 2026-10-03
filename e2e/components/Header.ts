import { type Locator, type Page, expect } from '@playwright/test';

export class Header {
  readonly page: Page;
  readonly root: Locator;
  readonly brandLogo: Locator;
  readonly themeToggleBtn: Locator;
  readonly themeMenu: Locator;
  readonly lightOption: Locator;
  readonly darkOption: Locator;
  readonly systemOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator('header');
    this.brandLogo = this.root.locator('span', { hasText: 'ARMOR' });
    this.themeToggleBtn = page.getByRole('button', { name: 'Theme options menu' });
    this.themeMenu = page.getByRole('menu');
    this.lightOption = page.getByRole('menuitemradio', { name: 'Light' });
    this.darkOption = page.getByRole('menuitemradio', { name: 'Dark' });
    this.systemOption = page.getByRole('menuitemradio', { name: 'System' });
  }

  /**
   * Opens the theme dropdown if currently closed
   */
  async openThemeMenu() {
    const isExpanded = (await this.themeToggleBtn.getAttribute('aria-expanded')) === 'true';
    if (!isExpanded) {
      await this.themeToggleBtn.click();
      await expect(this.themeMenu).toBeVisible();
    }
  }

  /**
   * Closes the theme dropdown if currently open
   */
  async closeThemeMenu() {
    const isExpanded = (await this.themeToggleBtn.getAttribute('aria-expanded')) === 'true';
    if (isExpanded) {
      await this.themeToggleBtn.click();
      await expect(this.themeMenu).toBeHidden();
    }
  }

  /**
   * Selects a given theme mode ('light', 'dark', or 'system')
   */
  async selectTheme(theme: 'light' | 'dark' | 'system') {
    await this.openThemeMenu();
    const targetOption =
      theme === 'light'
        ? this.lightOption
        : theme === 'dark'
        ? this.darkOption
        : this.systemOption;

    await targetOption.click();
    await expect(this.themeMenu).toBeHidden();
  }

  /**
   * Retrieves the stored theme value from localStorage
   */
  async getStoredTheme(): Promise<string | null> {
    return this.page.evaluate(() => localStorage.getItem('armor_theme'));
  }
}
