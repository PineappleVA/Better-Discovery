// ============================================================
// Better Discovery – Configuración de Supabase
// ============================================================
// Configuración del proyecto Better Discovery
// Si cambias de proyecto, actualiza estas dos constantes.
// ============================================================

const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Detecta automáticamente si las credenciales fueron completadas
const IS_CONFIGURED =
  !!SUPABASE_URL &&
  !!SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('YOUR_PROJECT') &&
  !SUPABASE_ANON_KEY.includes('YOUR_ANON');
