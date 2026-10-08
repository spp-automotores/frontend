import { agencia } from "@/lib/agencia";
import { type Auto, nombreDelAuto } from "@/lib/autos";

/** Link a WhatsApp con el mensaje armado, o `null` si todavía no hay número. */
export function linkDeWhatsapp(mensaje: string): string | null {
  if (!agencia.whatsapp) return null;
  return `https://wa.me/${agencia.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export function mensajeDeConsulta(auto: Auto): string {
  return `Hola, quiero consultar por el ${nombreDelAuto(auto)} ${auto.anio} que vi en la web.`;
}

export const mensajeGeneral = "Hola, quiero hacer una consulta.";

export const mensajeDeVenta =
  "Hola, quiero vender mi auto.\nMarca:\nModelo:\nAño:\nKilómetros:";
