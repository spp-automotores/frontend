import Image from "next/image";
import { BotonWhatsapp } from "@/components/boton-whatsapp";
import {
  type Auto,
  type Estado,
  formatearKm,
  formatearPrecio,
  nombreDelAuto,
} from "@/lib/autos";
import { mensajeDeConsulta } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const puntoDeEstado: Record<Estado, string> = {
  Disponible: "bg-disponible",
  Reservado: "bg-reservado",
  Vendido: "bg-highlight",
};

export function TarjetaAuto({ auto, sizes }: { auto: Auto; sizes: string }) {
  const foto = auto.fotos[0];
  const vendido = auto.estado === "Vendido";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-card">
      <div className="relative aspect-[4/5] bg-muted">
        {foto && (
          <Image
            src={foto.src}
            alt={foto.alt}
            fill
            sizes={sizes}
            className={cn("object-cover", vendido && "opacity-50")}
          />
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold">
          <span aria-hidden="true" className={cn("size-1.5 rounded-full", puntoDeEstado[auto.estado])} />
          {auto.estado}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base leading-snug font-semibold text-pretty">{nombreDelAuto(auto)}</h3>
        <p className="mt-1 font-heading text-2xl font-extrabold tabular-nums [font-stretch:115%]">
          {vendido ? (
            <span className="text-muted-foreground">Vendido</span>
          ) : auto.precio === null ? (
            "Consultar"
          ) : (
            formatearPrecio(auto.precio)
          )}
        </p>
        <p className="mt-2 text-sm text-muted-foreground tabular-nums">
          {[auto.anio, formatearKm(auto.km), auto.combustible, auto.caja].join(" · ")}
        </p>
        <div className="mt-auto pt-4">
          {vendido ? (
            <p className="text-sm text-muted-foreground">Este auto ya se vendió.</p>
          ) : (
            <BotonWhatsapp
              mensaje={mensajeDeConsulta(auto)}
              etiqueta="Consultar por WhatsApp"
              className="w-full"
            />
          )}
        </div>
      </div>
    </article>
  );
}
