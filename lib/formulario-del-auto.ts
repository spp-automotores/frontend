import {
  type Auto,
  type Caja,
  type Combustible,
  type Estado,
  type Tipo,
  cajas,
  combustibles,
  estados,
  tipos,
} from "@/lib/autos";
import { fechaDeHoy } from "@/lib/fechas";

// Leer y revisar el formulario de «Cargar un auto» y de «Editar». Lo usan las dos
// acciones, con las mismas reglas que la tabla de la base (`supabase/migrations/`):
// lo que pasa acá, la base lo acepta. Cada campo del formulario se llama como el
// dato del tipo `Auto`.

export type CampoDelAuto =
  | "marca"
  | "modelo"
  | "version"
  | "anio"
  | "km"
  | "precio"
  | "estado"
  | "combustible"
  | "caja"
  | "tipo"
  | "color"
  | "motor"
  | "puertas"
  | "unicoDueno"
  | "serviceAlDia"
  | "mantenimientos"
  | "descripcion";

/** Lo escrito en cada campo, tal cual: vuelve al formulario si hay que corregir algo. */
export type ValoresDelAuto = Partial<Record<CampoDelAuto, string>>;
export type ErroresDelAuto = Partial<Record<CampoDelAuto, string>>;

/** Lo que se guarda de un auto desde el formulario (las fotos, la dirección y las fechas van aparte). */
export type DatosDelAuto = Omit<Auto, "id" | "slug" | "ejemplo" | "fotos" | "ingresadoEl" | "vendidoEl">;

export type LecturaDelAuto =
  | { ok: true; datos: DatosDelAuto }
  | { ok: false; errores: ErroresDelAuto };

const campos: CampoDelAuto[] = [
  "marca",
  "modelo",
  "version",
  "anio",
  "km",
  "precio",
  "estado",
  "combustible",
  "caja",
  "tipo",
  "color",
  "motor",
  "puertas",
  "unicoDueno",
  "serviceAlDia",
  "mantenimientos",
  "descripcion",
];

/** Cuántos caracteres entran en cada texto. */
export const largoMaximo = {
  marca: 40,
  modelo: 40,
  version: 60,
  color: 30,
  motor: 40,
  mantenimientos: 500,
  descripcion: 3000,
} as const;

export const anioMinimo = 1950;
/** Hasta el año que viene: los modelos nuevos salen con el año siguiente. */
export const anioMaximo = () => Number(fechaDeHoy().slice(0, 4)) + 1;
const kmMaximo = 9_999_999;

export function valoresDelFormulario(formulario: FormData): ValoresDelAuto {
  const valores: ValoresDelAuto = {};
  for (const campo of campos) {
    const valor = formulario.get(campo);
    if (typeof valor === "string") valores[campo] = valor;
  }
  return valores;
}

/**
 * Un número escrito como lo escribe cualquiera: «25.000.000», «$ 25000000» o «85 000».
 * `null` si está vacío; `NaN` si tiene algo que no es un número entero.
 */
export function leerNumero(texto: string | undefined): number | null {
  const limpio = (texto ?? "").replace(/[\s.$]/g, "");
  if (limpio === "") return null;
  if (!/^\d{1,15}$/.test(limpio)) return Number.NaN;
  return Number(limpio);
}

const siNo = (texto: string | undefined): boolean | null =>
  texto === "si" ? true : texto === "no" ? false : null;

const deLaLista = <T extends string>(lista: readonly T[], texto: string | undefined): T | null =>
  lista.find((opcion) => opcion === texto) ?? null;

