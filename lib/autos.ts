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
  fotos: Foto[];
  /** Fecha en que se cargó el auto (AAAA-MM-DD). */
  ingresadoEl: string;
};

/**
 * Los últimos autos cargados, del más nuevo al más viejo.
 * Hoy lee los autos de ejemplo; cuando esté la base de datos, cambia sólo esta función.
 */
export async function traerRecienIngresados(cantidad = 4): Promise<Auto[]> {
  return [...autosDeEjemplo]
    .sort((a, b) => b.ingresadoEl.localeCompare(a.ingresadoEl))
    .slice(0, cantidad);
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

export function formatearKm(km: number): string {
  return `${numero.format(km)} km`;
}
