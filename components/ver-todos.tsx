import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Link «Ver todos» para el costado de un título. Al pasar el mouse, la flecha sale
 * disparada por la derecha y vuelve a entrar por la izquierda, y se dibuja una línea
 * debajo del texto. En el celular se ve quieto; con «reducir movimiento», también.
 */
export function VerTodos({
  href,
  texto = "Ver todos",
  etiqueta,
  className,
}: {
  href: string;
  texto?: string;
  /** El texto completo para lectores de pantalla, si «Ver todos» solo no alcanza. */
  etiqueta?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={etiqueta}
      className={cn(
        "group/ver inline-flex min-h-11 shrink-0 items-center gap-3 rounded-full font-semibold sm:text-lg",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
    >
      <span className="relative">
        {texto}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-highlight transition-transform duration-300 ease-out group-hover/ver:scale-x-100 motion-reduce:transition-none"
        />
      </span>
      <span
        aria-hidden="true"
        className="relative grid size-10 place-items-center overflow-hidden rounded-full bg-primary text-primary-foreground transition-transform duration-200 ease-out group-hover/ver:scale-110 group-active/ver:scale-95 motion-reduce:group-hover/ver:scale-100 sm:size-11"
      >
        {/* La flecha que se ve, que sale por la derecha… */}
        <ArrowRight
          strokeWidth={2.5}
          className="size-5 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/ver:translate-x-[180%] motion-reduce:group-hover/ver:translate-x-0"
        />
        {/* …y la que entra por la izquierda, un poco después. */}
        <ArrowRight
          strokeWidth={2.5}
          className="absolute size-5 -translate-x-[180%] transition-transform delay-75 duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/ver:translate-x-0 motion-reduce:hidden"
        />
      </span>
    </Link>
  );
}
