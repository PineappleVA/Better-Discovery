// ============================================================
// Better Discovery – Supabase Configuration
// ============================================================
// 1. Create a FREE project at https://supabase.com
// 2. Go to  Project Settings → API
// 3. Copy your Project URL and anon/public key below
// 4. Run the SQL schema in your Supabase SQL Editor
//    (see about.html or README.md for the full schema)
// ============================================================

const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';

// Auto-detect whether credentials have been filled in
const IS_CONFIGURED =
  !SUPABASE_URL.includes('YOUR_PROJECT') &&
  !SUPABASE_ANON_KEY.includes('YOUR_ANON');
