import { expect } from '@playwright/test';
export class BankPage {
  constructor(page) { this.page = page; }
  get freeze() { return this.page.getByTestId('freeze-card'); }
  async open() {
    const response = await this.page.request.post('/api/bank/reset', { data: { scenario: 'baseline' } });
    expect(response.status()).toBe(200);
    await this.page.goto('/');
  }
  async login() {
    await this.page.getByLabel('4-digit demo PIN').fill('2468');
    await this.page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(this.page.getByTestId('total-balance')).toBeVisible();
  }
  async cards() {
    await this.page.getByTestId('nav-cards').click();
    await this.page.getByTestId('manage-card-debit').click();
  }
}
