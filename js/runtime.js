// ============================================================
// Python runtime — loads Pyodide on demand from CDN so "Run Code"
// actually executes real Python in the browser (works on GH Pages).
// First call shows a loading indicator; subsequent calls reuse.
// ============================================================

const Runtime = {
  pyodide: null,
  loading: null,

  async load() {
    if (this.pyodide) return this.pyodide;
    if (this.loading) return this.loading;

    setStatus("loading", "Loading Python runtime…");
    this.loading = (async () => {
      if (!window.loadPyodide) {
        await loadScript("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");
      }
      const pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
        stdout: t => this._emit(t, false),
        stderr: t => this._emit(t, true),
      });
      this.pyodide = pyodide;
      setStatus("ready", "Python 3.11 ready");
      return pyodide;
    })();
    return this.loading;
  },

  _output: null,
  _emit(text, isErr) {
    if (!this._output) return;
    const span = document.createElement("span");
    span.className = isErr ? "err" : "";
    span.textContent = text + "\n";
    this._output.appendChild(span);
    this._output.scrollTop = this._output.scrollHeight;
  },

  bindOutput(el) { this._output = el; },

  async run(code, stdin = "") {
    if (this._output) this._output.innerHTML = "";
    setStatus("loading", "Running…");
    try {
      const py = await this.load();
      // Wire stdin if provided
      if (stdin) {
        let pos = 0;
        py.setStdin({
          stdin: () => {
            const lines = stdin.split("\n");
            if (pos >= lines.length) return null;
            return lines[pos++];
          }
        });
      }
      // Wrap user code so prints flush
      const result = await py.runPythonAsync(code);
      if (result !== undefined && result !== null) {
        this._emit(String(result), false);
      }
      setStatus("ready", "Python 3.11 ready");
      return { ok: true, result };
    } catch (e) {
      this._emit(String(e.message || e), true);
      setStatus("ready", "Python 3.11 ready");
      return { ok: false, error: String(e.message || e) };
    }
  },

  // Capture stdout text from a code snippet (for auto-grading)
  async runCapture(code, stdin = "") {
    const py = await this.load();
    if (stdin) {
      let pos = 0;
      py.setStdin({
        stdin: () => {
          const lines = stdin.split("\n");
          if (pos >= lines.length) return null;
          return lines[pos++];
        }
      });
    }
    const captured = { out: "", err: "" };
    const origStdout = py._module?.print;
    py.setStdout({ batched: t => { captured.out += t + "\n"; } });
    py.setStderr({ batched: t => { captured.err += t + "\n"; } });
    let error = null;
    try {
      await py.runPythonAsync(code);
    } catch (e) {
      error = String(e.message || e);
    }
    // Restore default streams (route back to output pane)
    py.setStdout({ batched: t => this._emit(t, false) });
    py.setStderr({ batched: t => this._emit(t, true) });
    return { stdout: captured.out, stderr: captured.err, error };
  },

  // Read a Python global by name (e.g., to verify a variable was created)
  async readGlobals(names = []) {
    const py = await this.load();
    const result = {};
    for (const name of names) {
      try {
        const v = py.globals.get(name);
        if (v == null) { result[name] = undefined; continue; }
        if (v.toJs) { result[name] = v.toJs({ dict_converter: Object.fromEntries }); }
        else result[name] = v;
        if (v.destroy) v.destroy();
      } catch (e) {
        result[name] = undefined;
      }
    }
    return result;
  },

  // Clear module state between runs (each Run starts fresh)
  async reset() {
    const py = await this.load();
    try { await py.runPythonAsync("for _k in list(globals().keys()):\n  if not _k.startswith('_'):\n    del globals()[_k]"); } catch {}
  }
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

function setStatus(state, label) {
  const el = document.getElementById("runtime-status");
  if (!el) return;
  el.className = "runtime " + state;
  el.querySelector("span").textContent = label;
}

// ============================================================
// Multi-language extensions. The dispatcher below honors the
// language registry's `runner` field:
//   pyodide  – existing Python path (Runtime.run)
//   js       – sandboxed in-page eval (no network)
//   iframe   – HTML/CSS sandboxed preview
//   ai       – Groq simulates execution for Java/C/C++/SQL/TS
//
// Always call Runtime.runFor(code, langId, opts) from non-Python
// callers to stay future-proof.
// ============================================================

