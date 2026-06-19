// Dashboard — XP, level, streak heatmap, recent activity, next lesson.

function renderDashboard() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  // Sidebar: outline of all units
  sidebar.innerHTML = `
    <div class="sb-header">Curriculum</div>
    ${LESSONS.map(u => `
      <div class="sb-group">${escapeHTML(u.title)}</div>
      ${u.lessons.map(l => `
        <a class="sb-item ${State.data.completedLessons[l.id] ? "done" : ""}" href="lesson.html?id=${l.id}">
          <span>${escapeHTML(l.title)}</span>
          <span class="badge">${State.data.completedLessons[l.id] ? "✓" : ""}</span>
        </a>
      `).join("")}
    `).join("")}
    <div class="sb-section"></div>
    <div class="sb-header">Quick</div>
    <a class="sb-item" href="playground.html">Open playground</a>
    <a class="sb-item" href="challenges.html">Browse challenges</a>
    <a class="sb-item" href="reference.html">Python reference</a>
  `;

  const totalLessons = ALL_LESSONS.length;
  const doneLessons = Object.keys(State.data.completedLessons).length;
  const totalChals = (window.CHALLENGES || []).length;
  const doneChals = Object.keys(State.data.completedChallenges).length;
  const xp = State.xpProgress();

  // Next lesson = first uncompleted
  const next = ALL_LESSONS.find(l => !State.data.completedLessons[l.id]) || ALL_LESSONS[0];

  // Heatmap data — last 26 weeks
  const cells = [];
  const today = new Date();
  for (let i = 26 * 7 - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const iso = d.toISOString().slice(0, 10);
    const hit = State.data.streakDays.includes(iso);
    cells.push(`<div class="cell ${hit ? "l4" : ""}" title="${iso}"></div>`);
  }

  main.innerHTML = `
    <div class="tabs">
      <div class="tab active">Dashboard <span class="x" title="close">×</span></div>
    </div>
    <div class="page-wide">
      <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
        <div>
          <div class="h1">Welcome back.</div>
          <div class="subtle">Pick up where you left off, or grind a challenge.</div>
        </div>
        <div style="display:flex;gap:8px;">
          <a class="btn primary" href="lesson.html?id=${next.id}">Continue · ${escapeHTML(next.title)}</a>
          <a class="btn" href="playground.html">Open Playground</a>
        </div>
      </div>

      <div class="stat-row" style="margin-bottom:16px;">
        <div class="stat accent">
          <div class="label">Level</div>
          <div class="value">${State.data.level}</div>
          <div class="progress-track"><div class="progress-fill" style="width:${xp.pct}%"></div></div>
        </div>
        <div class="stat">
          <div class="label">Total XP</div>
          <div class="value">${State.data.xp}</div>
          <div class="delta">${xp.needNext - State.data.xp} XP to next level</div>
        </div>
        <div class="stat">
          <div class="label">Streak</div>
          <div class="value">${State.data.streak}<span style="font-size:13px;color:var(--fg-mute);"> days</span></div>
          <div class="delta">${State.data.streakDays.length} days active</div>
        </div>
        <div class="stat">
          <div class="label">Completed</div>
          <div class="value">${doneLessons + doneChals}</div>
          <div class="delta">${doneLessons}/${totalLessons} lessons · ${doneChals}/${totalChals} challenges</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;border-left:3px solid var(--accent-2);">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <div class="ai-dot"></div>
          <div style="font-weight:600;color:var(--fg-strong);">AI Learning Companion</div>
          <span class="ai-badge">groq</span>
          <span style="flex:1;"></span>
          <a href="chat.html" class="subtle">Open tutor →</a>
        </div>
        <div id="companion-body" style="min-height:30px;font-size:13px;line-height:1.6;">
          <span class="subtle">Loading personalized message…</span>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">
          <a class="ai-btn" href="practice.html">Today's challenge</a>
          <a class="ai-btn" href="chat.html">Ask the tutor</a>
          <a class="ai-btn" href="explain.html">Explain my code</a>
          <a class="ai-btn" href="errors.html">Error dictionary</a>
        </div>
      </div>

      <div class="dash-grid">
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div style="font-weight:600;color:var(--fg-strong);">Continue learning</div>
            <a href="lessons.html" class="subtle">All lessons →</a>
          </div>
          ${LESSONS.slice(0, 4).map(u => {
            const total = u.lessons.length;
            const done = u.lessons.filter(l => State.data.completedLessons[l.id]).length;
            const pct = Math.round((done / total) * 100);
            return `
              <a href="lessons.html#${u.id}" style="display:block;padding:8px 0;border-bottom:1px solid var(--border);text-decoration:none;color:inherit;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <div style="font-weight:500;color:var(--fg-strong);">${escapeHTML(u.title)}</div>
                    <div class="subtle">${escapeHTML(u.summary)}</div>
                  </div>
                  <div style="font-family:var(--font-mono);font-size:11px;color:var(--fg-mute);">${done}/${total}</div>
                </div>
                <div class="progress-track" style="margin-top:6px;"><div class="progress-fill" style="width:${pct}%"></div></div>
              </a>
            `;
          }).join("")}
        </div>

        <div style="display:grid;gap:12px;">
          <div class="card">
            <div style="font-weight:600;color:var(--fg-strong);margin-bottom:8px;">Activity</div>
            <div class="heatmap">${cells.join("")}</div>
            <div class="subtle" style="margin-top:8px;">Last 26 weeks</div>
          </div>
          <div class="card">
            <div style="font-weight:600;color:var(--fg-strong);margin-bottom:8px;">Weekly goal</div>
            <div style="display:flex;align-items:baseline;gap:6px;">
              <div style="font-family:var(--font-mono);font-size:18px;color:var(--fg-strong);">${weekXP()}</div>
              <div class="subtle">/ ${State.data.weeklyGoal} XP</div>
            </div>
            <div class="progress-track" style="margin-top:6px;"><div class="progress-fill" style="width:${Math.min(100, Math.round(weekXP() / State.data.weeklyGoal * 100))}%"></div></div>
          </div>
          <div class="card">
            <div style="font-weight:600;color:var(--fg-strong);margin-bottom:6px;">Tips</div>
            <div class="subtle" style="font-size:12px;line-height:1.65;">
              <kbd class="kbd">Ctrl K</kbd> opens the command palette.<br/>
              <kbd class="kbd">Ctrl Enter</kbd> runs code in any editor.<br/>
              Progress is saved locally in your browser.
            </div>
          </div>
        </div>
      </div>

      <div class="h2" style="margin-top:24px;">Try a challenge</div>
      <div class="ch-grid">
        ${(window.CHALLENGES || []).slice(0, 6).map(c => `
          <a class="ch-card ${State.data.completedChallenges[c.id] ? "done" : ""}" href="challenge.html?id=${c.id}" style="text-decoration:none;color:inherit;">
            <div class="title">${escapeHTML(c.title)}</div>
            <div class="desc">${escapeHTML(c.summary)}</div>
            <div class="meta">
              <span class="tag ${c.difficulty === "easy" ? "green" : c.difficulty === "medium" ? "yellow" : "red"}">${c.difficulty}</span>
              <span class="tag">+${c.xp} XP</span>
              ${c.tags ? c.tags.slice(0,2).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("") : ""}
            </div>
          </a>
        `).join("")}
      </div>
    </div>
  `;

  // Companion message — cached for 6 hours per device.
  loadCompanionMessage();
}

