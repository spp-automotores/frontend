import type { Metadata } from "next";
import Link from "next/link";
import { BarraSuperior } from "@/components/barra-superior";
import { Controles } from "@/components/catalogo/controles";
import { Pie } from "@/components/pie";
import { TarjetaAuto } from "@/components/tarjeta-auto";
import { agencia } from "@/lib/agencia";
import { traerAutosALaVista } from "@/lib/autos";
import {
  filtrarYOrdenar,
  filtrosConOpciones,
  leerBusqueda,
} from "@/lib/catalogo";
import { fotoAMedida } from "@/lib/foto-a-medida";

// La página se arma en cada visita: depende de la dirección (los filtros) y del día
// (los vendidos se ocultan solos pasado el plazo).

const descripcion = `Todos los autos de ${agencia.nombre}, en ${agencia.ciudad}. Filtrá por tipo, marca, caja y combustible, y consultá por WhatsApp.`;

export async function generateMetadata(): Promise<Metadata> {
  const [masNuevo] = await traerAutosALaVista();
  const foto = masNuevo?.fotos[0];
  const titulo = `Autos · ${agencia.nombre}`;

  return {
    title: titulo,
    description: descripcion,
    // Con filtros o sin ellos, para Google es una sola página: `/autos`.
    alternates: { canonical: "/autos" },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: "/autos",
      siteName: agencia.nombre,
      locale: "es_AR",
      type: "website",
      images: foto ? [{ url: fotoAMedida(foto.src, 1200), alt: foto.alt }] : undefined,
    },
  };
}

const boton =
  "inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform duration-150 ease-out hover:bg-primary/85 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default async function Catalogo({ searchParams }: PageProps<"/autos">) {
  const busqueda = leerBusqueda(await searchParams);
  const todos = await traerAutosALaVista();
  const autos = filtrarYOrdenar(todos, busqueda);
  const filtros = filtrosConOpciones(todos, busqueda);

  const puestos = filtros.flatMap((f) => f.opciones.filter((o) => o.elegida).map((o) => o.texto));
  const cantidad = `${autos.length} ${autos.length === 1 ? "auto" : "autos"}`;

  return (
    <>
      <BarraSuperior enPortada={false} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-16 sm:px-6 sm:pb-24 lg:pt-28">
        <h1 className="font-heading text-4xl leading-none font-black uppercase tracking-tight [font-stretch:125%] sm:text-5xl">
          Autos
        </h1>
        <p className="mt-3 text-sm text-muted-foreground tabular-nums">
          {[cantidad, ...puestos].join(" · ")}
        </p>
        {todos.some((auto) => auto.ejemplo) && (
          <p className="mt-1 text-xs text-muted-foreground">
            Sitio en preparación: los autos y sus fotos son de ejemplo.
          </p>
        )}

        <div className="mt-6">
          <Controles busqueda={busqueda} filtros={filtros} cantidad={autos.length} />
        </div>

        {autos.length > 0 ? (
          <>
            <h2 className="sr-only">Lista de autos</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {autos.map((auto, i) => (
                <li key={auto.id}>
                  <TarjetaAuto
                    auto={auto}
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    prioridad={i === 0}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="mt-12 rounded-2xl bg-card p-6 sm:p-8">
            <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight [font-stretch:125%]">
              No hay autos con esos filtros
            </h2>
            <p className="mt-2 text-pretty text-muted-foreground">
              Probá sacando alguno, o mirá todos los autos que tenemos ahora.
            </p>
            <Link href="/autos" className={`${boton} mt-6`}>
              Ver todos los autos
            </Link>
          </div>
        )}
      </main>
      <Pie />
    </>
  );
}
