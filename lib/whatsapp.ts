import { agencia } from "@/lib/agencia";
import { type Auto, direccionDelAuto, nombreDelAuto } from "@/lib/autos";

/** Link a WhatsApp con el mensaje armado, o `null` si todavía no hay número. */
export function linkDeWhatsapp(mensaje: string): string | null {
  if (!agencia.whatsapp) return null;
  return `https://wa.me/${agencia.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Lleva el link del auto, para que la agencia lo abra con un toque. */
export function mensajeDeConsulta(auto: Auto): string {
  const link = new URL(direccionDelAuto(auto), agencia.sitio).toString();
  return `Hola, quiero consultar por el ${nombreDelAuto(auto)} ${auto.anio} que vi en la web: ${link}`;
}

export const mensajeGeneral = "Hola, quiero hacer una consulta.";

export const mensajeDeVenta =
  "Hola, quiero vender mi auto.\nMarca:\nModelo:\nAño:\nKilómetros:";
