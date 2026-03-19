import { chromium } from '@playwright/test';

export default async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://cms.anhtester.com/login');

  await page.fill('#email', 'admin@example.com');
  await page.fill('#password', '123456');

  await page.click('button[type="submit"]');

  await page.waitForURL('/home');

  await page.context().storageState({ path: 'auth.json' });

  await browser.close();
};