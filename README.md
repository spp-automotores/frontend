# SPP Automotores — sitio web

Sitio de la agencia SPP Automotores: catálogo de autos, una página por auto, consultas por WhatsApp,
«Vendé tu auto» y un panel privado para cargar y dar de baja autos.

## Correr el sitio en una computadora

Hace falta Node.js 20.9 o más nuevo.

```bash
npm install
cp .env.example .env.local   # y completar los valores
npm run dev                  # abre el sitio en http://localhost:3000
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Sitio en modo desarrollo, se actualiza al guardar |
| `npm run build` | Arma la versión final y revisa los tipos |
| `npm run start` | Sirve la versión final armada con `build` |
| `npm run lint` | Revisa el código en busca de errores comunes |
| `npm run cf:build` | Arma la versión para Cloudflare (en `.open-next/`) |

## Publicar (Cloudflare Workers)

El sitio corre en Cloudflare Workers, con [OpenNext](https://opennext.js.org/cloudflare) como
adaptador de Next.js. Lo arma y lo publica Cloudflare desde GitHub (Workers Builds):

| Qué | Comando en Cloudflare |
|---|---|
| Armar (todas las ramas) | `npm run cf:build` |
| Publicar la rama de producción | `npm run cf:deploy` |
| Cada otra rama: su link de prueba (Preview) | `npm run cf:preview` |

- Las dos variables `NEXT_PUBLIC_` de `.env.example` se cargan en Cloudflare como **variables de
  armado** (Build variables): Next.js las pega en el código al armar.
- La configuración del Worker está en `wrangler.jsonc`; cómo guarda las páginas, en
  `open-next.config.ts`; lo que se suma al Worker (la tarea diaria y el `noindex` de los links
  `*.workers.dev`), en `worker.ts`.
- Para probar la versión de Cloudflare en la compu: `npm run cf:build`, después
  `npx opennextjs-cloudflare populateCache local` y `npx wrangler dev` (abre `http://localhost:8787`).
