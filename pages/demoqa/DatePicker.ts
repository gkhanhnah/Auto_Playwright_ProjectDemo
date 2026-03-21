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

function timeLabelMatchCandidates(timeLabel: string): RegExp[] {
    const t = timeLabel.trim().replace(/\s+/g, ' ');
    const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    const out: RegExp[] = [];

    out.push(new RegExp(`^\\s*${escapeRegex(t)}\\s*$`, 'i'));

    if (m) {
        let h = Number(m[1]);
        const min = m[2];
        const ap = m[3].toUpperCase();
        if (ap === 'PM' && h !== 12) {
            h += 12;
        }
        if (ap === 'AM' && h === 12) {
            h = 0;
        }
        const hh = h.toString().padStart(2, '0');
        out.push(new RegExp(`^\\s*${hh}:${min}\\s*$`));
        out.push(new RegExp(`^\\s*${h}:${min}\\s*$`));
    }

    return out;
}

export class DatePickerPage {
    constructor(private page: Page) { }

    datePicker = () => this.page.locator('#datePickerMonthYearInput');
    dateAndTimePickerInput = () => this.page.locator('#dateAndTimePickerInput');

    private dateTimeCalendarPopup(): Locator {
        return this.page
            .locator('.react-datepicker:has(.react-datepicker__time-container)')
            .last();
    }

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
        const monthName = MONTH_NAMES[monthIndex];
        const dayOrd = dayWithOrdinal(day);

        await this.dateAndTimePickerInput().click();

        const calendar = this.dateTimeCalendarPopup();
        await calendar.waitFor({ state: 'visible', timeout: 15_000 });

        await this.navigateToMonth(calendar, year, monthIndex);

        await calendar
            .locator(`[aria-label*="${monthName} ${dayOrd}, ${year}"]`)
            .click();

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
        await timeList.waitFor({ state: 'visible', timeout: 15_000 });

        const items = timeList.locator('.react-datepicker__time-list-item');
        const patterns = timeLabelMatchCandidates(timeLabel);

        for (const re of patterns) {
            const candidate = items.filter({ hasText: re });
            if ((await candidate.count()) === 0) {
                continue;
            }
            const item = candidate.first();
            await item.scrollIntoViewIfNeeded();
            await item.click();
            return;
        }

        throw new Error(
            `No time list item matched "${timeLabel}" (tried 12h and 24h). ` +
                `DemoQA uses 15‑minute steps and 24h labels like 15:30 — pick a slot that exists.`,
        );
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

    async expectDateSelected(expected: string | RegExp) {
        await expect(this.datePicker()).toHaveValue(expected);
    }

    async expectDateAndTimeSelected(expected: string | RegExp) {
        await expect(this.dateAndTimePickerInput()).toHaveValue(expected);
    }
}

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
