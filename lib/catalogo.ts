import { type Auto, cajas, combustibles, tipos } from "@/lib/autos";

// Los filtros y el orden del catálogo viven en la dirección, por ejemplo
// `/autos?tipo=pickup&caja=automatica&orden=menor-precio`. Cada opción es un link
// común: anda sin JavaScript, se puede compartir y «atrás» la deshace.

type Grupo = {
  clave: string;
  titulo: string;
  /** El valor del auto para este filtro, como se muestra («Sedán», «Automática»). */
  valor: (auto: Auto) => string | null;
  /** Los valores posibles, en el orden en que se muestran. Sin lista: orden alfabético. */
  valores?: readonly string[];
};

export const grupos = [
  { clave: "tipo", titulo: "Tipo", valor: (auto) => auto.tipo, valores: tipos },
  { clave: "marca", titulo: "Marca", valor: (auto) => auto.marca },
  { clave: "caja", titulo: "Caja", valor: (auto) => auto.caja, valores: cajas },
  {
    clave: "combustible",
    titulo: "Combustible",
    valor: (auto) => auto.combustible,
    valores: combustibles,
  },
  {
    clave: "condicion",
    titulo: "0 km o usado",
    valor: (auto) => (auto.km === 0 ? "0 km" : "Usado"),
    valores: ["0 km", "Usado"],
  },
] as const satisfies readonly Grupo[];

export type ClaveDeFiltro = (typeof grupos)[number]["clave"];

const precioOFinal = (auto: Auto, signo: 1 | -1) =>
  auto.precio === null ? Infinity : signo * auto.precio;

export const ordenes = [
  {
    clave: "recientes",
    titulo: "Recién ingresados",
    comparar: (a: Auto, b: Auto) => b.ingresadoEl.localeCompare(a.ingresadoEl),
  },
  // Los «Consultar» (sin precio) quedan al final en los dos órdenes por precio.
  {
    clave: "menor-precio",
    titulo: "Menor precio",
    comparar: (a: Auto, b: Auto) => precioOFinal(a, 1) - precioOFinal(b, 1),
  },
  {
    clave: "mayor-precio",
    titulo: "Mayor precio",
    comparar: (a: Auto, b: Auto) => precioOFinal(a, -1) - precioOFinal(b, -1),
  },
  { clave: "menos-km", titulo: "Menos km", comparar: (a: Auto, b: Auto) => a.km - b.km },
  { clave: "mas-nuevos", titulo: "Más nuevos", comparar: (a: Auto, b: Auto) => b.anio - a.anio },
] as const;

export type ClaveDeOrden = (typeof ordenes)[number]["clave"];

/** Lo que pide la dirección, ya revisado: un valor raro no llega hasta acá. */
export type Busqueda = {
  /** Por cada filtro puesto, su valor en la dirección («automatica»). */
  filtros: Partial<Record<ClaveDeFiltro, string>>;
  orden: ClaveDeOrden;
};

