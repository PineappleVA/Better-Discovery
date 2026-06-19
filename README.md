# Better Discovery 🚀

A community-driven HTML creation gallery hosted on **GitHub Pages** and powered by **Supabase**.

Upload up to **1 MB** of HTML code, let others view it live in a sandboxed preview, and interact through **likes** and **comments** — no programming knowledge needed to enjoy the creations.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📤 Upload HTML | Paste up to 1 MB of HTML and publish in one click |
| 🖥️ Live Preview | Sandboxed iframe runs the HTML exactly as intended |
| ❤️ Likes | One-click like system persisted to Supabase |
| 💬 Comments | Leave feedback and read others' thoughts |
| 🔍 Search | Instant search by title or description |
| 📄 Sort | Sort by newest or most liked |
| 📱 Responsive | Works on desktop and mobile |

## 📄 Pages

- **`index.html`** — Browse & discover all HTML creations
- **`upload.html`** — Upload a new HTML creation (up to 1 MB)
- **`view.html?id=…`** — View, like and comment on a specific creation
- **`about.html`** — Feature overview and full setup guide

---

## ⚙️ Setup

### 1 — Create a Supabase project

Sign up for free at [supabase.com](https://supabase.com) and create a new project.

### 2 — Run the SQL schema

In your Supabase dashboard → **SQL Editor → New query**, paste and run:

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

### 3 — Add your credentials

Open **`js/config.js`** and replace the placeholder values:

```js
const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';
```

Both values are found in **Project Settings → API** in your Supabase dashboard.

### 4 — Deploy to GitHub Pages

Push to GitHub, then go to **Settings → Pages**, set the source to your `main` branch (root folder) and save. The site will be live at `https://<username>.github.io/<repo>`.

---

## 🛠️ Tech Stack

- Pure HTML / CSS / JavaScript (no build step needed)
- [Supabase JS v2](https://supabase.com/docs/reference/javascript) via CDN
- GitHub Pages for free static hosting

## 🔒 Security

All uploaded HTML runs inside an `<iframe>` with a restricted `sandbox` attribute (`allow-scripts allow-forms allow-modals allow-popups`). Iframes run in a **null origin** — they cannot access the host page's cookies, localStorage, or DOM.

---

> See [about.html](about.html) for the interactive setup guide included in the site.
