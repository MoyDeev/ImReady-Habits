# Changelog

**Regla obligatoria:** por **cada cambio** que se realice en el repositorio se debe
crear **un archivo nuevo** en esta carpeta. Un cambio sin su archivo de changelog se
considera incompleto.

## Convención de nombre

```
AAAA-MM-DD-titulo-corto.md
```

Ejemplo: `2026-07-28-estado-inicial-y-docs-ia.md`. Si hay varios cambios el mismo
día, añade un sufijo (`-2`, `-3`) o un título distinto.

## Plantilla

Copia esto para cada nuevo archivo:

```markdown
# AAAA-MM-DD — Título corto

- **Tipo:** feature | fix | docs | chore | refactor | seguridad | diseño
- **Autor:** (usuario / asistente)

## Resumen
Qué se cambió y por qué, en una o dos frases.

## Detalles
- Punto concreto del cambio.
- Otro punto.

## Archivos tocados
- `ruta/al/archivo.tsx`
- `ruta/al/otro.ts`

## Roadmap
- Tareas del roadmap que este cambio completa (marcar `- [x]` en roadmap.md) o agrega.

## Notas
- Comandos que el usuario debe ejecutar manualmente (si aplica), pendientes, riesgos.
```

> Recordatorio: el asistente **no ejecuta comandos**. Si el cambio requiere correr
> algo, indícalo en la sección **Notas** para que lo ejecute el usuario.
