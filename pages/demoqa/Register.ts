import { expect, Page } from '@playwright/test';
import register from '../../test-data/demoqa/register.json';
export class RegisterPage {
    constructor(private page: Page) { }

    // ===== LOCATORS =====
    firstName = () =>
        this.page.locator('#firstname');
    lastName = () =>
        this.page.locator('#lastname');
    userName = () =>
        this.page.locator('#userName');
    password = () =>
        this.page.locator('#password');
    passwordError = () =>
        this.page.locator('#name');
    registerButton = () =>
        this.page.locator('#register');

    // ===== ACTIONS =====
    async goto() {
        await this.page.goto('/register');
    }

    async fillValidUser() {
        await this.firstName().fill(register.validUser.firstName);
        await this.lastName().fill(register.validUser.lastName);
        await this.userName().fill(register.validUser.userName);
        await this.password().fill(register.validUser.password);
    }

    async fillInvalidUser() {
        await this.firstName().fill(register.invalidUser.firstName);
        await this.lastName().fill(register.invalidUser.lastName);
        await this.userName().fill(register.invalidUser.userName);
        await this.password().fill(register.invalidUser.password);
    }

    async blankFirstName() {
        await this.firstName().fill('');
        await this.lastName().fill(register.validUser.lastName);
        await this.userName().fill(register.validUser.userName);
        await this.password().fill(register.validUser.password);
    }

    async blankLastName() {
        await this.lastName().fill('');
        await this.firstName().fill(register.validUser.firstName);
        await this.userName().fill(register.validUser.userName);
        await this.password().fill(register.validUser.password);
    }

    async blankUserName() {
        await this.userName().fill('');
        await this.firstName().fill(register.validUser.firstName);
        await this.lastName().fill(register.validUser.lastName);
        await this.password().fill(register.validUser.password);
    }

    async blankPassword() {
        await this.password().fill('');
        await this.firstName().fill(register.validUser.firstName);
        await this.lastName().fill(register.validUser.lastName);
        await this.userName().fill(register.validUser.userName);
    }


    async clickRegisterButton() {
        await this.registerButton().click();
    }

    async expectRegisterSuccess() {
        await expect(this.page.locator('.alert-success')).toBeVisible();
        await expect(this.page.locator('.alert-success')).toContainText('User Registered successfully');
    }

    async expectBlankFirstName() {
        await expect(this.firstName()).toHaveClass(/is-invalid/);
    }

    async expectBlankLastName() {
        await expect(this.lastName()).toHaveClass(/is-invalid/);
    }

    async expectBlankUserName() {
        await expect(this.userName()).toHaveClass(/is-invalid/);
    }

    async expectBlankPassword() {
        await expect(this.password()).toHaveClass(/is-invalid/);
    }

    async expectPasswordNotValid() {
        await expect(this.passwordError()).toBeVisible();
        await expect(this.passwordError()).toContainText(/Passwords must have/);
    }
}