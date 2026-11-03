import { LogoSpp } from "@/components/icons/logo-spp";
import { agencia } from "@/lib/agencia";

/**
 * El logo de la agencia en grande, como el original: la silueta del auto y, debajo, el
 * nombre en dos líneas. Las letras se miden con el ancho de la caja (`cqi`), así el
 * nombre ocupa siempre lo mismo que la silueta, en el celular y en la computadora.
 */
export function LogoGrande({ className }: { className?: string }) {
  const { arriba, abajo } = agencia.nombreDelLogo;
  return (
    <div role="img" aria-label={`${arriba} ${abajo}`} className={`@container w-full ${className ?? ""}`}>
      <div aria-hidden="true" className="flex flex-col items-center">
        <LogoSpp className="h-auto w-[84%]" strokeWidth={9} />
        <span className="mt-[4cqi] font-acento text-[7.6cqi] leading-none font-bold whitespace-nowrap uppercase">
          {arriba}
        </span>
        <span className="mt-[2.4cqi] ml-[0.55em] font-acento text-[4.4cqi] leading-none font-medium tracking-[0.55em] whitespace-nowrap uppercase">
          {abajo}
        </span>
      </div>
    </div>
  );
}
