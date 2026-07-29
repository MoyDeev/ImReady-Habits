# Roadmap

Lista de tareas por categoría. **Marca cada casilla como `- [x]` cuando la tarea se
complete** (y crea su changelog correspondiente). Tareas deducidas del estado actual
del código; agrega nuevas cuando surjan.

Leyenda: `- [ ]` pendiente · `- [x]` hecha.

---

## 🚀 Features

- [ ] Implementar la sección **Notas** (`app/notes.tsx`) — hoy solo muestra `SectionPlaceholder`.
- [ ] Implementar la sección **Pendientes / To-dos** (`app/todos.tsx`) — hoy solo `SectionPlaceholder`.
- [ ] Registrar la ruta `/todos` en el Stack de `app/_layout.tsx` (no está declarada).
- [ ] Añadir la entrada de **Pendientes** al `FloatingDock` (hoy solo Hábitos/Gastos/Notas).
- [ ] Recordatorios/avisos para **pagos pendientes** de Gastos (usar `dueDate` + `notifications.ts`).
- [ ] Exportar / importar (backup) de todos los datos locales.
- [ ] Edición y borrado de ingresos, gastos y pendientes en la sección Gastos.

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
- [ ] Build de producción con EAS (`eas.json` perfil `production`).
- [ ] Publicar en Google Play (package `com.moydeev.imreadyhabits`).
- [ ] Publicar en App Store (bundleId `com.moydeev.imreadyhabits`).
- [ ] Ficha de tienda: descripción, capturas, categorías.

## 🎨 Diseño

- [ ] Unificar el look de **Notas** y **Pendientes** con el resto de la app.
- [ ] Estados vacíos consistentes en todas las secciones.
- [ ] Revisar contraste y accesibilidad en tema claro y oscuro.
- [ ] Confirmar comportamiento del dock/FAB con distintos `safe area insets`.

## 🐞 Bugs / Deuda técnica

- [ ] Notificaciones deshabilitadas en Expo Go (SDK 53+) — dejar claro en UI/documentación.
- [ ] Ruta `/todos` existe como archivo pero no está en el Stack ni en el dock.
- [ ] Verificar consistencia de `SwipeNavigator` (prev/next) entre las 4 secciones.
- [ ] Revisar que la migración de estado v1 → v2 cubra todos los casos legacy.

---

> Recordatorio: **está prohibido ejecutar comandos en la terminal**; los builds y
> publicaciones los ejecuta el usuario. Ver [reglas.md](reglas.md).
