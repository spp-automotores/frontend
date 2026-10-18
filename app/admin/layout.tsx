import type { Metadata } from "next";
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
      {children}
    </div>
  );
}
