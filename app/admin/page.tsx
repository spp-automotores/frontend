import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { BarraDeLaAdministracion } from "@/components/admin/barra";
import { Tablero, TableroDeRelleno } from "@/components/admin/tablero";
import { Tareas } from "@/components/admin/tareas";
import {
  FilasDeRelleno,
  ListaDeLaAdministracion,
  NoSePudieronCargar,
  TusAutos,
  ordenarParaLaAdministracion,
} from "@/components/admin/tus-autos";
import { type Auto, direccionDelAuto, nombreDelAuto } from "@/lib/autos";
import { verificarAdmin } from "@/lib/sesion";
import { traerAutos } from "@/lib/traer-autos";

// `null`: la base no contestó.
type AutosDelPanel = Promise<Auto[] | null>;

// El inicio de la administración, «tareas primero»: arriba lo que se viene a hacer,
// después «Cómo va» (el tablero) y abajo la lista de los autos. La barra y las tareas
// salen enseguida; el tablero y la lista llegan cuando contesta la base. Después de guardar un auto, arriba de todo
// va el aviso de listo (`?cargado=<id>` o `?editado=<id>`).
export default async function Administracion({ searchParams }: PageProps<"/admin">) {
  const { email, supabase } = await verificarAdmin();
  const { cargado, editado } = await searchParams;
  const guardado =
    typeof cargado === "string"
      ? { id: cargado, nuevo: true }
      : typeof editado === "string"
        ? { id: editado, nuevo: false }
        : null;
  const autos: AutosDelPanel = traerAutos(supabase).then(ordenarParaLaAdministracion, (error) => {
    console.error(error);
    return null;
  });

  return (
    <>
      <BarraDeLaAdministracion email={email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
        {guardado && (
          <Suspense>
            <AvisoDeGuardado autos={autos} {...guardado} />
          </Suspense>
        )}
        <Tareas />
        <Suspense fallback={<TableroDeRelleno />}>
          <TableroConDatos autos={autos} />
        </Suspense>
        <TusAutos>
          <Suspense fallback={<FilasDeRelleno />}>
            <ListaConDatos autos={autos} />
          </Suspense>
        </TusAutos>
      </main>
    </>
  );
}

async function TableroConDatos({ autos }: { autos: AutosDelPanel }) {
  const lista = await autos;
  // Si la base no contestó, la lista de abajo ya lo avisa.
  return lista && <Tablero autos={lista} />;
}

async function ListaConDatos({ autos }: { autos: AutosDelPanel }) {
  const lista = await autos;
  return lista ? <ListaDeLaAdministracion autos={lista} /> : <NoSePudieronCargar />;
}

/** «Listo» después de guardar, con el auto nombrado y el link a su página (ya se ve el cambio). */
async function AvisoDeGuardado({ autos, id, nuevo }: { autos: AutosDelPanel; id: string; nuevo: boolean }) {
  const auto = (await autos)?.find((uno) => uno.id === id);
  if (!auto) return null;
  const nombre = `${nombreDelAuto(auto)} ${auto.anio}`;

  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-3 rounded-2xl border border-disponible/40 bg-disponible/10 p-4"
    >
      <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-disponible" />
      <div className="min-w-0 text-sm">
        <p className="font-semibold text-pretty [overflow-wrap:anywhere]">
          {nuevo ? `Listo, se cargó el ${nombre}.` : `Listo, se guardaron los cambios del ${nombre}.`}
        </p>
        <p className="mt-1 text-pretty text-foreground/75">
          {nuevo ? "Ya está en el sitio." : "Ya se ven en el sitio."}{" "}
          <Link href={direccionDelAuto(auto)} className="font-semibold underline underline-offset-4">
            Ver su página
          </Link>
        </p>
      </div>
    </div>
  );
}
