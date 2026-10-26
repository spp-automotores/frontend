import { agencia } from "@/lib/agencia";
import { diasEntre, fechaDeHoy } from "@/lib/fechas";

// Contrato de un auto: lo usan el Inicio, el catálogo, la página de cada auto
// y el panel. Lo que todavía no se sabe va como `null`, nunca inventado.

export const estados = ["Disponible", "Reservado", "Vendido"] as const;
export type Estado = (typeof estados)[number];

// Las listas son también los valores que aceptan los filtros del catálogo.
export const combustibles = ["Nafta", "Diésel"] as const;
export const cajas = ["Manual", "Automática"] as const;
export const tipos = ["SUV", "Pickup", "Sedán", "Hatchback"] as const;

export type Combustible = (typeof combustibles)[number];
export type Caja = (typeof cajas)[number];
export type Tipo = (typeof tipos)[number];

export type Foto = {
  src: string;
  alt: string;
  /** Página de origen de la foto, cuando no es propia (por ejemplo, Pexels). */
  fuente?: string;
};

export type Auto = {
  id: string;
  /** La parte de la dirección de su página: `/autos/<slug>` (marca-modelo-año). */
  slug: string;
  /** Sólo los autos de `lib/ejemplo.ts`: la página los marca como «Auto de ejemplo». */
  ejemplo?: boolean;
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
  unicoDueno: boolean | null;
  mantenimientos: string | null;
  serviceAlDia: boolean | null;
  /** En pesos. `null` = se muestra «Consultar». */
  precio: number | null;
  estado: Estado;
  /** Texto de la agencia sobre el auto, con sus palabras. */
  descripcion: string | null;
  /** Link del video del auto en la cuenta de TikTok de la agencia. */
  tiktok: string | null;
  fotos: Foto[];
  /** Fecha en que se cargó el auto (AAAA-MM-DD). */
  ingresadoEl: string;
  /** Fecha en que se marcó vendido (AAAA-MM-DD); `null` mientras no se vendió. */
  vendidoEl: string | null;
};

/**
 * Un auto se muestra en las listas (catálogo, Inicio, «Otros autos») salvo que se
 * haya vendido hace `diasVisibleVendido` días o más. Un vendido sin fecha no se
 * muestra: no se puede saber si es reciente. Su página existe igual.
 */
export function estaALaVista(auto: Auto, hoy = fechaDeHoy()): boolean {
  if (auto.estado !== "Vendido") return true;
  if (!auto.vendidoEl) return false;
  return diasEntre(auto.vendidoEl, hoy) < agencia.diasVisibleVendido;
}

/** Dirección de la página del auto, dentro del sitio. */
export function direccionDelAuto(auto: Auto): string {
  return `/autos/${auto.slug}`;
}

export function nombreDelAuto(auto: Auto): string {
  return [auto.marca, auto.modelo, auto.version].filter(Boolean).join(" ");
}

const pesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const numero = new Intl.NumberFormat("es-AR");

export function formatearPrecio(precio: number): string {
  return pesos.format(precio);
}

/** Lo que va en el lugar del precio: el precio, «Consultar» o «Vendido». */
export function textoDelPrecio(auto: Auto): string {
  if (auto.estado === "Vendido") return "Vendido";
  return auto.precio === null ? "Consultar" : formatearPrecio(auto.precio);
}

export function formatearKm(km: number): string {
  return `${numero.format(km)} km`;
}
