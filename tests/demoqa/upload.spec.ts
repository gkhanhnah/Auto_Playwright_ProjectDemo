import { test } from '@playwright/test';
import { UploadPage } from '../../pages/demoqa/Upload';

test.describe('Upload - DemoQA', () => {
  
  test.beforeEach(async ({ page }) => {
    const uploadPage = new UploadPage(page);
    await uploadPage.goto();
  });

  test('Upload file', async ({ page }) => {
    const uploadPage = new UploadPage(page);
    await uploadPage.uploadFile();
    await uploadPage.expectUploadFileVisible();
  });

  test('Download file', async ({ page }) => {
    const uploadPage = new UploadPage(page);
    await uploadPage.expectDownloadSuccess();
  });
});