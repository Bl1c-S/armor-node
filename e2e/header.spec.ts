import { test, expect } from '@playwright/test';
import { Header } from './components/Header';

test.describe('Global Header, Theme & Language Switcher', () => {
  let header: Header;

  test.beforeEach(async ({ page }) => {
    header = new Header(page);
    await page.goto('/');
  });

  test.describe('Branding & Controls', () => {
    test('should display the ArmorNode brand logo', async () => {
      await expect(header.root).toBeVisible();
      await expect(header.brandLogo).toBeVisible();
      await expect(header.brandLogo).toContainText('ARMORNODE');
    });

    test('should display theme and language toggle buttons with accessible attributes', async () => {
      await expect(header.themeToggleBtn).toBeVisible();
      await expect(header.themeToggleBtn).toHaveAttribute('aria-haspopup', 'menu');
      await expect(header.themeToggleBtn).toHaveAttribute('aria-expanded', 'false');

      await expect(header.languageToggleBtn).toBeVisible();
      await expect(header.languageToggleBtn).toHaveAttribute('aria-haspopup', 'menu');
      await expect(header.languageToggleBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('should default to system theme', async () => {
      await expect(header.themeToggleBtn).toContainText(/system/i);
    });
  });

  test.describe('Theme Menu Interactivity & Switching', () => {
    test('should open and close the theme menu on button click', async () => {
      await header.openThemeMenu();
      await expect(header.themeToggleBtn).toHaveAttribute('aria-expanded', 'true');
      await expect(header.themeMenu).toBeVisible();

      await header.closeThemeMenu();
      await expect(header.themeToggleBtn).toHaveAttribute('aria-expanded', 'false');
      await expect(header.themeMenu).toBeHidden();
    });

    test('should dismiss the theme menu when Escape key is pressed', async ({ page }) => {
      await header.openThemeMenu();
      await page.keyboard.press('Escape');

      await expect(header.themeMenu).toBeHidden();
      await expect(header.themeToggleBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('should dismiss the theme menu when clicking outside', async ({ page }) => {
      await header.openThemeMenu();
      await page.locator('body').click({ position: { x: 10, y: 10 } });

      await expect(header.themeMenu).toBeHidden();
      await expect(header.themeToggleBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('should save selected theme to cookies and persist across reload', async ({ page }) => {
      const html = page.locator('html');

      // 1. Switch to Dark Mode
      await header.selectTheme('dark');
      await expect(html).toHaveClass(/dark/);
      await expect(header.themeToggleBtn).toContainText(/dark/i);
      expect(await header.getThemeCookie()).toBe('dark');

      // Reload and verify persistence via cookie
      await page.reload();
      await expect(html).toHaveClass(/dark/);
      await expect(header.themeToggleBtn).toContainText(/dark/i);
      expect(await header.getThemeCookie()).toBe('dark');

      // 2. Switch to Light Mode
      await header.selectTheme('light');
      await expect(html).toHaveClass(/light/);
      await expect(header.themeToggleBtn).toContainText(/light/i);
      expect(await header.getThemeCookie()).toBe('light');
    });
  });

  test.describe('Language Menu Interactivity & Switching', () => {
    test('should open and close the language menu on button click', async () => {
      await header.openLanguageMenu();
      await expect(header.languageToggleBtn).toHaveAttribute('aria-expanded', 'true');
      await expect(header.themeMenu).toBeVisible();

      await header.closeLanguageMenu();
      await expect(header.languageToggleBtn).toHaveAttribute('aria-expanded', 'false');
      await expect(header.themeMenu).toBeHidden();
    });

    test('should dismiss the language menu when Escape key is pressed', async ({ page }) => {
      await header.openLanguageMenu();
      await page.keyboard.press('Escape');

      await expect(header.themeMenu).toBeHidden();
      await expect(header.languageToggleBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('should save selected language to cookies and persist across reload', async ({ page }) => {
      const html = page.locator('html');

      // 1. Switch to Ukrainian (UA)
      await header.selectLanguage('ua');
      await expect(header.languageToggleBtn).toContainText('UA');
      await expect(html).toHaveAttribute('lang', 'uk');
      expect(await header.getLanguageCookie()).toBe('ua');

      // Reload and verify persistence via cookie
      await page.reload();
      await expect(header.languageToggleBtn).toContainText('UA');
      await expect(html).toHaveAttribute('lang', 'uk');
      expect(await header.getLanguageCookie()).toBe('ua');

      // 2. Switch to Russian (RU)
      await header.selectLanguage('ru');
      await expect(header.languageToggleBtn).toContainText('RU');
      await expect(html).toHaveAttribute('lang', 'ru');
      expect(await header.getLanguageCookie()).toBe('ru');

      // 3. Switch back to English (EN)
      await header.selectLanguage('en');
      await expect(header.languageToggleBtn).toContainText('EN');
      await expect(html).toHaveAttribute('lang', 'en');
      expect(await header.getLanguageCookie()).toBe('en');
    });
  });

  test.describe('Browser Auto-Detection', () => {
    test('should auto-detect Ukrainian when browser locale is uk-UA', async ({ browser }) => {
      // Create a fresh context with Ukrainian locale and no cookies
      const context = await browser.newContext({ locale: 'uk-UA' });
      const newPage = await context.newPage();
      await newPage.goto('/');

      const pageHeader = new Header(newPage);
      await expect(pageHeader.languageToggleBtn).toContainText('UA');
      await expect(newPage.locator('html')).toHaveAttribute('lang', 'uk');

      await context.close();
    });

    test('should auto-detect Russian when browser locale is ru-RU', async ({ browser }) => {
      // Create a fresh context with Russian locale and no cookies
      const context = await browser.newContext({ locale: 'ru-RU' });
      const newPage = await context.newPage();
      await newPage.goto('/');

      const pageHeader = new Header(newPage);
      await expect(pageHeader.languageToggleBtn).toContainText('RU');
      await expect(newPage.locator('html')).toHaveAttribute('lang', 'ru');

      await context.close();
    });
  });
});
