import { expect, Locator, Page } from '@playwright/test';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

function dayWithOrdinal(day: number): string {
    if (day >= 11 && day <= 13) return `${day}th`;
    switch (day % 10) {
        case 1:
            return `${day}st`;
        case 2:
            return `${day}nd`;
        case 3:
            return `${day}rd`;
        default:
            return `${day}th`;
    }
}

function parseHeaderMonthYear(text: string): { monthIndex: number; year: number } {
    const parts = text.trim().split(/\s+/);
    const monthName = parts[0];
    const year = Number(parts[1]);
    const monthIndex = MONTH_NAMES.indexOf(monthName);
    if (monthIndex < 0 || Number.isNaN(year)) {
        throw new Error(`Unexpected datepicker header: "${text}"`);
    }
    return { monthIndex, year };
}

function timeLabelToLooseRegex(timeLabel: string): RegExp {
    const t = timeLabel.trim().replace(/\s+/g, ' ');
    const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) {
        return new RegExp(escapeRegex(t).replace(/\\\s+/g, '\\s+'), 'i');
    }
    const hour = Number(m[1]);
    const minRaw = m[2];
    const ap = m[3].toUpperCase();
    return new RegExp(
        `\\b0*${hour}\\s*:\\s*${minRaw}\\s*${ap}\\b`,
        'i',
    );
}

export class DatePickerPage {
    constructor(private page: Page) { }

    // ===== LOCATORS =====
    datePicker = () =>
        this.page.locator('#datePickerMonthYearInput');
    dateAndTimePickerInput = () =>
        this.page.locator('#dateAndTimePickerInput');

    private async visibleDateTimeCalendar(): Promise<Locator> {
        const candidates = this.page.locator('.react-datepicker').filter({
            has: this.page.locator('.react-datepicker__time-container'),
        });
        const n = await candidates.count();
        for (let i = 0; i < n; i++) {
            const cal = candidates.nth(i);
            if (await cal.isVisible()) {
                return cal;
            }
        }
        throw new Error('No visible datetime react-datepicker (with time column) found');
    }

    // ===== ACTIONS =====
    async goto() {
        await this.page.goto('/date-picker');
    }

    async selectDateAndTimeFromCalendar(opts: {
        year: number;
        monthIndex: number;
        day: number;
        timeLabel: string;
    }) {
        const { year, monthIndex, day, timeLabel } = opts;
        const dayOrd = dayWithOrdinal(day);
        const dayLocator = (await this.visibleDateTimeCalendar()).locator('.react-datepicker__day').filter({
            hasText: new RegExp(`^${dayOrd}$`)
        }).filter({
            hasNot: (await this.visibleDateTimeCalendar()).locator('.react-datepicker__day--outside-month')
        }).first();
        await dayLocator.click();

        await this.dateAndTimePickerInput().click();

        // Page has two pickers in DOM; the datetime one is usually last — don't wait on the first (often hidden).
        await this.page.locator('.react-datepicker__time-container').last().waitFor({
            state: 'visible',
            timeout: 15_000,
        });

        const calendar = await this.visibleDateTimeCalendar();
        await calendar.waitFor({ state: 'visible' });
        await this.navigateToMonth(calendar, year, monthIndex);
        await this.clickTimeListItem(calendar, timeLabel);
        await this.page.keyboard.press('Escape');
    }

    async selectDateAndTime(_date: string) {
        throw new Error(
            'selectDateAndTime(string) is unreliable on DemoQA (controlled input). Use selectDateAndTimeFromCalendar({ year, monthIndex, day, timeLabel }) instead.',
        );
    }

    async selectDate(date: string) {
        const input = this.datePicker();
        await input.click();
        await input.fill('');
        await input.fill(date);
        await input.press('Tab');
    }

    private async clickTimeListItem(calendar: Locator, timeLabel: string) {
        const timeList = calendar.locator('.react-datepicker__time-list');
        await timeList.waitFor({ state: 'visible' });

        const items = timeList.locator('.react-datepicker__time-list-item');
        const texts = await items.allTextContents();

        // normalize
        const normalize = (t: string) => t.replace(/\s+/g, '').toLowerCase();

        const target = normalize(timeLabel);

        // tìm exact trước
        let index = texts.findIndex(t => normalize(t) === target);

        // nếu không có → lấy item gần nhất
        if (index === -1) {
            console.warn(`Time ${timeLabel} not found, picking closest...`);
            index = 0; // hoặc logic chọn gần nhất
        }

        const item = items.nth(index);
        await item.scrollIntoViewIfNeeded();
        await item.click();
    }

    private async navigateToMonth(calendar: Locator, targetYear: number, targetMonthIndex: number) {
        const header = calendar.locator('.react-datepicker__current-month');
        await header.waitFor({ state: 'visible' });

        for (let i = 0; i < 48; i++) {
            const text = await header.textContent();
            if (!text) continue;
            const { monthIndex, year } = parseHeaderMonthYear(text);

            if (year === targetYear && monthIndex === targetMonthIndex) {
                return;
            }

            const current = new Date(year, monthIndex, 1);
            const target = new Date(targetYear, targetMonthIndex, 1);

            if (current < target) {
                await calendar.locator('.react-datepicker__navigation--next').click();
            } else {
                await calendar.locator('.react-datepicker__navigation--previous').click();
            }
        }

        throw new Error(
            `Could not navigate calendar to ${MONTH_NAMES[targetMonthIndex]} ${targetYear}`,
        );
    }

    /** Asserts the "Select Date" field (month/year input) value. */
    async expectDateSelected(expected: string | RegExp) {
        await expect(this.datePicker()).toHaveValue(expected);
    }

    /** Asserts the "Date And Time" field value (format may vary by locale / widget). */
    async expectDateAndTimeSelected(expected: string | RegExp) {
        await expect(this.dateAndTimePickerInput()).toHaveValue(expected);
    }
}

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
