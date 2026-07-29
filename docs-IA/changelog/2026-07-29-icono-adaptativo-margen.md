# 2026-07-29 — Ícono adaptativo con margen (cajón de apps)

- **Tipo:** fix / diseño / build
- **Autor:** asistente

## Resumen
El logo se veía demasiado grande en el cajón de aplicaciones del móvil porque el
ícono adaptativo de Android no tenía margen (zona segura). Se agrega un script que
añade margen transparente al foreground.

## Detalles
- `scripts/pad-adaptive-icon.mjs` (nuevo): con `sharp`, toma
  `assets/adaptive-icon.png`, guarda un backup una sola vez
  (`assets/adaptive-icon.original.png`) y reescribe el foreground con el logo al ~66%
  del lienzo (configurable con `CONTENT`, p. ej. `CONTENT=0.6`). Re-ejecutable sin
  degradar la imagen (siempre parte del backup).
- `package.json`: se añade `sharp` en `devDependencies`.
- No se toca `assets/icon.png` (iOS debe ir a sangre completa).

## Archivos tocados
- Nuevos: `scripts/pad-adaptive-icon.mjs`.
- Modificados: `package.json`.
- Genera/actualiza (al ejecutar el script): `assets/adaptive-icon.png`,
  `assets/adaptive-icon.original.png`.

## Roadmap
- Completa: reducir el tamaño del logo en el cajón de apps.

## Notas
- ⚠️ **Requiere pasos manuales del usuario** (el asistente no ejecuta terminal):
  1. `npm install` (instala `sharp`).
  2. `node scripts/pad-adaptive-icon.mjs` (usa `CONTENT=0.6` si quieres el logo aún
     más pequeño).
  3. `npx expo prebuild --clean` para regenerar los mipmaps de `android/`.
  4. Reconstruir (dev build / `eas build -p android --profile preview`).
