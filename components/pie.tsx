import { BotonWhatsapp } from "@/components/boton-whatsapp";
import { agencia } from "@/lib/agencia";
import { mensajeGeneral } from "@/lib/whatsapp";

const nombresDeRedes = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" } as const;

/** Dirección, horarios, redes y mail aparecen solos cuando se cargan en `lib/agencia.ts`. */
export function Pie() {
  const redes = (Object.keys(nombresDeRedes) as (keyof typeof nombresDeRedes)[]).flatMap((red) => {
    const url = agencia.redes[red];
    return url ? [{ nombre: nombresDeRedes[red], url }] : [];
  });

  return (
    <footer className="border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="font-heading text-base font-extrabold text-foreground uppercase [font-stretch:125%]">
            {agencia.nombre}
          </p>
          <p>{agencia.ciudad}</p>
          {agencia.direccion && <p>{agencia.direccion}</p>}
          {agencia.horarios && <p>{agencia.horarios}</p>}
          {agencia.mail && (
            <p>
              <a href={`mailto:${agencia.mail}`} className="underline-offset-4 hover:underline">
                {agencia.mail}
              </a>
            </p>
          )}
          {redes.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              {redes.map((red) => (
                <li key={red.nombre}>
                  <a
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {red.nombre}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <BotonWhatsapp mensaje={mensajeGeneral} etiqueta="Escribinos por WhatsApp" className="self-start" />
      </div>
    </footer>
  );
}
