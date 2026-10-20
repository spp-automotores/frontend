import { ArrowLeft } from "lucide-react";

/**
 * «← Tus autos», arriba de las páginas de la administración. En las de un formulario es
 * un link común (no `next/link`): así, si hay cambios sin guardar, el navegador avisa
 * antes de salir.
 */
export function VolverATusAutos() {
  return (
    <a
      href="/admin"
      className="inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      Tus autos
    </a>
  );
}
