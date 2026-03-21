import { test } from '@playwright/test';
import { RadioButtonPage } from '../../pages/demoqa/RadioButton';

test.describe('Radio Button - DemoQA', () => {

  test('Select Yes', async ({ page }) => {
    const radio = new RadioButtonPage(page);

    await radio.goto();
    await radio.selectRadioButton('Yes');

    await radio.expectResultVisible();
    await radio.expectResultContains('Yes');
  });

//   test('Select Impressive', async ({ page }) => {
//     const radio = new RadioButtonPage(page);

//     await radio.goto();
//     await radio.selectRadioButton('Impressive');

//     await radio.expectResultContains('Impressive');
//   });

  test('Click No (disabled)', async ({ page }) => {
    const radio = new RadioButtonPage(page);

    await radio.goto();

    // 1. verify disabled
    await radio.expectRadioDisabled('No');

    // 2. force click
    await radio.forceClickRadio('No');

    // 3. verify không thay đổi UI
    await radio.expectRadioNotSelected('No');
  });

});