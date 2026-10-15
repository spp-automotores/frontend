import "server-only";
import { createClient } from "@supabase/supabase-js";

// Conexión con la base de datos para leer (los autos). Corre sólo en el servidor:
// el navegador de quien visita no habla con la base ni descarga esta librería.
//
// Las respuestas quedan guardadas 1 hora (`revalidate`): las visitas nunca esperan
// a la base. La etiqueta «autos» sirve para renovarlas antes, al guardar desde el panel.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !clave) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ver .env.example).",
  );
}

export const unaHora = 60 * 60;
export const etiquetaAutos = "autos";

export const supabase = createClient(url, clave, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (entrada, opciones) =>
      fetch(entrada, {
        ...opciones,
        next: { revalidate: unaHora, tags: [etiquetaAutos] },
      }),
  },
});

/** La misma conexión, pero sin guardar la respuesta: para la tarea diaria. */
export const supabaseSinGuardar = createClient(url, clave, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (entrada, opciones) => fetch(entrada, { ...opciones, cache: "no-store" }) },
});
