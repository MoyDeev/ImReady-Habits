# 2026-07-28 — Ingreso "extra" con etiqueta personalizada

- **Tipo:** feature
- **Autor:** asistente

## Resumen
Un ingreso de tipo "extra" ya no queda forzado a mostrarse como "Extra": puede llevar
una etiqueta personalizada (p. ej. "Freelance", "Venta", "Regalo").

## Detalles
- `src/types.ts`: se agrega el campo opcional `label?: string` a `Income`.
- `components/finance/FinanceModals.tsx` (`IncomeModal`): cuando el tipo es "extra"
  se muestra un campo "Etiqueta (opcional)". Se envía en `onSubmit` como `label`
  (solo para extras; para "fijo" queda `undefined`).
- `app/expenses.tsx`:
  - `addIncome` acepta el campo `label`.
  - El badge del ingreso muestra `label` cuando existe, si no cae a "Extra"
    (`inc.kind === 'fijo' ? 'Fijo' : inc.label?.trim() || 'Extra'`).

## Archivos tocados
- `src/types.ts`
- `components/finance/FinanceModals.tsx`
- `app/expenses.tsx`

## Roadmap
- Completa: "Permitir que el ingreso extra tenga un nombre personalizado" (Features).

## Notas
- Cambio retrocompatible: `label` es opcional; los ingresos guardados sin etiqueta
  siguen mostrando "Extra". No requiere migración de datos.
- Sin comandos que ejecutar.
