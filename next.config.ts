import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las fotos se piden al tamaño justo a su propio servidor (ver el archivo),
    // sin usar el optimizador de imágenes de Vercel.
    loader: "custom",
    loaderFile: "./lib/cargador-de-imagenes.ts",
    qualities: [75],
  },
};

export default nextConfig;
