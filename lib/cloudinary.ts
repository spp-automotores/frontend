import "server-only";
import { carpetaDeFotos, cuentaDeCloudinary } from "@/lib/fotos-del-auto";

// Hablar con Cloudinary desde el servidor: firmar cada subida y borrar fotos. La clave
// secreta vive sólo acá (nunca va al navegador). Son dos pedidos simples, firmados como
// dice https://cloudinary.com/documentation/authentication_signatures : los datos en
// orden alfabético, unidos con «&», la clave secreta al final y todo pasado por SHA-1
// (el que usa Cloudinary si no se le pide otro).

const claveDeLaApi = () => process.env.CLOUDINARY_API_KEY;
const claveSecreta = () => process.env.CLOUDINARY_API_SECRET;

/** Si están las tres variables de Cloudinary (ver `.env.example`). */
export function hayCloudinary(): boolean {
  return Boolean(cuentaDeCloudinary && claveDeLaApi() && claveSecreta());
}

async function firmar(datos: Record<string, string>): Promise<string> {
  const texto =
    Object.keys(datos)
      .sort()
      .map((nombre) => `${nombre}=${datos[nombre]}`)
      .join("&") + claveSecreta();
  const huella = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(texto));
  return [...new Uint8Array(huella)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

const ahora = () => String(Math.floor(Date.now() / 1000));

/** Lo que necesita el navegador para subir una foto directo a Cloudinary (vale 1 hora). */
export type PermisoDeSubida = {
  url: string;
  campos: Record<string, string>;
};

/** El permiso para subir una foto, con su nombre ya elegido acá (`<carpeta>/<id al azar>`). */
export async function permisoDeSubida(): Promise<PermisoDeSubida> {
  const datos = {
    public_id: `${carpetaDeFotos}/${crypto.randomUUID()}`,
    allowed_formats: "jpg,png,webp",
    timestamp: ahora(),
  };
  return {
    url: `https://api.cloudinary.com/v1_1/${cuentaDeCloudinary}/image/upload`,
    campos: {
      ...datos,
      api_key: claveDeLaApi()!,
      signature: await firmar(datos),
    },
  };
}

/**
 * Borra fotos de Cloudinary (las que se quitaron de un auto), así no se paga por guardar
 * fotos que no se ven. Si una falla, sólo se anota: el auto ya se guardó bien.
 */
export async function borrarFotos(ids: string[]): Promise<void> {
  if (!hayCloudinary()) return;
  await Promise.all(
    ids.map(async (id) => {
      const datos = { public_id: id, invalidate: "true", timestamp: ahora() };
      const formulario = new FormData();
      for (const [nombre, valor] of Object.entries(datos)) formulario.set(nombre, valor);
      formulario.set("api_key", claveDeLaApi()!);
      formulario.set("signature", await firmar(datos));
      try {
        const respuesta = await fetch(`https://api.cloudinary.com/v1_1/${cuentaDeCloudinary}/image/destroy`, {
          method: "POST",
          body: formulario,
        });
        if (!respuesta.ok) console.error("No se pudo borrar la foto", id, respuesta.status, await respuesta.text());
      } catch (error) {
        console.error("No se pudo borrar la foto", id, error);
      }
    }),
  );
}
