# TechKnoGeeks — Astro site (migrated off Zoho Sites)

This is the TechKnoGeeks website rebuilt as an **Astro** static site so it can be
hosted anywhere (Netlify) with full control over code — the flexibility Zoho Sites
didn't allow. The design, content, and images are identical to the Zoho export; the
difference is that the repeated header/footer/nav are now **single reusable
components** instead of being copy-pasted into every page.

## Quick start

```bash
npm install      # one-time
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into ./dist
npm run preview  # serve the built ./dist locally
```

## Project structure

```
site/
├─ public/                 # all static assets, served at the site root
│  ├─ css/ js/ template/   # the Zoho theme's CSS + JS (powers menus, carousels, tabs)
│  ├─ images/ files/       # all images
│  └─ favicon.png, ...
├─ src/
│  ├─ layouts/Layout.astro       # master page shell (head + header + content + footer)
│  ├─ components/Header.astro     # 👈 EDIT THIS ONCE to change the header on every page
│  ├─ components/Footer.astro     # 👈 EDIT THIS ONCE to change the footer on every page
│  ├─ pages/                      # one .astro file per page → one URL
│  │  ├─ index.astro              # /
│  │  ├─ services.astro           # /services
│  │  └─ ...
│  └─ generated/                  # raw HTML fragments for each page's <head> and body
├─ astro.config.mjs
├─ netlify.toml            # Netlify build + redirect config
└─ package.json
```

## How to make common edits

- **Change the nav / logo / header:** edit `src/components/Header.astro`
  (its markup lives in `src/generated/header.html`). Applies to all 13 pages at once.
- **Change the footer / social links / WhatsApp number:** edit `src/components/Footer.astro`
  (markup in `src/generated/footer.html`).
- **Edit a page's content:** edit that page's file in `src/generated/<page>.content.html`.
- **Add a new page:** copy an existing file in `src/pages/`, point it at new
  `generated/*.head.html` + `*.content.html` fragments, and it's live at `/<filename>`.
- **Add custom code (analytics, scripts, meta):** put it in `src/layouts/Layout.astro`
  or the relevant page's `*.head.html` — things Zoho Sites blocked.

## What still points at Zoho (kept intentionally)

These are third-party embeds you asked to keep — they work from any host:

- **Contact form** — Zoho Forms iframe on `/contact`.
- **Live chat** — Zoho SalesIQ widget on every page.
- **Web fonts** — loaded from `webfonts.zoho.in`.
- **PageSense analytics** — Zoho's analytics snippet in the page head.

A harmless `404 /portaluser/getCurrentPortalUser` request comes from the Zoho theme
JS (a members/login feature we don't use). It doesn't affect the site and can be
removed later by trimming `public/js/zsite-core.js` calls.

## Deploy to Netlify

1. Push this `site/` folder to a Git repo (GitHub/GitLab).
2. In Netlify: **Add new site → Import from Git** → pick the repo.
3. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. Then add your custom domain `www.techknogeeks.com` in
   **Site settings → Domain management** and point DNS at Netlify.

Alternatively, drag-and-drop the `dist/` folder onto Netlify for a one-off manual deploy.
