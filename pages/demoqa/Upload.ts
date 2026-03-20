import { expect, Page } from '@playwright/test';
import path from 'path';

export class UploadPage {
    constructor(private page: Page) { }

    // ===== LOCATORS =====
    fileInput = () =>
        this.page.locator('#uploadFile');
    downloadButton = () =>
        this.page.locator('#downloadButton');
    uploadedFilePath = () =>
        this.page.locator('#uploadedFilePath');

    // ===== ACTIONS =====
    async goto() {
        await this.page.goto('/upload-download');
    }

    async uploadFile() {
        await this.fileInput().click();
        const filePath = path.resolve(__dirname, '../../resources/sampleFile.jpeg');
        await this.fileInput().setInputFiles(filePath);
    }

    // ===== ASSERTIONS =====
    async expectUploadFileVisible() {
        await this.uploadedFilePath().waitFor({ state: 'visible' });
        await expect(this.uploadedFilePath()).toContainText('sampleFile.jpeg');
    }
    async expectDownloadSuccess() {
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.downloadButton().click()
        ]);

        // Optional: verify filename
        expect(download.suggestedFilename()).toBe('sampleFile.jpeg');
    }

}