/** «Sedán» → «sedan», «0 km» → «0-km»: el valor como va en la dirección. */
export function aDireccion(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Una marca puede ser cualquiera, pero tiene que tener forma de marca.
const pareceMarca = /^[a-z0-9-]{1,40}$/;

type Parametros = Record<string, string | string[] | undefined>;

const primero = (valor: string | string[] | undefined) =>
  Array.isArray(valor) ? valor[0] : valor;

/** Lee la dirección. Lo que no se reconoce (`?tipo=avion`) se ignora, no rompe la página. */
export function leerBusqueda(parametros: Parametros): Busqueda {
  const filtros: Busqueda["filtros"] = {};
  for (const grupo of grupos) {
    const pedido = primero(parametros[grupo.clave]);
    if (!pedido) continue;
    const valido =
      "valores" in grupo
        ? grupo.valores.some((valor) => aDireccion(valor) === pedido)
        : pareceMarca.test(pedido);
    if (valido) filtros[grupo.clave] = pedido;
  }
  const orden = ordenes.find((o) => o.clave === primero(parametros.orden))?.clave ?? "recientes";
  return { filtros, orden };
}

/** Si el auto cumple todos los filtros, salvo el de `menos` (para contar sus opciones). */
function cumple(auto: Auto, filtros: Busqueda["filtros"], menos?: ClaveDeFiltro): boolean {
  return grupos.every((grupo) => {
    const pedido = filtros[grupo.clave];
    if (!pedido || grupo.clave === menos) return true;
    const valor = grupo.valor(auto);
    return valor !== null && aDireccion(valor) === pedido;
  });
}

/** Los autos que pide la dirección, en su orden. Los vendidos, siempre al final. */
export function filtrarYOrdenar(autos: Auto[], busqueda: Busqueda): Auto[] {
  const { comparar } = ordenes.find((o) => o.clave === busqueda.orden)!;
  const recientes = ordenes[0].comparar;
  const vendido = (auto: Auto) => (auto.estado === "Vendido" ? 1 : 0);
  return autos
    .filter((auto) => cumple(auto, busqueda.filtros))
    .sort((a, b) => vendido(a) - vendido(b) || comparar(a, b) || recientes(a, b));
}

export type Opcion = { texto: string; enDireccion: string; cantidad: number; elegida: boolean };

/**
 * Los filtros que vale la pena mostrar, con sus opciones. Cada opción cuenta los
 * autos que quedarían con los demás filtros puestos: nunca aparece una que dé cero.
 * Un filtro con un solo valor en todo el catálogo (por ejemplo, sin ningún 0 km) no
 * se muestra: no separa nada.
 */
export function filtrosConOpciones(autos: Auto[], busqueda: Busqueda) {
  return grupos.flatMap((grupo) => {
    const elegido = busqueda.filtros[grupo.clave];
    const enTodos = new Set(autos.map(grupo.valor).filter((valor) => valor !== null));
    if (enTodos.size < 2 && !elegido) return [];

    const cantidades = new Map<string, number>();
    for (const auto of autos) {
      const valor = grupo.valor(auto);
      if (valor === null || !cumple(auto, busqueda.filtros, grupo.clave)) continue;
      cantidades.set(valor, (cantidades.get(valor) ?? 0) + 1);
    }

    const orden: readonly string[] =
      "valores" in grupo ? grupo.valores : [...cantidades.keys()].sort((a, b) => a.localeCompare(b, "es"));
    const opciones: Opcion[] = orden.flatMap((texto) => {
      const cantidad = cantidades.get(texto) ?? 0;
      const enDireccion = aDireccion(texto);
      const elegida = enDireccion === elegido;
      return cantidad > 0 || elegida ? [{ texto, enDireccion, cantidad, elegida }] : [];
    });
    // Un link viejo puede pedir una marca que ya no tiene autos: igual se muestra, para poder sacarla.
    if (elegido && !opciones.some((opcion) => opcion.elegida)) {
      // Sólo se sabe cómo va en la dirección («mercedes-benz»): se muestra «Mercedes Benz».
      const texto = elegido.replace(/-/g, " ").replace(/\b\w/g, (letra) => letra.toUpperCase());
      opciones.push({ texto, enDireccion: elegido, cantidad: 0, elegida: true });
    }

    return [{ clave: grupo.clave, titulo: grupo.titulo, opciones }];
  });
}

export type FiltroConOpciones = ReturnType<typeof filtrosConOpciones>[number];

/**
 * La dirección del catálogo con un cambio: poner o sacar un filtro (`null` lo saca),
 * o cambiar el orden. Las claves van siempre en el mismo orden, así un mismo pedido
 * tiene una sola dirección.
 */
export function direccionDelCatalogo(
  busqueda: Busqueda,
  cambio: { filtro: ClaveDeFiltro; valor: string | null } | { orden: ClaveDeOrden } | "nada" = "nada",
): string {
  const filtros = { ...busqueda.filtros };
  let orden = busqueda.orden;
  if (cambio !== "nada" && "orden" in cambio) orden = cambio.orden;
  else if (cambio !== "nada") {
    if (cambio.valor === null) delete filtros[cambio.filtro];
    else filtros[cambio.filtro] = cambio.valor;
  }

  const parametros = new URLSearchParams();
  for (const grupo of grupos) {
    const valor = filtros[grupo.clave];
    if (valor) parametros.set(grupo.clave, valor);
  }
  if (orden !== "recientes") parametros.set("orden", orden);
  const texto = parametros.toString();
  return texto ? `/autos?${texto}` : "/autos";
}
