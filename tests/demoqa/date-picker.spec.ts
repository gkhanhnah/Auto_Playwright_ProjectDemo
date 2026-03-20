import { test } from '@playwright/test';
import { DatePickerPage } from '../../pages/demoqa/DatePicker';

test.describe('Date Picker - DemoQA', () => {
  test.beforeEach(async ({ page }) => {
    const datePickerPage = new DatePickerPage(page);
    await datePickerPage.goto();
  });

  test('Select date — fills date only input and value is shown', async ({ page }) => {
    const datePickerPage = new DatePickerPage(page);
    const date = '01/15/2026';

    await datePickerPage.selectDate(date);
    await datePickerPage.expectDateSelected(date);
  });

  test('Select date and time — pick via calendar (fill does not work on this widget)', async ({
    page,
  }) => {
    const datePickerPage = new DatePickerPage(page);

    await datePickerPage.selectDateAndTimeFromCalendar({
      year: 2026,
      monthIndex: 0,
      day: 1,
      timeLabel: '12:00 PM',
    });

    await datePickerPage.expectDateAndTimeSelected(
      /01\/01\/2026\s+12:00\s*PM|January\s+1,\s+2026\s+12:00\s*PM/i,
    );
  });

  test('Date only field does not change when setting date+time field', async ({ page }) => {
    const datePickerPage = new DatePickerPage(page);
    await datePickerPage.selectDate('03/20/2026');

    await datePickerPage.selectDateAndTimeFromCalendar({
      year: 2026,
      monthIndex: 5,
      day: 1,
      timeLabel: '3:30 PM',
    });

    await datePickerPage.expectDateSelected('03/20/2026');
    await datePickerPage.expectDateAndTimeSelected(
      /06\/01\/2026\s+3:30\s*PM|June\s+1,\s+2026\s+3:30\s*PM/i,
    );
  });
});
