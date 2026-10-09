import { TarjetaAuto } from "@/components/tarjeta-auto";
import type { Auto } from "@/lib/autos";
import { cn } from "@/lib/utils";

const columnas = {
  3: { grilla: "lg:grid-cols-3", tamano: "(min-width: 1024px) 360px, 78vw" },
  4: { grilla: "lg:grid-cols-4", tamano: "(min-width: 1024px) 270px, 78vw" },
};

/** En el celular se desliza de costado; en la computadora, en columnas. */
export function ListaDeAutos({ autos, enColumnas }: { autos: Auto[]; enColumnas: 3 | 4 }) {
  const { grilla, tamano } = columnas[enColumnas];
  return (
    <ul
      className={cn(
        "flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 lg:grid lg:overflow-visible",
        grilla,
      )}
    >
      {autos.map((auto) => (
        <li key={auto.id} className="w-[78%] max-w-80 shrink-0 snap-start lg:w-auto lg:max-w-none">
          <TarjetaAuto auto={auto} sizes={tamano} />
        </li>
      ))}
    </ul>
  );
}
