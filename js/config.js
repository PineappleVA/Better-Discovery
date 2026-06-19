// ============================================================
// Better Discovery – Configuración de Supabase
// ============================================================
// 1. Crea un proyecto GRATIS en https://supabase.com
// 2. Ve a Project Settings → API
// 3. Pega aquí la URL de tu proyecto y tu clave anon/pública
// 4. Ejecuta el esquema SQL en el editor SQL de Supabase
//    (revisa about.html o README.md para el esquema completo)
// ============================================================

const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';

// Detecta automáticamente si las credenciales fueron completadas
const IS_CONFIGURED =
  !!SUPABASE_URL &&
  !!SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('YOUR_PROJECT') &&
  !SUPABASE_ANON_KEY.includes('YOUR_ANON');
