import { ArrowUpRight, CarFront, ChevronRight, CircleAlert, EyeOff, RotateCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { puntoDeEstado } from "@/components/estado-del-auto";
import { buttonVariants } from "@/components/ui/button";
import {
  type Auto,
  type Estado,
  direccionDelAuto,
  estaALaVista,
  formatearPrecio,
  nombreDelAuto,
} from "@/lib/autos";
import { cn } from "@/lib/utils";

const ordenDeEstado: Record<Estado, number> = { Disponible: 0, Reservado: 1, Vendido: 2 };

/** Disponibles, reservados y vendidos; dentro de cada uno, como vienen (el más nuevo primero). */
export function ordenarParaLaAdministracion(autos: Auto[]): Auto[] {
  return [...autos].sort((a, b) => ordenDeEstado[a.estado] - ordenDeEstado[b.estado]);
}

/** La sección «Tus autos»; adentro va la lista o uno de sus estados. */
export function TusAutos({ children }: { children: ReactNode }) {
  return (
    <section aria-labelledby="titulo-tus-autos" className="mt-12">
      <h2
        id="titulo-tus-autos"
        className="font-heading text-xl leading-none font-black uppercase tracking-tight [font-stretch:125%]"
      >
        Tus autos
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ListaDeLaAdministracion({ autos }: { autos: Auto[] }) {
  if (autos.length === 0) return <SinAutos />;

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      {autos.map((auto) => (
        <FilaDelAuto key={auto.id} auto={auto} />
      ))}
    </ul>
  );
}

/** Toda la fila lleva a «Editar»; aparte, un link chico a su página en el sitio. */
function FilaDelAuto({ auto }: { auto: Auto }) {
  const vendido = auto.estado === "Vendido";

  return (
    <li className="group relative flex items-center gap-3 px-3 py-3 transition-colors hover:bg-foreground/[0.03] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-ring sm:gap-4 sm:px-4">
      <Miniatura auto={auto} />

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0 sm:flex-1">
          <h3 className="line-clamp-2 leading-snug font-semibold [overflow-wrap:anywhere]">
            <Link href={`/admin/autos/${auto.id}`} className="outline-none after:absolute after:inset-0">
              <span className="sr-only">Editar </span>
              {nombreDelAuto(auto)}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">
            {auto.anio} · {auto.precio === null ? "Consultar" : formatearPrecio(auto.precio)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:w-36 sm:flex-col sm:items-start sm:gap-1.5">
          {vendido ? (
            <SelloVendido />
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <span aria-hidden="true" className={cn("size-1.5 rounded-full", puntoDeEstado[auto.estado])} />
              {auto.estado}
            </span>
          )}
          {estaALaVista(auto) ? (
            // Encima del link de toda la fila (`relative z-10`): se puede tocar aparte.
            <Link
              href={direccionDelAuto(auto)}
              className="relative z-10 -my-1 inline-flex min-h-8 items-center gap-1 text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Ver en el sitio
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
              <span className="sr-only">: {nombreDelAuto(auto)}</span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <EyeOff aria-hidden="true" className="size-3.5" />
              Oculto en el sitio
            </span>
          )}
        </div>
      </div>

      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
      />
    </li>
  );
}

/** Nada se borra: un auto vendido queda en la lista con su sello. */
function SelloVendido() {
  return (
    <span className="inline-block -rotate-6 rounded-[4px] border-[1.5px] border-highlight px-1.5 py-1 font-heading text-[11px] leading-none font-black tracking-wider text-highlight uppercase [font-stretch:125%]">
      Vendido
    </span>
  );
}

export function Miniatura({ auto }: { auto: Auto }) {
  const foto = auto.fotos[0];
  const vendido = auto.estado === "Vendido";

  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border ring-inset">
      {foto ? (
        <Image
          src={foto.src}
          alt=""
          fill
          sizes="64px"
          className={cn("object-cover", vendido && "opacity-50 grayscale")}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-0.5 text-muted-foreground">
          <CarFront aria-hidden="true" className="size-5" />
          <span className="text-[11px] leading-none">Sin foto</span>
        </div>
      )}
    </div>
  );
}

function SinAutos() {
  return (
    <div className="rounded-2xl border border-dashed border-foreground/20 px-5 py-10 text-center">
      <CarFront aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
      <p className="mt-3 font-semibold">Todavía no hay autos cargados</p>
      <p className="mt-1 text-sm text-pretty text-muted-foreground">
        Tocá «Cargar un auto» para sumar el primero.
      </p>
    </div>
  );
}

/** Filas grises mientras llegan los autos. */
export function FilasDeRelleno() {
  return (
    <div role="status" className="overflow-hidden rounded-2xl border border-border bg-card">
      <span className="sr-only">Cargando los autos…</span>
      {[0, 1, 2, 3].map((fila) => (
        <div
          key={fila}
          aria-hidden="true"
          className="flex items-center gap-3 border-border px-3 py-3 not-first:border-t sm:gap-4 sm:px-4"
        >
          <div className="size-16 shrink-0 rounded-lg bg-foreground/[0.06] motion-safe:animate-pulse" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-4 w-3/5 rounded bg-foreground/[0.06] motion-safe:animate-pulse" />
            <div className="h-3.5 w-2/5 rounded bg-foreground/[0.06] motion-safe:animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** «Reintentar» es un link común a la misma página: anda también sin JavaScript. */
export function NoSePudieronCargar() {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-4 rounded-2xl border border-highlight/40 bg-highlight/10 p-5"
    >
      <div className="flex items-start gap-2.5">
        <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-highlight" />
        <div>
          <p className="font-semibold">No se pudieron cargar los autos.</p>
          <p className="mt-1 text-sm text-foreground/75">
            Puede ser la conexión. Probá de nuevo en un momento.
          </p>
        </div>
      </div>
      <Link href="/admin" prefetch={false} className={buttonVariants({ variant: "outline", size: "sm" })}>
        <RotateCw aria-hidden="true" />
        Reintentar
      </Link>
    </div>
  );
}
