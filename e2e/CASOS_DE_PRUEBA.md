# Casos de Prueba E2E – Inventarios RTI

Catálogo de pruebas funcionales automatizadas y manuales del frontend Angular.

## Leyenda

| Automatizado | Significado |
|--------------|-------------|
| Sí | Cubierto por Playwright |
| Manual | Requiere intervención humana o hardware |
| Parcial | Automatizado con limitaciones |

---

## Flujo completo (Admin + Inspector)

| ID | Rol | Caso | Precondiciones | Resultado esperado | Automatizado | Spec |
|----|-----|------|----------------|-------------------|--------------|------|
| TC-001 | Admin | Login administrador | Backend y frontend activos | Redirige a `/admin/inventarios` | Sí | `flujo-completo.spec.ts` |
| TC-002 | Admin | Crear usuario Inspector | Sesión admin | Usuario visible en tabla | Sí | `flujo-completo.spec.ts` |
| TC-003 | Admin | Crear inventario | Sesión admin | Inventario con código único en tabla | Sí | `flujo-completo.spec.ts` |
| TC-004 | Admin | Ver detalle inventario | Inventario creado | Muestra nombre y acciones | Sí | `flujo-completo.spec.ts` |
| TC-005 | Admin | Subir Excel activos | Fixture `activos-admin.xlsx` | Alert de éxito, activos cargados | Sí | `flujo-completo.spec.ts` |
| TC-006 | Admin | Ver resultado cruce inicial | Detalle inventario | Sección visible (stats o "Sin cruce") | Sí | `flujo-completo.spec.ts` |
| TC-007 | Admin | Cerrar sesión | Sesión admin | Redirige a `/login` | Sí | `flujo-completo.spec.ts` |
| TC-008 | Inspector | Login inspector creado | Usuario TC-002 | Redirige a `/inspector/codigo-inventario` | Sí | `flujo-completo.spec.ts` |
| TC-009 | Inspector | Validar código inventario | Inventario TC-003 | Redirige a menú principal | Sí | `flujo-completo.spec.ts` |
| TC-010 | Inspector | Digitar código y buscar activo | Excel TC-005 cargado | Muestra "Activo Encontrado" | Sí | `flujo-completo.spec.ts` |
| TC-011 | Inspector | Agregar activo nuevo | Menú inspector | Activo guardado, vuelve al menú | Sí | `flujo-completo.spec.ts` |
| TC-012 | Inspector | Generar y descargar reporte | Activos registrados | Descarga archivo `.xlsx` | Sí | `flujo-completo.spec.ts` |

---

## Autenticación y guards

| ID | Rol | Caso | Resultado esperado | Automatizado | Spec |
|----|-----|------|-------------------|--------------|------|
| TC-A01 | Admin | Login válido | URL `/admin/inventarios` | Sí | `auth.spec.ts` |
| TC-A02 | — | Login inválido | Mensaje `.error-message` | Sí | `auth.spec.ts` |
| TC-A03 | Inspector | Login seed válido | URL `/inspector/codigo-inventario` | Sí | `auth.spec.ts` |
| TC-A04 | — | Acceso admin sin login | Redirige a `/login` | Sí | `auth.spec.ts` |
| TC-A05 | Admin + Inspector | Secuencia login ambos roles con logout | Admin → inventarios; Inspector → código inventario | Sí | `auth.spec.ts` |
| TC-A06 | — | Acceso inspector sin login | Redirige a `/login` | Sí | `auth.spec.ts` |

---

## Casos manuales (no automatizados)

| ID | Rol | Caso | Motivo |
|----|-----|------|--------|
| TC-M01 | Inspector | Escanear código con cámara | Requiere permisos de cámara y hardware |
| TC-M02 | Inspector | Cambiar inventario activo | Confirm dialog + flujo UX |
| TC-M03 | Inspector | Permisos cámara denegados | Simulación de permisos del SO |
| TC-M04 | Admin | Ejecutar cruce + descargar Excel admin | Cubierto por TC-CRU-06 en `cruce-inventario.spec.ts` |
| TC-M05 | Admin | Editar/eliminar usuario e inventario | Modales de confirmación |

---

## Cruce de inventario (10 activos)

Distribución esperada en el resultado del cruce: **2 CRUCE NORMAL + 2 EDITADO + 3 FALTANTE + 3 SOBRANTE = 10 total**.

