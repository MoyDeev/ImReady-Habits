# El proyecto: Im Ready

## ¿De qué trata?

**Im Ready** (`imready-habits`, nombre visible "Im Ready") es una app móvil
**100% local**: sin backend, sin cuentas, sin anuncios y sin analítica. Todos los
datos viven en el dispositivo mediante AsyncStorage.

Nació como una app minimalista de **hábitos diarios**: creas un hábito → le pones un
nombre y una hora → recibes un recordatorio local a esa hora → lo marcas como hecho
en un calendario estilo GitHub. Cada hábito tiene su propio calendario independiente.

Con el tiempo está creciendo hacia un **mini-suite personal** con cuatro áreas,
navegables desde un dock inferior flotante y con gestos horizontales (swipe).

## Secciones

| Sección | Ruta | Estado | Descripción |
|---------|------|--------|-------------|
| **Hábitos** | `/` (`app/index.tsx`) | ✅ Funcional | Lista de hoy con barra de progreso, check rápido, hábitos que "aplican hoy" y sección tenue "Hoy no toca". Detalle con rachas y heatmap. |
| **Gastos** | `/expenses` (`app/expenses.tsx`) | ✅ Funcional | Finanzas locales: ingresos (fijo/extra), gastos asociados a un ingreso, pagos pendientes y resumen de balance. |
| **Notas** | `/notes` (`app/notes.tsx`) | ⏳ Placeholder | Actualmente muestra un `SectionPlaceholder`. Falta implementar. |
| **Pendientes** | `/todos` (`app/todos.tsx`) | ⏳ Placeholder | `SectionPlaceholder`. Aún no está registrada en el Stack de `_layout.tsx`. |

## Hábitos: opciones

El flujo rápido es siempre "nombre + una hora". Dos opciones no estorban ese flujo:

- **Varias veces al día** — enlace discreto "+ Añadir otra hora" (hasta 5 por hábito).
- **Días específicos** — fila "Todos los días · Cambiar" que despliega siete toggles
  `L M M J V S D`.

## Modelo de dominio (resumen)

Definido en [`src/types.ts`](../src/types.ts):

- `Habit` — `id`, `name`, `times: TimeOfDay[]`, `days: number[]` (0 = domingo),
  `color`, `reminderEnabled`, `notificationIds[]`, `createdAt`.
- `TimeOfDay` — `{ hour, minute }`. **Nunca** un timestamp (evita desfases por
  viajes o cambios de horario de verano).
- `CompletionMap` — `habitId -> { "YYYY-MM-DD": true }`. La ausencia de la clave
  significa "no hecho".
- `Finances` — `{ incomes, expenses, pending }` con `Income` (`fijo`/`extra`),
  `Expense` (con `sourceId` al ingreso del que sale) y `PendingExpense` (con
  `dueDate`).
- `AppState` — `{ version, habits, completions }` (persistido; migra de v1 → v2).

## Filosofía de correctitud

La lógica de fechas/rachas vive en [`src/dates.ts`](../src/dates.ts) y la de dinero
en [`src/finance.ts`](../src/finance.ts); ambas son puras (sin módulos nativos):

- Las horas se guardan como `hour`/`minute` locales, no como timestamps, para que los
  recordatorios no se desfasen.
- Las diferencias de fecha usan `Date.UTC` por día de calendario (nunca resta de
  milisegundos), porque con horario de verano hay días de 23h/25h.
- Las rachas se cuentan solo sobre días **programados**: los días no programados no
  suman ni rompen, un "hoy" pendiente no rompe, y la constancia se divide entre los
  días programados de la ventana (acotada a `createdAt`).

## Público objetivo

Uso personal: alguien que quiere seguir hábitos y controlar gastos básicos sin
depender de la nube ni ceder datos. Local-first es una característica, no una
limitación.
