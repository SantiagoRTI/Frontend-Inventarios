# Pruebas E2E con Playwright – Inventarios RTI

Automatización funcional del frontend Angular (Admin + Inspector).

## Prerrequisitos

1. **Backend** corriendo en `http://localhost:8050`
2. **Node.js** 18+ instalado
3. Dependencias instaladas: `npm install`
4. Navegador Chromium de Playwright: `npx playwright install chromium`

## Comandos por suite

| Comando | Specs ejecutados | Fixtures | Duración aprox. |
|---------|------------------|----------|-----------------|
| `npm run e2e:auth` | `auth.spec.ts` (TC-A01–A06) | — | ~10 s |
| `npm run e2e:flujo-completo` | `flujo-completo.spec.ts` (TC-001–012) | `activos-admin.xlsx` | ~30 s |
| `npm run e2e:cruce` | `cruce-inventario.spec.ts` (TC-CRU-01–10) | `activos-cruce-10.xlsx` | ~45 s |
| **`npm run e2e:all`** | **Todos los specs** | **Ambos Excel** | **~2 min** |
| `npm run e2e` | Alias de `e2e:all` | Ambos Excel | ~2 min |

```bash
# Terminal 1: backend en puerto 8050

# Terminal 2: ejecutar suite deseada
cd Frontend-Inventarios
npm run e2e:auth              # Solo autenticación (2 roles)
npm run e2e:flujo-completo    # Journey admin + inspector
npm run e2e:cruce             # Cruce 10 activos (4 estados)
npm run e2e:all               # Todos los casos
```

## Otros comandos

| Comando | Descripción |
|---------|-------------|
| `npm run e2e:fixture` | Genera `activos-admin.xlsx` |
| `npm run e2e:fixture:cruce` | Genera `activos-cruce-10.xlsx` + meta JSON |
| `npm run e2e:ui` | Modo UI interactivo de Playwright |
| `npm run e2e:report` | Abre reporte HTML |
| `npm run e2e:summary` | Genera `resumen-ejecucion.md` desde JSON |

## Estructura

```
e2e/
├── config/env.ts           # URLs y credenciales
├── fixtures/               # Excel generado
├── helpers/                # Auth, dialogs, screenshots, cruce
├── scripts/                # Generadores Excel y resumen
├── specs/
│   ├── auth.spec.ts        # TC-A01 a TC-A06
│   ├── flujo-completo.spec.ts  # TC-001 a TC-012
│   └── cruce-inventario.spec.ts  # TC-CRU-01 a TC-CRU-10
├── CASOS_DE_PRUEBA.md      # Catálogo de casos
└── reports/                # Salida (HTML, JSON, screenshots)
```

## Variables de entorno

```bash
E2E_BASE_URL=http://localhost:4200
E2E_API_URL=http://localhost:8050/api
E2E_ADMIN_USER=admin@rti.com.co
E2E_ADMIN_PASSWORD=Admin123!
E2E_INSPECTOR_USER=carlos.jimenez@rti.com.co
E2E_INSPECTOR_PASSWORD=Inspector123!
```

## Reportes y video

| Artefacto | Ubicación | Cómo verlo |
|-----------|-----------|------------|
| Reporte HTML | `e2e/reports/html/` | `npm run e2e:report` |
| Video de la prueba | Adjunto en reporte HTML | Abrir el caso → **Attachments** → `video.webm` |
| Screenshots por paso | `e2e/reports/screenshots/` | Automático en cada `captureStep` |
| Resumen Markdown | `e2e/reports/resumen-ejecucion.md` | `npm run e2e:summary` |

Playwright graba video en todas las ejecuciones (`video: 'on'` en `playwright.config.ts`).

## Solución de problemas

| Problema | Solución |
|----------|----------|
| Backend no accesible | Verificar que corre en puerto 8050 |
| Login inspector seed falla (TC-A03, TC-A05) | Usuario seed debe existir en BD; credenciales en `e2e/config/env.ts` |
| Timeout en ng serve | Aumentar `webServer.timeout` en `playwright.config.ts` |
| Alert bloquea test | Ya manejado en `dialog.helper.ts` |
| Cruce falla sin meta JSON | Ejecutar `npm run e2e:fixture:cruce` antes del spec |

Ver catálogo completo en [CASOS_DE_PRUEBA.md](./CASOS_DE_PRUEBA.md).
