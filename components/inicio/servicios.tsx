import { ArrowLeftRight, FileCheck, Landmark, type LucideIcon, Truck } from "lucide-react";
import { Aparecer } from "@/components/aparecer";
import { TituloDeSeccion } from "@/components/titulo-de-seccion";
import { type IconoServicio, servicios } from "@/lib/agencia";

const iconos: Record<IconoServicio, LucideIcon> = {
  financiacion: Landmark,
  permuta: ArrowLeftRight,
  tramites: FileCheck,
  entrega: Truck,
};

export function Servicios() {
  return (
    <section
      aria-labelledby="titulo-servicios"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <Aparecer>
        <TituloDeSeccion id="titulo-servicios">Servicios</TituloDeSeccion>
      </Aparecer>
      <Aparecer>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {servicios.map((servicio) => {
            const Icono = iconos[servicio.icono];
            return (
              <li key={servicio.titulo} className="rounded-2xl bg-card p-5">
                <Icono aria-hidden="true" className="size-6 text-highlight" strokeWidth={1.75} />
                <h3 className="mt-4 font-semibold">{servicio.titulo}</h3>
                <p className="mt-1 text-sm text-pretty text-muted-foreground">{servicio.texto}</p>
              </li>
            );
          })}
        </ul>
      </Aparecer>
    </section>
  );
}
