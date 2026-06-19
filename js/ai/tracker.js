// ============================================================
// Learner tracker — records mistakes, weak topics, time spent.
// Powers the AI personalized tutor and dashboard companion.
// State stored under State.data.tracker.
// ============================================================

const Tracker = (() => {

  function ensure() {
    if (!State.data.tracker) {
      State.data.tracker = {
        attempts: {},   // exerciseId -> { tries, passed, lastAt }
        topics: {},     // topic -> { right, wrong, lastAt }
        errors: {},     // ErrorClass name -> count
        sessions: [],   // [{ at, kind, ref, ok }]
      };
      State.save();
    }
    return State.data.tracker;
  }

  function topicsForExercise(ex, fallback = []) {
    if (Array.isArray(ex?.tags) && ex.tags.length) return ex.tags;
    if (Array.isArray(ex?.concepts) && ex.concepts.length) return ex.concepts;
    return fallback;
  }

  function recordAttempt({ id, topic, ok, errorName, kind = "exercise", ref = id }) {
    const t = ensure();
    const a = (t.attempts[id] = t.attempts[id] || { tries: 0, passed: false, lastAt: 0 });
    a.tries += 1;
    a.passed = a.passed || ok;
    a.lastAt = Date.now();

    const topics = Array.isArray(topic) ? topic : (topic ? [topic] : []);
    for (const tp of topics) {
      const r = (t.topics[tp] = t.topics[tp] || { right: 0, wrong: 0, lastAt: 0 });
      if (ok) r.right += 1; else r.wrong += 1;
      r.lastAt = Date.now();
    }

    if (!ok && errorName) {
      t.errors[errorName] = (t.errors[errorName] || 0) + 1;
    }

    t.sessions = t.sessions || [];
    t.sessions.push({ at: Date.now(), kind, ref, ok });
    if (t.sessions.length > 200) t.sessions = t.sessions.slice(-200);

    State.save();
  }

  function weakestTopics(n = 3) {
    const t = ensure();
    return Object.entries(t.topics)
      .map(([name, s]) => ({ name, score: s.right - s.wrong * 2, ...s }))
      .filter(x => x.right + x.wrong >= 2)
      .sort((a, b) => a.score - b.score)
      .slice(0, n);
  }

  function strongestTopics(n = 3) {
    const t = ensure();
    return Object.entries(t.topics)
      .map(([name, s]) => ({ name, score: s.right - s.wrong, ...s }))
      .filter(x => x.right + x.wrong >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, n);
  }

  function recentMistakes(n = 5) {
    const t = ensure();
    return (t.sessions || []).filter(s => !s.ok).slice(-n).reverse();
  }

  function summaryString() {
    const t = ensure();
    const total = Object.keys(t.attempts).length;
    const passed = Object.values(t.attempts).filter(a => a.passed).length;
    const weak = weakestTopics(3).map(w => w.name).join(", ") || "none yet";
    const strong = strongestTopics(2).map(w => w.name).join(", ") || "—";
    const recent = (t.sessions || []).slice(-10);
    const wins = recent.filter(s => s.ok).length;

    const errBreakdown = Object.entries(t.errors || {}).sort((a, b) => b[1] - a[1]).slice(0, 3)
      .map(([n, c]) => `${n}×${c}`).join(", ") || "none";

    return [
      `Level ${State.data.level} (${State.data.xp} XP)`,
      `Streak ${State.data.streak} days`,
      `${passed}/${total} exercises passed`,
      `Recent 10 attempts: ${wins} successful`,
      `Weakest topics: ${weak}`,
      `Strongest topics: ${strong}`,
      `Frequent errors: ${errBreakdown}`,
    ].join("\n");
  }

  return {
    ensure,
    topicsForExercise,
    recordAttempt,
    weakestTopics,
    strongestTopics,
    recentMistakes,
    summaryString,
  };
})();

window.Tracker = Tracker;
