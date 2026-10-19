"use server";

import { isAuthWeakPasswordError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { largoMinimoDeContrasena } from "@/lib/contrasena";
import { tieneMarcaDeAdmin } from "@/lib/marca-de-admin";
import { conexionDelPanel, verificarAdmin } from "@/lib/sesion";

// Acciones de la administración. Cada una es como una dirección pública más (cualquiera puede
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
    return { error: "Esta cuenta no tiene acceso a la administración.", email };
  }

  redirect("/admin");
}

export type CampoDeLaContrasena = "actual" | "nueva" | "repetir";
export type EstadoContrasena =
  | { listo: true }
  | { listo: false; error: string | null; campo: CampoDeLaContrasena | null };

export async function cambiarContrasena(
  _anterior: EstadoContrasena,
  formulario: FormData,
): Promise<EstadoContrasena> {
  const { supabase } = await verificarAdmin();
  const actual = String(formulario.get("actual") ?? "");
  const nueva = String(formulario.get("nueva") ?? "");
  const repetir = String(formulario.get("repetir") ?? "");
  const fallo = (error: string, campo: CampoDeLaContrasena | null = null): EstadoContrasena => ({
    listo: false,
    error,
    campo,
  });

  if (!actual) return fallo("Escribí tu contraseña actual.", "actual");
  if (nueva.length < largoMinimoDeContrasena) {
    return fallo(`La nueva tiene que tener al menos ${largoMinimoDeContrasena} caracteres.`, "nueva");
  }
  if (nueva !== repetir) return fallo("Las dos contraseñas nuevas no son iguales.", "repetir");
  if (nueva === actual) return fallo("La nueva tiene que ser distinta de la actual.", "nueva");

  // Supabase revisa la actual sólo si su configuración lo pide («require current password»);
  // si no, la ignora. Por eso esa opción tiene que estar prendida en el proyecto.
  const { error } = await supabase.auth.updateUser({ password: nueva, current_password: actual });

  if (!error) return { listo: true };
  if (error.code === "current_password_invalid" || error.code === "current_password_required") {
    return fallo("La contraseña actual no coincide.", "actual");
  }
  if (error.code === "same_password") {
    return fallo("La nueva tiene que ser distinta de la actual.", "nueva");
  }
  if (isAuthWeakPasswordError(error)) {
    if (error.reasons.includes("pwned")) {
      return fallo("Esa contraseña aparece en filtraciones de internet: elegí otra.", "nueva");
    }
    if (error.reasons.includes("characters")) {
      return fallo("Mezclá minúsculas, mayúsculas, números y símbolos.", "nueva");
    }
    return fallo("La contraseña nueva es demasiado corta.", "nueva");
  }
  // Supabase puede pedir una sesión reciente (de menos de 24 horas) para cambiarla.
  if (error.code === "reauthentication_needed") {
    return fallo("Por seguridad, tocá «Salir», volvé a entrar y probá de nuevo.");
  }
  if (error.status === 429) return fallo("Demasiados intentos, esperá unos minutos.");
  console.error(error);
  return fallo("No se pudo cambiar. Probá de nuevo en un rato.");
}

export async function salir() {
  const supabase = await conexionDelPanel();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/admin/entrar");
}
