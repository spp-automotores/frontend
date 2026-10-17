// La marca de administrador de una cuenta: `app_metadata.rol` = "admin". Esa ficha
// sólo se cambia desde Supabase (quien entra no la puede tocar), y es la misma marca
// que piden las reglas de la base para escribir (`supabase/migrations/`).
export function tieneMarcaDeAdmin(appMetadata: unknown): boolean {
  return (appMetadata as { rol?: unknown } | null | undefined)?.rol === "admin";
}
