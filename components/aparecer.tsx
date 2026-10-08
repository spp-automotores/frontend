"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useMenosMovimiento } from "@/lib/use-menos-movimiento";

/** La sección aparece suave al llegar a ella. Con «reducir movimiento», aparece sin moverse. */
export function Aparecer({ children, className }: { children: ReactNode; className?: string }) {
  const menosMovimiento = useMenosMovimiento(false);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={menosMovimiento ? { duration: 0 } : { duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
