// Daily practice — one AI-generated challenge per day, cached.

function renderPractice() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  const today = State.todayISO();
  const KEY = "pylab.daily." + today;
  const HISTORY_KEY = "pylab.daily.history";

  let history = [];
  try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch {}

  sidebar.innerHTML = `
    <div class="sb-header">Today</div>
    <div class="sb-item active" data-act="today">${new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</div>
    <div class="sb-section"></div>
    <div class="sb-header">Past challenges</div>
    ${history.slice(-30).reverse().map(h => `
      <div class="sb-item" data-day="${h.date}">
        <span>${h.title}</span>
        <span class="badge">${h.ok ? "✓" : ""}</span>
      </div>
    `).join("") || `<div style="padding:6px 14px;font-size:11px;color:var(--fg-mute);">No history yet.</div>`}
    <div class="sb-section"></div>
    <div class="sb-header">Settings</div>
    <div class="sb-item" data-act="regen">↻ Regenerate today</div>
  `;

  sidebar.querySelector("[data-act=regen]").onclick = () => {
    localStorage.removeItem(KEY);
    renderPractice();
  };

  let challenge = null;
  try { challenge = JSON.parse(localStorage.getItem(KEY) || "null"); } catch {}

  if (challenge) {
    paintChallenge(challenge);
  } else if (!AI.available()) {
    paintNoKey();
  } else {
    paintLoading();
    generateToday();
  }

  async function generateToday() {
    try {
      const seed = today + "-v1";
      // Avoid asking for topics the user already nailed
      const weak = Tracker.weakestTopics(3).map(w => w.name);
      const seedTopic = weak[0] || "Python";
      const data = await AI.json(PROMPTS.dailyPractice({ seed: seed + "-" + seedTopic, level: Math.min(5, State.data.level) }), { temperature: 0.7, maxTokens: 1600 });
      challenge = { ...data, date: today };
      localStorage.setItem(KEY, JSON.stringify(challenge));
      paintChallenge(challenge);
    } catch (e) {
      paintError(AI.friendlyError(e));
    }
  }

  function paintNoKey() {
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Daily Practice</div></div>
      <div class="page-narrow">
        <div class="h1">Daily practice</div>
        <div class="feedback bad" style="margin-top:14px;">
          Daily practice uses the Groq AI to generate a fresh exercise each day.
          Configure a Groq key in <a href="settings.html#ai">Settings</a> to enable it.
        </div>
      </div>
    `;
  }

  function paintLoading() {
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Daily Practice</div></div>
      <div class="page-narrow">
        <div class="h1"><span class="skel skel-line w70" style="height:22px;"></span></div>
        <div class="subtle">Asking the tutor to pick something at your level…</div>
        <div class="skel-card" style="margin-top:18px;">
          <span class="skel skel-line w40"></span>
          <span class="skel skel-line"></span>
          <span class="skel skel-line"></span>
          <span class="skel skel-line w70"></span>
          <span class="skel skel-line w40" style="margin-top:14px;"></span>
        </div>
      </div>
    `;
  }

  function paintError(msg) {
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Daily Practice</div></div>
      <div class="page-narrow">
        <div class="h1">Couldn't generate today's challenge</div>
        <div class="feedback bad" style="margin-top:14px;">${escapeHTML(msg)}</div>
        <div style="margin-top:14px;">
          <button class="btn" onclick="location.reload()">Try again</button>
        </div>
      </div>
    `;
  }

  function paintChallenge(ch) {
    const done = (Tracker.ensure().attempts[`daily:${ch.date}`] || {}).passed;
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Daily · ${ch.date}</div></div>
      <div class="lesson-layout">
        <article class="lesson-prose">
          <div style="display:flex;gap:6px;margin-bottom:6px;">
            <span class="tag cyan">+15 XP</span>
            <span class="tag">${escapeHTML(ch.concept || "")}</span>
            ${done ? '<span class="tag green">solved</span>' : ""}
          </div>
          <h1>${escapeHTML(ch.title || "Today's challenge")}</h1>
          <p>${escapeHTML(ch.prompt || "")}</p>
          <h2>Hints</h2>
          <ul>
            ${(ch.hints || []).map(h => `<li>${escapeHTML(h)}</li>`).join("")}
          </ul>
          <p class="subtle">Hints reveal one at a time inside the editor — try without them first.</p>
        </article>
        <section class="lesson-exercise">
          <div class="exercise-prompt">
            <div class="label">Daily Challenge</div>
            <div class="task">${escapeHTML(ch.title || "")}</div>
          </div>
          <div class="editor-wrap">
            <div class="editor-toolbar">
              <span class="file">daily-${ch.date}.py</span>
              <span class="spacer"></span>
              <span>Python 3.11</span>
            </div>
            <div id="editor" style="flex:1;"></div>
            <div class="output-pane">
              <div class="output-tabs">
                <div class="otab active">Output</div>
                <div class="spacer"></div>
                <div class="actions">
                  <button class="ai-btn" id="ai-coach-btn">Ask AI</button>
                  <button class="btn ghost" id="hint-btn">Hint</button>
                </div>
              </div>
              <div class="output-body" id="output"><span class="dim">Run or check your solution to see results.</span></div>
            </div>
            <div class="exercise-controls">
              <button class="btn" id="reset-btn">Reset</button>
              <button class="btn" id="run-btn">▶ Run</button>
              <button class="btn primary" id="check-btn">Check Answer</button>
            </div>
          </div>
        </section>
      </div>
    `;
    const editor = CodeEditor(document.getElementById("editor"), ch.starter || "", { onRun: doRun });
    const output = document.getElementById("output");
    Runtime.bindOutput(output);
    let hintIdx = -1;

    document.getElementById("reset-btn").onclick = () => { editor.setValue(ch.starter || ""); output.innerHTML = `<span class="dim">Editor reset.</span>`; };
    document.getElementById("run-btn").onclick = doRun;
    document.getElementById("check-btn").onclick = doCheck;
    document.getElementById("hint-btn").onclick = () => {
      hintIdx = Math.min((ch.hints || []).length - 1, hintIdx + 1);
      output.innerHTML = `<div class="feedback hint"><b>Hint ${hintIdx + 1}:</b> ${escapeHTML((ch.hints || [])[hintIdx] || "No more hints.")}</div>`;
    };
    document.getElementById("ai-coach-btn").onclick = () => openCoach(
      { id: `daily-${ch.date}`, title: ch.title, prose: ch.prompt },
      { prompt: ch.prompt, solution: ch.solution },
      editor
    );

    async function doRun() {
      output.innerHTML = "";
      await Runtime.run(editor.getValue());
      if (output.children.length === 0) output.innerHTML = `<span class="dim">(no output)</span>`;
    }
    async function doCheck() {
      output.innerHTML = `<span class="dim">Grading…</span>`;
      const result = await Grader.grade(editor.getValue(), {
        check: buildCheck(ch.tests || []),
      });
      output.innerHTML = "";
      if (result.stdout) { const p = document.createElement("div"); p.textContent = result.stdout; output.appendChild(p); }
      const fb = document.createElement("div");
      Tracker.recordAttempt({
        id: `daily:${ch.date}`,
        topic: [ch.concept].filter(Boolean),
        ok: result.ok,
        errorName: !result.ok && result.message ? guessErrorName(result.message) : null,
        kind: "daily",
        ref: ch.date,
      });
      if (result.ok) {
        fb.className = "feedback ok";
        fb.innerHTML = `<b>✓ Solved.</b> Nice work.`;
        output.appendChild(fb);
        if (!history.find(h => h.date === ch.date)) {
          history.push({ date: ch.date, title: ch.title, ok: true });
          localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }
        State.addXP(15, "daily practice");
        // After XP toast, show the AI explainer
        const explain = document.createElement("div");
        explain.style.marginTop = "8px";
        explain.innerHTML = `<b style="color:var(--accent);font-size:11px;text-transform:uppercase;letter-spacing:0.4px;">Tutor explainer</b>`;
        const target = document.createElement("div");
        target.style.marginTop = "4px";
        explain.appendChild(target);
        output.appendChild(explain);
        if (AI.available() && ch.explain) {
          target.innerHTML = AI.renderMD(ch.explain);
        } else if (AI.available()) {
          AI.into(target, PROMPTS.review({ code: editor.getValue(), task: ch.prompt, passed: true }));
        }
      } else {
        fb.className = "feedback bad";
        fb.innerHTML = `<b>✗ Not yet.</b><pre style="margin:6px 0 0;white-space:pre-wrap;font-family:var(--font-mono);font-size:12px;">${escapeHTML(result.message)}</pre>`;
        output.appendChild(fb);
        appendAIActionRow(output, "bad", {
          code: editor.getValue(),
          ex: { prompt: ch.prompt }, lesson: { title: ch.title, prose: ch.prompt },
          error: result.message, stdout: result.stdout,
        });
      }
    }
  }

  function buildCheck(tests) {
    if (!Array.isArray(tests) || !tests.length) return `print("CHECK_OK")`;
    const lines = [];
    for (const t of tests) {
      if (t.kind === "func_call") {
        const expected = JSON.stringify(t.equals);
        lines.push(`assert (${t.call}) == ${expected}, "Failed: ${t.call} -> expected " + repr(${expected})`);
      }
    }
    lines.push(`print("CHECK_OK")`);
    return lines.join("\n");
  }
}
