"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { alternarFavorito, useFavoritos } from "@/lib/favoritos";
import { cn } from "@/lib/utils";

/**
 * Guarda el auto en los favoritos de quien mira, o lo saca. Sin JavaScript no
 * aparece: no podría guardar nada, y un botón que no hace nada es peor que ninguno.
 * El área que se toca mide 44 px; el círculo que se ve, 36 px.
 */
export function Corazon({
  id,
  nombre,
  className,
  circuloClassName = "bg-background/85",
}: {
  id: string;
  /** El nombre del auto, para lectores de pantalla. */
  nombre: string;
  className?: string;
  circuloClassName?: string;
}) {
  const favoritos = useFavoritos();
  const [latido, setLatido] = useState(false);
  if (favoritos === null) return null;
  const guardado = favoritos.includes(id);

  return (
    <button
      type="button"
      aria-pressed={guardado}
      aria-label={`Guardar en favoritos: ${nombre}`}
      onClick={() => {
        setLatido(!guardado);
        alternarFavorito(id);
      }}
      className={cn(
        "group/corazon grid size-11 place-items-center rounded-full outline-none",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-9 place-items-center rounded-full transition-transform duration-150 ease-out group-active/corazon:scale-90 group-focus-visible/corazon:outline-2 group-focus-visible/corazon:outline-offset-2 group-focus-visible/corazon:outline-ring",
          circuloClassName,
        )}
      >
        <Heart
          aria-hidden="true"
          onAnimationEnd={() => setLatido(false)}
          className={cn(
            "size-[18px]",
            guardado ? "fill-current text-highlight" : "text-foreground",
            latido && "motion-safe:animate-[latido_320ms_ease-out]",
          )}
        />
      </span>
    </button>
  );
}
