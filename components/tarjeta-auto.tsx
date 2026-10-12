import Image from "next/image";
import Link from "next/link";
import { BotonWhatsapp } from "@/components/boton-whatsapp";
import { EstadoDelAuto } from "@/components/estado-del-auto";
import {
  type Auto,
  direccionDelAuto,
  formatearKm,
  nombreDelAuto,
  textoDelPrecio,
} from "@/lib/autos";
import { mensajeDeConsulta } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Toda la tarjeta lleva a la página del auto: el link es el nombre, estirado sobre
 * la tarjeta con una capa invisible. El botón de WhatsApp queda por encima de esa capa.
 */
export function TarjetaAuto({
  auto,
  sizes,
  prioridad = false,
}: {
  auto: Auto;
  sizes: string;
  /** Sólo para la primera tarjeta de una página, si su foto es lo más grande de la pantalla. */
  prioridad?: boolean;
}) {
  const foto = auto.fotos[0];
  const vendido = auto.estado === "Vendido";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ring">
      <div className="relative aspect-[4/5] bg-muted">
        {foto && (
          <Image
            src={foto.src}
            alt={foto.alt}
            fill
            sizes={sizes}
            preload={prioridad}
            className={cn("object-cover", vendido && "opacity-50")}
          />
        )}
        <EstadoDelAuto estado={auto.estado} className="absolute top-3 left-3" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base leading-snug font-semibold text-pretty">
          <Link
            href={direccionDelAuto(auto)}
            className="underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0"
          >
            {nombreDelAuto(auto)}
          </Link>
        </h3>
        <p
          className={cn(
            "mt-1 font-heading text-2xl font-extrabold tabular-nums [font-stretch:115%]",
            vendido && "text-muted-foreground",
          )}
        >
          {textoDelPrecio(auto)}
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
              className="relative z-10 w-full"
            />
          )}
        </div>
      </div>
    </article>
  );
}
