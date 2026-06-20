// Lesson viewer — left: prose, right: code editor + auto-grader.

function renderLessonPage() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || ALL_LESSONS[0].id;
  const langParam = params.get("lang");

  // Multi-language path — when ?lang=<non-python> is set, dispatch to AI lesson renderer.
  if (langParam && langParam !== "python") {
    return renderAILessonPage(langParam, id);
  }

  const lesson = findLesson(id);
  const { prev, next } = lessonNeighbors(id);
  const unit = LESSONS.find(u => u.lessons.some(l => l.id === id));

  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  if (!lesson) { main.innerHTML = `<div class="page"><div class="empty"><h3>Lesson not found.</h3></div></div>`; return; }

  // Sidebar — current unit, peer lessons
  sidebar.innerHTML = `
    <div class="sb-header">${escapeHTML(unit.title)}</div>
    ${unit.lessons.map(l => `
      <a class="sb-item ${l.id === id ? "active" : ""} ${State.data.completedLessons[l.id] ? "done" : ""}" href="lesson.html?id=${l.id}">
        <span>${escapeHTML(l.title)}</span>
      </a>
    `).join("")}
    <div class="sb-section"></div>
    <div class="sb-header">Other units</div>
    ${LESSONS.filter(u => u.id !== unit.id).map(u => `
      <a class="sb-item" href="lessons.html#${u.id}"><span>${escapeHTML(u.title)}</span></a>
    `).join("")}
  `;

  let exerciseIdx = 0;
  const totalEx = lesson.exercises.length;
  // Override map: { idx -> AI-generated exercise } so the user's "New question"
  // picks stick across paint() re-renders within this session.
  const exOverrides = {};
  // Cap on history so memory stays modest.
  const exHistory = []; // recent prompts to feed avoid-list back to AI

  function paint() {
    const ex = exOverrides[exerciseIdx] || lesson.exercises[exerciseIdx];
    const isAIVariant = !!exOverrides[exerciseIdx];
    main.innerHTML = `
      <div class="tabs">
        <div class="tab active">${escapeHTML(lesson.title)}.py</div>
      </div>
      <div class="lesson-layout">
        <article class="lesson-prose" id="prose"></article>
        <section class="lesson-exercise">
          <div class="exercise-prompt">
            <div class="label">
              Exercise ${exerciseIdx + 1} of ${totalEx}
              ${isAIVariant ? `<span class="ai-badge" style="margin-left:6px;">AI variant</span>
                <a href="#" id="restore-original" class="subtle" style="margin-left:8px;font-size:11px;">↺ original</a>` : ""}
            </div>
            <div class="task">${escapeHTML(ex.prompt)}</div>
          </div>
          <div class="editor-wrap">
            <div class="editor-toolbar">
              <span class="file">solution.py</span>
              <span class="spacer"></span>
              <span>Python 3.11</span>
            </div>
            <div id="editor" style="flex:1;"></div>
            <div class="output-pane">
              <div class="output-tabs">
                <div class="otab active">Output</div>
                <div class="spacer"></div>
                <div class="actions">
                  <button class="ai-btn" id="ai-coach">Ask AI</button>
                  <button class="ai-btn" id="ai-new-q" title="Generate a fresh exercise on the same topic">🎲 New question</button>
                  <button class="btn ghost" id="hint-btn">Hint</button>
                  <button class="btn ghost" id="solution-btn">Solution</button>
                </div>
              </div>
              <div class="output-body" id="output"><span class="dim">Press Run to execute, or Check to grade.</span></div>
            </div>
            <div class="exercise-controls">
              <button class="btn" id="reset-btn">Reset</button>
              <button class="btn" id="run-btn">▶ Run <span class="kbd" style="margin-left:4px;">Ctrl ↵</span></button>
              <button class="btn primary" id="check-btn">Check Answer</button>
              <span class="spacer"></span>
              ${prev ? `<a class="btn" href="lesson.html?id=${prev.id}">← Prev</a>` : ""}
              ${exerciseIdx > 0 ? `<button class="btn" id="prev-ex">← Exercise</button>` : ""}
              ${exerciseIdx < totalEx - 1 ? `<button class="btn" id="next-ex">Next exercise →</button>` : ""}
              ${exerciseIdx === totalEx - 1 && next ? `<a class="btn primary" href="lesson.html?id=${next.id}">Next: ${escapeHTML(next.title)} →</a>` : ""}
            </div>
          </div>
        </section>
      </div>
    `;

    document.getElementById("prose").innerHTML = renderMarkdown(lesson.prose);
    injectLessonExplainerBar(lesson);

    const editor = CodeEditor(document.getElementById("editor"), ex.starter || "", {
      onRun: () => doRun(),
    });

    const output = document.getElementById("output");
    Runtime.bindOutput(output);

    let hintIdx = -1;

    document.getElementById("run-btn").onclick = doRun;
    document.getElementById("check-btn").onclick = doCheck;
    document.getElementById("reset-btn").onclick = () => {
      editor.setValue(ex.starter || "");
      output.innerHTML = `<span class="dim">Editor reset.</span>`;
    };
    document.getElementById("hint-btn").onclick = () => {
      hintIdx = Math.min((ex.hints || []).length - 1, hintIdx + 1);
      const hint = (ex.hints || [])[hintIdx];
      const fb = document.createElement("div");
      fb.className = "feedback hint";
      fb.innerHTML = `<b>Hint ${hintIdx + 1}:</b> ${escapeHTML(hint || "No more hints.")}`;
      output.innerHTML = "";
      output.appendChild(fb);
    };
    document.getElementById("solution-btn").onclick = () => {
      if (!confirm("Show full solution? You'll learn more by trying first.")) return;
      editor.setValue(ex.solution || "# (no solution provided)");
    };
    document.getElementById("ai-coach").onclick = () => openCoach(lesson, ex, editor);
    const restoreLink = document.getElementById("restore-original");
    if (restoreLink) restoreLink.onclick = (e) => {
      e.preventDefault();
      delete exOverrides[exerciseIdx];
      paint();
      State.toast("Restored original exercise");
    };
    document.getElementById("ai-new-q").onclick = async () => {
      if (!AI.available()) { State.toast("Configure a Groq key in Settings first.", "bad"); return; }
      const btn = document.getElementById("ai-new-q");
      const orig = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = "Generating…";
      const fresh = await generateExerciseVariant(lesson, ex, exHistory);
      btn.disabled = false; btn.innerHTML = orig;
      if (!fresh) return;
      exHistory.push(fresh.prompt);
      if (exHistory.length > 6) exHistory.shift();
      exOverrides[exerciseIdx] = fresh;
      paint();
      State.toast("Fresh exercise generated");
    };
    if (document.getElementById("prev-ex")) document.getElementById("prev-ex").onclick = () => { exerciseIdx--; paint(); };
    if (document.getElementById("next-ex")) document.getElementById("next-ex").onclick = () => { exerciseIdx++; paint(); };

    async function doRun() {
      output.innerHTML = "";
      const result = await Runtime.run(editor.getValue(), ex.stdin || "");
      if (result.ok && output.children.length === 0) {
        output.innerHTML = `<span class="dim">(program ended with no output)</span>`;
      }
    }

    async function doCheck() {
      output.innerHTML = `<span class="dim">Grading…</span>`;
      const code = editor.getValue();
      const result = await Grader.grade(code, ex);
      output.innerHTML = "";
      if (result.stdout) {
        const pre = document.createElement("div");
        pre.textContent = result.stdout;
        output.appendChild(pre);
      }
      const fb = document.createElement("div");
      const topics = Tracker.topicsForExercise(ex, [lesson.unitId || lesson.id]);
      Tracker.recordAttempt({
        id: `lesson:${lesson.id}:${exerciseIdx}`,
        topic: topics,
        ok: result.ok,
        errorName: !result.ok && result.message ? guessErrorName(result.message) : null,
        kind: "lesson",
        ref: lesson.id,
      });
      if (result.ok) {
        fb.className = "feedback ok";
        fb.innerHTML = `<b>✓ Correct.</b> ${escapeHTML(result.message)}`;
        output.appendChild(fb);
        if (exerciseIdx === totalEx - 1) {
          const wasNew = State.completeLesson(lesson.id, 15);
          if (wasNew) {
            const extra = document.createElement("div");
            extra.className = "feedback ok";
            extra.style.marginTop = "6px";
            extra.innerHTML = `🎉 Lesson complete · <b>+15 XP</b>`;
            output.appendChild(extra);
          }
        }
        appendAIActionRow(output, "ok", { code, ex, lesson });
      } else {
        const kind = result.kind === "wrong" ? "bad" : result.kind === "runtime" ? "bad" : result.kind === "stdout" ? "bad" : "hint";
        fb.className = "feedback " + kind;
        fb.innerHTML = `<b>${result.kind === "wrong" ? "✗ Not quite." : result.kind === "stdout" ? "✗ Output mismatch." : result.kind === "runtime" ? "✗ Runtime error." : "—"}</b><pre style="margin:6px 0 0;white-space:pre-wrap;font-family:var(--font-mono);font-size:12px;">${escapeHTML(result.message)}</pre>`;
        output.appendChild(fb);
        appendAIActionRow(output, "bad", { code, ex, lesson, error: result.message, stdout: result.stdout });
      }
    }
  }
  paint();
}

