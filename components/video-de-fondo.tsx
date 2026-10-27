"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { useMenosMovimiento } from "@/lib/use-menos-movimiento";

type Props = {
  src: string;
  poster: string;
  /** Qué parte del cuadro queda a la vista cuando la pantalla lo recorta (por ejemplo, en el celular). */
  encuadre: string;
};

function suscribirACarga(avisar: () => void) {
  window.addEventListener("load", avisar);
  return () => window.removeEventListener("load", avisar);
}

/**
 * Video de fondo sin sonido, en bucle. Debajo siempre está su cuadro fijo: se ve
 * mientras el video carga, y en su lugar si la persona pidió «reducir movimiento»
 * (en ese caso el video ni se descarga).
 */
export function VideoDeFondo({ src, poster, encuadre }: Props) {
  // En el servidor se asume «reducir movimiento»: el video se suma recién en el navegador.
  const menosMovimiento = useMenosMovimiento(true);
  // El video pesa varios megas: empieza a bajar recién cuando el resto de la página
  // terminó de cargar, para no quitarle velocidad al título y a las fotos.
  const paginaCargada = useSyncExternalStore(
    suscribirACarga,
    () => document.readyState === "complete",
    () => false,
  );

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Image
        src={poster}
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: encuadre }}
      />
      {!menosMovimiento && paginaCargada && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: encuadre }}
        />
      )}
    </div>
  );
}
