import { autosDeEjemplo } from "@/lib/ejemplo";

// Contrato de un auto: lo usan el Inicio, el catálogo, la página de cada auto
// y el panel. Lo que todavía no se sabe va como `null`, nunca inventado.

export type Estado = "Disponible" | "Reservado" | "Vendido";
export type Combustible = "Nafta" | "Diésel";
export type Caja = "Manual" | "Automática";
export type Tipo = "SUV" | "Pickup" | "Sedán" | "Hatchback";

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
  fotos: Foto[];
  /** Fecha en que se cargó el auto (AAAA-MM-DD). */
  ingresadoEl: string;
};

// Hoy estas funciones leen los autos de ejemplo; cuando esté la base de datos,
// cambian sólo ellas.

/** Todos los autos, del más nuevo al más viejo. */
export async function traerAutos(): Promise<Auto[]> {
  return [...autosDeEjemplo].sort((a, b) => b.ingresadoEl.localeCompare(a.ingresadoEl));
}

/** Los últimos autos cargados, del más nuevo al más viejo. */
export async function traerRecienIngresados(cantidad = 4): Promise<Auto[]> {
  return (await traerAutos()).slice(0, cantidad);
}

/** El auto de esa dirección, o `null` si no existe. */
export async function traerAuto(slug: string): Promise<Auto | null> {
  return (await traerAutos()).find((auto) => auto.slug === slug) ?? null;
}

/** Otros autos para mostrar abajo de uno: los más nuevos, sin ese. */
export async function traerOtrosAutos(slug: string, cantidad = 3): Promise<Auto[]> {
  return (await traerAutos()).filter((auto) => auto.slug !== slug).slice(0, cantidad);
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