// ============================================================
// AI integration — coaching, debug, review, explainer.
// ============================================================

// Generates a fresh exercise on the same topic as the given lesson/exercise.
// Returns null on failure. The returned shape matches the hand-written
// exercises so the existing Python grader handles it unchanged:
//   { prompt, starter, check, hints, solution }
async function generateExerciseVariant(lesson, baseEx, avoidPrompts = []) {
  if (!AI.available()) return null;
  try {
    const topicHints = [
      lesson.title,
      ...(baseEx.tags || []),
      ...(baseEx.concepts || []),
    ].filter(Boolean).join(", ");
    const avoid = (avoidPrompts || []).slice(-6).map((p, i) => `(${i + 1}) ${p}`).join("\n") || "(none yet)";
    const sys = `You author a single fresh Python exercise on a given topic as strict JSON. Return ONLY JSON.

Schema:
{
  "prompt": "one-paragraph task statement",
  "starter": "Python starter code with a function or scaffold",
  "check": "Python assertions ending with print('CHECK_OK')",
  "hints": ["hint 1", "hint 2", "hint 3"],
  "solution": "complete Python solution"
}

Rules:
- The 'check' block runs AFTER the user's code in the same namespace. It must
  consist of plain assert statements (and helper calls) followed by
  print('CHECK_OK'). No imports unless strictly necessary.
- 3 to 6 assertions covering normal and edge cases.
- Stay tightly on-topic. Match the difficulty of the original exercise.
- Avoid duplicating any of the prompts the user has already seen.
- Use only Python 3 features. No I/O in the solution.`;
    const user = `Topic: ${topicHints}\n\nOriginal exercise (for difficulty & shape only — don't repeat it):\n${baseEx.prompt || "(none)"}\n\nAlready-seen prompts to avoid:\n${avoid}\n\nGenerate a different exercise on the same topic.`;
    const data = await AI.json([
      { role: "system", content: sys },
      { role: "user", content: user },
    ], { maxTokens: 1400, temperature: 0.7 });
    if (!data || !data.prompt || !data.check) throw new Error("AI returned incomplete exercise.");
    return data;
  } catch (e) {
    State.toast(AI.friendlyError(e), "bad");
    return null;
  }
}

