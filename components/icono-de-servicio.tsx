import { ArrowLeftRight, FileCheck, Landmark, type LucideIcon, Truck } from "lucide-react";
import type { IconoServicio } from "@/lib/agencia";

export const iconosDeServicio: Record<IconoServicio, LucideIcon> = {
  financiacion: Landmark,
  permuta: ArrowLeftRight,
  tramites: FileCheck,
  entrega: Truck,
};
