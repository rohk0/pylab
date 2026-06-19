// Guided projects — pick a project, walk steps, code in editor.

function renderProjects() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  const hash = location.hash.slice(1);
  const active = PROJECTS.find(p => p.id === hash) || null;

  sidebar.innerHTML = `
    <div class="sb-header">Projects</div>
    ${PROJECTS.map(p => `
      <a class="sb-item ${active && p.id === active.id ? "active" : ""}" href="#${p.id}" data-id="${p.id}">
        <span>${escapeHTML(p.title)}</span>
        <span class="badge">${p.difficulty[0].toUpperCase()}</span>
      </a>
    `).join("")}
  `;

  sidebar.querySelectorAll("[data-id]").forEach(el => el.onclick = () => {
    location.hash = el.dataset.id;
    setTimeout(renderProjects, 0);
  });

  if (active) {
    return renderOneProject(active);
  }

  main.innerHTML = `
    <div class="tabs"><div class="tab active">Projects</div></div>
    <div class="page-wide">
      <div class="h1">Guided projects</div>
      <div class="subtle" style="margin-bottom:18px;">Small, complete builds. Each opens with steps on the left and an editor on the right.</div>

      <div class="ch-grid">
        ${PROJECTS.map(p => {
          const dClass = p.difficulty === "easy" ? "green" : p.difficulty === "medium" ? "yellow" : "red";
          return `
            <a class="ch-card" href="#${p.id}" data-id="${p.id}" style="text-decoration:none;color:inherit;">
              <div class="title">${escapeHTML(p.title)}</div>
              <div class="desc">${escapeHTML(p.summary)}</div>
              <div class="meta">
                <span class="tag ${dClass}">${p.difficulty}</span>
                <span class="tag">${p.minutes} min</span>
                <span class="tag">${p.steps.length} steps</span>
              </div>
            </a>
          `;
        }).join("")}
      </div>
    </div>
  `;

  main.querySelectorAll("[data-id]").forEach(el => el.onclick = () => {
    location.hash = el.dataset.id;
    setTimeout(renderProjects, 0);
  });
}

function renderOneProject(p) {
  const main = document.getElementById("main");
  const dClass = p.difficulty === "easy" ? "green" : p.difficulty === "medium" ? "yellow" : "red";

  main.innerHTML = `
    <div class="tabs">
      <div class="tab active">${escapeHTML(p.title)}.py</div>
    </div>
    <div class="lesson-layout">
      <article class="lesson-prose">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <a href="projects.html" class="subtle">← All projects</a>
        </div>
        <h1>${escapeHTML(p.title)}</h1>
        <div style="display:flex;gap:6px;margin-bottom:14px;">
          <span class="tag ${dClass}">${p.difficulty}</span>
          <span class="tag">${p.minutes} min</span>
        </div>
        <p class="subtle">${escapeHTML(p.summary)}</p>

        <h2>Steps</h2>
        <ol>
          ${p.steps.map((s, i) => `
            <li style="margin-bottom:10px;">
              <b>${escapeHTML(s.title)}</b><br/>
              ${escapeHTML(s.body)}
            </li>
          `).join("")}
        </ol>

        <h2>Tip</h2>
        <p>Use the editor on the right. Press <kbd class="kbd">Ctrl Enter</kbd> to run. Click <b>Open in Playground</b> to keep iterating once you're done.</p>
      </article>
      <section class="lesson-exercise">
        <div class="exercise-prompt">
          <div class="label">Starter</div>
          <div class="task">Open the editor, run, then iterate. ${p.check ? "Click Check to verify your implementation." : ""}</div>
        </div>
        <div class="editor-wrap">
          <div class="editor-toolbar">
            <span class="file">${escapeHTML(p.id)}.py</span>
            <span class="spacer"></span>
            <span>Python 3.11</span>
          </div>
          <div id="editor" style="flex:1;"></div>
          <div class="output-pane">
            <div class="output-tabs">
              <div class="otab active">Output</div>
              <div class="spacer"></div>
              <div class="actions">
                <button class="btn ghost" id="copy-pg">Open in Playground</button>
              </div>
            </div>
            <div class="output-body" id="output"><span class="dim">Run to execute.</span></div>
          </div>
          <div class="exercise-controls">
            <button class="btn" id="reset-btn">Reset</button>
            <button class="btn primary" id="run-btn">▶ Run</button>
            ${p.check ? `<button class="btn success" id="check-btn">Check</button>` : ""}
          </div>
        </div>
      </section>
    </div>
  `;

  const editor = CodeEditor(document.getElementById("editor"), p.starter || "", {
    onRun: doRun
  });
  const output = document.getElementById("output");
  Runtime.bindOutput(output);

  document.getElementById("run-btn").onclick = doRun;
  document.getElementById("reset-btn").onclick = () => editor.setValue(p.starter || "");
  document.getElementById("copy-pg").onclick = () => {
    const enc = btoa(unescape(encodeURIComponent(editor.getValue())));
    location.href = "playground.html?code=" + enc;
  };
  if (p.check) document.getElementById("check-btn").onclick = async () => {
    output.innerHTML = `<span class="dim">Grading…</span>`;
    const r = await Grader.grade(editor.getValue(), p);
    output.innerHTML = "";
    if (r.stdout) { const pre = document.createElement("div"); pre.textContent = r.stdout; output.appendChild(pre); }
    const fb = document.createElement("div");
    fb.className = "feedback " + (r.ok ? "ok" : "bad");
    fb.innerHTML = r.ok ? `<b>✓ Project working.</b>` : `<b>✗ ${r.kind}</b><pre style="margin:6px 0 0;white-space:pre-wrap;font-family:var(--font-mono);font-size:12px;">${escapeHTML(r.message)}</pre>`;
    output.appendChild(fb);
  };

  async function doRun() {
    output.innerHTML = "";
    await Runtime.run(editor.getValue(), p.stdin || "");
    if (output.children.length === 0) output.innerHTML = `<span class="dim">(no output)</span>`;
  }
}
