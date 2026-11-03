// Link de una foto al ancho justo, pedido al servidor donde vive: Cloudinary (las fotos
// que se suben desde el panel) o Pexels (las de ejemplo).
export function fotoAMedida(src: string, ancho: number): string {
  const url = new URL(src);
  if (url.hostname === "res.cloudinary.com") {
    // Hasta ese ancho sin agrandarla, en el formato que mejor le venga a cada navegador y
    // con la calidad más alta del ajuste automático (`q_auto:best`). Sin el filtro de
    // «mejorar» (`e_improve`): dejaba las fotos más pálidas y planas que las originales.
    return src.replace("/image/upload/", `/image/upload/c_limit,w_${ancho},f_auto,q_auto:best/`);
  }
  if (url.hostname === "images.pexels.com") {
    url.searchParams.set("auto", "compress");
    url.searchParams.set("cs", "tinysrgb");
    url.searchParams.set("w", String(ancho));
  }
  return url.toString();
}