function loadCompanionMessage() {
  const target = document.getElementById("companion-body");
  if (!target) return;
  if (!AI.available()) {
    target.innerHTML = `<span class="subtle">Add a Groq key in <a href="settings.html#ai">Settings</a> to enable personalized AI guidance, daily practice, the tutor chat, and code review.</span>`;
    return;
  }
  const CACHE = "pylab.companion";
  const TTL = 6 * 60 * 60 * 1000;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE) || "null");
    if (cached && Date.now() - cached.at < TTL) {
      target.innerHTML = AI.renderMD(cached.text);
      return;
    }
  } catch {}
  const summary = `${Tracker.summaryString()}\n\nNext lesson queued: ${(ALL_LESSONS.find(l => !State.data.completedLessons[l.id]) || {}).title || "everything done!"}`;
  AI.complete(PROMPTS.companion({ summary }), { maxTokens: 220, temperature: 0.6, speed: "fast" })
    .then(text => {
      target.innerHTML = AI.renderMD(text);
      localStorage.setItem(CACHE, JSON.stringify({ at: Date.now(), text }));
    })
    .catch(e => {
      target.innerHTML = `<span class="subtle">${escapeHTML(AI.friendlyError(e))}</span>`;
    });
}

function weekXP() {
  // Estimate: assume avg 15 XP per completed lesson + 20 per challenge from the past 7 days.
  // We don't store per-day XP, so use streakDays as a proxy.
  const recent = State.data.streakDays.filter(d => new Date(d).getTime() > Date.now() - 7 * 86400000).length;
  return recent * 30;
}
