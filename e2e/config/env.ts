import fs from 'node:fs';
import path from 'node:path';

export const env = {
  baseUrl: process.env.E2E_BASE_URL ?? 'http://localhost:4200',
  apiUrl: process.env.E2E_API_URL ?? 'http://localhost:8050/api',
  admin: {
    usuario: process.env.E2E_ADMIN_USER ?? 'snlopezl@rtisas.com.co',
    password: process.env.E2E_ADMIN_PASSWORD ?? 'Clave1234*',
  },
  seedInspector: {
    usuario: process.env.E2E_INSPECTOR_USER ?? 'snlopezl@rtisas.com',
    password: process.env.E2E_INSPECTOR_PASSWORD ?? 'Clave1234*',
  },
  inspectorPassword: 'Inspector123!',
  barcodeSearch: '7702535010341',
  excelFixturePath: 'e2e/fixtures/activos-admin.xlsx',
  excelCruceFixturePath: 'e2e/fixtures/activos-cruce-10.xlsx',
  cruceFixtureMetaPath: 'e2e/fixtures/cruce-fixture-meta.json',
  cruce: {
    editadoMarcaModificada: 'HP-Editado-E2E',
    faltanteIds: ['CRU-F01', 'CRU-F02', 'CRU-F03'],
    resumenEsperado: {
      total: 10,
      cruceNormal: 2,
      editado: 2,
      faltante: 3,
      sobrante: 3,
    },
    estadosTabla: {
      'CRUCE NORMAL': 2,
      EDITADO: 2,
      FALTANTE: 3,
      SOBRANTE: 3,
    },
  },
};

/** Barcodes y SOBRANTE generados por `npm run e2e:fixture:cruce` (únicos por ejecución). */
export function loadCruceFixtureMeta() {
  const metaPath = path.resolve(env.cruceFixtureMetaPath);
  if (!fs.existsSync(metaPath)) {
    throw new Error(
      `No existe ${env.cruceFixtureMetaPath}. Ejecute: npm run e2e:fixture:cruce`
    );
  }
  return JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as {
    normalBarcodes: string[];
    editadoBarcodes: string[];
    sobranteActivos: Array<{ id: string; etiqueta: string; serial: string }>;
    resumenEsperado: typeof env.cruce.resumenEsperado;
    estadosTabla: typeof env.cruce.estadosTabla;
  };
}

export function uniqueTestData() {
  const ts = Date.now();
  return {
    timestamp: ts,
    inspectorEmail: `inspector.e2e.${ts}@rti.com.co`,
    inspectorNombre: `Inspector E2E ${ts}`,
    inventarioCodigo: `INV-E2E-${ts}`,
    inventarioNombre: `Inventario E2E ${ts}`,
    nuevoActivoId: `ACT-E2E-${ts}`,
    nuevoActivoEtiqueta: `7501000${String(ts).slice(-6)}`,
  };
}
