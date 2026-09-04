/* ==========================================================================
   TVK website — main scripts
   Features: theme toggle, mobile nav, scroll spy, news feed (fetch + fallback),
   filters/search, animated counters, reveal-on-scroll, join form validation,
   FAQ accordion, back-to-top, toast notifications.
   ========================================================================== */
"use strict";

(function () {
  /* ------------------------------------------------------------------ *
   *  Embedded fallback data (used when data/news.json cannot be fetched)
   * ------------------------------------------------------------------ */
  const FALLBACK_NEWS = [
    {
      id: 1, date: "2026-08-05", category: "scheme", title: "Maiden TVK Budget: laptops, gold rings, wedding support & one lakh homes",
      excerpt: "The first Budget of the new government allocates ₹2,000 crore for college laptops, ₹812 crore for brides from low-income families and ₹560 crore for newborn gold rings. School education gets ₹44,527 crore.", url: "#updates"
    },
    {
      id: 2, date: "2026-06-06", category: "governance", title: "Vetri Thamizhagam — 436 schemes approved by the first Cabinet",
      excerpt: "The government's flagship roadmap converts election promises into 436 projects across 10 development pillars, with district-wise targets and timelines.", url: "#updates"
    },
    {
      id: 3, date: "2026-05-10", category: "election", title: "Historic oath: TVK government sworn in at Nehru Stadium, Chennai",
      excerpt: "Vijay takes oath as Chief Minister of Tamil Nadu after TVK's historic maiden victory — ending nearly six decades of alternating two-party rule.", url: "#updates"
    },
    {
      id: 4, date: "2026-05-04", category: "election", title: "TVK wins 108 seats — single-largest party in Tamil Nadu",
      excerpt: "In its first-ever Assembly election, TVK wins 108 of 234 seats. Vijay sweeps Perambur by over 53,000 votes and also wins Tiruchirappalli (East).", url: "#updates"
    },
    {
      id: 5, date: "2026-04-16", category: "party", title: "Ten Guarantees released: the manifesto for a victorious Tamil Nadu",
      excerpt: "TVK unveils its 2026 manifesto with ten guarantees — ₹2,500 monthly women's support, ₹25 lakh health cover, ₹20 lakh education loans, farmer loan waivers and more.", url: "#updates"
    },
    {
      id: 6, date: "2024-10-27", category: "party", title: "Vikravandi conference: 8 lakh cadres, one vision",
      excerpt: "At its first State conference, TVK unveils its ideology of secular social justice and declares it will contest all 234 seats in 2026.", url: "#updates"
    }
  ];

  /* ------------------------------------------------------------------ *
   *  Helpers
   * ------------------------------------------------------------------ */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* private mode */ } }
  };

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 4200);
  }

  /* ------------------------------------------------------------------ *
   *  Theme toggle (light / dark) — persists choice
   * ------------------------------------------------------------------ */
  const themeToggle = $("#theme-toggle");
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#140609" : "#8a0f1f");
  }
  (function initTheme() {
    const saved = store.get("tvk-theme", null);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
  })();
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      store.set("tvk-theme", next);
      toast(next === "dark" ? "Dark theme enabled 🌙" : "Light theme enabled ☀️");
    });
  }

  /* ------------------------------------------------------------------ *
   *  Mobile navigation
   * ------------------------------------------------------------------ */
  const navToggle = $("#nav-toggle");
  const mainNav = $("#main-nav");
  function closeNav() {
    if (!mainNav) return;
    mainNav.classList.remove("open");
    navToggle && navToggle.setAttribute("aria-expanded", "false");
  }
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", mainNav).forEach(a => a.addEventListener("click", closeNav));
    document.addEventListener("click", (e) => {
      if (mainNav.classList.contains("open") && !mainNav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
  }

  /* ------------------------------------------------------------------ *
   *  Header shadow + scroll spy + back-to-top
   * ------------------------------------------------------------------ */
  const header = $("#site-header");
  const backTop = $("#back-top");
  const sections = $$("main section[id]");
  const navLinks = $$("#nav-list a");

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    if (backTop) backTop.classList.toggle("visible", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-42% 0px -52% 0px" });
    sections.forEach(s => spy.observe(s));
  }

  if (backTop) backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ------------------------------------------------------------------ *
   *  Reveal on scroll
   * ------------------------------------------------------------------ */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => ro.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  /* ------------------------------------------------------------------ *
   *  Animated counters
   * ------------------------------------------------------------------ */
  const counters = $$(".counter");
  if (counters.length && "IntersectionObserver" in window) {
    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target || el.textContent, 10) || 0;
        const dur = 1400, start = performance.now();
        (function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(target * eased)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          if (p < 1) requestAnimationFrame(tick);
        })(start);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => countObs.observe(c));
  }

  /* ------------------------------------------------------------------ *
   *  News data loader (fetch → fallback)
   * ------------------------------------------------------------------ */
  let newsData = [];
  let activeFilter = "all";
  let searchTerm = "";

  async function loadNews() {
    try {
      const res = await fetch("data/news.json", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      const json = await res.json();
      newsData = Array.isArray(json) ? json : (json.news || []);
    } catch {
      newsData = FALLBACK_NEWS;
    }
    renderTicker();
    renderNews();
  }

  const CAT_META = {
    election:   { label: "Election",   grad: "linear-gradient(135deg,#8a0f1f,#c8102e)" },
    governance: { label: "Governance", grad: "linear-gradient(135deg,#6e0b14,#b8860b)" },
    scheme:     { label: "Schemes",    grad: "linear-gradient(135deg,#b8860b,#f5b301)" },
    party:      { label: "Party",      grad: "linear-gradient(135deg,#7a1120,#a8500a)" }
  };

  function fmtDate(iso) {
    try {
      return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch { return iso; }
  }

  function renderTicker() {
    const track = $("#ticker-track");
    if (!track || !newsData.length) return;
    const items = newsData.slice(0, 8).map(n =>
      `<a href="#updates">${n.title}</a>`
    ).join("");
    /* duplicate for seamless loop */
    track.innerHTML = items + items;
  }

  function renderNews() {
    const grid = $("#news-grid");
    if (!grid) return;
    const list = newsData.filter(n => {
      const catOk = activeFilter === "all" || n.category === activeFilter;
      const term = searchTerm.trim().toLowerCase();
      const searchOk = !term ||
        (n.title + " " + n.excerpt + " " + n.category).toLowerCase().includes(term);
      return catOk && searchOk;
    });

    if (!list.length) {
      grid.innerHTML = `<div class="news-empty">No updates match your search. Try a different keyword or category. 🔍</div>`;
      return;
    }

    grid.innerHTML = list.map((n, i) => {
      const meta = CAT_META[n.category] || CAT_META.party;
      return `
        <article class="news-card reveal in d${i % 3}" style="transition-delay:${(i % 3) * 0.08}s">
          <div class="news-thumb" style="background: ${meta.grad}">
            <span class="news-cat">${meta.label}</span>
          </div>
          <div class="news-body">
            <span class="news-date">🗓 ${fmtDate(n.date)}</span>
            <h3>${n.title}</h3>
            <p>${n.excerpt}</p>
            <a class="news-link" href="${n.url || "#updates"}">Read more</a>
          </div>
        </article>`;
    }).join("");
  }

  function bindNewsFilters() {
    $$(".chip[data-filter]").forEach(chip => {
      chip.addEventListener("click", () => {
        activeFilter = chip.dataset.filter;
        $$(".chip[data-filter]").forEach(c => c.classList.toggle("active", c === chip));
        renderNews();
      });
    });
    const input = $("#news-search");
    const btn = $("#news-search-btn");
    if (input) input.addEventListener("input", () => { searchTerm = input.value; renderNews(); });
    if (btn) btn.addEventListener("click", () => { searchTerm = input.value; renderNews(); });
    if (input) input.addEventListener("keydown", e => { if (e.key === "Enter") { searchTerm = input.value; renderNews(); } });
  }

  loadNews();
  bindNewsFilters();

  /* ------------------------------------------------------------------ *
   *  Join form — client-side validation + local persistence (demo)
   * ------------------------------------------------------------------ */
  const form = $("#join-form");
  const successBox = $("#form-success");
  const PHONE_RE = /^[+]?[0-9][0-9\s-]{8,14}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(id, msg) {
    const field = $("#" + id);
    const err = document.querySelector(`[data-error-for="${id}"]`);
    if (field) field.classList.toggle("invalid", Boolean(msg));
    if (err) err.textContent = msg || "";
  }

  function validate() {
    let ok = true;
    const name = $("#f-name"), phone = $("#f-phone"), email = $("#f-email"), district = $("#f-district");

    if (!name.value.trim() || name.value.trim().length < 2) { setError("f-name", "Please enter your full name."); ok = false; } else setError("f-name", "");
    if (!PHONE_RE.test(phone.value.trim().replace(/[^\d+]/g, ""))) { setError("f-phone", "Enter a valid 10-digit mobile number."); ok = false; } else setError("f-phone", "");
    if (!EMAIL_RE.test(email.value.trim())) { setError("f-email", "Enter a valid email address."); ok = false; } else setError("f-email", "");
    if (!district.value) { setError("f-district", "Please select your district."); ok = false; } else setError("f-district", "");

    return ok;
  }

  if (form) {
    ["f-name", "f-phone", "f-email", "f-district"].forEach(id => {
      const el = $("#" + id);
      if (el) el.addEventListener("input", () => setError(id, ""));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) {
        toast("Please correct the highlighted fields.");
        const firstInvalid = $(".invalid", form);
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /* Demo persistence — stores submissions locally on this device */
      const data = {
        name: $("#f-name").value.trim(),
        phone: $("#f-phone").value.trim(),
        email: $("#f-email").value.trim(),
        district: $("#f-district").value,
        interest: $("#f-interest").value,
        message: $("#f-msg").value.trim(),
        ts: new Date().toISOString()
      };
      const all = store.get("tvk-join-submissions", []);
      all.push(data);
      store.set("tvk-join-submissions", all);

      form.style.display = "none";
      successBox.classList.add("show");
      toast("Nandri! Your registration has been recorded. வெற்றி நமதே ✦");
    });

    const resetBtn = $("#form-reset");
    if (resetBtn) resetBtn.addEventListener("click", () => {
      form.reset();
      ["f-name", "f-phone", "f-email", "f-district"].forEach(id => setError(id, ""));
      form.style.display = "";
      successBox.classList.remove("show");
      window.scrollTo({ top: $("#join").offsetTop - 120, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------ *
   *  FAQ accordion
   * ------------------------------------------------------------------ */
  $$(".faq-item").forEach(item => {
    const btn = $(".faq-q", item);
    const panel = $(".faq-a", item);
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      $$(".faq-item.open").forEach(o => {
        o.classList.remove("open");
        $(".faq-q", o).setAttribute("aria-expanded", "false");
        $(".faq-a", o).style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ------------------------------------------------------------------ *
   *  Footer year
   * ------------------------------------------------------------------ */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
