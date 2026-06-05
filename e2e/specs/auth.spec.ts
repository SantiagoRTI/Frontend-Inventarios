import { test, expect } from '@playwright/test';
import { env } from '../config/env';
import { setupDialogHandler } from '../helpers/dialog.helper';
import { loginAdmin, loginInspector, logout } from '../helpers/auth.helper';

test.describe('Autenticación y guards @auth', () => {
  test.beforeEach(({ page }) => {
    setupDialogHandler(page);
  });

  test('TC-A01: Login admin válido redirige a inventarios', async ({ page }) => {
    await loginAdmin(page);
    await expect(page).toHaveURL(/\/admin\/inventarios/);
  });

  test('TC-A02: Login con credenciales inválidas muestra error', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#usuario').fill('invalido@rti.com.co');
    await page.locator('#password').fill('WrongPassword123!');
    await page.getByTestId('login-submit').click();

    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-A03: Login inspector seed redirige a código inventario', async ({ page }) => {
    await loginInspector(page, env.seedInspector.usuario, env.seedInspector.password);
    await expect(page).toHaveURL(/\/inspector\/codigo-inventario/);
  });

  test('TC-A04: Acceso a admin sin login redirige a login', async ({ page }) => {
    await page.goto('/admin/inventarios');
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-A05: Secuencia autenticación Admin e Inspector con logout', async ({ page }) => {
    await test.step('Login admin y verificar área administrativa', async () => {
      await loginAdmin(page);
      await expect(page.getByRole('link', { name: 'Inventarios' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Usuarios' })).toBeVisible();
    });

    await test.step('Logout admin', async () => {
      await logout(page);
      await expect(page).toHaveURL(/\/login/);
    });

    await test.step('Login inspector y verificar área inspector', async () => {
      await loginInspector(page, env.seedInspector.usuario, env.seedInspector.password);
      await expect(page).toHaveURL(/\/inspector\/codigo-inventario/);
      await expect(page.locator('#codigo')).toBeVisible();
    });

    await test.step('Logout inspector', async () => {
      await logout(page);
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test('TC-A06: Acceso a inspector sin login redirige a login', async ({ page }) => {
    await page.goto('/inspector/codigo-inventario');
    await expect(page).toHaveURL(/\/login/);
  });
});
