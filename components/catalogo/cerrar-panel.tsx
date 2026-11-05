"use client";

import { type ReactNode, useEffect } from "react";

/**
 * Cierra el panel de filtros y devuelve el foco a su botón. Sin JavaScript es un
 * link a la misma dirección: la página se vuelve a cargar con el panel cerrado.
 */
export function CerrarPanel({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(evento) => {
        const panel = evento.currentTarget.closest("details");
        if (!panel) return;
        evento.preventDefault();
        panel.open = false;
        panel.querySelector("summary")?.focus();
      }}
    >
      {children}
    </a>
  );
}

/**
 * Cierra el panel abierto (los `<details>` con este `name`) al tocar o hacer clic
 * afuera de él, o al apretar Escape. No dibuja nada. Sin JavaScript no hace falta:
 * cada opción carga la página entera, que llega con todo cerrado.
 */
export function CerrarAlTocarAfuera({ nombre }: { nombre: string }) {
  useEffect(() => {
    const abiertos = () =>
      document.querySelectorAll<HTMLDetailsElement>(`details[name="${nombre}"][open]`);

    function alTocar(evento: PointerEvent) {
      const tocado = evento.target as Node;
      for (const panel of abiertos()) {
        if (!panel.contains(tocado)) panel.open = false;
      }
    }

    function alApretarTecla(evento: KeyboardEvent) {
      if (evento.key !== "Escape") return;
      for (const panel of abiertos()) {
        panel.open = false;
        panel.querySelector("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", alTocar);
    document.addEventListener("keydown", alApretarTecla);
    return () => {
      document.removeEventListener("pointerdown", alTocar);
      document.removeEventListener("keydown", alApretarTecla);
    };
  }, [nombre]);

  return null;
}
