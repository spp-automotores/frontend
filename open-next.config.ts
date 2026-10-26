import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

// Cómo guarda el sitio sus páginas en Cloudflare (ver `wrangler.jsonc` y
// https://opennext.js.org/cloudflare/caching):
// - KV: las páginas y las respuestas de la base, hasta 1 hora (`revalidate`).
// - D1: cuándo se borró cada etiqueta (`updateTag("autos")` al guardar en el panel).
// - Durable Objects: la cola que rehace en segundo plano las páginas vencidas.
// Las claves de KV y D1 llevan el número de cada armado: un link de prueba nunca
// pisa lo que guardó el sitio publicado.

export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  queue: doQueue,
  // Sirve las páginas guardadas sin cargar Next.js: menos trabajo por visita.
  enableCacheInterception: true,
});
