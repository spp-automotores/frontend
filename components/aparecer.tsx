"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * La sección aparece suave al llegar a ella. La animación es CSS (ver `[data-aparecer]`
 * en `app/globals.css`); acá sólo se avisa cuándo entra en pantalla. Con «reducir
 * movimiento», el CSS no se aplica y la sección se ve directamente.
 */
export function Aparecer({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          elemento.dataset.visible = "true";
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={ref} data-aparecer className={className}>
      {children}
    </div>
  );
}
