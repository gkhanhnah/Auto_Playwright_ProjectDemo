import { expect, Page } from '@playwright/test';

export class TextboxPage {
  constructor(private page: Page) { }

  async goto() {
    await this.page.goto('/text-box', {
      waitUntil: 'domcontentloaded'
    });
  }

  async fillTextbox(fullName: string, email: string, currentAddress: string, permanentAddress: string) {
    await this.page.fill('#userName', fullName);
    await this.page.fill('#userEmail', email);
    await this.page.fill('#currentAddress', currentAddress);
    await this.page.fill('#permanentAddress', permanentAddress);
  }

  async submit() {
    await this.page.click('#submit');
  }
}