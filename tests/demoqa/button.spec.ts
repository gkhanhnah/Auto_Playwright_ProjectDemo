import { test } from '@playwright/test';
import { ButtonPage } from '../../pages/demoqa/Button';

test.describe('Button - DemoQA', () => {
  
  test.beforeEach(async ({ page }) => {
    const buttonPage = new ButtonPage(page);
    await buttonPage.goto();
  });

  test('Double click button', async ({ page }) => {
    const buttonPage = new ButtonPage(page);
    await buttonPage.doubleClickButton();
    await buttonPage.expectDoubleClickButtonVisible();
  });

  test('Right click button', async ({ page }) => {
    const buttonPage = new ButtonPage(page);
    await buttonPage.rightClickButton();
    await buttonPage.expectRightClickButtonVisible();
  });

  test('Click button', async ({ page }) => {
    const buttonPage = new ButtonPage(page);
    await buttonPage.clickButton();
    await buttonPage.expectClickButtonVisible();
  });
});