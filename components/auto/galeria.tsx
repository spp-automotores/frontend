"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Foto } from "@/lib/autos";
import { useMenosMovimiento } from "@/lib/use-menos-movimiento";
import { cn } from "@/lib/utils";

const tamanoDeFoto = "(min-width: 1024px) 544px, 100vw";

/**
 * Fotos del auto: se deslizan con el dedo (el desplazamiento propio del navegador,
 * sin librería), con contador, flechas en la computadora y miniaturas para saltar
 * a una foto. Con una sola foto no hay contador, ni flechas, ni miniaturas.
 */
export function Galeria({ fotos, apagada }: { fotos: Foto[]; apagada: boolean }) {
  const riel = useRef<HTMLUListElement>(null);
  const [actual, setActual] = useState(0);
  const menosMovimiento = useMenosMovimiento(true);
  const varias = fotos.length > 1;

  function alDesplazar() {
    const el = riel.current;
    if (!el) return;
    setActual(Math.round(el.scrollLeft / el.clientWidth));
  }

  function irA(indice: number) {
    const el = riel.current;
    if (!el) return;
    el.scrollTo({ left: indice * el.clientWidth, behavior: menosMovimiento ? "auto" : "smooth" });
  }

  if (fotos.length === 0) {
    return <div className="aspect-[4/5] bg-muted lg:rounded-2xl" />;
  }

  return (
    <div>
      <div className="relative">
        <ul
          ref={riel}
          onScroll={alDesplazar}
          tabIndex={varias ? 0 : undefined}
          aria-label={varias ? "Fotos del auto. Usá las flechas del teclado para pasarlas." : undefined}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-muted [scrollbar-width:none] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring lg:rounded-2xl"
        >
          {fotos.map((foto, i) => (
            <li key={foto.src} className="relative aspect-[4/5] w-full shrink-0 snap-center">
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes={tamanoDeFoto}
                preload={i === 0}
                className={cn("object-cover", apagada && "opacity-50")}
              />
            </li>
          ))}
        </ul>

        {varias && (
          <>
            <BotonDeFlecha
              lado="anterior"
              disabled={actual === 0}
              onClick={() => irA(actual - 1)}
            />
            <BotonDeFlecha
              lado="siguiente"
              disabled={actual === fotos.length - 1}
              onClick={() => irA(actual + 1)}
            />
            <p className="absolute right-3 bottom-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold tabular-nums">
              <span className="sr-only">Foto </span>
              {actual + 1} / {fotos.length}
            </p>
          </>
        )}
      </div>

      {varias && (
        <ul className="mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:px-0">
          {fotos.map((foto, i) => (
            <li key={foto.src} className="shrink-0">
              <button
                type="button"
                onClick={() => irA(i)}
                aria-label={`Ver la foto ${i + 1} de ${fotos.length}`}
                aria-current={i === actual}
                className="relative block size-16 overflow-hidden rounded-lg bg-muted opacity-50 transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=true]:opacity-100"
              >
                <Image src={foto.src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BotonDeFlecha({
  lado,
  disabled,
  onClick,
}: {
  lado: "anterior" | "siguiente";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icono = lado === "anterior" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={lado === "anterior" ? "Foto anterior" : "Foto siguiente"}
      className={cn(
        "absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 transition-opacity duration-200 hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-0 lg:flex",
        lado === "anterior" ? "left-3" : "right-3",
      )}
    >
      <Icono aria-hidden="true" className="size-5" strokeWidth={1.75} />
    </button>
  );
}