function guessErrorName(msg) {
  const m = String(msg || "").match(/\b([A-Z][a-zA-Z]+Error)\b/);
  return m ? m[1] : null;
}

// Inserts a row of AI follow-up buttons under the grader output.
function appendAIActionRow(output, state, ctx) {
  if (!AI.available()) return;
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;";
  if (state === "ok") {
    row.innerHTML = `
      <button class="ai-btn" data-act="review">AI code review</button>
      <button class="ai-btn" data-act="pythonic">Improve · Pythonic</button>
    `;
  } else {
    row.innerHTML = `
      <button class="ai-btn" data-act="debug">Debug with AI</button>
      <button class="ai-btn" data-act="explain">Explain the concept</button>
    `;
  }
  output.appendChild(row);
  row.querySelectorAll("[data-act]").forEach(b => b.onclick = () => runAIAction(b.dataset.act, ctx));
}

async function runAIAction(act, ctx) {
  const taskText = ctx.ex?.prompt || ctx.ex?.description || "";
  switch (act) {
    case "review":
      AIPanel.open({ title: "Code review", subtitle: "senior-dev style" });
      await AIPanel.ask(PROMPTS.review({ code: ctx.code, task: taskText, passed: true }));
      break;
    case "debug":
      AIPanel.open({ title: "Debug with AI", subtitle: "what went wrong" });
      await AIPanel.ask(PROMPTS.debug({
        code: ctx.code, task: taskText, error: ctx.error, got: ctx.stdout,
      }));
      break;
    case "pythonic":
      AIPanel.open({ title: "More Pythonic", subtitle: "refactor" });
      await AIPanel.ask(PROMPTS.improve({ code: ctx.code, kind: "pythonic" }));
      break;
    case "explain":
      AIPanel.open({ title: "Concept explainer", subtitle: ctx.lesson?.title || "lesson" });
      await AIPanel.ask(PROMPTS.explainLesson({
        lessonTitle: ctx.lesson?.title || "this lesson",
        lessonBody: ctx.lesson?.prose || taskText,
        mode: "simpler",
      }));
      break;
  }
}

