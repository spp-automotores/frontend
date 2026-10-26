import { supabaseSinGuardar } from "@/lib/supabase";

// Tarea diaria: una consulta liviana a la base, para que el plan gratis de Supabase
// no la pause por falta de uso (la pausa después de 7 días quietos).
// La llama el Worker de Cloudflare una vez por día (`scheduled` en `worker.ts`), con una
// clave de un solo uso que deja en `globalThis` mientras dura la llamada. Sin esa clave
// (cualquier pedido de afuera), no hace nada.

export async function GET(request: Request) {
  const clave = globalThis.__claveDeLaTareaDiaria;
  if (!clave || request.headers.get("authorization") !== `Bearer ${clave}`) {
    return new Response("No autorizado", { status: 401 });
  }

  const { error } = await supabaseSinGuardar.from("autos").select("id").limit(1);
  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
  return Response.json({ ok: true });
}

declare global {
  var __claveDeLaTareaDiaria: string | undefined;
}
