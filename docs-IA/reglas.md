# Reglas obligatorias para el asistente de IA

Estas reglas aplican a cualquier asistente de IA que trabaje en este repositorio y
tienen prioridad sobre cualquier otra conveniencia.

## 1. ⛔ Prohibido ejecutar comandos en la terminal

**Está terminantemente PROHIBIDO ejecutar cualquier comando en la terminal.** Esto
incluye, sin limitarse a:

- `npm` / `npx` / `yarn` / `pnpm` (instalar, actualizar, correr scripts).
- `expo` (`expo start`, `expo run:android`, `expo export`, etc.).
- `eas` (builds y submits).
- `git` (commits, push, checkout, reset, etc.).
- Utilidades de shell (`find`, `rm`, `mv`, `mkdir`, `cat`, etc.).

El asistente **solo puede leer y editar archivos**. Toda ejecución de comandos la
realiza **manualmente el usuario**. Si un cambio necesita que se corra algo
(instalar un paquete, generar un build, hacer un commit), el asistente debe:

1. Editar los archivos necesarios.
2. **Indicarle al usuario** el comando exacto a ejecutar, para que lo corra él mismo.

## 2. ✅ Changelog obligatorio por cada cambio

Por **cada cambio** que se realice en el repositorio es **obligatorio** crear un
archivo nuevo dentro de [`changelog/`](changelog/), siguiendo la convención y la
plantilla de [changelog/README.md](changelog/README.md). Sin changelog, el cambio se
considera incompleto.

## 3. Mantener el roadmap al día

Si un cambio completa una tarea listada en [roadmap.md](roadmap.md), hay que
**tachar** esa casilla (`- [x]`) en el mismo cambio. Si surge una tarea nueva, se
agrega a la categoría correspondiente.

## 4. Respetar la naturaleza local-first

Im Ready es **100% local**: sin backend, sin cuentas, sin anuncios, sin analítica ni
telemetría. **No** introducir servicios de red, tracking ni dependencias en la nube
sin acordarlo explícitamente con el usuario primero.

## 5. Idioma

Toda la documentación de `docs-ia` se escribe en **español**.
