# 2026-07-29 — Patrón "Agregar" unificado + teclado/safe-area

- **Tipo:** feature / diseño
- **Autor:** asistente

## Resumen
Se unifica todo lo de "Agregar" bajo el mismo patrón y estilo: **FAB abajo-derecha →
hoja inferior**. En Gastos el FAB abre un **menú flotante** con las opciones
(Ingreso, Gasto, Pendiente a pagar); en Hábitos abre el formulario directo. Las hojas
ahora evitan el teclado y respetan la barra de navegación del móvil.

## Detalles
- `components/BottomSheet.tsx` (nuevo): hoja inferior compartida con
  `KeyboardAvoidingView`, `paddingBottom: insets.bottom` (safe-area) y `maxHeight`
  relativo a la pantalla. Base para todas las hojas de "Agregar".
- `components/Fab.tsx` (nuevo): FAB reutilizable, posicionado con `insets.bottom`.
- `components/AddMenu.tsx` (nuevo): "nube" flotante anclada sobre el FAB (opciones con
  icono + etiqueta), por encima del safe-area.
- `components/HabitModal.tsx` (nuevo): creación de hábito como hoja inferior (envuelve
  `HabitForm`, mueve la lógica de la antigua `app/habit/new.tsx`).
- `components/finance/FinanceModals.tsx`: `FormSheet` ahora usa `BottomSheet`
  (se elimina el `Modal`/sheet propio).
- `components/sections/HabitsSection.tsx`: el FAB abre `HabitModal`.
- `components/sections/ExpensesSection.tsx`: el FAB abre `AddMenu` con 3 opciones →
  cada una abre su hoja; se elimina el botón punteado "Agregar …" (las pestañas quedan
  solo para ver listas).
- `components/HabitForm.tsx`: nueva prop opcional `style` para encajar en la hoja.
- Responsividad: FAB y dock usan `insets.bottom`; las listas usan
  `paddingBottom = insets.bottom + holgura` (se quitan los `150`/`spacing.xxl` fijos).
- `app.json`: `android.softwareKeyboardLayoutMode: "resize"` para que el teclado no
  encime el contenido.

## Archivos tocados
- Nuevos: `components/BottomSheet.tsx`, `components/Fab.tsx`, `components/AddMenu.tsx`,
  `components/HabitModal.tsx`.
- Modificados: `components/finance/FinanceModals.tsx`, `components/HabitForm.tsx`,
  `components/sections/HabitsSection.tsx`, `components/sections/ExpensesSection.tsx`,
  `app.json`.
- Eliminados: `app/habit/new.tsx` (su rol lo cumple `HabitModal`).

## Roadmap
- Completa: patrón "Agregar" unificado; teclado sin encimar; dock/FAB con safe-area.

## Notas
- Editar hábito sigue como pantalla modal a pantalla completa (queda fuera del alcance
  "Agregar"); posible seguimiento para unificarlo también.
- Sin comandos que ejecutar.
