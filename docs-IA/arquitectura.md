# Arquitectura

## Estructura de carpetas

```
app/                         Pantallas (expo-router, rutas por archivo)
  _layout.tsx                Stack + HabitsProvider + listener de tap de notificación
  index.tsx                  Host: pager de las 4 secciones + FloatingDock
  habit/[id].tsx             Detalle: rachas, heatmap, ajustes
  habit/edit/[id].tsx        Editar / eliminar (modal)

components/
  SectionPager.tsx           Carrusel horizontal (Reanimated + gesture-handler)
  FloatingDock.tsx           Dock inferior: controla el pager por índice (4 ítems)
  Fab.tsx                    FAB reutilizable (abajo-derecha, safe-area)
  BottomSheet.tsx            Hoja inferior compartida (teclado + safe-area)
  AddMenu.tsx                "Nube" flotante de opciones sobre el FAB (Gastos)
  HabitModal.tsx             Crear hábito como hoja inferior (envuelve HabitForm)
  HabitRow.tsx               Fila con círculo de check + MiniWeek
  MiniWeek.tsx               Tira compacta de 7 días
  HabitForm.tsx              Formulario compartido crear/editar
  Heatmap.tsx                Calendario estilo GitHub (solo lectura, scroll horizontal)
  SectionPlaceholder.tsx     Placeholder para secciones aún no implementadas
  sections/
    HabitsSection.tsx        Panel Hábitos (progreso, lista, FAB → HabitModal)
    ExpensesSection.tsx      Panel Gastos (resumen, pestañas, FAB → AddMenu)
    NotesSection.tsx         Panel Notas (placeholder)
    TodosSection.tsx         Panel Pendientes (placeholder)
  finance/
    FinanceSummary.tsx       Tarjeta de balance
    FinanceModals.tsx        Hojas de ingreso / gasto / pendiente (usan BottomSheet)

src/
  HabitsContext.tsx          Estado + persistencia + agenda de recordatorios
  SectionsContext.tsx        Índice activo + translateX del pager (Reanimated)
  usePersistentState.ts      Hook genérico de estado persistido (usado por Gastos)
  storage.ts                 AsyncStorage (clave imready-habits/state/v1) + migración
  notifications.ts           Permisos, canal Android, schedule/cancel/resync
  dates.ts                   Lógica pura: claves de día, rachas, heatmap, triggers, migración
  finance.ts                 Lógica pura de dinero: formato, totales, balances
  theme.ts / useTheme.ts     Colores, spacing, claro/oscuro
  types.ts                   Tipos de dominio

scripts/
  pad-adaptive-icon.mjs      Añade margen al ícono adaptativo de Android (sharp)
```

## Flujo de datos

### Hábitos
`HabitsProvider` ([`src/HabitsContext.tsx`](../src/HabitsContext.tsx)) mantiene
`habits` y `completions` en memoria, expone acciones (`toggleCompletion`, etc.) y
persiste vía [`src/storage.ts`](../src/storage.ts). Al cargar, migra el estado
guardado con `migrateState` de [`src/dates.ts`](../src/dates.ts). Las pantallas de
hábitos consumen el contexto con el hook `useHabits`.

### Gastos
La sección de Gastos usa el hook genérico
[`usePersistentState`](../src/usePersistentState.ts) (no el contexto de hábitos),
guardando un objeto `Finances`. Los cálculos (totales, balance, restante por ingreso)
viven en [`src/finance.ts`](../src/finance.ts).

## Navegación

Las 4 secciones (Hábitos, Gastos, Notas, Pendientes) viven en **una sola pantalla**
(`app/index.tsx`) como paneles de un **pager horizontal**. El detalle y la edición de
hábito son rutas de Stack encima del host.

- **Pager** ([`components/SectionPager.tsx`](../components/SectionPager.tsx)):
  carrusel horizontal con `Gesture.Pan` (gesture-handler) + Reanimated; arrastra el
  contenido en la dirección del gesto y hace snap al panel más cercano. El estado
  compartido (índice + `translateX`) vive en
  [`src/SectionsContext.tsx`](../src/SectionsContext.tsx).
- **FloatingDock** ([`components/FloatingDock.tsx`](../components/FloatingDock.tsx)):
  dock inferior que cambia de panel por índice (`goTo(i)`, animado) y resalta el
  activo. Cuatro ítems: Hábitos, Gastos, Notas, Pendientes.
- **expo-router** con rutas tipadas (`experiments.typedRoutes`): el Stack
  ([`app/_layout.tsx`](../app/_layout.tsx)) solo declara `index`, `habit/[id]` y
  `habit/edit/[id]` (modal).

## Patrón "Agregar"

Unificado en todas las secciones: **FAB** ([`components/Fab.tsx`](../components/Fab.tsx))
abajo-derecha → **hoja inferior** ([`components/BottomSheet.tsx`](../components/BottomSheet.tsx),
con `KeyboardAvoidingView` y safe-area). En Hábitos el FAB abre `HabitModal`
directo; en Gastos abre `AddMenu` (nube flotante) con Ingreso/Gasto/Pendiente, y cada
opción abre su hoja de `FinanceModals`.

## Notificaciones

[`src/notifications.ts`](../src/notifications.ts) gestiona permisos, el canal de
Android y el schedule/cancel/resync de recordatorios. `_layout.tsx` incluye un
`NotificationTapListener` que, al tocar un recordatorio (incluso desde arranque en
frío), abre el detalle del hábito (`/habit/[id]`).

> **Limitación conocida:** Expo Go dejó de soportar notificaciones locales desde SDK
> 53, así que el switch de recordatorio se desactiva ahí. Para probarlas hay que usar
> un development build o el APK del perfil `preview`.

## Lógica pura y testeable

`src/dates.ts` y `src/finance.ts` no dependen de módulos nativos, por lo que se
pueden compilar y ejercitar bajo Node. Ahí vive toda la matemática delicada
(fechas por día de calendario con `Date.UTC`, rachas sobre días programados, formato
de dinero sin depender de `Intl`).
