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

window.Grader = Grader;
