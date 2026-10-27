import type { Foto } from "@/lib/autos";

// Las fotos de un auto, tal como viajan entre el formulario del panel y el servidor.
// El formulario manda la lista en un campo oculto (`fotos`, en JSON): el orden es el
// de la lista y la primera es la portada. El servidor no confía en lo que llega: sólo
// acepta fotos de nuestra cuenta de Cloudinary o fotos que el auto ya tenía.

/** El nombre de la cuenta de Cloudinary (no es secreto: va en cada link de foto). */
export const cuentaDeCloudinary = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? null;

/** La carpeta de Cloudinary donde van todas las fotos de los autos. */
export const carpetaDeFotos = "autos";

/** Cuántas fotos puede tener un auto. */
export const maximoDeFotos = 30;

/** Las fotos se achican en el celular antes de subir, a este lado mayor (en píxeles). */
export const ladoMayorAlSubir = 2000;

/** Lo que manda el formulario por cada foto. */
export type FotoDelFormulario = { src: string; idCloudinary?: string };

const inicioDeLink = (cuenta: string) => `https://res.cloudinary.com/${cuenta}/image/upload/`;

/** Si el link es de una foto subida a nuestra cuenta, en la carpeta de los autos. */
export function esFotoNuestra(foto: FotoDelFormulario): foto is Required<FotoDelFormulario> {
  if (!cuentaDeCloudinary || !foto.idCloudinary) return false;
  if (!new RegExp(`^${carpetaDeFotos}/[\\w-]{1,100}$`).test(foto.idCloudinary)) return false;
  const resto = foto.src.slice(inicioDeLink(cuentaDeCloudinary).length);
  return (
    foto.src.startsWith(inicioDeLink(cuentaDeCloudinary)) &&
    new RegExp(`^v\\d+/${foto.idCloudinary}\\.(jpg|png|webp)$`).test(resto)
  );
}

export type LecturaDeFotos = { ok: true; fotos: Foto[] } | { ok: false; error: string };

/**
 * Lee la lista que mandó el formulario. Sin el campo (por ejemplo, sin JavaScript y con un
 * formulario viejo), quedan las que ya tenía. El texto alternativo lo arma el sitio:
 * «Toyota Hilux 2021, foto 3 de 12».
 */
export function leerFotos(texto: FormDataEntryValue | null, anteriores: Foto[], nombre: string): LecturaDeFotos {
  if (typeof texto !== "string") return { ok: true, fotos: anteriores };

  let lista: unknown;
  try {
    lista = JSON.parse(texto);
  } catch {
    lista = null;
  }
  if (!Array.isArray(lista)) return { ok: false, error: "No se pudieron leer las fotos. Recargá la página." };
  if (lista.length > maximoDeFotos) return { ok: false, error: `Hasta ${maximoDeFotos} fotos por auto.` };

  const fotos: Foto[] = [];
  for (const elemento of lista) {
    const foto = elemento as FotoDelFormulario;
    if (typeof foto?.src !== "string") return { ok: false, error: "No se pudieron leer las fotos. Recargá la página." };
    const yaEstaba = anteriores.find((anterior) => anterior.src === foto.src);
    if (yaEstaba) fotos.push(yaEstaba);
    else if (esFotoNuestra(foto)) fotos.push({ src: foto.src, alt: "", idCloudinary: foto.idCloudinary });
    else return { ok: false, error: "Una de las fotos no se subió bien. Quitala y subila de nuevo." };
  }
  if (new Set(fotos.map((foto) => foto.src)).size !== fotos.length) {
    return { ok: false, error: "Hay una foto repetida. Quitala y guardá de nuevo." };
  }

  return {
    ok: true,
    fotos: fotos.map((foto, i) =>
      foto.idCloudinary ? { ...foto, alt: `${nombre}, foto ${i + 1} de ${fotos.length}` } : foto,
    ),
  };
}

/** Las fotos nuestras que estaban y ya no están: al guardar, se borran de Cloudinary. */
export function fotosQuitadas(anteriores: Foto[], nuevas: Foto[]): string[] {
  const quedan = new Set(nuevas.map((foto) => foto.idCloudinary));
  return anteriores.flatMap((foto) => (foto.idCloudinary && !quedan.has(foto.idCloudinary) ? [foto.idCloudinary] : []));
}
