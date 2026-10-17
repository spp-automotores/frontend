import { FormularioEntrar } from "@/components/admin/formulario-entrar";
import { agencia } from "@/lib/agencia";

// La pantalla para entrar al panel. Si ya hay una sesión de administrador, el Proxy
// manda directo a `/admin`. `?sin-acceso`: llegó una cuenta sin la marca de administrador.
export default async function Entrar({ searchParams }: PageProps<"/admin/entrar">) {
  const sinAcceso = "sin-acceso" in (await searchParams);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-3xl leading-none font-black uppercase tracking-tight [font-stretch:125%]">
          Panel
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {agencia.nombre}. Entrá con tu email y tu contraseña.
        </p>
        <FormularioEntrar aviso={sinAcceso ? "Esta cuenta no tiene acceso al panel." : null} />
      </div>
    </main>
  );
}
