// ============================================================
// Exercise auto-grader.
//
// An exercise specifies any of:
//   stdoutEquals   — exact stdout match (whitespace-trimmed at ends)
//   stdoutContains — substring match
//   stdoutMatches  — regex match (RegExp object)
//   check          — Python code appended to the user's; if it
//                    raises, the exercise fails. May print
//                    "CHECK_OK" as a positive signal.
//   stdin          — feed this string to input()
//
// The grader accepts equivalent correct solutions because the
// expectations describe outcomes, not exact source.
// ============================================================

const Grader = {
  async grade(code, exercise) {
    const stdin = exercise.stdin || "";
    const trimmedUserCode = code.replace(/\s+$/, "");
    if (!trimmedUserCode) {
      return { ok: false, kind: "empty", message: "Editor is empty. Write some code first." };
    }

    // Build the program: user code, then optional check assertions
    let program = code;
    if (exercise.check) {
      program += "\n\n# --- grader checks ---\n" + exercise.check;
    }

    let res;
    try {
      res = await Runtime.runCapture(program, stdin);
    } catch (e) {
      return { ok: false, kind: "runtime", message: String(e.message || e) };
    }

    // Capture out separately so user can see their print output too.
    let stdout = res.stdout || "";
    const stderr = res.stderr || "";
    const errorMsg = res.error || "";

    // Strip the CHECK_OK sentinel from displayed output
    let display = stdout.replace(/\bCHECK_OK\b\n?/g, "");

    if (errorMsg) {
      // The check block raised AssertionError -> wrong answer.
      // Other errors are runtime errors in user code.
      const isAssertion = /AssertionError/.test(errorMsg);
      return {
        ok: false,
        kind: isAssertion ? "wrong" : "runtime",
        message: isAssertion
          ? "Your code ran, but the result didn't match what was expected."
          : errorMsg,
        stdout: display,
        stderr,
      };
    }

    // Now check stdout-based expectations
    const cleanStdout = display.trimEnd() + (display.endsWith("\n") ? "" : "");
    const fullStdout = stdout; // raw, including any CHECK_OK that was stripped

    if (exercise.stdoutEquals !== undefined) {
      const expected = exercise.stdoutEquals;
      const got = display;
      if (got.replace(/\r/g, "") !== expected.replace(/\r/g, "")) {
        return {
          ok: false, kind: "stdout",
          message: `Expected output:\n${expected}\n\nGot:\n${got || "(nothing)"}`,
          stdout: display
        };
      }
    }
    if (exercise.stdoutContains !== undefined) {
      if (!display.includes(exercise.stdoutContains)) {
        return {
          ok: false, kind: "stdout",
          message: `Output should contain "${exercise.stdoutContains}".`,
          stdout: display,
        };
      }
    }
    if (exercise.stdoutMatches instanceof RegExp) {
      if (!exercise.stdoutMatches.test(display)) {
        return {
          ok: false, kind: "stdout",
          message: `Output didn't match the expected pattern.`,
          stdout: display,
        };
      }
    }

    return { ok: true, message: "Correct!", stdout: display };
  }
};

// ============================================================
// Multi-language grading dispatcher.
//
//   Grader.gradeFor(code, ex, langId) -> { ok, kind, message, stdout }
//
// Routes by language:
//   python     → existing Pyodide grader
//   javascript → in-page sandboxed eval + check assertions
//   typescript → strip types, treat as JS, in-page eval
//   else       → caller falls back to AI grading (returns ok=false,
//                kind="needs_ai" so the caller knows to ask the AI)
// ============================================================

Grader.gradeFor = async function (code, ex, langId) {
  langId = String(langId || "python").toLowerCase();
  if (langId === "python") return this.grade(code, ex);
  if (langId === "javascript" || langId === "typescript") return this.gradeJS(code, ex, langId);
  return { ok: false, kind: "needs_ai", message: "" };
};

// Sandboxed JS execution + check assertions. The check script uses
// a small assert(cond, msg) helper that throws on failure. The check
// must end by logging "CHECK_OK" — same convention as Python.
Grader.gradeJS = async function (code, ex, langId = "javascript") {
  if (!ex || typeof ex.check !== "string" || !ex.check.trim()) {
    return { ok: false, kind: "needs_ai", message: "" };
  }
  let userCode = code;
  if (langId === "typescript") userCode = stripTSTypes(userCode);

  const captured = [];
  const fakeConsole = {
    log:   (...a) => captured.push(a.map(fmt).join(" ")),
    info:  (...a) => captured.push(a.map(fmt).join(" ")),
    warn:  (...a) => captured.push(a.map(fmt).join(" ")),
    error: (...a) => captured.push(a.map(fmt).join(" ")),
    debug: (...a) => captured.push(a.map(fmt).join(" ")),
  };
  const wrapped = `"use strict";
function assert(cond, msg) { if (!cond) throw new Error(msg || "Assertion failed"); }
${userCode}
${ex.check}
`;
  let lastErr = null;
  try {
    const fn = new Function("console", `return (async () => { ${wrapped} })();`);
    await fn(fakeConsole);
  } catch (e) {
    lastErr = e;
  }
  const stdout = captured.join("\n");
  if (lastErr) {
    return {
      ok: false,
      kind: lastErr.message?.toLowerCase().includes("assert") ? "wrong" : "runtime",
      message: String(lastErr.message || lastErr),
      stdout,
    };
  }
  if (stdout.includes("CHECK_OK")) {
    return {
      ok: true, kind: "pass",
      message: "Nice — all checks passed.",
      stdout: stdout.replace(/CHECK_OK\n?/g, "").trim(),
    };
  }
  return {
    ok: false, kind: "wrong",
    message: "Your code ran, but the grader didn't get a CHECK_OK signal.",
    stdout,
  };
  function fmt(v) {
    if (typeof v === "string") return v;
    try { return JSON.stringify(v); } catch { return String(v); }
  }
};

// Cheap TypeScript-to-JS for grading purposes. Strips parameter
// types, return types, variable annotations, `as` casts, and the
// most common interface/type-alias declarations. Not a real
// compiler — only needs to be good enough that the assertions can
// run against the user's runtime behavior.
function stripTSTypes(src) {
  return src
    .replace(/^\s*(?:interface|type)\s+\w+\s*=?[\s\S]*?(?:\}|;)\s*$/gm, "")
    .replace(/:\s*[\w<>,\[\]\s|&]+(?=\s*[=,)\];])/g, "")
    .replace(/\)\s*:\s*[\w<>,\[\]\s|&]+\s*(?==>|\{|;)/g, ")")
    .replace(/\s+as\s+[\w<>,\[\]\s|&]+/g, "");
}

window.Grader = Grader;
