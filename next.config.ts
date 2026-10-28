import type { NextConfig } from "next";

// Dos bases de datos: producción (la rama `main`, el sitio real) y pruebas (`staging`,
// los links de cada pull request y la copia local). Qué base usa cada link se decide
// al armarlo, porque la dirección y la clave quedan escritas dentro del código.
//
// Cloudflare avisa la rama que está armando en `WORKERS_CI_BRANCH`. Si no es `main`,
// se usan las variables `SUPABASE_PRUEBAS_*`, y si faltan, el armado se corta: nunca
// se cae a la base real por error. En la computadora (sin esa variable) vale lo que
// diga `.env.local`, que apunta a pruebas.

const rama = process.env.WORKERS_CI_BRANCH;
const esProduccion = rama === "main";

const pruebas = {
  url: process.env.SUPABASE_PRUEBAS_URL,
  clave: process.env.SUPABASE_PRUEBAS_PUBLISHABLE_KEY,
};

if (rama && !esProduccion && (!pruebas.url || !pruebas.clave)) {
  throw new Error(
    `La rama «${rama}» usa la base de pruebas: faltan SUPABASE_PRUEBAS_URL o SUPABASE_PRUEBAS_PUBLISHABLE_KEY.`,
  );
}

const base =
  rama && !esProduccion
    ? { url: pruebas.url!, clave: pruebas.clave! }
    : {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        clave: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
      };

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: base.url,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: base.clave,
    // Cada base tiene su carpeta de fotos: una prueba nunca toca una foto real.
    CARPETA_DE_FOTOS: esProduccion ? "autos" : "autos-pruebas",
    // Para el cartel «Pruebas» del panel.
    ES_PRODUCCION: esProduccion ? "si" : "no",
    // La tarea diaria (sólo corre en producción) también despierta la base de pruebas.
    SUPABASE_PRUEBAS_URL: pruebas.url ?? "",
    SUPABASE_PRUEBAS_PUBLISHABLE_KEY: pruebas.clave ?? "",
  },
  images: {
    // Las fotos se piden al tamaño justo a su propio servidor (ver el archivo),
    // sin usar el optimizador de imágenes de Vercel.
    loader: "custom",
    loaderFile: "./lib/cargador-de-imagenes.ts",
    qualities: [75],
  },
};

export default nextConfig;
