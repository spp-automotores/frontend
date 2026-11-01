import { createClient } from "@supabase/supabase-js";
import { supabaseSinGuardar } from "@/lib/supabase";

// Tarea diaria: una consulta liviana a cada base (la de producción y la de pruebas), para
// que el plan gratis de Supabase no las pause por falta de uso (las pausa después de 7
// días quietas). La de pruebas también: los links de prueba no corren tareas.
// La llama el Worker de Cloudflare una vez por día (`scheduled` en `worker.ts`), con una
// clave de un solo uso que deja en `globalThis` mientras dura la llamada. Sin esa clave
// (cualquier pedido de afuera), no hace nada.

const pruebas = {
  url: process.env.SUPABASE_PRUEBAS_URL,
  clave: process.env.SUPABASE_PRUEBAS_PUBLISHABLE_KEY,
};

async function consultar(nombre: string, conexion: typeof supabaseSinGuardar) {
  const { error } = await conexion.from("autos").select("id").limit(1);
  return error ? `${nombre}: ${error.message}` : null;
}

export async function GET(request: Request) {
  const clave = globalThis.__claveDeLaTareaDiaria;
  if (!clave || request.headers.get("authorization") !== `Bearer ${clave}`) {
    return new Response("No autorizado", { status: 401 });
  }

  const consultas = [consultar("base principal", supabaseSinGuardar)];
  // Si esta ya es la base de pruebas (fuera de producción), no hace falta repetirla.
  if (pruebas.url && pruebas.clave && pruebas.url !== process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const conexion = createClient(pruebas.url, pruebas.clave, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (entrada, opciones) => fetch(entrada, { ...opciones, cache: "no-store" }) },
    });
    consultas.push(consultar("base de pruebas", conexion));
  }

  const errores = (await Promise.all(consultas)).filter(Boolean);
  if (errores.length > 0) {
    return Response.json({ ok: false, errores }, { status: 500 });
  }
  return Response.json({ ok: true, bases: consultas.length });
}

declare global {
  var __claveDeLaTareaDiaria: string | undefined;
}
