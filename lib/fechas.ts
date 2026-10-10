// Fechas del sitio, siempre en la hora de Tucumán: el servidor puede estar en
// otra zona horaria y, de noche, ya sería «mañana» para él.

const zonaHoraria = "America/Argentina/Tucuman";

// «en-CA» escribe las fechas como AAAA-MM-DD, el mismo formato de los datos.
const aaaaMmDd = new Intl.DateTimeFormat("en-CA", {
  timeZone: zonaHoraria,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const unDia = 24 * 60 * 60 * 1000;

/** La fecha de hoy en Tucumán (AAAA-MM-DD). */
export function fechaDeHoy(): string {
  return aaaaMmDd.format(new Date());
}

/** La fecha de hace `dias` días (AAAA-MM-DD). */
export function haceDias(dias: number): string {
  return aaaaMmDd.format(new Date(Date.parse(fechaDeHoy()) - dias * unDia));
}

/** Días enteros entre dos fechas AAAA-MM-DD (positivo si `hasta` es después de `desde`). */
export function diasEntre(desde: string, hasta: string): number {
  return Math.round((Date.parse(hasta) - Date.parse(desde)) / unDia);
}
