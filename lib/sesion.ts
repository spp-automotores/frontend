import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { tieneMarcaDeAdmin } from "@/lib/marca-de-admin";

// La sesión del panel `/admin`. Es otra conexión con la base, distinta de la del
// sitio público (`lib/supabase.ts`): va con la sesión de quien entró, guardada en
// cookies, y nunca guarda respuestas (cada persona ve lo suyo).

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !clave) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ver .env.example).",
  );
}

/** Conexión con la base con la sesión de quien está en el panel. */
export async function conexionDelPanel() {
  const almacen = await cookies();

  return createServerClient(url!, clave!, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll(aGuardar) {
        try {
          aGuardar.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // Una página no puede guardar cookies (sólo una acción): la sesión
          // la renueva el Proxy (`proxy.ts`) antes de que la página se arme.
        }
      },
    },
    global: { fetch: (entrada, opciones) => fetch(entrada, { ...opciones, cache: "no-store" }) },
  });
}

/**
 * La pared del panel: la llama cada página y cada acción de `/admin`.
 * Sin sesión → a entrar. Con sesión pero sin la marca de administrador → a entrar,
 * con el aviso de que esa cuenta no tiene acceso (el Proxy cierra esa sesión).
 *
 * `getClaims()` revisa la firma de la sesión; `getSession()` no, y en el servidor
 * no hay que confiar en él.
 */
export const verificarAdmin = cache(async () => {
  const supabase = await conexionDelPanel();
  const { data } = await supabase.auth.getClaims();
  const datos = data?.claims;

  if (!datos) redirect("/admin/entrar");
  if (!tieneMarcaDeAdmin(datos.app_metadata)) redirect("/admin/entrar?sin-acceso");

  return { email: datos.email ?? null, supabase };
});
