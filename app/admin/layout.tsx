import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { agencia } from "@/lib/agencia";

// La administración va sin la barra ni el pie del sitio, y fuera de Google.
// Ojo: este layout no protege nada (no se vuelve a armar al navegar). La pared es
// `verificarAdmin()`, en cada página y cada acción.
export const metadata: Metadata = {
  title: `Administración · ${agencia.nombre}`,
  robots: { index: false, follow: false },
};

export default function LayoutDeLaAdministracion({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col selection:bg-primary selection:text-primary-foreground">
      {process.env.ES_PRODUCCION !== "si" && <CartelDePruebas />}
      {children}
    </div>
  );
}

/**
 * Fuera de producción (los links de prueba y la copia local) el panel usa la base de
 * pruebas: el cartel avisa que lo que se cargue acá no aparece en el sitio real.
 */
function CartelDePruebas() {
  return (
    <p className="flex items-center justify-center gap-2 bg-primary px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-center text-sm font-medium text-primary-foreground">
      <FlaskConical aria-hidden className="size-4 shrink-0" />
      Pruebas: esto no es el sitio real. Lo que cargues acá no aparece en la página de la agencia.
    </p>
  );
}
