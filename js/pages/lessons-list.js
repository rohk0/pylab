// Lessons index — full curriculum browser.

function renderLessons() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  let filter = "all";

  sidebar.innerHTML = `
    <div class="sb-header">Units</div>
    ${LESSONS.map(u => {
      const done = u.lessons.filter(l => State.data.completedLessons[l.id]).length;
      return `
        <a class="sb-item" href="#${u.id}">
          <span>${escapeHTML(u.title)}</span>
          <span class="badge">${done}/${u.lessons.length}</span>
        </a>
      `;
    }).join("")}
    <div class="sb-section"></div>
    <div class="sb-header">Filter</div>
    <div class="sb-item" data-filter="all">All</div>
    <div class="sb-item" data-filter="todo">Not started</div>
    <div class="sb-item" data-filter="done">Completed</div>
  `;

  sidebar.querySelectorAll("[data-filter]").forEach(el => {
    el.onclick = () => {
      filter = el.dataset.filter;
      sidebar.querySelectorAll("[data-filter]").forEach(e => e.classList.toggle("active", e === el));
      paint();
    };
  });
  sidebar.querySelector("[data-filter=all]").classList.add("active");

  function paint() {
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Lessons</div></div>
      <div class="page-wide">
        <div class="h1">Curriculum</div>
        <div class="subtle" style="margin-bottom:18px;">${ALL_LESSONS.length} lessons across ${LESSONS.length} units. Each ends with a typed coding exercise.</div>

        ${LESSONS.map(u => {
          const lessons = u.lessons.filter(l => {
            if (filter === "todo") return !State.data.completedLessons[l.id];
            if (filter === "done") return State.data.completedLessons[l.id];
            return true;
          });
          if (lessons.length === 0) return "";
          return `
            <section id="${u.id}" style="margin-bottom:28px;">
              <div style="display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:6px;margin-bottom:10px;">
                <div>
                  <span style="font-family:var(--font-mono);font-size:11px;color:var(--fg-mute);">${u.icon}</span>
                  <span class="h2" style="margin:0 0 0 8px;display:inline;">${escapeHTML(u.title)}</span>
                </div>
                <div class="subtle">${escapeHTML(u.summary)}</div>
              </div>
              <div class="ch-grid">
                ${lessons.map(l => {
                  const done = State.data.completedLessons[l.id];
                  return `
                    <a class="ch-card ${done ? "done" : ""}" href="lesson.html?id=${l.id}" style="text-decoration:none;color:inherit;">
                      <div class="title">
                        ${escapeHTML(l.title)}
                        ${done ? '<span class="tag green" style="margin-left:auto;">done</span>' : ""}
                      </div>
                      <div class="desc">${escapeHTML(l.summary)}</div>
                      <div class="meta">
                        <span class="tag">${l.exercises.length} exercise${l.exercises.length === 1 ? "" : "s"}</span>
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
  }
  paint();

  if (location.hash) {
    setTimeout(() => {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }
}
