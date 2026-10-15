-- Quién puede cambiar los autos: sólo una cuenta de administrador del panel.
-- Se corre una sola vez, en el «SQL Editor» de Supabase, después de la tabla.
--
-- Una cuenta es de administrador si su ficha interna (`app_metadata`) dice
-- "rol": "admin". Esa ficha sólo se cambia desde Supabase: quien entra con la
-- cuenta no la puede tocar. No alcanza con «estar logueado»: una cuenta anónima
-- (si alguna vez se prende) también entra a la base como `authenticated`.

-- Hacen falta las dos cosas: el permiso (`grant`) abre la puerta a quien está
-- logueado y las reglas de abajo dicen quién de ellos pasa.
grant insert, update, delete on table public.autos to authenticated;

-- `(select auth.jwt() ...)`: la base lo calcula una vez por consulta, no por fila.
create policy "El administrador carga autos"
  on public.autos
  for insert
  to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'rol') = 'admin');

create policy "El administrador cambia autos"
  on public.autos
  for update
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'rol') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'rol') = 'admin');

create policy "El administrador borra autos"
  on public.autos
  for delete
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'rol') = 'admin');
