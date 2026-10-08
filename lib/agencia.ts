// Datos de la agencia. Lo confirmado va escrito; lo pendiente va como `null` y el
// sitio no lo muestra (o lo muestra como pendiente) hasta que se cargue acá.

export const agencia = {
  nombre: "SPP Automotores",
  ciudad: "San Miguel de Tucumán",
  /** Frase de Sebastián para el Inicio. Va tal cual. */
  frase: {
    principio: "Comprá tu vehículo",
    final: "con seguridad, transparencia y facilidad.",
  },
  /** Sólo dígitos, con código de país y de área (54 9 381…). Mientras sea `null`, los botones no abren nada. */
  whatsapp: null as string | null,
  direccion: null as string | null,
  horarios: null as string | null,
  /** Año en que empezó la agencia; se muestra cuando esté confirmado. */
  fundacion: null as number | null,
  redes: {
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
  },
  mail: null as string | null,
};

export type IconoServicio = "financiacion" | "permuta" | "tramites" | "entrega";

/** Sólo los servicios confirmados por la agencia. */
export const servicios: { icono: IconoServicio; titulo: string; texto: string }[] = [
  {
    icono: "financiacion",
    titulo: "Financiación bancaria",
    texto: "Crédito UVA o tradicional. Sólo con DNI, sin garante.",
  },
  {
    icono: "permuta",
    titulo: "Permuta",
    texto: "Tomamos tu usado como parte de pago, si está en buenas condiciones.",
  },
  {
    icono: "tramites",
    titulo: "Todos los trámites",
    texto: "Transferencia y papeles al día. Nos ocupamos nosotros.",
  },
  {
    icono: "entrega",
    titulo: "Entrega a domicilio",
    texto: "Te llevamos el auto a tu casa, y si hace falta buscamos el tuyo.",
  },
];

/** Las tres palabras con que la agencia se define, cada una con un hecho. */
export const porQue: { titulo: string; texto: string }[] = [
  {
    titulo: "Confianza",
    texto:
      "Trabajamos sobre todo con autos cuya historia conocemos: los vendimos 0 km o conocemos a su dueño.",
  },
  {
    titulo: "Transparencia",
    texto: "Cada auto con los papeles al día, sin deudas ni multas.",
  },
  {
    titulo: "Trayectoria",
    texto: agencia.fundacion
      ? `Agencia familiar de ${agencia.ciudad}, desde ${agencia.fundacion}.`
      : `Agencia familiar de ${agencia.ciudad}.`,
  },
];
