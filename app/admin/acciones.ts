"use server";

import { redirect } from "next/navigation";
import { tieneMarcaDeAdmin } from "@/lib/marca-de-admin";
import { conexionDelPanel } from "@/lib/sesion";

// Acciones del panel. Cada una es como una dirección pública más (cualquiera puede
// llamarla): las que cambien datos tienen que llamar a `verificarAdmin()` primero.

export type EstadoEntrar = { error: string | null; email: string };

export async function entrar(_anterior: EstadoEntrar, formulario: FormData): Promise<EstadoEntrar> {
  const email = String(formulario.get("email") ?? "").trim();
  const contrasena = String(formulario.get("contrasena") ?? "");

  if (!email || !contrasena) {
    return { error: "Completá el email y la contraseña.", email };
  }

  const supabase = await conexionDelPanel();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: contrasena });

  if (error) {
    if (error.status === 429) {
      return { error: "Demasiados intentos, esperá unos minutos.", email };
    }
    // Sin decir cuál de los dos falló: así no se puede averiguar qué emails tienen cuenta.
    if (error.status && error.status < 500) {
      return { error: "El email o la contraseña no coinciden.", email };
    }
    return { error: "No se pudo entrar. Probá de nuevo en un rato.", email };
  }

  if (!tieneMarcaDeAdmin(data.user.app_metadata)) {
    await supabase.auth.signOut({ scope: "local" });
    return { error: "Esta cuenta no tiene acceso al panel.", email };
  }

  redirect("/admin");
}

export async function salir() {
  const supabase = await conexionDelPanel();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/admin/entrar");
}
