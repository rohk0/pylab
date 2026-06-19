// ============================================================
// Lightweight code editor + Python syntax highlighter.
// Renders a syntax-highlighted layer behind a transparent textarea
// for full keyboard support without an external dep.
// ============================================================

const PY_KEYWORDS = new Set([
  "False","None","True","and","as","assert","async","await","break","class","continue",
  "def","del","elif","else","except","finally","for","from","global","if","import","in",
  "is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield",
  "match","case"
]);
const PY_BUILTINS = new Set([
  "print","input","len","range","str","int","float","bool","list","dict","set","tuple",
  "abs","max","min","sum","sorted","reversed","map","filter","zip","enumerate","type",
  "isinstance","open","round","pow","divmod","any","all","chr","ord","hex","bin","oct",
  "format","repr","help","dir","id","callable","getattr","setattr","hasattr","delattr",
  "iter","next","slice","object","Exception","ValueError","TypeError","KeyError","IndexError",
  "ZeroDivisionError","FileNotFoundError","StopIteration","NotImplementedError"
]);

function highlightPython(src) {
  // Tokenize line-aware so comments and strings work.
  const out = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];

    // Comments
    if (c === "#") {
      let j = i;
      while (j < n && src[j] !== "\n") j++;
      out.push(`<span class="com">${escapeHTML(src.slice(i, j))}</span>`);
      i = j; continue;
    }

    // Triple-quoted strings
    if ((src.startsWith('"""', i) || src.startsWith("'''", i))) {
      const q = src.substr(i, 3);
      let j = i + 3;
      while (j < n && !src.startsWith(q, j)) j++;
      j = Math.min(n, j + 3);
      out.push(`<span class="str">${escapeHTML(src.slice(i, j))}</span>`);
      i = j; continue;
    }

    // Strings
    if (c === '"' || c === "'") {
      const q = c;
      let j = i + 1;
      while (j < n && src[j] !== q) {
        if (src[j] === "\\") j++;
        if (src[j] === "\n") break;
        j++;
      }
      j = Math.min(n, j + 1);
      out.push(`<span class="str">${escapeHTML(src.slice(i, j))}</span>`);
      i = j; continue;
    }

    // Numbers
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < n && /[0-9_.xXbBoOeE+\-]/.test(src[j]) && !(src[j] === "+" || src[j] === "-" && !/[eE]/.test(src[j-1]))) j++;
      // Be safer: match basic numeric form
      const m = src.slice(i).match(/^(0[xXbBoO][0-9a-fA-F_]+|\d[\d_]*\.?\d*(?:[eE][+\-]?\d+)?j?)/);
      if (m) {
        out.push(`<span class="num">${escapeHTML(m[0])}</span>`);
        i += m[0].length; continue;
      }
    }

    // Identifiers / keywords
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      // Look ahead for "(" -> function call
      let k = j; while (k < n && src[k] === " ") k++;
      let cls = null;
      if (PY_KEYWORDS.has(word)) cls = "kw";
      else if (PY_BUILTINS.has(word)) cls = "bi";
      else if (src[k] === "(") cls = "fn";
      else if (word[0] >= "A" && word[0] <= "Z") cls = "cls";
      out.push(cls ? `<span class="${cls}">${escapeHTML(word)}</span>` : escapeHTML(word));
      i = j; continue;
    }

    // Operators
    if (/[+\-*/%=<>!&|^~]/.test(c)) {
      out.push(`<span class="op">${escapeHTML(c)}</span>`);
      i++; continue;
    }

    // Whitespace / other
    out.push(escapeHTML(c));
    i++;
  }
  return out.join("");
}

// ----- Editor component -----
function CodeEditor(container, initial = "", opts = {}) {
  const tabSize = State.data.settings.tabSize || 4;
  const indent = " ".repeat(tabSize);

  container.classList.add("code-editor");
  container.innerHTML = `
    <div class="gutter" aria-hidden="true"></div>
    <div class="input-area">
      <pre class="highlight" aria-hidden="true"></pre>
      <textarea spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></textarea>
    </div>
  `;
  const gutter = container.querySelector(".gutter");
  const highlight = container.querySelector(".highlight");
  const ta = container.querySelector("textarea");
  ta.value = initial;

  function refresh() {
    const lines = ta.value.split("\n");
    gutter.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join("");
    highlight.innerHTML = highlightPython(ta.value) + "\n"; // trailing newline so last line is visible
    if (opts.onChange) opts.onChange(ta.value);
  }

  ta.addEventListener("input", refresh);
  ta.addEventListener("scroll", () => {
    highlight.scrollTop = ta.scrollTop;
    highlight.scrollLeft = ta.scrollLeft;
    gutter.scrollTop = ta.scrollTop;
  });
  // Auto-indent + tab handling
  ta.addEventListener("keydown", e => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = ta.selectionStart, end = ta.selectionEnd;
      if (e.shiftKey) {
        // Dedent selected lines
        const before = ta.value.slice(0, start);
        const lineStart = before.lastIndexOf("\n") + 1;
        const sel = ta.value.slice(lineStart, end);
        const dedented = sel.split("\n").map(l => l.startsWith(indent) ? l.slice(indent.length) : l.replace(/^ {1,4}/, "")).join("\n");
        ta.value = ta.value.slice(0, lineStart) + dedented + ta.value.slice(end);
        ta.selectionStart = ta.selectionEnd = end - (sel.length - dedented.length);
      } else if (start !== end) {
        const before = ta.value.slice(0, start);
        const lineStart = before.lastIndexOf("\n") + 1;
        const sel = ta.value.slice(lineStart, end);
        const indented = sel.split("\n").map(l => indent + l).join("\n");
        ta.value = ta.value.slice(0, lineStart) + indented + ta.value.slice(end);
        ta.selectionStart = lineStart; ta.selectionEnd = lineStart + indented.length;
      } else {
        ta.value = ta.value.slice(0, start) + indent + ta.value.slice(end);
        ta.selectionStart = ta.selectionEnd = start + indent.length;
      }
      refresh();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const start = ta.selectionStart;
      const before = ta.value.slice(0, start);
      const lineStart = before.lastIndexOf("\n") + 1;
      const curLine = before.slice(lineStart);
      const m = curLine.match(/^(\s*)/);
      let pad = m ? m[1] : "";
      if (/[:({\[]\s*$/.test(curLine)) pad += indent;
      const insert = "\n" + pad;
      ta.value = ta.value.slice(0, start) + insert + ta.value.slice(ta.selectionEnd);
      ta.selectionStart = ta.selectionEnd = start + insert.length;
      refresh();
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (opts.onRun) opts.onRun(ta.value);
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      if (opts.onSave) opts.onSave(ta.value);
    }
  });

  refresh();
  return {
    getValue: () => ta.value,
    setValue: v => { ta.value = v; refresh(); },
    focus: () => ta.focus(),
  };
}

window.CodeEditor = CodeEditor;
window.highlightPython = highlightPython;