/** Revisa todo el formulario de una vez: devuelve los datos listos, o todos los errores juntos. */
export function leerFormularioDelAuto(valores: ValoresDelAuto): LecturaDelAuto {
  const errores: ErroresDelAuto = {};

  const texto = (campo: keyof typeof largoMaximo, obligatorio?: string): string | null => {
    const valor = (valores[campo] ?? "").trim();
    if (valor === "") {
      if (obligatorio) errores[campo] = obligatorio;
      return null;
    }
    if (valor.length > largoMaximo[campo]) {
      errores[campo] = `Hasta ${largoMaximo[campo]} caracteres (tiene ${valor.length}).`;
    }
    return valor;
  };

  const marca = texto("marca", "Escribí la marca.");
  const modelo = texto("modelo", "Escribí el modelo.");
  const version = texto("version");
  const color = texto("color");
  const motor = texto("motor");
  const mantenimientos = texto("mantenimientos");
  const descripcion = texto("descripcion");

  const anio = leerNumero(valores.anio);
  const hastaElAnio = anioMaximo();
  if (anio === null) errores.anio = "Escribí el año.";
  else if (!(anio >= anioMinimo && anio <= hastaElAnio)) {
    errores.anio = `El año tiene que estar entre ${anioMinimo} y ${hastaElAnio}.`;
  }

  const km = leerNumero(valores.km);
  if (km === null) errores.km = "Escribí los km (0 si es 0 km).";
  else if (Number.isNaN(km)) errores.km = "Escribí sólo números (por ejemplo, 85.000).";
  else if (km > kmMaximo) errores.km = "Revisá los km: son demasiados.";

  const precio = leerNumero(valores.precio);
  if (precio !== null) {
    if (Number.isNaN(precio)) errores.precio = "Escribí sólo números (por ejemplo, 25.000.000).";
    else if (precio === 0) errores.precio = "Tiene que ser mayor a 0 (o dejalo vacío).";
  }

  const estado = deLaLista(estados, valores.estado);
  if (!estado) errores.estado = "Elegí el estado.";
  const combustible = deLaLista(combustibles, valores.combustible);
  if (!combustible) errores.combustible = "Elegí el combustible.";
  const caja = deLaLista(cajas, valores.caja);
  if (!caja) errores.caja = "Elegí la caja.";

  const tipo = deLaLista(tipos, valores.tipo);
  if (valores.tipo && !tipo) errores.tipo = "Elegí una de las opciones.";

  const puertas = leerNumero(valores.puertas);
  if (puertas !== null && !(puertas >= 2 && puertas <= 5)) errores.puertas = "Elegí una de las opciones.";

  if (Object.keys(errores).length > 0) return { ok: false, errores };

  return {
    ok: true,
    datos: {
      marca: marca!,
      modelo: modelo!,
      version,
      anio: anio!,
      km: km!,
      combustible: combustible as Combustible,
      caja: caja as Caja,
      tipo: tipo as Tipo | null,
      color,
      motor,
      puertas,
      unicoDueno: siNo(valores.unicoDueno),
      mantenimientos,
      serviceAlDia: siNo(valores.serviceAlDia),
      precio,
      estado: estado as Estado,
      descripcion,
    },
  };
}

const numero = new Intl.NumberFormat("es-AR");

/** Lo que muestra el formulario de «Editar» al abrir: los datos del auto como texto. */
export function valoresDeUnAuto(auto: Auto): ValoresDelAuto {
  const textoDeSiNo = (valor: boolean | null) => (valor === null ? "" : valor ? "si" : "no");
  return {
    marca: auto.marca,
    modelo: auto.modelo,
    version: auto.version ?? "",
    anio: String(auto.anio),
    km: numero.format(auto.km),
    precio: auto.precio === null ? "" : numero.format(auto.precio),
    estado: auto.estado,
    combustible: auto.combustible,
    caja: auto.caja,
    tipo: auto.tipo ?? "",
    color: auto.color ?? "",
    motor: auto.motor ?? "",
    puertas: auto.puertas === null ? "" : String(auto.puertas),
    unicoDueno: textoDeSiNo(auto.unicoDueno),
    serviceAlDia: textoDeSiNo(auto.serviceAlDia),
    mantenimientos: auto.mantenimientos ?? "",
    descripcion: auto.descripcion ?? "",
  };
}

/** Las columnas de la tabla (en snake_case) para guardar los datos. */
export function aFilaDeLaBase(datos: DatosDelAuto) {
  return {
    marca: datos.marca,
    modelo: datos.modelo,
    version: datos.version,
    anio: datos.anio,
    km: datos.km,
    combustible: datos.combustible,
    caja: datos.caja,
    tipo: datos.tipo,
    color: datos.color,
    motor: datos.motor,
    puertas: datos.puertas,
    unico_dueno: datos.unicoDueno,
    mantenimientos: datos.mantenimientos,
    service_al_dia: datos.serviceAlDia,
    precio: datos.precio,
    estado: datos.estado,
    descripcion: datos.descripcion,
  };
}

/**
 * La fecha de venta al guardar un estado. Al pasar a «Vendido», hoy (desde ahí cuentan
 * los días que sigue a la vista); si ya estaba vendido, la que tenía; si no está vendido,
 * ninguna (la base no acepta un auto no vendido con fecha de venta).
 */
export function fechaDeVenta(
  estado: Estado,
  anterior: Pick<Auto, "estado" | "vendidoEl"> | null,
  hoy = fechaDeHoy(),
): string | null {
  if (estado !== "Vendido") return null;
  if (anterior?.estado === "Vendido") return anterior.vendidoEl;
  return hoy;
}

/**
 * La dirección de un auto nuevo (`/autos/<slug>`): marca-modelo-año, sin tildes ni
 * símbolos. Se arma una sola vez, al cargarlo: si después se corrige la marca, la
 * dirección queda como estaba y los links que ya se compartieron siguen andando.
 */
export function baseDelSlug(marca: string, modelo: string, anio: number): string {
  const nombre = `${marca} ${modelo}`
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "");
  return nombre ? `${nombre}-${anio}` : `auto-${anio}`;
}

/** La base, o la base con `-2`, `-3`… si otro auto ya la usa. */
export function slugLibre(base: string, ocupados: Iterable<string>): string {
  const usados = new Set(ocupados);
  if (!usados.has(base)) return base;
  for (let n = 2; ; n++) {
    const slug = `${base}-${n}`;
    if (!usados.has(slug)) return slug;
  }
}
