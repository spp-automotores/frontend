"use client";

import { useActionState } from "react";
import { entrar, type EstadoEntrar } from "@/app/admin/acciones";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// El formulario para entrar al panel. Anda también sin JavaScript: se manda igual
// y el error vuelve en la página.
export function FormularioEntrar({ aviso }: { aviso: string | null }) {
  const [estado, accion, enviando] = useActionState<EstadoEntrar, FormData>(entrar, {
    error: aviso,
    email: "",
  });

  return (
    <form action={accion} className="mt-8 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={estado.email}
          aria-describedby={estado.error ? "error-entrar" : undefined}
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contrasena">Contraseña</Label>
        <Input
          id="contrasena"
          name="contrasena"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={estado.error ? "error-entrar" : undefined}
          className="h-11"
        />
      </div>

      <p id="error-entrar" role="alert" className="min-h-5 text-sm text-highlight">
        {estado.error}
      </p>

      <Button
        type="submit"
        disabled={enviando}
        className="h-11 rounded-full text-sm font-semibold"
      >
        {enviando ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
