"use client";

import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, useState, useSyncExternalStore } from "react";
import { Input } from "@/components/ui/input";

const sinSuscripcion = () => () => {};

type Props = Omit<ComponentProps<typeof Input>, "type" | "className"> & { id: string };

/**
 * Un campo de contraseña con el ojito para verla. El ojito sólo aparece con
 * JavaScript andando: sin él, no haría nada.
 */
export function CampoDeContrasena({ id, ...props }: Props) {
  const [verContrasena, setVerContrasena] = useState(false);
  const conJavascript = useSyncExternalStore(sinSuscripcion, () => true, () => false);

  return (
    <div className="relative">
      <Input id={id} type={verContrasena ? "text" : "password"} className="pr-13" {...props} />
      {conJavascript && (
        <button
          type="button"
          onClick={() => setVerContrasena((ver) => !ver)}
          aria-label={verContrasena ? "Ocultar la contraseña" : "Mostrar la contraseña"}
          aria-controls={id}
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
  );
}
