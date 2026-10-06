# Flujo de ramas

Cómo entra un cambio al sitio. Vale igual para personas y para herramientas de IA.

## Las tres ramas

| Rama | Para qué |
|---|---|
| `dev` | Donde se juntan los cambios terminados. Es la rama por defecto del repo. |
| `staging` | Revisión: lo que está por publicarse. Cuando el sitio esté en internet, va a tener su propio link de prueba. |
| `main` | Producción: lo que ve el público. |

Un cambio siempre sube en este orden: **rama de trabajo → `dev` → `staging` → `main`**.

## Cómo entra un cambio

1. Partir de `dev` actualizada y crear una rama de trabajo:
   ```bash
   git switch dev
   git pull
   git switch -c tipo/descripcion-corta
   ```
   Tipos: `feat/` (algo nuevo), `fix/` (un arreglo), `docs/` (documentación), `chore/` (mantenimiento).
2. Commits en castellano, claros para alguien que no programa.
3. Antes de abrir el pull request, `npm run build` y `npm run lint` tienen que pasar.
4. Pull request de la rama de trabajo a `dev`.
5. Para publicar: pull request de `dev` a `staging`, se revisa ahí, y después pull request de `staging` a `main`.

Nunca un pull request de una rama de trabajo directo a `staging` o a `main`. Esto todavía no lo controla
GitHub: lo cuida quien trabaja en el repo.

## Lo que GitHub hace cumplir

Las reglas del repo (el *ruleset* `flujo-de-ramas`) se aplican a `main`, `staging` y `dev`, sin excepciones,
tampoco para el dueño:

- Esas ramas sólo cambian por pull request: un push directo se rechaza.
- No se puede forzar un push (reescribir la historia) ni borrar la rama.
- Los pull requests se unen sólo con «merge commit». «Squash» y «rebase» están apagados en el repo, así las
  tres ramas comparten la misma historia.

## Acuerdos

- **No se borran ramas**, tampoco las de trabajo después de unirlas: quedan como historial.
- **El merge lo hace una persona.** Una herramienta de IA puede abrir el pull request, pero no lo une.
