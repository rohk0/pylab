// Explain my code + Improve my code — paste-in tool.

function renderExplain() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  sidebar.innerHTML = `
    <div class="sb-header">Mode</div>
    <div class="sb-item active" data-mode="explain">Explain</div>
    <div class="sb-item" data-mode="improve">Improve</div>
    <div class="sb-section"></div>
    <div class="sb-header">Improve · presets</div>
    <div class="sb-item" data-kind="pythonic">More Pythonic</div>
    <div class="sb-item" data-kind="performance">Optimize performance</div>
    <div class="sb-item" data-kind="readable">Readability</div>
    <div class="sb-item" data-kind="dedupe">Reduce repetition</div>
    <div class="sb-item" data-kind="comments">Add comments</div>
    <div class="sb-item" data-kind="refactor">Refactor structure</div>
    <div class="sb-section"></div>
    <div class="sb-header">Examples</div>
    <div class="sb-item" data-ex="fizzbuzz">FizzBuzz</div>
    <div class="sb-item" data-ex="fib">Fibonacci</div>
    <div class="sb-item" data-ex="bubble">Bubble sort</div>
  `;

  let mode = "explain";
  let kind = "pythonic";

  main.innerHTML = `
    <div class="tabs"><div class="tab active">Explain my code</div></div>
    <div class="lesson-layout">
      <section class="lesson-exercise">
        <div class="exercise-prompt">
          <div class="label">Paste Python</div>
          <div class="task" id="task-label">The AI will explain every part, mention complexity, and call out edge cases.</div>
        </div>
        <div class="editor-wrap">
          <div class="editor-toolbar">
            <span class="file">paste.py</span>
            <span class="spacer"></span>
            <span>Python 3.11</span>
          </div>
          <div id="editor" style="flex:1;"></div>
          <div class="exercise-controls">
            <button class="btn" id="clear-btn">Clear</button>
            <span class="spacer"></span>
            <button class="ai-btn" id="add-comments">+ Comments</button>
            <button class="btn primary" id="go-btn">Analyze</button>
          </div>
        </div>
      </section>
      <article class="lesson-prose" style="overflow-y:auto;">
        <div id="result"><div class="empty" style="padding:24px;">
          <h3>Paste your Python on the left, then press Analyze.</h3>
          <div class="subtle">Or pick an example from the sidebar.</div>
        </div></div>
      </article>
    </div>
  `;

  const editor = CodeEditor(document.getElementById("editor"), "");
  const result = document.getElementById("result");
  const taskLabel = document.getElementById("task-label");

  sidebar.querySelectorAll("[data-mode]").forEach(el => el.onclick = () => {
    mode = el.dataset.mode;
    sidebar.querySelectorAll("[data-mode]").forEach(e => e.classList.toggle("active", e === el));
    taskLabel.textContent = mode === "explain"
      ? "The AI will explain every part, mention complexity, and call out edge cases."
      : "The AI will rewrite your code with the selected improvement and explain why.";
  });
  sidebar.querySelectorAll("[data-kind]").forEach(el => el.onclick = () => {
    kind = el.dataset.kind;
    mode = "improve";
    sidebar.querySelectorAll("[data-mode]").forEach(e => e.classList.toggle("active", e.dataset.mode === "improve"));
    sidebar.querySelectorAll("[data-kind]").forEach(e => e.classList.toggle("active", e === el));
    State.toast("Improve preset: " + el.textContent);
  });
  sidebar.querySelectorAll("[data-ex]").forEach(el => el.onclick = () => {
    const code = EXAMPLES[el.dataset.ex] || "";
    editor.setValue(code);
  });

  document.getElementById("clear-btn").onclick = () => { editor.setValue(""); result.innerHTML = ""; };
  document.getElementById("add-comments").onclick = () => {
    const code = editor.getValue();
    if (!code.trim()) { State.toast("Paste some code first.", "bad"); return; }
    runAnalyze("comments-only", code);
  };
  document.getElementById("go-btn").onclick = () => {
    const code = editor.getValue();
    if (!code.trim()) { State.toast("Paste some code first.", "bad"); return; }
    runAnalyze(mode, code);
  };

  async function runAnalyze(m, code) {
    if (!AI.available()) {
      result.innerHTML = `<div class="feedback bad">Configure a Groq key in <a href="settings.html#ai">Settings</a> first.</div>`;
      return;
    }
    result.innerHTML = `<div class="subtle">Analyzing…</div>`;
    const messages = m === "explain"
      ? PROMPTS.explainCode({ code, withComments: false })
      : m === "comments-only"
        ? PROMPTS.improve({ code, kind: "comments" })
        : PROMPTS.improve({ code, kind });
    await AI.into(result, messages, { maxTokens: 1600 });
  }
}

const EXAMPLES = {
  fizzbuzz: `for n in range(1, 31):
    if n % 15 == 0: print("FizzBuzz")
    elif n % 3 == 0: print("Fizz")
    elif n % 5 == 0: print("Buzz")
    else: print(n)
`,
  fib: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print([fib(i) for i in range(10)])
`,
  bubble: `def bubble_sort(xs):
    xs = xs[:]
    n = len(xs)
    for i in range(n):
        for j in range(0, n - i - 1):
            if xs[j] > xs[j + 1]:
                xs[j], xs[j + 1] = xs[j + 1], xs[j]
    return xs

print(bubble_sort([5, 2, 8, 1, 9, 3]))
`,
};
