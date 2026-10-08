import { Aparecer } from "@/components/aparecer";
import { TarjetaAuto } from "@/components/tarjeta-auto";
import { TituloDeSeccion } from "@/components/titulo-de-seccion";
import type { Auto } from "@/lib/autos";

/** En el celular se desliza de costado; en la computadora, 4 columnas. */
export function RecienIngresados({ autos }: { autos: Auto[] }) {
  return (
    <section
      id="recien-ingresados"
      aria-labelledby="titulo-recien-ingresados"
      className="mx-auto w-full max-w-6xl scroll-mt-16 py-16 sm:py-24"
    >
      <Aparecer className="px-4 sm:px-6">
        <TituloDeSeccion id="titulo-recien-ingresados">Recién ingresados</TituloDeSeccion>
      </Aparecer>
      <Aparecer>
        <ul className="mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {autos.map((auto) => (
            <li key={auto.id} className="w-[78%] max-w-80 shrink-0 snap-start lg:w-auto lg:max-w-none">
              <TarjetaAuto auto={auto} sizes="(min-width: 1024px) 270px, 78vw" />
            </li>
          ))}
        </ul>
      </Aparecer>
    </section>
  );
}
