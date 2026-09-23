import { BankPage } from './BankPage.js';
export class HomePage extends BankPage {
  get homeScreen() { return this.page.getByTestId('screen-home'); }
  get totalBalance() { return this.page.getByTestId('total-balance'); }
  get currentBalance() { return this.page.getByTestId('balance-current'); }
}
