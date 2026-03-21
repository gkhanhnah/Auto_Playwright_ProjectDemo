import * as fs from 'fs';
import * as path from 'path';
import { test } from '@playwright/test';
import { DatePickerPage } from '../../pages/demoqa/DatePicker';

const datePickerData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../test-data/demoqa/date-picker.json'), 'utf-8'),
) as {
  dateOnly: { value: string };
  dateTimeJan1: {
    calendar: { year: number; monthIndex: number; day: number; timeLabel: string };
    expectedValueRegex: string;
  };
  dateOnlyPlusDateTime: {
    dateOnlyValue: string;
    calendar: { year: number; monthIndex: number; day: number; timeLabel: string };
    expectedDateOnly: string;
    expectedDateTimeRegex: string;
  };
};

test.describe('Date Picker - DemoQA', () => {
  test.beforeEach(async ({ page }) => {
    const datePickerPage = new DatePickerPage(page);
    await datePickerPage.goto();
  });

  test('Select date — fills date only input and value is shown', async ({ page }) => {
    const datePickerPage = new DatePickerPage(page);
    const { value } = datePickerData.dateOnly;

    await datePickerPage.selectDate(value);
    await datePickerPage.expectDateSelected(value);
  });

  test('Select date and time — pick via calendar (fill does not work on this widget)', async ({
    page,
  }) => {
    const datePickerPage = new DatePickerPage(page);
    const { calendar, expectedValueRegex } = datePickerData.dateTimeJan1;

    await datePickerPage.selectDateAndTimeFromCalendar(calendar);
    await datePickerPage.expectDateAndTimeSelected(new RegExp(expectedValueRegex, 'i'));
  });

  test('Date only field does not change when setting date+time field', async ({ page }) => {
    const datePickerPage = new DatePickerPage(page);
    const {
      dateOnlyValue,
      calendar,
      expectedDateOnly,
      expectedDateTimeRegex,
    } = datePickerData.dateOnlyPlusDateTime;

    await datePickerPage.selectDate(dateOnlyValue);
    await datePickerPage.selectDateAndTimeFromCalendar(calendar);

    await datePickerPage.expectDateSelected(expectedDateOnly);
    await datePickerPage.expectDateAndTimeSelected(new RegExp(expectedDateTimeRegex, 'i'));
  });
});
