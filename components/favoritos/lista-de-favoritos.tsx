"use client";

import { type ReactNode, useState } from "react";
import { useFavoritos } from "@/lib/favoritos";

/**
 * El servidor no puede leer los favoritos (viven en el navegador): manda las tarjetas
 * de todos los autos y acá se muestran sólo las guardadas, la última primero.
 * Un auto que se saca en esta página sigue a la vista hasta salir: un toque sin querer
 * se deshace con otro toque.
 */
export function ListaDeFavoritos({
  tarjetas,
  sinFavoritos,
}: {
  tarjetas: { id: string; tarjeta: ReactNode }[];
  sinFavoritos: ReactNode;
}) {
  const favoritos = useFavoritos();
  const [vistos, setVistos] = useState<string[]>([]);

  if (favoritos !== null) {
    const nuevos = favoritos.filter((id) => !vistos.includes(id));
    if (nuevos.length > 0) setVistos([...nuevos, ...vistos]);
  }

  if (favoritos === null) {
    return (
      <noscript>
        <p className="mt-8 text-muted-foreground">
          Los favoritos se guardan en este navegador y necesitan JavaScript activado.
        </p>
      </noscript>
    );
  }

  const porId = new Map(tarjetas.map((t) => [t.id, t.tarjeta]));
  const mostrados = vistos.filter((id) => porId.has(id));
  if (mostrados.length === 0) return sinFavoritos;

  const cantidad = favoritos.filter((id) => porId.has(id)).length;

  return (
    <>
      <p className="mt-3 text-sm text-muted-foreground tabular-nums" aria-live="polite">
        {cantidad} {cantidad === 1 ? "auto guardado" : "autos guardados"}
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {mostrados.map((id) => (
          <li key={id}>{porId.get(id)}</li>
        ))}
      </ul>
    </>
  );
}
