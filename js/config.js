// ============================================================
// Better Discovery – Configuración de Supabase
// ============================================================
// Configuración del proyecto Better Discovery
// Si cambias de proyecto, actualiza estas dos constantes.
// ============================================================

const SUPABASE_URL      = 'https://onfgppojanfagdccvrcy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Uz6Dfl_CKXgF6nByIp50qg_O6rcbVPz';

// Detecta automáticamente si las credenciales fueron completadas
const IS_CONFIGURED =
  !!SUPABASE_URL &&
  !!SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('YOUR_PROJECT') &&
  !SUPABASE_ANON_KEY.includes('YOUR_ANON');
