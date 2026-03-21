import { expect, Page } from '@playwright/test';

export class AlertsPage {
  constructor(private page: Page) {}

  // ===== LOCATORS =====
  alertButton = () => this.page.locator('#alertButton');
  timerAlertButton = () => this.page.locator('#timerAlertButton');
  confirmButton = () => this.page.locator('#confirmButton');
  promptButton = () => this.page.locator('#promtButton');

  confirmResult = () => this.page.locator('#confirmResult');
  promptResult = () => this.page.locator('#promptResult');

  // ===== NAVIGATION =====
  async goto() {
    await this.page.goto('/alerts');
  }

  async clickAlertButton() {
    this.page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('You clicked a button');
      await dialog.accept();
    });

    await this.alertButton().click();
  }

  async clickTimerAlertButton() {
    this.page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('This alert appeared after 5 seconds');
      await dialog.accept();
    });

    await this.timerAlertButton().click();
  }

  async clickConfirmOk() {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await this.confirmButton().click();
  }

  async clickConfirmCancel() {
    this.page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await this.confirmButton().click();
  }

  async submitPrompt(text: string) {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept(text);
    });

    await this.promptButton().click();
  }

  async cancelPrompt() {
    this.page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await this.promptButton().click();
  }

  // ===== ASSERTIONS =====
  async expectConfirmResult(expected: 'Ok' | 'Cancel') {
    await expect(this.confirmResult()).toContainText(`You selected ${expected}`);
  }

  async expectPromptResult(text: string) {
    await expect(this.promptResult()).toContainText(`You entered ${text}`);
  }

  async expectPromptNotVisible() {
    await expect(this.promptResult()).toHaveCount(0);
  }
}