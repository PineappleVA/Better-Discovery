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

## 🔐 Acceso

Usa `login.html` para entrar con tu cuenta y navegar por el sitio.

## 📄 Páginas

- **`login.html`** — Pantalla de acceso
- **`index.html`** — Explora y descubre creaciones
- **`upload.html`** — Sube una nueva creación HTML
- **`view.html?id=…`** — Visualiza, da like y comenta una creación
- **`about.html`** — Resumen del proyecto

---

## 🛠️ Stack técnico

- HTML / CSS / JavaScript puro (sin paso de build)
- [Supabase JS v2](https://supabase.com/docs/reference/javascript) via CDN
- GitHub Pages para hosting estático gratuito

## 🔒 Seguridad

Todo el HTML subido se ejecuta dentro de un `<iframe>` aislado con `sandbox` restringido.

---

> Consulta [about.html](about.html) para ver el resumen del sitio.
