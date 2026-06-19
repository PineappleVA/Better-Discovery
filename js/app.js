// ============================================================
// Better Discovery – Shared App Utilities
// ============================================================

/* ── Supabase client ── */
let supabaseClient = null;
const DEFAULT_AUTHOR_NAME = 'Anónimo';
const LOGIN_PAGE = 'login.html';

if (IS_CONFIGURED) {
  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}

function isLoginPage() {
  return window.location.pathname.endsWith('/login.html') ||
         window.location.pathname.endsWith('/login');
}

async function getSession() {
  if (!supabaseClient) return null;
  const { data } = await supabaseClient.auth.getSession();
  return data?.session ?? null;
}

async function requireAuth() {
  if (isLoginPage()) return true;
  const session = await getSession();
  if (!session) {
    window.location.replace(LOGIN_PAGE);
    return false;
  }
  return true;
}

async function renderAuthNav() {
  const navAuth = document.getElementById('navAuth');
  if (!navAuth) return;

  if (!supabaseClient) {
    navAuth.innerHTML = '';
    return;
  }

  const session = await getSession();
  if (!session) {
    navAuth.innerHTML = `<a href="${LOGIN_PAGE}" class="btn btn-primary">Login</a>`;
    return;
  }

  const email = session.user?.email || DEFAULT_AUTHOR_NAME;
  navAuth.innerHTML = `
    <span class="user-label">${escapeHtml(email)}</span>
    <button type="button" class="btn btn-outline" id="logoutBtn">Salir</button>
  `;

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    window.location.replace(LOGIN_PAGE);
  });
}

/* ── Toast notifications ── */
function showToast(message, type = 'info', duration = 3500) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transition = 'opacity 0.3s, transform 0.3s';
    el.style.opacity    = '0';
    el.style.transform  = 'translateX(110%)';
    setTimeout(() => el.remove(), 320);
  }, duration);
}

/* ── Date helpers ── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);

  if (m < 1)  return 'ahora mismo';
  if (m < 60) return `hace ${m} min`;
  if (h < 24) return `hace ${h} h`;
  if (d <  7) return `hace ${d} d`;
  return new Date(dateStr).toLocaleDateString('es');
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

/* ── Size formatting ── */
function bytesToSize(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ── HTML escaping ── */
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

function getProfileInitial(name) {
  const value = String(name || '').trim();
  return value ? value[0].toUpperCase() : DEFAULT_AUTHOR_NAME[0].toUpperCase();
}

/* ── Likes (stored in localStorage) ── */
function getLikedSet() {
  try { return new Set(JSON.parse(localStorage.getItem('bd_liked') || '[]')); }
  catch { return new Set(); }
}

function saveLikedSet(set) {
  localStorage.setItem('bd_liked', JSON.stringify([...set]));
}

function isLiked(id) {
  return getLikedSet().has(id);
}

/**
 * Toggle like state.
 * Returns { nowLiked: boolean }
 */
function toggleLike(id) {
  const set = getLikedSet();
  const nowLiked = !set.has(id);
  if (nowLiked) { set.add(id); } else { set.delete(id); }
  saveLikedSet(set);
  return { nowLiked };
}

/* ── Config-not-set notice (used in grids) ── */
function configNoticeHtml() {
  return `
    <div class="config-notice">
      <strong>⚙️ No se pudo iniciar Supabase</strong><br><br>
      Revisa <code>js/config.js</code> y vuelve a cargar la página.<br>
      Si estás en login, intenta entrar de nuevo.
    </div>`;
}
