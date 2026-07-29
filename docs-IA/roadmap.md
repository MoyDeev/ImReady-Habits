# Roadmap

Lista de tareas por categoría. **Marca cada casilla como `- [x]` cuando la tarea se
complete** (y crea su changelog correspondiente). Tareas deducidas del estado actual
del código; agrega nuevas cuando surjan.

Leyenda: `- [ ]` pendiente · `- [x]` hecha.

---

## 🚀 Features

- [ ] Implementar la sección **Notas** (`app/notes.tsx`) — hoy solo muestra `SectionPlaceholder`.
- [ ] Implementar la sección **Pendientes / To-dos** (`app/todos.tsx`) — hoy solo `SectionPlaceholder`.
- [x] ~~Registrar la ruta `/todos` en el Stack~~ — obsoleto: las 4 secciones ahora son paneles de un pager (`app/index.tsx` + `components/SectionPager.tsx`). _(2026-07-29)_
- [x] Añadir la entrada de **Pendientes** al `FloatingDock` (ahora 4 ítems por índice). _(2026-07-29)_
- [ ] Recordatorios/avisos para **pagos pendientes** de Gastos (usar `dueDate` + `notifications.ts`).
- [ ] Exportar / importar (backup) de todos los datos locales.
- [ ] Edición y borrado de ingresos, gastos y pendientes en la sección Gastos.
- [x] En **Gastos**, permitir que el ingreso "extra" tenga un **nombre personalizado** (no quede fijo como "extra") — `app/expenses.tsx`, `components/finance/FinanceModals.tsx`, tipo `Income` en `src/types.ts`. _(2026-07-28)_
- [x] **Patrón "Agregar" unificado**: FAB abajo-derecha → hoja inferior; en Gastos el FAB abre un menú flotante (Ingreso/Gasto/Pendiente) — `components/Fab.tsx`, `components/BottomSheet.tsx`, `components/AddMenu.tsx`, `components/HabitModal.tsx`, secciones. _(2026-07-29)_

## 🔒 Seguridad

- [ ] Verificar que no haya secretos ni claves en el repo (`.npmrc`, configs).
- [ ] Validar/robustecer entradas numéricas de montos (`parseAmount` en `src/finance.ts`).
- [ ] Revisar permisos declarados (notificaciones) y pedir solo lo necesario.

## 🕵️ Privacidad

- [ ] Confirmar y documentar que la app **no** envía datos (cero telemetría/analítica).
- [ ] Documentar qué se guarda localmente y dónde (AsyncStorage, clave `imready-habits/state/v1`).
- [ ] Redactar una política de privacidad simple para las tiendas (todo es local).

## 📦 Publicación

- [ ] Iconos y splash definitivos para producción (assets en `assets/`).
- [x] Reducir el tamaño del **logo en el cajón de apps** (ícono adaptativo con margen) — `scripts/pad-adaptive-icon.mjs` + `app.json`. _(2026-07-29 — requiere pasos del usuario, ver changelog)_
- [ ] Build de producción con EAS (`eas.json` perfil `production`).
- [ ] Publicar en Google Play (package `com.moydeev.imreadyhabits`).
- [ ] Publicar en App Store (bundleId `com.moydeev.imreadyhabits`).
- [ ] Ficha de tienda: descripción, capturas, categorías.
- [x] Indicar en el **README de presentación** que la app forma parte de las aplicaciones de **Sistemas-Kalli** — `README.md`. _(2026-07-28)_

## 🎨 Diseño

- [ ] Unificar el look de **Notas** y **Pendientes** con el resto de la app.
- [ ] Estados vacíos consistentes en todas las secciones.
- [ ] Revisar contraste y accesibilidad en tema claro y oscuro.
- [x] Confirmar comportamiento del dock/FAB con distintos `safe area insets` (usan `insets.bottom`; listas con `paddingBottom` que libera dock/nav). _(2026-07-29)_
- [x] **Swipes con dirección** (arrastre real izq/der): pager horizontal con Reanimated + gesture-handler — `components/SectionPager.tsx`, `src/SectionsContext.tsx`. _(2026-07-29)_
- [x] **Teclado no encima**: hojas con `KeyboardAvoidingView` + `android.softwareKeyboardLayoutMode: "resize"`; nada oculto tras la barra del sistema — `components/BottomSheet.tsx`, `app.json`. _(2026-07-29)_
- [x] Reducir el tamaño del **logo del splash** (se ve demasiado grande) — `app.json` (plugin `expo-splash-screen`, `imageWidth`). _(2026-07-28 — requiere pasos del usuario, ver changelog)_
- [x] Suavizar los **swipes** entre secciones (hoy son muy bruscos). _(2026-07-28; ampliado el 2026-07-29 con el pager direccional)_
- [x] Quitar el **logo de la pantalla de Hábitos**, dejándolo solo en el topbar — `app/index.tsx` (estado vacío). _(2026-07-28)_
- [x] Que la **racha** del hábito se vea de inmediato en el calendario, sin tener que desplazar el heatmap a la derecha — `components/Heatmap.tsx`. _(2026-07-28)_

## 🐞 Bugs / Deuda técnica

- [ ] Notificaciones deshabilitadas en Expo Go (SDK 53+) — dejar claro en UI/documentación.
- [x] ~~Ruta `/todos` no estaba en el Stack ni en el dock~~ — resuelto: ahora es un panel del pager y un ítem del dock. _(2026-07-29)_
- [x] ~~Verificar consistencia de `SwipeNavigator`~~ — obsoleto: reemplazado por el pager único (`SectionPager`). _(2026-07-29)_
- [ ] Revisar que la migración de estado v1 → v2 cubra todos los casos legacy.
- [x] En el **calendario de hábitos**, tocar un cuadrito lo pinta; no debe hacerlo (el heatmap no debe togglear completions) — `components/Heatmap.tsx`. _(2026-07-28)_

---

> Recordatorio: **está prohibido ejecutar comandos en la terminal**; los builds y
> publicaciones los ejecuta el usuario. Ver [reglas.md](reglas.md).
