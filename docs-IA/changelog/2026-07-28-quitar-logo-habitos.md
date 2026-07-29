# 2026-07-28 — Quitar el logo de la pantalla de Hábitos

- **Tipo:** diseño
- **Autor:** asistente

## Resumen
Se elimina el logo que aparecía en el estado vacío de la pantalla de Hábitos. El
logo se mantiene únicamente en el topbar (definido en `app/_layout.tsx`).

## Detalles
- Se quita el `<Image>` del logo del estado vacío en `app/index.tsx`.
- Se elimina el import de `Image` y el estilo `emptyLogo`, que quedaron sin uso.

## Archivos tocados
- `app/index.tsx`

## Roadmap
- Completa: "Quitar el logo de la pantalla de Hábitos" (categoría Diseño).

## Notas
- Sin comandos que ejecutar. El logo del topbar (`app/_layout.tsx`, `headerTitle`)
  no se modificó.