// Progressive hint ladder.
async function openCoach(lesson, ex, editor) {
  if (!AI.available()) {
    AIPanel.open({ title: "AI Coach" });
    AIPanel.body().innerHTML = `<div class="feedback bad">No Groq API key configured. Add one in <a href="settings.html#ai">Settings</a>.</div>`;
    return;
  }
  AIPanel.open({ title: "AI coach", subtitle: lesson.title });
  AIPanel.body().innerHTML = "";
  const taskText = ex.prompt || ex.description || "";
  AIPanel.userTurn(`Help me with: ${taskText}`);
  let level = "nudge";
  while (true) {
    await AIPanel.ask(PROMPTS.coachHint({ task: taskText, code: editor.getValue(), level }));
    const choice = await AIPanel.pick("Need more help?", [
      { label: "Try myself", value: "stop" },
      { label: "Bigger hint", value: "hint" },
      { label: "Almost there", value: "strong" },
      { label: "Reveal solution", value: "solution" },
    ]);
    if (choice.value === "stop") { AIPanel.setFooter(""); return; }
    level = choice.value;
    AIPanel.userTurn(choice.label);
    if (level === "solution" && ex.solution) {
      // After streaming the solution explainer, offer to insert it.
      await AIPanel.ask(PROMPTS.coachHint({ task: taskText, code: editor.getValue(), level: "solution" }));
      const c2 = await AIPanel.pick("Insert solution into the editor?", [
        { label: "Yes, insert", value: "yes" },
        { label: "No thanks", value: "no" },
      ]);
      if (c2.value === "yes") editor.setValue(ex.solution);
      AIPanel.setFooter("");
      return;
    }
  }
}

// "Explain with AI" bar atop the lesson prose.
function injectLessonExplainerBar(lesson) {
  const prose = document.getElementById("prose");
  if (!prose || !AI.available()) return;
  const bar = document.createElement("div");
  bar.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px;padding-bottom:10px;border-bottom:1px dashed var(--border);";
  bar.innerHTML = `
    <span style="font-size:11px;color:var(--fg-mute);align-self:center;margin-right:4px;text-transform:uppercase;letter-spacing:0.4px;">Explain with AI</span>
    <button class="ai-btn" data-mode="simpler">Simpler</button>
    <button class="ai-btn" data-mode="eli10">ELI10</button>
    <button class="ai-btn" data-mode="example">Another example</button>
    <button class="ai-btn" data-mode="visualize">Visualize</button>
    <button class="ai-btn" data-mode="js">vs JavaScript</button>
    <button class="ai-btn" data-mode="cpp">vs C++</button>
    <button class="ai-btn" data-mode="useful">Why useful?</button>
    <button class="ai-btn" data-mode="pro">In real code</button>
  `;
  prose.insertBefore(bar, prose.firstChild);
  bar.querySelectorAll("[data-mode]").forEach(b => b.onclick = () => {
    AIPanel.open({ title: `Explainer · ${labelFor(b.dataset.mode)}`, subtitle: lesson.title });
    AIPanel.body().innerHTML = "";
    AIPanel.userTurn(b.textContent.trim());
    AIPanel.ask(PROMPTS.explainLesson({
      lessonTitle: lesson.title,
      lessonBody: lesson.prose,
      mode: b.dataset.mode,
    }));
  });
}
function labelFor(m) {
  return { simpler:"simpler", eli10:"like I'm 10", example:"another example",
    visualize:"visualized", js:"vs JavaScript", cpp:"vs C++",
    useful:"why useful", pro:"in real code" }[m] || m;
}

