// ============================================================
// AI panel — reusable side drawer that streams responses.
//
//   AIPanel.open({ title, subtitle, messages, model, onClose })
//     -> opens drawer, streams response, returns promise
//
//   AIPanel.askChoice({ title, prompt, choices })
//     -> renders selectable buttons (for hint ladder etc.)
//
// Designed to feel like a code-editor sidebar, not a chat bubble.
// ============================================================

const AIPanel = (() => {

  function ensureRoot() {
    let root = document.getElementById("ai-panel");
    if (root) return root;
    root = document.createElement("aside");
    root.id = "ai-panel";
    root.className = "ai-panel";
    root.innerHTML = `
      <header class="ai-panel-header">
        <div class="ai-panel-title">
          <div class="ai-dot"></div>
          <div>
            <div class="t">AI tutor</div>
            <div class="s">Groq · streaming</div>
          </div>
        </div>
        <div class="ai-panel-actions">
          <button class="btn ghost" id="ai-stop" title="Stop">⏹</button>
          <button class="btn ghost" id="ai-clear" title="Clear">⌫</button>
          <button class="btn ghost" id="ai-close" title="Close (Esc)">×</button>
        </div>
      </header>
      <div class="ai-body" id="ai-body"></div>
      <footer class="ai-panel-footer" id="ai-footer"></footer>
    `;
    document.body.appendChild(root);
    root.querySelector("#ai-close").onclick = close;
    root.querySelector("#ai-stop").onclick = () => { state.abort?.abort(); };
    root.querySelector("#ai-clear").onclick = () => { root.querySelector("#ai-body").innerHTML = ""; };
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && root.classList.contains("open")) close();
    });
    return root;
  }

  const state = { open: false, abort: null };

  function open({ title, subtitle, footerHTML, transcriptHTML } = {}) {
    const root = ensureRoot();
    root.classList.add("open");
    root.querySelector(".t").textContent = title || "AI tutor";
    root.querySelector(".s").textContent = subtitle || "Groq · streaming";
    if (footerHTML !== undefined) root.querySelector("#ai-footer").innerHTML = footerHTML;
    if (transcriptHTML !== undefined) root.querySelector("#ai-body").innerHTML = transcriptHTML;
    state.open = true;
    return root;
  }

  function close() {
    state.abort?.abort();
    const root = document.getElementById("ai-panel");
    if (root) root.classList.remove("open");
    state.open = false;
  }

  function body() { return ensureRoot().querySelector("#ai-body"); }
  function footer() { return ensureRoot().querySelector("#ai-footer"); }

  function append(html) {
    const b = body();
    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    b.appendChild(wrap);
    b.scrollTop = b.scrollHeight;
    return wrap;
  }

  function userTurn(text) {
    return append(`<div class="ai-turn user"><div class="ai-author">you</div><div class="ai-content">${escapeHTML(text)}</div></div>`);
  }

  function aiTurn() {
    const node = append(`<div class="ai-turn ai"><div class="ai-author">pylab</div><div class="ai-content"></div></div>`);
    return node.querySelector(".ai-content");
  }

  // Stream messages into a fresh AI turn. Returns final text.
  async function ask(messages, opts = {}) {
    if (!AI.available()) {
      const node = aiTurn();
      node.innerHTML = `<div class="feedback bad">No Groq API key configured. Add one in <a href="settings.html#ai">Settings</a>.</div>`;
      return "";
    }
    const target = aiTurn();
    state.abort = new AbortController();
    try {
      const text = await AI.into(target, messages, { ...opts, signal: state.abort.signal });
      return text;
    } catch (e) {
      // AI.into already painted the error
      return "";
    } finally {
      state.abort = null;
    }
  }

  // Render a question + clickable choices in the footer. Returns promise of pick.
  function pick(prompt, choices) {
    return new Promise(resolve => {
      const f = footer();
      f.innerHTML = `
        <div class="ai-pick">
          <div class="ai-pick-prompt">${escapeHTML(prompt)}</div>
          <div class="ai-pick-row">
            ${choices.map((c, i) => `<button class="btn" data-i="${i}">${escapeHTML(c.label)}</button>`).join("")}
          </div>
        </div>
      `;
      f.querySelectorAll("[data-i]").forEach(b => b.onclick = () => {
        f.innerHTML = "";
        resolve(choices[+b.dataset.i]);
      });
    });
  }

  function setFooter(html) { footer().innerHTML = html; }

  return { open, close, ask, append, userTurn, aiTurn, pick, setFooter, body };
})();

window.AIPanel = AIPanel;
