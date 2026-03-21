import { expect, test } from '@playwright/test';
import { SliderPage } from '../../pages/demoqa/Slider';

test.describe('Slider - DemoQA', () => {
  test.beforeEach(async ({ page }) => {
    const sliderPage = new SliderPage(page);
    await sliderPage.goto();
  });

  test('Move slider', async ({ page }) => {
    const sliderPage = new SliderPage(page);
    await sliderPage.moveSlider(50);
    await sliderPage.expectSliderValue(50);
  });

  test('Hover slider — tooltip theo giá trị hiện tại; sau khi kéo phải khác lúc đầu', async ({
    page,
  }) => {
    const sliderPage = new SliderPage(page);

    await sliderPage.hoverSlider();
    const tooltipFirst = await sliderPage.getTooltipText();
    await sliderPage.expectSliderHovered(Number(tooltipFirst));

    await sliderPage.moveSlider(50);
    await sliderPage.hoverSlider();
    const tooltipAfter = await sliderPage.getTooltipText();

    expect(tooltipAfter).not.toBe(tooltipFirst);
    await sliderPage.expectSliderHovered(50);
  });
});
