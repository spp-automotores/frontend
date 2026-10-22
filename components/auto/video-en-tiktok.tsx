import { ArrowUpRight } from "lucide-react";
import { TiktokIcon } from "@/components/icons/tiktok";

/**
 * El botón al video del auto en la cuenta de TikTok de la agencia. Es un link común,
 * sin cargar nada de TikTok en la página: el video se ve en TikTok.
 */
export function VideoEnTiktok({ link }: { link: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener"
      className="group flex items-center gap-3.5 rounded-2xl bg-card p-4 transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-background">
        <TiktokIcon className="size-5" />
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="font-semibold">Mirá el video en TikTok</span>
        <span className="text-sm text-muted-foreground">Se abre en TikTok</span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
      />
    </a>
  );
}
