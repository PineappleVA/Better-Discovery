// ============================================================
// Better Discovery – Shared App Utilities
// ============================================================

/* ── Supabase client ── */
let supabaseClient = null;
const DEFAULT_AUTHOR_NAME = 'Anónimo';
const LOGIN_PAGE = '/Better-Discovery/login.html';
const PROFILE_PAGE = '/Better-Discovery/profile.html';
const PROFILE_STORAGE_KEY = 'bd_profile';
const FOLLOW_STORAGE_KEY = 'bd_followed_authors';
const OWNED_SNIPPETS_STORAGE_KEY = 'bd_owned_snippets';
const textEncoder = new TextEncoder();

const MODERATOR_EMAILS = new Set([
  'jaimegamingpro@gmail.com',
  'jaimeferrerasg@safa-grial.es'
]);

function getSessionEmail(session) {
  return String(session?.user?.email || '').trim().toLowerCase();
}

function isModerator(session) {
  return MODERATOR_EMAILS.has(getSessionEmail(session));
}

function getModeratorBadgeHtml(session) {
  if (!isModerator(session)) return '';
  const email = getSessionEmail(session);
  const display = session.user?.user_metadata?.display_name || email.split('@')[0];
  return `<span class="mod-badge" title="Moderador">🛡️ ${escapeHtml(display)}</span>`;
}

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

async function requireAuth(options = {}) {
  const redirect = options.redirect !== false;
  if (isLoginPage()) return true;
  const session = await getSession();
  if (!session) {
    if (redirect) window.location.replace(LOGIN_PAGE);
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

  const profile = getProfileData();
  const displayLabel = profile.displayName || session.user?.email || DEFAULT_AUTHOR_NAME;
  const profileLink = window.location.pathname.endsWith('/profile.html') || window.location.pathname.endsWith('/profile')
    ? ''
    : `<a href="${PROFILE_PAGE}" class="btn btn-outline">Perfil</a>`;
  const modLink = isModerator(session)
    ? `<a href="/Better-Discovery/mod.html" class="btn btn-outline">Mod</a>`
    : '';
  navAuth.innerHTML = `
    <span class="user-label">
      ${escapeHtml(displayLabel)}
      ${getModeratorBadgeHtml(session)}
    </span>
    ${modLink}
    ${profileLink}
    <button type="button" class="btn btn-outline" id="logoutBtn">Salir</button>
  `;

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    window.location.replace(LOGIN_PAGE);
  });

  updateActiveNav();
}

function updateActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    link.classList.toggle('active', path.includes(href) && href !== '/Better-Discovery/index.html' ? path.includes(href.replace('/Better-Discovery/', '')) : path.endsWith('/Better-Discovery/index.html') && href.includes('index.html'));
  });
}

