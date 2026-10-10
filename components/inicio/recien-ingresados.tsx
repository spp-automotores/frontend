import { Aparecer } from "@/components/aparecer";
import { ListaDeAutos } from "@/components/lista-de-autos";
import { TituloDeSeccion } from "@/components/titulo-de-seccion";
import type { Auto } from "@/lib/autos";

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
      <Aparecer className="mt-8" escalonado>
        <ListaDeAutos autos={autos} enColumnas={4} escalonado />
      </Aparecer>
    </section>
  );
}
