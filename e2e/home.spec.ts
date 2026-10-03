import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { expectNoHorizontalOverflow } from './helpers/layout';

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test.describe('Page Structure & Metadata', () => {
    test('should display the correct page title and language attribute', async ({ page }) => {
      await expect(page).toHaveTitle('ArmorNode');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });

    test('should render semantic landmarks', async () => {
      await expect(homePage.header.root).toBeVisible();
      await expect(homePage.mainContainer).toBeVisible();
    });
  });

  test.describe('Layout Integrity', () => {
    test('should render content cleanly without horizontal overflow', async ({ page }) => {
      await expectNoHorizontalOverflow(page);
    });
  });
});
