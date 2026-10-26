-- Tabla de autos del sitio. Se corre una sola vez, en el «SQL Editor» de Supabase.
-- Las columnas son las del tipo `Auto` de `lib/autos.ts` (en snake_case).
-- Lo que no se sabe va como `null`: el sitio no lo muestra (o muestra «Consultar»).

create table public.autos (
  id uuid primary key default gen_random_uuid(),
  -- La parte de la dirección de su página: /autos/<slug> (marca-modelo-año).
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  -- Sólo los autos de ejemplo: la página los marca como «Auto de ejemplo».
  ejemplo boolean not null default false,
  marca text not null check (marca <> ''),
  modelo text not null check (modelo <> ''),
  version text,
  anio smallint not null check (anio between 1950 and 2100),
  km integer not null check (km >= 0),
  combustible text not null check (combustible in ('Nafta', 'Diésel')),
  caja text not null check (caja in ('Manual', 'Automática')),
  tipo text check (tipo in ('SUV', 'Pickup', 'Sedán', 'Hatchback')),
  color text,
  motor text,
  puertas smallint check (puertas between 2 and 5),
  unico_dueno boolean,
  mantenimientos text,
  service_al_dia boolean,
  -- En pesos. `null` = se muestra «Consultar».
  precio bigint check (precio > 0),
  estado text not null default 'Disponible'
    check (estado in ('Disponible', 'Reservado', 'Vendido')),
  -- Texto de la agencia sobre el auto, con sus palabras.
  descripcion text,
  -- Lista de fotos: [{ "src": "...", "alt": "...", "fuente": "..." }]. La primera es la de portada.
  fotos jsonb not null default '[]'::jsonb
    check (jsonb_typeof(fotos) = 'array'),
  -- Fecha en que se cargó el auto (hora de Tucumán).
  ingresado_el date not null
    default (now() at time zone 'America/Argentina/Tucuman')::date,
  -- Fecha en que se marcó vendido; sólo un auto vendido la tiene.
  vendido_el date,
  creado_el timestamptz not null default now(),
  check (vendido_el is null or estado = 'Vendido')
);

comment on table public.autos is 'Autos del sitio: el catálogo, el Inicio y la página de cada auto.';

-- Row Level Security: sin una regla, nadie lee ni escribe.
alter table public.autos enable row level security;

-- Única regla por ahora: cualquiera puede leer los autos (son públicos).
-- Escribir no tiene regla todavía: llega con el login del panel.
create policy "Cualquiera lee los autos"
  on public.autos
  for select
  to anon, authenticated
  using (true);

-- Las tablas nuevas no quedan a la vista solas: ésta se abre sólo para leer.
grant usage on schema public to anon, authenticated;
grant select on table public.autos to anon, authenticated;
