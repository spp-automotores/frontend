import { MenuDeLaCuenta } from "@/components/admin/menu-de-la-cuenta";
import { agencia } from "@/lib/agencia";

/** La barra de arriba de la administración: el nombre y el menú de la cuenta. */
export function BarraDeLaAdministracion({ email }: { email: string | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* En el celular, una debajo de la otra: en una sola línea no entran junto al menú. */}
        <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
          <p className="font-heading text-sm leading-tight font-extrabold uppercase tracking-tight [font-stretch:125%] sm:text-base">
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
