// ============================================================
// CodeBlock — unified code-block renderer used by lesson
// markdown, the AI panel, the error dictionary, and the
// reference page. Looks like a VS Code editor pane: title bar
// with language label and copy button, gutter with line numbers,
// VS Code Dark+ syntax colors.
//
//   CodeBlock.render(code, { lang, file, lines, copy })
//
// All flags default to: lang="python", file=null, lines=true,
// copy=true. Returns an HTML string ready to inject.
// ============================================================

const CodeBlock = (() => {

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;",
    }[c]));
  }

  // Pluggable per-language highlighter. For Python we prefer the
  // richer editor.js highlighter when present; everything else uses
  // a small token-based highlighter driven by the language registry.
  function paint(code, lang) {
    lang = normalizeLang(lang);
    if (lang === "python" && typeof window.highlightPython === "function") {
      return window.highlightPython(code);
    }
    if (lang === "html") return highlightHTML(code);
    if (lang === "css")  return highlightCSS(code);
    return highlightGeneric(code, lang);
  }

  function normalizeLang(l) {
    const x = String(l || "").toLowerCase().trim();
    return ({
      py: "python", py3: "python",
      js: "javascript", mjs: "javascript", cjs: "javascript", jsx: "javascript",
      ts: "typescript", tsx: "typescript",
      "c++": "cpp", cxx: "cpp", cc: "cpp", hpp: "cpp",
      h: "c",
      htm: "html", xhtml: "html",
      psql: "sql", postgres: "sql", mysql: "sql", sqlite: "sql",
      sh: "bash", shell: "bash",
    })[x] || x || "python";
  }

  function getLangDef(lang) {
    if (typeof window.LANGUAGES !== "undefined") {
      const found = LANGUAGES.find(l => l.id === lang);
      if (found) return found;
    }
    // Tiny fallback when the registry isn't loaded.
    return { keywords: [], builtins: [], comment: { line: "//", blockOpen: "/*", blockClose: "*/" } };
  }

  // Token-based highlighter. Walks the source once classifying:
  //   strings ('…', "…", `…`) · numbers · comments · keywords ·
  //   built-ins · function calls (foo() ) · class-cased identifiers.
  // Output is plain HTML with .syn-* spans.
  function highlightGeneric(src, lang) {
    const def = getLangDef(lang);
    const kw = new Set(def.keywords || []);
    const bi = new Set(def.builtins || []);
    const lineCom = def.comment?.line;
    const bo = def.comment?.blockOpen;
    const bc = def.comment?.blockClose;

    let out = "";
    let i = 0;
    const n = src.length;

    while (i < n) {
      const ch = src[i];
      const rest = src.slice(i);

      // block comment
      if (bo && rest.startsWith(bo)) {
        const end = src.indexOf(bc, i + bo.length);
        const stop = end === -1 ? n : end + bc.length;
        out += `<span class="syn-com">${escapeHTML(src.slice(i, stop))}</span>`;
        i = stop;
        continue;
      }
      // line comment
      if (lineCom && rest.startsWith(lineCom)) {
        const nl = src.indexOf("\n", i);
        const stop = nl === -1 ? n : nl;
        out += `<span class="syn-com">${escapeHTML(src.slice(i, stop))}</span>`;
        i = stop;
        continue;
      }
      // strings: '…' "…" `…` (handles escapes)
      if (ch === '"' || ch === "'" || ch === "`") {
        const quote = ch;
        let j = i + 1;
        while (j < n) {
          if (src[j] === "\\") { j += 2; continue; }
          if (src[j] === quote) { j++; break; }
          j++;
        }
        out += `<span class="syn-str">${escapeHTML(src.slice(i, j))}</span>`;
        i = j;
        continue;
      }
      // numbers
      if (/[0-9]/.test(ch) && !/[A-Za-z_]/.test(src[i - 1] || "")) {
        const m = rest.match(/^(0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|[0-9][0-9_]*\.?[0-9_]*(?:[eE][+-]?[0-9_]+)?[fFLuU]*)/);
        if (m) {
          out += `<span class="syn-num">${escapeHTML(m[0])}</span>`;
          i += m[0].length;
          continue;
        }
      }
      // identifiers / keywords / built-ins
      if (/[A-Za-z_$#]/.test(ch)) {
        const m = rest.match(/^[A-Za-z_$#][\w$]*/);
        if (m) {
          const word = m[0];
          let cls = null;
          if (kw.has(word)) cls = "syn-kw";
          else if (bi.has(word)) cls = "syn-bi";
          else if (/^[A-Z]/.test(word) && lang !== "sql") cls = "syn-cls";
          else if (src[i + word.length] === "(") cls = "syn-fn";
          out += cls ? `<span class="${cls}">${escapeHTML(word)}</span>` : escapeHTML(word);
          i += word.length;
          continue;
        }
      }
      out += escapeHTML(ch);
      i++;
    }
    return out;
  }

  // HTML highlighter — tags, attribute names, attribute values.
  function highlightHTML(src) {
    let html = escapeHTML(src);
    html = html.replace(/&lt;!--[\s\S]*?--&gt;/g, m => `<span class="syn-com">${m}</span>`);
    html = html.replace(/(&lt;\/?)([a-zA-Z][\w-]*)([^&]*?)(\/?&gt;)/g,
      (_, open, tag, attrs, close) => {
        const styled = attrs.replace(/([a-zA-Z-]+)(=)("[^"]*"|'[^']*')/g,
          (_, name, eq, val) => `<span class="syn-bi">${name}</span>${eq}<span class="syn-str">${val}</span>`);
        return `<span class="syn-kw">${open}</span><span class="syn-cls">${tag}</span>${styled}<span class="syn-kw">${close}</span>`;
      });
    return html;
  }

  // CSS highlighter — selectors, properties, values, !important.
  function highlightCSS(src) {
    let html = escapeHTML(src);
    html = html.replace(/\/\*[\s\S]*?\*\//g, m => `<span class="syn-com">${m}</span>`);
    html = html.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, m => `<span class="syn-str">${m}</span>`);
    html = html.replace(/(^|[{};\n])(\s*)([\.#]?[a-zA-Z][\w\-&:>,*+~ \[\]"'=^$\.#]*?)(\s*\{)/g,
      (_, lead, ws1, sel, brace) => `${lead}${ws1}<span class="syn-cls">${sel}</span>${brace}`);
    html = html.replace(/([\w-]+)(\s*:)/g, '<span class="syn-bi">$1</span>$2');
    html = html.replace(/\b(\d+\.?\d*)(px|em|rem|%|vh|vw|vmin|vmax|s|ms|deg|fr)?/g,
      '<span class="syn-num">$1$2</span>');
    html = html.replace(/!important/g, '<span class="syn-kw">!important</span>');
    return html;
  }

  function render(code, opts = {}) {
    const lang = opts.lang || "python";
    const showLines = opts.lines !== false;
    const showCopy = opts.copy !== false;
    const file = opts.file;

    const trimmed = String(code).replace(/^\n+|\n+$/g, "");
    const lineCount = trimmed.split("\n").length;
    const gutter = showLines
      ? `<div class="cb-gutter" aria-hidden="true">${
          Array.from({ length: lineCount }, (_, i) => `<span>${i + 1}</span>`).join("")
        }</div>`
      : "";

    const dataAttr = ` data-code="${escapeHTML(trimmed)}"`;

    return `<figure class="code-block" data-lang="${escapeHTML(lang)}"${dataAttr}>
  <header class="cb-head">
    <span class="cb-dot"></span><span class="cb-dot"></span><span class="cb-dot"></span>
    <span class="cb-title">${file ? escapeHTML(file) : escapeHTML(lang)}</span>
    <span class="cb-spacer"></span>
    ${showCopy ? `<button class="cb-copy" type="button" title="Copy code"><span class="cb-copy-label">Copy</span></button>` : ""}
  </header>
  <div class="cb-body">
    ${gutter}
    <pre class="cb-pre"><code class="cb-code language-${escapeHTML(lang)}">${paint(trimmed, lang)}</code></pre>
  </div>
</figure>`;
  }

  // Global click delegation for copy buttons.
  function wire() {
    if (window.__cbWired) return;
    window.__cbWired = true;
    document.addEventListener("click", async (e) => {
      const btn = e.target.closest(".cb-copy");
      if (!btn) return;
      const fig = btn.closest(".code-block");
      const code = fig?.dataset?.code || fig?.querySelector(".cb-code")?.innerText || "";
      try {
        await navigator.clipboard.writeText(code);
        const label = btn.querySelector(".cb-copy-label");
        const prev = label.textContent;
        label.textContent = "Copied";
        btn.classList.add("ok");
        setTimeout(() => { label.textContent = prev; btn.classList.remove("ok"); }, 1200);
      } catch {
        btn.querySelector(".cb-copy-label").textContent = "Failed";
      }
    });
  }

  wire();

  return { render, paint };
})();

window.CodeBlock = CodeBlock;