// ----- Tiny markdown renderer (subset) -----
function renderMarkdown(src) {
  // Code blocks first — render through the unified CodeBlock component
  // when it's available. Falls back to a plain <pre> for safety.
  const blocks = [];
  src = src.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const trimmed = code.replace(/^\n+|\n+$/g, "");
    const html = (typeof CodeBlock !== "undefined")
      ? CodeBlock.render(trimmed, { lang: lang || "python" })
      : `<pre><code>${(typeof highlightPython === "function" ? highlightPython(trimmed) : trimmed)}</code></pre>`;
    blocks.push(html);
    return `${blocks.length - 1}`;
  });

  const lines = src.split("\n");
  let html = "", inList = false, inOL = false, inBQ = false;
  const flushList = () => { if (inList) { html += "</ul>"; inList = false; } if (inOL) { html += "</ol>"; inOL = false; } };
  const flushBQ   = () => { if (inBQ) { html += "</blockquote>"; inBQ = false; } };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^#{1,6} /.test(line)) {
      flushList(); flushBQ();
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s*/, "");
      html += `<h${level}>${inline(text)}</h${level}>`;
    } else if (/^[-*] /.test(line)) {
      flushBQ();
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inline(line.replace(/^[-*]\s*/, ""))}</li>`;
    } else if (/^\d+\. /.test(line)) {
      flushBQ();
      if (!inOL) { html += "<ol>"; inOL = true; }
      html += `<li>${inline(line.replace(/^\d+\.\s*/, ""))}</li>`;
    } else if (/^> /.test(line)) {
      flushList();
      if (!inBQ) { html += "<blockquote>"; inBQ = true; }
      html += inline(line.slice(2)) + " ";
    } else if (line.trim() === "") {
      flushList(); flushBQ();
    } else {
      flushList(); flushBQ();
      html += `<p>${inline(line)}</p>`;
    }
  }
  flushList(); flushBQ();
  html = html.replace(/(\d+)/g, (_, i) => blocks[+i]);
  return html;
}

function inline(text) {
  return escapeHTML(text)
    .replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\*([^*]+)\*/g, "<i>$1</i>")
    .replace(/&lt;kbd&gt;([^&]+)&lt;\/kbd&gt;/g, '<kbd class="kbd">$1</kbd>');
}

// ============================================================
// AI lesson renderer — for non-Python languages.
// Reads the cached curriculum, lazy-generates lesson body on first
// open, presents prose-left / editor-right layout. Auto-grading is
// done via AI verification since we can't run Java/C/SQL natively.
// ============================================================

async function renderAILessonPage(langId, lessonId) {
  const lang = findLanguage(langId);
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  let units = null;
  try { units = JSON.parse(localStorage.getItem("pylab.curriculum." + langId) || "null"); } catch {}
  if (!units) {
    main.innerHTML = `
      <div class="tabs"><div class="tab active">${lang.name} lesson</div></div>
      <div class="page-narrow">
        <div class="h1">No ${lang.name} curriculum yet</div>
        <div class="subtle" style="margin-bottom:14px;">Generate one first.</div>
        <a class="btn primary" href="lessons.html">← Back to Lessons</a>
      </div>
    `;
    return;
  }

  let unit = null, lessonMeta = null, prev = null, next = null;
  const flat = [];
  for (const u of units) for (const l of (u.lessons || [])) {
    flat.push({ unit: u, lesson: l });
    if (l.id === lessonId) { unit = u; lessonMeta = l; }
  }
  const idx = flat.findIndex(x => x.lesson.id === lessonId);
  if (idx > 0) prev = flat[idx - 1].lesson;
  if (idx >= 0 && idx < flat.length - 1) next = flat[idx + 1].lesson;
  if (!lessonMeta) {
    main.innerHTML = `<div class="page-narrow"><div class="h1">Lesson not found</div><a class="btn" href="lessons.html">← Lessons</a></div>`;
    return;
  }

  sidebar.innerHTML = `
    <div class="sb-header">${escapeHTML(unit.title)}</div>
    ${(unit.lessons || []).map(l => `
      <a class="sb-item ${l.id === lessonId ? "active" : ""} ${State.data.completedLessons[l.id] ? "done" : ""}"
         href="lesson.html?lang=${langId}&id=${encodeURIComponent(l.id)}">
        <span>${escapeHTML(l.title)}</span>
      </a>
    `).join("")}
    <div class="sb-section"></div>
    <a class="sb-item" href="lessons.html">← All ${lang.name} lessons</a>
  `;

  const CACHE = `pylab.lesson.${langId}.${lessonId}`;
  let body = null;
  try { body = JSON.parse(localStorage.getItem(CACHE) || "null"); } catch {}
  if (!body) body = await generateAILessonBody(lang, unit, lessonMeta, CACHE);
  if (!body) return;

  paintAILesson(lang, unit, lessonMeta, body, prev, next);
}

async function generateAILessonBody(lang, unit, lessonMeta, cacheKey) {
  const main = document.getElementById("main");
  main.innerHTML = `
    <div class="tabs"><div class="tab active">${escapeHTML(lessonMeta.title)}</div></div>
    <div class="page-narrow">
      <div class="h1">Generating lesson…</div>
      <div class="subtle">First open for this lesson. The tutor is authoring prose and exercises.</div>
      <div style="margin-top:24px;text-align:center;"><div class="ai-dot" style="width:24px;height:24px;margin:0 auto;"></div></div>
      <div id="gen-error" style="margin-top:12px;"></div>
    </div>
  `;
  if (!AI.available()) {
    document.getElementById("gen-error").innerHTML = `<div class="feedback bad">No Groq key configured. Add one in <a href="settings.html#ai">Settings</a>.</div>`;
    return null;
  }
  const sys = `You write programming lessons as strict JSON. Return ONLY JSON.\n\nSchema:\n{\n  "prose": "markdown lesson body, 3-6 short paragraphs with at least one code example. Use fenced ${lang.id} code blocks.",\n  "exercise": {\n    "prompt": "one-paragraph task statement",\n    "starter": "starter code in ${lang.name}",\n    "hints": ["hint 1", "hint 2", "hint 3"],\n    "solution": "full reference solution",\n    "tests": "human-readable rubric of what a correct solution must demonstrate"\n  }\n}\n\nFocus this lesson tightly on the topic.`;
  try {
    const data = await AI.json([
      { role: "system", content: sys },
      { role: "user", content: `Language: ${lang.name}\nUnit: ${unit.title} — ${unit.summary || ""}\nLesson: ${lessonMeta.title} — ${lessonMeta.summary || ""}\nTopics: ${(lessonMeta.topics || []).join(", ")}` }
    ], { maxTokens: 2200, temperature: 0.5 });
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (e) {
    document.getElementById("gen-error").innerHTML = `<div class="feedback bad">${escapeHTML(AI.friendlyError(e))}</div>`;
    return null;
  }
}

function paintAILesson(lang, unit, lessonMeta, body, prev, next) {
  const main = document.getElementById("main");
  const ex = body.exercise || {};
  main.innerHTML = `
    <div class="tabs">
      <div class="tab active">${escapeHTML(lessonMeta.title)}.${lang.ext}</div>
    </div>
    <div class="lesson-layout">
      <article class="lesson-prose">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <a href="lessons.html" class="subtle">← All lessons</a>
          <span class="ai-badge">AI</span>
          <span class="tag">${lang.name}</span>
        </div>
        <h1>${escapeHTML(lessonMeta.title)}</h1>
        <div id="prose"></div>
      </article>
      <section class="lesson-exercise">
        <div class="exercise-prompt">
          <div class="label">Exercise</div>
          <div class="task">${escapeHTML(ex.prompt || "Write your code and click Check.")}</div>
        </div>
        <div class="editor-wrap">
          <div class="editor-toolbar">
            <span class="file">${escapeHTML(lessonMeta.id)}.${lang.ext}</span>
            <span class="spacer"></span>
            <span>${escapeHTML(lang.name)}</span>
          </div>
          <div id="editor" style="flex:1;"></div>
          <div class="output-pane" style="height:240px;">
            <div class="output-tabs">
              <div class="otab active">Output</div>
              <div class="spacer"></div>
              <div class="actions">
                <button class="ai-btn" id="ai-coach">Ask AI</button>
                <button class="btn ghost" id="hint-btn">Hint</button>
                <button class="btn ghost" id="solution-btn">Solution</button>
              </div>
            </div>
            <div class="output-body" id="output"><span class="dim">Run or check to see results.</span></div>
          </div>
          <div class="exercise-controls">
            <button class="btn" id="reset-btn">Reset</button>
            <button class="btn" id="run-btn">▶ Run</button>
            <button class="btn primary" id="check-btn">Check (AI)</button>
            <span class="spacer"></span>
            ${prev ? `<a class="btn" href="lesson.html?lang=${lang.id}&id=${encodeURIComponent(prev.id)}">← Prev</a>` : ""}
            ${next ? `<a class="btn primary" href="lesson.html?lang=${lang.id}&id=${encodeURIComponent(next.id)}">Next →</a>` : ""}
          </div>
        </div>
      </section>
    </div>
  `;

  document.getElementById("prose").innerHTML = renderMarkdown(body.prose || "");

  const editor = CodeEditor(document.getElementById("editor"), ex.starter || "", { onRun: doRun });
  const out = document.getElementById("output");
  Runtime.bindOutput(out);
  let hintIdx = -1;

  document.getElementById("reset-btn").onclick = () => editor.setValue(ex.starter || "");
  document.getElementById("run-btn").onclick = doRun;
  document.getElementById("hint-btn").onclick = () => {
    hintIdx = Math.min((ex.hints || []).length - 1, hintIdx + 1);
    out.innerHTML = `<div class="feedback hint"><b>Hint ${hintIdx + 1}:</b> ${escapeHTML((ex.hints || [])[hintIdx] || "No more hints.")}</div>`;
  };
  document.getElementById("solution-btn").onclick = () => {
    if (!confirm("Reveal solution? Try first for the learning effect.")) return;
    editor.setValue(ex.solution || "// no solution");
  };
  document.getElementById("ai-coach").onclick = () => openCoach(
    { id: lessonMeta.id, title: lessonMeta.title, prose: body.prose },
    { prompt: ex.prompt, solution: ex.solution },
    editor
  );
  document.getElementById("check-btn").onclick = doCheck;

  async function doRun() {
    out.innerHTML = "";
    await Runtime.runFor(editor.getValue(), lang.id);
    if (out.children.length === 0) out.innerHTML = `<span class="dim">(no output)</span>`;
  }
  async function doCheck() {
    if (!AI.available()) {
      out.innerHTML = `<div class="feedback bad">AI verification needs a Groq key.</div>`;
      return;
    }
    out.innerHTML = `<span class="dim">Grading with AI…</span>`;
    try {
      const verdict = await AI.json([
        { role: "system", content: `You are a strict code grader for ${lang.name}. Reply ONLY with JSON: {"pass": <bool>, "summary": "<one-line>", "notes": "<2-4 sentence feedback>"}.` },
        { role: "user", content: `Exercise: ${ex.prompt}\n\nMust demonstrate:\n${ex.tests || "(judge by the prompt)"}\n\nSubmitted ${lang.name}:\n${editor.getValue()}` }
      ], { maxTokens: 400, temperature: 0.2 });
      out.innerHTML = "";
      const ok = !!verdict?.pass;
      const fb = document.createElement("div");
      fb.className = "feedback " + (ok ? "ok" : "bad");
      fb.innerHTML = `<b>${ok ? "✓" : "✗"} ${escapeHTML(verdict?.summary || "")}</b><div style="margin-top:6px;">${escapeHTML(verdict?.notes || "")}</div>`;
      out.appendChild(fb);
      Tracker.recordAttempt({
        id: `lesson:${lang.id}:${lessonMeta.id}`,
        topic: lessonMeta.topics || [unit.title],
        ok,
        kind: "lesson",
        ref: lessonMeta.id,
      });
      if (ok) {
        const wasNew = State.completeLesson(lessonMeta.id, 15);
        if (wasNew) {
          const extra = document.createElement("div");
          extra.className = "feedback ok"; extra.style.marginTop = "6px";
          extra.innerHTML = `🎉 Lesson complete · <b>+15 XP</b>`;
          out.appendChild(extra);
        }
        appendAIActionRow(out, "ok", { code: editor.getValue(), ex: { prompt: ex.prompt }, lesson: { title: lessonMeta.title, prose: body.prose } });
      } else {
        appendAIActionRow(out, "bad", { code: editor.getValue(), ex: { prompt: ex.prompt }, lesson: { title: lessonMeta.title, prose: body.prose }, error: verdict?.notes || "", stdout: "" });
      }
    } catch (e) {
      out.innerHTML = `<div class="feedback bad">${escapeHTML(AI.friendlyError(e))}</div>`;
    }
  }
}
