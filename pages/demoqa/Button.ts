import { expect, Page } from '@playwright/test';

export class ButtonPage {
    constructor(private page: Page) { }

    // ===== LOCATORS =====
    doubleClick = () =>
        this.page.locator('#doubleClickBtn');
    doubleClickMessage = () =>
        this.page.locator('#doubleClickMessage');

    rightClick = () =>
        this.page.locator('#rightClickBtn');
    rightClickMessage = () =>
        this.page.locator('#rightClickMessage');

    click = () =>
        this.page.getByRole('button', { name: 'Click Me', exact: true });
    clickMessage = () =>
        this.page.locator('#dynamicClickMessage');

    // ===== ACTIONS =====
    async goto() {
        await this.page.goto('/buttons');
    }

    async doubleClickButton() {
        await this.doubleClick().dblclick();
    }

    async rightClickButton() {
        await this.rightClick().click({ button: 'right' });
    }

    async clickButton() {
        await this.click().click();
    }

    // ===== ASSERTIONS =====
    async expectDoubleClickButtonVisible() {
        await expect(this.doubleClickMessage()).toHaveText('You have done a double click');
    }

    async expectRightClickButtonVisible() {
        await expect(this.rightClickMessage()).toHaveText('You have done a right click');
    }

    async expectClickButtonVisible() {
        await expect(this.clickMessage()).toHaveText('You have done a dynamic click');
    }

}