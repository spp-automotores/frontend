import { supabaseSinGuardar } from "@/lib/supabase";

// Tarea diaria (ver `vercel.json`): una consulta liviana a la base, para que el plan
// gratis de Supabase no la pause por falta de uso (la pausa después de 7 días quietos).
// Vercel la llama una vez por día, sólo en el sitio publicado (rama `main`), y manda
// la clave CRON_SECRET; sin esa clave, no hace nada.

export async function GET(request: Request) {
  const clave = process.env.CRON_SECRET;
  if (!clave || request.headers.get("authorization") !== `Bearer ${clave}`) {
    return new Response("No autorizado", { status: 401 });
  }

  const { error } = await supabaseSinGuardar.from("autos").select("id").limit(1);
  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
  return Response.json({ ok: true });
}
