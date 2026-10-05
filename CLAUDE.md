@AGENTS.md

# SPP Automotores — guía técnica del repo

Sitio de una agencia de autos: parte pública (catálogo, ficha por auto, «Vendé tu auto», nosotros) y un
panel privado en `/admin` para una sola cuenta de administrador. Un solo repo para todo.

**El repo es público.** Todo lo que se escribe acá (código, comentarios, commits, issues, PRs) lo puede
leer cualquiera, incluido el cliente: nada de claves, datos personales ni notas internas.

## Stack

| Qué | Con qué |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Estilos | Tailwind CSS 4: los tokens viven en `app/globals.css`, no hay `tailwind.config` |
| Animación | Motion (`motion/react`) |
| Íconos | `lucide-react`, la única librería de íconos |
| Panel `/admin` | shadcn/ui (componentes en `components/ui/`, se suman con `npx shadcn add <componente>`) |
| Datos y login | Supabase (`@supabase/supabase-js` + `@supabase/ssr`) |

Las versiones están fijas en `package.json` (sin `^`, por `.npmrc`). Para subir una, cambiarla a
propósito y correr `build` y `lint`.

## Comandos

`npm run dev` · `npm run build` (incluye el chequeo de tipos) · `npm run lint`. Antes de dar algo por
terminado, `build` y `lint` tienen que pasar.

## Diseño: reglas

- **Colores sólo desde los tokens** de `app/globals.css` (`bg-background`, `bg-card`, `text-foreground`,
  `text-muted-foreground`, `bg-primary`, `text-highlight`…), nunca un hex suelto en un componente.
  Los nombres son los de shadcn/ui, así el panel usa la misma paleta.
- **El rojo de marca (`primary`) es fondo de botón con texto blanco**, nunca texto sobre negro (contraste
  2,9:1). Para texto rojo, `text-highlight` (4,96:1 sobre el fondo).
- El sitio es siempre oscuro: no hay modo claro.
- **Tipografías:** Archivo (`font-sans` y `font-heading`; títulos anchos con `[font-stretch:125%]`) e
  Instrument Serif sólo en cursiva (`font-serif italic`) para frases de acento.
- **Íconos:** sólo `lucide-react`. Si falta uno (por ejemplo, el logo de WhatsApp), un SVG propio en
  `components/icons/` con la misma caja y el mismo grosor de trazo. Un emoji no es un ícono.
- shadcn/ui es para el panel `/admin`. La parte pública se arma con componentes propios.
- Animaciones: sólo `transform` y `opacity`, y respetando `prefers-reduced-motion`.

## Claves y variables de entorno

- Las claves van en `.env.local` (ignorado por git). `.env.example` lista los nombres, sin valores reales.
- Una variable con prefijo `NEXT_PUBLIC_` llega al navegador: nunca una clave secreta con ese prefijo.
- Lo que protege los datos en Supabase son las reglas de Row Level Security: todos leen los autos,
  sólo el administrador escribe.

## Reglas de código

- Nada del negocio escrito fijo en un componente (teléfonos, textos, precios): sale de la base o de
  una configuración.
- Lo que no se sabe se muestra como ausente («Consultar»), nunca con un valor inventado.
- Commits en castellano, claros para alguien que no programa.
