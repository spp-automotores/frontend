import type { MetadataRoute } from "next";
import { agencia } from "@/lib/agencia";

// /robots.txt: Google puede recorrer todo el sitio menos la administración y las
// rutas internas, y encuentra ahí la lista de páginas.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${agencia.sitio}/sitemap.xml`,
  };
}
