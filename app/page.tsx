import { BarraSuperior } from "@/components/barra-superior";
import { Entregas } from "@/components/inicio/entregas";
import { PorQueSpp } from "@/components/inicio/por-que-spp";
import { Portada } from "@/components/inicio/portada";
import { RecienIngresados } from "@/components/inicio/recien-ingresados";
import { Servicios } from "@/components/inicio/servicios";
import { VendeTuAuto } from "@/components/inicio/vende-tu-auto";
import { Pie } from "@/components/pie";
import { entregasDeEjemplo, videoDeEjemplo } from "@/lib/ejemplo";
import { traerRecienIngresados } from "@/lib/traer-autos";

// Se rearma sola cada 1 hora (en segundos): así entran los autos nuevos y los
// vendidos se ocultan al cumplir el plazo, sin volver a publicar.
export const revalidate = 3600;

export default async function Inicio() {
  const autos = await traerRecienIngresados();

  return (
    <>
      <BarraSuperior />
      <main className="flex-1">
        <Portada video={videoDeEjemplo} />
        <RecienIngresados autos={autos} />
        <PorQueSpp />
        <Servicios />
        <Entregas fotos={entregasDeEjemplo} />
        <VendeTuAuto />
      </main>
      <Pie />
    </>
  );
}
