import { test, expect } from '@playwright/test';
import path from 'node:path';
import { env, uniqueTestData, loadCruceFixtureMeta } from '../config/env';
import { setupDialogHandler } from '../helpers/dialog.helper';
import { loginAdmin, loginInspector, logout } from '../helpers/auth.helper';
import { captureStep } from '../helpers/screenshot.helper';
import {
  assertResumenCruce,
  assertEstadosEnTabla,
  irDigitarDesdeMenu,
  buscarActivoPorCodigo,
  enviarActivoEncontrado,
  editarActivoEncontrado,
  agregarActivoSobrante,
} from '../helpers/cruce.helper';

const SPEC = 'cruce-inventario';
const data = uniqueTestData();
const cruceMeta = loadCruceFixtureMeta();

test.describe.serial('Cruce de inventario – 10 activos @TC-CRU', () => {
  test.setTimeout(120_000);

  test.beforeEach(({ page }) => {
    setupDialogHandler(page);
  });

  test('TC-CRU-01..10: Journey cruce con 4 estados', async ({ page }) => {
    await test.step('01 - Login admin y crear inspector + inventario', async () => {
      await loginAdmin(page);

      await page.getByRole('link', { name: 'Usuarios' }).click();
      await page.waitForURL('**/admin/usuarios');
      await page.getByRole('button', { name: 'Agregar Usuario' }).click();
      await page.getByPlaceholder('Nombre completo').fill(data.inspectorNombre);
      await page.getByPlaceholder('usuario@rti.com.co').fill(data.inspectorEmail);
      await page.getByPlaceholder('Mínimo 8 caracteres').fill(env.inspectorPassword);
      await page.locator('select[name="rol"]').selectOption('Inspector');
      await page.getByRole('button', { name: 'Guardar' }).click();
      await expect(page.getByRole('cell', { name: data.inspectorEmail })).toBeVisible();

      await page.getByRole('link', { name: 'Inventarios' }).click();
      await page.waitForURL('**/admin/inventarios');
      await page.getByRole('button', { name: 'Agregar Inventario' }).click();
      await page.getByPlaceholder('Ej: Inventario Sede Principal 2026').fill(data.inventarioNombre);
      await page.getByPlaceholder('Ej: INV-SP-2026').fill(data.inventarioCodigo);
      await page.locator('select[name="estado"]').selectOption('Ejecucion');
      await page.getByRole('button', { name: 'Guardar' }).click();
      await expect(page.getByRole('cell', { name: data.inventarioCodigo })).toBeVisible();

      await captureStep(page, SPEC, '01-admin-setup');
    });

    await test.step('02 - Subir Excel cruce (7 activos admin)', async () => {
      await page
        .getByRole('row')
        .filter({ hasText: data.inventarioCodigo })
        .getByTitle('Ver')
        .click();
      await page.waitForURL('**/admin/inventarios/**');
      await expect(page.getByRole('heading', { name: data.inventarioNombre })).toBeVisible();

      const excelPath = path.resolve(env.excelCruceFixturePath);
      await page.getByTestId('upload-excel').locator('input[type="file"]').setInputFiles(excelPath);
      await page.waitForTimeout(1500);
      await captureStep(page, SPEC, '02-excel-cruce-subido');
    });

    await test.step('03 - Logout admin; login inspector; validar código', async () => {
      await logout(page);
      await loginInspector(page, data.inspectorEmail, env.inspectorPassword);

      await page.locator('#codigo').fill(data.inventarioCodigo);
      await page.getByRole('button', { name: 'Continuar' }).click();
      await page.waitForURL('**/inspector/menu');
      await captureStep(page, SPEC, '03-inspector-menu');
    });

    await test.step('04 - CRUCE NORMAL x2: digitar y enviar', async () => {
      for (const barcode of cruceMeta.normalBarcodes) {
        await irDigitarDesdeMenu(page);
        await buscarActivoPorCodigo(page, barcode);
        await enviarActivoEncontrado(page);
      }
      await captureStep(page, SPEC, '04-normal-x2');
    });

    await test.step('05 - EDITADO x2: digitar, editar marca y guardar', async () => {
      for (const barcode of cruceMeta.editadoBarcodes) {
        await irDigitarDesdeMenu(page);
        await buscarActivoPorCodigo(page, barcode);
        await editarActivoEncontrado(page, env.cruce.editadoMarcaModificada);
      }
      await captureStep(page, SPEC, '05-editado-x2');
    });

    await test.step('06 - SOBRANTE x3: agregar activos nuevos', async () => {
      for (const activo of cruceMeta.sobranteActivos) {
        await agregarActivoSobrante(page, activo.id, activo.etiqueta, activo.serial);
      }
      await captureStep(page, SPEC, '06-sobrante-x3');
    });

    await test.step('07 - FALTANTE x3: sin acción sobre CRU-F01..03', async () => {
      await expect(page.getByRole('heading', { name: 'Menú Principal' })).toBeVisible();
      await captureStep(page, SPEC, '07-faltante-sin-registro');
    });

    await test.step('08 - Logout inspector; login admin; abrir detalle', async () => {
      await logout(page);
      await loginAdmin(page);

      await page.getByRole('link', { name: 'Inventarios' }).click();
      await page.waitForURL('**/admin/inventarios');
      await page
        .getByRole('row')
        .filter({ hasText: data.inventarioCodigo })
        .getByTitle('Ver')
        .click();
      await page.waitForURL('**/admin/inventarios/**');
      await captureStep(page, SPEC, '08-admin-detalle');
    });

    await test.step('09 - Ejecutar cruce (Información Cargada)', async () => {
      const downloadPromise = page.waitForEvent('download');
      await page.getByTestId('ejecutar-cruce').click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toMatch(/\.xlsx$/i);
      await download.saveAs(
        path.join('e2e', 'reports', 'downloads', `cruce-${data.timestamp}.xlsx`)
      );

      await expect(page.getByTestId('stat-total')).toBeVisible({ timeout: 30_000 });
      await captureStep(page, SPEC, '09-cruce-ejecutado');
    });

    await test.step('10 - Validar resumen y tabla del cruce', async () => {
      await expect(page.getByTestId('stat-normal')).toHaveText('2', { timeout: 30_000 });
      await assertResumenCruce(page, cruceMeta.resumenEsperado);
      await assertEstadosEnTabla(page, cruceMeta.estadosTabla);
      await captureStep(page, SPEC, '10-resultado-cruce');
    });
  });
});
