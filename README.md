# Better Discovery 🚀

Una galería comunitaria de creaciones HTML alojada en **GitHub Pages** y conectada a **Supabase**.

Sube hasta **1 MB** de código HTML para que otras personas lo vean en una vista previa con sandbox y puedan interactuar con **likes** y **comentarios**.

---

## ✨ Funciones

| Función | Descripción |
|---|---|
| 📤 Subir HTML | Pega hasta 1 MB de HTML y publícalo con un clic |
| 🖥️ Vista previa en vivo | Un iframe con sandbox ejecuta el HTML de forma segura |
| ❤️ Me gusta | Sistema de likes persistido en Supabase |
| 💬 Comentarios | Deja feedback y lee opiniones de otras personas |
| 🔍 Búsqueda | Búsqueda instantánea por título o descripción |
| 📄 Ordenado | Ordena por más recientes o más valorados |
| 📱 Responsive | Funciona en escritorio y móvil |

## 📄 Páginas

- **`index.html`** — Explora y descubre todas las creaciones HTML
- **`upload.html`** — Sube una nueva creación HTML (hasta 1 MB)
- **`view.html?id=…`** — Visualiza, da like y comenta una creación específica
- **`about.html`** — Resumen de funciones y guía completa de configuración

---

## ⚙️ Configuración

### 1 — Crea un proyecto en Supabase

Regístrate gratis en [supabase.com](https://supabase.com) y crea un proyecto nuevo.

### 2 — Ejecuta el esquema SQL

En el panel de Supabase → **SQL Editor → New query**, pega y ejecuta:

```sql
CREATE TABLE IF NOT EXISTS snippets (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT        NOT NULL,
  description  TEXT        NOT NULL DEFAULT '',
  html_content TEXT        NOT NULL,
  author       TEXT        NOT NULL DEFAULT 'Anonymous',
  tag          TEXT,
  likes        INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  snippet_id  UUID        NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  author      TEXT        NOT NULL DEFAULT 'Anonymous',
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read snippets"   ON snippets FOR SELECT USING (true);
CREATE POLICY "Public insert snippets" ON snippets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update likes"    ON snippets FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read comments"   ON comments FOR SELECT USING (true);
CREATE POLICY "Public insert comments" ON comments FOR INSERT WITH CHECK (true);
```

### 3 — Añade tus credenciales

Abre **`js/config.js`** y reemplaza los valores de ejemplo:

```js
const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';
```

Ambos valores están en **Project Settings → API** dentro de Supabase.

### 4 — Despliega en GitHub Pages

Haz push a GitHub y luego ve a **Settings → Pages**, define como origen la rama `main` (carpeta raíz) y guarda. El sitio quedará activo en `https://<usuario>.github.io/<repo>`.

---

## 🛠️ Stack técnico

- HTML / CSS / JavaScript puro (sin paso de build)
- [Supabase JS v2](https://supabase.com/docs/reference/javascript) via CDN
- GitHub Pages para hosting estático gratuito

## 🔒 Seguridad

Todo el HTML subido se ejecuta dentro de un `<iframe>` con atributo `sandbox` restringido (`allow-scripts allow-forms allow-modals allow-popups`). Los iframes corren en **origen nulo** y no pueden acceder a cookies, localStorage ni DOM de la página principal.

---

> Consulta [about.html](about.html) para la guía interactiva de configuración incluida en el sitio.
