import type { Metadata } from "next";
import { cargarAuto } from "@/app/admin/acciones";
import { BarraDeLaAdministracion } from "@/components/admin/barra";
import { FormularioDelAuto } from "@/components/admin/formulario-del-auto";
import { VolverATusAutos } from "@/components/admin/volver-a-tus-autos";
import { agencia } from "@/lib/agencia";
import { verificarAdmin } from "@/lib/sesion";

export const metadata: Metadata = {
  title: `Cargar un auto · Administración · ${agencia.nombre}`,
};

export default async function CargarUnAuto() {
  const { email } = await verificarAdmin();

  return (
    <>
      <BarraDeLaAdministracion email={email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 sm:pb-16">
        <VolverATusAutos />
        <h2 className="mt-4 mb-6 font-heading text-3xl leading-none font-black uppercase tracking-tight [font-stretch:125%] sm:mt-6 sm:text-4xl">
          Cargar un auto
        </h2>
        <FormularioDelAuto accion={cargarAuto} valoresIniciales={{ estado: "Disponible" }} fotos={[]} />
      </main>
    </>
  );
}
