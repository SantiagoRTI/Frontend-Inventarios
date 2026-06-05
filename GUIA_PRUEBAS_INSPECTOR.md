# 🧪 Guía de Pruebas - Módulo Inspector

## 🚀 Cómo Iniciar el Frontend

```bash
cd Frontend-Inventarios
npm start
```

O para desarrollo:
```bash
ng serve
```

La aplicación estará en: `http://localhost:4200`

---

## 📋 Checklist de Pruebas

### ✅ 1. Login Inspector

**URL**: `http://localhost:4200/login`

**Credenciales de prueba** (según Postman collection):
```
Usuario: carlos.jimenez@rti.com.co
Contraseña: Inspector123!
```

**Verificar**:
- [ ] Input de usuario y contraseña funcionan
- [ ] Botón de mostrar/ocultar contraseña funciona
- [ ] Al hacer clic en "Iniciar Sesión" se muestra loading
- [ ] Redirige automáticamente a `/inspector/codigo-inventario`

---

### ✅ 2. Código de Inventario

**URL**: `http://localhost:4200/inspector/codigo-inventario`

**Código de prueba** (según Postman collection):
```
INV-BN-2026
```

**Verificar**:
- [ ] Se muestra el logo RTI
- [ ] Card con input de código centrado
- [ ] Al ingresar código y dar "Continuar" se valida con el backend
- [ ] Si el código es válido, redirige a `/inspector/menu`
- [ ] Si el código es inválido, muestra mensaje de error
- [ ] Si vuelve a `/inspector/codigo-inventario` con código ya guardado, redirige automáticamente

---

### ✅ 3. Menú Principal

**URL**: `http://localhost:4200/inspector/menu`

**Verificar**:
- [ ] Se muestra el toolbar con el nombre del inventario
- [ ] Se muestran 4 botones con iconos:
  - Escanear Código (icono cámara)
  - Digitar Código (icono teclado)
  - Agregar Activo (icono plus)
  - Generar Reporte (icono archivo)
- [ ] Todos los botones tienen hover effect
- [ ] Al hacer clic en cada botón navega correctamente
- [ ] **Responsive**: En móvil los botones se apilan en 1 columna
- [ ] Botón "Cerrar Sesión" funciona y limpia el estado

---

### ✅ 4. Escanear Código (Scanner)

**URL**: `http://localhost:4200/inspector/escanear`

#### A. Activación de Cámara

**Verificar**:
- [ ] Al cargar, muestra botón "Activar Cámara"
- [ ] Al hacer clic, solicita permisos de cámara
- [ ] Si acepta permisos, se activa la cámara
- [ ] Se muestra preview de video
- [ ] Se muestra línea de escaneo animada
- [ ] Se muestra texto "Coloque el código de barras dentro del marco"

#### B. Cambio de Cámara

**Verificar**:
- [ ] Si tiene múltiples cámaras (frontal/trasera)
- [ ] Botón "Cambiar cámara" aparece
- [ ] Al hacer clic, cambia entre cámaras

#### C. Escaneo de Código

**Códigos de prueba**:
- EAN-13: `7501000111800` (según Postman collection)
- Cualquier código de producto con código de barras

**Verificar**:
- [ ] Al escanear código válido, se muestra "Código detectado"
- [ ] Se desactiva el scanner automáticamente
- [ ] Se hace búsqueda GET `/api/activos/barcode/{codigo}`
- [ ] Si encuentra el activo, muestra los datos
- [ ] Muestra 2 botones: "Editar" y "Enviar"

#### D. Opciones de Activo

**Opción 1: Enviar**
- [ ] Al hacer clic en "Enviar", muestra confirmación
- [ ] POST `/api/activos` con los datos recibidos + inventarioId
- [ ] Muestra mensaje de éxito
- [ ] Redirige al menú principal

**Opción 2: Editar**
- [ ] Al hacer clic en "Editar", navega a `/inspector/activo`
- [ ] Formulario se llena con los datos
- [ ] Campo `idActivo` está deshabilitado
- [ ] Puede editar otros campos
- [ ] Al guardar, POST `/api/activos` con datos editados

#### E. Activo No Encontrado

**Verificar**:
- [ ] Si el código no existe en el backend
- [ ] Muestra mensaje "Activo no encontrado"
- [ ] Botón "Reintentar" para escanear de nuevo

---

### ✅ 5. Digitar Código

**URL**: `http://localhost:4200/inspector/digitar`

**Código de prueba**: `7501000111800`

**Verificar**:
- [ ] Input de texto para código
- [ ] Botón "Buscar Activo"
- [ ] Al ingresar código y buscar, hace GET `/api/activos/barcode/{codigo}`
- [ ] Comportamiento idéntico a "Escanear" (opciones Editar/Enviar)
- [ ] Si código inválido, muestra error
- [ ] Botón "Reintentar" limpia el input

