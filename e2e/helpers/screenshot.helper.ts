import type { Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export async function captureStep(
  page: Page,
  specName: string,
  stepName: string
): Promise<string> {
  const dir = path.join('e2e', 'reports', 'screenshots', specName);
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${stepName}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}
