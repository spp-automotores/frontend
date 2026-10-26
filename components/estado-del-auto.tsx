import type { Estado } from "@/lib/autos";
import { cn } from "@/lib/utils";

/** El color del punto de cada estado (también lo usa la administración). */
export const puntoDeEstado: Record<Estado, string> = {
  Disponible: "bg-disponible",
  Reservado: "bg-reservado",
  Vendido: "bg-highlight",
};

/** Disponible, Reservado o Vendido, con su punto de color. */
export function EstadoDelAuto({ estado, className }: { estado: Estado; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", puntoDeEstado[estado])} />
      {estado}
    </span>
  );
}
