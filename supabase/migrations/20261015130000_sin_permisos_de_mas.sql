-- Saca permisos sobre la tabla autos que nadie de afuera necesita.
-- Se corre una sola vez, en el «SQL Editor» de Supabase.
--
-- Supabase los deja puestos solos al crear una tabla. El que importa es TRUNCATE
-- (vaciar la tabla entera de una vez): las reglas de Row Level Security no lo
-- frenan. La API de Supabase no lo ofrece, pero un permiso que saltea las reglas
-- y que nadie usa no tiene por qué estar. Quedan sólo los que el sitio usa:
-- leer para todos; cargar, cambiar y borrar para quien entra (con las reglas).
revoke truncate, references, trigger on table public.autos from anon, authenticated;