---

### ✅ 6. Agregar Activo

**URL**: `http://localhost:4200/inspector/agregar`

**Verificar**:
- [ ] Muestra loading "Cargando formulario..."
- [ ] Redirige automáticamente a `/inspector/activo`
- [ ] Formulario está completamente vacío
- [ ] Todos los campos son editables
- [ ] Título: "Registrar Activo"

---

### ✅ 7. Formulario de Activo

**URL**: `http://localhost:4200/inspector/activo`

#### A. Campos del Formulario

**Campos requeridos (*):**
- [ ] ID Activo (input text)
- [ ] Etiqueta / Código de Barras (input text)
- [ ] Descripción (input text)
- [ ] Marca (input text)
- [ ] Serial (input text)
- [ ] Modelo (input text)

**Campos opcionales:**
- [ ] Responsable (input text)
- [ ] Ciudad (input text)
- [ ] Estado (select: Bueno/Regular/Malo)

#### B. Validaciones

**Verificar**:
- [ ] Campos requeridos marcan error si están vacíos
- [ ] Mensajes de error aparecen al tocar el campo
- [ ] Longitud mínima/máxima se valida
- [ ] Al enviar con errores, se muestran todos los mensajes

#### C. Modo Creación

**Datos de prueba**:
```
ID Activo: ACT-TEST-001
Etiqueta: 7501000999999
Descripción: Portátil de prueba
Marca: HP
Serial: SER123456
Modelo: EliteBook 840
Responsable: Juan Pérez
Ciudad: Bogotá
Estado: Bueno
```

**Verificar**:
- [ ] Título: "Registrar Activo"
- [ ] Todos los campos editables
- [ ] Al guardar, POST `/api/activos` con inventarioId
- [ ] Muestra loading overlay
- [ ] Si éxito, mensaje y redirige a menú
- [ ] Si error, muestra mensaje de error

#### D. Modo Edición

**Verificar** (al venir desde Escanear/Digitar):
- [ ] Título: "Editar Activo"
- [ ] Campo `idActivo` está deshabilitado (fondo gris)
- [ ] Mensaje: "El ID del activo no se puede modificar"
- [ ] Otros campos editables
- [ ] Al guardar, POST `/api/activos` con valores editados

#### E. Botones

**Verificar**:
- [ ] Botón "Volver" navega a menú sin guardar
- [ ] Botón "Cancelar" pide confirmación
- [ ] Botón "Guardar" deshabilitado durante loading
- [ ] Animación de loading en botón

---

### ✅ 8. Generar Reporte

**URL**: `http://localhost:4200/inspector/reporte`

**Verificar**:
- [ ] Card morada con información del inventario
  - Nombre
  - Código
  - Estado
- [ ] Descripción del reporte Excel
- [ ] Lista de tipos de cruce (Normal, Editado, Sobrante)
- [ ] Botón grande "Descargar Reporte Excel"
- [ ] Al hacer clic:
  - Muestra loading overlay
  - "Generando reporte..."
  - "Esto puede tomar unos segundos"
- [ ] GET `/api/inventarios/{id}/cruce/excel` (blob)
- [ ] Archivo Excel se descarga automáticamente
- [ ] Nombre: `reporte_inventario_{id}_{timestamp}.xlsx`
- [ ] Botón cambia a verde con checkmark
- [ ] Texto: "¡Descargado Exitosamente!"

---

### ✅ 9. Toolbar (Todas las Páginas)

