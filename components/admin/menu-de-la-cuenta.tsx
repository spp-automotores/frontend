"use client";

import { ArrowUpRight, ChevronDown, CircleUserRound, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { salir } from "@/app/admin/acciones";

const opcion =
  "flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&_svg]:size-4 [&_svg]:text-muted-foreground";

/**
 * El menú de la cuenta: con qué email se entró, «Ver el sitio» y «Salir».
 * Es un `<details>`, así abre y cierra también sin JavaScript; con JavaScript,
 * además se cierra al tocar afuera o con Escape.
 */
export function MenuDeLaCuenta({ email }: { email: string | null }) {
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const detalles = menu.current;
    if (!detalles) return;

    const alTocarAfuera = (evento: PointerEvent) => {
      if (detalles.open && !detalles.contains(evento.target as Node)) detalles.open = false;
    };
    const alApretarEscape = (evento: KeyboardEvent) => {
      if (evento.key !== "Escape" || !detalles.open) return;
      detalles.open = false;
      detalles.querySelector("summary")?.focus();
    };

    document.addEventListener("pointerdown", alTocarAfuera);
    document.addEventListener("keydown", alApretarEscape);
    return () => {
      document.removeEventListener("pointerdown", alTocarAfuera);
      document.removeEventListener("keydown", alApretarEscape);
    };
  }, []);

  return (
    <details ref={menu} className="group relative shrink-0">
      <summary className="flex h-11 cursor-pointer list-none items-center gap-1.5 rounded-full border border-foreground/25 pr-3 pl-2.5 text-sm font-semibold transition-colors select-none hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-open:bg-foreground/5 [&::-webkit-details-marker]:hidden">
        <CircleUserRound aria-hidden="true" className="size-5" />
        <span className="sr-only sm:not-sr-only">Cuenta</span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-transform duration-200 ease-out group-open:rotate-180"
        />
      </summary>

      <div className="absolute top-full right-0 z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.7)]">
        {email && (
          <div className="mb-1.5 border-b border-border px-3 pt-2 pb-3">
            <p className="text-xs text-muted-foreground">Entraste como</p>
            <p className="mt-0.5 text-sm font-semibold [overflow-wrap:anywhere]">{email}</p>
          </div>
        )}
        <Link href="/" className={opcion}>
          <ArrowUpRight aria-hidden="true" />
          Ver el sitio
        </Link>
        <form action={salir}>
          <button type="submit" className={opcion}>
            <LogOut aria-hidden="true" />
            Salir
          </button>
        </form>
      </div>
    </details>
  );
}
