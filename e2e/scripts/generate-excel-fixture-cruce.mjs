import ExcelJS from 'exceljs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'fixtures');
const outputFile = path.join(outputDir, 'activos-cruce-10.xlsx');
const metaFile = path.join(outputDir, 'cruce-fixture-meta.json');

const COLUMNS = [
  'ID_ACTIVO',
  'ETIQUETA',
  'DESCRIPCION',
  'MARCA',
  'SERIAL',
  'MODELO',
  'RESPONSABLE',
  'CIUDAD',
  'ESTADO',
];

/** Genera barcode EAN-13 único por ejecución (13 dígitos). */
function makeBarcode(baseTs, index) {
  const seq = String(index).padStart(3, '0');
  return `770${String(baseTs).slice(-7)}${seq}`.slice(0, 13).padEnd(13, '0');
}

/** 7 filas admin: 2 NORMAL + 2 EDITADO + 3 FALTANTE */
function buildRows(baseTs) {
  return [
    ['CRU-N01', makeBarcode(baseTs, 1), 'Portatil CRU Normal 1', 'Lenovo', 'SER-N01', '2024', 'Inspector E2E', 'Bogota', 'Bueno'],
    ['CRU-N02', makeBarcode(baseTs, 2), 'Portatil CRU Normal 2', 'Lenovo', 'SER-N02', '2024', 'Inspector E2E', 'Bogota', 'Bueno'],
    ['CRU-E01', makeBarcode(baseTs, 3), 'Portatil CRU Editado 1', 'Lenovo', 'SER-E01', '2024', 'Inspector E2E', 'Bogota', 'Bueno'],
    ['CRU-E02', makeBarcode(baseTs, 4), 'Portatil CRU Editado 2', 'Lenovo', 'SER-E02', '2024', 'Inspector E2E', 'Bogota', 'Bueno'],
    ['CRU-F01', makeBarcode(baseTs, 5), 'Portatil CRU Faltante 1', 'Lenovo', 'SER-F01', '2024', 'Inspector E2E', 'Bogota', 'Bueno'],
    ['CRU-F02', makeBarcode(baseTs, 6), 'Portatil CRU Faltante 2', 'Lenovo', 'SER-F02', '2024', 'Inspector E2E', 'Bogota', 'Bueno'],
    ['CRU-F03', makeBarcode(baseTs, 7), 'Portatil CRU Faltante 3', 'Lenovo', 'SER-F03', '2024', 'Inspector E2E', 'Bogota', 'Bueno'],
  ];
}

function buildMeta(rows, baseTs) {
  const barcodes = rows.map((row) => row[1]);
  const sobranteBase = String(baseTs).slice(-7);
  return {
    generatedAt: baseTs,
    normalBarcodes: barcodes.slice(0, 2),
    editadoBarcodes: barcodes.slice(2, 4),
    faltanteIds: rows.slice(4, 7).map((row) => row[0]),
    sobranteActivos: [
      { id: 'SOB-01', etiqueta: `7709${sobranteBase}001`.slice(0, 13).padEnd(13, '0'), serial: 'SER-SOB-01' },
      { id: 'SOB-02', etiqueta: `7709${sobranteBase}002`.slice(0, 13).padEnd(13, '0'), serial: 'SER-SOB-02' },
      { id: 'SOB-03', etiqueta: `7709${sobranteBase}003`.slice(0, 13).padEnd(13, '0'), serial: 'SER-SOB-03' },
    ],
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
  };
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const baseTs = Date.now();
  const rows = buildRows(baseTs);
  const meta = buildMeta(rows, baseTs);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Activos');

  sheet.addRow(COLUMNS);
  rows.forEach((row) => sheet.addRow(row));

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  COLUMNS.forEach((_, index) => {
    sheet.getColumn(index + 1).width = 20;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  await writeFile(outputFile, Buffer.from(buffer));
  await writeFile(metaFile, JSON.stringify(meta, null, 2));

  console.log(`Fixture Excel cruce generado: ${outputFile}`);
  console.log(`Meta cruce generado: ${metaFile}`);
  console.log(`Filas admin: ${rows.length} (2 NORMAL + 2 EDITADO + 3 FALTANTE)`);
  console.log('Inspector debe crear 3 SOBRANTE (SOB-01..03) para total 10 en cruce');
}

main().catch((error) => {
  console.error('Error generando fixture cruce:', error);
  process.exit(1);
});
