# docs-ia — Documentación para el asistente de IA

Esta carpeta centraliza todo lo que un asistente de IA (o cualquier persona nueva
en el proyecto) necesita saber antes de tocar **Im Ready — Habits**: de qué trata
la app, qué tecnologías usa, cómo está organizada, qué falta por hacer y qué reglas
son obligatorias.

> Todo el contenido de `docs-ia` está en **español**.

---

## ⛔ Reglas duras (leer antes de trabajar)

1. **Está PROHIBIDO ejecutar comandos en la terminal.** Nada de `npm`, `npx`,
   `expo`, `eas`, `git`, `find`, etc. El asistente **solo edita archivos y
   documenta**; cualquier comando lo ejecuta manualmente el usuario. Detalle en
   [reglas.md](reglas.md).
2. **Es OBLIGATORIO registrar cada cambio en un changelog.** Por cada cambio que se
   realice en el repositorio se debe crear **un archivo nuevo** dentro de
   [`changelog/`](changelog/). Convención y plantilla en
   [changelog/README.md](changelog/README.md).

---

## Índice

| Documento | Contenido |
|-----------|-----------|
| [proyecto.md](proyecto.md) | Qué es la app, sus secciones, público y filosofía local-first. |
| [tecnologias.md](tecnologias.md) | Stack completo con versiones exactas. |
| [arquitectura.md](arquitectura.md) | Estructura de carpetas, flujo de datos, persistencia y navegación. |
| [reglas.md](reglas.md) | Reglas obligatorias para el asistente de IA. |
| [roadmap.md](roadmap.md) | Lista de tareas por categoría (se tachan al completarse). |
| [changelog/](changelog/) | Un archivo por cada cambio realizado. |

---

## Flujo de trabajo esperado

1. Antes de cambiar algo, lee [reglas.md](reglas.md) y el
   [roadmap.md](roadmap.md).
2. Realiza el cambio **solo editando archivos** (nunca ejecutando comandos).
3. Crea un archivo de changelog describiendo el cambio.
4. Si el cambio completa una tarea del roadmap, **tácha esa casilla** (`- [x]`).
