import { expect, Page } from '@playwright/test';

export class RadioButtonPage {
  constructor(private page: Page) {}

  // ===== LOCATORS =====
  radio = (label: string) =>
    this.page.getByRole('radio', { name: label });

  result = () => this.page.locator('.text-success');

  // ===== ACTIONS =====
  async goto() {
    await this.page.goto('/radio-button', {
      waitUntil: 'domcontentloaded',
    });
  }

  async selectRadioButton(label: string) {
    await this.radio(label).click();
  }

  async forceClickRadio(label: string) {
    await this.radio(label).click({ force: true });
  }

  // ===== ASSERTIONS =====
  async expectResultVisible() {
    await expect(this.result()).toBeVisible();
  }

  async expectResultContains(text: string) {
    await expect(this.result()).toHaveText(text);
  }

  async expectRadioDisabled(label: string) {
    await expect(this.radio(label)).toBeDisabled();
  }

  async expectRadioNotSelected(text: string) {
    await expect(this.result()).toBeHidden();
  }
}