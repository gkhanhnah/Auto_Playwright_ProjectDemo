import { expect, Page } from '@playwright/test';

export class DynamicPropertiesPage {
    constructor(private page: Page) { }

    // ===== LOCATORS =====
    enableAfter = () =>
        this.page.locator('#enableAfter');
    visibleAfter = () =>
        this.page.locator('#visibleAfter');
    colorChange = () =>
        this.page.locator('#colorChange');

    // ===== ACTIONS =====
    async goto() {
        await this.page.goto('/dynamic-properties');
    }

    async enableAfterButton() {
        await this.enableAfter().waitFor({ state: 'visible' });
        await this.enableAfter().click();
    }

    async expectEnableAfterButtonVisible() {
        await expect(this.enableAfter()).toBeVisible();
    }

    async expectVisibleAfterButtonVisible() {
        await this.visibleAfter().waitFor({ state: 'visible' });
        await expect(this.visibleAfter()).toBeVisible();
    }

    async expectColorChangeButtonColor() {
        await this.colorChange().waitFor({ state: 'visible' });
        await expect(this.colorChange()).toBeVisible();
        await expect(this.colorChange()).toHaveClass('mt-4 btn btn-primary');
    }
}