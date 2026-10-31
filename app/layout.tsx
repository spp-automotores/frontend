import type { Metadata, Viewport } from "next";
import { Archivo, Montserrat } from "next/font/google";
import { agencia } from "@/lib/agencia";
import "./globals.css";

// Archivo con el eje de ancho (wdth) para los títulos anchos del diseño.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Montserrat: las frases de acento en rojo y el logo grande de la portada. Derecha y
// firme, parecida a las letras del logo de la agencia.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const descripcion =
  "Agencia familiar de autos en San Miguel de Tucumán. Comprá tu vehículo con seguridad, transparencia y facilidad: financiación bancaria, permuta y todos los trámites.";

// Título y descripción para Google y para la vista previa cuando se comparte el link.
export const metadata: Metadata = {
  // Base de los links de la vista previa (por ejemplo, el de cada auto).
  metadataBase: new URL(agencia.sitio),
  title: "SPP Automotores · Autos en San Miguel de Tucumán",
  description: descripcion,
  openGraph: {
    title: "SPP Automotores",
    description: descripcion,
    siteName: "SPP Automotores",
    locale: "es_AR",
    type: "website",
  },
};

// Color de la barra del navegador en el celular: el mismo fondo del sitio (--background).
export const viewport: Viewport = {
  themeColor: "#0c0c0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${archivo.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
