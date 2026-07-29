# 2026-07-28 — Heatmap de solo lectura y racha visible de inmediato

- **Tipo:** fix
- **Autor:** asistente

## Resumen
En el calendario de un hábito, tocar un cuadrito lo pintaba (marcaba/desmarcaba el
día); eso ya no ocurre. Además, el calendario ahora arranca desplazado al final para
ver la racha reciente sin tener que arrastrarse a la derecha.

## Detalles
- `components/Heatmap.tsx`:
  - Las celdas dejan de ser `Pressable` y pasan a ser `View` (no interactivas).
  - Se elimina la prop `onToggleDay` del componente.
  - El `ScrollView` horizontal usa un `ref` y `onContentSizeChange` para hacer
    `scrollToEnd({ animated: false })`, mostrando la semana más reciente al abrir.
- `app/habit/[id].tsx`:
  - Ya no se pasa `toggleCompletion` al `Heatmap` (se quita del `useHabits()`).
  - Se actualiza el texto de ayuda: antes decía "Toca un día para marcarlo o
    desmarcarlo…"; ahora solo aclara que los días atenuados no estaban programados.

## Archivos tocados
- `components/Heatmap.tsx`
- `app/habit/[id].tsx`

## Roadmap
- Completa: "Tocar un cuadrito lo pinta; no debe hacerlo" (categoría Bugs).
- Completa: "Que la racha se vea de inmediato en el calendario" (categoría Diseño).

## Notas
- El marcado/desmarcado de hábitos sigue disponible desde la lista del día
  (`app/index.tsx` / `HabitRow`); el calendario ahora es solo de visualización.
