// Lessons index — full curriculum browser, now language-aware.
//
// Python uses the hand-curated LESSONS array. Every other language
// gets an AI-generated curriculum cached in localStorage under
// `pylab.curriculum.<lang>`. Clicking a lesson opens lesson.html
// with both lang & id params; the lesson page lazy-loads the lesson
// body from cache (or generates it on first open).

function renderLessons() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  let filter = "all";
  let langId = (State.data.lang || "python");

  function curriculumFor(lid) {
    if (lid === "python") return { units: LESSONS, generated: false };
    // User-generated (AI-authored) override takes priority.
    try {
      const raw = localStorage.getItem("pylab.curriculum." + lid);
      if (raw) return { units: JSON.parse(raw), generated: true, source: "ai" };
    } catch {}
    // Then a baked-in default curriculum — units exist, lesson bodies
    // still get AI-generated on first open.
    const baked = window.DEFAULT_CURRICULA && window.DEFAULT_CURRICULA[lid];
    if (baked && Array.isArray(baked) && baked.length) {
      return { units: baked, generated: false, source: "baked" };
    }
    return { units: null, generated: true };
  }

  function paint() {
    const { units, generated } = curriculumFor(langId);
    const lang = findLanguage(langId);

    sidebar.innerHTML = `
      <div class="sb-header">Language</div>
      ${LANGUAGES.map(L => `
        <a class="sb-item ${L.id === langId ? "active" : ""}" data-lang="${L.id}">
          <span>${L.name}</span>
          <span class="badge">${L.ext}</span>
        </a>
      `).join("")}
      <div class="sb-section"></div>
      <div class="sb-header">Units</div>
      ${(units || []).map(u => {
        const done = (u.lessons || []).filter(l => State.data.completedLessons[l.id]).length;
        return `
          <a class="sb-item" href="#${u.id}">
            <span>${escapeHTML(u.title)}</span>
            <span class="badge">${done}/${(u.lessons || []).length}</span>
          </a>
        `;
      }).join("") || `<div style="padding:6px 14px;font-size:11px;color:var(--fg-mute);">No curriculum yet.</div>`}
      <div class="sb-section"></div>
      <div class="sb-header">Filter</div>
      <div class="sb-item ${filter === "all" ? "active" : ""}" data-filter="all">All</div>
      <div class="sb-item ${filter === "todo" ? "active" : ""}" data-filter="todo">Not started</div>
      <div class="sb-item ${filter === "done" ? "active" : ""}" data-filter="done">Completed</div>
    `;
    sidebar.querySelectorAll("[data-lang]").forEach(el => el.onclick = () => {
      langId = el.dataset.lang;
      setActiveLanguage(langId);
      paint();
    });
    sidebar.querySelectorAll("[data-filter]").forEach(el => el.onclick = () => {
      filter = el.dataset.filter; paint();
    });

    const tabs = LANGUAGES.map(L =>
      `<div class="tab ${L.id === langId ? "active" : ""}" data-lang="${L.id}">${L.name}</div>`
    ).join("");

    if (!units) {
      // No curriculum yet for this language — offer to generate.
      main.innerHTML = `
        <div class="tabs" id="lang-tabs">${tabs}</div>
        <div class="page-wide">
          <div style="display:flex;align-items:end;justify-content:space-between;gap:14px;flex-wrap:wrap;">
            <div>
              <div class="h1">${lang.name} curriculum</div>
              <div class="subtle">No curriculum cached for ${lang.name} yet. The AI can author one in seconds.</div>
            </div>
            <button class="ai-btn" id="gen-curr">Generate ${lang.name} curriculum</button>
          </div>
          <div id="gen-status" style="margin-top:14px;"></div>
        </div>
      `;
      bindTabs();
      document.getElementById("gen-curr").onclick = generateCurriculum;
      return;
    }

    const source = curriculumFor(langId).source;
    main.innerHTML = `
      <div class="tabs" id="lang-tabs">${tabs}</div>
      <div class="page-wide">
        <div style="display:flex;align-items:end;justify-content:space-between;gap:14px;flex-wrap:wrap;">
          <div>
            <div class="h1">${lang.name} curriculum</div>
            <div class="subtle">${units.reduce((a, u) => a + (u.lessons || []).length, 0)} lessons across ${units.length} units. ${source === "ai" ? "AI-generated · " : source === "baked" ? "Curated · lesson bodies generated on demand · " : ""}Each ends with a typed coding exercise.</div>
          </div>
          ${source === "ai" ? `<button class="ai-btn" id="regen-curr">Regenerate</button>` :
            source === "baked" ? `<button class="ai-btn" id="regen-curr">Replace with AI</button>` : ""}
        </div>

        ${units.map(u => {
          const lessons = (u.lessons || []).filter(l => {
            if (filter === "todo") return !State.data.completedLessons[l.id];
            if (filter === "done") return State.data.completedLessons[l.id];
            return true;
          });
          if (lessons.length === 0) return "";
          return `
            <section id="${u.id}" style="margin-bottom:28px;">
              <div style="display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:6px;margin-bottom:10px;">
                <div>
                  <span style="font-family:var(--font-mono);font-size:11px;color:var(--fg-mute);">${u.icon || "•"}</span>
                  <span class="h2" style="margin:0 0 0 8px;display:inline;">${escapeHTML(u.title)}</span>
                </div>
                <div class="subtle">${escapeHTML(u.summary || "")}</div>
              </div>
              <div class="ch-grid">
                ${lessons.map(l => {
                  const done = State.data.completedLessons[l.id];
                  const href = langId === "python"
                    ? `lesson.html?id=${l.id}`
                    : `lesson.html?lang=${langId}&id=${encodeURIComponent(l.id)}`;
                  return `
                    <a class="ch-card ${done ? "done" : ""}" href="${href}" style="text-decoration:none;color:inherit;">
                      <div class="title">
                        ${generated ? '<span class="ai-badge" style="margin-right:6px;">AI</span>' : ""}
                        ${escapeHTML(l.title)}
                        ${done ? '<span class="tag green" style="margin-left:auto;">done</span>' : ""}
                      </div>
                      <div class="desc">${escapeHTML(l.summary || "")}</div>
                      <div class="meta">
                        <span class="tag">${(l.exercises || []).length || 1} exercise${(l.exercises || []).length === 1 ? "" : "s"}</span>
                        <span class="tag cyan">+15 XP</span>
                      </div>
                    </a>
                  `;
                }).join("")}
              </div>
            </section>
          `;
        }).join("")}
      </div>
    `;
    bindTabs();
    const regenBtn = document.getElementById("regen-curr");
    if (regenBtn) regenBtn.onclick = () => {
      const msg = source === "baked"
        ? `Replace the curated ${lang.name} curriculum with an AI-generated one? The curated version is always available later.`
        : `Regenerate the ${lang.name} curriculum? Local cache will be replaced.`;
      if (!confirm(msg)) return;
      localStorage.removeItem("pylab.curriculum." + langId);
      generateCurriculum();
    };

    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }

  function bindTabs() {
    document.querySelectorAll("#lang-tabs [data-lang]").forEach(el => el.onclick = () => {
      langId = el.dataset.lang;
      setActiveLanguage(langId);
      paint();
    });
  }

  async function generateCurriculum() {
    const lang = findLanguage(langId);
    const target = document.getElementById("gen-status") || (() => {
      const div = document.createElement("div");
      div.id = "gen-status";
      document.querySelector(".page-wide")?.appendChild(div);
      return div;
    })();
    if (!AI.available()) {
      target.innerHTML = `<div class="feedback bad">Add a Groq key in <a href="settings.html#ai">Settings</a> first.</div>`;
      return;
    }
    target.innerHTML = `<div class="subtle">Generating a ${lang.name} curriculum…</div>`;
    try {
      const data = await AI.json([
        { role: "system", content: `You author programming curricula as strict JSON. Return ONLY JSON.

Schema:
{ "units": [
  { "id": "<lang>-<unit-slug>", "icon": "01", "title": "...", "summary": "...",
    "lessons": [
      { "id": "<lang>-<lesson-slug>", "title": "...", "summary": "...",
        "topics": ["..."], "exercises": 1 }
    ] }
] }

Rules:
- 8 units total, going from beginner to intermediate to advanced.
- 3–4 lessons per unit.
- ids must be filesystem-safe lowercase ASCII with hyphens.
- icons are 2-char numbers ("01" … "08").
- Tailored to ${lang.name} specifically (not generic CS).
` },
        { role: "user", content: `Produce a complete ${lang.name} curriculum for an in-browser learning workbench.` }
      ], { maxTokens: 3000, temperature: 0.4 });
      if (!data || !Array.isArray(data.units)) throw new Error("AI returned no units.");
      localStorage.setItem("pylab.curriculum." + langId, JSON.stringify(data.units));
      paint();
    } catch (e) {
      target.innerHTML = `<div class="feedback bad">${escapeHTML(AI.friendlyError(e))}</div>`;
    }
  }

  paint();
}
