import { expect, Page } from '@playwright/test';
import user from '../../test-data/demoqa/user.json';

export class AddPage {
    constructor(private page: Page) { }

    // ===== LOCATORS =====
    addButton = () =>
        this.page.locator('#addNewRecordButton');
    firstName = () =>
        this.page.locator('#firstName');
    lastName = () =>
        this.page.locator('#lastName');
    email = () =>
        this.page.locator('#userEmail');
    age = () =>
        this.page.locator('#age');
    salary = () =>
        this.page.locator('#salary');
    department = () =>
        this.page.locator('#department');
    submit = () =>
        this.page.locator('#submit');

    // ===== ACTIONS =====
    async goto() {
        await this.page.goto('/webtables');
    }

    async addRecord() {
        await this.addButton().click();
        await this.firstName().fill(user.validUser.firstName);
        await this.lastName().fill(user.validUser.lastName);
        await this.email().fill(user.validUser.email);
        await this.age().fill(user.validUser.age);
        await this.salary().fill(user.validUser.salary);
        await this.department().fill(user.validUser.department);
    }

    async submitRecord() {
        await this.submit().click();
    }

    // ===== ASSERTIONS =====
    async expectRecordAdded() {
        await expect(this.firstName()).toHaveValue(user.validUser.firstName);
        await expect(this.lastName()).toHaveValue(user.validUser.lastName);
        await expect(this.email()).toHaveValue(user.validUser.email);
        await expect(this.age()).toHaveValue(user.validUser.age);
        await expect(this.salary()).toHaveValue(user.validUser.salary);
        await expect(this.department()).toHaveValue(user.validUser.department);
    }

}

export class EditPage {
    constructor(private page: Page) { }

    // ===== LOCATORS =====
    editButton = () =>
        this.page.locator('#edit-record-1');
    firstName = () =>
        this.page.locator('#firstName');
    lastName = () =>
        this.page.locator('#lastName');
    email = () =>
        this.page.locator('#userEmail');
    age = () =>
        this.page.locator('#age');
    salary = () =>
        this.page.locator('#salary');
    department = () =>
        this.page.locator('#department');
    submit = () =>
        this.page.locator('#submit');

    // ===== ACTIONS =====
    async editRecord() {
        await this.editButton().click();
        await this.firstName().fill(user.editUser.firstName);
        await this.lastName().fill(user.editUser.lastName);
        await this.email().fill(user.editUser.email);
        await this.age().fill(user.editUser.age);
        await this.salary().fill(user.editUser.salary);
        await this.department().fill(user.editUser.department);
    }

    async submitRecord() {
        await this.submit().click();
    }

    // ===== ASSERTIONS =====
    async expectRecordEdited() {
        await expect(this.firstName()).toHaveValue(user.editUser.firstName);
        await expect(this.lastName()).toHaveValue(user.editUser.lastName);
        await expect(this.email()).toHaveValue(user.editUser.email);
        await expect(this.age()).toHaveValue(user.editUser.age);
        await expect(this.salary()).toHaveValue(user.editUser.salary);
        await expect(this.department()).toHaveValue(user.editUser.department);
    }  
}

export class DeletePage {
    constructor(private page: Page) { }

    // ===== LOCATORS =====
    deleteButton = () =>
        this.page.locator('#delete-record-2');
    confirmButton = () =>
        this.page.locator('#confirmBtn');
    cancelButton = () =>
        this.page.locator('#cancelBtn');

    // ===== ACTIONS =====
    async deleteRecord() {
        await this.deleteButton().click();
        await this.confirmButton().click();
    }
    
}