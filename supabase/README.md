# Base de datos (Supabase)

Lo que arma la base del sitio. Nada de acá tiene claves: las claves van en `.env.local`
(ver `.env.example`) y en las variables de entorno de Vercel.

## Cómo se arma, en orden

Cada archivo se corre una sola vez, en el «SQL Editor» del proyecto de Supabase
(pegar el contenido y «Run»):

1. `migrations/20261015000000_tabla_autos.sql`: la tabla `autos` y sus reglas
   (cualquiera lee; nadie escribe todavía).
2. `seed.sql`: los 10 autos de ejemplo. Se borran todos juntos con
   `delete from public.autos where ejemplo;`

Los cambios futuros a la base van como archivos nuevos en `migrations/`, con la fecha
adelante, y se corren en orden.

## Reglas

- **Row Level Security** prendida en toda tabla: sin una regla, nadie lee ni escribe.
- Las tablas nuevas no quedan a la vista solas: cada una se abre con su `grant`.
- La clave publicable es pública por diseño; lo que protege los datos son las reglas.
