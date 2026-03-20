import { expect, Page } from '@playwright/test';
import user from '../../test-data/demoqa/login.json';
export class LoginPage {
    constructor(private page: Page) { }

    // ===== LOCATORS =====
    userName = () =>
        this.page.locator('#userName');
    password = () =>
        this.page.locator('#password');
    loginButton = () =>
        this.page.locator('#login');
    errorMessage = () =>
        this.page.locator('#name');

    // ===== ACTIONS =====
    async goto() {
        await this.page.goto('/login');
    }

    async fillValidUser() {
        await this.userName().fill(user.validUser.userName);
        await this.password().fill(user.validUser.password);
    }

    async fillInvalidUser() {
        await this.userName().fill(user.invalidUser.userName);
        await this.password().fill(user.invalidUser.password);
    }

    async clickLoginButton() {
        await this.loginButton().click();
    }

    // ===== ASSERTIONS =====
    async expectLoginSuccess() {
        await expect(this.page).toHaveURL('/profile');
    }

    async expectLoginFailed() {
        await expect(this.errorMessage()).toBeVisible();
        await expect(this.errorMessage()).toContainText(/Invalid username or password/);
    }
}