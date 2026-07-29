# 2026-07-28 — Estado inicial del repo y creación de docs-ia

- **Tipo:** docs
- **Autor:** asistente

## Resumen
Se crea la carpeta `docs-ia` con la documentación del proyecto para el asistente de
IA, y se deja constancia del estado actual del repositorio como punto de partida del
changelog.

## Detalles

### Documentación creada (`docs-ia/`)
- `README.md` — índice de la carpeta y reglas duras destacadas.
- `proyecto.md` — de qué trata la app, secciones, dominio y filosofía local-first.
- `tecnologias.md` — stack con versiones exactas (package.json / app.json / eas.json).
- `arquitectura.md` — estructura de carpetas, flujo de datos, navegación y notificaciones.
- `reglas.md` — reglas obligatorias (prohibido terminal, changelog obligatorio).
- `roadmap.md` — tareas por categoría (features, seguridad, privacidad, publicación, diseño, bugs).
- `changelog/README.md` — convención y plantilla del changelog.

### Estado actual del repositorio (contexto, no cambiado aquí)
Según el árbol y el `git status` de partida, además de la base de hábitos ya existían
o estaban en progreso:
- Sección **Gastos** funcional: `app/expenses.tsx`, `components/finance/` y `src/finance.ts`.
- Secciones **Notas** (`app/notes.tsx`) y **Pendientes** (`app/todos.tsx`) como placeholders.
- Navegación nueva: `components/FloatingDock.tsx` y `components/SwipeNavigator.tsx`.
- `components/SectionPlaceholder.tsx` para secciones sin implementar.
- Hook genérico `src/usePersistentState.ts` (persistencia de Gastos).
- Logo `assets/ImReady__logo_OF.png` y `.npmrc` añadidos.

## Archivos tocados
- `docs-ia/README.md` (nuevo)
- `docs-ia/proyecto.md` (nuevo)
- `docs-ia/tecnologias.md` (nuevo)
- `docs-ia/arquitectura.md` (nuevo)
- `docs-ia/reglas.md` (nuevo)
- `docs-ia/roadmap.md` (nuevo)
- `docs-ia/changelog/README.md` (nuevo)
- `docs-ia/changelog/2026-07-28-estado-inicial-y-docs-ia.md` (nuevo)

## Roadmap
- No completa tareas de producto; establece el roadmap inicial en `docs-ia/roadmap.md`.

## Notas
- No se ejecutó ningún comando de terminal (coherente con `reglas.md`).
- El estado del repo listado arriba refleja el `git status` de partida; este cambio
  solo agrega documentación.
