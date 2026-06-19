// Quizzes — list view + single-quiz runner with mixed question types.

function renderQuizzes() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  const url = new URLSearchParams(location.search);
  const qid = url.get("id");
  if (qid) return runQuiz(qid);

  sidebar.innerHTML = `
    <div class="sb-header">Quizzes</div>
    ${QUIZZES.map(q => `
      <a class="sb-item ${State.data.completedQuizzes[q.id] ? "done" : ""}" href="quizzes.html?id=${q.id}">
        <span>${escapeHTML(q.title)}</span>
        <span class="badge">${q.questions.length}</span>
      </a>
    `).join("")}
  `;

  main.innerHTML = `
    <div class="tabs"><div class="tab active">Quizzes</div></div>
    <div class="page-wide">
      <div class="h1">Quizzes</div>
      <div class="subtle" style="margin-bottom:18px;">Short topic checks. Mix of multiple choice, fill in the blank, predict-the-output, and debug-the-code.</div>
      <div class="ch-grid">
        ${QUIZZES.map(q => {
          const result = State.data.completedQuizzes[q.id];
          return `
            <a class="ch-card ${result ? "done" : ""}" href="quizzes.html?id=${q.id}" style="text-decoration:none;color:inherit;">
              <div class="title">${escapeHTML(q.title)}</div>
              <div class="desc">${escapeHTML(q.description)}</div>
              <div class="meta">
                <span class="tag">${q.questions.length} questions</span>
                ${result ? `<span class="tag green">${result.score}/${result.total}</span>` : ""}
              </div>
            </a>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function runQuiz(id) {
  const quiz = findQuiz(id);
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  if (!quiz) { main.innerHTML = `<div class="page"><div class="empty"><h3>Quiz not found.</h3></div></div>`; return; }

  let idx = 0;
  const answers = new Array(quiz.questions.length).fill(null);
  const correct = new Array(quiz.questions.length).fill(null);

  sidebar.innerHTML = `
    <div class="sb-header">${escapeHTML(quiz.title)}</div>
    ${quiz.questions.map((_, i) => `
      <div class="sb-item q-jump" data-i="${i}">
        <span>Q${i + 1}</span>
        <span class="badge" id="q-mark-${i}"></span>
      </div>
    `).join("")}
    <div class="sb-section"></div>
    <a class="sb-item" href="quizzes.html">← All quizzes</a>
  `;
  sidebar.querySelectorAll(".q-jump").forEach(el => el.onclick = () => { idx = +el.dataset.i; paint(); });

  function paint() {
    const q = quiz.questions[idx];
    sidebar.querySelectorAll(".q-jump").forEach((el, i) => el.classList.toggle("active", i === idx));
    quiz.questions.forEach((_, i) => {
      const m = document.getElementById("q-mark-" + i);
      if (m) m.textContent = correct[i] === true ? "✓" : correct[i] === false ? "✗" : "";
    });

    let body = "";
    if (q.type === "mcq") {
      body = `
        <div style="display:grid;gap:8px;margin-top:14px;">
          ${q.choices.map((c, i) => `
            <button class="btn ${answers[idx] === i ? "primary" : ""}" data-pick="${i}" style="text-align:left;padding:10px 12px;font-family:var(--font-mono);">
              <span style="color:var(--fg-mute);width:18px;display:inline-block;">${String.fromCharCode(65 + i)}</span>
              <span>${escapeHTML(c)}</span>
            </button>
          `).join("")}
        </div>
      `;
    } else if (q.type === "fill") {
      body = `
        <div style="margin-top:14px;">
          <input id="fill-input" placeholder="your answer" value="${escapeHTML(answers[idx] || "")}" style="width:100%;font-family:var(--font-mono);" />
        </div>
      `;
    } else if (q.type === "predict") {
      body = `
        <div style="margin-top:14px;">
          <div class="subtle" style="margin-bottom:4px;">Expected output:</div>
          <input id="predict-input" placeholder="(exact output)" value="${escapeHTML(answers[idx] || "")}" style="width:100%;font-family:var(--font-mono);" />
        </div>
      `;
    } else if (q.type === "debug") {
      body = `
        <div style="margin-top:8px;border:1px solid var(--border);border-radius:4px;overflow:hidden;height:340px;display:flex;flex-direction:column;">
          <div id="debug-editor" style="flex:1;"></div>
        </div>
        <div class="output-body" id="debug-output" style="background:var(--bg-panel);border:1px solid var(--border);border-top:0;border-radius:0 0 4px 4px;margin-top:-1px;min-height:60px;"><span class="dim">Press Check to test your fix.</span></div>
      `;
    }

    main.innerHTML = `
      <div class="tabs"><div class="tab active">${escapeHTML(quiz.title)} · Q${idx + 1}</div></div>
      <div class="page-narrow">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div class="subtle">${escapeHTML(quiz.title)} · Question ${idx + 1} of ${quiz.questions.length}</div>
            <div class="h1">${q.type === "predict" ? "Predict the output" : q.type === "debug" ? "Debug the code" : q.type === "fill" ? "Fill in the blank" : "Pick the right answer"}</div>
          </div>
          <span class="tag">${q.type}</span>
        </div>

        <pre style="background:var(--bg-elev);border:1px solid var(--border);border-left:3px solid var(--accent);padding:10px 12px;font-family:var(--font-mono);font-size:12.5px;white-space:pre-wrap;border-radius:0 4px 4px 0;margin-top:10px;">${escapeHTML(q.q)}</pre>

        ${body}

        <div id="qfeedback"></div>

        <div style="display:flex;gap:8px;margin-top:14px;align-items:center;">
          <button class="btn" id="prev" ${idx === 0 ? "disabled" : ""}>← Previous</button>
          <button class="btn primary" id="check">Check</button>
          <button class="btn" id="next" ${idx === quiz.questions.length - 1 ? "disabled" : ""}>Next →</button>
          <span style="flex:1;"></span>
          ${idx === quiz.questions.length - 1 ? `<button class="btn success" id="finish">Finish quiz</button>` : ""}
        </div>
      </div>
    `;

    // Wire up
    if (q.type === "mcq") {
      main.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => { answers[idx] = +b.dataset.pick; paint(); });
    }
    if (q.type === "debug") {
      const ed = CodeEditor(document.getElementById("debug-editor"), answers[idx] || q.starter || "", {
        onChange: v => answers[idx] = v
      });
      answers[idx] = answers[idx] || q.starter || "";
      Runtime.bindOutput(document.getElementById("debug-output"));
    }

    document.getElementById("check").onclick = check;
    document.getElementById("prev").onclick = () => { idx--; paint(); };
    document.getElementById("next").onclick = () => { idx++; paint(); };
    if (document.getElementById("finish")) document.getElementById("finish").onclick = finishQuiz;
  }

  async function check() {
    const q = quiz.questions[idx];
    const fb = document.getElementById("qfeedback");
    fb.innerHTML = "";

    let ok = false, reveal = "";
    if (q.type === "mcq") {
      ok = answers[idx] === q.answer;
      reveal = `Correct answer: <b>${String.fromCharCode(65 + q.answer)}.</b> ${escapeHTML(q.choices[q.answer])}`;
    } else if (q.type === "fill") {
      const v = (document.getElementById("fill-input").value || "").trim().toLowerCase();
      answers[idx] = v;
      ok = v === String(q.answer).toLowerCase();
      reveal = `Expected: <code>${escapeHTML(q.answer)}</code>`;
    } else if (q.type === "predict") {
      const v = (document.getElementById("predict-input").value || "").trim();
      answers[idx] = v;
      ok = v === String(q.answer);
      reveal = `Expected output: <code>${escapeHTML(q.answer)}</code>`;
    } else if (q.type === "debug") {
      const r = await Grader.grade(answers[idx] || "", q);
      ok = r.ok;
      reveal = r.ok ? "" : `<pre style="margin:6px 0 0;white-space:pre-wrap;font-family:var(--font-mono);font-size:12px;">${escapeHTML(r.message)}</pre>`;
    }

    correct[idx] = ok;
    const div = document.createElement("div");
    div.className = "feedback " + (ok ? "ok" : "bad");
    div.innerHTML = `<b>${ok ? "✓ Correct." : "✗ Not quite."}</b> ${reveal}`;
    fb.appendChild(div);
    quiz.questions.forEach((_, i) => {
      const m = document.getElementById("q-mark-" + i);
      if (m) m.textContent = correct[i] === true ? "✓" : correct[i] === false ? "✗" : "";
    });
  }

  function finishQuiz() {
    const score = correct.filter(c => c === true).length;
    State.completeQuiz(quiz.id, score, quiz.questions.length, 25);
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Result</div></div>
      <div class="page-narrow">
        <div class="card" style="text-align:center;padding:32px;">
          <div style="font-family:var(--font-mono);font-size:48px;color:var(--accent);">${score}/${quiz.questions.length}</div>
          <div class="h2">${score === quiz.questions.length ? "Perfect run." : score >= quiz.questions.length * 0.7 ? "Solid." : "Worth another try."}</div>
          <div class="subtle">XP awarded based on accuracy.</div>
          <div style="display:flex;gap:8px;justify-content:center;margin-top:16px;">
            <a class="btn" href="quizzes.html">Back to quizzes</a>
            <a class="btn primary" href="quizzes.html?id=${quiz.id}">Retake</a>
          </div>
        </div>
      </div>
    `;
  }

  paint();
}
