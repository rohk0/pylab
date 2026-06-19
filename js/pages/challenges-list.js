// Challenges index — filter by difficulty / tag / status.

function renderChallenges() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  const state = { diff: "all", tag: "all", status: "all", query: "" };
  const allTags = Array.from(new Set(CHALLENGES.flatMap(c => c.tags || []))).sort();

  sidebar.innerHTML = `
    <div class="sb-header">Difficulty</div>
    <div class="sb-item" data-d="all">All</div>
    <div class="sb-item" data-d="easy">Easy</div>
    <div class="sb-item" data-d="medium">Medium</div>
    <div class="sb-item" data-d="hard">Hard</div>
    <div class="sb-section"></div>
    <div class="sb-header">Status</div>
    <div class="sb-item" data-s="all">All</div>
    <div class="sb-item" data-s="todo">Unsolved</div>
    <div class="sb-item" data-s="done">Solved</div>
    <div class="sb-section"></div>
    <div class="sb-header">Tags</div>
    <div class="sb-item" data-t="all">All tags</div>
    ${allTags.map(t => `<div class="sb-item" data-t="${escapeHTML(t)}">${escapeHTML(t)}</div>`).join("")}
  `;

  sidebar.querySelectorAll("[data-d]").forEach(el => el.onclick = () => { state.diff = el.dataset.d; setActive("[data-d]", el); paint(); });
  sidebar.querySelectorAll("[data-s]").forEach(el => el.onclick = () => { state.status = el.dataset.s; setActive("[data-s]", el); paint(); });
  sidebar.querySelectorAll("[data-t]").forEach(el => el.onclick = () => { state.tag = el.dataset.t; setActive("[data-t]", el); paint(); });
  setActive("[data-d]", sidebar.querySelector("[data-d=all]"));
  setActive("[data-s]", sidebar.querySelector("[data-s=all]"));
  setActive("[data-t]", sidebar.querySelector("[data-t=all]"));

  function setActive(sel, el) {
    sidebar.querySelectorAll(sel).forEach(e => e.classList.toggle("active", e === el));
  }

  function paint() {
    let list = CHALLENGES.slice();
    if (state.diff !== "all") list = list.filter(c => c.difficulty === state.diff);
    if (state.tag !== "all") list = list.filter(c => (c.tags || []).includes(state.tag));
    if (state.status === "todo") list = list.filter(c => !State.data.completedChallenges[c.id]);
    if (state.status === "done") list = list.filter(c => State.data.completedChallenges[c.id]);
    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q));
    }

    main.innerHTML = `
      <div class="tabs"><div class="tab active">Challenges</div></div>
      <div class="page-wide">
        <div style="display:flex;align-items:end;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:6px;">
          <div>
            <div class="h1">Practice challenges</div>
            <div class="subtle">${list.length} of ${CHALLENGES.length} shown · ${Object.keys(State.data.completedChallenges).length} solved</div>
          </div>
          <input id="ch-search" placeholder="Filter…" style="width:220px;" value="${escapeHTML(state.query)}" />
        </div>

        <div class="ch-grid" style="margin-top:18px;">
          ${list.map(c => {
            const done = State.data.completedChallenges[c.id];
            const dClass = c.difficulty === "easy" ? "green" : c.difficulty === "medium" ? "yellow" : "red";
            return `
              <a class="ch-card ${done ? "done" : ""}" href="challenge.html?id=${c.id}" style="text-decoration:none;color:inherit;">
                <div class="title">
                  ${escapeHTML(c.title)}
                  ${done ? '<span class="tag green" style="margin-left:auto;">solved</span>' : ""}
                </div>
                <div class="desc">${escapeHTML(c.summary)}</div>
                <div class="meta">
                  <span class="tag ${dClass}">${c.difficulty}</span>
                  <span class="tag cyan">+${c.xp} XP</span>
                  ${(c.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("")}
                </div>
              </a>
            `;
          }).join("") || `<div class="empty"><h3>No challenges match these filters.</h3></div>`}
        </div>
      </div>
    `;

    const search = document.getElementById("ch-search");
    if (search) search.oninput = e => { state.query = e.target.value; paint(); search.focus(); };
  }
  paint();
}
