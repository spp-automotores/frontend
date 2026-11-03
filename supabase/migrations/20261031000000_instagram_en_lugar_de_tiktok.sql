-- El video de cada auto pasa de TikTok a Instagram: la agencia publica sus videos en
-- Instagram. Se corre una sola vez, en el «SQL Editor» de Supabase, en las dos bases
-- (la real y la de pruebas), justo cuando se publica el cambio del sitio.
--
-- Mientras tanto el sitio público sigue andando: lee la columna si existe y, si no, no
-- muestra el botón. Lo único que falla en ese rato es guardar un auto en el panel.
--
-- Sólo acepta links de Instagram (https://www.instagram.com/reel/…, /p/…). Los links de
-- TikTok que hubiera se borran: no sirven para el botón nuevo. Los permisos y las reglas
-- de la tabla siguen igual (cambiar el nombre de una columna no los toca).

alter table public.autos drop constraint if exists autos_tiktok_check;

alter table public.autos rename column tiktok to instagram;

update public.autos set instagram = null where instagram is not null;

alter table public.autos
  add constraint autos_instagram_check
    check (instagram is null or instagram ~ '^https://([a-z0-9-]+\.)*instagram\.com/');

comment on column public.autos.instagram is 'Link del video de Instagram del auto; null si no tiene.';

-- Para ver que quedó bien (tiene que mostrar una fila: instagram, text):
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'autos' and column_name in ('tiktok', 'instagram');
