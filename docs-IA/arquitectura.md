# Arquitectura

## Estructura de carpetas

```
app/                         Pantallas (expo-router, rutas por archivo)
  _layout.tsx                Stack + HabitsProvider + listener de tap de notificación
  index.tsx                  Hábitos de hoy: progreso, check rápido, FAB
  expenses.tsx               Gastos: ingresos / gastos / pendientes + resumen
  notes.tsx                  Notas (placeholder)
  todos.tsx                  Pendientes (placeholder, aún fuera del Stack)
  habit/new.tsx              Crear hábito (modal)
  habit/[id].tsx             Detalle: rachas, heatmap, ajustes
  habit/edit/[id].tsx        Editar / eliminar (modal)

components/
  HabitRow.tsx               Fila con círculo de check + MiniWeek
  MiniWeek.tsx               Tira compacta de 7 días
  HabitForm.tsx              Formulario compartido crear/editar
  Heatmap.tsx                Calendario estilo GitHub (scroll horizontal)
  FloatingDock.tsx           Dock inferior: Hábitos / Gastos / Notas
  SwipeNavigator.tsx         Navegación por gestos horizontales entre secciones
  SectionPlaceholder.tsx     Placeholder para secciones aún no implementadas
  finance/
    FinanceSummary.tsx       Tarjeta de balance
    FinanceModals.tsx        Modales de ingreso / gasto / pendiente

src/
  HabitsContext.tsx          Estado + persistencia + agenda de recordatorios
  usePersistentState.ts      Hook genérico de estado persistido (usado por Gastos)
  storage.ts                 AsyncStorage (clave imready-habits/state/v1) + migración
  notifications.ts           Permisos, canal Android, schedule/cancel/resync
  dates.ts                   Lógica pura: claves de día, rachas, heatmap, triggers, migración
  finance.ts                 Lógica pura de dinero: formato, totales, balances
  theme.ts / useTheme.ts     Colores, spacing, claro/oscuro
  types.ts                   Tipos de dominio
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

- **expo-router** con rutas tipadas (`experiments.typedRoutes`). El Stack se define en
  [`app/_layout.tsx`](../app/_layout.tsx); `habit/new` y `habit/edit/[id]` son modales.
- **FloatingDock** ([`components/FloatingDock.tsx`](../components/FloatingDock.tsx)):
  dock inferior centrado con Hábitos (`/`), Gastos (`/expenses`) y Notas (`/notes`);
  resalta la sección activa.
- **SwipeNavigator** ([`components/SwipeNavigator.tsx`](../components/SwipeNavigator.tsx)):
  permite pasar entre secciones con gestos horizontales (`prevRoute`/`nextRoute`).

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
