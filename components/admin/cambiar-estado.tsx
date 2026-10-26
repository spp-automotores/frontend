"use client";

import { CircleAlert, EyeOff, LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cambiarEstado, type EstadoDelCambio } from "@/app/admin/acciones";
import { Miniatura } from "@/components/admin/tus-autos";
import { puntoDeEstado } from "@/components/estado-del-auto";
import { type Auto, type Estado, estados, estaALaVista, nombreDelAuto } from "@/lib/autos";
import { cn } from "@/lib/utils";

/**
 * Un auto de «Marcar vendido o reservado», con sus tres botones. Se guarda al tocar.
 * Cada fila es un formulario común: anda también sin JavaScript.
 */
export function FilaDeEstado({ auto }: { auto: Auto }) {
  const [estado, enviar] = useActionState<EstadoDelCambio, FormData>(cambiarEstado, { error: null });
  const nombre = `${nombreDelAuto(auto)} ${auto.anio}`;

  return (
    <li className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Miniatura auto={auto} />
        <div className="min-w-0">
          <h3 className="line-clamp-2 leading-snug font-semibold [overflow-wrap:anywhere]">{nombre}</h3>
          {!estaALaVista(auto) && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <EyeOff aria-hidden="true" className="size-3.5" />
              Oculto en el sitio
            </p>
          )}
        </div>
      </div>

      <form action={enviar} className="shrink-0">
        <input type="hidden" name="id" value={auto.id} />
        <BotonesDeEstado actual={auto.estado} nombre={nombre} />
        {estado.error && (
          <p role="alert" className="mt-2 flex items-start gap-1.5 text-sm leading-snug text-highlight">
            <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            {estado.error}
          </p>
        )}
      </form>
    </li>
  );
}

/** Mientras se guarda, el botón tocado ya se ve elegido, con la ruedita. */
function BotonesDeEstado({ actual, nombre }: { actual: Estado; nombre: string }) {
  const { pending, data } = useFormStatus();
  const tocado = pending ? (data?.get("estado") as Estado | null) : null;
  const elegido = tocado ?? actual;

  return (
    <div
      role="group"
      aria-label={`Estado de ${nombre}`}
      className="grid grid-cols-3 gap-1 rounded-full border border-foreground/25 p-1 sm:w-[21rem]"
    >
      {estados.map((opcion) => (
        <button
          key={opcion}
          type="submit"
          name="estado"
          value={opcion}
          aria-pressed={opcion === elegido}
          disabled={pending}
          className="inline-flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold transition-[background-color,color,transform] duration-150 ease-out hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:not-disabled:scale-[0.97] disabled:cursor-wait aria-pressed:bg-foreground aria-pressed:text-background"
        >
          {pending && opcion === tocado ? (
            <LoaderCircle aria-hidden="true" className="size-3.5 shrink-0 motion-safe:animate-spin" />
          ) : (
            <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", puntoDeEstado[opcion])} />
          )}
          {opcion}
        </button>
      ))}
    </div>
  );
}
