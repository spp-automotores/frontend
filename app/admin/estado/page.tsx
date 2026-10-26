import type { Metadata } from "next";
import { Suspense } from "react";
import { BarraDeLaAdministracion } from "@/components/admin/barra";
import { FilaDeEstado } from "@/components/admin/cambiar-estado";
import { FilasDeRelleno, NoSePudieronCargar } from "@/components/admin/tus-autos";
import { VolverATusAutos } from "@/components/admin/volver-a-tus-autos";
import { agencia } from "@/lib/agencia";
import { verificarAdmin } from "@/lib/sesion";
import { traerAutos } from "@/lib/traer-autos";

export const metadata: Metadata = {
  title: `Marcar vendido o reservado · Administración · ${agencia.nombre}`,
};

// La tarea más repetida desde el celular: cambiar el estado de un auto con un toque, sin
// abrir el formulario. Los autos van del más nuevo al más viejo (no por estado: así una
// fila no salta de lugar al tocarla).
export default async function MarcarVendidoOReservado() {
  const { email } = await verificarAdmin();

  return (
    <>
      <BarraDeLaAdministracion email={email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-4 pb-16 sm:px-6 sm:pt-6">
        <VolverATusAutos />
        <h2 className="mt-3 font-heading text-2xl leading-none font-black uppercase tracking-tight [font-stretch:125%] sm:mt-5 sm:text-3xl">
          Vendido o reservado
        </h2>
        <p className="mt-3 max-w-prose text-sm text-pretty text-muted-foreground">
          Tocá el estado de cada auto: se guarda solo. Un vendido sigue a la vista{" "}
          {agencia.diasVisibleVendido} días con el sello «Vendido» y después se oculta.
        </p>
        <div className="mt-6">
          <Suspense fallback={<FilasDeRelleno />}>
            <ListaDeEstados />
          </Suspense>
        </div>
      </main>
    </>
  );
}

async function ListaDeEstados() {
  const { supabase } = await verificarAdmin();
  const autos = await traerAutos(supabase).catch((error) => {
    console.error(error);
    return null;
  });

  if (!autos) return <NoSePudieronCargar />;
  if (autos.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay autos cargados.</p>;
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      {autos.map((auto) => (
        <FilaDeEstado key={auto.id} auto={auto} />
      ))}
    </ul>
  );
}
