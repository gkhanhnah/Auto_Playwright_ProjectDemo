import { test } from '@playwright/test';
import { RegisterPage } from '../../pages/demoqa/Register';

test.describe('Register - DemoQA', () => {
  
  test.beforeEach(async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('Register with valid user', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.fillValidUser();
    await registerPage.clickRegisterButton();
    await registerPage.expectRegisterSuccess();
  });

  test('Register with invalid user', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.fillInvalidUser();
    await registerPage.clickRegisterButton();
    await registerPage.expectPasswordNotValid();
  });

  test('Register with blank first name', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.blankFirstName();
    await registerPage.clickRegisterButton();
    await registerPage.expectBlankFirstName();
  });

  test('Register with blank last name', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.blankLastName();
    await registerPage.clickRegisterButton();
    await registerPage.expectBlankLastName();
  });

  test('Register with blank user name', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.blankUserName();
    await registerPage.clickRegisterButton();
    await registerPage.expectBlankUserName();
  });

  test('Register with blank password', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.blankPassword();
    await registerPage.clickRegisterButton();
    await registerPage.expectBlankPassword();
  });
});