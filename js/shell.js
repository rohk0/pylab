// ============================================================
// App shell — titlebar, activity bar, sidebar, status bar,
// command palette, theme toggle. Mounted into <body> on every page.
// ============================================================

const ASSET_VERSION = "v=6";
const assetUrl = (path) => `${path}?${ASSET_VERSION}`;

const NAV = [
  { id: "dashboard",  href: "dashboard.html",  label: "Dashboard",  icon: iconHome,    activity: true },
  { id: "lessons",    href: "lessons.html",    label: "Lessons",    icon: iconBook,    activity: true },
  { id: "challenges", href: "challenges.html", label: "Challenges", icon: iconFlag,    activity: true },
  { id: "playground", href: "playground.html", label: "Playground", icon: iconTerm,    activity: true },
  { id: "chat",       href: "chat.html",       label: "AI Tutor",   icon: iconChat,    activity: true },
  { id: "practice",   href: "practice.html",   label: "Daily",      icon: iconSpark,   activity: true },
  { id: "quizzes",    href: "quizzes.html",    label: "Quizzes",    icon: iconCheck,   activity: true },
  { id: "flashcards", href: "flashcards.html", label: "Flashcards", icon: iconLayers,  activity: true },
  { id: "projects",   href: "projects.html",   label: "Projects",   icon: iconBox,     activity: true },
  { id: "skills",     href: "skills.html",     label: "Skill Tree", icon: iconTree,    activity: true },
  { id: "reference",  href: "reference.html",  label: "Reference",  icon: iconBookOpen,activity: true },
  { id: "errors",     href: "errors.html",     label: "Errors",     icon: iconBug,     activity: true },
  { id: "notes",      href: "notes.html",      label: "Notes",      icon: iconNote,    activity: true },
];

