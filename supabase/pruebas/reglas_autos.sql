-- Prueba de las reglas de la tabla autos. No cambia nada: cada caso se deshace solo.
-- Se hace pasar por tres visitantes (el administrador, alguien logueado sin la marca
-- y alguien sin cuenta) y prueba leer, cargar, cambiar y borrar con cada uno.
-- Un error en un caso no corta a los demás: queda anotado en su fila.

drop table if exists pg_temp.prueba_reglas;
create temp table prueba_reglas (n int, quien text, accion text, resultado text, esperado text);

do $$
declare
  admin jsonb;
  comun jsonb := '{"role": "authenticated", "sub": "00000000-0000-0000-0000-000000000000", "app_metadata": {}}';
  quien text;
  accion text;
  filas int;
  resultado text;
  n int := 0;
begin
  -- La ficha real de una cuenta con la marca de administrador.
  select jsonb_build_object('role', 'authenticated', 'sub', id, 'app_metadata', raw_app_meta_data)
    into admin
    from auth.users
    where raw_app_meta_data ->> 'rol' = 'admin'
    limit 1;

  foreach quien in array array['admin', 'logueado sin marca', 'sin cuenta'] loop
    foreach accion in array array['lee', 'carga', 'cambia', 'borra'] loop
      n := n + 1;
      resultado := null;
      begin
        if quien = 'sin cuenta' then
          execute 'set local role anon';
          perform set_config('request.jwt.claims', '{"role": "anon"}', true);
        else
          execute 'set local role authenticated';
          perform set_config('request.jwt.claims',
            (case when quien = 'admin' then admin else comun end)::text, true);
        end if;

        if accion = 'lee' then
          select count(*) into filas from public.autos;
        elsif accion = 'carga' then
          insert into public.autos (slug, marca, modelo, anio, km, combustible, caja)
          values ('prueba-de-reglas', 'Prueba', 'Prueba', 2020, 0, 'Nafta', 'Manual');
          get diagnostics filas = row_count;
        elsif accion = 'cambia' then
          update public.autos set km = km where slug = 'ejemplo-toyota-hilux-2022';
          get diagnostics filas = row_count;
        else
          delete from public.autos where slug = 'ejemplo-toyota-hilux-2022';
          get diagnostics filas = row_count;
        end if;

        resultado := filas || ' fila(s)';
        raise exception 'deshacer';
      exception when others then
        if sqlerrm <> 'deshacer' then
          resultado := 'error ' || sqlstate || ': ' || sqlerrm;
        end if;
      end;

      insert into prueba_reglas values (n, quien, accion, resultado,
        case
          when accion = 'lee' then '10 fila(s)'
          when quien = 'admin' then '1 fila(s)'
          when quien = 'sin cuenta' then 'error 42501: permission denied'
          when accion = 'carga' then 'error 42501: row-level security'
          else '0 fila(s)'
        end);
    end loop;
  end loop;
end $$;

select n, quien, accion, resultado, esperado from prueba_reglas
union all
select 13, 'después de la prueba', 'autos en la tabla', count(*)::text, '10' from public.autos
order by n;
