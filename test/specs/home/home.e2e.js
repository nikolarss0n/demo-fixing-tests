import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/HomePage.js';
test.describe('Home balances', () => {
  test.beforeEach(async ({ page }) => { const home = new HomePage(page); await home.open(); await home.login(); });
  test('shows the total balance in EUR', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.homeScreen).toBeVisible();
    await expect(home.totalBalance).toHaveText('€18,950.80');
  });
  test('shows the everyday account balance in EUR', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.homeScreen).toBeVisible();
    await expect(home.currentBalance).toHaveText('€6,450.80');
  });
});