function iconHome()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>`; }
function iconBook()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-3a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h4z"/></svg>`; }
function iconFlag()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 21V4m0 0h12l-2 4 2 4H5"/></svg>`; }
function iconTerm()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 4 3-4 3M13 15h5"/></svg>`; }
function iconCheck()   { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`; }
function iconLayers()  { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5M3 18l9 5 9-5"/></svg>`; }
function iconBox()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m12 2 9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg>`; }
function iconTree()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M6 8.5v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3M12 13.5v2"/></svg>`; }
function iconBookOpen(){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 5h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H2zM22 5h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7z"/></svg>`; }
function iconNote()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9zM14 3v6h7"/></svg>`; }
function iconChat()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12a8 8 0 0 1-12 7l-5 1 1.3-4.4A8 8 0 1 1 21 12z"/><path d="M9 11h.01M13 11h.01M17 11h.01"/></svg>`; }
function iconSpark()   { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/></svg>`; }
function iconBug()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 8h8M8 8a4 4 0 1 1 8 0M9 8v8a3 3 0 0 0 6 0V8M5 12h3m8 0h3M5 16h3m8 0h3M5 8h3m8 0h3"/></svg>`; }

function userTrigger() {
  if (typeof Auth === "undefined") return "";
  const me = Auth.current();
  if (!me) {
    return `<a href="login.html?next=${encodeURIComponent(location.pathname + location.search)}" class="btn ghost" id="sign-in-btn" style="padding:2px 10px;font-size:11.5px;">Sign in</a>`;
  }
  return `
    <button class="user-trigger" id="user-trigger" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu"
      style="background:transparent;border:1px solid var(--border);padding:2px;border-radius:50%;cursor:pointer;display:flex;">
      ${Auth.avatarHTML(me, 26)}
    </button>
  `;
}

function bindUserMenu() {
  if (typeof Auth === "undefined") return;
  const trigger = document.getElementById("user-trigger");
  if (!trigger) return;
  trigger.onclick = (e) => {
    e.stopPropagation();
    document.querySelectorAll(".user-menu").forEach(n => n.remove());
    const me = Auth.current();
    const r = trigger.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.className = "user-menu";
    menu.setAttribute("role", "menu");
    menu.style.cssText = `
      position:fixed; z-index:200;
      right:${window.innerWidth - r.right}px; top:${r.bottom + 6}px;
      background:var(--bg-elev); border:1px solid var(--border-strong);
      border-radius:6px; min-width:240px; padding:4px;
      box-shadow:0 8px 24px rgba(0,0,0,0.4);
    `;
    menu.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--border);">
        ${Auth.avatarHTML(me, 36)}
        <div style="min-width:0;flex:1;">
          <div style="color:var(--fg-strong);font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(me.name)}</div>
          <div style="color:var(--fg-dim);font-size:11px;font-family:var(--font-mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(me.email)}</div>
        </div>
      </div>
      <a href="login.html" class="user-menu-item" role="menuitem">Account</a>
      <a href="settings.html" class="user-menu-item" role="menuitem">Settings</a>
      <div style="height:1px;background:var(--border);margin:4px 0;"></div>
      <button class="user-menu-item" role="menuitem" id="um-signout"
        style="width:100%;text-align:left;background:transparent;border:0;color:var(--red);font:inherit;cursor:pointer;">Sign out</button>
    `;
    document.body.appendChild(menu);
    trigger.setAttribute("aria-expanded", "true");
    menu.querySelectorAll(".user-menu-item").forEach(it => {
      it.style.cssText += "display:block;padding:8px 12px;color:var(--fg);text-decoration:none;font-size:12.5px;border-radius:4px;";
      it.onmouseenter = () => it.style.background = "var(--bg-hover)";
      it.onmouseleave = () => it.style.background = "";
    });
    document.getElementById("um-signout").onclick = () => {
      menu.remove();
      if (confirm("Sign out of this browser?")) { Auth.signOut(); location.reload(); }
    };
    function close() {
      menu.remove();
      trigger.setAttribute("aria-expanded", "false");
      document.removeEventListener("click", close);
    }
    setTimeout(() => document.addEventListener("click", close), 0);
  };
}
function iconSettings(){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`; }
function iconTheme()   { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`; }

function buildShell(activeId) {
  // Ensure AI stylesheet is loaded.
  if (!document.querySelector('link[href^="css/ai.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = assetUrl("css/ai.css");
    document.head.appendChild(link);
  }

  const aiReady = typeof AI !== "undefined" && AI.available();

  // Ensure polish.css is loaded.
  if (!document.querySelector('link[href^="css/polish.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = assetUrl("css/polish.css");
    document.head.appendChild(link);
  }

  const root = document.body;
  root.innerHTML = `
    <a href="#main" class="skip-link">Skip to content</a>
    <div class="app" id="app-root">
      <div class="scrim" aria-hidden="true"></div>
      <header class="titlebar" role="banner">
        <button class="hamburger" id="hamburger" aria-label="Toggle navigation" aria-expanded="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <a href="dashboard.html" class="brand" aria-label="pylab home" style="text-decoration:none;color:inherit;">
          <img src="icons/logo.png" alt="" class="logo-img" width="22" height="22"
               style="display:block;border-radius:5px;object-fit:cover;" />
          <div class="brand-name"><b>pylab</b> · learn</div>
        </a>
        <button class="cmd" id="cmd-open" aria-label="Open command palette">
          <span>Search lessons, challenges, ask the AI…</span>
          <kbd>Ctrl K</kbd>
        </button>
        <div class="user">
          ${typeof LANGUAGES !== "undefined" ? `
            <select id="tb-lang" title="Active language" style="background:var(--bg-elev);border:1px solid var(--border);color:var(--fg-strong);font-family:var(--font-mono);font-size:11px;padding:2px 6px;border-radius:3px;">
              ${LANGUAGES.map(L => `<option value="${L.id}" ${activeLanguage().id === L.id ? "selected" : ""}>${L.name}</option>`).join("")}
            </select>
          ` : ""}
          <a href="settings.html#ai" class="ai-badge" title="AI status">
            <span style="width:6px;height:6px;border-radius:50%;background:${aiReady ? "var(--green)" : "var(--fg-mute)"};display:inline-block;"></span>
            ${aiReady ? "AI on" : "AI off"}
          </a>
          <div class="streak" title="Daily streak">${State.data.streak}d</div>
          <div class="xp-pill" id="xp-pill" title="XP / Level"><span class="dot"></span><span>Lv ${State.data.level}</span><span style="color:var(--fg-mute)">·</span><span id="xp-num">${State.data.xp} XP</span></div>
          ${userTrigger()}
        </div>
      </header>

      <nav class="activity" aria-label="Primary navigation">
        ${NAV.filter(n => n.activity).map(n => `
          <a class="ico ${n.id === activeId ? "active" : ""}" href="${n.href}" aria-label="${n.label}" ${n.id === activeId ? 'aria-current="page"' : ""}>
            ${n.icon()}
            <span class="tip">${n.label}</span>
          </a>
        `).join("")}
        <div class="spacer"></div>
        <button class="ico" id="toggle-theme" aria-label="Toggle theme">${iconTheme()}<span class="tip">Theme</span></button>
        <a class="ico" href="settings.html" aria-label="Settings">${iconSettings()}<span class="tip">Settings</span></a>
      </nav>

      <aside class="sidebar" id="sidebar" aria-label="Section navigation"></aside>

      <main class="main" id="main" tabindex="-1"></main>

      <footer class="statusbar" role="contentinfo">
        <div class="runtime" id="runtime-status" title="Python runtime">
          <div class="dot"></div><span>Python ready</span>
        </div>
        <div class="sep"></div>
        <div>Lv ${State.data.level}</div>
        <div class="sep"></div>
        <div>${State.data.xp} XP</div>
        <div class="sep"></div>
        <div>${Object.keys(State.data.completedLessons).length} lessons</div>
        <div class="sep"></div>
        <div>${Object.keys(State.data.completedChallenges).length} challenges</div>
        <div style="flex:1"></div>
        <div>UTF-8</div>
        <div class="sep"></div>
        <div>Spaces: ${State.data.settings.tabSize}</div>
        <div class="sep"></div>
        <div>Python 3.11</div>
      </footer>
    </div>
  `;

  document.getElementById("toggle-theme").onclick = () => {
    const next = State.data.settings.theme === "dark" ? "light" : "dark";
    State.data.settings.theme = next;
    document.documentElement.setAttribute("data-theme", next);
    State.save();
  };

  document.getElementById("cmd-open").onclick = openCommandPalette;
  const tbLang = document.getElementById("tb-lang");
  if (tbLang) tbLang.onchange = e => {
    setActiveLanguage(e.target.value);
    // Trigger a soft reload of the current page to pick up the new lang context.
    location.reload();
  };

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCommandPalette();
    }
    if (e.key === "Escape") {
      const app = document.getElementById("app-root");
      if (app && app.classList.contains("drawer-open")) closeDrawer();
    }
  });

  // Mobile drawer
  const ham = document.getElementById("hamburger");
  const scrim = document.querySelector(".scrim");
  function openDrawer() {
    document.getElementById("app-root").classList.add("drawer-open");
    ham.setAttribute("aria-expanded", "true");
  }
  function closeDrawer() {
    document.getElementById("app-root").classList.remove("drawer-open");
    ham.setAttribute("aria-expanded", "false");
  }
  ham.onclick = () => {
    const open = document.getElementById("app-root").classList.contains("drawer-open");
    open ? closeDrawer() : openDrawer();
  };
  scrim.onclick = closeDrawer;
  // Close drawer when navigating via sidebar item on mobile
  document.getElementById("sidebar").addEventListener("click", e => {
    if (window.innerWidth <= 720 && e.target.closest("a")) closeDrawer();
  });

  bindUserMenu();

  // Auto-open the sign-in modal on first arrival per session.
  if (typeof SignInModal !== "undefined") SignInModal.maybeAutoOpen();

  // Repaint the titlebar user area when auth changes (e.g. sign in/out
  // in another tab — storage event — or by direct dispatch).
  // Reload management — guarded two ways:
  //   1. State guard: only react to actual signed in <-> signed out transitions.
  //   2. Time guard: never auto-reload within the first 2s of a page load.
  //      This is a circuit breaker — no matter what triggers it, the page
  //      can't loop faster than once every 2 seconds.
  const _pageLoadAt = Date.now();
  const _initialAuthed = !!(typeof Auth !== "undefined" && Auth.current());
  function safeAutoReload() {
    if (Date.now() - _pageLoadAt < 2000) {
      console.warn("[shell] Suppressed auto-reload (within 2s of page load).");
      return;
    }
    location.reload();
  }
  window.addEventListener("pylab:auth-change", (e) => {
    const nowAuthed = !!e.detail;
    if (nowAuthed === _initialAuthed) return;
    safeAutoReload();
  });
  window.addEventListener("storage", e => {
    if (e.key !== "pylab.auth.v1") return;
    let nowAuthed = false;
    try { nowAuthed = !!(e.newValue && JSON.parse(e.newValue)); } catch {}
    if (nowAuthed === _initialAuthed) return;
    safeAutoReload();
  });

  // First-run onboarding (once per browser)
  maybeShowOnboarding(activeId);
}

function maybeShowOnboarding(activeId) {
  if (localStorage.getItem("pylab.onboarded.v1") === "1") return;
  if (activeId !== "dashboard") return; // only on the dashboard
  const ov = document.createElement("div");
  ov.className = "onboarding";
  ov.setAttribute("role", "dialog");
  ov.setAttribute("aria-modal", "true");
  ov.innerHTML = `
    <div class="card">
      <h2><span style="font-family:var(--font-mono);color:var(--accent);">›</span> Welcome to pylab</h2>
      <p style="font-size:13px;color:var(--fg);">A workbench for learning real code in the browser. A few things worth knowing:</p>
      <ul>
        <li><span class="ic">1</span><span><b>Lessons</b> are typed exercises — you write the code, the platform checks it. Every visit shows a fresh AI-authored variant on the same topic.</span></li>
        <li><span class="ic">2</span><span><b>9 languages</b> work out of the box: Python runs natively (Pyodide), JS/HTML/CSS execute live, Java/C/C++/SQL are simulated by AI.</span></li>
        <li><span class="ic">3</span><span><b>AI tutor</b> is everywhere — ask for hints, code review, debugging, or open the dedicated <a href="chat.html">tutor chat</a>.</span></li>
        <li><span class="ic">4</span><span><b>⌘K</b> opens the command palette. Anything you might want is one fuzzy search away.</span></li>
      </ul>
      <div class="actions">
        <button class="btn" id="ob-skip">Skip</button>
        <button class="btn primary" id="ob-go">Got it</button>
      </div>
    </div>
  `;
  document.body.appendChild(ov);
  const dismiss = () => { localStorage.setItem("pylab.onboarded.v1", "1"); ov.remove(); };
  ov.querySelector("#ob-skip").onclick = dismiss;
  ov.querySelector("#ob-go").onclick = dismiss;
  ov.addEventListener("click", e => { if (e.target === ov) dismiss(); });
  document.addEventListener("keydown", function onEsc(e) {
    if (e.key === "Escape") { dismiss(); document.removeEventListener("keydown", onEsc); }
  });
  setTimeout(() => ov.querySelector("#ob-go")?.focus(), 50);
}

// ----- Command palette -----
function buildPaletteIndex() {
  const idx = [];
  NAV.forEach(n => idx.push({ what: n.label, where: n.href, type: "Nav" }));
  // AI quick actions
  idx.push({ what: "Ask AI tutor",            where: "chat.html",     type: "AI" });
  idx.push({ what: "Daily practice",          where: "practice.html", type: "AI" });
  idx.push({ what: "Explain my code",         where: "explain.html",  type: "AI" });
  idx.push({ what: "Python error dictionary", where: "errors.html",   type: "AI" });
  idx.push({ what: "AI settings",             where: "settings.html#ai", type: "Settings" });
  if (window.LESSONS) {
    LESSONS.forEach(u => u.lessons.forEach(l => idx.push({
      what: l.title, where: `lesson.html?id=${l.id}`, type: `Lesson · ${u.title}`
    })));
  }
  if (window.CHALLENGES) {
    CHALLENGES.forEach(c => idx.push({
      what: c.title, where: `challenge.html?id=${c.id}`, type: `Challenge · ${c.difficulty}`
    }));
  }
  if (window.REFERENCE) {
    REFERENCE.forEach(r => idx.push({
      what: r.title, where: `reference.html#${r.id}`, type: `Reference · ${r.category}`
    }));
  }
  if (window.PROJECTS) {
    PROJECTS.forEach(p => idx.push({
      what: p.title, where: `projects.html#${p.id}`, type: `Project · ${p.difficulty}`
    }));
  }
  return idx;
}

