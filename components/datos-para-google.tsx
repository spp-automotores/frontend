import { agencia } from "@/lib/agencia";

/**
 * Los datos de la agencia en el formato que lee Google (schema.org, `AutoDealer`). No se ven
 * en la página: sirven para que Google sepa que el sitio y el perfil de Google Maps son el
 * mismo negocio. Lo que está en `null` en `lib/agencia.ts` no se manda.
 */
export function DatosParaGoogle() {
  const redes = Object.values(agencia.redes).filter((url): url is string => Boolean(url));

  const datos = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: agencia.nombre,
    alternateName: `${agencia.nombreDelLogo.arriba} ${agencia.nombreDelLogo.abajo}`,
    url: agencia.sitio,
    image: `${agencia.sitio}/apple-icon.png`,
    ...(agencia.whatsapp && { telephone: `+${agencia.whatsapp}` }),
    ...(agencia.direccion && {
      address: {
        "@type": "PostalAddress",
        streetAddress: agencia.direccion,
        addressLocality: agencia.ciudad,
        addressRegion: agencia.provincia,
        postalCode: agencia.codigoPostal,
        addressCountry: "AR",
      },
    }),
    geo: {
      "@type": "GeoCoordinates",
      latitude: agencia.ubicacion.latitud,
      longitude: agencia.ubicacion.longitud,
    },
    ...(agencia.horarios && { openingHours: agencia.horarios }),
    ...(redes.length > 0 && { sameAs: redes }),
  };

  return (
    <script
      type="application/ld+json"
      // El `<` se escapa para que ningún texto pueda cerrar la etiqueta antes de tiempo.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\\u003c") }}
    />
  );
}
