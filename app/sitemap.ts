import type { MetadataRoute } from "next";
import { agencia } from "@/lib/agencia";
import { direccionDelAuto } from "@/lib/autos";
import { traerAutosALaVista } from "@/lib/traer-autos";

// La lista de páginas para Google (/sitemap.xml): el Inicio, el catálogo y la
// página de cada auto a la vista. Se rearma sola cada 1 hora, como el catálogo.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const autos = await traerAutosALaVista();
  return [
    { url: agencia.sitio, changeFrequency: "daily", priority: 1 },
    { url: `${agencia.sitio}/autos`, changeFrequency: "daily", priority: 0.9 },
    ...autos.map((auto) => ({
      url: `${agencia.sitio}${direccionDelAuto(auto)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