function openCommandPalette() {
  const existing = document.getElementById("palette");
  if (existing) { existing.remove(); return; }

  const idx = buildPaletteIndex();
  let sel = 0;
  let filtered = idx.slice();

  const root = document.createElement("div");
  root.className = "modal-backdrop";
  root.id = "palette";
  root.innerHTML = `
    <div class="modal" role="dialog">
      <input class="palette-input" placeholder="Go to lesson, challenge, reference…" autofocus />
      <div class="palette-list"></div>
    </div>
  `;
  document.body.appendChild(root);

  const input = root.querySelector(".palette-input");
  const list = root.querySelector(".palette-list");

  function render() {
    list.innerHTML = filtered.slice(0, 60).map((r, i) => `
      <div class="palette-item ${i === sel ? "sel" : ""}" data-i="${i}">
        <span class="what">${escapeHTML(r.what)}</span>
        <span class="where">${escapeHTML(r.type)}</span>
      </div>
    `).join("") || `<div style="padding:14px;color:var(--fg-mute);font-size:12px;">No results.</div>`;
    list.querySelectorAll(".palette-item").forEach(el => {
      el.onclick = () => { location.href = filtered[+el.dataset.i].where; };
    });
  }

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    filtered = q
      ? idx.filter(r => r.what.toLowerCase().includes(q) || r.type.toLowerCase().includes(q))
      : idx.slice();
    sel = 0; render();
  });
  input.addEventListener("keydown", e => {
    if (e.key === "Escape") root.remove();
    if (e.key === "ArrowDown") { sel = Math.min(filtered.length - 1, sel + 1); render(); }
    if (e.key === "ArrowUp") { sel = Math.max(0, sel - 1); render(); }
    if (e.key === "Enter" && filtered[sel]) location.href = filtered[sel].where;
  });
  root.addEventListener("click", e => { if (e.target === root) root.remove(); });
  render();
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function showPageLoadError(rendererName, error) {
  const main = document.getElementById("main");
  const sidebar = document.getElementById("sidebar");
  const message = error?.message || `${rendererName} is not available.`;
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sb-header">Recovery</div>
      <a class="sb-item" href="dashboard.html">Dashboard</a>
      <a class="sb-item" href="./">Home</a>
    `;
  }
  if (!main) return;
  main.innerHTML = `
    <div class="tabs"><div class="tab active">Page load error</div></div>
    <div class="page-narrow">
      <div class="h1">This page needs a fresh reload.</div>
      <div class="subtle">
        The app shell loaded, but the page script did not finish. This can happen after a GitHub Pages update while the browser still has older files cached.
      </div>
      <div class="feedback bad" style="margin-top:14px;">
        <b>${escapeHTML(message)}</b>
      </div>
      <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn primary" id="reload-page">Reload page</button>
        <button class="btn" id="clear-site-cache">Clear local cache</button>
        <a class="btn" href="dashboard.html">Open dashboard</a>
      </div>
    </div>
  `;
  document.getElementById("reload-page")?.addEventListener("click", () => location.reload());
  document.getElementById("clear-site-cache")?.addEventListener("click", async () => {
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((reg) => reg.unregister()));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    } catch (e) {
      console.warn("[shell] cache recovery failed:", e);
    }
    location.reload();
  });
}

function renderPage(activeId, rendererName) {
  buildShell(activeId);
  const renderer = window[rendererName];
  if (typeof renderer !== "function") {
    showPageLoadError(rendererName);
    return;
  }
  try {
    renderer();
  } catch (error) {
    console.error(`[shell] ${rendererName} failed:`, error);
    showPageLoadError(rendererName, error);
  }
}

window.escapeHTML = escapeHTML;
window.buildShell = buildShell;
window.renderPage = renderPage;
