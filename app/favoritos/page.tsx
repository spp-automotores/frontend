import type { Metadata } from "next";
import Link from "next/link";
import { BarraSuperior } from "@/components/barra-superior";
import { ListaDeFavoritos } from "@/components/favoritos/lista-de-favoritos";
import { Pie } from "@/components/pie";
import { TarjetaAuto } from "@/components/tarjeta-auto";
import { agencia } from "@/lib/agencia";
import { traerAutos } from "@/lib/autos";

// La página es la misma para todos (se arma una vez): cada navegador muestra sus favoritos.

export const metadata: Metadata = {
  title: `Favoritos · ${agencia.nombre}`,
  description: `Los autos que guardaste en ${agencia.nombre}.`,
  // Es personal: no tiene sentido en Google.
  robots: { index: false, follow: true },
  alternates: { canonical: "/favoritos" },
};

const boton =
  "inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform duration-150 ease-out hover:bg-primary/85 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default async function Favoritos() {
  // Todos los autos, también los vendidos fuera de plazo: si alguien guardó uno,
  // ve que se vendió en vez de que desaparezca sin explicación.
  const autos = await traerAutos();

  return (
    <>
      <BarraSuperior enPortada={false} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-16 sm:px-6 sm:pb-24 lg:pt-28">
        <h1 className="font-heading text-4xl leading-none font-black uppercase tracking-tight [font-stretch:125%] sm:text-5xl">
          Tus favoritos
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Quedan guardados en este dispositivo, sin crear cuenta.
        </p>

        <ListaDeFavoritos
          tarjetas={autos.map((auto) => ({
            id: auto.id,
            tarjeta: (
              <TarjetaAuto
                auto={auto}
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              />
            ),
          }))}
          sinFavoritos={
            <div className="mt-12 rounded-2xl bg-card p-6 sm:p-8">
              <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight [font-stretch:125%]">
                Todavía no guardaste autos
              </h2>
              <p className="mt-2 text-pretty text-muted-foreground">
                Tocá el corazón de un auto para tenerlo acá.
              </p>
              <Link href="/autos" className={`${boton} mt-6`}>
                Ver autos
              </Link>
            </div>
          }
        />
      </main>
      <Pie />
    </>
  );
}
