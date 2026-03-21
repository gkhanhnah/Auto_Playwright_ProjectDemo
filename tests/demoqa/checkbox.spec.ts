import { test } from '@playwright/test';
import { CheckBoxPage } from '../../pages/demoqa/CheckBox';

test.describe('Checkbox - DemoQA', () => {
  
  test.beforeEach(async ({ page }) => {
    const checkboxPage = new CheckBoxPage(page);
    await checkboxPage.goto();
  });

  test('Select Home checkbox', async ({ page }) => {
    const checkboxPage = new CheckBoxPage(page);
    await checkboxPage.check('Home');
    await checkboxPage.expectResultVisible();
    await checkboxPage.expectResultContains('home');
  });

  test('Uncheck Home checkbox', async ({ page }) => {
    const checkboxPage = new CheckBoxPage(page);

    await checkboxPage.check('Home');
    await checkboxPage.uncheck('Home');

    await checkboxPage.expectResultHidden();
  });
});