import { BotonWhatsapp } from "@/components/boton-whatsapp";
import { type Auto, textoDelPrecio } from "@/lib/autos";
import { mensajeDeConsulta } from "@/lib/whatsapp";

/**
 * Sólo en el celular: queda fija abajo con el precio y el botón, mientras la persona
 * baja. La página le deja su lugar al final (ver `app/autos/[slug]/page.tsx`).
 * Sin precio, a la izquierda va el auto, para no leer «Consultar» dos veces.
 */
export function BarraDeConsulta({ auto }: { auto: Auto }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="flex h-18 items-center justify-between gap-3 px-4">
        {auto.precio === null ? (
          <p className="min-w-0 truncate font-semibold">
            {auto.marca} {auto.modelo} {auto.anio}
          </p>
        ) : (
          <p className="font-heading text-xl font-extrabold tabular-nums [font-stretch:115%]">
            {textoDelPrecio(auto)}
          </p>
        )}
        <BotonWhatsapp mensaje={mensajeDeConsulta(auto)} etiqueta="Consultar" className="shrink-0 px-5" />
      </div>
    </div>
  );
}
