import type { Page } from '@playwright/test';

export function setupDialogHandler(page: Page): void {
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });
}
