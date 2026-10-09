import Image from "next/image";
import { Aparecer, AparecerItem } from "@/components/aparecer";
import { TituloDeSeccion } from "@/components/titulo-de-seccion";
import type { Foto } from "@/lib/autos";

export function Entregas({ fotos }: { fotos: Foto[] }) {
  return (
    <section aria-labelledby="titulo-entregas" className="mx-auto w-full max-w-6xl py-16 sm:py-24">
      <Aparecer className="px-4 sm:px-6">
        <TituloDeSeccion id="titulo-entregas">Entregas</TituloDeSeccion>
      </Aparecer>
      <Aparecer escalonado>
        <ul className="mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-6">
          {fotos.map((foto) => (
            <li key={foto.src} className="w-[70%] max-w-72 shrink-0 snap-start sm:w-auto sm:max-w-none">
              <AparecerItem className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 70vw"
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold">
                  Ejemplo
                </span>
              </AparecerItem>
            </li>
          ))}
        </ul>
      </Aparecer>
    </section>
  );
}
