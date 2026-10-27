import type { SVGProps } from "react";

// La silueta del auto del logo de la agencia, redibujada. El auto toma el color
// del texto; la línea de abajo, el rojo de marca. Mide el alto con `className`
// (por ejemplo `h-4 w-auto`).
export function LogoSpp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-12 -12 640 165"
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M0 65C160 75 360 76 460 72C550 70 590 85 615 110M72 54C145 12 205 6 250 8C305 10 360 35 400 64" />
      <path className="stroke-highlight" d="M470 112C520 116 560 124 588 137" />
    </svg>
  );
}
