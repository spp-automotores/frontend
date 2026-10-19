"use client";

import { CircleAlert, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useActionState, useState, useSyncExternalStore } from "react";
import { entrar, type EstadoEntrar } from "@/app/admin/acciones";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sinSuscripcion = () => () => {};

// El formulario para entrar a la administración. Anda también sin JavaScript: se
// manda igual y el error vuelve en la página.
export function FormularioEntrar({ aviso }: { aviso: string | null }) {
  const [estado, accion, enviando] = useActionState<EstadoEntrar, FormData>(entrar, {
    error: aviso,
    email: "",
  });
  const [verContrasena, setVerContrasena] = useState(false);
  // El ojito sólo aparece con JavaScript andando: sin él, no haría nada.
  const conJavascript = useSyncExternalStore(sinSuscripcion, () => true, () => false);

  return (
    <form
      action={accion}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.6)] sm:p-6"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          defaultValue={estado.email}
          aria-describedby={estado.error ? "error-entrar" : undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contrasena">Contraseña</Label>
        <div className="relative">
          <Input
            id="contrasena"
            name="contrasena"
            type={verContrasena ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-describedby={estado.error ? "error-entrar" : undefined}
            className="pr-13"
          />
          {conJavascript && (
            <button
              type="button"
              onClick={() => setVerContrasena((ver) => !ver)}
              aria-label={verContrasena ? "Ocultar la contraseña" : "Mostrar la contraseña"}
              aria-controls="contrasena"
              className="absolute inset-y-0.5 right-0.5 grid w-11 place-items-center rounded-[10px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              {verContrasena ? (
                <EyeOff aria-hidden="true" className="size-5" />
              ) : (
                <Eye aria-hidden="true" className="size-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Siempre en la página, aunque esté vacío: así el lector de pantalla anuncia el error al
          aparecer. Vacío, devuelve el espacio entre campos que no usa. */}
      <div id="error-entrar" role="alert" className="empty:-mt-5">
        {estado.error && (
          <p className="flex items-start gap-2.5 rounded-xl border border-highlight/40 bg-highlight/10 px-3.5 py-3 text-sm leading-snug">
            <CircleAlert aria-hidden="true" className="mt-px size-4 shrink-0 text-highlight" />
            {estado.error}
          </p>
        )}
      </div>

      <Button type="submit" disabled={enviando} className="w-full text-base">
        {enviando ? (
          <>
            <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" />
            Ingresando…
          </>
        ) : (
          "Ingresar"
        )}
      </Button>
    </form>
  );
}
