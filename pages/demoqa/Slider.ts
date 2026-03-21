import { expect, Locator, Page } from '@playwright/test';

export class SliderPage {
    constructor(private page: Page) { }

    slider = () => this.rangeInput();

    sliderValue = () =>
        this.page.locator('input#sliderValue.form-control, input.form-control').first();

    valueHover = () => this.page.locator('.range-slider__tooltip__label');

    private rangeInput(): Locator {
        return this.page.locator('input[type="range"].range-slider').first();
    }

    async goto() {
        await this.page.goto('/slider');
    }

    async moveSlider(value: number) {
        const input = this.rangeInput();
        await input.waitFor({ state: 'visible' });
        await input.fill(String(value));
        await input.dispatchEvent('change');
    }

    async hoverSlider() {
        const input = this.rangeInput();
        await input.waitFor({ state: 'visible' });

        const min = Number((await input.getAttribute('min')) ?? '0');
        const max = Number((await input.getAttribute('max')) ?? '100');
        const val = Number(await input.inputValue());
        const ratio = (val - min) / (max - min);

        const box = await input.boundingBox();
        if (!box) {
            throw new Error('Range input has no bounding box');
        }

        const x = Math.min(Math.max(1, box.width * ratio), box.width - 1);
        const y = box.height / 2;

        await input.hover({ position: { x, y }, force: true });
    }

    async getTooltipText(): Promise<string> {
        const el = this.valueHover();
        await el.waitFor({ state: 'visible' });
        return ((await el.textContent()) ?? '').trim();
    }

    async expectSliderValue(value: number) {
        await expect(this.sliderValue()).toHaveValue(value.toString(), { timeout: 10_000 });
    }

    async expectSliderHovered(value: number) {
        await this.valueHover().waitFor({ state: 'visible' });
        await expect(this.valueHover()).toHaveText(value.toString(), { timeout: 10_000 });
    }
}
