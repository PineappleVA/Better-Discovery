// ============================================================
// Better Discovery – Shared App Utilities
// ============================================================

/* ── Supabase client ── */
let supabaseClient = null;

if (IS_CONFIGURED) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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

  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d <  7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
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
      <strong>⚙️ Supabase setup required</strong><br><br>
      Open <code>js/config.js</code> and replace the placeholder values with your
      Supabase Project URL and anon key.<br>
      Need help? Visit the <a href="about.html" style="color:var(--accent)">About&nbsp;/ Setup</a> page.
    </div>`;
}
