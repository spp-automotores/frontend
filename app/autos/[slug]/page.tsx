import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BarraDeConsulta } from "@/components/auto/barra-de-consulta";
import { Ficha } from "@/components/auto/ficha";
import { Galeria } from "@/components/auto/galeria";
import { BarraSuperior } from "@/components/barra-superior";
import { BotonWhatsapp } from "@/components/boton-whatsapp";
import { EstadoDelAuto } from "@/components/estado-del-auto";
import { Corazon } from "@/components/favoritos/corazon";
import { iconosDeServicio } from "@/components/icono-de-servicio";
import { ListaDeAutos } from "@/components/lista-de-autos";
import { Pie } from "@/components/pie";
import { TituloDeSeccion } from "@/components/titulo-de-seccion";
import { agencia, servicios } from "@/lib/agencia";
import {
  type Auto,
  direccionDelAuto,
  formatearKm,
  nombreDelAuto,
  textoDelPrecio,
  traerAuto,
  traerAutos,
  traerOtrosAutos,
} from "@/lib/autos";
import { fotoAMedida } from "@/lib/foto-a-medida";
import { cn } from "@/lib/utils";
import { mensajeDeConsulta } from "@/lib/whatsapp";

// Las páginas de los autos que ya existen se arman al publicar. Un auto cargado
// después también tiene su página: se arma la primera vez que alguien la visita.
export async function generateStaticParams() {
  return (await traerAutos()).map((auto) => ({ slug: auto.slug }));
}

const resumen = (auto: Auto) =>
  [auto.anio, formatearKm(auto.km), auto.combustible, auto.caja].join(" · ");

// Título, descripción y foto para Google y para la vista previa al compartir el link.
export async function generateMetadata({
  params,
}: PageProps<"/autos/[slug]">): Promise<Metadata> {
  const auto = await traerAuto((await params).slug);
  if (!auto) return { title: `Este auto no está · ${agencia.nombre}` };

  const titulo = `${nombreDelAuto(auto)} ${auto.anio} · ${textoDelPrecio(auto)}`;
  const descripcion = auto.descripcion ?? `${resumen(auto)}. ${agencia.nombre}, ${agencia.ciudad}.`;
  const foto = auto.fotos[0];

  return {
    title: `${titulo} · ${agencia.nombre}`,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      url: direccionDelAuto(auto),
      siteName: agencia.nombre,
      locale: "es_AR",
      type: "website",
      images: foto ? [{ url: fotoAMedida(foto.src, 1200), alt: foto.alt }] : undefined,
    },
  };
}

// Sólo financiación y permuta: los dos servicios que hacen a la compra de este auto.
const serviciosDeCompra = servicios.filter(
  (servicio) => servicio.icono === "financiacion" || servicio.icono === "permuta",
);

export default async function PaginaDelAuto({ params }: PageProps<"/autos/[slug]">) {
  const { slug } = await params;
  const auto = await traerAuto(slug);
  if (!auto) notFound();

  const otros = await traerOtrosAutos(slug);
  const vendido = auto.estado === "Vendido";

  return (
    <>
      <BarraSuperior enPortada={false} />
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-x-12 lg:px-6 lg:pt-8">
          <div className="lg:col-start-1 lg:row-start-1">
            <Galeria fotos={auto.fotos} apagada={vendido} />
          </div>

          <div className="px-4 pt-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start lg:px-0 lg:pt-0">
            <div className="flex flex-wrap items-center gap-2">
              <EstadoDelAuto estado={auto.estado} className="bg-card" />
              {auto.ejemplo && (
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                  Auto de ejemplo
                </span>
              )}
              <Corazon
                id={auto.id}
                nombre={nombreDelAuto(auto)}
                className="-my-2 -mr-1.5 ml-auto"
                circuloClassName="bg-card"
              />
            </div>
            <h1 className="mt-4 font-heading text-3xl leading-none font-black uppercase tracking-tight text-balance [font-stretch:125%] sm:text-4xl">
              {nombreDelAuto(auto)}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground tabular-nums">{resumen(auto)}</p>
            <p
              className={cn(
                "mt-4 font-heading text-4xl font-extrabold tabular-nums [font-stretch:115%]",
                vendido && "text-muted-foreground",
              )}
            >
              {textoDelPrecio(auto)}
            </p>

            {vendido ? (
              <p className="mt-4 text-sm text-muted-foreground">Este auto ya se vendió.</p>
            ) : (
              // En el celular el botón está en la barra fija de abajo.
              <div className="mt-6 hidden lg:block">
                <BotonWhatsapp
                  mensaje={mensajeDeConsulta(auto)}
                  etiqueta="Consultar por WhatsApp"
                  className="w-full"
                />
              </div>
            )}

            <h2 className="sr-only">Ficha</h2>
            <div className="mt-6">
              <Ficha auto={auto} />
            </div>
          </div>

          <div className="space-y-12 px-4 pt-12 lg:col-start-1 lg:row-start-2 lg:px-0">
            {auto.descripcion && (
              <section aria-labelledby="titulo-descripcion">
                <h2 id="titulo-descripcion" className={subtitulo}>
                  Descripción
                </h2>
                <p className="mt-3 whitespace-pre-line text-pretty text-muted-foreground">
                  {auto.descripcion}
                </p>
              </section>
            )}

            {!vendido && (
              <section aria-labelledby="titulo-financiacion">
                <h2 id="titulo-financiacion" className={subtitulo}>
                  Financiación y permuta
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {serviciosDeCompra.map((servicio) => {
                    const Icono = iconosDeServicio[servicio.icono];
                    return (
                      <li key={servicio.titulo} className="rounded-2xl bg-card p-5">
                        <Icono aria-hidden="true" className="size-6 text-highlight" strokeWidth={1.75} />
                        <h3 className="mt-4 font-semibold">{servicio.titulo}</h3>
                        <p className="mt-1 text-sm text-pretty text-muted-foreground">{servicio.texto}</p>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        </div>

        {otros.length > 0 && (
          <section aria-labelledby="titulo-otros-autos" className="mx-auto w-full max-w-6xl py-16 sm:py-24">
            <div className="px-4 sm:px-6">
              <TituloDeSeccion id="titulo-otros-autos">Otros autos</TituloDeSeccion>
            </div>
            <div className="mt-8">
              <ListaDeAutos autos={otros} enColumnas={3} />
            </div>
          </section>
        )}
      </main>
      <Pie />

      {!vendido && (
        <>
          <BarraDeConsulta auto={auto} />
          {/* El lugar de la barra fija, para que no tape el final de la página. */}
          <div aria-hidden="true" className="h-[calc(4.5rem+env(safe-area-inset-bottom))] lg:hidden" />
        </>
      )}
    </>
  );
}

const subtitulo =
  "font-heading text-xl font-extrabold uppercase tracking-tight [font-stretch:125%]";
