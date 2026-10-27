// Link de una foto al ancho justo, pedido al servidor donde vive: Cloudinary (las fotos
// que se suben desde el panel) o Pexels (las de ejemplo).
export function fotoAMedida(src: string, ancho: number): string {
  const url = new URL(src);
  if (url.hostname === "res.cloudinary.com") {
    // Hasta ese ancho sin agrandarla, en el formato y la calidad que mejor le vengan a
    // cada navegador, y con el ajuste automático de luz, color y contraste.
    return src.replace("/image/upload/", `/image/upload/c_limit,w_${ancho},f_auto,q_auto,e_improve/`);
  }
  if (url.hostname === "images.pexels.com") {
    url.searchParams.set("auto", "compress");
    url.searchParams.set("cs", "tinysrgb");
    url.searchParams.set("w", String(ancho));
  }
  return url.toString();
}
