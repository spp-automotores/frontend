import { ArrowUpRight, CircleAlert } from "lucide-react";
import type { Metadata } from "next";
import { editarAuto } from "@/app/admin/acciones";
import { BarraDeLaAdministracion } from "@/components/admin/barra";
import { FormularioDelAuto } from "@/components/admin/formulario-del-auto";
import { VolverATusAutos } from "@/components/admin/volver-a-tus-autos";
import { buttonVariants } from "@/components/ui/button";
import { agencia } from "@/lib/agencia";
import { type Auto, direccionDelAuto, nombreDelAuto } from "@/lib/autos";
import { valoresDeUnAuto } from "@/lib/formulario-del-auto";
import { verificarAdmin } from "@/lib/sesion";
import { traerAutoPorId } from "@/lib/traer-autos";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Editar un auto · Administración · ${agencia.nombre}`,
};

// «Editar», al tocar un auto de «Tus autos». El mismo formulario que «Cargar un auto»,
// lleno con lo que tiene. Su dirección en el sitio no cambia al guardar.
export default async function EditarUnAuto({ params }: PageProps<"/admin/autos/[id]">) {
  const { email, supabase } = await verificarAdmin();
  const { id } = await params;

  // `undefined`: la base no contestó; `null`: ese auto no existe.
  const auto: Auto | null | undefined = await traerAutoPorId(supabase, id).catch((error) => {
    console.error(error);
    return undefined;
  });

  return (
    <>
      <BarraDeLaAdministracion email={email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 sm:pb-16">
        <div className="flex items-center justify-between gap-3">
          <VolverATusAutos />
          {/* En otra pestaña: así lo escrito en el formulario no se pierde. */}
          {auto && (
            <a
              href={direccionDelAuto(auto)}
              target="_blank"
              rel="noopener"
              className={cn(buttonVariants(), "px-5")}
            >
              Ver en el sitio
              <ArrowUpRight aria-hidden="true" />
              <span className="sr-only">(se abre en otra pestaña)</span>
            </a>
          )}
        </div>
        {auto ? (
          <>
            <div className="mt-4 mb-6 sm:mt-6">
              <h2 className="font-heading text-3xl leading-none font-black uppercase tracking-tight text-foreground [font-stretch:125%] sm:text-4xl">
                Editar
              </h2>
              <p className="mt-3 text-lg leading-snug font-semibold text-foreground/85 [overflow-wrap:anywhere]">
                {nombreDelAuto(auto)} {auto.anio}
              </p>
            </div>
            <FormularioDelAuto
              accion={editarAuto.bind(null, auto.id)}
              valoresIniciales={valoresDeUnAuto(auto)}
              fotos={auto.fotos}
            />
          </>
        ) : (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2.5 rounded-2xl border border-highlight/40 bg-highlight/10 p-5"
          >
            <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-highlight" />
            <div>
              <p className="font-semibold">
                {auto === null ? "Este auto no está en la lista." : "No se pudo abrir el auto."}
              </p>
              <p className="mt-1 text-sm text-foreground/75">
                {auto === null
                  ? "Volvé a «Tus autos» y elegilo de nuevo."
                  : "Puede ser la conexión. Recargá la página en un momento."}
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
