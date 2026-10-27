import type { Foto } from "@/lib/autos";

// El video y las fotos de entregas de ejemplo viven en este archivo. Se usan mientras
// no lleguen los reales de la agencia. Borrar este archivo = no queda ningún ejemplo
// en el código (y el código marca dónde poner lo real). Los autos de ejemplo están en
// la base de datos (`supabase/seed.sql`) y se borran desde ahí.
//
// Fotos y video: Pexels (pexels.com/license), cargados desde sus servidores, sin
// guardarlos en el repo. Cada uno lleva el link a su página en `fuente`.

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

export const videoDeEjemplo = {
  src: "https://videos.pexels.com/video-files/17530623/17530623-sd_960_540_30fps.mp4",
  /** Cuadro fijo: se ve mientras carga el video y en lugar del video con «reducir movimiento». */
  poster:
    "https://images.pexels.com/videos/17530623/4x4-adventure-dust-road-outdoor-adventure-17530623.jpeg",
  fuente: "https://www.pexels.com/video/a-white-pickup-truck-driving-on-a-rocky-road-17530623/",
  /** La cámara sigue a la camioneta, que va un poco a la izquierda del centro: el recorte del celular la sigue. */
  encuadre: "45% 50%",
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
