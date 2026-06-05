import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resultsPath = path.join(__dirname, '..', 'reports', 'results.json');
const outputPath = path.join(__dirname, '..', 'reports', 'resumen-ejecucion.md');

function collectTests(suite, prefix, results) {
  const title = prefix ? `${prefix} › ${suite.title}` : suite.title;

  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      results.push({
        ...test,
        title: `${title} › ${spec.title} › ${test.title}`.replace(/^ › /, ''),
      });
    }
  }

  for (const child of suite.suites ?? []) {
    collectTests(child, title, results);
  }
}

function flattenResults(report) {
  const results = [];
  for (const suite of report.suites ?? []) {
    collectTests(suite, '', results);
  }
  return results;
}

function main() {
  if (!fs.existsSync(resultsPath)) {
    console.error(`No se encontró ${resultsPath}. Ejecute primero: npm run e2e`);
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  const results = flattenResults(report);

  const passed = results.filter((r) => r.status === 'expected' || r.status === 'passed').length;
  const failed = results.filter((r) => r.status === 'failed' || r.status === 'unexpected').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const total = results.length;

  const lines = [
    '# Resumen de ejecución E2E',
    '',
    `Fecha: ${new Date().toISOString()}`,
    '',
    '| Métrica | Valor |',
    '|---------|-------|',
    `| Total | ${total} |`,
    `| Exitosos | ${passed} |`,
    `| Fallidos | ${failed} |`,
    `| Omitidos | ${skipped} |`,
    '',
    '## Detalle por caso',
    '',
    '| Caso | Estado | Duración (ms) |',
    '|------|--------|---------------|',
  ];

  for (const result of results) {
    const status =
      result.status === 'expected' || result.status === 'passed' ? 'PASS' : result.status.toUpperCase();
    lines.push(`| ${result.title.replace(/\|/g, '\\|')} | ${status} | ${Math.round(result.duration)} |`);
  }

  if (failed > 0) {
    lines.push('', '## Errores', '');
    for (const result of results.filter((r) => r.status === 'failed' || r.status === 'unexpected')) {
      lines.push(`### ${result.title}`);
      lines.push('');
      lines.push('```');
      lines.push(result.errors?.[0]?.message ?? 'Sin mensaje de error');
      lines.push('```');
      lines.push('');
    }
  }

  lines.push('', '## Screenshots', '');
  lines.push('Capturas por paso en `e2e/reports/screenshots/`.');
  lines.push('', '## Video', '');
  lines.push('Grabación de cada prueba en el reporte HTML (`npm run e2e:report`).');
  lines.push('', '## Reporte HTML', '');
  lines.push('Ver detalle completo: `npm run e2e:report`');

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, lines.join('\n'));

  console.log(`Resumen generado: ${outputPath}`);
  console.log(`PASS: ${passed} | FAIL: ${failed} | SKIP: ${skipped}`);
}

main();
