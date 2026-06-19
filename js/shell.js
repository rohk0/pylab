// ============================================================
// App shell — titlebar, activity bar, sidebar, status bar,
// command palette, theme toggle. Mounted into <body> on every page.
// ============================================================

const NAV = [
  { id: "dashboard",  href: "index.html",      label: "Dashboard",  icon: iconHome,    activity: true },
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
function iconSettings(){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`; }
function iconTheme()   { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`; }

function buildShell(activeId) {
  // Ensure AI stylesheet is loaded.
  if (!document.querySelector('link[href="css/ai.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = "css/ai.css";
    document.head.appendChild(link);
  }

  const aiReady = typeof AI !== "undefined" && AI.available();

  const root = document.body;
  root.innerHTML = `
    <div class="app">
      <div class="titlebar">
        <div class="brand"><div class="logo"></div><div class="brand-name"><b>pylab</b> · learn python</div></div>
        <button class="cmd" id="cmd-open">
          <span>Search lessons, challenges, ask the AI…</span>
          <kbd>Ctrl K</kbd>
        </button>
        <div class="user">
          <a href="settings.html#ai" class="ai-badge" title="AI status">
            <span style="width:6px;height:6px;border-radius:50%;background:${aiReady ? "var(--green)" : "var(--fg-mute)"};display:inline-block;"></span>
            ${aiReady ? "AI on" : "AI off"}
          </a>
          <div class="streak" title="Daily streak">${State.data.streak}d</div>
          <div class="xp-pill" id="xp-pill" title="XP / Level"><span class="dot"></span><span>Lv ${State.data.level}</span><span style="color:var(--fg-mute)">·</span><span id="xp-num">${State.data.xp} XP</span></div>
        </div>
      </div>

      <nav class="activity">
        ${NAV.filter(n => n.activity).map(n => `
          <a class="ico ${n.id === activeId ? "active" : ""}" href="${n.href}" title="${n.label}">
            ${n.icon()}
            <span class="tip">${n.label}</span>
          </a>
        `).join("")}
        <div class="spacer"></div>
        <button class="ico" id="toggle-theme" title="Toggle theme">${iconTheme()}<span class="tip">Theme</span></button>
        <a class="ico" href="settings.html" title="Settings">${iconSettings()}<span class="tip">Settings</span></a>
      </nav>

      <aside class="sidebar" id="sidebar"></aside>

      <main class="main" id="main"></main>

      <footer class="statusbar">
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

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCommandPalette();
    }
  });
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

window.escapeHTML = escapeHTML;
window.buildShell = buildShell;
