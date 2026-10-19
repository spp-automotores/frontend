"use client";

import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import {
  type CampoDeLaContrasena,
  cambiarContrasena,
  type EstadoContrasena,
} from "@/app/admin/acciones";
import { CampoDeContrasena } from "@/components/admin/campo-de-contrasena";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { largoMinimoDeContrasena } from "@/lib/contrasena";

const campos: { id: CampoDeLaContrasena; etiqueta: string; ayuda?: string }[] = [
  { id: "actual", etiqueta: "Contraseña actual" },
  { id: "nueva", etiqueta: "Contraseña nueva", ayuda: `Al menos ${largoMinimoDeContrasena} caracteres.` },
  { id: "repetir", etiqueta: "Repetí la nueva" },
];

// Cambiar la contraseña de la cuenta con la que se entró. Anda también sin JavaScript.
// Después de cada envío los campos quedan vacíos: una contraseña no se vuelve a mostrar.
export function FormularioContrasena({ email }: { email: string | null }) {
  const [estado, accion, enviando] = useActionState<EstadoContrasena, FormData>(cambiarContrasena, {
    listo: false,
    error: null,
    campo: null,
  });
  const error = estado.listo ? null : estado.error;
  const campoConError = estado.listo ? null : estado.campo;

  return (
    <form
      action={accion}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.6)] sm:p-6"
    >
      {/* Para el gestor de contraseñas del celular: así sabe de qué cuenta es la nueva. */}
      {email && (
        <input type="email" name="email" autoComplete="username" value={email} readOnly hidden />
      )}

      {campos.map(({ id, etiqueta, ayuda }) => {
        const descripcion = [ayuda && `ayuda-${id}`, campoConError === id && "aviso-contrasena"]
          .filter(Boolean)
          .join(" ");
        return (
          <div key={id} className="flex flex-col gap-2">
            <Label htmlFor={id}>{etiqueta}</Label>
            <CampoDeContrasena
              id={id}
              name={id}
              autoComplete={id === "actual" ? "current-password" : "new-password"}
              required
              minLength={id === "actual" ? undefined : largoMinimoDeContrasena}
              aria-invalid={campoConError === id || undefined}
              aria-describedby={descripcion || undefined}
            />
            {ayuda && (
              <p id={`ayuda-${id}`} className="text-sm text-muted-foreground">
                {ayuda}
              </p>
            )}
          </div>
        );
      })}

      {/* Siempre en la página, aunque esté vacío: así el lector de pantalla anuncia el aviso al
          aparecer. Vacío, devuelve el espacio entre campos que no usa. */}
      <div id="aviso-contrasena" role="alert" className="empty:-mt-5">
        {error && (
          <p className="flex items-start gap-2.5 rounded-xl border border-highlight/40 bg-highlight/10 px-3.5 py-3 text-sm leading-snug">
            <CircleAlert aria-hidden="true" className="mt-px size-4 shrink-0 text-highlight" />
            {error}
          </p>
        )}
        {estado.listo && (
          <p className="flex items-start gap-2.5 rounded-xl border border-disponible/40 bg-disponible/10 px-3.5 py-3 text-sm leading-snug">
            <CircleCheck aria-hidden="true" className="mt-px size-4 shrink-0 text-disponible" />
            Listo, tu contraseña cambió. La próxima vez que entres, usá la nueva.
          </p>
        )}
      </div>

      <Button type="submit" disabled={enviando} className="w-full text-base">
        {enviando ? (
          <>
            <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" />
            Cambiando…
          </>
        ) : (
          "Cambiar la contraseña"
        )}
      </Button>
    </form>
  );
}