Runtime.runFor = async function (code, langId, opts = {}) {
  const lang = (typeof findLanguage === "function") ? findLanguage(langId) : { runner: "pyodide" };
  const runner = lang.runner || "pyodide";

  if (runner === "pyodide") {
    return this.run(code, opts.stdin || "");
  }
  if (runner === "js") {
    return this._runJS(code);
  }
  if (runner === "iframe") {
    return this._runIframe({ html: opts.html, css: opts.css, langId });
  }
  if (runner === "ai") {
    return this._runAI(code, lang);
  }
  this._emit(`No runner configured for ${langId}.`, true);
  return { ok: false, error: "no runner" };
};

// ---- JavaScript: sandboxed eval with captured console ----
Runtime._runJS = async function (code) {
  if (this._output) this._output.innerHTML = "";
  setStatus("loading", "Running…");
  const emit = (t, err) => this._emit(t, !!err);
  const fakeConsole = {
    log:   (...a) => emit(a.map(fmt).join(" "), false),
    info:  (...a) => emit(a.map(fmt).join(" "), false),
    warn:  (...a) => emit(a.map(fmt).join(" "), true),
    error: (...a) => emit(a.map(fmt).join(" "), true),
    debug: (...a) => emit(a.map(fmt).join(" "), false),
    table: (rows) => emit(fmt(rows), false),
  };
  try {
    const fn = new Function("console", `"use strict"; return (async () => { ${code} \n})();`);
    const result = await fn(fakeConsole);
    if (result !== undefined) emit(fmt(result), false);
    setStatus("ready", "JavaScript ready");
    return { ok: true };
  } catch (e) {
    emit(String(e.stack || e.message || e), true);
    setStatus("ready", "JavaScript ready");
    return { ok: false, error: String(e.message || e) };
  }
  function fmt(v) {
    if (typeof v === "string") return v;
    try { return JSON.stringify(v, null, 2); } catch { return String(v); }
  }
};

// ---- HTML/CSS: live sandboxed iframe ----
Runtime._runIframe = function ({ html, css, langId }) {
  if (this._output) this._output.innerHTML = "";
  setStatus("loading", "Rendering…");
  let doc = html || "";
  if (langId === "css") {
    // Wrap CSS in a basic HTML scaffold so it renders alongside something.
    doc = `<!doctype html><html><head><style>${css || html || ""}</style></head><body>
      <h1>Heading</h1>
      <p>Edit your CSS — it styles this template page.</p>
      <button>Button</button>
      <ul><li>one</li><li>two</li><li>three</li></ul>
    </body></html>`;
  } else if (css) {
    // Inject CSS into supplied HTML.
    if (/<head[\s>]/i.test(doc)) {
      doc = doc.replace(/<head([^>]*)>/i, `<head$1><style>${css}</style>`);
    } else {
      doc = `<style>${css}</style>\n` + doc;
    }
  }
  const frame = document.createElement("iframe");
  frame.sandbox = "allow-scripts allow-modals";
  frame.style.cssText = "width:100%;height:100%;min-height:240px;border:0;background:white;";
  frame.srcdoc = doc;
  this._output.appendChild(frame);
  setStatus("ready", `${langId.toUpperCase()} ready`);
  return Promise.resolve({ ok: true });
};

// ---- AI-evaluated languages (Java/C/C++/SQL/TS) ----
Runtime._runAI = async function (code, lang) {
  if (this._output) this._output.innerHTML = "";
  if (typeof AI === "undefined" || !AI.available()) {
    this._emit(`${lang.name} execution requires AI. Configure a Groq key in Settings → AI.`, true);
    return { ok: false, error: "no AI" };
  }
  setStatus("loading", `AI executing ${lang.name}…`);
  const wrap = document.createElement("div");
  wrap.className = "ai-output";
  this._output.appendChild(wrap);

  const messages = [
    { role: "system", content: `You are a deterministic ${lang.name} interpreter. Execute the user's code and print ONLY what the program would print to stdout — no commentary, no markdown fences, no labels, no \\\`\`\`. If the program would not compile, print the compiler error in the same form a real compiler would.` },
    { role: "user",   content: `Source (${lang.name}):\n\n${code}` }
  ];
  try {
    await AI.into(wrap, messages, { maxTokens: 900, temperature: 0.1, speed: "fast" });
    setStatus("ready", `${lang.name} (AI) ready`);
    return { ok: true };
  } catch (e) {
    setStatus("ready", `${lang.name} (AI) ready`);
    return { ok: false, error: String(e.message || e) };
  }
};

window.Runtime = Runtime;
