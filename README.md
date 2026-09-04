# தமிழக வெற்றி கழகம் — TVK Supporters Website

A fully functional, responsive, **TVK-themed** (maroon red & golden yellow) political website
built as a GitHub learning project. It showcases the movement's story, ideology, agenda,
leadership and latest updates, with working forms, news filtering and a dark/light theme.

> ⚠️ **Disclaimer:** This is an unofficial, supporter-built demonstration website. It is **not**
> affiliated with, endorsed by, or connected to Tamilaga Vettri Kazhagam (TVK), its leadership,
> or the Election Commission of India. Information is compiled from public sources. All imagery
> is original illustrative artwork inspired by publicly described elements of the flag.

---

## ✨ Features

- **TVK theme** — maroon/gold tricolor palette, Vaagai-flower emblem, Tamil typography
- **Fully responsive** — mobile-first layout with hamburger menu (works on phone/tablet/desktop)
- **Sticky header + live news ticker**
- **Hero section** with animated counters (seats won, schemes, guarantees, districts)
- **History timeline** — from the party's launch (Feb 2024) to government formation (May 2026)
- **Ten Guarantees agenda** — the 2026 manifesto, now in implementation
- **News & Updates** — loaded from `data/news.json`, with **category filters + live search**
- **Working registration form** — validated, with success confirmation (demo persistence)
- **Dark / light theme toggle** — remembers your choice
- **FAQ accordion, back-to-top button, toast notifications, scroll-reveal animations**
- **SEO ready** — meta/OG tags, structured data (JSON-LD), sitemap, robots.txt
- **Accessibility** — skip link, ARIA labels, keyboard-friendly, reduced-motion support
- **GitHub Pages ready** — static site, no build step needed

## 📁 Project structure

```
karuppusamy/
├── index.html            # Main one-page website
├── css/styles.css        # TVK theme stylesheet (design tokens, light/dark)
├── js/main.js            # All interactivity (theme, nav, news, forms, FAQ…)
├── data/news.json        # 📰 Edit this to update the news feed
├── assets/images/        # Original artwork (OG/hero banner)
├── manifest.webmanifest  # PWA-style manifest
├── 404.html              # Custom error page
├── robots.txt            # Crawler rules
├── sitemap.xml           # SEO sitemap
└── .nojekyll             # Ensures GitHub Pages serves files as-is
```

## 🚀 Run locally

Option A — just open `index.html` in your browser.

Option B — serve with a local server (recommended, enables JSON loading):

```bash
# Python
python3 -m http.server 8080
# then visit http://localhost:8080
```

## 📤 Publish to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch (or your branch) and the `/ (root)` folder.
5. Save — the site will appear at `https://<your-username>.github.io/karuppusamy/`.

> `.nojekyll` is included so GitHub Pages serves the site without Jekyll processing.

## 🗞️ Updating news

Edit `data/news.json`. Each item supports:

```json
{
  "id": 10,
  "date": "2026-09-15",
  "category": "governance",
  "title": "Headline here",
  "excerpt": "Short summary shown on the card.",
  "url": "#updates"
}
```

Categories: `election`, `governance`, `scheme`, `party`.

## 🎨 Customising the theme

All colors live in `css/styles.css` as CSS custom properties under `:root`
(light) and `[data-theme="dark"]` (dark):

```css
--tvk-red: #c8102e;        /* party red */
--tvk-gold: #f5b301;       /* golden yellow */
--tvk-maroon: #6e0b14;     /* deep maroon */
```

## © Credits & sources

- Wikipedia — [Tamilaga Vettri Kazhagam](https://en.wikipedia.org/wiki/Tamilaga_Vettri_Kazhagam)
- Public news reports on the 2026 Tamil Nadu Assembly election and TVK government

Built for learning GitHub, HTML, CSS and JavaScript. வெற்றி நமதே ✦
