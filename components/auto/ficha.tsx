import { type Auto, formatearKm } from "@/lib/autos";

const siNo = (valor: boolean | null) => (valor === null ? null : valor ? "Sí" : "No");

/** Los datos del auto. Lo que no está cargado no aparece (ni «—» ni «a confirmar»). */
export function Ficha({ auto }: { auto: Auto }) {
  const filas: [string, string | number | null][] = [
    ["Año", auto.anio],
    ["Kilometraje", formatearKm(auto.km)],
    ["Combustible", auto.combustible],
    ["Caja", auto.caja],
    ["Versión", auto.version],
    ["Tipo", auto.tipo],
    ["Color", auto.color],
    ["Motor", auto.motor],
    ["Puertas", auto.puertas],
    ["Único dueño", siNo(auto.unicoDueno)],
    ["Service al día", siNo(auto.serviceAlDia)],
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-4 rounded-2xl bg-card px-4 [&>div:nth-child(-n+2)]:border-t-0">
      {filas
        .filter(([, valor]) => valor !== null)
        .map(([dato, valor]) => (
          <div key={dato} className="border-t border-border py-3">
            <dt className="text-xs text-muted-foreground">{dato}</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">{valor}</dd>
          </div>
        ))}
      {auto.mantenimientos && (
        <div className="col-span-2 border-t border-border py-3">
          <dt className="text-xs text-muted-foreground">Mantenimientos</dt>
          <dd className="mt-0.5 font-semibold text-pretty">{auto.mantenimientos}</dd>
        </div>
      )}
    </dl>
  );
}