| ID | Caso | Resultado esperado | Automatizado | Spec |
|----|------|-------------------|--------------|------|
| TC-CRU-01 | Carga Excel 7 activos admin | 7 filas en origen administrador | Sí | `cruce-inventario.spec.ts` |
| TC-CRU-02 | Inspector registra 2 NORMAL | 2 coincidencias exactas | Sí | `cruce-inventario.spec.ts` |
| TC-CRU-03 | Inspector registra 2 EDITADO | 2 con marca distinta al admin | Sí | `cruce-inventario.spec.ts` |
| TC-CRU-04 | 3 activos solo admin | 3 FALTANTE | Sí | `cruce-inventario.spec.ts` |
| TC-CRU-05 | Inspector crea 3 SOBRANTE | 3 no existían en Excel | Sí | `cruce-inventario.spec.ts` |
| TC-CRU-06 | Admin ejecuta cruce | POST `/inventarios/{id}/cruce` OK + descarga `.xlsx` | Sí | `cruce-inventario.spec.ts` |
| TC-CRU-07 | Resumen total = 10 | Stats UI: 10 / 2 / 2 / 3 / 3 | Sí | `cruce-inventario.spec.ts` |
| TC-CRU-08 | Tabla muestra 4 estados | Tags en 10 filas | Sí | `cruce-inventario.spec.ts` |
| TC-CRU-09 | Descarga Excel cruce | Archivo `.xlsx` generado | Sí | `cruce-inventario.spec.ts` |
| TC-CRU-10 | GET activos-cruzados coherente | Mismos conteos que UI | Parcial (vía UI) | `cruce-inventario.spec.ts` |

### Matriz de datos del escenario cruce

| idActivo | etiqueta (barcode) | Acción inspector | Estado esperado |
|----------|-------------------|------------------|-----------------|
| CRU-N01 | 7701000000001 | Digitar → Enviar | CRUCE NORMAL |
| CRU-N02 | 7701000000002 | Digitar → Enviar | CRUCE NORMAL |
| CRU-E01 | 7701000000003 | Digitar → Editar marca → Guardar | EDITADO |
| CRU-E02 | 7701000000004 | Digitar → Editar marca → Guardar | EDITADO |
| CRU-F01 | 7701000000005 | Sin acción | FALTANTE |
| CRU-F02 | 7701000000006 | Sin acción | FALTANTE |
| CRU-F03 | 7701000000007 | Sin acción | FALTANTE |
| SOB-01 | 7701000000101 | Agregar activo nuevo | SOBRANTE |
| SOB-02 | 7701000000102 | Agregar activo nuevo | SOBRANTE |
| SOB-03 | 7701000000103 | Agregar activo nuevo | SOBRANTE |

Fixture: `e2e/fixtures/activos-cruce-10.xlsx` (generado con `npm run e2e:fixture:cruce`).

---

## Datos de prueba

### Fixture Excel (`e2e/fixtures/activos-admin.xlsx`)

Columnas: `ID_ACTIVO`, `ETIQUETA`, `DESCRIPCION`, `MARCA`, `SERIAL`, `MODELO`, `RESPONSABLE`, `CIUDAD`, `ESTADO`

| ID_ACTIVO | ETIQUETA | Uso |
|-----------|----------|-----|
| 112 | 7702535010341 | Búsqueda en "Digitar código" (TC-010) |
| 111–116 | Portatil | Activos adicionales para cruce |

### Credenciales por defecto

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Admin | admin@rti.com.co | Admin123! |
| Inspector seed | carlos.jimenez@rti.com.co | Inspector123! |

Variables de entorno opcionales: `E2E_ADMIN_USER`, `E2E_ADMIN_PASSWORD`, `E2E_INSPECTOR_USER`, `E2E_INSPECTOR_PASSWORD`.

---

## Reportes generados

| Artefacto | Ubicación | Comando |
|-----------|-----------|---------|
| HTML interactivo | `e2e/reports/html/` | `npm run e2e:report` |
| JSON resultados | `e2e/reports/results.json` | Automático al correr tests |
| Resumen Markdown | `e2e/reports/resumen-ejecucion.md` | `npm run e2e:summary` |
| Screenshots por paso | `e2e/reports/screenshots/` | Automático en flujo completo |
| Excel descargado | `e2e/reports/downloads/` | Paso 12 del flujo / TC-CRU-09 |
| Screenshots cruce | `e2e/reports/screenshots/cruce-inventario/` | Automático en spec cruce |
