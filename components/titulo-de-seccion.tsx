import type { ReactNode } from "react";

export function TituloDeSeccion({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-heading text-3xl leading-none font-black uppercase tracking-tight text-balance [font-stretch:125%] sm:text-4xl"
    >
      {children}
    </h2>
  );
}
