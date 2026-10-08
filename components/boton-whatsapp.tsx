import { WhatsappIcon } from "@/components/icons/whatsapp";
import { linkDeWhatsapp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const variantes = {
  // Rojo SPP con texto blanco: la consulta por un auto.
  rojo: "bg-primary text-primary-foreground hover:bg-primary/85",
  // Oscuro: sobre fondos rojos.
  oscuro: "bg-background text-foreground hover:bg-card",
};

type Props = {
  mensaje: string;
  etiqueta: string;
  variante?: keyof typeof variantes;
  className?: string;
};

/**
 * Abre WhatsApp con el mensaje armado. Mientras la agencia no tenga el número
 * cargado, el botón se ve apagado, dice «número pendiente» y no abre nada.
 */
export function BotonWhatsapp({ mensaje, etiqueta, variante = "rojo", className }: Props) {
  const href = linkDeWhatsapp(mensaje);
  const base = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold",
    variantes[variante],
    className,
  );

  if (!href) {
    return (
      <span aria-disabled="true" className={cn(base, "pointer-events-none opacity-60")}>
        <WhatsappIcon className="size-4 shrink-0" />
        <span className="flex flex-col items-start leading-tight">
          {etiqueta}
          <span className="text-[11px] font-normal">número pendiente</span>
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        base,
        "transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      )}
    >
      <WhatsappIcon className="size-4 shrink-0" />
      {etiqueta}
    </a>
  );
}
