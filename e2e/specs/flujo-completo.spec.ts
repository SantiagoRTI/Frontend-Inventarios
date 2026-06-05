import { test, expect } from '@playwright/test';
import path from 'node:path';
import { env, uniqueTestData } from '../config/env';
import { setupDialogHandler } from '../helpers/dialog.helper';
import { loginAdmin, loginInspector, logout } from '../helpers/auth.helper';
import { captureStep } from '../helpers/screenshot.helper';

const SPEC = 'flujo-completo';
const data = uniqueTestData();

test.describe.serial('Flujo completo Admin + Inspector @TC-001', () => {
  test.beforeEach(({ page }) => {
    setupDialogHandler(page);
  });

  test('TC-001: Journey end-to-end inventario RTI', async ({ page }) => {
    // --- ADMIN: Login ---
    await test.step('01 - Login administrador', async () => {
      await loginAdmin(page);
      await captureStep(page, SPEC, '01-login-admin');
    });

    // --- ADMIN: Crear usuario Inspector ---
    await test.step('02 - Crear usuario inspector', async () => {
      await page.getByRole('link', { name: 'Usuarios' }).click();
      await page.waitForURL('**/admin/usuarios');
      await page.getByRole('button', { name: 'Agregar Usuario' }).click();

      await page.getByPlaceholder('Nombre completo').fill(data.inspectorNombre);
      await page.getByPlaceholder('usuario@rti.com.co').fill(data.inspectorEmail);
      await page.getByPlaceholder('Mínimo 8 caracteres').fill(env.inspectorPassword);
      await page.locator('select[name="rol"]').selectOption('Inspector');
      await page.getByRole('button', { name: 'Guardar' }).click();

      await expect(page.getByRole('cell', { name: data.inspectorEmail })).toBeVisible();
      await captureStep(page, SPEC, '02-usuario-creado');
    });

    // --- ADMIN: Crear inventario ---
    await test.step('03 - Crear inventario', async () => {
      await page.getByRole('link', { name: 'Inventarios' }).click();
      await page.waitForURL('**/admin/inventarios');
      await page.getByRole('button', { name: 'Agregar Inventario' }).click();

      await page.getByPlaceholder('Ej: Inventario Sede Principal 2026').fill(data.inventarioNombre);
      await page.getByPlaceholder('Ej: INV-SP-2026').fill(data.inventarioCodigo);
      await page.locator('select[name="estado"]').selectOption('Ejecucion');
      await page.getByRole('button', { name: 'Guardar' }).click();

      await expect(page.getByRole('cell', { name: data.inventarioCodigo })).toBeVisible();
      await captureStep(page, SPEC, '03-inventario-creado');
    });

    // --- ADMIN: Detalle y subir Excel ---
    await test.step('04 - Abrir detalle del inventario', async () => {
      await page
        .getByRole('row')
        .filter({ hasText: data.inventarioCodigo })
        .getByTitle('Ver')
        .click();
      await page.waitForURL(`**/admin/inventarios/**`);
      await expect(page.getByRole('heading', { name: data.inventarioNombre })).toBeVisible();
      await captureStep(page, SPEC, '04-detalle-inventario');
    });

    await test.step('05 - Subir Excel de activos', async () => {
      const excelPath = path.resolve(env.excelFixturePath);
      await page.getByTestId('upload-excel').locator('input[type="file"]').setInputFiles(excelPath);
      await page.waitForTimeout(1500);
      await captureStep(page, SPEC, '05-excel-subido');
    });

    await test.step('06 - Verificar sección Resultado del Cruce', async () => {
      await expect(page.getByRole('heading', { name: 'Resultado del Cruce' })).toBeVisible();
      const sinCruce = page.getByText('Sin cruce realizado');
      const statsTotal = page.locator('.stat-total .stat-value');
      await expect(sinCruce.or(statsTotal)).toBeVisible();
      await captureStep(page, SPEC, '06-cruce-inicial');
    });

    // --- ADMIN: Logout ---
    await test.step('07 - Cerrar sesión admin', async () => {
      await logout(page);
      await captureStep(page, SPEC, '07-logout-admin');
    });

    // --- INSPECTOR: Login ---
    await test.step('08 - Login inspector', async () => {
      await loginInspector(page, data.inspectorEmail, env.inspectorPassword);
      await captureStep(page, SPEC, '08-login-inspector');
    });

    // --- INSPECTOR: Código inventario ---
    await test.step('09 - Validar código de inventario', async () => {
      await page.locator('#codigo').fill(data.inventarioCodigo);
      await page.getByRole('button', { name: 'Continuar' }).click();
      await page.waitForURL('**/inspector/menu');
      await expect(page.getByRole('heading', { name: 'Menú Principal' })).toBeVisible();
      await captureStep(page, SPEC, '09-codigo-validado');
    });

    // --- INSPECTOR: Digitar código ---
    await test.step('10 - Buscar activo por código', async () => {
      await page.getByTestId('menu-digitar').click();
      await page.waitForURL('**/inspector/digitar');
      await page.locator('#codigo').fill(env.barcodeSearch);
      await page.getByRole('button', { name: 'Buscar Activo' }).click();
      await expect(page.getByRole('heading', { name: 'Activo Encontrado' })).toBeVisible();
      await captureStep(page, SPEC, '10-activo-encontrado');

      await page.getByRole('button', { name: 'Volver' }).first().click();
      await page.waitForURL('**/inspector/menu');
    });

    // --- INSPECTOR: Agregar activo ---
    await test.step('11 - Crear activo nuevo', async () => {
      await page.getByTestId('menu-agregar').click();
      await page.waitForURL('**/inspector/activo');

      await page.locator('#idActivo').fill(data.nuevoActivoId);
      await page.locator('#etiqueta').fill(data.nuevoActivoEtiqueta);
      await page.locator('#descripcion').fill('Activo creado por E2E Playwright');
      await page.locator('#marca').fill('HP');
      await page.locator('#serial').fill(`SER-${data.timestamp}`);
      await page.locator('#modelo').fill('EliteBook E2E');
      await page.locator('#responsable').fill('Inspector E2E');
      await page.locator('#ciudad').fill('Bogota');
      await page.getByRole('button', { name: 'Guardar' }).click();

      await page.waitForURL('**/inspector/menu');
      await captureStep(page, SPEC, '11-activo-creado');
    });

    // --- INSPECTOR: Generar reporte ---
    await test.step('12 - Descargar reporte Excel', async () => {
      await page.getByTestId('menu-reporte').click();
      await page.waitForURL('**/inspector/reporte');

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Descargar Reporte Excel' }).click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toMatch(/\.xlsx$/i);
      await download.saveAs(path.join('e2e', 'reports', 'downloads', download.suggestedFilename()));
      await captureStep(page, SPEC, '12-reporte-descargado');
    });
  });
});
