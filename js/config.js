// ============================================================
// Better Discovery – Configuración de Supabase
// ============================================================
// Configuración del proyecto Better Discovery
// Si cambias de proyecto, actualiza estas dos constantes.
// ============================================================

const SUPABASE_URL      = 'https://onfgppojanfagdccvrcy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZmdwcG9qYW5mYWdkY2N2cmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NzA5NjMsImV4cCI6MjA5NzQ0Njk2M30.U93p34ZfBnHND0Xozj-9o2DzrAmvypb053P7274f7cg';

// Detecta automáticamente si las credenciales fueron completadas
const IS_CONFIGURED =
  !!SUPABASE_URL &&
  !!SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('YOUR_PROJECT') &&
  !SUPABASE_ANON_KEY.includes('YOUR_ANON');
