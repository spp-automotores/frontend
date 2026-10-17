import { salir } from "@/app/admin/acciones";
import { Button } from "@/components/ui/button";
import { agencia } from "@/lib/agencia";
import { verificarAdmin } from "@/lib/sesion";

// El panel. Por ahora sólo muestra con qué cuenta se entró; cargar los autos llega después.
export default async function Panel() {
  const { email } = await verificarAdmin();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex items-start justify-between gap-4 border-b border-border pb-6">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl leading-tight font-black uppercase tracking-tight [font-stretch:125%] sm:text-3xl">
            Panel de {agencia.nombre}
          </h1>
          {email && (
            <p className="mt-2 text-sm text-muted-foreground [overflow-wrap:anywhere]">
              Entraste como {email}
            </p>
          )}
        </div>
        <form action={salir}>
          <Button type="submit" variant="outline" className="h-11 rounded-full px-5">
            Salir
          </Button>
        </form>
      </header>

      <p className="mt-10 text-muted-foreground">Acá vas a cargar los autos.</p>
    </main>
  );
}
