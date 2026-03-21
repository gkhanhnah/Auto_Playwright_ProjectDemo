import { expect, Page } from '@playwright/test';

export class ProgressBarPage {
    constructor(private page: Page) { }

    progressBar = () => this.page.locator('#progressBar');

    progressBarValue = () =>
        this.page.locator('[role="progressbar"]');

    startStopButton = () => this.page.locator('#startStopButton');

    async goto() {
        await this.page.goto('/progress-bar');
    }

    private async waitProgressBarInDom() {
        await this.progressBarValue().first().waitFor({ state: 'attached', timeout: 30_000 });
    }

    async startProgressBar() {
        await this.page.getByRole('button', { name: 'Start' }).click();
    }

    async stopProgressBar() {
        await this.page.getByRole('button', { name: 'Stop' }).click();
    }

    async getProgressBarValue(): Promise<number> {
        await this.waitProgressBarInDom();
        const raw = await this.progressBarValue().first().getAttribute('aria-valuenow');
        return Number(raw ?? 'NaN');
    }

    async waitForProgressAtLeast(minPercent: number) {
        await this.waitProgressBarInDom();
        await expect
            .poll(async () => this.getProgressBarValue(), {
                timeout: 30_000,
                message: `Chờ progress >= ${minPercent}%`,
            })
            .toBeGreaterThanOrEqual(minPercent);
    }

    async expectProgressBarValue(value: number) {
        await this.waitProgressBarInDom();
        await expect(this.progressBarValue().first()).toHaveAttribute(
            'aria-valuenow',
            value.toString(),
            { timeout: 10_000 },
        );
    }
}
