import { test, expect } from '@playwright/test';
import { Header } from './components/Header';

test.describe('Global Header & Theme Switcher', () => {
  let header: Header;

  test.beforeEach(async ({ page }) => {
    header = new Header(page);
    await page.goto('/');
  });

  test.describe('Branding', () => {
    test('should display the ArmorNode brand logo', async () => {
      await expect(header.root).toBeVisible();
      await expect(header.brandLogo).toBeVisible();
      await expect(header.brandLogo).toContainText('ARMORNODE');
    });

    test('should display theme toggle button with accessible aria attributes', async () => {
      await expect(header.themeToggleBtn).toBeVisible();
      await expect(header.themeToggleBtn).toHaveAttribute('aria-haspopup', 'menu');
      await expect(header.themeToggleBtn).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test.describe('Theme Menu Interactivity', () => {
    test('should open and close the menu on button click', async () => {
      await header.openThemeMenu();
      await expect(header.themeToggleBtn).toHaveAttribute('aria-expanded', 'true');
      await expect(header.themeMenu).toBeVisible();

      await header.closeThemeMenu();
      await expect(header.themeToggleBtn).toHaveAttribute('aria-expanded', 'false');
      await expect(header.themeMenu).toBeHidden();
    });

    test('should dismiss the menu when Escape key is pressed', async ({ page }) => {
      await header.openThemeMenu();
      await page.keyboard.press('Escape');

      await expect(header.themeMenu).toBeHidden();
      await expect(header.themeToggleBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('should dismiss the menu when clicking outside', async ({ page }) => {
      await header.openThemeMenu();
      // Click outside onto body area
      await page.locator('body').click({ position: { x: 10, y: 10 } });

      await expect(header.themeMenu).toBeHidden();
      await expect(header.themeToggleBtn).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test.describe('Theme Mode Switching', () => {
    test('should dynamically apply dark and light theme classes', async ({ page }) => {
      const html = page.locator('html');

      // 1. Switch to Dark Mode
      await header.selectTheme('dark');
      await expect(html).toHaveClass(/dark/);
      await expect(header.themeToggleBtn).toContainText(/dark/i);

      // 2. Switch to Light Mode
      await header.selectTheme('light');
      await expect(html).toHaveClass(/light/);
      await expect(header.themeToggleBtn).toContainText(/light/i);
    });

    test('should persist theme preference across page reloads', async ({ page }) => {
      const html = page.locator('html');

      await header.selectTheme('dark');
      await expect(html).toHaveClass(/dark/);
      expect(await header.getStoredTheme()).toBe('dark');

      // Reload page and verify persistence
      await page.reload();
      await expect(html).toHaveClass(/dark/);
      await expect(header.themeToggleBtn).toContainText(/dark/i);
    });
  });
});
