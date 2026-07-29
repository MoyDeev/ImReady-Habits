# 2026-07-28 — Reducir el tamaño del logo del splash

- **Tipo:** fix / diseño
- **Autor:** asistente

## Resumen
El logo del splash se veía demasiado grande. Se migra la configuración del splash al
plugin `expo-splash-screen` para poder controlar el ancho del logo con `imageWidth`.

## Detalles
- Se elimina el bloque `splash` de nivel superior en `app.json`.
- Se agrega el plugin `expo-splash-screen` con `imageWidth: 150`, `resizeMode: "contain"`
  y `backgroundColor: "#0E0E12"` (mismo fondo que antes).
- Se añade `expo-splash-screen` a las dependencias de `package.json` (`~57.0.0`).

## Archivos tocados
- `app.json`
- `package.json`

## Roadmap
- Completa: "Reducir el tamaño del logo del splash" (categoría Diseño).

## Notas
- ⚠️ **Requiere acción manual del usuario** (el asistente no ejecuta comandos):
  1. Instalar el paquete con la versión correcta del SDK:
     `npx expo install expo-splash-screen`
  2. Regenerar los recursos nativos (la carpeta `android/` está prebuildada):
     `npx expo prebuild --clean`
  3. Reconstruir la app (dev build o `eas build -p android --profile preview`).
- Ajustar `imageWidth` (p. ej. 120–170) si se quiere el logo aún más pequeño/grande.
