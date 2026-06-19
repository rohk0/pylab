// Dedicated AI tutor chat. Remembers turn history in sessionStorage.

function renderChat() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  // History is per-tab via sessionStorage, so reloading keeps context
  // but a new tab starts fresh.
  const HKEY = "pylab.chat.history";
  let history = [];
  try { history = JSON.parse(sessionStorage.getItem(HKEY) || "[]"); } catch {}

  function saveHistory() { sessionStorage.setItem(HKEY, JSON.stringify(history)); }
  function clearHistory() { history = []; saveHistory(); paint(); }

  function paint() {
    sidebar.innerHTML = `
      <div class="sb-header">Tutor</div>
      <div class="sb-item" id="new-chat">＋ New conversation</div>
      <div class="sb-section"></div>
      <div class="sb-header">Quick starts</div>
      <div class="sb-item" data-q="Walk me through Python lists vs tuples with examples.">Lists vs tuples</div>
      <div class="sb-item" data-q="Explain dictionary comprehensions with examples.">Dict comprehensions</div>
      <div class="sb-item" data-q="How does Python handle scope (LEGB rule)?">Scope (LEGB)</div>
      <div class="sb-item" data-q="When should I use a class vs a function in Python?">Class vs function</div>
      <div class="sb-item" data-q="Explain decorators step by step.">Decorators</div>
      <div class="sb-item" data-q="What is the difference between is and == in Python?">is vs ==</div>
      <div class="sb-item" data-q="Show me how to use try/except correctly.">Error handling</div>
      <div class="sb-section"></div>
      <div class="sb-header">Status</div>
      <div style="padding:6px 14px;font-size:11.5px;color:var(--fg-mute);font-family:var(--font-mono);">
        ${AI.available() ? "AI online" : "Configure key →"} <br>
        ${history.length} turn${history.length === 1 ? "" : "s"}
      </div>
    `;
    document.getElementById("new-chat").onclick = clearHistory;
    sidebar.querySelectorAll("[data-q]").forEach(el => el.onclick = () => send(el.dataset.q));

    const recent = history.slice();
    main.innerHTML = `
      <div class="tabs"><div class="tab active">AI Tutor</div></div>
      <div class="chat-shell">
        <div class="chat-stream" id="stream">
          ${recent.length ? "" : welcomeHTML()}
          ${recent.map(turn => `
            <div class="ai-turn ${turn.role === "user" ? "user" : "ai"}">
              <div class="ai-author">${turn.role === "user" ? "you" : "pylab"}</div>
              <div class="ai-content">${turn.role === "user" ? escapeHTML(turn.content) : AI.renderMD(turn.content)}</div>
            </div>
          `).join("")}
        </div>
        <div class="chat-composer">
          ${recent.length ? "" : `
            <div class="chat-suggestions">
              <span class="chip" data-q="Help me with my current lesson">Current lesson</span>
              <span class="chip" data-q="Recommend what I should practice next based on my progress">What should I learn?</span>
              <span class="chip" data-q="Quiz me on a topic I'm weak at">Quiz me</span>
              <span class="chip" data-q="Explain a hard concept simply">Explain simply</span>
            </div>
          `}
          <div class="chat-composer-inner">
            <textarea id="composer" placeholder="Ask anything about Python… (${navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+Enter to send)" rows="1"></textarea>
            <button class="btn primary" id="send-btn">Send</button>
          </div>
        </div>
      </div>
    `;

    const stream = document.getElementById("stream");
    stream.scrollTop = stream.scrollHeight;
    const ta = document.getElementById("composer");
    ta.focus();
    ta.addEventListener("input", () => {
      ta.style.height = "auto";
      ta.style.height = Math.min(200, ta.scrollHeight) + "px";
    });
    ta.addEventListener("keydown", e => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); doSend(); }
    });
    document.getElementById("send-btn").onclick = doSend;
    main.querySelectorAll(".chat-suggestions .chip").forEach(c => c.onclick = () => send(c.dataset.q));
  }

  function welcomeHTML() {
    const weak = Tracker.weakestTopics(2).map(w => w.name).filter(Boolean);
    const ctx = weak.length ? `I noticed you've struggled with **${weak.join(", ")}** lately — want a refresher?` : `Ask me about any Python concept, or paste code to discuss.`;
    return `
      <div class="ai-turn ai">
        <div class="ai-author">pylab</div>
        <div class="ai-content">
          <p>Hi — I'm your Python tutor. ${AI.renderMD(ctx).replace(/^<p>|<\/p>$/g, "")}</p>
          <p>I can:</p>
          <ul>
            <li>Explain concepts at any level (ELI10 to senior-dev).</li>
            <li>Coach you through an exercise without spoiling the answer.</li>
            <li>Review code, debug errors, suggest refactors.</li>
            <li>Recommend what to practice next.</li>
          </ul>
        </div>
      </div>
    `;
  }

  async function send(text) {
    document.getElementById("composer").value = text;
    await doSend();
  }

  async function doSend() {
    const ta = document.getElementById("composer");
    const text = (ta.value || "").trim();
    if (!text) return;
    ta.value = "";
    ta.style.height = "auto";

    history.push({ role: "user", content: text });
    saveHistory();

    const stream = document.getElementById("stream");
    // remove welcome
    if (history.length === 1) stream.innerHTML = "";
    stream.insertAdjacentHTML("beforeend", `
      <div class="ai-turn user"><div class="ai-author">you</div><div class="ai-content">${escapeHTML(text)}</div></div>
      <div class="ai-turn ai" id="ai-pending"><div class="ai-author">pylab</div><div class="ai-content" id="ai-pending-content"></div></div>
    `);
    stream.scrollTop = stream.scrollHeight;

    const ctx = Tracker.summaryString();
    const lang = (typeof activeLanguage === "function") ? activeLanguage() : null;
    const learnerContext = `${lang ? `Active language: ${lang.name}\n\n` : ""}Recent activity:\n${ctx}`;
    const target = document.getElementById("ai-pending-content");
    try {
      const text = await AI.into(target, PROMPTS.chat({
        history: history.map(h => ({ role: h.role, content: h.content })),
        learnerContext,
      }));
      history.push({ role: "assistant", content: text });
      // Keep last 30 turns to stay within token budget.
      if (history.length > 30) history = history.slice(-30);
      saveHistory();
    } catch (e) {
      // already rendered by AI.into
    }
    document.getElementById("ai-pending")?.removeAttribute("id");
    document.getElementById("ai-pending-content")?.removeAttribute("id");
  }

  paint();
}
