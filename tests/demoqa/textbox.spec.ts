import { test, expect } from '@playwright/test';
import { TextboxPage } from '../../pages/demoqa/TextBox.ts';
import textbox from '../../test-data/demoqa/textbox.json';
test.describe('TextBox', () => {

    test('Submit success', async ({ page }) => {
        const textboxPage = new TextboxPage(page);
        await textboxPage.goto();
        await textboxPage.fillTextbox(textbox.fullName, textbox.email, textbox.currentAddress, textbox.permanentAddress);
        await textboxPage.submit();
        await expect(page.locator('#output #name')).toContainText(textbox.fullName);
        await expect(page.locator('#output #email')).toContainText(textbox.email);
        await expect(page.locator('#output #currentAddress'))
            .toContainText(textbox.currentAddress);
        await expect(page.locator('#output #permanentAddress')).toContainText(textbox.permanentAddress);
    });

    test('Email invalid', async ({ page }) => {
        const textboxPage = new TextboxPage(page);
        await textboxPage.goto();
        await textboxPage.fillTextbox(textbox.fullName, 'abc123', textbox.currentAddress, textbox.permanentAddress);
        await textboxPage.submit();
        await expect(page.locator('#userEmail')).toHaveClass(/field-error/);
        await expect(page.locator('#output')).toBeHidden();
    });
});