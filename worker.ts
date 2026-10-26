// El Worker de Cloudflare: envuelve al que arma OpenNext (`.open-next/worker.js`,
// se genera con `npm run cf:build`) y le suma dos cosas:
// 1. La tarea diaria (`scheduled`, horario en `wrangler.jsonc`): una consulta liviana
//    a la base, para que el plan gratis de Supabase no la pause por falta de uso.
// 2. `noindex` en los links `*.workers.dev`: sólo el dominio propio va a Google.
// Ver https://opennext.js.org/cloudflare/howtos/custom-worker

// @ts-expect-error: se genera al armar, no está en el repo.
import { default as handler } from "./.open-next/worker.js";

type Contexto = { waitUntil(promesa: Promise<unknown>): void };

const tareaDiaria = "/api/mantener-base";

const worker = {
  async fetch(request: Request, env: unknown, ctx: Contexto): Promise<Response> {
    const respuesta: Response = await handler.fetch(request, env, ctx);
    if (!new URL(request.url).hostname.endsWith(".workers.dev")) return respuesta;

    const copia = new Response(respuesta.body, respuesta);
    copia.headers.set("X-Robots-Tag", "noindex");
    return copia;
  },

  // La ruta de la tarea diaria se llama desde adentro, con una clave de un solo uso
  // que sólo existe mientras dura la llamada: desde afuera no se puede usar.
  async scheduled(_controlador: unknown, env: unknown, ctx: Contexto): Promise<void> {
    const clave = crypto.randomUUID();
    globalThis.__claveDeLaTareaDiaria = clave;
    try {
      const respuesta: Response = await handler.fetch(
        new Request(`https://tarea-diaria.interno${tareaDiaria}`, {
          headers: { authorization: `Bearer ${clave}` },
        }),
        env,
        ctx,
      );
      if (!respuesta.ok) {
        throw new Error(`La tarea diaria falló (${respuesta.status}): ${await respuesta.text()}`);
      }
    } finally {
      delete globalThis.__claveDeLaTareaDiaria;
    }
  },
};

export default worker;

declare global {
  var __claveDeLaTareaDiaria: string | undefined;
}

// La cola que rehace las páginas vencidas (ver `open-next.config.ts`).
// @ts-expect-error: se genera al armar, no está en el repo.
export { DOQueueHandler } from "./.open-next/worker.js";
