import ExcelJS from 'exceljs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'fixtures');
const outputFile = path.join(outputDir, 'activos-admin.xlsx');

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

const ROWS = [
  ['112', '7702535010341', 'Computador', 'Lenovo', 'BMDJSBAD', '2025', 'Santiago Lopez', 'Bogota', 'Bueno'],
  ['111', 'Portatil', 'Computador', 'Lenovo', 'BMDJSBAD', '2020', 'Santiago Lopez', 'Bogota', 'Bueno'],
  ['113', 'Portatil', 'Computador', 'Lenovo', 'BMDJSBAD', '2022', 'Santiago Lopez', 'Bogota', 'Bueno'],
  ['114', 'Portatil', 'Computador', 'Lenovo', 'BMDJSBAD', '2023', 'Santiago Lopez', 'Bogota', 'Bueno'],
  ['115', 'Portatil', 'Computador', 'Lenovo', 'BMDJSBAD', '2024', 'Santiago Lopez', 'Bogota', 'Bueno'],
  ['116', 'Portatil', 'Computador', 'Lenovo', 'BMDJSBAD', '2025', 'Santiago Lopez', 'Bogota', 'Bueno'],
];

async function main() {
  await mkdir(outputDir, { recursive: true });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Activos');

  sheet.addRow(COLUMNS);
  ROWS.forEach((row) => sheet.addRow(row));

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  COLUMNS.forEach((_, index) => {
    sheet.getColumn(index + 1).width = 18;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  await writeFile(outputFile, Buffer.from(buffer));

  console.log(`Fixture Excel generado: ${outputFile}`);
  console.log(`Filas de datos: ${ROWS.length}`);
}

main().catch((error) => {
  console.error('Error generando fixture Excel:', error);
  process.exit(1);
});
