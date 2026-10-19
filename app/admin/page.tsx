import { Suspense } from "react";
import { BarraDeLaAdministracion } from "@/components/admin/barra";
import { Resumen, ResumenDeRelleno } from "@/components/admin/resumen";
import { Tareas } from "@/components/admin/tareas";
import {
  FilasDeRelleno,
  ListaDeLaAdministracion,
  NoSePudieronCargar,
  TusAutos,
  ordenarParaLaAdministracion,
} from "@/components/admin/tus-autos";
import type { Auto } from "@/lib/autos";
import { verificarAdmin } from "@/lib/sesion";
import { traerAutos } from "@/lib/traer-autos";

// `null`: la base no contestó.
type AutosDelPanel = Promise<Auto[] | null>;

// El inicio de la administración, «tareas primero»: arriba lo que se viene a hacer,
// abajo la lista de los autos. La barra y las tareas salen enseguida; el resumen
// y la lista llegan cuando contesta la base.
export default async function Administracion() {
  const { email, supabase } = await verificarAdmin();
  const autos: AutosDelPanel = traerAutos(supabase).then(ordenarParaLaAdministracion, (error) => {
    console.error(error);
    return null;
  });

  return (
    <>
      <BarraDeLaAdministracion email={email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
        <div className="mb-5 min-h-5">
          <Suspense fallback={<ResumenDeRelleno />}>
            <ResumenConDatos autos={autos} />
          </Suspense>
        </div>
        <Tareas />
        <TusAutos>
          <Suspense fallback={<FilasDeRelleno />}>
            <ListaConDatos autos={autos} />
          </Suspense>
        </TusAutos>
      </main>
    </>
  );
}

async function ResumenConDatos({ autos }: { autos: AutosDelPanel }) {
  const lista = await autos;
  return lista && <Resumen autos={lista} />;
}

async function ListaConDatos({ autos }: { autos: AutosDelPanel }) {
  const lista = await autos;
  return lista ? <ListaDeLaAdministracion autos={lista} /> : <NoSePudieronCargar />;
}
