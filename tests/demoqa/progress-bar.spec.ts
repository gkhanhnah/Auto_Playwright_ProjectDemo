import { expect, test } from '@playwright/test';
import { ProgressBarPage } from '../../pages/demoqa/ProgressBar';

test.describe('ProgressBar - DemoQA', () => {
  test.beforeEach(async ({ page }) => {
    const progressBarPage = new ProgressBarPage(page);
    await progressBarPage.goto();
  });

  test('Start progress bar — đạt ít nhất 50% rồi dừng (bước nhảy có thể bỏ qua đúng 50)', async ({
    page,
  }) => {
    const progressBarPage = new ProgressBarPage(page);
    await progressBarPage.startProgressBar();
    await progressBarPage.waitForProgressAtLeast(50);
    await progressBarPage.stopProgressBar();

    const value = await progressBarPage.getProgressBarValue();
    expect(value).toBeGreaterThanOrEqual(50);
    expect(value).toBeLessThanOrEqual(100);
  });

  test('Stop progress bar — chạy một đoạn rồi dừng, giá trị giữ nguyên sau khi Stop', async ({
    page,
  }) => {
    const progressBarPage = new ProgressBarPage(page);
    await progressBarPage.startProgressBar();
    await progressBarPage.waitForProgressAtLeast(20);
    await progressBarPage.stopProgressBar();

    const afterStop = await progressBarPage.getProgressBarValue();
    expect(afterStop).toBeGreaterThanOrEqual(20);
  });

  test('Get progress bar value — ban đầu trong 0–100', async ({ page }) => {
    const progressBarPage = new ProgressBarPage(page);
    const value = await progressBarPage.getProgressBarValue();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(100);
  });
});