/* ── Moderator actions ── */
async function deleteSnippet(id) {
  if (!confirm('¿Seguro que quieres eliminar esta creación? Esta acción no se puede deshacer.')) return;
  const btn = document.getElementById('modDeleteBtn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Eliminando…'; }

  try {
    const { error } = await supabaseClient
      .from('snippets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    showToast('Creación eliminada.', 'success');
    setTimeout(() => { window.location.href = '/Better-Discovery/index.html'; }, 800);
  } catch (err) {
    showToast('No se pudo eliminar: ' + err.message, 'error', 5000);
    if (btn) { btn.disabled = false; btn.textContent = '🗑 Eliminar'; }
  }
}

function openEditModal(snippet) {
  const modal = document.getElementById('editModal');
  if (!modal) return;

  document.getElementById('editTitle').value = snippet.title || '';
  document.getElementById('editDescription').value = snippet.description || '';
  document.getElementById('editAuthor').value = snippet.author || '';
  document.getElementById('editTag').value = snippet.tag || '';
  document.getElementById('editHtml').value = snippet.html_content || '';
  modal.style.display = 'block';
  modal.dataset.snippetId = snippet.id;
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (modal) modal.style.display = 'none';
}

async function saveSnippetEdits() {
  const modal = document.getElementById('editModal');
  const id = modal?.dataset?.snippetId;
  if (!id) return;

  const title = document.getElementById('editTitle').value.trim();
  const description = document.getElementById('editDescription').value.trim();
  const author = document.getElementById('editAuthor').value.trim();
  const tag = document.getElementById('editTag').value.trim() || null;
  const html_content = document.getElementById('editHtml').value;

  if (!title) { showToast('El título no puede estar vacío.', 'error'); return; }

  const btn = document.getElementById('editSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Guardando…'; }

  try {
    const { error } = await supabaseClient
      .from('snippets')
      .update({ title, description, author, tag, html_content })
      .eq('id', id);

    if (error) throw error;

    showToast('Cambios guardados.', 'success');
    closeEditModal();
    window.location.reload();
  } catch (err) {
    showToast('Error al guardar: ' + err.message, 'error', 5000);
    if (btn) { btn.disabled = false; btn.textContent = '💾 Guardar cambios'; }
  }
}

/* ── Toast notifications ── */
function showToast(message, type = 'info', duration = 3500) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'slideIn 0.25s ease';
  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transition = 'opacity 0.3s, transform 0.3s';
    el.style.opacity = '0';
    el.style.transform = 'translateX(110%)';
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

function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

function getProfileData() {
  const profile = readJsonStorage(PROFILE_STORAGE_KEY, {});
  return {
    displayName: String(profile.displayName || DEFAULT_AUTHOR_NAME).trim(),
    bio: String(profile.bio || '').trim(),
  };
}

function saveProfileData(profile) {
  const next = {
    displayName: String(profile.displayName || DEFAULT_AUTHOR_NAME).trim() || DEFAULT_AUTHOR_NAME,
    bio: String(profile.bio || '').trim(),
  };
  writeJsonStorage(PROFILE_STORAGE_KEY, next);
  return next;
}

function getOwnedSnippetIds() {
  const ids = readJsonStorage(OWNED_SNIPPETS_STORAGE_KEY, []);
  return Array.isArray(ids) ? ids.filter(Boolean) : [];
}

function recordOwnedSnippetId(id) {
  const ids = new Set(getOwnedSnippetIds());
  ids.add(String(id));
  writeJsonStorage(OWNED_SNIPPETS_STORAGE_KEY, [...ids]);
}

function getFollowedAuthors() {
  const authors = readJsonStorage(FOLLOW_STORAGE_KEY, []);
  return Array.isArray(authors)
    ? [...new Set(authors.map(author => String(author || '').trim()).filter(Boolean))]
    : [];
}

function isFollowingAuthor(author) {
  const target = String(author || '').trim().toLowerCase();
  if (!target) return false;
  return getFollowedAuthors().some(name => name.toLowerCase() === target);
}

function toggleFollowAuthor(author) {
  const target = String(author || '').trim();
  if (!target) return { nowFollowing: false };
  const current = getFollowedAuthors();
  const targetLower = target.toLowerCase();
  const index = current.findIndex(name => name.toLowerCase() === targetLower);
  const nowFollowing = index === -1;
  if (nowFollowing) {
    current.unshift(target);
  } else {
    current.splice(index, 1);
  }
  writeJsonStorage(FOLLOW_STORAGE_KEY, current);
  return { nowFollowing };
}

function snippetBytes(snippet) {
  return textEncoder.encode(String(snippet?.html_content || '')).length;
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
      Revisa la configuración del proyecto y vuelve a cargar la página.<br>
      Si el problema continúa, contacta con el administrador.
    </div>`;
}

/* ── Globals used by mod.html ── */
if (typeof window !== 'undefined') {
  window.mod = {
    saveSnippetEdits,
    deleteSnippet,
    requireAuth,
    getSession,
    renderAuthNav,
    toggleFollowAuthor,
    getFollowedAuthors,
    showToast,
    formatDate,
    bytesToSize,
    escapeHtml,
    getProfileInitial,
    configNoticeHtml,
    getModeratorBadgeHtml,
    isModerator,
    getSessionEmail,
    DEFAULT_AUTHOR_NAME,
  };
}

/* ── Discovery+ helpers ── */
const DISCOVERY_PLUS_KEY = 'bd_discovery_plus';
const MAX_FREE_BYTES = 1 * 1024 * 1024;
const MAX_PRO_BYTES = 5 * 1024 * 1024;

function getDiscoveryPlusStatus() {
  try {
    const raw = localStorage.getItem(DISCOVERY_PLUS_KEY);
    if (!raw) return { active: false, expiresAt: null };
    const data = JSON.parse(raw);
    if (data && data.expiresAt && Date.now() > Number(data.expiresAt)) {
      localStorage.removeItem(DISCOVERY_PLUS_KEY);
      return { active: false, expiresAt: null };
    }
    return { active: !!data?.active, expiresAt: data?.expiresAt || null };
  } catch {
    return { active: false, expiresAt: null };
  }
}

function setDiscoveryPlusStatus(next) {
  try {
    localStorage.setItem(DISCOVERY_PLUS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}

function isDiscoveryPlus() {
  return getDiscoveryPlusStatus().active;
}

function getDiscoveryPlusBadgeHtml(session) {
  if (!isDiscoveryPlus()) return '';
  const display = session?.user?.user_metadata?.display_name || session?.user?.email?.split('@')[0] || '';
  return `<span class="discovery-badge" title="Discovery+">Discovery+ ${escapeHtml(display)}</span>`;
}

function getMaxUploadBytes(session) {
  return isDiscoveryPlus() ? MAX_PRO_BYTES : MAX_FREE_BYTES;
}

function getProfileDisplayNameWithPlus(base) {
  if (!base || base === DEFAULT_AUTHOR_NAME) return base;
  const clean = String(base).replace(/\s*Discovery\+\s*/i, '').trim();
  return isDiscoveryPlus() ? `${clean} Discovery+` : clean;
}
