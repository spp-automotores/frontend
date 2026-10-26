import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FormularioEntrar } from "@/components/admin/formulario-entrar";
import { agencia } from "@/lib/agencia";

// La pantalla para entrar a la administración. Si ya hay una sesión de administrador,
// el Proxy manda directo a `/admin`. `?sin-acceso`: llegó una cuenta sin la marca de
// administrador.
export default async function Entrar({ searchParams }: PageProps<"/admin/entrar">) {
  const sinAcceso = "sin-acceso" in (await searchParams);

  return (
    <main className="flex flex-1 justify-center px-4 pt-[max(3rem,12vh)] pb-12 sm:items-center sm:pt-12">
      <div className="w-full max-w-sm">
        <p className="font-heading text-sm font-extrabold uppercase tracking-tight [font-stretch:125%]">
          {agencia.nombre}
        </p>
        <h1 className="mt-2 text-3xl leading-tight font-bold tracking-tight">Administración</h1>
        <p className="mt-2 text-sm text-muted-foreground">Ingresá con tu email y tu contraseña.</p>

        <div className="mt-7">
          <FormularioEntrar
            aviso={sinAcceso ? "Esta cuenta no tiene acceso a la administración." : null}
          />
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver al sitio
        </Link>
      </div>
    </main>
  );
}
