import type { Page } from '@playwright/test';
import { env } from '../config/env';

async function assertLoginSuccess(page: Page, expectedUrl: RegExp | string, role: string): Promise<void> {
  const errorLocator = page.locator('.error-message');
  const hasError = await errorLocator.isVisible().catch(() => false);

  if (hasError) {
    const message = (await errorLocator.textContent())?.trim() || 'Error desconocido';
    throw new Error(
      `Login ${role} falló: "${message}". ` +
        `Verifique que el backend tenga datos seed y credenciales en e2e/config/env.ts`
    );
  }

  await page.waitForURL(expectedUrl, { timeout: 30_000 });
}

export async function loginAdmin(page: Page): Promise<void> {
  await page.goto('/login');
  await page.locator('#usuario').fill(env.admin.usuario);
  await page.locator('#password').fill(env.admin.password);
  await page.getByTestId('login-submit').click();
  await assertLoginSuccess(page, /\/admin\/inventarios/, 'admin');
}

export async function loginInspector(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.locator('#usuario').fill(email);
  await page.locator('#password').fill(password);
  await page.getByTestId('login-submit').click();
  await assertLoginSuccess(page, /\/inspector\/codigo-inventario/, 'inspector');
}

export async function logout(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await page.waitForURL(/\/login/);
}
