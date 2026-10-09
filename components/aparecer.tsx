"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useMenosMovimiento } from "@/lib/use-menos-movimiento";

const curva = [0.23, 1, 0.32, 1] as const;

// Se anima `transform` completo (no el atajo `y` de Motion): así lo hace la placa de
// video y no se traba mientras la página todavía está cargando.
function variantesDeEntrada(menosMovimiento: boolean): Variants {
  return {
    oculto: { opacity: 0, transform: "translateY(40px)" },
    visible: {
      opacity: 1,
      transform: "translateY(0px)",
      // Con «reducir movimiento», sólo un fundido corto: la posición va a su lugar sin
      // animarse (el servidor no sabe la preferencia y manda la sección desplazada).
      transition: menosMovimiento
        ? { duration: 0.3, ease: curva, transform: { duration: 0 } }
        : { duration: 0.8, ease: curva },
    },
  };
}

/**
 * La sección aparece al llegar a ella: sube y se hace visible.
 * Con `escalonado`, no se mueve ella: hace aparecer sus `AparecerItem` uno detrás de otro.
 */
export function Aparecer({
  children,
  className,
  escalonado = false,
}: {
  children: ReactNode;
  className?: string;
  escalonado?: boolean;
}) {
  const menosMovimiento = useMenosMovimiento(false);
  const variantes: Variants = escalonado
    ? { oculto: {}, visible: { transition: { staggerChildren: menosMovimiento ? 0 : 0.08 } } }
    : variantesDeEntrada(menosMovimiento);

  return (
    <motion.div
      className={className}
      variants={variantes}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

/** Un elemento de una lista dentro de `<Aparecer escalonado>`. */
export function AparecerItem({ children, className }: { children: ReactNode; className?: string }) {
  const menosMovimiento = useMenosMovimiento(false);
  return (
    <motion.div className={className} variants={variantesDeEntrada(menosMovimiento)}>
      {children}
    </motion.div>
  );
}
