// Challenge runner — single typed exercise, full-pane editor.

function renderChallengePage() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || CHALLENGES[0].id;
  const ch = findChallenge(id);
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  if (!ch) { main.innerHTML = `<div class="page"><div class="empty"><h3>Challenge not found.</h3></div></div>`; return; }

  const idx = CHALLENGES.findIndex(c => c.id === id);
  const prev = CHALLENGES[idx - 1];
  const next = CHALLENGES[idx + 1];

  sidebar.innerHTML = `
    <div class="sb-header">Challenges</div>
    ${CHALLENGES.map(c => `
      <a class="sb-item ${c.id === id ? "active" : ""} ${State.data.completedChallenges[c.id] ? "done" : ""}" href="challenge.html?id=${c.id}">
        <span>${escapeHTML(c.title)}</span>
        <span class="badge">${c.difficulty[0].toUpperCase()}</span>
      </a>
    `).join("")}
  `;

  const done = State.data.completedChallenges[ch.id];
  const dClass = ch.difficulty === "easy" ? "green" : ch.difficulty === "medium" ? "yellow" : "red";

  main.innerHTML = `
    <div class="tabs">
      <div class="tab active">${escapeHTML(ch.title)}.py</div>
    </div>
    <div class="lesson-layout">
      <article class="lesson-prose">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span class="tag ${dClass}">${ch.difficulty}</span>
          <span class="tag cyan">+${ch.xp} XP</span>
          ${(ch.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("")}
          ${done ? '<span class="tag green">solved</span>' : ""}
        </div>
        <h1>${escapeHTML(ch.title)}</h1>
        <p class="subtle">${escapeHTML(ch.summary)}</p>
        <div>${renderMarkdown(ch.description || "")}</div>
        <h2>How grading works</h2>
        <p>Press <kbd class="kbd">Check Answer</kbd> to grade. The checker runs hidden tests; pass them all to earn XP.</p>
        <p>Use <kbd class="kbd">Run</kbd> or <kbd class="kbd">Ctrl Enter</kbd> to execute and see your own output.</p>
      </article>
      <section class="lesson-exercise">
        <div class="exercise-prompt">
          <div class="label">Task</div>
          <div class="task">${escapeHTML(ch.description.split("\n")[0])}</div>
        </div>
        <div class="editor-wrap">
          <div class="editor-toolbar">
            <span class="file">${escapeHTML(ch.id)}.py</span>
            <span class="spacer"></span>
            <span>Python 3.11</span>
          </div>
          <div id="editor" style="flex:1;"></div>
          <div class="output-pane">
            <div class="output-tabs">
              <div class="otab active">Output</div>
              <div class="spacer"></div>
              <div class="actions">
                <button class="btn ghost" id="hint-btn">Hint</button>
                <button class="btn ghost" id="solution-btn">Reveal solution</button>
              </div>
            </div>
            <div class="output-body" id="output"><span class="dim">Run or check your solution to see results here.</span></div>
          </div>
          <div class="exercise-controls">
            <button class="btn" id="reset-btn">Reset</button>
            <button class="btn" id="run-btn">▶ Run</button>
            <button class="btn primary" id="check-btn">Check Answer</button>
            <span class="spacer"></span>
            ${prev ? `<a class="btn" href="challenge.html?id=${prev.id}">← Prev</a>` : ""}
            ${next ? `<a class="btn" href="challenge.html?id=${next.id}">Next →</a>` : ""}
          </div>
        </div>
      </section>
    </div>
  `;

  const editor = CodeEditor(document.getElementById("editor"), ch.starter || "", {
    onRun: () => doRun(),
  });
  const output = document.getElementById("output");
  Runtime.bindOutput(output);

  let hintIdx = -1;
  document.getElementById("run-btn").onclick = doRun;
  document.getElementById("check-btn").onclick = doCheck;
  document.getElementById("reset-btn").onclick = () => { editor.setValue(ch.starter || ""); output.innerHTML = `<span class="dim">Editor reset.</span>`; };
  document.getElementById("hint-btn").onclick = () => {
    hintIdx = Math.min((ch.hints || []).length - 1, hintIdx + 1);
    const hint = (ch.hints || [])[hintIdx];
    output.innerHTML = `<div class="feedback hint"><b>Hint ${hintIdx + 1}:</b> ${escapeHTML(hint || "No more hints.")}</div>`;
  };
  document.getElementById("solution-btn").onclick = () => {
    if (!confirm("Reveal the solution? You'll learn more by trying first.")) return;
    editor.setValue(ch.solution || "# no solution");
  };

  async function doRun() {
    output.innerHTML = "";
    const r = await Runtime.run(editor.getValue(), ch.stdin || "");
    if (r.ok && output.children.length === 0) {
      output.innerHTML = `<span class="dim">(program ended with no output)</span>`;
    }
  }

  async function doCheck() {
    output.innerHTML = `<span class="dim">Grading…</span>`;
    const r = await Grader.grade(editor.getValue(), ch);
    output.innerHTML = "";
    if (r.stdout) {
      const pre = document.createElement("div");
      pre.textContent = r.stdout;
      output.appendChild(pre);
    }
    const fb = document.createElement("div");
    if (r.ok) {
      fb.className = "feedback ok";
      fb.innerHTML = `<b>✓ All checks passed.</b> ${escapeHTML(r.message)}`;
      output.appendChild(fb);
      const wasNew = State.completeChallenge(ch.id, ch.xp);
      if (wasNew) {
        const extra = document.createElement("div");
        extra.className = "feedback ok";
        extra.style.marginTop = "6px";
        extra.innerHTML = `🎉 Challenge solved · <b>+${ch.xp} XP</b>`;
        output.appendChild(extra);
      }
    } else {
      fb.className = "feedback bad";
      const title = r.kind === "wrong" ? "✗ Failed a hidden test." :
                    r.kind === "stdout" ? "✗ Output mismatch." :
                    r.kind === "runtime" ? "✗ Runtime error." :
                    r.kind === "empty" ? "Nothing to grade." : "✗";
      fb.innerHTML = `<b>${title}</b><pre style="margin:6px 0 0;white-space:pre-wrap;font-family:var(--font-mono);font-size:12px;">${escapeHTML(r.message)}</pre>`;
      output.appendChild(fb);
    }
  }
}
