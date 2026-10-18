import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { tieneMarcaDeAdmin } from "@/lib/marca-de-admin";

// Corre sólo en `/admin` (ver `config` abajo): el sitio público ni se entera.
// Renueva la sesión del panel y manda a entrar a quien no la tiene. Es el chequeo
// rápido, no la pared: cada página y cada acción del panel llama a `verificarAdmin()`
// (`lib/sesion.ts`), y la base tiene sus propias reglas.

const entrar = "/admin/entrar";

export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });
  // Lo que Supabase pide sumar a la respuesta cuando cambia la sesión (que no se guarde en caché).
  const encabezados: Record<string, string> = {};

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(aGuardar, extra) {
          // La página tiene que ver la sesión nueva (cookies del pedido) y el navegador
          // guardarla (cookies de la respuesta).
          aGuardar.forEach(({ name, value }) => request.cookies.set(name, value));
          respuesta = NextResponse.next({ request });
          aGuardar.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
          Object.assign(encabezados, extra);
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const datos = data?.claims;
  const esAdmin = tieneMarcaDeAdmin(datos?.app_metadata);

  // Una cuenta sin la marca de administrador no tiene nada que hacer en el panel:
  // se cierra su sesión acá (una página no puede borrar cookies).
  if (datos && !esAdmin) await supabase.auth.signOut({ scope: "local" });

  // Sólo se redirige al abrir una página. Las acciones del panel (enviar un
  // formulario) pasan siempre: cada una revisa la sesión por su cuenta.
  const abrePagina = request.method === "GET" || request.method === "HEAD";
  const enEntrar = request.nextUrl.pathname === entrar;
  let destino: string | null = null;
  if (abrePagina && esAdmin && enEntrar) destino = "/admin";
  if (abrePagina && !esAdmin && !enEntrar) destino = datos ? `${entrar}?sin-acceso` : entrar;

  if (destino) {
    const redireccion = NextResponse.redirect(new URL(destino, request.url));
    respuesta.cookies.getAll().forEach((cookie) => redireccion.cookies.set(cookie));
    respuesta = redireccion;
  }
  Object.entries(encabezados).forEach(([nombre, valor]) => respuesta.headers.set(nombre, valor));
  return respuesta;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