**Verificar en cualquier página del inspector**:
- [ ] Fondo rojo (#BE1E2D)
- [ ] Logo RTI a la izquierda
- [ ] Título "Inspector de Inventarios"
- [ ] Subtítulo con nombre del inventario (si aplica)
- [ ] Botón "Cerrar Sesión" a la derecha
- [ ] Al hacer clic en "Cerrar Sesión":
  - Limpia sessionStorage
  - Limpia AuthService
  - Redirige a `/login`

---

### ✅ 10. Responsive Design

#### A. Desktop (> 1024px)

**Verificar**:
- [ ] Menú principal: 4 columnas
- [ ] Formulario: 2 columnas
- [ ] Máximo 900px de ancho centrado

#### B. Tablet (768px - 1024px)

**Verificar**:
- [ ] Menú principal: 2 columnas
- [ ] Formulario: 2 columnas
- [ ] Toolbar compacto

#### C. Móvil (< 768px)

**Verificar**:
- [ ] Menú principal: 1 columna (botones apilados)
- [ ] Formulario: 1 columna
- [ ] Scanner ocupa todo el ancho
- [ ] Botones de acción apilados

#### D. Móvil Pequeño (< 480px)

**Verificar**:
- [ ] Todo en 1 columna
- [ ] Padding reducido
- [ ] Fuentes más pequeñas
- [ ] Botones full-width

---

### ✅ 11. Persistencia de Estado

**Verificar**:
- [ ] Al refrescar página (F5) en cualquier ruta inspector:
  - Mantiene sesión activa
  - Mantiene código de inventario
  - No pide código nuevamente
- [ ] Al cerrar sesión:
  - Limpia sessionStorage
  - Vuelve al login
- [ ] Al volver a `/inspector/codigo-inventario` con código guardado:
  - Redirige automáticamente a menú

---

### ✅ 12. Manejo de Errores

#### A. Red/Backend

**Simular desconectando el backend**:
- [ ] Muestra mensaje claro "Error al conectar con el servidor"
- [ ] Opciones de "Reintentar"
- [ ] No se cuelga la aplicación

#### B. Permisos de Cámara

**Denegar permisos**:
- [ ] Muestra mensaje "Permisos de cámara denegados"
- [ ] Instrucciones de cómo habilitar

#### C. Código Inválido

**Verificar**:
- [ ] Mensaje claro "Código de inventario inválido"
- [ ] No redirige
- [ ] Permite reintentar

#### D. Activo No Encontrado

**Verificar**:
- [ ] Mensaje claro "Activo no encontrado"
- [ ] Botón para reintentar

---

### ✅ 13. Guards de Seguridad

#### A. Sin Login

**Verificar**:
- [ ] Intentar acceder a `/inspector/menu` sin login
- [ ] Redirige automáticamente a `/login`

#### B. Rol Incorrecto

**Login como Administrador**:
- [ ] Intentar acceder a `/inspector/menu`
- [ ] Redirige a `/login`
- [ ] Muestra mensaje "No tienes permisos"

#### C. Sin Código de Inventario

**Verificar**:
- [ ] Intentar acceder a `/inspector/menu` sin código guardado
- [ ] Redirige a `/inspector/codigo-inventario`

---

### ✅ 14. Estilos y Animaciones

**Verificar en todas las páginas**:
- [ ] Colores coherentes con theme-colors.css
- [ ] Botones con hover effect
- [ ] Transiciones suaves (300ms)
- [ ] Sombras en cards
- [ ] Loading spinners animados
- [ ] Error shake animation
- [ ] Scanner scan line animation

---

## 🐛 Bugs Conocidos / Limitaciones

### 1. Scanner en HTTP
- **Problema**: La cámara no funciona en HTTP (solo HTTPS)
- **Solución**: Usar localhost (funciona sin HTTPS) o desplegar con HTTPS

### 2. Múltiples Cámaras
- **Problema**: En algunos dispositivos no detecta todas las cámaras
- **Solución**: Usar navegador actualizado (Chrome/Edge)

### 3. Tamaño del Bundle
- **Warning**: Bundle excede budget (1.26 MB)
- **Impacto**: No afecta funcionalidad, solo tiempo de carga
- **Solución futura**: Code splitting, lazy loading

---

## 📊 Resultados Esperados

Al finalizar las pruebas:

✅ **Todo debe funcionar correctamente**
- Login → Código → Menú → 4 opciones
- Escanear con cámara real
- Digitar código manual
- Agregar activo nuevo
- Generar reporte Excel
- Cerrar sesión

---

## 🔍 Comandos Útiles

### Ver logs en navegador
```
F12 → Console
```

### Limpiar sessionStorage manualmente
```javascript
sessionStorage.clear()
```

### Ver qué hay en sessionStorage
```javascript
console.log(sessionStorage)
```

---

## 📞 Problemas Comunes

### 1. La cámara no funciona
- Verificar permisos del navegador
- Verificar que no esté usando HTTPS sin certificado válido
- Cerrar otras apps que usen la cámara

### 2. No descarga el Excel
- Verificar que el backend esté corriendo
- Verificar que el inventario tenga activos
- Revisar console (F12) para errores

### 3. No guarda el código de inventario
- Verificar que el navegador permita sessionStorage
- Revisar console para errores
- Probar en modo incógnito

---

## ✅ Checklist Final

Antes de considerar la implementación completa:

- [ ] Todos los flujos funcionan
- [ ] No hay errores en console
- [ ] Responsive funciona en móvil
- [ ] Scanner detecta códigos
- [ ] Formularios guardan correctamente
- [ ] Excel se descarga
- [ ] Cerrar sesión limpia todo
- [ ] Guards protegen rutas correctamente

---

**Happy Testing! 🎉**
