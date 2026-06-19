// Playground — full-screen editor with file list saved to localStorage.

function renderPlayground() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  if (!State.data.playgroundFiles.length) {
    State.data.playgroundFiles.push({
      id: "f-" + Date.now(),
      name: "scratch.py",
      code: '# Welcome to the Pylab playground.\n# Press Ctrl-Enter to run.\n\nfor i in range(5):\n    print("hi", i)\n',
      updated: Date.now(),
    });
    State.save();
  }

  let activeId = State.data.playgroundFiles[0].id;
  let stdin = "";

  function paint() {
    const files = State.data.playgroundFiles;
    const active = files.find(f => f.id === activeId) || files[0];

    sidebar.innerHTML = `
      <div class="sb-header">
        <span>Files</span>
        <button class="btn ghost" id="new-file" style="padding:0 6px;">＋</button>
      </div>
      ${files.map(f => `
        <div class="sb-item ${f.id === active.id ? "active" : ""}" data-file="${f.id}">
          <span>${escapeHTML(f.name)}</span>
          <span class="badge" data-del="${f.id}" title="Delete">×</span>
        </div>
      `).join("")}
      <div class="sb-section"></div>
      <div class="sb-header">Snippets</div>
      ${[
        ["Hello world", 'print("Hello, world!")'],
        ["List comprehension", "squares = [x*x for x in range(10)]\nprint(squares)"],
        ["Dict iteration", 'd = {"a":1,"b":2,"c":3}\nfor k, v in d.items():\n    print(k, v)'],
        ["Fibonacci", 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n): a, b = b, a + b\n    return a\nprint([fib(i) for i in range(10)])'],
        ["Read input", 'name = input("name? ")\nprint(f"hi {name}")']
      ].map(([name, code]) => `<div class="sb-item" data-snippet='${escapeHTML(JSON.stringify(code))}'>${escapeHTML(name)}</div>`).join("")}
    `;

    sidebar.querySelector("#new-file").onclick = () => {
      const id = "f-" + Date.now();
      State.data.playgroundFiles.push({ id, name: `untitled-${State.data.playgroundFiles.length}.py`, code: "", updated: Date.now() });
      activeId = id;
      State.save();
      paint();
    };
    sidebar.querySelectorAll("[data-file]").forEach(el => {
      el.onclick = (e) => {
        if (e.target.dataset.del) return;
        activeId = el.dataset.file; paint();
      };
    });
    sidebar.querySelectorAll("[data-del]").forEach(el => el.onclick = (e) => {
      e.stopPropagation();
      const id = el.dataset.del;
      if (State.data.playgroundFiles.length === 1) { State.toast("Can't delete the last file.", "bad"); return; }
      if (!confirm("Delete this file?")) return;
      State.data.playgroundFiles = State.data.playgroundFiles.filter(f => f.id !== id);
      activeId = State.data.playgroundFiles[0].id;
      State.save();
      paint();
    });
    sidebar.querySelectorAll("[data-snippet]").forEach(el => el.onclick = () => {
      const code = JSON.parse(el.dataset.snippet);
      editor.setValue(code);
      State.toast("Snippet inserted");
    });

    main.innerHTML = `
      <div class="tabs">
        ${files.map(f => `
          <div class="tab ${f.id === active.id ? "active" : ""}" data-tab="${f.id}">
            <span>${escapeHTML(f.name)}</span>
          </div>
        `).join("")}
      </div>
      <div class="editor-wrap" style="flex:1;">
        <div class="editor-toolbar">
          <input id="fname" value="${escapeHTML(active.name)}" style="background:transparent;border:0;padding:2px 6px;font-family:var(--font-mono);font-size:11.5px;width:200px;" />
          <span class="spacer"></span>
          <button class="ai-btn" id="ai-explain">Explain</button>
          <button class="ai-btn" id="ai-improve">Improve ▾</button>
          <button class="btn ghost" id="copy-btn" title="Copy code">Copy</button>
          <button class="btn ghost" id="share-btn" title="Copy share URL">Share</button>
          <span>Python 3.11</span>
        </div>
        <div id="editor" style="flex:1;"></div>
        <div class="output-pane" style="height:240px;">
          <div class="output-tabs">
            <div class="otab active" data-pane="out">Output</div>
            <div class="otab" data-pane="stdin">Stdin</div>
            <div class="spacer"></div>
            <div class="actions">
              <button class="btn ghost" id="clear-out">Clear</button>
            </div>
          </div>
          <div class="output-body" id="output"><span class="dim">▶ Run to execute. Output appears here.</span></div>
          <div class="output-body" id="stdin-pane" style="display:none;">
            <div class="subtle" style="font-family:var(--font-ui);margin-bottom:4px;">Lines provided to input() calls during the next run.</div>
            <textarea id="stdin-text" style="width:100%;min-height:120px;background:var(--bg-elev);border:1px solid var(--border);border-radius:4px;padding:8px;font-family:var(--font-mono);font-size:12px;">${escapeHTML(stdin)}</textarea>
          </div>
        </div>
        <div class="exercise-controls">
          <button class="btn primary" id="run-btn">▶ Run <span class="kbd" style="margin-left:4px;">Ctrl ↵</span></button>
          <button class="btn" id="reset-runtime">Reset runtime</button>
          <span class="spacer"></span>
          <span class="subtle" id="saved">Saved</span>
        </div>
      </div>
    `;

    const editor = CodeEditor(document.getElementById("editor"), active.code, {
      onChange: code => {
        active.code = code; active.updated = Date.now();
        State.save();
        document.getElementById("saved").textContent = "Saved";
      },
      onRun: () => doRun()
    });

    const out = document.getElementById("output");
    Runtime.bindOutput(out);

    document.getElementById("fname").oninput = e => {
      let v = e.target.value.trim() || "untitled.py";
      if (!v.endsWith(".py")) v += ".py";
      active.name = v; State.save();
      // light refresh of tabs
      document.querySelectorAll(`.tab[data-tab="${active.id}"] span`).forEach(s => s.textContent = v);
    };
    document.getElementById("copy-btn").onclick = async () => {
      await navigator.clipboard.writeText(editor.getValue());
      State.toast("Code copied to clipboard");
    };

    document.getElementById("ai-explain").onclick = () => {
      const code = editor.getValue();
      if (!code.trim()) { State.toast("Editor is empty.", "bad"); return; }
      AIPanel.open({ title: "Explain my code", subtitle: active.name });
      AIPanel.body().innerHTML = "";
      AIPanel.userTurn("Explain this code.");
      AIPanel.ask(PROMPTS.explainCode({ code, withComments: false }));
      AIPanel.setFooter(`
        <div class="ai-pick-row">
          <button class="btn" id="add-comments">Add inline comments</button>
        </div>
      `);
      setTimeout(() => {
        const cb = document.getElementById("add-comments");
        if (cb) cb.onclick = () => {
          AIPanel.userTurn("Add inline comments to my code.");
          AIPanel.ask(PROMPTS.improve({ code, kind: "comments" }));
        };
      }, 0);
    };

    document.getElementById("ai-improve").onclick = (e) => {
      e.stopPropagation();
      const code = editor.getValue();
      if (!code.trim()) { State.toast("Editor is empty.", "bad"); return; }
      showImproveMenu(e.target, code, editor);
    };
    document.getElementById("share-btn").onclick = async () => {
      const enc = btoa(unescape(encodeURIComponent(editor.getValue())));
      const url = location.origin + location.pathname + "?code=" + enc;
      await navigator.clipboard.writeText(url);
      State.toast("Share URL copied");
    };
    document.getElementById("clear-out").onclick = () => out.innerHTML = `<span class="dim">cleared</span>`;
    document.getElementById("reset-runtime").onclick = async () => { await Runtime.reset(); State.toast("Runtime globals cleared"); };
    document.getElementById("run-btn").onclick = doRun;

    document.querySelectorAll("[data-pane]").forEach(el => el.onclick = () => {
      document.querySelectorAll("[data-pane]").forEach(e => e.classList.toggle("active", e === el));
      document.getElementById("output").style.display = el.dataset.pane === "out" ? "" : "none";
      document.getElementById("stdin-pane").style.display = el.dataset.pane === "stdin" ? "" : "none";
    });
    document.getElementById("stdin-text").oninput = e => stdin = e.target.value;

    document.querySelectorAll("[data-tab]").forEach(el => el.onclick = () => { activeId = el.dataset.tab; paint(); });

    async function doRun() {
      out.innerHTML = "";
      await Runtime.run(editor.getValue(), stdin);
      if (out.children.length === 0) out.innerHTML = `<span class="dim">(program ended with no output)</span>`;
    }
  }

  // Decode ?code= share param
  const codeParam = new URLSearchParams(location.search).get("code");
  if (codeParam) {
    try {
      const code = decodeURIComponent(escape(atob(codeParam)));
      const id = "f-" + Date.now();
      State.data.playgroundFiles.unshift({ id, name: "shared.py", code, updated: Date.now() });
      activeId = id;
      State.save();
      history.replaceState({}, "", location.pathname);
    } catch {}
  }

  paint();
}

