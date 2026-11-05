import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { puntoDeEstado } from "@/components/estado-del-auto";
import { type Auto, nombreDelAuto } from "@/lib/autos";
import { diasEntre, fechaDeHoy } from "@/lib/fechas";
import { cn } from "@/lib/utils";

// «Cómo va»: el estado del negocio de un vistazo, con los datos que ya están en la base.
// Cuatro números, los autos que hace más tiempo están publicados y los que tienen
// algo sin completar. Los vendidos no entran en las dos listas.

/** Cuántos autos se muestran en cada lista antes del «ver más». */
const primeros = 5;

const nombreDelMes = new Intl.DateTimeFormat("es-AR", { month: "long", timeZone: "UTC" });

export function Tablero({ autos, hoy = fechaDeHoy() }: { autos: Auto[]; hoy?: string }) {
  const [anio, mes] = hoy.split("-");
  const enVenta = autos.filter((auto) => auto.estado !== "Vendido");
  const vendidos = autos.filter((auto) => auto.estado === "Vendido" && auto.vendidoEl);
  const mesActual = nombreDelMes.format(new Date(`${hoy}T12:00:00Z`));

  const masViejos = [...enVenta].sort((a, b) => a.ingresadoEl.localeCompare(b.ingresadoEl));
  const incompletos = enVenta
    .map((auto) => ({ auto, falta: loQueFalta(auto) }))
    .filter(({ falta }) => falta.length > 0);

  return (
    <section aria-labelledby="titulo-tablero" className="mt-12">
      <h2
        id="titulo-tablero"
        className="font-heading text-xl leading-none font-black uppercase tracking-tight [font-stretch:125%]"
      >
        Cómo va
      </h2>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Numero
          valor={autos.filter((auto) => auto.estado === "Disponible").length}
          texto="Disponibles"
          punto={puntoDeEstado.Disponible}
        />
        <Numero
          valor={autos.filter((auto) => auto.estado === "Reservado").length}
          texto="Reservados"
          punto={puntoDeEstado.Reservado}
        />
        <Numero
          valor={vendidos.filter((auto) => auto.vendidoEl!.startsWith(`${anio}-${mes}`)).length}
          texto={`Vendidos en ${mesActual}`}
          punto={puntoDeEstado.Vendido}
        />
        <Numero
          valor={vendidos.filter((auto) => auto.vendidoEl!.startsWith(anio)).length}
          texto={`Vendidos en ${anio}`}
          punto={puntoDeEstado.Vendido}
        />
      </dl>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Lista
          titulo="Hace más tiempo publicados"
          vacio="No hay autos a la venta."
          filas={masViejos.map((auto) => ({
            auto,
            detalle: haceCuanto(diasEntre(auto.ingresadoEl, hoy)),
          }))}
        />
        <Lista
          titulo="Les falta algo"
          vacio="Todos los autos a la venta tienen precio e Instagram."
          accion="Completar"
          filas={incompletos.map(({ auto, falta }) => ({ auto, detalle: falta.join(" · ") }))}
        />
      </div>
    </section>
  );
}

/** Lo que conviene completar: sin precio el sitio dice «Consultar»; sin Instagram, no hay video. */
function loQueFalta(auto: Auto): string[] {
  return [auto.precio === null && "Sin precio", !auto.instagram && "Sin Instagram"].filter(
    (texto): texto is string => Boolean(texto),
  );
}

function haceCuanto(dias: number): string {
  if (dias <= 0) return "Desde hoy";
  return dias === 1 ? "Hace 1 día" : `Hace ${dias} días`;
}

function Numero({ valor, texto, punto }: { valor: number; texto: string; punto: string }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4">
      <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", punto)} />
        <span className="first-letter:uppercase">{texto}</span>
      </dt>
      <dd className="order-first font-heading text-4xl leading-none font-black tabular-nums [font-stretch:115%]">
        {valor}
      </dd>
    </div>
  );
}

type Fila = { auto: Auto; detalle: string };

/** Una lista corta; si hay más de `primeros`, el resto se abre con «Ver N más» (sin JavaScript). */
function Lista({
  titulo,
  vacio,
  filas,
  accion,
}: {
  titulo: string;
  vacio: string;
  filas: Fila[];
  /** Texto a la derecha de cada fila (lleva a «Editar»). Sin él, sólo la flecha. */
  accion?: string;
}) {
  const id = `lista-${titulo.toLowerCase().replace(/\s+/g, "-")}`;
  const resto = filas.slice(primeros);

  return (
    <div>
      <h3 id={id} className="text-sm font-semibold">
        {titulo}
      </h3>
      {filas.length === 0 ? (
        <p className="mt-2 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
          {vacio}
        </p>
      ) : (
        <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-card">
          <Filas filas={filas.slice(0, primeros)} accion={accion} etiqueta={id} />
          {resto.length > 0 && (
            <details className="group border-t border-border">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors select-none hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">Ver {resto.length} más</span>
                <span className="hidden group-open:inline">Ver menos</span>
                <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-border">
                <Filas filas={resto} accion={accion} etiqueta={id} />
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function Filas({ filas, accion, etiqueta }: { filas: Fila[]; accion?: string; etiqueta: string }) {
  return (
    <ul aria-labelledby={etiqueta} className="divide-y divide-border">
      {filas.map(({ auto, detalle }) => (
        <li key={auto.id}>
          <FilaConLink href={`/admin/autos/${auto.id}`} accion={accion}>
            <span className="block truncate font-semibold">
              {nombreDelAuto(auto)} {auto.anio}
            </span>
            <span className="block text-sm text-muted-foreground">{detalle}</span>
          </FilaConLink>
        </li>
      ))}
    </ul>
  );
}

function FilaConLink({ href, accion, children }: { href: string; accion?: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group/fila flex min-h-14 items-center gap-3 px-4 py-2.5 transition-colors hover:bg-foreground/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
    >
      <span className="min-w-0 flex-1">{children}</span>
      {accion && <span className="shrink-0 text-sm font-semibold text-highlight">{accion}</span>}
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover/fila:translate-x-0.5"
      />
    </Link>
  );
}

export function TableroDeRelleno() {
  return (
    <div aria-hidden="true" className="mt-12">
      <div className="h-5 w-28 rounded-md bg-foreground/[0.06]" />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[5.25rem] rounded-2xl bg-foreground/[0.06] motion-safe:animate-pulse" />
        ))}
      </div>
    </div>
  );
}
