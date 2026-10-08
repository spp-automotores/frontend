"use client";

// Pide cada foto del tamaño justo al servidor donde vive, en lugar de pasarla por
// el optimizador de imágenes de Vercel. Hoy las fotos de ejemplo vienen de Pexels;
// cuando lleguen las fotos reales (Cloudinary), se suma su caso acá.
export default function cargadorDeImagenes({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  const url = new URL(src);
  if (url.hostname === "images.pexels.com") {
    url.searchParams.set("auto", "compress");
    url.searchParams.set("cs", "tinysrgb");
    url.searchParams.set("w", String(width));
  }
  return url.toString();
}
