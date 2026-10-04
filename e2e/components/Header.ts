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

  readonly languageToggleBtn: Locator;
  readonly langEnOption: Locator;
  readonly langRuOption: Locator;
  readonly langUaOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator('header');
    this.brandLogo = this.root.locator('span', { hasText: 'ARMOR' });
    this.themeToggleBtn = page.getByRole('button', { name: 'Theme options menu' });
    this.themeMenu = page.getByRole('menu');
    this.lightOption = page.getByRole('menuitemradio', { name: 'Light' });
    this.darkOption = page.getByRole('menuitemradio', { name: 'Dark' });
    this.systemOption = page.getByRole('menuitemradio', { name: 'System' });

    this.languageToggleBtn = page.getByRole('button', { name: 'Language options menu' });
    this.langEnOption = page.getByRole('menuitemradio', { name: /English/i });
    this.langRuOption = page.getByRole('menuitemradio', { name: /Русский/i });
    this.langUaOption = page.getByRole('menuitemradio', { name: /Українська/i });
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
   * Retrieves the stored theme value from localStorage or cookie
   */
  async getStoredTheme(): Promise<string | null> {
    return this.page.evaluate(() => localStorage.getItem('armor_theme'));
  }

  /**
   * Retrieves the theme cookie value from the browser context
   */
  async getThemeCookie(): Promise<string | undefined> {
    const cookies = await this.page.context().cookies();
    return cookies.find((c) => c.name === 'armor_theme')?.value;
  }

  /**
   * Opens the language dropdown if currently closed
   */
  async openLanguageMenu() {
    const isExpanded = (await this.languageToggleBtn.getAttribute('aria-expanded')) === 'true';
    if (!isExpanded) {
      await this.languageToggleBtn.click();
      await expect(this.themeMenu).toBeVisible();
    }
  }

  /**
   * Closes the language dropdown if currently open
   */
  async closeLanguageMenu() {
    const isExpanded = (await this.languageToggleBtn.getAttribute('aria-expanded')) === 'true';
    if (isExpanded) {
      await this.languageToggleBtn.click();
      await expect(this.themeMenu).toBeHidden();
    }
  }

  /**
   * Selects a given language ('en', 'ru', or 'ua')
   */
  async selectLanguage(lang: 'en' | 'ru' | 'ua') {
    await this.openLanguageMenu();
    const targetOption =
      lang === 'en'
        ? this.langEnOption
        : lang === 'ru'
        ? this.langRuOption
        : this.langUaOption;

    await targetOption.click();
    await expect(this.themeMenu).toBeHidden();
  }

  /**
   * Retrieves the stored language code from localStorage
   */
  async getStoredLanguage(): Promise<string | null> {
    return this.page.evaluate(() => localStorage.getItem('armor_language'));
  }

  /**
   * Retrieves the language cookie value from the browser context
   */
  async getLanguageCookie(): Promise<string | undefined> {
    const cookies = await this.page.context().cookies();
    return cookies.find((c) => c.name === 'armor_language')?.value;
  }
}
