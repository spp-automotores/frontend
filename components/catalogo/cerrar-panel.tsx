"use client";

import type { ReactNode } from "react";

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
