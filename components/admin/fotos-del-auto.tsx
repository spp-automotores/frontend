"use client";

import { ArrowLeft, ArrowRight, CircleAlert, ImagePlus, RotateCcw, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { pedirPermisoDeSubida } from "@/app/admin/acciones";
import type { Foto } from "@/lib/autos";
import type { PermisoDeSubida } from "@/lib/cloudinary";
import { type FotoDelFormulario, ladoMayorAlSubir, maximoDeFotos } from "@/lib/fotos-del-auto";
import { cn } from "@/lib/utils";

// Las fotos del formulario del auto. Cada foto nueva se achica en el celular (a ~2.000 px
// de lado, menos de 1 MB) y sube directo a Cloudinary con un permiso firmado por el
// servidor; se ve su avance y, si falla, «Reintentar». El orden se cambia con botones
// (arrastrar con el dedo es frágil en el celular); la primera es la portada. Lo que se
// guarda viaja en el campo oculto `fotos`. Sin JavaScript se ven las que ya tiene y
// quedan como están.

type FotoEnElFormulario =
  | { clave: string; estado: "lista"; src: string; idCloudinary?: string; alt: string; vista?: string }
  | { clave: string; estado: "subiendo"; progreso: number; vista: string; archivo: File }
  | { clave: string; estado: "fallo"; error: string; vista: string; archivo: File };

const sinSuscripcion = () => () => {};
let contador = 0;
const nuevaClave = () => `foto-${++contador}`;

/** La foto, más chica y en JPG. Las fotos del celular vienen giradas: `createImageBitmap` las endereza. */
async function achicar(archivo: File): Promise<Blob> {
  const imagen = await createImageBitmap(archivo);
  const escala = Math.min(1, ladoMayorAlSubir / Math.max(imagen.width, imagen.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(imagen.width * escala);
  lienzo.height = Math.round(imagen.height * escala);
  lienzo.getContext("2d")!.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
  imagen.close();
  return new Promise((listo, fallo) =>
    lienzo.toBlob((foto) => (foto ? listo(foto) : fallo(new Error("toBlob"))), "image/jpeg", 0.85),
  );
}

/** Sube la foto a Cloudinary contando el avance (con `fetch` no se puede ver el avance de una subida). */
function subir(foto: Blob, permiso: PermisoDeSubida, alAvanzar: (progreso: number) => void) {
  return new Promise<{ secure_url: string; public_id: string }>((listo, fallo) => {
    const pedido = new XMLHttpRequest();
    pedido.open("POST", permiso.url);
    pedido.responseType = "json";
    pedido.upload.onprogress = (evento) => {
      if (evento.lengthComputable) alAvanzar(Math.round((evento.loaded / evento.total) * 100));
    };
    pedido.onload = () => (pedido.status === 200 ? listo(pedido.response) : fallo(new Error(String(pedido.status))));
    pedido.onerror = () => fallo(new Error("red"));
    const formulario = new FormData();
    for (const [nombre, valor] of Object.entries(permiso.campos)) formulario.set(nombre, valor);
    formulario.set("file", foto, "foto.jpg");
    pedido.send(formulario);
  });
}

export function FotosDelAuto({
  fotosIniciales,
  alCambiar,
  alSubir,
}: {
  fotosIniciales: Foto[];
  /** Avisa que hay cambios sin guardar. */
  alCambiar: () => void;
  /** Avisa si hay fotos subiendo (mientras tanto, no se puede guardar). */
  alSubir: (subiendo: boolean) => void;
}) {
  const conJavascript = useSyncExternalStore(sinSuscripcion, () => true, () => false);
  const [fotos, setFotos] = useState<FotoEnElFormulario[]>(() =>
    fotosIniciales.map((foto) => ({ ...foto, clave: nuevaClave(), estado: "lista" as const })),
  );
  const [aviso, setAviso] = useState("");
  const vistas = useRef(new Set<string>());

  const subiendo = fotos.some((foto) => foto.estado === "subiendo");
  useEffect(() => alSubir(subiendo), [subiendo, alSubir]);

  // Las vistas previas ocupan memoria del celular: se sueltan al salir.
  useEffect(() => {
    const lista = vistas.current;
    return () => lista.forEach((vista) => URL.revokeObjectURL(vista));
  }, []);

  const cambiar = (clave: string, cambio: Partial<FotoEnElFormulario>) =>
    setFotos((antes) =>
      antes.map((foto) => (foto.clave === clave ? ({ ...foto, ...cambio } as FotoEnElFormulario) : foto)),
    );

  async function subirUna(clave: string, archivo: File, vista: string) {
    cambiar(clave, { estado: "subiendo", progreso: 0, archivo, vista });
    try {
      const respuesta = await pedirPermisoDeSubida();
      if ("error" in respuesta) {
        cambiar(clave, { estado: "fallo", error: respuesta.error });
        return;
      }
      let foto: Blob;
      try {
        foto = await achicar(archivo);
      } catch {
        cambiar(clave, { estado: "fallo", error: "No se pudo abrir. Probá con otra foto." });
        return;
      }
      const subida = await subir(foto, respuesta.permiso, (progreso) => cambiar(clave, { progreso }));
      cambiar(clave, {
        estado: "lista",
        src: subida.secure_url,
        idCloudinary: subida.public_id,
        alt: "",
      });
    } catch {
      cambiar(clave, { estado: "fallo", error: "No se pudo subir. Revisá la conexión." });
    }
  }

  async function agregar(archivos: FileList) {
    const lugar = maximoDeFotos - fotos.length;
    const elegidas = [...archivos].slice(0, Math.max(0, lugar));
    if (archivos.length > elegidas.length) setAviso(`Entran hasta ${maximoDeFotos} fotos por auto.`);
    if (elegidas.length === 0) return;
    alCambiar();
    const nuevas = elegidas.map((archivo) => {
      const vista = URL.createObjectURL(archivo);
      vistas.current.add(vista);
      return { clave: nuevaClave(), estado: "subiendo" as const, progreso: 0, vista, archivo };
    });
    setFotos((antes) => [...antes, ...nuevas]);
    // De a dos por vez: con datos móviles, todas juntas tardan más en terminar la primera.
    const cola = [...nuevas];
    const trabajar = async () => {
      for (let foto = cola.shift(); foto; foto = cola.shift()) await subirUna(foto.clave, foto.archivo, foto.vista);
    };
    await Promise.all([trabajar(), trabajar()]);
  }

  function mover(desde: number, hasta: number, mensaje: string) {
    alCambiar();
    setFotos((antes) => {
      const lista = [...antes];
      const [foto] = lista.splice(desde, 1);
      lista.splice(hasta, 0, foto);
      return lista;
    });
    setAviso(mensaje);
  }

  function quitar(i: number) {
    alCambiar();
    setFotos((antes) => antes.filter((_, j) => j !== i));
    setAviso(`Foto ${i + 1} quitada. Se borra al guardar.`);
  }

  const paraGuardar: FotoDelFormulario[] = fotos.flatMap((foto) =>
    foto.estado === "lista" ? [{ src: foto.src, idCloudinary: foto.idCloudinary }] : [],
  );
  const conFallo = fotos.filter((foto) => foto.estado === "fallo").length;

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="fotos" value={JSON.stringify(paraGuardar)} />

      {fotos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {fotos.map((foto, i) => (
            <li key={foto.clave} className="flex min-w-0 flex-col gap-2">
              <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-muted">
                {foto.estado === "lista" && !foto.vista ? (
                  <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 640px) 200px, 50vw" className="object-cover" />
                ) : (
                  // La vista previa es la foto del celular, todavía sin subir: un `img` común.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={foto.vista}
                    alt=""
                    className={cn("size-full object-cover", foto.estado !== "lista" && "opacity-50")}
                  />
                )}
                {i === 0 && foto.estado === "lista" && (
                  <span className="absolute top-2 left-2 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold">
                    Portada
                  </span>
                )}
                {foto.estado === "subiendo" && (
                  <div className="absolute inset-x-0 bottom-0 bg-background/90 px-2.5 py-2 text-xs font-semibold">
                    <span>Subiendo… {foto.progreso}%</span>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-foreground/15">
                      <div
                        className="h-full origin-left bg-foreground transition-transform duration-200 ease-out"
                        style={{ transform: `scaleX(${foto.progreso / 100})` }}
                      />
                    </div>
                  </div>
                )}
                {foto.estado === "fallo" && (
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-background/95 p-2.5">
                    <p className="flex items-start gap-1.5 text-xs leading-snug text-highlight">
                      <CircleAlert aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                      {foto.error}
                    </p>
                    <button
                      type="button"
                      onClick={() => subirUna(foto.clave, foto.archivo, foto.vista)}
                      className={cn(botonChico, "w-full gap-1.5 text-sm font-semibold")}
                    >
                      <RotateCcw aria-hidden="true" className="size-4" />
                      Reintentar
                    </button>
                  </div>
                )}
              </div>

              {!conJavascript ? null : foto.estado === "lista" ? (
                <>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => mover(i, i - 1, `Foto ${i + 1} movida al lugar ${i}.`)}
                      aria-label={`Mover la foto ${i + 1} a la izquierda`}
                      className={botonChico}
                    >
                      <ArrowLeft aria-hidden="true" className="size-5" />
                    </button>
                    <button
                      type="button"
                      disabled={i === fotos.length - 1}
                      onClick={() => mover(i, i + 1, `Foto ${i + 1} movida al lugar ${i + 2}.`)}
                      aria-label={`Mover la foto ${i + 1} a la derecha`}
                      className={botonChico}
                    >
                      <ArrowRight aria-hidden="true" className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => quitar(i)}
                      aria-label={`Quitar la foto ${i + 1}`}
                      className={cn(botonChico, "text-highlight")}
                    >
                      <Trash2 aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => mover(i, 0, `La foto ${i + 1} ahora es la portada.`)}
                      className={cn(botonChico, "gap-1.5 text-sm font-semibold whitespace-nowrap")}
                    >
                      <Star aria-hidden="true" className="size-4 max-sm:hidden" />
                      Hacer portada
                    </button>
                  )}
                </>
              ) : (
                foto.estado === "fallo" && (
                  <button
                    type="button"
                    onClick={() => quitar(i)}
                    className={cn(botonChico, "gap-1.5 text-sm font-semibold text-highlight")}
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                    Quitar
                  </button>
                )
              )}
            </li>
          ))}
        </ul>
      )}

      {conJavascript ? (
        fotos.length < maximoDeFotos && (
          <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed border-foreground/35 px-4 text-base font-semibold transition-[background-color,border-color,transform] duration-150 ease-out select-none hover:border-foreground/60 hover:bg-foreground/5 active:scale-[0.98] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring">
            <ImagePlus aria-hidden="true" className="size-5" />
            {fotos.length === 0 ? "Agregar fotos" : "Agregar más fotos"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(evento) => {
                if (evento.currentTarget.files) agregar(evento.currentTarget.files);
                evento.currentTarget.value = "";
              }}
            />
          </label>
        )
      ) : (
        <p className="text-sm text-pretty text-muted-foreground">
          Para subir fotos hace falta JavaScript. Al guardar, las fotos quedan como están.
        </p>
      )}

      <p className="text-sm text-pretty text-muted-foreground">
        {fotos.length === 0
          ? "Desde la cámara o la galería, varias a la vez. La primera es la portada."
          : `${fotos.length} de ${maximoDeFotos}. La primera es la portada.`}
      </p>
      {subiendo && (
        <p className="text-sm font-semibold">Esperá que terminen de subir para guardar.</p>
      )}
      {conFallo > 0 && !subiendo && (
        <p className="text-sm text-highlight">
          {conFallo === 1
            ? "Una foto no se subió: reintentala o quitala. Si guardás así, no se guarda."
            : `${conFallo} fotos no se subieron: reintentalas o quitalas. Si guardás así, no se guardan.`}
        </p>
      )}
      <p aria-live="polite" className="sr-only">
        {aviso}
      </p>
    </div>
  );
}

const botonChico =
  "inline-flex h-11 items-center justify-center rounded-lg border border-foreground/25 bg-background transition-[background-color,border-color,transform] duration-150 ease-out hover:border-foreground/50 hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.96] disabled:pointer-events-none disabled:opacity-35";
