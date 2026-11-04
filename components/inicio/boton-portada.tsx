import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  texto: string;
  /** «rojo»: el botón principal. «claro»: el segundo, en el color del texto. */
  tono: "rojo" | "claro";
  /** «abajo» cuando el enlace lleva a una sección más abajo de la misma página. */
  flecha?: "derecha" | "abajo";
};

const tonos = {
  rojo: "bg-primary text-primary-foreground",
  claro: "bg-foreground text-background",
};

/**
 * Botón grande de la portada. Al pasar el mouse, las letras ruedan hacia arriba una por una
 * (como un cartel de aeropuerto), cruza un brillo y la flecha avanza. En el celular no hay
 * mouse: se ve el botón quieto. Con «reducir movimiento» activado, tampoco se mueve.
 */
export function BotonPortada({ href, texto, tono, flecha = "derecha" }: Props) {
  const Flecha = flecha === "abajo" ? ArrowDown : ArrowRight;
  const letras = Array.from(texto);
  const clases = cn(
    "group relative isolate inline-flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full px-8",
    "font-heading text-base font-black uppercase tracking-wide [font-stretch:125%] sm:min-h-16 sm:w-auto sm:px-10 sm:text-lg",
    "transition-transform duration-200 ease-out hover:scale-[1.04] active:scale-[0.97] motion-reduce:hover:scale-100",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
    tonos[tono],
  );

  const contenido = (
    <>
      <span className="sr-only">{texto}</span>

      {/* El brillo que cruza el botón. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/3 -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent opacity-0 transition-[translate,opacity] duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100 motion-reduce:hidden"
      />

      <span aria-hidden="true" className="flex overflow-hidden leading-[1.3]">
        {letras.map((letra, i) => {
          const caracter = letra === " " ? " " : letra;
          const demora = { transitionDelay: `${i * 30}ms` };
          return (
            <span key={i} className="relative inline-block">
              <span
                style={demora}
                className="block transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full motion-reduce:group-hover:translate-y-0"
              >
                {caracter}
              </span>
              <span
                style={demora}
                className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0 motion-reduce:hidden"
              >
                {caracter}
              </span>
            </span>
          );
        })}
      </span>

      <Flecha
        aria-hidden="true"
        strokeWidth={2.5}
        className={cn(
          "size-5 shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none",
          flecha === "abajo" ? "group-hover:translate-y-1" : "group-hover:translate-x-1.5",
        )}
      />
    </>
  );

  // Un enlace dentro de la misma página va con <a>; uno a otra página, con <Link>.
  return href.startsWith("#") ? (
    <a href={href} className={clases}>
      {contenido}
    </a>
  ) : (
    <Link href={href} className={clases}>
      {contenido}
    </Link>
  );
}
