import { Aparecer } from "@/components/aparecer";
import { BotonWhatsapp } from "@/components/boton-whatsapp";
import { mensajeDeVenta } from "@/lib/whatsapp";

export function VendeTuAuto() {
  return (
    <section
      id="vende-tu-auto"
      aria-labelledby="titulo-vende"
      className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 pb-16 sm:px-6 sm:pb-24"
    >
      <Aparecer>
        <div className="rounded-3xl bg-[linear-gradient(135deg,var(--primary),color-mix(in_oklch,var(--primary),var(--background)_45%))] p-6 text-primary-foreground sm:flex sm:items-end sm:justify-between sm:gap-8 sm:p-10">
          <div>
            <h2
              id="titulo-vende"
              className="font-heading text-3xl leading-none font-black uppercase tracking-tight [font-stretch:125%] sm:text-4xl"
            >
              ¿Querés vender tu auto?
            </h2>
            <p className="mt-3 max-w-md text-pretty">
              Mandanos la marca, el modelo, el año y los kilómetros por WhatsApp, y te respondemos.
            </p>
          </div>
          <BotonWhatsapp
            mensaje={mensajeDeVenta}
            etiqueta="Cotizalo por WhatsApp"
            variante="oscuro"
            className="mt-6 shrink-0 sm:mt-0"
          />
        </div>
      </Aparecer>
    </section>
  );
}
