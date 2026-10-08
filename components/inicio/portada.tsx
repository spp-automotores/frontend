import { VideoDeFondo } from "@/components/video-de-fondo";
import { agencia } from "@/lib/agencia";

type Props = { video: { src: string; poster: string } };

const boton =
  "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function Portada({ video }: Props) {
  return (
    <section id="inicio" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <VideoDeFondo src={video.src} poster={video.poster} />
      {/* Oscurece el video para que el texto se lea siempre. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/40"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-4 pt-28 pb-10 sm:px-6 sm:pb-16">
        <p className="text-sm font-medium text-muted-foreground">
          Agencia de autos · {agencia.ciudad}
        </p>
        <h1 className="mt-3 max-w-4xl">
          <span className="block font-heading text-[clamp(2.25rem,10vw,5.5rem)] leading-[0.95] font-black uppercase tracking-tight [font-stretch:125%]">
            {agencia.frase.principio}
          </span>
          <span className="mt-2 block font-serif text-[clamp(1.75rem,7.5vw,3.75rem)] leading-tight text-highlight italic text-balance">
            {agencia.frase.final}
          </span>
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#recien-ingresados" className={`${boton} bg-foreground text-background`}>
            Ver autos
          </a>
          <a
            href="#vende-tu-auto"
            className={`${boton} border border-foreground/30 bg-background/30 text-foreground backdrop-blur-sm`}
          >
            Vendé tu auto
          </a>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          Sitio en preparación: autos, fotos y video son de ejemplo.
        </p>
      </div>
    </section>
  );
}
