import type { Auto, Foto } from "@/lib/autos";

// Todo lo de ejemplo del sitio vive en este archivo: autos, fotos, video y entregas.
// Se usa mientras no lleguen los autos, las fotos y el video reales de la agencia.
// Borrar este archivo = no queda ningún ejemplo (y el código marca dónde poner lo real).
//
// Fotos y video: Pexels (pexels.com/license), cargados desde sus servidores, sin
// guardarlos en el repo. Cada uno lleva el link a su página en `fuente`.

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

export const autosDeEjemplo: Auto[] = [
  {
    id: "ejemplo-toyota-hilux-2022",
    marca: "Toyota",
    modelo: "Hilux",
    version: "2.8 SRV 4x4 AT",
    anio: 2022,
    km: 58000,
    combustible: "Diésel",
    caja: "Automática",
    tipo: "Pickup",
    color: "Negro",
    motor: "2.8",
    puertas: 4,
    unicoDueno: null,
    mantenimientos: null,
    serviceAlDia: null,
    precio: 48500000,
    estado: "Disponible",
    ingresadoEl: "2026-10-07",
    fotos: [
      {
        src: pexels(18240251),
        alt: "Toyota Hilux negra estacionada, vista de costado",
        fuente:
          "https://www.pexels.com/photo/black-toyota-hilux-pickup-truck-in-the-parking-lot-18240251/",
      },
    ],
  },
  {
    id: "ejemplo-jeep-compass-2019",
    marca: "Jeep",
    modelo: "Compass",
    version: "2.4 Limited AT",
    anio: 2019,
    km: 72000,
    combustible: "Nafta",
    caja: "Automática",
    tipo: "SUV",
    color: "Negro",
    motor: "2.4",
    puertas: 5,
    unicoDueno: null,
    mantenimientos: null,
    serviceAlDia: null,
    precio: null,
    estado: "Disponible",
    ingresadoEl: "2026-10-05",
    fotos: [
      {
        src: pexels(5691339),
        alt: "Jeep Compass negro en un camino entre árboles, vista de frente",
        fuente: "https://www.pexels.com/photo/a-black-car-parked-on-the-street-5691339/",
      },
    ],
  },
  {
    id: "ejemplo-peugeot-208-2018",
    marca: "Peugeot",
    modelo: "208",
    version: "1.6 GT",
    anio: 2018,
    km: 64000,
    combustible: "Nafta",
    caja: "Manual",
    tipo: "Hatchback",
    color: "Negro",
    motor: "1.6",
    puertas: 5,
    unicoDueno: null,
    mantenimientos: null,
    serviceAlDia: null,
    precio: 16900000,
    estado: "Reservado",
    ingresadoEl: "2026-10-02",
    fotos: [
      {
        src: pexels(24551622),
        alt: "Peugeot 208 negro frente al mar, vista de atrás",
        fuente: "https://www.pexels.com/photo/black-peugeot-208-24551622/",
      },
    ],
  },
  {
    id: "ejemplo-volkswagen-amarok-2015",
    marca: "Volkswagen",
    modelo: "Amarok",
    version: "2.0 TDI Highline 4x4",
    anio: 2015,
    km: 120000,
    combustible: "Diésel",
    caja: "Manual",
    tipo: "Pickup",
    color: "Negro",
    motor: "2.0",
    puertas: 4,
    unicoDueno: null,
    mantenimientos: null,
    serviceAlDia: null,
    precio: 27000000,
    estado: "Vendido",
    ingresadoEl: "2026-09-28",
    fotos: [
      {
        src: pexels(18417375),
        alt: "Volkswagen Amarok negra en un campo verde",
        fuente:
          "https://www.pexels.com/photo/black-volkswagen-amarok-on-meadow-18417375/",
      },
    ],
  },
];

export const videoDeEjemplo = {
  src: "https://videos.pexels.com/video-files/32013220/13644515_960_540_30fps.mp4",
  /** Cuadro fijo: se ve mientras carga el video y en lugar del video con «reducir movimiento». */
  poster: "https://images.pexels.com/videos/32013220/black-suv-offroading-32013220.jpeg",
  fuente: "https://www.pexels.com/video/black-suv-offroading-on-dusty-rural-road-32013220/",
};

export const entregasDeEjemplo: Foto[] = [
  {
    src: pexels(8482859),
    alt: "Una mano entrega las llaves de un auto a otra, junto a los papeles",
    fuente: "https://www.pexels.com/photo/a-person-handing-out-a-key-8482859/",
  },
  {
    src: pexels(7144212),
    alt: "Apretón de manos y entrega de llave frente a un auto",
    fuente:
      "https://www.pexels.com/photo/close-up-of-men-shaking-hands-and-handing-in-keys-to-a-new-car-at-the-car-salon-7144212/",
  },
  {
    src: pexels(29217852),
    alt: "Mano con las llaves de su auto, sentada al volante",
    fuente:
      "https://www.pexels.com/photo/close-up-of-hand-holding-car-keys-in-vehicle-interior-29217852/",
  },
];
