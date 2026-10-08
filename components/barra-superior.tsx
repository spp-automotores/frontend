"use client";

import { useSyncExternalStore } from "react";
import { BotonWhatsapp } from "@/components/boton-whatsapp";
import { agencia } from "@/lib/agencia";
import { mensajeGeneral } from "@/lib/whatsapp";

function suscribir(avisar: () => void) {
  window.addEventListener("scroll", avisar, { passive: true });
  return () => window.removeEventListener("scroll", avisar);
}

/** Transparente sobre la portada; se vuelve negra cuando la persona baja. */
export function BarraSuperior() {
  const bajo = useSyncExternalStore(
    suscribir,
    () => window.scrollY > 24,
    () => false,
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      {/* El fondo es una capa aparte para animar sólo su opacidad. */}
      <div
        aria-hidden="true"
        data-visible={bajo}
        className="absolute inset-0 border-b border-border bg-background/90 opacity-0 backdrop-blur-md transition-opacity duration-300 data-[visible=true]:opacity-100"
      />
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#inicio"
          className="font-heading text-sm font-extrabold uppercase tracking-tight [font-stretch:125%] sm:text-base"
        >
          {agencia.nombre}
        </a>
        <BotonWhatsapp mensaje={mensajeGeneral} etiqueta="WhatsApp" className="min-h-10 px-3.5" />
      </div>
    </header>
  );
}
