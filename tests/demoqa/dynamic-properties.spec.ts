import { test } from '@playwright/test';
import { DynamicPropertiesPage } from '../../pages/demoqa/DynamicProperties';

test.describe('Dynamic Properties - DemoQA', () => {
  
  test.beforeEach(async ({ page }) => {
    const dynamicPropertiesPage = new DynamicPropertiesPage(page);
    await dynamicPropertiesPage.goto();
  });

  test('Enable after button', async ({ page }) => {
    const dynamicPropertiesPage = new DynamicPropertiesPage(page);
    await dynamicPropertiesPage.enableAfterButton();
    await dynamicPropertiesPage.expectEnableAfterButtonVisible();
  });

  test('Visible after button', async ({ page }) => {
    const dynamicPropertiesPage = new DynamicPropertiesPage(page);
    await dynamicPropertiesPage.visibleAfter();
    await dynamicPropertiesPage.expectVisibleAfterButtonVisible();
  });

  test('Color change button', async ({ page }) => {
    const dynamicPropertiesPage = new DynamicPropertiesPage(page);
    await dynamicPropertiesPage.colorChange();
    await dynamicPropertiesPage.expectColorChangeButtonColor();
  });
});