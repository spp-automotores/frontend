-- El link del video de TikTok de cada auto (opcional): la página del auto lo muestra
-- como un botón a TikTok. Se corre una sola vez, en el «SQL Editor» de Supabase.
--
-- Sólo acepta links de TikTok (https://www.tiktok.com/…, https://vm.tiktok.com/…).
-- Los permisos y las reglas de la tabla ya cubren la columna nueva: no hace falta otro `grant`.

alter table public.autos
  add column tiktok text
    check (tiktok is null or tiktok ~ '^https://([a-z0-9-]+\.)*tiktok\.com/');

comment on column public.autos.tiktok is 'Link del video de TikTok del auto; null si no tiene.';
