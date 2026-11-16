// El Worker de Cloudflare: envuelve al que arma OpenNext (`.open-next/worker.js`,
// se genera con `npm run cf:build`) y le suma dos cosas:
// 1. La tarea diaria (`scheduled`, horario en `wrangler.jsonc`): una consulta liviana
//    a cada base, para que el plan gratis de Supabase no las pause por falta de uso.
// 2. `noindex` en los links `*.workers.dev`: sólo el dominio propio va a Google.
// Ver https://opennext.js.org/cloudflare/howtos/custom-worker

// @ts-expect-error: se genera al armar, no está en el repo.
import { default as handler } from "./.open-next/worker.js";

type Contexto = { waitUntil(promesa: Promise<unknown>): void };

// Secretos del Worker de producción (Settings → Variables and Secrets, o
// `wrangler secret put`): la dirección y la clave pública de cada base.
type Entorno = {
  TAREA_BASE_PRINCIPAL_URL?: string;
  TAREA_BASE_PRINCIPAL_CLAVE?: string;
  TAREA_BASE_PRUEBAS_URL?: string;
  TAREA_BASE_PRUEBAS_CLAVE?: string;
};

// Pide un solo auto a una base. Devuelve el problema, o null si anduvo.
async function despertar(nombre: string, url?: string, clave?: string): Promise<string | null> {
  if (!url || !clave) return `${nombre}: falta su dirección o su clave en los secretos del Worker`;
  try {
    const respuesta = await fetch(`${url}/rest/v1/autos?select=id&limit=1`, {
      headers: { apikey: clave },
    });
    return respuesta.ok ? null : `${nombre}: respondió ${respuesta.status}`;
  } catch (error) {
    return `${nombre}: ${error instanceof Error ? error.message : String(error)}`;
  }
}

const worker = {
  async fetch(request: Request, env: unknown, ctx: Contexto): Promise<Response> {
    const respuesta: Response = await handler.fetch(request, env, ctx);
    if (!new URL(request.url).hostname.endsWith(".workers.dev")) return respuesta;

    const copia = new Response(respuesta.body, respuesta);
    copia.headers.set("X-Robots-Tag", "noindex");
    return copia;
  },

  // La tarea diaria va directo a cada base, sin pasar por Next.js: arrancar Next.js
  // gasta más que los 10 ms de CPU que da el plan gratis por tarea, y la tarea se
  // cortaba. Esperar la respuesta de la base no cuenta como CPU.
  async scheduled(_controlador: unknown, env: Entorno): Promise<void> {
    const problemas = (
      await Promise.all([
        despertar("base principal", env.TAREA_BASE_PRINCIPAL_URL, env.TAREA_BASE_PRINCIPAL_CLAVE),
        despertar("base de pruebas", env.TAREA_BASE_PRUEBAS_URL, env.TAREA_BASE_PRUEBAS_CLAVE),
      ])
    ).filter(Boolean);

    if (problemas.length > 0) throw new Error(`La tarea diaria falló: ${problemas.join(" · ")}`);
    console.log("Tarea diaria: las dos bases respondieron");
  },
};

export default worker;

// La cola que rehace las páginas vencidas (ver `open-next.config.ts`).
// @ts-expect-error: se genera al armar, no está en el repo.
export { DOQueueHandler } from "./.open-next/worker.js";
