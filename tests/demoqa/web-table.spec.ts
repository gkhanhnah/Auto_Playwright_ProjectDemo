import { test } from '@playwright/test';
import { AddPage, DeletePage, EditPage } from '../../pages/demoqa/WebTable';

test.describe('WebTable - DemoQA', () => {
  
  test.beforeEach(async ({ page }) => {
    const addPage = new AddPage(page);
    await addPage.goto();
  });

  test('Add record', async ({ page }) => {
    const addPage = new AddPage(page);
    await addPage.addRecord();
    await addPage.submitRecord();
    await addPage.expectRecordAdded();
  });

  test('Edit record', async ({ page }) => {
    const editPage = new EditPage(page);
    await editPage.editRecord();
    await editPage.submitRecord();
    await editPage.expectRecordEdited();
  });

  test('Delete record', async ({ page }) => {
    const deletePage = new DeletePage(page);
    await deletePage.deleteRecord();
  });
});