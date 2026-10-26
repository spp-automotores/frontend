import { LogOut } from "lucide-react";
import { salir } from "@/app/admin/acciones";
import { MenuDeLaCuenta } from "@/components/admin/menu-de-la-cuenta";
import { buttonVariants } from "@/components/ui/button";
import { agencia } from "@/lib/agencia";
import { cn } from "@/lib/utils";

/**
 * La barra de arriba de la administración: «Salir» a la vista, el nombre y el
 * menú de la cuenta (que también tiene su «Salir»).
 */
export function BarraDeLaAdministracion({ email }: { email: string | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        {/* Un formulario común: sale también sin JavaScript. */}
        <form action={salir} className="shrink-0">
          <button type="submit" className={cn(buttonVariants(), "px-4 sm:px-5")}>
            <LogOut aria-hidden="true" />
            Salir
          </button>
        </form>
        {/* En el celular, una debajo de la otra y el nombre más chico: si no, no entran junto a los
            botones. Por debajo de 360 px, el nombre puede partirse en dos líneas. */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
          <p className="font-heading text-xs leading-tight font-extrabold uppercase tracking-tight [font-stretch:125%] min-[360px]:whitespace-nowrap sm:text-base">
            {agencia.nombre}
          </p>
          <span aria-hidden="true" className="hidden text-muted-foreground sm:inline">
            ·
          </span>
          <h1 className="text-sm leading-tight text-muted-foreground sm:text-base">Administración</h1>
        </div>
        <MenuDeLaCuenta email={email} />
      </div>
    </header>
  );
}
