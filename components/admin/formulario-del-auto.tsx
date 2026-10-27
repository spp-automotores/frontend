"use client";

import { ChevronDown, ChevronRight, ChevronUp, CircleAlert, Info, LoaderCircle } from "lucide-react";
import {
  type ComponentProps,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
  type RefObject,
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { EstadoDelFormularioDelAuto } from "@/app/admin/acciones";
import { FotosDelAuto } from "@/components/admin/fotos-del-auto";
import { puntoDeEstado } from "@/components/estado-del-auto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Foto, cajas, combustibles, estados, tipos } from "@/lib/autos";
import {
  type CampoDelAuto,
  type ValoresDelAuto,
  camposObligatorios,
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
  tiktok: "Video de TikTok",
};

const sinSuscripcion = () => () => {};

/**
 * Lleva la pantalla a un campo y lo deja listo para escribir (en un grupo de opciones, la
 * elegida o la primera). Con el campo al medio de la pantalla, no queda debajo de la barra.
 */
function irAlCampo(campo: CampoDelAuto) {
  const lugar = document.querySelector<HTMLElement>(`[data-campo="${campo}"]`);
  if (!lugar) return;
  const control =
    lugar.querySelector<HTMLElement>("input:checked") ?? lugar.querySelector<HTMLElement>("input, textarea");
  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  lugar.scrollIntoView({ block: "center", behavior: menosMovimiento ? "auto" : "smooth" });
  control?.focus({ preventScroll: true });
}

/** Los campos del formulario, en el orden en que aparecen. */
const camposEnOrden = () =>
  [...document.querySelectorAll<HTMLElement>("[data-campo]")].map(
    (lugar) => lugar.dataset.campo as CampoDelAuto,
  );

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
  /** Las que ya tiene el auto. */
  fotos: Foto[];
}) {
  const [estado, enviar, enviando] = useActionState(accion, {
    errores: {},
    error: null,
    valores: valoresIniciales,
  });
  const { errores, valores } = estado;
  // En el orden del formulario, no en el de la revisión.
  const camposConError = (Object.keys(etiquetas) as CampoDelAuto[]).filter((nombre) => errores[nombre]);
  const aviso = useRef<HTMLDivElement>(null);
  const ultimoCampo = useRef<CampoDelAuto | null>(null);
  const [conCambios, setConCambios] = useState(false);
  const [fotosSubiendo, setFotosSubiendo] = useState(false);

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
    <form
      action={enviar}
      noValidate
      onInput={() => setConCambios(true)}
      onFocus={(evento) => {
        const lugar = (evento.target as HTMLElement).closest<HTMLElement>("[data-campo]");
        if (lugar) ultimoCampo.current = lugar.dataset.campo as CampoDelAuto;
      }}
      className="flex flex-col gap-4"
    >
      <FlechasDelFormulario conError={camposConError} ultimoCampo={ultimoCampo} />

      <p className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", lugarDeLasFlechas)}>
        <MarcaDeObligatorio />
        Los campos con este círculo son obligatorios.
      </p>

      <div
        ref={aviso}
        tabIndex={-1}
        role="alert"
        className={cn("scroll-mt-24 outline-none empty:hidden", lugarDeLasFlechas)}
      >
        {camposConError.length > 0 && (
          <div className="rounded-xl border border-highlight/40 bg-highlight/10 px-4 py-3.5">
            <p className="flex items-center gap-2 font-semibold">
              <CircleAlert aria-hidden="true" className="size-4 shrink-0 text-highlight" />
              {camposConError.length === 1
                ? "Hay 1 dato para revisar. Tocalo para ir:"
                : `Hay ${camposConError.length} datos para revisar. Tocá cada uno para ir:`}
            </p>
            {/* Sin JavaScript son links comunes al campo; con JavaScript, además lo dejan listo para escribir. */}
            <ul className="mt-3 flex flex-wrap gap-2">
              {camposConError.map((nombre) => (
                <li key={nombre}>
                  <a
                    href={`#${nombre}`}
                    onClick={(evento) => {
                      evento.preventDefault();
                      irAlCampo(nombre);
                    }}
                    className="inline-flex h-11 items-center gap-1 rounded-full border border-highlight/60 bg-background pr-2.5 pl-4 text-sm font-semibold transition-[background-color,transform] duration-150 ease-out hover:bg-highlight/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.97]"
                  >
                    {etiquetas[nombre]}
                    <ChevronRight aria-hidden="true" className="size-4 text-highlight" />
                  </a>
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
        <FotosDelAuto fotosIniciales={fotos} alCambiar={() => setConCambios(true)} alSubir={setFotosSubiendo} />
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
            miles
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
          miles
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

      <Seccion titulo="Video de TikTok">
        <CampoDeTexto
          {...campo("tiktok")}
          etiqueta="Link del video"
          opcional
          inputMode="url"
          maxLength={largoMaximo.tiktok}
          placeholder="Ej.: https://vm.tiktok.com/…"
          ayuda="En TikTok: «Compartir» → «Copiar enlace», y pegalo acá. En la página del auto aparece un botón al video."
        />
      </Seccion>

      {/* En el celular, el botón queda fijo abajo: se guarda sin bajar hasta el final. */}
      <div className="sticky bottom-0 z-30 -mx-4 mt-2 border-t border-border bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <Button type="submit" disabled={enviando || fotosSubiendo} className="w-full text-base sm:w-auto sm:min-w-64">
          {enviando ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" />
              Guardando…
            </>
          ) : fotosSubiendo ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" />
              Subiendo fotos…
            </>
          ) : (
            "Guardar el auto"
          )}
        </Button>
      </div>
    </form>
  );
}

/**
 * Lugar libre a la derecha para las flechas, en pantallas donde no hay margen al costado
 * del formulario (en una computadora grande quedan afuera, en el margen).
 */
const lugarDeLasFlechas = "max-lg:mr-14";

/**
 * Las dos flechas rojas, fijas a la derecha y al medio de la pantalla: van de campo en campo
 * sin deslizar, como la tecla Tab. Si hay errores, sólo por los campos con error; si no,
 * por todos. Sólo con JavaScript (sin él no harían nada).
 */
function FlechasDelFormulario({
  conError,
  ultimoCampo,
}: {
  conError: CampoDelAuto[];
  ultimoCampo: RefObject<CampoDelAuto | null>;
}) {
  const conJavascript = useSyncExternalStore(sinSuscripcion, () => true, () => false);
  if (!conJavascript) return null;

  const deErrores = conError.length > 0;
  const mover = (paso: 1 | -1) => {
    const todos = camposEnOrden();
    const destinos = deErrores ? todos.filter((nombre) => conError.includes(nombre)) : todos;
    if (destinos.length === 0) return;
    const posicion = ultimoCampo.current ? todos.indexOf(ultimoCampo.current) : -1;
    const lugares = destinos.map((nombre) => todos.indexOf(nombre));
    const siguiente =
      paso === 1
        ? (lugares.find((lugar) => lugar > posicion) ?? lugares[0])
        : (lugares.findLast((lugar) => lugar < posicion) ?? lugares[lugares.length - 1]);
    irAlCampo(todos[siguiente]);
  };

  const boton =
    "grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_-6px_rgb(0_0_0/0.7)] transition-[background-color,transform] duration-150 ease-out hover:bg-primary/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.94]";

  return (
    <div className="fixed top-1/2 right-1.5 z-40 flex -translate-y-1/2 flex-col gap-3 sm:right-3 lg:right-6">
      {/* `preventDefault` al apoyar el dedo: así el botón no se queda con el foco y el teclado del
          celular no se cierra y se vuelve a abrir entre campo y campo. */}
      <button
        type="button"
        onPointerDown={(evento) => evento.preventDefault()}
        onClick={() => mover(-1)}
        aria-label={deErrores ? "Ir al error anterior" : "Ir al campo anterior"}
        className={boton}
      >
        <ChevronUp aria-hidden="true" className="size-7" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        onPointerDown={(evento) => evento.preventDefault()}
        onClick={() => mover(1)}
        aria-label={deErrores ? "Ir al error siguiente" : "Ir al campo siguiente"}
        className={boton}
      >
        <ChevronDown aria-hidden="true" className="size-7" strokeWidth={2.5} />
      </button>
    </div>
  );
}

/** El círculo rojo con la «i» de los campos obligatorios. */
function MarcaDeObligatorio() {
  return <Info aria-hidden="true" className="size-4 shrink-0 text-highlight" strokeWidth={2.25} />;
}

function Etiqueta({ campo, children }: { campo: CampoDelAuto; children: ReactNode }) {
  if (!camposObligatorios.includes(campo)) return children;
  return (
    <>
      {children}
      <MarcaDeObligatorio />
      <span className="sr-only">(obligatorio)</span>
    </>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 sm:p-6", lugarDeLasFlechas)}>
      <h3 className="text-lg leading-tight font-bold tracking-tight">{titulo}</h3>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
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

const soloNumeros = (texto: string) => texto.replace(/\D/g, "");

/** 25000000 → 25.000.000 (sin ceros adelante). */
const conPuntosDeMiles = (texto: string) =>
  soloNumeros(texto)
    .replace(/^0+(?=\d)/, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/**
 * Pone los puntos de miles mientras se escribe, para no marearse con los ceros. El cursor
 * queda entre los mismos números, y borrar un punto borra el número de al lado. Sin
 * JavaScript no hace nada: el servidor acepta el número con o sin puntos.
 */
function usePuntosDeMiles() {
  const anterior = useRef("");
  return {
    onFocus: (evento: FocusEvent<HTMLInputElement>) => {
      anterior.current = evento.currentTarget.value;
    },
    onInput: (evento: FormEvent<HTMLInputElement>) => {
      const input = evento.currentTarget;
      let texto = input.value;
      let cursor = input.selectionStart ?? texto.length;
      const tipo = (evento.nativeEvent as InputEvent).inputType;
      if (texto !== anterior.current && soloNumeros(texto) === soloNumeros(anterior.current)) {
        if (tipo === "deleteContentBackward" && cursor > 0) {
          texto = texto.slice(0, cursor - 1) + texto.slice(cursor);
          cursor -= 1;
        } else if (tipo === "deleteContentForward") {
          texto = texto.slice(0, cursor) + texto.slice(cursor + 1);
        }
      }
      const numerosAntes = soloNumeros(texto.slice(0, cursor)).length;
      const nuevo = conPuntosDeMiles(texto);
      input.value = nuevo;
      let lugar = 0;
      for (let vistos = 0; lugar < nuevo.length && vistos < numerosAntes; lugar++) {
        if (nuevo[lugar] !== ".") vistos++;
      }
      input.setSelectionRange(lugar, lugar);
      anterior.current = nuevo;
    },
  };
}

function CampoDeTexto({
  campo,
  valor,
  error,
  etiqueta,
  opcional,
  ayuda,
  area,
  miles,
  ...resto
}: PropsDelCampo & {
  opcional?: boolean;
  ayuda?: string;
  area?: boolean;
  /** Números grandes (km, precio): con puntos de miles mientras se escribe. */
  miles?: boolean;
} & Pick<ComponentProps<"input">, "inputMode" | "maxLength" | "placeholder"> & { rows?: number }) {
  const puntosDeMiles = usePuntosDeMiles();
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
    <div data-campo={campo} className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={campo}>
        <Etiqueta campo={campo}>{etiqueta}</Etiqueta>
        {opcional && <span className="font-normal text-muted-foreground">(opcional)</span>}
      </Label>
      {area ? (
        <Textarea {...comunes} rows={resto.rows ?? 3} />
      ) : (
        <Input {...comunes} {...(miles ? puntosDeMiles : {})} type="text" inputMode={resto.inputMode} />
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
    <fieldset
      id={campo}
      data-campo={campo}
      aria-describedby={descritoPor(campo, ayuda, error)}
      className="min-w-0 scroll-mt-24"
    >
      <legend className="flex items-center gap-2 text-sm leading-none font-semibold">
        <Etiqueta campo={campo}>{etiqueta}</Etiqueta>
      </legend>
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
