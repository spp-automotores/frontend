"use server";

import { isAuthWeakPasswordError, type SupabaseClient } from "@supabase/supabase-js";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { type Auto, type Estado, estados } from "@/lib/autos";
import { largoMinimoDeContrasena } from "@/lib/contrasena";
import {
  type ErroresDelAuto,
  type ValoresDelAuto,
  aFilaDeLaBase,
  baseDelSlug,
  fechaDeVenta,
  leerFormularioDelAuto,
  slugLibre,
  valoresDelFormulario,
} from "@/lib/formulario-del-auto";
import { tieneMarcaDeAdmin } from "@/lib/marca-de-admin";
import { conexionDelPanel, verificarAdmin } from "@/lib/sesion";
import { etiquetaAutos } from "@/lib/supabase";
import { esIdDeAuto } from "@/lib/traer-autos";

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

// «Cargar un auto» y «Editar». Si algo está mal, vuelve lo escrito (no se pierde nada) con
// el error al lado de cada campo. Si sale bien, a la administración, con el aviso de listo.
// Hasta el paso de las fotos, un auto se guarda sin fotos (o con las que ya tenía).
//
// Después de cada cambio, `updateTag` borra lo que el sitio guardaba de la base (hasta 1 hora):
// la próxima visita lee lo nuevo. Sin esto, la página de un auto recién cargado daría «no
// encontrado» hasta que venza esa hora, porque todas las páginas leen la misma lista guardada.

export type EstadoDelFormularioDelAuto = {
  errores: ErroresDelAuto;
  /** Un error que no es de un campo (la conexión, la base). */
  error: string | null;
  valores: ValoresDelAuto;
};

const noSePudoGuardar = "No se pudo guardar. Probá de nuevo en un momento.";

export async function cargarAuto(
  _anterior: EstadoDelFormularioDelAuto,
  formulario: FormData,
): Promise<EstadoDelFormularioDelAuto> {
  const { supabase } = await verificarAdmin();
  const valores = valoresDelFormulario(formulario);
  const lectura = leerFormularioDelAuto(valores);
  if (!lectura.ok) return { errores: lectura.errores, error: null, valores };
  const { datos } = lectura;

  // La dirección se elige libre; si otro auto la toma en el mismo momento, la base
  // la rechaza (es única) y se prueba una vez más con la siguiente.
  const base = baseDelSlug(datos.marca, datos.modelo, datos.anio);
  for (let intento = 0; intento < 2; intento++) {
    const { data: ocupados, error: errorAlBuscar } = await supabase
      .from("autos")
      .select("slug")
      .like("slug", `${base}%`);
    if (errorAlBuscar) break;

    const { data, error } = await supabase
      .from("autos")
      .insert({
        ...aFilaDeLaBase(datos),
        slug: slugLibre(base, (ocupados as { slug: string }[]).map((fila) => fila.slug)),
        vendido_el: fechaDeVenta(datos.estado, null),
      })
      .select("id")
      .single();

    if (!error) {
      updateTag(etiquetaAutos);
      redirect(`/admin?cargado=${data.id}`);
    }
    if (error.code !== "23505") {
      console.error(error);
      break;
    }
  }
  return { errores: {}, error: noSePudoGuardar, valores };
}

type EstadoAnterior = Pick<Auto, "estado" | "vendidoEl">;

/** El estado que tiene el auto ahora en la base: hace falta para saber su fecha de venta. */
async function estadoAnterior(supabase: SupabaseClient, id: string): Promise<EstadoAnterior | null> {
  const { data } = await supabase.from("autos").select("estado, vendido_el").eq("id", id).maybeSingle();
  return data && { estado: data.estado as Estado, vendidoEl: data.vendido_el as string | null };
}

const yaNoEsta = "Este auto ya no está en la lista. Volvé a la administración.";

export async function editarAuto(
  id: string,
  _anterior: EstadoDelFormularioDelAuto,
  formulario: FormData,
): Promise<EstadoDelFormularioDelAuto> {
  const { supabase } = await verificarAdmin();
  const valores = valoresDelFormulario(formulario);
  const lectura = leerFormularioDelAuto(valores);
  if (!lectura.ok) return { errores: lectura.errores, error: null, valores };
  const { datos } = lectura;

  if (!esIdDeAuto(id)) return { errores: {}, error: yaNoEsta, valores };
  const anterior = await estadoAnterior(supabase, id);
  if (!anterior) return { errores: {}, error: yaNoEsta, valores };

  // La dirección (`slug`) no se toca: los links que ya se compartieron siguen andando.
  const { data, error } = await supabase
    .from("autos")
    .update({ ...aFilaDeLaBase(datos), vendido_el: fechaDeVenta(datos.estado, anterior) })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error(error);
    return { errores: {}, error: noSePudoGuardar, valores };
  }
  if (data.length === 0) return { errores: {}, error: yaNoEsta, valores };
  updateTag(etiquetaAutos);
  redirect(`/admin?editado=${id}`);
}

// «Marcar vendido o reservado»: un toque por auto, sin abrir el formulario.

export type EstadoDelCambio = { error: string | null };

export async function cambiarEstado(
  _anterior: EstadoDelCambio,
  formulario: FormData,
): Promise<EstadoDelCambio> {
  const { supabase } = await verificarAdmin();
  const id = String(formulario.get("id") ?? "");
  const estado = estados.find((opcion) => opcion === formulario.get("estado"));
  if (!estado || !esIdDeAuto(id)) return { error: "No se pudo cambiar. Recargá la página." };

  const anterior = await estadoAnterior(supabase, id);
  if (!anterior) return { error: yaNoEsta };

  if (anterior.estado !== estado) {
    const { data, error } = await supabase
      .from("autos")
      .update({ estado, vendido_el: fechaDeVenta(estado, anterior) })
      .eq("id", id)
      .select("id");
    if (error || data.length === 0) {
      if (error) console.error(error);
      return { error: "No se pudo cambiar. Probá de nuevo en un momento." };
    }
    updateTag(etiquetaAutos);
  }

  refresh();
  return { error: null };
}

export async function salir() {
  const supabase = await conexionDelPanel();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/admin/entrar");
}
