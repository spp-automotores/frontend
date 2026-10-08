import { BarraSuperior } from "@/components/barra-superior";
import { Entregas } from "@/components/inicio/entregas";
import { PorQueSpp } from "@/components/inicio/por-que-spp";
import { Portada } from "@/components/inicio/portada";
import { RecienIngresados } from "@/components/inicio/recien-ingresados";
import { Servicios } from "@/components/inicio/servicios";
import { VendeTuAuto } from "@/components/inicio/vende-tu-auto";
import { Pie } from "@/components/pie";
import { traerRecienIngresados } from "@/lib/autos";
import { entregasDeEjemplo, videoDeEjemplo } from "@/lib/ejemplo";

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
