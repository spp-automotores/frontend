import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BarraDeLaAdministracion } from "@/components/admin/barra";
import { FormularioContrasena } from "@/components/admin/formulario-contrasena";
import { agencia } from "@/lib/agencia";
import { verificarAdmin } from "@/lib/sesion";

export const metadata: Metadata = {
  title: `Cambiar mi contraseña · Administración · ${agencia.nombre}`,
};

// «Cambiar mi contraseña», desde el menú de la cuenta. Pide la actual: si alguien agarra el
// celular con la sesión abierta, no puede cambiarla.
export default async function CambiarContrasena() {
  const { email } = await verificarAdmin();

  return (
    <>
      <BarraDeLaAdministracion email={email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-4 pb-16 sm:px-6 sm:pt-6">
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver a la administración
        </Link>

        <div className="mt-3 max-w-sm sm:mt-5">
          <h2 className="text-2xl leading-tight font-bold tracking-tight">Cambiar mi contraseña</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Primero la actual, después la nueva dos veces.
          </p>
          <div className="mt-6">
            <FormularioContrasena email={email} />
          </div>
        </div>
      </main>
    </>
  );
}
