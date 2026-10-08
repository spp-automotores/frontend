"use client";

import Image from "next/image";
import { useMenosMovimiento } from "@/lib/use-menos-movimiento";

type Props = { src: string; poster: string };

/**
 * Video de fondo sin sonido, en bucle. Debajo siempre está su cuadro fijo: se ve
 * mientras el video carga, y en su lugar si la persona pidió «reducir movimiento»
 * (en ese caso el video ni se descarga).
 */
export function VideoDeFondo({ src, poster }: Props) {
  // En el servidor se asume «reducir movimiento»: el video se suma recién en el navegador.
  const menosMovimiento = useMenosMovimiento(true);

  return (
    <div aria-hidden="true" className="absolute inset-0">
      {/* El auto del video pasa un poco a la derecha del centro: el recorte del celular lo sigue. */}
      <Image src={poster} alt="" fill preload sizes="100vw" className="object-cover object-[62%_50%]" />
      {!menosMovimiento && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 size-full object-cover object-[62%_50%]"
        />
      )}
    </div>
  );
}
