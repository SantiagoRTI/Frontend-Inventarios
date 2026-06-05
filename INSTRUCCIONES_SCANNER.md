# Instrucciones para Implementar el Scanner de Códigos de Barras

## Librería Recomendada

Para implementar el escaneo de códigos de barras, se recomienda usar **@zxing/ngx-scanner** que es compatible con Angular 19.

## Instalación

```bash
npm install @zxing/library @zxing/ngx-scanner
```

## Configuración en angular.json

Asegúrate de que los permisos de cámara estén configurados correctamente. No se requiere configuración especial en angular.json.

## Uso del Scanner

El componente `EscanearComponent` ya está preparado para usar el scanner. La librería se ha importado y configurado.

## Permisos de Cámara

El navegador solicitará permisos para acceder a la cámara la primera vez que se use el scanner. Asegúrate de:

1. Usar HTTPS en producción (requerido para acceso a cámara)
2. En desarrollo, `localhost` funciona sin HTTPS
3. El usuario debe aceptar los permisos de cámara

## Troubleshooting

### La cámara no se activa
- Verifica que el navegador tenga permisos de cámara
- En Chrome: Configuración > Privacidad y seguridad > Configuración de sitios > Cámara
- Asegúrate de que la cámara no esté siendo usada por otra aplicación

### El código no se detecta
- Asegúrate de tener buena iluminación
- El código de barras debe estar enfocado y visible
- Prueba con diferentes distancias y ángulos

### Error de librería no encontrada
- Ejecuta `npm install` nuevamente
- Verifica que las dependencias estén en `package.json`
- Reinicia el servidor de desarrollo

## Formatos de Códigos Soportados

La librería ZXing soporta múltiples formatos:
- EAN-13 (códigos de productos)
- EAN-8
- Code 128
- Code 39
- QR Code
- Data Matrix
- Y más...

## Alternativas

Si prefieres otra librería, puedes usar:
- `html5-qrcode`: Más liviana, solo para QR
- `quagga2`: Específica para códigos de barras 1D
