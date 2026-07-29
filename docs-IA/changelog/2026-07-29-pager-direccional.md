# 2026-07-29 — Navegación por pager horizontal direccional

- **Tipo:** feature / refactor
- **Autor:** asistente

## Resumen
Los swipes no dejaban claro hacia dónde se cambiaba. Se reemplaza la navegación por
rutas (`SwipeNavigator` + Stack) por un **carrusel horizontal**: el contenido se
arrastra en la dirección del gesto y el dock anima al panel correspondiente.

## Detalles
- Las 4 secciones (Hábitos, Gastos, Notas, Pendientes) pasan a ser **paneles** de un
  pager alojado en `app/index.tsx`.
- `src/SectionsContext.tsx` (nuevo): índice activo + `translateX` compartido
  (Reanimated) + `goTo(i)` / `setActive(i)`.
- `components/SectionPager.tsx` (nuevo): `Gesture.Pan()` con
  `activeOffsetX([-15,15])` y `failOffsetY([-12,12])` (no roba el scroll vertical),
  arrastre con rubber-band y snap por distancia + velocidad (`withTiming`).
- `components/sections/HabitsSection.tsx`, `ExpensesSection.tsx`, `NotesSection.tsx`,
  `TodosSection.tsx` (nuevos): contenido movido desde las antiguas pantallas.
- `components/FloatingDock.tsx`: ahora controla el pager por índice y resalta el
  panel activo; se añade **Pendientes** como 4.º ítem. Se renderiza una sola vez en
  el host.
- `app/_layout.tsx`: se quitan los `Stack.Screen` de `expenses`/`notes` (y `habit/new`,
  ver otro changelog). El detalle/edición de hábito siguen como stack.
- `babel.config.js` (nuevo): `babel-preset-expo` (salvaguarda del plugin de worklets).

## Archivos tocados
- Nuevos: `src/SectionsContext.tsx`, `components/SectionPager.tsx`,
  `components/sections/*.tsx` (4), `babel.config.js`.
- Modificados: `app/index.tsx`, `app/_layout.tsx`, `components/FloatingDock.tsx`.
- Eliminados: `app/expenses.tsx`, `app/notes.tsx`, `app/todos.tsx`,
  `components/SwipeNavigator.tsx`.

## Roadmap
- Completa: swipes con dirección; Pendientes en el dock; `/todos` alcanzable;
  obsoleta la verificación de `SwipeNavigator`.

## Notas
- Requiere **dev build** (`npx expo run:android`), no Expo Go, para probar gestos y
  notificaciones. Reanimated 4 usa `react-native-worklets` (ya instalado); si algún
  worklet fallara, confirmar que `babel-preset-expo` está activo.
