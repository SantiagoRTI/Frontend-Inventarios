import { expect, type Page } from '@playwright/test';

export interface ResumenCruceEsperado {
  total: number;
  cruceNormal: number;
  editado: number;
  faltante: number;
  sobrante: number;
}

export async function assertResumenCruce(page: Page, esperado: ResumenCruceEsperado): Promise<void> {
  await expect(page.getByTestId('stat-total')).toHaveText(String(esperado.total));
  await expect(page.getByTestId('stat-normal')).toHaveText(String(esperado.cruceNormal));
  await expect(page.getByTestId('stat-editado')).toHaveText(String(esperado.editado));
  await expect(page.getByTestId('stat-faltante')).toHaveText(String(esperado.faltante));
  await expect(page.getByTestId('stat-sobrante')).toHaveText(String(esperado.sobrante));
}

export async function assertEstadosEnTabla(
  page: Page,
  conteos: Record<string, number>
): Promise<void> {
  const rows = page.locator('.data-table tbody tr');
  await expect(rows).toHaveCount(
    Object.values(conteos).reduce((sum, n) => sum + n, 0)
  );

  for (const [estado, cantidad] of Object.entries(conteos)) {
    const filasEstado = rows.filter({
      has: page.locator('.tag', { hasText: new RegExp(estado, 'i') }),
    });
    await expect(filasEstado).toHaveCount(cantidad);
  }
}

export async function irDigitarDesdeMenu(page: Page): Promise<void> {
  await page.getByTestId('menu-digitar').click();
  await page.waitForURL('**/inspector/digitar');
}

export async function buscarActivoPorCodigo(page: Page, barcode: string): Promise<void> {
  await page.locator('#codigo').fill(barcode);
  await page.getByRole('button', { name: 'Buscar Activo' }).click();
  await expect(page.getByRole('heading', { name: 'Activo Encontrado' })).toBeVisible();
}

export async function enviarActivoEncontrado(page: Page): Promise<void> {
  await page.getByTestId('btn-enviar-activo').click();
  await page.waitForURL('**/inspector/menu');
}

export async function editarActivoEncontrado(page: Page, nuevaMarca: string): Promise<void> {
  await page.getByRole('button', { name: 'Editar' }).click();
  await page.waitForURL('**/inspector/activo');
  await page.locator('#marca').fill(nuevaMarca);
  await page.getByRole('button', { name: 'Actualizar' }).click();
  await page.waitForURL('**/inspector/menu');
}

export async function agregarActivoSobrante(
  page: Page,
  idActivo: string,
  etiqueta: string,
  serial: string
): Promise<void> {
  await page.getByTestId('menu-agregar').click();
  await page.waitForURL('**/inspector/activo');

  await page.locator('#idActivo').fill(idActivo);
  await page.locator('#etiqueta').fill(etiqueta);
  await page.locator('#descripcion').fill(`Activo sobrante ${idActivo}`);
  await page.locator('#marca').fill('Dell');
  await page.locator('#serial').fill(serial);
  await page.locator('#modelo').fill('Latitude E2E');
  await page.locator('#responsable').fill('Inspector E2E');
  await page.locator('#ciudad').fill('Bogota');
  await page.getByRole('button', { name: 'Guardar' }).click();

  await page.waitForURL('**/inspector/menu');
}
