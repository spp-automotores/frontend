"use client";

import { fotoAMedida } from "@/lib/foto-a-medida";

// Pide cada foto del tamaño justo al servidor donde vive, en lugar de pasarla por
// el optimizador de imágenes de Vercel (ver `lib/foto-a-medida.ts`).
export default function cargadorDeImagenes({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  return fotoAMedida(src, width);
}
