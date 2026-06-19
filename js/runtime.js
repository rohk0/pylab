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

window.Runtime = Runtime;
