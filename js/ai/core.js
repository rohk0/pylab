// ============================================================
// AI core — single Groq client used by every AI feature.
//
//   AI.config()              -> { apiKey, model, endpoint }
//   AI.available()           -> bool
//   AI.complete(messages, o) -> string         (non-streaming)
//   AI.stream(messages, o)   -> async iterator (token strings)
//   AI.into(el, messages, o) -> renders streaming markdown into el
//   AI.json(messages, o)     -> parsed JSON (uses response_format)
//
// Errors are wrapped into AI.Error with .kind ∈ { "no_key",
// "rate_limit", "network", "model", "parse" } so callers can
// react sensibly. Streaming uses SSE.
// ============================================================

const AI = (() => {
  const RATE_KEY = "pylab.ai.rate";
  const queue = [];
  let inflight = 0;
  const MAX_PARALLEL = 3;

  class AIError extends Error {
    constructor(kind, message) { super(message); this.kind = kind; }
  }

  function getApiKey() {
    return localStorage.getItem("pylab.ai.apiKey") || PYLAB_CONFIG.GROQ_API_KEY || "";
  }

  function getModel(speed = "smart") {
    const override = localStorage.getItem("pylab.ai.model");
    if (override) return override;
    return PYLAB_CONFIG.GROQ_MODELS[speed] || PYLAB_CONFIG.GROQ_MODELS.smart;
  }

  function bumpRate() {
    let log;
    try { log = JSON.parse(localStorage.getItem(RATE_KEY) || "[]"); } catch { log = []; }
    const now = Date.now();
    log = log.filter(t => now - t < 60000);
    if (log.length >= PYLAB_CONFIG.RATE_LIMIT_PER_MIN) {
      throw new AIError("rate_limit", `Slow down — local rate limit is ${PYLAB_CONFIG.RATE_LIMIT_PER_MIN}/min.`);
    }
    log.push(now);
    localStorage.setItem(RATE_KEY, JSON.stringify(log));
  }

  // Polite queue so we don't blast Groq with many parallel calls.
  function enqueue(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      drain();
    });
  }
  function drain() {
    while (inflight < MAX_PARALLEL && queue.length) {
      const { fn, resolve, reject } = queue.shift();
      inflight++;
      Promise.resolve().then(fn).then(
        v => { inflight--; resolve(v); drain(); },
        e => { inflight--; reject(e); drain(); }
      );
    }
  }

  async function call(messages, opts, stream) {
    const apiKey = getApiKey();
    if (!apiKey) throw new AIError("no_key", "No Groq API key configured. Add one in Settings.");

    bumpRate();
    const body = {
      model: opts.model || getModel(opts.speed || "smart"),
      messages,
      temperature: opts.temperature ?? 0.4,
      max_tokens: opts.maxTokens ?? 1200,
      stream: !!stream,
    };
    if (opts.json) {
      body.response_format = { type: "json_object" };
    }
    let resp;
    try {
      resp = await fetch(PYLAB_CONFIG.GROQ_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: opts.signal,
      });
    } catch (e) {
      throw new AIError("network", "Network error reaching Groq.");
    }
    if (!resp.ok) {
      let detail = "";
      try { const j = await resp.json(); detail = j?.error?.message || ""; } catch {}
      if (resp.status === 401) throw new AIError("no_key", "Groq rejected the API key. Update it in Settings.");
      if (resp.status === 429) throw new AIError("rate_limit", "Groq is rate-limiting requests. Wait a few seconds.");
      if (resp.status >= 500) throw new AIError("network", "Groq server error. Try again in a moment.");
      throw new AIError("model", detail || `Request failed (${resp.status}).`);
    }
    return resp;
  }

  // Plain JSON response, no streaming.
  async function complete(messages, opts = {}) {
    return enqueue(async () => {
      const resp = await call(messages, opts, false);
      const j = await resp.json();
      const text = j?.choices?.[0]?.message?.content ?? "";
      return text;
    });
  }

  async function json(messages, opts = {}) {
    const text = await complete(messages, { ...opts, json: true, temperature: opts.temperature ?? 0.3 });
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new AIError("parse", "AI returned invalid JSON.");
    }
  }

  // Async iterator over streamed tokens.
  async function* stream(messages, opts = {}) {
    // Streaming bypasses the queue so we can yield while open.
    const resp = await call(messages, opts, true);
    if (!resp.body) {
      const j = await resp.json().catch(() => null);
      const t = j?.choices?.[0]?.message?.content ?? "";
      if (t) yield t;
      return;
    }
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf("\n")) !== -1) {
        const line = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 1);
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") return;
        if (!data) continue;
        try {
          const chunk = JSON.parse(data);
          const tok = chunk?.choices?.[0]?.delta?.content;
          if (tok) yield tok;
        } catch {}
      }
    }
  }

  // Render streamed markdown into a DOM element progressively.
  // The renderer re-parses the accumulated text each chunk; for the
  // length of an AI response this is fine.
  async function into(el, messages, opts = {}) {
    el.classList.add("ai-output");
    el.innerHTML = `<span class="ai-caret"></span>`;
    let acc = "";
    let cancelled = false;
    const ctrl = new AbortController();
    opts = { ...opts, signal: opts.signal || ctrl.signal };
    const onDom = () => { if (!el.isConnected) { cancelled = true; ctrl.abort(); } };
    const obs = new MutationObserver(onDom);
    if (el.parentElement) obs.observe(el.parentElement, { childList: true, subtree: true });
    try {
      for await (const tok of stream(messages, opts)) {
        if (cancelled) break;
        acc += tok;
        el.innerHTML = renderMD(acc) + `<span class="ai-caret"></span>`;
        if (opts.onChunk) opts.onChunk(acc);
        el.scrollTop = el.scrollHeight;
      }
      el.innerHTML = renderMD(acc);
      if (opts.onDone) opts.onDone(acc);
      return acc;
    } catch (e) {
      el.innerHTML = `<div class="feedback bad" style="margin:6px 0;">${escapeHTML(friendlyError(e))}</div>`;
      throw e;
    } finally {
      obs.disconnect();
    }
  }

  function friendlyError(e) {
    if (!(e instanceof AIError)) return e?.message || "Unknown error.";
    switch (e.kind) {
      case "no_key": return e.message;
      case "rate_limit": return "Hit the rate limit. Take a breath and try again.";
      case "network": return "Network hiccup — check connection and retry.";
      case "model": return e.message;
      case "parse": return "AI response was malformed. Try again.";
      default: return e.message;
    }
  }

  // Lightweight markdown renderer for AI output.
  // Handles: headers, bold/italic, code blocks (with Python highlighting),
  // inline code, bullet lists, numbered lists, blockquotes.
  function renderMD(src) {
    const blocks = [];
    const MARK = "";
    src = src.replace(/```(\w*)\n?([\s\S]*?)(?:```|$)/g, (_, lang, code) => {
      const trimmed = code.replace(/\n$/, "");
      const langKey = (lang || "python").toLowerCase();
      const html = (typeof CodeBlock !== "undefined")
        ? CodeBlock.render(trimmed, { lang: langKey })
        : `<pre class="ai-code"><code>${escapeHTML(trimmed)}</code></pre>`;
      blocks.push(html);
      return MARK + (blocks.length - 1) + MARK;
    });

    const lines = src.split("\n");
    let out = "", inUL = false, inOL = false, inBQ = false;
    const close = () => {
      if (inUL) { out += "</ul>"; inUL = false; }
      if (inOL) { out += "</ol>"; inOL = false; }
      if (inBQ) { out += "</blockquote>"; inBQ = false; }
    };
    for (const raw of lines) {
      const line = raw.replace(/\s+$/, "");
      if (/^#{1,6} /.test(line)) {
        close();
        const lvl = line.match(/^#+/)[0].length;
        out += `<h${lvl + 2}>${inline(line.replace(/^#+\s*/, ""))}</h${lvl + 2}>`;
      } else if (/^[-*] /.test(line)) {
        if (inOL) { out += "</ol>"; inOL = false; }
        if (inBQ) { out += "</blockquote>"; inBQ = false; }
        if (!inUL) { out += "<ul>"; inUL = true; }
        out += `<li>${inline(line.replace(/^[-*]\s*/, ""))}</li>`;
      } else if (/^\d+\.\s+/.test(line)) {
        if (inUL) { out += "</ul>"; inUL = false; }
        if (inBQ) { out += "</blockquote>"; inBQ = false; }
        if (!inOL) { out += "<ol>"; inOL = true; }
        out += `<li>${inline(line.replace(/^\d+\.\s+/, ""))}</li>`;
      } else if (/^> /.test(line)) {
        if (inUL) { out += "</ul>"; inUL = false; }
        if (inOL) { out += "</ol>"; inOL = false; }
        if (!inBQ) { out += "<blockquote>"; inBQ = true; }
        out += inline(line.slice(2)) + " ";
      } else if (!line.trim()) {
        close();
      } else {
        close();
        out += `<p>${inline(line)}</p>`;
      }
    }
    close();
    const re = new RegExp(MARK + "(\\d+)" + MARK, "g");
    return out.replace(re, (_, i) => blocks[+i]);
  }
  function inline(t) {
    return escapeHTML(t)
      .replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/\*([^*]+)\*/g, "<i>$1</i>");
  }

  return {
    Error: AIError,
    config: () => ({ apiKey: getApiKey(), model: getModel(), endpoint: PYLAB_CONFIG.GROQ_ENDPOINT }),
    available: () => !!getApiKey(),
    complete, json, stream, into, friendlyError, renderMD,
  };
})();

window.AI = AI;
