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
3. `migrations/20261015120000_solo_el_admin_escribe.sql`: sólo una cuenta de
   administrador puede cargar, cambiar y borrar autos.

## Cuentas del panel `/admin`

Nadie se puede crear una cuenta desde el sitio (el registro está apagado en
Authentication). Cada cuenta se crea a mano en Authentication → Users, ya
confirmada, y después se la marca como administradora con esta línea, en el
«SQL Editor» (cambiar el email):

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"rol": "admin"}'::jsonb
where email = 'email-de-la-cuenta@ejemplo.com';
```

La marca se nota al volver a entrar. Para sacarla, lo mismo con
`raw_app_meta_data - 'rol'`.

Los cambios futuros a la base van como archivos nuevos en `migrations/`, con la fecha
adelante, y se corren en orden.

## Reglas

- **Row Level Security** prendida en toda tabla: sin una regla, nadie lee ni escribe.
- Las tablas nuevas no quedan a la vista solas: cada una se abre con su `grant`.
- La clave publicable es pública por diseño; lo que protege los datos son las reglas.
