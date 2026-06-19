// Skill tree — visual unit graph keyed off lesson completion.

function renderSkills() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  const unitRows = [
    ["u-basics"],
    ["u-control"],
    ["u-collections", "u-strings"],
    ["u-functions"],
    ["u-files-errors", "u-oop"],
    ["u-advanced"],
  ];

  // A unit is "done" when all its lessons are completed.
  function unitState(id) {
    const u = LESSONS.find(x => x.id === id);
    if (!u) return "locked";
    const done = u.lessons.every(l => State.data.completedLessons[l.id]);
    if (done) return "done";
    // Is it unlocked? unlock if previous row's units are done OR you've touched any lesson in it.
    const rowIdx = unitRows.findIndex(r => r.includes(id));
    if (rowIdx === 0) return u.lessons.some(l => State.data.completedLessons[l.id]) ? "current" : "current";
    const prevRow = unitRows[rowIdx - 1];
    const prevDone = prevRow.every(pid => unitState(pid) === "done");
    if (prevDone) return "current";
    return "locked";
  }

  const total = ALL_LESSONS.length;
  const done = Object.keys(State.data.completedLessons).length;

  // Sidebar — achievements
  const achievements = [
    { id: "ach-first-step",  name: "First Step",   desc: "Complete your first lesson.", got: done >= 1 },
    { id: "ach-rookie",      name: "Rookie",       desc: "Complete 5 lessons.", got: done >= 5 },
    { id: "ach-scholar",     name: "Scholar",      desc: "Complete 10 lessons.", got: done >= 10 },
    { id: "ach-graduate",    name: "Graduate",     desc: "Complete every lesson.", got: done >= total },
    { id: "ach-grinder",     name: "Grinder",      desc: "Solve 5 challenges.", got: Object.keys(State.data.completedChallenges).length >= 5 },
    { id: "ach-week-streak", name: "Week Streak",  desc: "7-day learning streak.", got: State.data.streak >= 7 },
    { id: "ach-level-5",     name: "Level 5",      desc: "Reach level 5.", got: State.data.level >= 5 },
    { id: "ach-level-10",    name: "Level 10",     desc: "Reach level 10.", got: State.data.level >= 10 },
  ];

  sidebar.innerHTML = `
    <div class="sb-header">Overview</div>
    <div style="padding:8px 14px;">
      <div class="subtle" style="font-family:var(--font-mono);font-size:11px;">${done}/${total} lessons · ${Object.keys(State.data.completedChallenges).length}/${CHALLENGES.length} challenges</div>
      <div class="progress-track" style="margin-top:8px;"><div class="progress-fill" style="width:${Math.round(done/total*100)}%"></div></div>
    </div>
    <div class="sb-section"></div>
    <div class="sb-header">Achievements</div>
    ${achievements.map(a => `
      <div class="sb-item" title="${escapeHTML(a.desc)}" style="${a.got ? "" : "opacity:0.45;"}">
        <span>${a.got ? "★" : "☆"}</span><span>${escapeHTML(a.name)}</span>
      </div>
    `).join("")}
  `;

  main.innerHTML = `
    <div class="tabs"><div class="tab active">Skill Tree</div></div>
    <div class="page-wide">
      <div class="h1">Skill tree</div>
      <div class="subtle" style="margin-bottom:16px;">Each node is a unit. Finish all lessons in a row to unlock the next.</div>

      <div class="tree-wrap" style="max-width:780px;margin:0 auto;">
        ${unitRows.map((row, i) => `
          <div class="tree-row">
            ${row.map(id => {
              const u = LESSONS.find(x => x.id === id);
              if (!u) return "";
              const st = unitState(id);
              const doneN = u.lessons.filter(l => State.data.completedLessons[l.id]).length;
              return `
                <a class="tree-node ${st}" href="${st === "locked" ? "#" : `lessons.html#${u.id}`}" style="text-decoration:none;color:inherit;">
                  <div class="icon">${u.icon}</div>
                  <div style="font-weight:600;">${escapeHTML(u.title)}</div>
                  <div class="subtle" style="font-family:var(--font-mono);font-size:11px;">${doneN}/${u.lessons.length}</div>
                </a>
              `;
            }).join("")}
          </div>
        `).join("")}
      </div>

      <div class="divider"></div>
      <div class="h2">Achievements</div>
      <div class="achv-grid">
        ${achievements.map(a => `
          <div class="achv ${a.got ? "" : "locked"}">
            <div class="icon">${a.got ? "★" : "☆"}</div>
            <div class="name">${escapeHTML(a.name)}</div>
            <div class="desc">${escapeHTML(a.desc)}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
