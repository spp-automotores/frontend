import { ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram";

/**
 * El botón al video del auto en la cuenta de Instagram de la agencia. Es un link común,
 * sin cargar nada de Instagram en la página: el video se ve en Instagram.
 */
export function VideoEnInstagram({ link }: { link: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener"
      className="group flex items-center gap-3.5 rounded-2xl bg-card p-4 transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-background">
        <InstagramIcon className="size-5" />
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="font-semibold">Mirá el video en Instagram</span>
        <span className="text-sm text-muted-foreground">Se abre en Instagram</span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
      />
    </a>
  );
}
