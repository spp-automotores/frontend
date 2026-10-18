import { ArrowUpRight, Globe, Plus, Tag } from "lucide-react";
import Link from "next/link";

const proximoPaso = "Llega en el próximo paso";

/**
 * Lo que se viene a hacer, arriba de todo. «Cargar un auto» y «Marcar vendido o
 * reservado» quedan apagados hasta que esté la carga de autos.
 */
export function Tareas() {
  return (
    <section aria-labelledby="titulo-tareas">
      <h2 id="titulo-tareas" className="sr-only">
        Tareas
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled
          className="flex min-h-18 cursor-not-allowed items-center gap-4 rounded-2xl bg-primary/40 px-5 py-4 text-left text-primary-foreground/85 sm:col-span-2"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
            <Plus aria-hidden="true" className="size-5" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-lg leading-tight font-semibold">Cargar un auto</span>
            <span className="text-sm text-primary-foreground/70">{proximoPaso}</span>
          </span>
        </button>

        <button
          type="button"
          disabled
          className="flex min-h-16 cursor-not-allowed items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left text-foreground/70"
        >
          <Tag aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
          <span className="flex flex-col gap-0.5">
            <span className="leading-tight font-semibold">Marcar vendido o reservado</span>
            <span className="text-sm text-muted-foreground">{proximoPaso}</span>
          </span>
        </button>

        <Link
          href="/"
          className="group flex min-h-16 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
        >
          <Globe aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
          <span className="flex-1 leading-tight font-semibold">Ver el sitio</span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </Link>
      </div>
    </section>
  );
}
