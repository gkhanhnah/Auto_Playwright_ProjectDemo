import { test } from '@playwright/test';
import { LoginPage } from '../../pages/demoqa/Login';

test.describe('Login - DemoQA', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Login with valid user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.fillValidUser();
    await loginPage.clickLoginButton();
    await loginPage.expectLoginSuccess();
  });

  test('Login with invalid user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.fillInvalidUser();
    await loginPage.clickLoginButton();
    await loginPage.expectLoginFailed();
  });

});