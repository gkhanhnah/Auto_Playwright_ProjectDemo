import { expect, Locator, Page } from '@playwright/test';

export class CheckBoxPage {
  private expandAllBtn: Locator;
  private result: Locator;

  constructor(private page: Page) {
    this.expandAllBtn = this.page.getByRole('button', { name: /expand all/i });
    this.result = this.page.locator('#result');
  }

  private checkbox(name: string) {
    return this.page.getByRole('checkbox', { name });
  }

  async goto() {
    await this.page.goto('/checkbox', {
      waitUntil: 'load',
      timeout: 60_000,
    });

    await this.expandAllBtn.waitFor({ state: 'attached', timeout: 30_000 });
  }

  async expandAll() {
    await this.expandAllBtn.waitFor({ state: 'attached' });
    await this.expandAllBtn.click();
  }

  async check(name: string) {
    const cb = this.checkbox(name);
    await cb.waitFor();

    const state = await cb.getAttribute('aria-checked');
    if (state !== 'true') {
      await cb.click();
    }
  }

  async uncheck(name: string) {
    const cb = this.checkbox(name);

    const state = await cb.getAttribute('aria-checked');
    if (state === 'true') {
      await cb.click();
    }
  }

  async expectResultVisible() {
    await expect(this.result).toBeVisible();
  }

  async expectResultContains(text: string) {
    await expect(this.result).toContainText(text);
  }

  async expectResultHidden() {
    await expect(this.result).toBeHidden();
  }
}