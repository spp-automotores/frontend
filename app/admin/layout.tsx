import type { Metadata } from "next";
import { agencia } from "@/lib/agencia";

// El panel va sin la barra ni el pie del sitio, y fuera de Google.
// Ojo: este layout no protege nada (no se vuelve a armar al navegar). La pared es
// `verificarAdmin()`, en cada página y cada acción.
export const metadata: Metadata = {
  title: `Panel · ${agencia.nombre}`,
  robots: { index: false, follow: false },
};

export default function LayoutDelPanel({ children }: LayoutProps<"/admin">) {
  return children;
}
