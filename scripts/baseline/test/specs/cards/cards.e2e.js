import { test, expect } from '@playwright/test';
import { BankPage } from '../../../pages/BankPage.js';
test.describe('Cards', () => {
  test.beforeEach(async ({ page }) => { const bank = new BankPage(page); await bank.open(); await bank.login(); });
  test('freezes card', { tag: ['@regression'] }, async ({ page }) => {
    const bank = new BankPage(page);
    await bank.cards(); await bank.freeze.click();
    await expect(page.getByTestId('card-status')).toHaveText('Frozen');
  });
  test('unfreezes card', { tag: ['@regression'] }, async ({ page }) => {
    const bank = new BankPage(page);
    await bank.cards(); await bank.freeze.click(); await bank.freeze.click();
    await expect(page.getByTestId('card-status')).toHaveText('Active');
  });
  test('retains frozen status after navigation', { tag: ['@regression'] }, async ({ page }) => {
    const bank = new BankPage(page);
    await bank.cards(); await bank.freeze.click();
    await page.getByTestId('nav-home').click(); await bank.cards();
    await expect(page.getByTestId('card-status')).toHaveText('Frozen');
  });
});
