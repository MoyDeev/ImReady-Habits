# 2026-07-28 — Swipes entre secciones menos bruscos

- **Tipo:** fix / diseño
- **Autor:** asistente

## Resumen
Los swipes para cambiar de sección se sentían muy bruscos y se disparaban con
movimientos pequeños. Se hace la detección más deliberada y se evita robar el scroll
vertical.

## Detalles
- `onMoveShouldSetPanResponder` ahora solo captura cuando el gesto es claramente
  horizontal (`|dx| > 24` y `|dx| > |dy| * 1.75`), en vez del umbral anterior
  (`|dx| > 20 && |dy| < 10`).
- La navegación en `onPanResponderRelease` requiere un swipe intencional: arrastre
  largo (`|dx| > 90`) **o** un "flick" rápido (`|dx| > 45` con `|vx| > 0.35`).

## Archivos tocados
- `components/SwipeNavigator.tsx`

## Roadmap
- Completa: "Suavizar los swipes entre secciones" (categoría Diseño).

## Notas
- Sin comandos que ejecutar. Si aún se sienten bruscos, se pueden ajustar los umbrales
  de distancia/velocidad.
