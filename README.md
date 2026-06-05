# Frontend-Inventarios

Portal web Angular para la gestión de inventarios RTI - Módulo Administrador

## Descripción

Aplicación Angular standalone que implementa el módulo de administración del sistema de inventarios RTI. Incluye gestión completa de usuarios e inventarios, carga de activos desde Excel, cruce de información y generación de reportes.

## Características Implementadas

### Autenticación
- Login con correo y contraseña
- JWT almacenado en localStorage
- Guards de autenticación y autorización
- Interceptores HTTP para agregar token automáticamente

### Módulo Administrador

#### Gestión de Usuarios
- Listar todos los usuarios
- Crear nuevo usuario (Administrador o Inspector)
- Editar información de usuario
- Eliminar usuario
- Tabla reutilizable con acciones

#### Gestión de Inventarios
- Listar todos los inventarios
- Crear nuevo inventario
- Editar inventario existente
- Eliminar inventario
- Ver detalle de inventario
- **Descargar plantilla Excel** para carga de activos
- **Subir Excel con activos** del administrador
- Ver información cargada (activos administrador/inspector)
- **Ejecutar cruce y descargar Excel**: Botón que primero ejecuta POST `/api/inventarios/{id}/cruce` y luego descarga automáticamente el archivo Excel del cruce
- Visualizar resultado del cruce con estadísticas (total, normal, editado, sobrante)
- Tabla de activos cruzados con estados diferenciados por colores

### Componentes Reutilizables (Shared)
- **Toolbar**: Barra superior con logo, título, usuario y botón de cerrar sesión
- **Table**: Tabla genérica con paginación, ordenamiento y acciones personalizables
- **Sidenav**: Menú lateral de navegación
- **Loading**: Indicador de carga global (activado por interceptor)
- **ConfirmDelete**: Modal de confirmación para eliminación

## Requisitos

- Node.js 18.20.8 o superior
- Angular CLI 19.2.25
- Backend en ejecución en `http://localhost:8050`

## Instalación

```bash
# Instalar dependencias
npm install
```

## Configuración

El archivo `src/environments/environment.ts` contiene la configuración para desarrollo:

```typescript
export const environment = {
  production: false,
  REST_API_URL_BASE: 'http://localhost:8050',
  logo: 'assets/logo.png',
  appName: 'Inventarios RTI',
};
```

## Ejecución

```bash
# Servidor de desarrollo (puerto 4200)
ng serve

# Abrir en navegador automáticamente
ng serve --open
```

La aplicación estará disponible en `http://localhost:4200`

## Compilación

```bash
# Compilación de desarrollo
ng build --configuration development

# Compilación de producción
ng build --configuration production
```

Los archivos compilados se generan en `dist/frontend-inventarios/`

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── guards/           # Guards de autenticación y autorización
│   │   ├── interceptors/     # Interceptores HTTP
│   │   └── models/           # Interfaces TypeScript
│   ├── features/
│   │   ├── auth/login/       # Componente de login
│   │   ├── admin/            # Módulo administrador
│   │   │   ├── layout/       # Layout con sidenav y toolbar
│   │   │   ├── usuarios/     # CRUD usuarios
│   │   │   └── inventarios/  # CRUD inventarios y detalle
│   │   └── shared/           # Componentes reutilizables
│   │       ├── components/   # table, toolbar, sidenav, etc.
│   │       └── services/     # Servicios compartidos
│   ├── services/             # Servicios HTTP
│   ├── app.config.ts         # Configuración de la app
│   └── app.routes.ts         # Rutas de la aplicación
├── environments/             # Configuración de entornos
└── assets/                   # Archivos estáticos
```

## Rutas Principales

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/login` | LoginComponent | Pantalla de inicio de sesión |
| `/admin/usuarios` | UsuariosListComponent | Gestión de usuarios |
| `/admin/inventarios` | InventariosListComponent | Listado de inventarios |
| `/admin/inventarios/:id` | InventarioDetailComponent | Detalle del inventario con carga, cruce y descarga |

## Credenciales de Prueba

### Administrador
- Usuario: `admin@rti.com.co`
- Contraseña: `Admin123!`

### Inspector
- Usuario: `carlos.jimenez@rti.com.co`
- Contraseña: `Inspector123!`

## Flujo de Trabajo - Inventario

1. **Login** como administrador
2. **Crear inventario** (Inventarios → Agregar Inventario)
3. **Ingresar al detalle** del inventario
4. **Descargar plantilla Excel** para cargar activos
5. **Llenar la plantilla** con los datos de los activos
6. **Subir Excel** con los activos del administrador
7. Esperar a que el inspector registre activos
8. **Presionar "Información Cargada"** para:
   - Ejecutar el cruce automático (POST `/cruce`)
   - Descargar el Excel con los resultados del cruce
9. **Visualizar resultados** en la tabla de activos cruzados

## Funcionalidad Especial: Botón "Información Cargada"

Este botón implementa una secuencia automática:

```typescript
ejecutarCruceYDescargar(): void {
  // 1. Ejecuta POST /api/inventarios/{id}/cruce
  this.inventarioService.ejecutarCruce(this.inventarioId).subscribe({
    next: (cruceResponse) => {
      // 2. Muestra los resultados en pantalla
      this.resumenCruce.set(cruceResponse.resumen);
      this.activosCruzados.set(cruceResponse.activos);
      
      // 3. Descarga automáticamente el Excel del cruce
      this.inventarioService.descargarCruceExcel(this.inventarioId).subscribe({
        next: (blob) => {
          this.downloadFile(blob, `cruce_inventario_${this.inventarioId}.xlsx`);
        }
      });
    }
  });
}
```

## Tecnologías Utilizadas

- **Angular 19.2.25** (Standalone Components)
- **TypeScript 5.x**
- **PrimeNG 19.x** (componentes UI - solo icons)
- **PrimeFlex** (layout responsive)
- **PrimeIcons** (iconografía)
- **RxJS** (manejo reactivo)
- **Angular Signals** (estado local)
- **SCSS** (estilos)

## Backend

El backend debe estar ejecutándose en `http://localhost:8050`. Ver documentación en `Backend-Inventarios/README.md`

## Diseño UI/UX

El diseño sigue las especificaciones del mockup de Figma:
- [Inventarios — Figma Design](https://www.figma.com/design/Xt3pkCL3TF1RDvvcAGXUiK/Inventarios?node-id=3-1645&t=DJUzuh2EuVfbocHu-0)

## Scripts Disponibles

```bash
# Desarrollo
npm start              # ng serve
ng serve --open        # Abre en navegador

# Compilación
npm run build          # Build de producción
ng build --configuration development

# Testing
npm test               # ng test
ng e2e                 # Tests end-to-end

# Linting
ng lint                # Verificar código
```

## Próximos Pasos

Para implementar el módulo Inspector:
1. Crear componentes en `features/inspector/`
2. Implementar flujo de código de inventario
3. Agregar menú de 4 opciones
4. Implementar escaneo y digitación de códigos
5. Crear formulario de activos
6. Implementar generación de reportes

## Notas Importantes

- El backend debe estar ejecutándose antes de iniciar el frontend
- Los archivos Excel se descargan automáticamente en el navegador
- El token JWT expira según la configuración del backend
- Todos los interceptores están configurados para manejo automático de autenticación y errores
- El loading global se muestra automáticamente en todas las peticiones HTTP

## Autor

Proyecto desarrollado siguiendo las especificaciones de README1.md
