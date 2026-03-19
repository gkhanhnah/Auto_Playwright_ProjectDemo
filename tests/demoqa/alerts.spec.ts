import { test } from '@playwright/test';
import { AlertsPage } from '../../pages/demoqa/Alerts';

test.describe('Alerts - DemoQA', () => {
  
  test.beforeEach(async ({ page }) => {
    const alertsPage = new AlertsPage(page);
    await alertsPage.goto();
  });

  test('Click alert button', async ({ page }) => {
    const alertsPage = new AlertsPage(page);
    await alertsPage.clickAlertButton();
  });

  test('Click timer alert button', async ({ page }) => {
    const alertsPage = new AlertsPage(page);
    await alertsPage.clickTimerAlertButton();
  });

  test('Click confirm button', async ({ page }) => {
    const alertsPage = new AlertsPage(page);
    await alertsPage.clickConfirmOk();
    await alertsPage.expectConfirmResult('Ok');
  });

  test('Click promt button', async ({ page }) => {
    const alertsPage = new AlertsPage(page);
    await alertsPage.submitPrompt('John Doe');
    await alertsPage.expectPromptResult('John Doe');
  });
});