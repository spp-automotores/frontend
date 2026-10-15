import "server-only";
import {
  type Auto,
  type Caja,
  type Combustible,
  type Estado,
  type Foto,
  type Tipo,
  estaALaVista,
} from "@/lib/autos";
import { fechaDeHoy } from "@/lib/fechas";
import { supabase } from "@/lib/supabase";

// Traer los autos de la base. Sólo lo usan las páginas, en el servidor: lo que
// también corre en el navegador (nombre, precio, link) queda en `lib/autos.ts`.
//
// Los autos salen de la tabla `autos` de la base (ver `supabase/migrations/`).
// Las columnas van en snake_case; acá se pasan a los nombres del tipo `Auto`.

type FilaAuto = {
  id: string;
  slug: string;
  ejemplo: boolean;
  marca: string;
  modelo: string;
  version: string | null;
  anio: number;
  km: number;
  combustible: Combustible;
  caja: Caja;
  tipo: Tipo | null;
  color: string | null;
  motor: string | null;
  puertas: number | null;
  unico_dueno: boolean | null;
  mantenimientos: string | null;
  service_al_dia: boolean | null;
  precio: number | null;
  estado: Estado;
  descripcion: string | null;
  fotos: Foto[];
  ingresado_el: string;
  vendido_el: string | null;
};

function aAuto(fila: FilaAuto): Auto {
  return {
    id: fila.id,
    slug: fila.slug,
    ...(fila.ejemplo && { ejemplo: true }),
    marca: fila.marca,
    modelo: fila.modelo,
    version: fila.version,
    anio: fila.anio,
    km: fila.km,
    combustible: fila.combustible,
    caja: fila.caja,
    tipo: fila.tipo,
    color: fila.color,
    motor: fila.motor,
    puertas: fila.puertas,
    unicoDueno: fila.unico_dueno,
    mantenimientos: fila.mantenimientos,
    serviceAlDia: fila.service_al_dia,
    precio: fila.precio,
    estado: fila.estado,
    descripcion: fila.descripcion,
    fotos: fila.fotos,
    ingresadoEl: fila.ingresado_el,
    vendidoEl: fila.vendido_el,
  };
}

/**
 * Todos los autos, incluidos los vendidos ocultos, del más nuevo al más viejo.
 * Si la base no contesta, falla: mejor no publicar que publicar un sitio sin autos
 * (al rearmar una página, queda la versión anterior).
 */
export async function traerAutos(): Promise<Auto[]> {
  const { data, error } = await supabase
    .from("autos")
    .select("*")
    .order("ingresado_el", { ascending: false })
    .order("creado_el", { ascending: false });
  if (error) throw new Error(`No se pudieron traer los autos: ${error.message}`);
  return (data as FilaAuto[]).map(aAuto);
}

/** Los autos que se muestran en las listas, del más nuevo al más viejo. */
export async function traerAutosALaVista(): Promise<Auto[]> {
  const hoy = fechaDeHoy();
  return (await traerAutos()).filter((auto) => estaALaVista(auto, hoy));
}

/** Los últimos autos cargados, del más nuevo al más viejo. */
export async function traerRecienIngresados(cantidad = 4): Promise<Auto[]> {
  return (await traerAutosALaVista()).slice(0, cantidad);
}

/** El auto de esa dirección (aunque esté vendido y oculto), o `null` si no existe. */
export async function traerAuto(slug: string): Promise<Auto | null> {
  return (await traerAutos()).find((auto) => auto.slug === slug) ?? null;
}

/** Otros autos para mostrar abajo de uno: los más nuevos, sin ese. */
export async function traerOtrosAutos(slug: string, cantidad = 3): Promise<Auto[]> {
  return (await traerAutosALaVista()).filter((auto) => auto.slug !== slug).slice(0, cantidad);
}
