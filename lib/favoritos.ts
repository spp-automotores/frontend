"use client";

import { useSyncExternalStore } from "react";

/**
 * Favoritos: los `id` de los autos que la persona guardó con el corazón, el último
 * primero. Viven en el navegador de quien mira (sin cuenta), así que sólo existen
 * con JavaScript. Se guarda el `id` y no la dirección: si cambia el nombre del
 * auto, cambia la dirección, pero el `id` sigue igual.
 */

const clave = "spp-favoritos";
const aviso = "spp-favoritos-cambio";
const maximo = 100;

// Si el navegador no deja guardar (por ejemplo, algunos modos privados), los
// favoritos duran mientras la página esté abierta.
let enMemoria: string[] = [];
// La misma lista para el mismo texto guardado: React compara por referencia.
let ultimo: { texto: string | null; lista: string[] } = { texto: null, lista: [] };

function limpiar(valor: unknown): string[] {
  if (!Array.isArray(valor)) return [];
  const ids = valor.filter((id): id is string => typeof id === "string" && id.length > 0);
  return [...new Set(ids)].slice(0, maximo);
}

function leer(): string[] {
  let texto: string | null;
  try {
    texto = window.localStorage.getItem(clave);
  } catch {
    return enMemoria;
  }
  if (texto === ultimo.texto) return ultimo.lista;
  let lista: string[] = [];
  try {
    lista = texto ? limpiar(JSON.parse(texto)) : [];
  } catch {
    // Un texto roto se trata como lista vacía.
  }
  ultimo = { texto, lista };
  return lista;
}

function guardar(lista: string[]) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(lista));
  } catch {
    enMemoria = lista;
  }
  window.dispatchEvent(new Event(aviso));
}

function suscribir(avisar: () => void) {
  // `storage` llega cuando cambian los favoritos en otra pestaña.
  window.addEventListener("storage", avisar);
  window.addEventListener(aviso, avisar);
  return () => {
    window.removeEventListener("storage", avisar);
    window.removeEventListener(aviso, avisar);
  };
}

/** La lista de favoritos, o `null` mientras no se sabe (en el servidor y antes de que corra JavaScript). */
export function useFavoritos(): string[] | null {
  return useSyncExternalStore(suscribir, leer, () => null);
}

/** Guarda el auto (queda primero) o lo saca si ya estaba. */
export function alternarFavorito(id: string) {
  const lista = leer();
  guardar(lista.includes(id) ? lista.filter((otro) => otro !== id) : [id, ...lista].slice(0, maximo));
}
