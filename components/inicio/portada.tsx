import Link from "next/link";
import { LogoGrande } from "@/components/inicio/logo-grande";
import { agencia } from "@/lib/agencia";

const boton =
  "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** La portada del Inicio: el logo de la agencia en grande y, debajo, la frase de Sebastián. */
export function Portada() {
  return (
    <section id="inicio" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* Una luz suave detrás del logo, para que el negro no quede plano. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-radial-[ellipse_at_50%_32%] from-card via-background to-background"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-24 pb-10 sm:px-6 sm:pt-28 sm:pb-16">
        <div className="flex flex-1 items-center justify-center pb-10 lg:pb-8">
          <LogoGrande className="max-w-[min(100%,34rem)] lg:max-w-[30rem]" />
        </div>

        <p className="text-sm font-medium text-muted-foreground">
          Agencia de autos · {agencia.ciudad}
        </p>
        <h1 className="mt-3">
          <span className="block font-heading text-[clamp(2.25rem,10vw,4.5rem)] leading-[0.95] font-black uppercase tracking-tight [font-stretch:125%]">
            {agencia.frase.principio}
          </span>
          <span className="mt-3 block font-acento text-[clamp(1.5rem,6.4vw,2.5rem)] leading-tight font-bold text-acento text-balance">
            {agencia.frase.final}
          </span>
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/autos" className={`${boton} bg-foreground text-background`}>
            Ver autos
          </Link>
          <a href="#vende-tu-auto" className={`${boton} border border-foreground/30 text-foreground`}>
            Vendé tu auto
          </a>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          Sitio en preparación: las fotos de entregas son de ejemplo.
        </p>
      </div>
    </section>
  );
}
