import { puntoDeEstado } from "@/components/estado-del-auto";
import type { Auto, Estado } from "@/lib/autos";
import { cn } from "@/lib/utils";

const estados: Estado[] = ["Disponible", "Reservado", "Vendido"];

function enPlural(cantidad: number, palabra: string) {
  return `${cantidad} ${cantidad === 1 ? palabra : `${palabra}s`}`;
}

/** Una línea con cuántos autos hay en cada estado, con los puntos del sitio. */
export function Resumen({ autos }: { autos: Auto[] }) {
  if (autos.length === 0) return null;

  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground tabular-nums">
      <span className="font-semibold text-foreground">{enPlural(autos.length, "auto")}</span>
      {estados.map((estado) => {
        const cantidad = autos.filter((auto) => auto.estado === estado).length;
        if (cantidad === 0) return null;
        return (
          <span key={estado} className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className={cn("size-1.5 rounded-full", puntoDeEstado[estado])} />
            {enPlural(cantidad, estado.toLowerCase())}
          </span>
        );
      })}
    </p>
  );
}

export function ResumenDeRelleno() {
  return (
    <div
      aria-hidden="true"
      className="h-5 w-60 max-w-full rounded-md bg-foreground/[0.06] motion-safe:animate-pulse"
    />
  );
}
