// Link de una foto al ancho justo, pedido al servidor donde vive. Hoy las fotos de
// ejemplo vienen de Pexels; cuando lleguen las fotos reales (Cloudinary), se suma
// su caso acá.
export function fotoAMedida(src: string, ancho: number): string {
  const url = new URL(src);
  if (url.hostname === "images.pexels.com") {
    url.searchParams.set("auto", "compress");
    url.searchParams.set("cs", "tinysrgb");
    url.searchParams.set("w", String(ancho));
  }
  return url.toString();
}
