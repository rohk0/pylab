// Settings — theme, editor prefs, data export/import, reset.

function renderSettings() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  sidebar.innerHTML = `
    <div class="sb-header">Settings</div>
    <a class="sb-item" href="#ai">AI · Groq</a>
    <a class="sb-item" href="#appearance">Appearance</a>
    <a class="sb-item" href="#editor">Editor</a>
    <a class="sb-item" href="#data">Data</a>
    <a class="sb-item" href="#about">About</a>
  `;
  const target = location.hash.slice(1);
  if (target) {
    const match = sidebar.querySelector(`[href="#${target}"]`);
    if (match) match.classList.add("active");
  } else {
    sidebar.querySelector('[href="#ai"]').classList.add("active");
  }

  const s = State.data.settings;
  const stats = {
    lessons: Object.keys(State.data.completedLessons).length,
    challenges: Object.keys(State.data.completedChallenges).length,
    quizzes: Object.keys(State.data.completedQuizzes).length,
    notes: State.data.notes.length,
    files: State.data.playgroundFiles.length,
  };

  const aiKey = localStorage.getItem("pylab.ai.apiKey") || "";
  const aiModel = localStorage.getItem("pylab.ai.model") || "";
  const usingDefault = !aiKey && !!PYLAB_CONFIG.GROQ_API_KEY;
  const status = AI.available()
    ? (usingDefault ? `<span class="ai-badge">Default key</span>` : `<span class="ai-badge">Custom key</span>`)
    : `<span class="tag red">Not configured</span>`;

  main.innerHTML = `
    <div class="tabs"><div class="tab active">Settings</div></div>
    <div class="page-narrow">
      <section id="ai">
        <div class="h1">AI · Groq <span style="margin-left:8px;">${status}</span></div>
        <div class="card">
          <div class="subtle" style="margin-bottom:8px;">
            All AI features (coach, debugger, review, generation) run through Groq. Your key stays on this machine.
            ${PYLAB_CONFIG.GROQ_API_KEY ? `A default key is bundled with the site — providing your own is recommended for security and quota.` : ""}
          </div>
          <label style="display:block;margin-top:10px;">
            <div class="subtle" style="margin-bottom:4px;">Your Groq API key</div>
            <input id="ai-key" type="password" autocomplete="off" placeholder="gsk_…" value="${escapeHTML(aiKey)}" style="width:100%;font-family:var(--font-mono);" />
            <div class="subtle" style="margin-top:4px;font-size:11px;">
              Get one at <a href="https://console.groq.com/keys" target="_blank">console.groq.com/keys</a>. Stored only in your browser.
            </div>
          </label>
          <label style="display:block;margin-top:10px;">
            <div class="subtle" style="margin-bottom:4px;">Model override (optional)</div>
            <select id="ai-model" style="width:100%;">
              <option value="">Default (${PYLAB_CONFIG.GROQ_MODELS.smart})</option>
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (smart)</option>
              <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (fast)</option>
              <option value="meta-llama/llama-4-scout-17b-16e-instruct">llama-4-scout-17b</option>
              <option value="meta-llama/llama-4-maverick-17b-128e-instruct">llama-4-maverick-17b</option>
            </select>
          </label>
          <div style="display:flex;gap:8px;margin-top:14px;">
            <button class="btn primary" id="ai-save">Save</button>
            <button class="btn" id="ai-test">Test connection</button>
            <button class="btn danger" id="ai-clear">Clear key</button>
            <span style="flex:1;"></span>
            <a class="btn" href="chat.html">Open AI Tutor →</a>
          </div>
          <div id="ai-status" style="margin-top:10px;"></div>
        </div>
      </section>

      <section id="appearance-wrap" style="margin-top:18px;">
        <div class="card">
          <label style="display:flex;align-items:center;justify-content:space-between;gap:14px;">
            <div>
              <div style="color:var(--fg-strong);font-weight:500;">Theme</div>
              <div class="subtle">Dark by default. Editor-grade colors.</div>
            </div>
            <select id="theme">
              <option value="dark"${s.theme === "dark" ? " selected" : ""}>Dark</option>
              <option value="light"${s.theme === "light" ? " selected" : ""}>Light</option>
            </select>
          </label>
        </div>
      </section>

      <section id="editor" style="margin-top:18px;">
        <div class="h2">Editor</div>
        <div class="card" style="display:grid;gap:12px;">
          <label style="display:flex;align-items:center;justify-content:space-between;gap:14px;">
            <div>
              <div style="color:var(--fg-strong);font-weight:500;">Tab size</div>
              <div class="subtle">Spaces inserted on Tab.</div>
            </div>
            <select id="tab-size">
              <option value="2"${s.tabSize === 2 ? " selected" : ""}>2 spaces</option>
              <option value="4"${s.tabSize === 4 ? " selected" : ""}>4 spaces (recommended)</option>
              <option value="8"${s.tabSize === 8 ? " selected" : ""}>8 spaces</option>
            </select>
          </label>
        </div>
      </section>

      <section id="data" style="margin-top:18px;">
        <div class="h2">Your data</div>
        <div class="card">
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:12px;">
            <div><div class="subtle" style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">Lessons</div><div style="font-family:var(--font-mono);font-size:16px;color:var(--fg-strong);">${stats.lessons}</div></div>
            <div><div class="subtle" style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">Challenges</div><div style="font-family:var(--font-mono);font-size:16px;color:var(--fg-strong);">${stats.challenges}</div></div>
            <div><div class="subtle" style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">Quizzes</div><div style="font-family:var(--font-mono);font-size:16px;color:var(--fg-strong);">${stats.quizzes}</div></div>
            <div><div class="subtle" style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">Notes</div><div style="font-family:var(--font-mono);font-size:16px;color:var(--fg-strong);">${stats.notes}</div></div>
            <div><div class="subtle" style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">Files</div><div style="font-family:var(--font-mono);font-size:16px;color:var(--fg-strong);">${stats.files}</div></div>
          </div>
          <div class="subtle" style="margin-bottom:10px;">All progress is stored in your browser. Export to back up.</div>
          <div style="display:flex;gap:8px;">
            <button class="btn" id="export-btn">Export progress (.json)</button>
            <label class="btn">
              Import…
              <input type="file" id="import-btn" accept="application/json" style="display:none;" />
            </label>
            <span style="flex:1;"></span>
            <button class="btn danger" id="reset-btn">Reset everything</button>
          </div>
        </div>
      </section>

      <section id="about" style="margin-top:18px;">
        <div class="h2">About</div>
        <div class="card">
          <p style="margin:0 0 8px 0;">
            <b style="color:var(--fg-strong);">pylab</b> — a static, browser-based Python learning workbench.
          </p>
          <p style="margin:0 0 8px 0;" class="subtle">
            Python runs in WebAssembly via <a href="https://pyodide.org" target="_blank">Pyodide</a>. No backend. No tracking. Deployable as static files to GitHub Pages.
          </p>
          <p style="margin:0;" class="subtle">
            Built with vanilla HTML, CSS, and JavaScript.
          </p>
        </div>
      </section>
    </div>
  `;

  // AI key
  const setStatus = (html, kind="ok") => {
    document.getElementById("ai-status").innerHTML = `<div class="feedback ${kind}">${html}</div>`;
  };
  document.getElementById("ai-model").value = aiModel;
  document.getElementById("ai-save").onclick = () => {
    const k = document.getElementById("ai-key").value.trim();
    const m = document.getElementById("ai-model").value;
    if (k) localStorage.setItem("pylab.ai.apiKey", k);
    else localStorage.removeItem("pylab.ai.apiKey");
    if (m) localStorage.setItem("pylab.ai.model", m);
    else localStorage.removeItem("pylab.ai.model");
    setStatus("Saved. Refresh other tabs to pick up the new key.", "ok");
    State.toast("AI settings saved");
  };
  document.getElementById("ai-clear").onclick = () => {
    if (!confirm("Clear your saved Groq key from this browser?")) return;
    localStorage.removeItem("pylab.ai.apiKey");
    document.getElementById("ai-key").value = "";
    setStatus("Custom key cleared.", "info");
  };
  document.getElementById("ai-test").onclick = async () => {
    setStatus("Pinging Groq…", "info");
    try {
      const t = await AI.complete([
        { role: "system", content: "Reply with exactly the word 'pong'." },
        { role: "user", content: "ping" }
      ], { maxTokens: 6, speed: "fast" });
      setStatus(`Connected. Model replied: <code>${escapeHTML(t.trim())}</code>`, "ok");
    } catch (e) {
      setStatus(`Failed: ${escapeHTML(AI.friendlyError(e))}`, "bad");
    }
  };

  document.getElementById("theme").onchange = e => {
    s.theme = e.target.value;
    document.documentElement.setAttribute("data-theme", s.theme);
    State.save();
  };
  document.getElementById("tab-size").onchange = e => {
    s.tabSize = parseInt(e.target.value, 10);
    State.save();
  };
  document.getElementById("export-btn").onclick = () => {
    const blob = new Blob([JSON.stringify(State.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `pylab-progress-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  };
  document.getElementById("import-btn").onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    if (!confirm("Replace your current progress with the imported file?")) return;
    const text = await f.text();
    try {
      const parsed = JSON.parse(text);
      Object.assign(State.data, parsed);
      State.save();
      State.toast("Progress imported");
      location.reload();
    } catch (err) {
      State.toast("Import failed: " + err.message, "bad");
    }
  };
  document.getElementById("reset-btn").onclick = () => State.reset();
}
