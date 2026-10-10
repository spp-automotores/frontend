import { ArrowUpDown, Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { CerrarPanel } from "@/components/catalogo/cerrar-panel";
import {
  type Busqueda,
  type FiltroConOpciones,
  direccionDelCatalogo,
  ordenes,
} from "@/lib/catalogo";
import { cn } from "@/lib/utils";

// Filtros y orden del catálogo, sin JavaScript: cada opción es un link y los
// paneles son `<details>` del navegador. El mismo `name` hace que abrir un panel
// cierre el otro.
//
// Al elegir, el panel de filtros del celular queda abierto (para poner varios
// seguidos) y se cierra con «Ver N autos». Los de una sola elección («Ordenar» y
// los de la computadora) se cierran solos: llevan una `key` distinta en cada
// dirección y React los arma de nuevo, cerrados. Sin JavaScript cada opción carga
// la página entera, que llega con todo cerrado.

const nombreDeLosPaneles = "controles-del-catalogo";

const boton =
  "inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold select-none hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-open:border-foreground/40 [&::-webkit-details-marker]:hidden";

const panel = "absolute z-30 mt-2 rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/60";

const opcion =
  "flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-sm hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-ring aria-[current=true]:font-semibold aria-[current=true]:text-foreground";

function Panel({
  etiqueta,
  icono,
  children,
  className,
  panelClassName,
}: {
  etiqueta: ReactNode;
  icono?: ReactNode;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
}) {
  return (
    <details name={nombreDeLosPaneles} className={cn("group", className)}>
      <summary className={boton}>
        {icono}
        {etiqueta}
        <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className={cn(panel, panelClassName)}>{children}</div>
    </details>
  );
}

/** Las opciones de un filtro. Tocar la elegida la saca. */
function Opciones({ busqueda, filtro }: { busqueda: Busqueda; filtro: FiltroConOpciones }) {
  return (
    <ul className="space-y-0.5">
      {filtro.opciones.map((o) => (
        <li key={o.enDireccion}>
          <Link
            href={direccionDelCatalogo(busqueda, {
              filtro: filtro.clave,
              valor: o.elegida ? null : o.enDireccion,
            })}
            prefetch={false}
            scroll={false}
            aria-current={o.elegida ? "true" : undefined}
            className={cn(opcion, "text-muted-foreground")}
          >
            <span>
              {o.texto} <span className="tabular-nums">({o.cantidad})</span>
            </span>
            {o.elegida && <Check aria-hidden="true" className="size-4 text-highlight" />}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Orden({ busqueda }: { busqueda: Busqueda }) {
  return (
    <ul className="space-y-0.5">
      {ordenes.map((o) => {
        const elegido = o.clave === busqueda.orden;
        return (
          <li key={o.clave}>
            <Link
              href={direccionDelCatalogo(busqueda, { orden: o.clave })}
              prefetch={false}
              scroll={false}
              aria-current={elegido ? "true" : undefined}
              className={cn(opcion, "text-muted-foreground")}
            >
              {o.titulo}
              {elegido && <Check aria-hidden="true" className="size-4 text-highlight" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Controles({
  busqueda,
  filtros,
  cantidad,
}: {
  busqueda: Busqueda;
  filtros: FiltroConOpciones[];
  /** Cuántos autos quedan con los filtros puestos. */
  cantidad: number;
}) {
  const direccion = direccionDelCatalogo(busqueda);
  const puestos = filtros.flatMap((filtro) =>
    filtro.opciones.filter((o) => o.elegida).map((o) => ({ clave: filtro.clave, texto: o.texto })),
  );
  const ordenElegido = ordenes.find((o) => o.clave === busqueda.orden)!;

  return (
    <div className="space-y-3">
      {/* Celular: un botón para todos los filtros y otro para ordenar. */}
      <div className="relative flex flex-wrap gap-2 lg:hidden">
        {filtros.length > 0 && (
          <Panel
            etiqueta={puestos.length > 0 ? `Filtros (${puestos.length})` : "Filtros"}
            icono={<SlidersHorizontal aria-hidden="true" className="size-4" />}
            panelClassName="inset-x-0 max-h-[70svh] overflow-y-auto pb-0"
          >
            <div className="space-y-5">
              {filtros.map((filtro) => (
                <fieldset key={filtro.clave}>
                  <legend className="px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {filtro.titulo}
                  </legend>
                  <div className="mt-1">
                    <Opciones busqueda={busqueda} filtro={filtro} />
                  </div>
                </fieldset>
              ))}
            </div>
            {/* Queda a la vista mientras se recorre el panel. */}
            <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border bg-card px-4 pt-3 pb-4">
              <CerrarPanel
                href={direccion}
                className="flex min-h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {cantidad === 0 ? "Cerrar" : `Ver ${cantidad} ${cantidad === 1 ? "auto" : "autos"}`}
              </CerrarPanel>
            </div>
          </Panel>
        )}
        <Panel
          key={`ordenar-${direccion}`}
          etiqueta="Ordenar"
          icono={<ArrowUpDown aria-hidden="true" className="size-4" />}
          panelClassName="inset-x-0"
        >
          <Orden busqueda={busqueda} />
        </Panel>
      </div>

      {/* Computadora: cada filtro a la vista, en una fila, y el orden a la derecha. */}
      <div key={direccion} className="hidden flex-wrap items-start gap-2 lg:flex">
        {filtros.map((filtro) => {
          const elegida = filtro.opciones.find((o) => o.elegida);
          return (
            <Panel
              key={filtro.clave}
              etiqueta={elegida ? `${filtro.titulo}: ${elegida.texto}` : filtro.titulo}
              className="relative"
              panelClassName="left-0 w-64"
            >
              <Opciones busqueda={busqueda} filtro={filtro} />
            </Panel>
          );
        })}
        <Panel
          etiqueta={`Ordenar: ${ordenElegido.titulo}`}
          icono={<ArrowUpDown aria-hidden="true" className="size-4" />}
          className="relative ml-auto"
          panelClassName="right-0 w-64"
        >
          <Orden busqueda={busqueda} />
        </Panel>
      </div>

      {/* Los filtros puestos, para sacarlos de a uno. */}
      {puestos.length > 0 && (
        <ul className="flex flex-wrap items-center gap-2">
          {puestos.map((puesto) => (
            <li key={puesto.clave}>
              <Link
                href={direccionDelCatalogo(busqueda, { filtro: puesto.clave, valor: null })}
                prefetch={false}
                scroll={false}
                aria-label={`Sacar el filtro ${puesto.texto}`}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-highlight/60 px-3 text-sm hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {puesto.texto}
                <X aria-hidden="true" className="size-3.5" />
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={direccionDelCatalogo({ filtros: {}, orden: busqueda.orden })}
              prefetch={false}
              scroll={false}
              className="inline-flex min-h-9 items-center px-2 text-base text-highlight underline underline-offset-4 hover:text-highlight/80"
            >
              Borrar filtros
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
