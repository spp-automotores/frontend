"use client";

import { useSyncExternalStore } from "react";

const consulta = "(prefers-reduced-motion: reduce)";

function suscribir(avisar: () => void) {
  const media = window.matchMedia(consulta);
  media.addEventListener("change", avisar);
  return () => media.removeEventListener("change", avisar);
}

/**
 * `true` si la persona pidió «reducir movimiento» en su teléfono o computadora.
 * En el servidor no se sabe: devuelve `enServidor`.
 */
export function useMenosMovimiento(enServidor: boolean): boolean {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(consulta).matches,
    () => enServidor,
  );
}
