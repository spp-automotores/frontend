import Link from "next/link";
import { BarraSuperior } from "@/components/barra-superior";
import { Pie } from "@/components/pie";
import { TituloDeSeccion } from "@/components/titulo-de-seccion";

/** Un link a un auto que ya no está (o que nunca estuvo). El servidor responde 404. */
export default function AutoQueNoEsta() {
  return (
    <>
      <BarraSuperior enPortada={false} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center px-4 pt-32 pb-24 sm:px-6">
        <TituloDeSeccion>Este auto no está</TituloDeSeccion>
        <p className="mt-4 max-w-md text-pretty text-muted-foreground">
          Puede que ya no esté publicado o que el link esté incompleto. Mirá los autos que tenemos ahora.
        </p>
        <Link
          href="/#recien-ingresados"
          className="mt-8 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform duration-150 ease-out hover:bg-primary/85 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Ver los autos
        </Link>
      </main>
      <Pie />
    </>
  );
}
