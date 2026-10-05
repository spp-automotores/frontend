// Página provisoria mientras se arma el sitio. Usa la paleta y las dos
// tipografías para comprobar que la base del proyecto está bien cargada.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-heading text-5xl font-extrabold uppercase tracking-tight [font-stretch:125%] sm:text-7xl">
        SPP Automotores
      </h1>
      <p className="font-serif text-3xl italic text-highlight sm:text-4xl">
        Muy pronto.
      </p>
      <p className="max-w-md text-muted-foreground">
        Estamos preparando el sitio.
      </p>
    </main>
  );
}
