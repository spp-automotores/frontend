import { ArrowUpRight, ChevronRight, Globe, Plus, Tag } from "lucide-react";
import Link from "next/link";

/** Lo que se viene a hacer, arriba de todo. */
export function Tareas() {
  return (
    <section aria-labelledby="titulo-tareas">
      <h2 id="titulo-tareas" className="sr-only">
        Tareas
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/autos/nuevo"
          className="flex min-h-18 items-center gap-4 rounded-2xl bg-primary px-5 py-4 text-primary-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-primary/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] sm:col-span-2"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
            <Plus aria-hidden="true" className="size-5" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-lg leading-tight font-semibold">Cargar un auto</span>
            <span className="text-sm text-primary-foreground/80">Sus datos, el precio y el estado</span>
          </span>
        </Link>

        <Link
          href="/admin/estado"
          className="group flex min-h-16 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
        >
          <Tag aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="leading-tight font-semibold">Marcar vendido o reservado</span>
            <span className="text-sm text-muted-foreground">Un toque por auto</span>
          </span>
          <ChevronRight
            aria-hidden="true"
            className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </Link>

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