// Floating dropdown for the Improve button.
function showImproveMenu(btn, code, editor) {
  document.querySelectorAll(".improve-menu").forEach(n => n.remove());
  const r = btn.getBoundingClientRect();
  const menu = document.createElement("div");
  menu.className = "improve-menu";
  menu.style.cssText = `
    position: fixed; z-index: 200;
    left: ${r.left}px; top: ${r.bottom + 4}px;
    background: var(--bg-elev); border: 1px solid var(--border-strong);
    border-radius: 4px; padding: 4px; min-width: 200px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.3);
  `;
  const items = [
    ["pythonic",    "Make it more Pythonic"],
    ["performance", "Optimize performance"],
    ["dedupe",      "Reduce repetition"],
    ["readable",    "Improve readability"],
    ["comments",    "Add inline comments"],
    ["refactor",    "Refactor structure"],
  ];
  menu.innerHTML = items.map(([k, l]) => `
    <div data-kind="${k}" style="padding:6px 10px;font-size:12.5px;cursor:pointer;border-radius:3px;">${l}</div>
  `).join("");
  menu.querySelectorAll("[data-kind]").forEach(d => {
    d.onmouseenter = () => d.style.background = "var(--bg-hover)";
    d.onmouseleave = () => d.style.background = "";
    d.onclick = () => {
      const kind = d.dataset.kind;
      menu.remove();
      AIPanel.open({ title: `Improve · ${d.textContent}`, subtitle: "refactor" });
      AIPanel.body().innerHTML = "";
      AIPanel.userTurn(d.textContent);
      AIPanel.ask(PROMPTS.improve({ code, kind }));
    };
  });
  document.body.appendChild(menu);
  setTimeout(() => {
    document.addEventListener("click", function close() {
      menu.remove();
      document.removeEventListener("click", close);
    });
  }, 0);
}
