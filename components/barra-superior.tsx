"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { BotonWhatsapp } from "@/components/boton-whatsapp";
import { agencia } from "@/lib/agencia";
import { useFavoritos } from "@/lib/favoritos";
import { mensajeGeneral } from "@/lib/whatsapp";

function suscribir(avisar: () => void) {
  window.addEventListener("scroll", avisar, { passive: true });
  return () => window.removeEventListener("scroll", avisar);
}

/**
 * En el Inicio, transparente sobre la portada y negra cuando la persona baja.
 * En las demás páginas (`enPortada={false}`), negra desde el principio, y el nombre
 * lleva al Inicio.
 */
export function BarraSuperior({ enPortada = true }: { enPortada?: boolean }) {
  const bajo = useSyncExternalStore(
    suscribir,
    () => window.scrollY > 24,
    () => false,
  );
  const negra = !enPortada || bajo;
  const cantidad = useFavoritos()?.length ?? 0;

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      {/* El fondo es una capa aparte para animar sólo su opacidad. */}
      <div
        aria-hidden="true"
        data-visible={negra}
        className="absolute inset-0 border-b border-border bg-background/90 opacity-0 backdrop-blur-md transition-opacity duration-300 data-[visible=true]:opacity-100"
      />
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href={enPortada ? "#inicio" : "/"}
          className="font-heading text-sm font-extrabold uppercase tracking-tight [font-stretch:125%] sm:text-base"
        >
          {agencia.nombre}
        </Link>
        {/* Debajo de 400 px los botones van pegados: si no, el nombre se parte en dos líneas. */}
        <nav
          aria-label="Principal"
          className="flex shrink-0 items-center min-[400px]:gap-1 sm:gap-2"
        >
          <Link
            href="/autos"
            className="inline-flex min-h-10 items-center rounded-full px-2 text-sm min-[400px]:px-2.5 font-semibold hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-3.5"
          >
            Autos
          </Link>
          {/* Siempre a la vista: avisa que existen los favoritos y no corre «Autos» al aparecer. */}
          <Link
            href="/favoritos"
            aria-label={cantidad > 0 ? `Favoritos (${cantidad})` : "Favoritos"}
            className="relative inline-flex size-10 items-center justify-center rounded-full hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Heart aria-hidden="true" className="size-[18px]" />
            {cantidad > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-0.5 right-0 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] leading-none font-bold text-primary-foreground tabular-nums"
              >
                {cantidad}
              </span>
            )}
          </Link>
          {/* En celulares angostos (menos de 400 px) sólo el ícono: si no, la barra no entra. */}
          <BotonWhatsapp
            mensaje={mensajeGeneral}
            etiqueta="WhatsApp"
            className="min-h-10 min-w-10 px-3 sm:px-3.5"
            etiquetaClassName="sr-only min-[400px]:not-sr-only"
          />
        </nav>
      </div>
    </header>
  );
}
