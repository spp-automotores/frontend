import { Aparecer } from "@/components/aparecer";
import { TituloDeSeccion } from "@/components/titulo-de-seccion";
import { porQue } from "@/lib/agencia";

export function PorQueSpp() {
  return (
    <section
      aria-labelledby="titulo-por-que"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <Aparecer>
        <TituloDeSeccion id="titulo-por-que">Por qué SPP</TituloDeSeccion>
      </Aparecer>
      <Aparecer>
        <dl className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {porQue.map((item) => (
            <div key={item.titulo} className="border-t border-border pt-5">
              <dt className="font-serif text-3xl text-highlight italic">{item.titulo}</dt>
              <dd className="mt-3 text-pretty text-muted-foreground">{item.texto}</dd>
            </div>
          ))}
        </dl>
      </Aparecer>
    </section>
  );
}
