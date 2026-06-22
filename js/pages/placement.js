// ============================================================
// Find Your Level — adaptive placement test for any language.
//
// 6 questions. Each is multiple-choice with 4 options. The
// difficulty (1=easy to 5=expert) starts at 3 and walks up/down
// by 1 on correct/wrong answers. After the run we average the
// difficulty levels the user got right and round to find their
// placement level (1-5). That maps to a recommended starting unit;
// with the user's OK we mark earlier lessons complete and jump them
// there.
//
// All questions are AI-generated so the quiz is fresh and
// language-aware (Python, JS, Java, Rust, …).
// ============================================================

function renderPlacement() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  const params = new URLSearchParams(location.search);
  const langId = params.get("lang") || (State.data.lang || "python");
  const lang = findLanguage(langId);

  const QUESTIONS = 6;

  // --- Sidebar: just a brief description and a "back" link ---
  sidebar.innerHTML = `
    <div class="sb-header">${lang.name} placement</div>
    <div style="padding:6px 14px;font-size:12px;color:var(--fg-dim);line-height:1.55;">
      Six quick questions. The quiz adapts as you answer — each
      right answer raises the difficulty, each wrong one drops it.
      At the end we recommend a starting unit.
    </div>
    <div class="sb-section"></div>
    <a class="sb-item" href="lessons.html">← Back to lessons</a>
  `;

  // --- State within this run ---
  let difficulty = 3;
  let questionIndex = 0;
  const history = []; // { question, choices, answer, picked, correct, difficulty }
  const previousPrompts = []; // avoid AI repeating questions

  paintIntro();

  // ---------- screens ----------
  function paintIntro() {
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Find Your Level · ${escapeHTML(lang.name)}</div></div>
      <div class="page-narrow">
        <div class="h1">Find your ${escapeHTML(lang.name)} level</div>
        <div class="subtle" style="margin-bottom:18px;">
          ${QUESTIONS} multiple-choice questions, ~3 minutes. We start at a
          middle difficulty and adapt as you go. Skip ahead to wherever
          you actually belong instead of grinding through the basics.
        </div>
        <div class="card" style="margin-bottom:14px;">
          <div style="font-weight:600;color:var(--fg-strong);margin-bottom:6px;">How it works</div>
          <ol style="margin:0;padding-left:20px;font-size:13px;line-height:1.7;">
            <li>Each correct answer raises the next question's difficulty.</li>
            <li>Each wrong answer lowers it.</li>
            <li>We score you on the levels you got right — not raw correct count.</li>
            <li>Skip the units you've already mastered, with one click.</li>
          </ol>
        </div>
        ${AI.available() ? "" : `
          <div class="feedback bad" style="margin-bottom:14px;">
            Placement uses AI. Configure a Groq key in
            <a href="settings.html#ai">Settings</a> to enable it.
          </div>
        `}
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn primary" id="start-btn" ${AI.available() ? "" : "disabled"}>Start placement</button>
          <a class="btn" href="lessons.html">Maybe later</a>
        </div>
      </div>
    `;
    const start = document.getElementById("start-btn");
    if (start) start.onclick = async () => {
      questionIndex = 0;
      difficulty = 3;
      history.length = 0;
      previousPrompts.length = 0;
      await loadAndPaintQuestion();
    };
  }

  async function loadAndPaintQuestion() {
    paintQuestionLoading();
    const q = await generateQuestion(lang, difficulty, previousPrompts);
    if (!q) {
      paintError();
      return;
    }
    previousPrompts.push(q.question || q.q || "");
    paintQuestion(q);
  }

  function paintQuestionLoading() {
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Question ${questionIndex + 1} of ${QUESTIONS}</div></div>
      <div class="page-narrow">
        <div class="h1">
          <span class="skel skel-line w70" style="height:24px;display:inline-block;width:60%;"></span>
        </div>
        ${progressBarHTML()}
        <div class="skel-card" style="margin-top:18px;">
          <span class="skel skel-line"></span>
          <span class="skel skel-line w70"></span>
          <span class="skel skel-line w40"></span>
        </div>
        <div class="subtle" style="margin-top:14px;">Generating a question at difficulty ${difficulty}/5…</div>
      </div>
    `;
  }

  function paintQuestion(q) {
    const choices = q.choices || [];
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Question ${questionIndex + 1} of ${QUESTIONS}</div></div>
      <div class="page-narrow">
        ${progressBarHTML()}
        <div style="display:flex;gap:6px;margin-bottom:8px;align-items:center;">
          <span class="tag">${escapeHTML(q.topic || "Concept")}</span>
          <span class="tag">Difficulty ${difficulty}/5</span>
        </div>
        <div class="h1" style="font-size:20px;line-height:1.4;">${escapeHTML(q.question || q.q || "")}</div>
        ${q.code ? `<pre class="ai-code" style="margin-top:10px;">${escapeHTML(q.code)}</pre>` : ""}
        <div id="choices" style="display:flex;flex-direction:column;gap:8px;margin-top:18px;">
          ${choices.map((c, i) => `
            <button class="placement-choice" data-i="${i}"
              style="text-align:left;padding:12px 14px;border:1px solid var(--border);background:var(--bg-elev);border-radius:6px;font-family:var(--font-mono);font-size:13px;color:var(--fg);cursor:pointer;transition:border-color 0.12s, background 0.12s;">
              <span style="color:var(--fg-mute);margin-right:8px;">${String.fromCharCode(65 + i)}.</span>${escapeHTML(c)}
            </button>
          `).join("")}
        </div>
        <div id="feedback" style="margin-top:14px;"></div>
      </div>
    `;
    document.querySelectorAll(".placement-choice").forEach(btn => {
      btn.onmouseenter = () => { if (!btn.disabled) btn.style.borderColor = "var(--accent)"; };
      btn.onmouseleave = () => { if (!btn.disabled) btn.style.borderColor = "var(--border)"; };
      btn.onclick = () => handleAnswer(q, parseInt(btn.dataset.i, 10));
    });
  }

  function progressBarHTML() {
    const pct = Math.round((questionIndex / QUESTIONS) * 100);
    return `
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--fg-mute);margin-bottom:4px;font-family:var(--font-mono);">
        <span>Question ${questionIndex + 1} / ${QUESTIONS}</span>
        <span>${pct}%</span>
      </div>
      <div class="progress-track" style="margin-bottom:14px;">
        <div class="progress-fill" style="width:${pct}%;"></div>
      </div>
    `;
  }

  async function handleAnswer(q, picked) {
    const correct = picked === q.answer;
    history.push({ ...q, picked, correct, difficulty });
    const buttons = document.querySelectorAll(".placement-choice");
    buttons.forEach((b, i) => {
      b.disabled = true;
      b.style.cursor = "default";
      if (i === q.answer) {
        b.style.borderColor = "var(--green)";
        b.style.background = "rgba(74, 194, 138, 0.10)";
      } else if (i === picked) {
        b.style.borderColor = "var(--red)";
        b.style.background = "rgba(239, 107, 107, 0.10)";
      }
    });
    const fb = document.getElementById("feedback");
    fb.innerHTML = `
      <div class="feedback ${correct ? "ok" : "bad"}" style="margin-bottom:10px;">
        <b>${correct ? "✓ Correct." : "✗ Not quite."}</b>
        ${q.explain ? "<div style='margin-top:4px;'>" + escapeHTML(q.explain) + "</div>" : ""}
      </div>
      <button class="btn primary" id="next-btn">${questionIndex === QUESTIONS - 1 ? "See results" : "Next question →"}</button>
    `;
    document.getElementById("next-btn").onclick = async () => {
      difficulty = Math.max(1, Math.min(5, difficulty + (correct ? 1 : -1)));
      questionIndex += 1;
      if (questionIndex >= QUESTIONS) paintResults();
      else await loadAndPaintQuestion();
    };
  }

  function paintResults() {
    const correctCount = history.filter(h => h.correct).length;
    const correctDifficulties = history.filter(h => h.correct).map(h => h.difficulty);
    const placementLevel = correctDifficulties.length
      ? Math.round(correctDifficulties.reduce((a, b) => a + b, 0) / correctDifficulties.length)
      : 1;

    // Map placement level (1-5) → starting unit index in the curriculum.
    const units = unitsForLang(langId);
    const recommendedUnitIdx = mapLevelToUnitIndex(placementLevel, units.length);
    const recommendedUnit = units[recommendedUnitIdx];
    const lessonsToMarkComplete = collectLessonsBefore(units, recommendedUnitIdx);

    // Persist placement result
    if (!State.data.placement) State.data.placement = {};
    State.data.placement[langId] = {
      level: placementLevel,
      at: Date.now(),
      correct: correctCount,
      total: QUESTIONS,
    };
    State.save();

    main.innerHTML = `
      <div class="tabs"><div class="tab active">Placement results</div></div>
      <div class="page-narrow">
        <div class="h1">You scored ${correctCount} / ${QUESTIONS}</div>
        <div class="subtle" style="margin-bottom:18px;">
          Average difficulty of your correct answers: <b>${placementLevel}/5</b>.
        </div>

        <div class="card" style="margin-bottom:14px;border-left:3px solid var(--accent);">
          <div style="font-weight:600;color:var(--fg-strong);margin-bottom:6px;font-size:14px;">
            Recommended starting point
          </div>
          <div style="font-size:16px;color:var(--fg-strong);margin-bottom:4px;">
            ${escapeHTML(recommendedUnit ? recommendedUnit.title : "Foundations")}
          </div>
          <div class="subtle" style="font-size:13px;">
            ${escapeHTML(recommendedUnit ? (recommendedUnit.summary || "") : "Start from the very beginning.")}
          </div>
          ${lessonsToMarkComplete.length > 0 ? `
            <div style="margin-top:10px;font-size:12px;color:var(--fg-dim);">
              Click "Skip ahead" and we'll mark <b>${lessonsToMarkComplete.length} earlier lesson${lessonsToMarkComplete.length === 1 ? "" : "s"}</b>
              as complete so you start fresh at ${escapeHTML(recommendedUnit.title)}.
            </div>
          ` : ""}
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${lessonsToMarkComplete.length > 0 ? `
            <button class="btn primary" id="skip-ahead">Skip ahead to ${escapeHTML(recommendedUnit.title)} →</button>
          ` : ""}
          <a class="btn" href="lessons.html">Open lessons</a>
          <button class="btn ghost" id="retake">Retake placement</button>
        </div>

        <details style="margin-top:24px;">
          <summary style="cursor:pointer;color:var(--fg-dim);font-size:13px;">Review your answers</summary>
          <div style="margin-top:10px;display:flex;flex-direction:column;gap:10px;">
            ${history.map((h, i) => `
              <div class="card" style="padding:10px 14px;border-left:3px solid ${h.correct ? "var(--green)" : "var(--red)"};">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <span style="font-family:var(--font-mono);font-size:11px;color:var(--fg-mute);">Q${i + 1} · Difficulty ${h.difficulty}/5</span>
                  <span class="tag ${h.correct ? "green" : "red"}">${h.correct ? "✓" : "✗"}</span>
                </div>
                <div style="font-size:13px;color:var(--fg-strong);margin-bottom:4px;">${escapeHTML(h.question || h.q || "")}</div>
                ${h.explain ? `<div class="subtle" style="font-size:12px;">${escapeHTML(h.explain)}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </details>
      </div>
    `;
    document.getElementById("retake")?.addEventListener("click", () => paintIntro());
    const skip = document.getElementById("skip-ahead");
    if (skip) skip.onclick = () => {
      if (!confirm(`Mark ${lessonsToMarkComplete.length} earlier lesson${lessonsToMarkComplete.length === 1 ? "" : "s"} as complete and skip ahead to ${recommendedUnit.title}?`)) return;
      for (const id of lessonsToMarkComplete) {
        State.data.completedLessons[id] = true;
      }
      State.save();
      State.toast(`Skipped ahead — ${lessonsToMarkComplete.length} lessons marked complete`);
      location.href = `lessons.html#${recommendedUnit.id}`;
    };
  }

  function paintError() {
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Placement</div></div>
      <div class="page-narrow">
        <div class="h1">Couldn't generate a question.</div>
        <div class="subtle">Either the AI key is missing or the network failed. Try again in a moment.</div>
        <div style="margin-top:14px;display:flex;gap:8px;">
          <button class="btn primary" onclick="location.reload()">Try again</button>
          <a class="btn" href="lessons.html">Back to lessons</a>
        </div>
      </div>
    `;
  }
}

// ---------- helpers ----------

function unitsForLang(langId) {
  if (langId === "python") return window.LESSONS || [];
  // For non-Python: prefer cached AI curriculum, fall back to baked default.
  try {
    const raw = localStorage.getItem("pylab.curriculum." + langId);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return (window.DEFAULT_CURRICULA && window.DEFAULT_CURRICULA[langId]) || [];
}

function mapLevelToUnitIndex(level, unitsCount) {
  // 1 → unit 0; 2 → ~quarter; 3 → ~half; 4 → ~three-quarters; 5 → near the end.
  const fraction = (level - 1) / 4;     // 0…1
  const idx = Math.round(fraction * Math.max(0, unitsCount - 1) * 0.85);
  return Math.max(0, Math.min(unitsCount - 1, idx));
}

function collectLessonsBefore(units, stopUnitIdx) {
  const ids = [];
  for (let i = 0; i < stopUnitIdx; i++) {
    const u = units[i];
    if (!u || !u.lessons) continue;
    for (const l of u.lessons) ids.push(l.id);
  }
  return ids;
}

async function generateQuestion(lang, difficulty, previousPrompts = []) {
  if (!AI.available()) return null;
  const sys = `You generate ONE multiple-choice placement question for a ${lang.name} learner at difficulty ${difficulty} out of 5.

Difficulty scale:
  1 = absolute beginner (syntax, hello world, types)
  2 = beginner (loops, conditions, simple functions)
  3 = intermediate (collections, comprehensions, scope)
  4 = upper-intermediate (OOP, decorators, async, generics)
  5 = expert (advanced patterns, internals, performance)

Return strict JSON only, no markdown:
{
  "question": "human-readable question prompt",
  "code":     "optional code snippet shown above the choices (leave blank if not needed)",
  "choices":  ["A","B","C","D"],
  "answer":   <index 0-3 of the correct choice>,
  "topic":    "one or two-word concept name",
  "explain":  "one short sentence explaining the answer"
}

Constraints:
- Exactly 4 choices, only one correct.
- 'answer' is an integer index, not the text.
- No trick wording. No 'all of the above'.
- ${lang.name} only.
- Avoid any of these prompts the user just saw: ${previousPrompts.slice(-5).map(p => `"${p.slice(0, 80)}"`).join(", ") || "(none yet)"}`;
  try {
    const data = await AI.json([
      { role: "system", content: sys },
      { role: "user",   content: `Give me one ${lang.name} question at difficulty ${difficulty}/5.` }
    ], { maxTokens: 800, temperature: 0.7, speed: "fast" });
    return normalizeQuestion(data);
  } catch (e) {
    console.warn("[placement] generate failed:", e?.message || e);
    return null;
  }
}

// Models occasionally return slightly different shapes: `options`
// instead of `choices`, a letter ("B") instead of an integer, or
// the answer text rather than its index. Normalize all of that so
// the rest of the flow can rely on a strict { question, choices,
// answer (number 0-3), topic, explain } shape.
function normalizeQuestion(data) {
  if (!data || typeof data !== "object") return null;
  let choices = data.choices || data.options || data.answers;
  if (!Array.isArray(choices)) return null;
  choices = choices.map(c => typeof c === "string" ? c : (c?.text || c?.label || String(c)));
  if (choices.length < 2) return null;
  // Trim or pad to 4 for consistent UI; favor trimming the tail.
  if (choices.length > 4) choices = choices.slice(0, 4);

  let answer = data.answer;
  if (typeof answer === "string") {
    const s = answer.trim();
    // Letter form: "A" / "B" / "C" / "D"
    if (/^[A-Da-d]$/.test(s)) answer = s.toUpperCase().charCodeAt(0) - 65;
    // Numeric string: "0" / "1" / etc
    else if (/^[0-3]$/.test(s)) answer = parseInt(s, 10);
    // Otherwise treat as the answer TEXT and find its index
    else {
      const idx = choices.findIndex(c => c.trim().toLowerCase() === s.toLowerCase());
      answer = idx >= 0 ? idx : NaN;
    }
  }
  if (typeof answer !== "number" || isNaN(answer)) return null;
  if (answer < 0 || answer >= choices.length) return null;

  const question = data.question || data.q || data.prompt;
  if (!question || typeof question !== "string") return null;

  return {
    question,
    code: typeof data.code === "string" ? data.code : "",
    choices,
    answer,
    topic: data.topic || data.concept || "Concept",
    explain: data.explain || data.explanation || "",
  };
}
