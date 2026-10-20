"use client";

import { CircleAlert, ImagePlus, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { type ComponentProps, type ReactNode, useActionState, useEffect, useRef, useState } from "react";
import type { EstadoDelFormularioDelAuto } from "@/app/admin/acciones";
import { puntoDeEstado } from "@/components/estado-del-auto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Foto, cajas, combustibles, estados, tipos } from "@/lib/autos";
import {
  type CampoDelAuto,
  type ValoresDelAuto,
  largoMaximo,
} from "@/lib/formulario-del-auto";
import { cn } from "@/lib/utils";

type AccionDelAuto = (
  anterior: EstadoDelFormularioDelAuto,
  formulario: FormData,
) => Promise<EstadoDelFormularioDelAuto>;

/** Cómo se nombra cada campo en la caja de errores de arriba. */
const etiquetas: Record<CampoDelAuto, string> = {
  marca: "Marca",
  modelo: "Modelo",
  version: "Versión",
  anio: "Año",
  km: "Km",
  precio: "Precio",
  estado: "Estado",
  combustible: "Combustible",
  caja: "Caja",
  tipo: "Tipo",
  color: "Color",
  motor: "Motor",
  puertas: "Puertas",
  unicoDueno: "Único dueño",
  serviceAlDia: "Service al día",
  mantenimientos: "Mantenimientos",
  descripcion: "Descripción",
};

const lista = (opciones: readonly string[]) => opciones.map((opcion) => ({ valor: opcion, texto: opcion }));
const siNoNoSe = [
  { valor: "si", texto: "Sí" },
  { valor: "no", texto: "No" },
  { valor: "", texto: "No sé" },
];

/**
 * El formulario de «Cargar un auto» y de «Editar», pensado para el celular en la agencia:
 * primero las fotos, después lo principal, la ficha, la historia y la descripción.
 * Anda también sin JavaScript. Si hay errores, vuelve lo escrito con el error al lado
 * de cada campo y una caja arriba con todos.
 */
export function FormularioDelAuto({
  accion,
  valoresIniciales,
  fotos,
}: {
  accion: AccionDelAuto;
  valoresIniciales: ValoresDelAuto;
  /** Las que ya tiene el auto (las de ejemplo, por ahora): se muestran, todavía no se cambian. */
  fotos: Foto[];
}) {
  const [estado, enviar, enviando] = useActionState(accion, {
    errores: {},
    error: null,
    valores: valoresIniciales,
  });
  const { errores, valores } = estado;
  const camposConError = Object.keys(errores) as CampoDelAuto[];
  const aviso = useRef<HTMLDivElement>(null);
  const [conCambios, setConCambios] = useState(false);

  // Al volver con errores, la caja de arriba toma el foco: el lector de pantalla la lee y
  // en el celular la pantalla sube hasta ella.
  useEffect(() => {
    if (Object.keys(estado.errores).length > 0 || estado.error) aviso.current?.focus();
  }, [estado]);

  // Con cambios sin guardar, el navegador avisa antes de cerrar o salir de la página.
  useEffect(() => {
    if (!conCambios) return;
    const avisar = (evento: BeforeUnloadEvent) => evento.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [conCambios]);

  const campo = (nombre: CampoDelAuto) => ({ campo: nombre, valor: valores[nombre] ?? "", error: errores[nombre] });

  return (
    <form action={enviar} noValidate onInput={() => setConCambios(true)} className="flex flex-col gap-4">
      <div ref={aviso} tabIndex={-1} role="alert" className="scroll-mt-24 outline-none empty:hidden">
        {camposConError.length > 0 && (
          <div className="rounded-xl border border-highlight/40 bg-highlight/10 px-4 py-3.5">
            <p className="flex items-center gap-2 font-semibold">
              <CircleAlert aria-hidden="true" className="size-4 shrink-0 text-highlight" />
              {camposConError.length === 1
                ? "Hay 1 dato para revisar:"
                : `Hay ${camposConError.length} datos para revisar:`}
            </p>
            <ul className="mt-2 flex flex-col gap-1 pl-6 text-sm">
              {camposConError.map((nombre) => (
                <li key={nombre}>
                  <a href={`#${nombre}`} className="font-semibold underline underline-offset-4">
                    {etiquetas[nombre]}
                  </a>
                  : {errores[nombre]}
                </li>
              ))}
            </ul>
          </div>
        )}
        {estado.error && (
          <p className="flex items-start gap-2.5 rounded-xl border border-highlight/40 bg-highlight/10 px-4 py-3.5 text-sm leading-snug">
            <CircleAlert aria-hidden="true" className="mt-px size-4 shrink-0 text-highlight" />
            {estado.error}
          </p>
        )}
      </div>

      <Seccion titulo="Fotos">
        <FotosDelAuto fotos={fotos} />
      </Seccion>

      <Seccion titulo="Lo principal">
        <div className="grid gap-5 sm:grid-cols-2">
          <CampoDeTexto {...campo("marca")} etiqueta="Marca" maxLength={largoMaximo.marca} placeholder="Ej.: Toyota" />
          <CampoDeTexto {...campo("modelo")} etiqueta="Modelo" maxLength={largoMaximo.modelo} placeholder="Ej.: Hilux" />
        </div>
        <CampoDeTexto
          {...campo("version")}
          etiqueta="Versión"
          opcional
          maxLength={largoMaximo.version}
          placeholder="Ej.: SRX 4x4"
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          <CampoDeTexto {...campo("anio")} etiqueta="Año" inputMode="numeric" maxLength={4} placeholder="Ej.: 2021" />
          <CampoDeTexto
            {...campo("km")}
            etiqueta="Km"
            inputMode="numeric"
            maxLength={12}
            placeholder="Ej.: 85.000"
            ayuda="0 si es 0 km."
          />
        </div>
        <CampoDeTexto
          {...campo("precio")}
          etiqueta="Precio en pesos"
          opcional
          inputMode="numeric"
          maxLength={22}
          placeholder="Ej.: 25.000.000"
          ayuda="Vacío: en el sitio dice «Consultar»."
        />
        <Opciones
          {...campo("estado")}
          etiqueta="Estado"
          opciones={estados.map((opcion) => ({
            valor: opcion,
            texto: (
              <>
                <span aria-hidden="true" className={cn("size-2 rounded-full", puntoDeEstado[opcion])} />
                {opcion}
              </>
            ),
          }))}
        />
      </Seccion>

      <Seccion titulo="Ficha">
        <Opciones {...campo("combustible")} etiqueta="Combustible" opciones={lista(combustibles)} />
        <Opciones {...campo("caja")} etiqueta="Caja" opciones={lista(cajas)} />
        <Opciones
          {...campo("tipo")}
          etiqueta="Tipo"
          opciones={[...lista(tipos), { valor: "", texto: "Sin decir" }]}
        />
        <Opciones
          {...campo("puertas")}
          etiqueta="Puertas"
          opciones={[...lista(["2", "3", "4", "5"]), { valor: "", texto: "Sin decir" }]}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <CampoDeTexto {...campo("color")} etiqueta="Color" opcional maxLength={largoMaximo.color} placeholder="Ej.: Blanco" />
          <CampoDeTexto {...campo("motor")} etiqueta="Motor" opcional maxLength={largoMaximo.motor} placeholder="Ej.: 2.8 TDI" />
        </div>
      </Seccion>

      <Seccion titulo="Historia">
        <Opciones {...campo("unicoDueno")} etiqueta="Único dueño" opciones={siNoNoSe} />
        <Opciones {...campo("serviceAlDia")} etiqueta="Service al día" opciones={siNoNoSe} />
        <CampoDeTexto
          {...campo("mantenimientos")}
          etiqueta="Mantenimientos"
          opcional
          area
          maxLength={largoMaximo.mantenimientos}
          placeholder="Por ejemplo: services oficiales cada 10.000 km."
        />
      </Seccion>

      <Seccion titulo="Descripción">
        <CampoDeTexto
          {...campo("descripcion")}
          etiqueta="Sobre este auto"
          opcional
          area
          rows={5}
          maxLength={largoMaximo.descripcion}
          ayuda="Con tus palabras. Se muestra en la página del auto."
        />
      </Seccion>

      {/* En el celular, el botón queda fijo abajo: se guarda sin bajar hasta el final. */}
      <div className="sticky bottom-0 z-30 -mx-4 mt-2 border-t border-border bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <Button type="submit" disabled={enviando} className="w-full text-base sm:w-auto sm:min-w-64">
          {enviando ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" />
              Guardando…
            </>
          ) : (
            "Guardar el auto"
          )}
        </Button>
      </div>
    </form>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h3 className="text-lg leading-tight font-bold tracking-tight">{titulo}</h3>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

/** Hasta que llegue la subida de fotos, se ven las que ya tiene el auto, sin poder cambiarlas. */
function FotosDelAuto({ fotos }: { fotos: Foto[] }) {
  if (fotos.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-dashed border-foreground/20 px-4 py-4">
        <ImagePlus aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div className="text-sm">
          <p className="font-semibold">Subir fotos llega en el próximo paso.</p>
          <p className="mt-1 text-pretty text-muted-foreground">
            Mientras tanto, el auto se guarda y sale en el sitio sin foto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {fotos.map((foto, i) => (
          <li key={foto.src} className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image src={foto.src} alt={foto.alt} fill sizes="80px" className="object-cover" />
            {i === 0 && (
              <span className="absolute inset-x-0 bottom-0 bg-background/85 py-0.5 text-center text-[11px] font-semibold">
                Portada
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-pretty text-muted-foreground">
        Cambiar las fotos llega en el próximo paso. Al guardar, quedan como están.
      </p>
    </div>
  );
}

type PropsDelCampo = { campo: CampoDelAuto; valor: string; error: string | undefined; etiqueta: string };

function Ayuda({ campo, ayuda, error }: { campo: CampoDelAuto; ayuda?: string; error?: string }) {
  return (
    <>
      {ayuda && (
        <p id={`ayuda-${campo}`} className="text-sm text-muted-foreground">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={`error-${campo}`} className="flex items-start gap-1.5 text-sm leading-snug text-highlight">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </>
  );
}

const descritoPor = (campo: CampoDelAuto, ayuda?: string, error?: string) =>
  [ayuda && `ayuda-${campo}`, error && `error-${campo}`].filter(Boolean).join(" ") || undefined;

function CampoDeTexto({
  campo,
  valor,
  error,
  etiqueta,
  opcional,
  ayuda,
  area,
  ...resto
}: PropsDelCampo & {
  opcional?: boolean;
  ayuda?: string;
  area?: boolean;
} & Pick<ComponentProps<"input">, "inputMode" | "maxLength" | "placeholder"> & { rows?: number }) {
  const comunes = {
    id: campo,
    name: campo,
    defaultValue: valor,
    autoComplete: "off",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": descritoPor(campo, ayuda, error),
    maxLength: resto.maxLength,
    placeholder: resto.placeholder,
  };

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={campo}>
        {etiqueta}
        {opcional && <span className="font-normal text-muted-foreground">(opcional)</span>}
      </Label>
      {area ? (
        <Textarea {...comunes} rows={resto.rows ?? 3} />
      ) : (
        <Input {...comunes} type="text" inputMode={resto.inputMode} />
      )}
      <Ayuda campo={campo} ayuda={ayuda} error={error} />
    </div>
  );
}

/**
 * Elegir con botones, no con una lista desplegable: con 2 a 5 opciones es un toque en vez
 * de tres. Por dentro son botones de radio comunes (andan con el teclado y sin JavaScript).
 */
function Opciones({
  campo,
  valor,
  error,
  etiqueta,
  opciones,
  ayuda,
}: PropsDelCampo & { opciones: { valor: string; texto: ReactNode }[]; ayuda?: string }) {
  return (
    <fieldset id={campo} aria-describedby={descritoPor(campo, ayuda, error)} className="min-w-0 scroll-mt-24">
      <legend className="text-sm leading-none font-semibold">{etiqueta}</legend>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {opciones.map((opcion) => (
          <label
            key={opcion.valor}
            className={cn(
              "inline-flex h-12 min-w-12 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 text-base font-medium transition-[background-color,border-color,color,transform] duration-150 ease-out select-none hover:border-foreground/45 active:scale-[0.97] has-checked:border-foreground has-checked:bg-foreground has-checked:text-background has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
              error ? "border-highlight" : "border-foreground/30",
            )}
          >
            <input
              type="radio"
              name={campo}
              value={opcion.valor}
              defaultChecked={valor === opcion.valor}
              className="sr-only"
            />
            {opcion.texto}
          </label>
        ))}
      </div>
      <div className="mt-2 flex flex-col gap-2 empty:hidden">
        <Ayuda campo={campo} ayuda={ayuda} error={error} />
      </div>
    </fieldset>
  );
}
