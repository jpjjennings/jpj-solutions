# JPJ Solutions — Portfolio Website

A modern, fast, and fully responsive portfolio website for **JPJ Solutions**, an
AI-powered web design business. Built as a clean, self-contained
**HTML / CSS / JavaScript** site — no frameworks, no build step, no
dependencies. Just open `index.html` and it runs.

> **Tagline:** _Modern Websites. Built Smarter with AI._

---

## ✨ Features

- **Animated hero** with a lightweight, dependency-free canvas particle system
  and a cycling typewriter effect.
- **Dark / light mode** toggle that remembers the visitor's choice
  (`localStorage`).
- **Sticky glass-morphism navbar** with smooth scrolling and active-link
  highlighting on scroll.
- **Scroll-triggered reveal animations** via `IntersectionObserver`.
- **Filterable portfolio grid** with an accessible, focus-trapped
  modal / lightbox for each project.
- **Auto-scrolling testimonials carousel** with prev/next controls and dots
  (pauses on hover/focus).
- **Visual process timeline** and a **validated contact form**.
- **Accessible & SEO-ready**: semantic HTML5, ARIA attributes, skip-to-content
  link, keyboard navigation, descriptive alt text, meta + Open Graph tags.
- **Respects `prefers-reduced-motion`** throughout.

---

## 📁 Project Structure

```
jpj-solutions/
├── index.html          # All page sections in one file
├── css/
│   └── style.css       # All styles, organised with CSS custom properties
├── js/
│   └── main.js         # All interactivity (particles, typewriter, modal, etc.)
├── images/
│   └── README.md       # Notes on image assets & how to swap them
└── README.md           # You are here
```

---

## 🚀 Getting Started

No build tools required.

**Option A — open directly:** double-click `index.html`.

**Option B — run a local server** (recommended, avoids any browser file
restrictions):

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## 🎨 How to Update the Colours (Theming)

All colours are defined as **CSS custom properties** at the top of
`css/style.css` inside the `:root` block. Change them in one place and the whole
site updates.

```css
:root {
  --color-accent:       #10b981;  /* primary emerald green */
  --color-accent-light: #34d399;  /* hover / highlight */
  --color-accent-dark:  #059669;  /* gradients / pressed */

  /* Dark theme (default) */
  --color-bg:      #0a0f1e;
  --color-surface: #111827;
  --color-text:    #f1f5f9;
}
```

Light-mode colours live in the `[data-theme="light"] { ... }` block just below
`:root` — override the same variable names there.

To change the **default** theme, edit `<html lang="en" data-theme="dark">` in
`index.html` (`dark` or `light`).

---

## 🖼️ How to Add / Edit Portfolio Items

Each project is a `.project-card` `<article>` inside
`<div class="work-grid">` in `index.html`. The card's data is stored in
`data-*` attributes, which the JavaScript reads to build the modal.

```html
<article class="project-card reveal"
         data-tags="e-commerce ui-ux"                <!-- space-separated filter tags -->
         data-title="ShopEase"
         data-category="E-commerce Store"
         data-image="https://aayurtshrestha.com.np/admin/media/shopEase.jpeg"    <!-- large image for modal -->
         data-stack="Shopify, JavaScript, Payments"   <!-- comma-separated chips -->
         data-desc="Full project description shown in the modal.">
  <img class="project-img" src="https://i.pinimg.com/736x/98/f3/e7/98f3e765fa3a1b310dfcebba29753c57.jpg" alt="Describe the image" loading="lazy" width="600" height="400" />
  <div class="project-overlay">
    <div class="project-tags"><span>E-commerce</span><span>UI/UX</span></div>
    <h3 class="project-title">ShopEase</h3>
    <p class="project-cat">E-commerce Store</p>
    <p class="project-hover-desc">Short hover blurb.</p>
    <button class="btn btn-sm btn-primary project-open">View Project</button>
  </div>
</article>
```

**Filter tags** must match the `data-filter` values on the filter buttons:
`website-design`, `landing-page`, `ui-ux`, `e-commerce`, `bespoke`.
To add a new filter, add a `<button class="filter-btn" data-filter="your-tag">`
inside `.filters`, then use `your-tag` in a card's `data-tags`.

---

## ✉️ How to Update Contact Details

In `index.html`, in the **Contact** section (`<section id="contact">`):

- **Email** — search for `hello@jpjsolutions.com` and update the `mailto:` link
  and visible text.
- **Social links** — update the three `href="#"` values on the `.social` links
  (LinkedIn, GitHub, Twitter/X).
- **Form submission** — the `<form id="contactForm" action="#">` is validated
  client-side only. Connect it to a real backend or a form service (e.g.
  Formspree, Netlify Forms) by updating the `action` attribute and/or the
  `initContactForm()` handler in `js/main.js`.

Every placeholder is marked with an `<!-- REPLACE: ... -->` comment — search the
codebase for `REPLACE` to find them all quickly.

---

## 🔄 How to Swap Placeholder Images

The site currently uses remote Unsplash images. To use your own, see
[`images/README.md`](images/README.md). In short: add your file to `images/`,
then update both the `src` (thumbnail) and `data-image` (modal) attributes on
the relevant card, plus the `alt` text.

Also update the social share image: the Open Graph / Twitter `og:image` /
`twitter:image` meta tags in `<head>` point to `images/og-preview.jpg`.

---

## 🌐 Deployment Notes

Because this is a static site, it can be hosted anywhere that serves files:

- **GitHub Pages** — push to a repo, then enable Pages in
  *Settings → Pages* and select the branch (root). Your site publishes at
  `https://<user>.github.io/<repo>/`.
- **Netlify** — drag-and-drop the folder, or connect the repo. No build command
  needed; publish directory is the project root.
- **Vercel** — import the repo; it deploys the static files as-is.
- **Any web host** — upload the files to your web root via FTP/SFTP.

**Before going live**, remember to:

1. Update the canonical URL and Open Graph URLs/images in `<head>`.
2. Replace all `<!-- REPLACE -->` placeholders (email, social links, live
   project URLs, form backend).
3. Add your own optimised images and a real `og-preview.jpg`.

---

## ♿ Accessibility & SEO

- Semantic landmarks (`header`, `main`, `section`, `footer`) and heading order.
- Skip-to-content link, keyboard-operable menu, carousel, filters, and modal.
- Modal uses `role="dialog"`, `aria-modal="true"`, focus trap, and ESC to close.
- All images have descriptive `alt` text; form inputs have `<label>`s.
- SEO meta description, title, Open Graph, and Twitter Card tags included.

---

## 📄 License

© JPJ Solutions. All rights reserved. This code is provided for the JPJ
Solutions website — adapt freely for your own use.
