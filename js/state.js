// ============================================================
// Persistent user state — XP, streaks, completions, theme.
// All persisted to localStorage. No backend required.
// ============================================================
(function () {
  const KEY = "pylab.state.v1";

  const defaults = () => ({
    xp: 0,
    level: 1,
    streak: 0,
    streakDays: [],          // ISO date strings (YYYY-MM-DD)
    lastActive: null,
    completedLessons: {},    // id -> true
    completedChallenges: {}, // id -> true
    completedQuizzes: {},    // id -> {score, total}
    notes: [],               // {id, title, body, updated}
    flashFavs: {},           // id -> true
    flashReview: {},         // id -> {next, ease}
    lang: "python",          // active language: python|javascript|java|cpp|c|sql|html|css|typescript
    playgroundFiles: [],     // {id, name, code, updated, lang}
    settings: {
      theme: "dark",
      fontSize: 13,
      tabSize: 4,
    },
    weeklyGoal: 250,         // XP per week
  });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      return { ...defaults(), ...parsed, settings: { ...defaults().settings, ...(parsed.settings || {}) } };
    } catch (e) {
      console.warn("State load failed:", e);
      return defaults();
    }
  }

  function save() { localStorage.setItem(KEY, JSON.stringify(State.data)); }

  const State = {
    data: load(),
    listeners: new Set(),
    subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
    emit() { for (const fn of this.listeners) fn(this.data); },
    save() { save(); this.emit(); },

    // ----- helpers -----
    todayISO() {
      const d = new Date(); return d.toISOString().slice(0, 10);
    },
    xpForLevel(lvl) { return Math.round(50 * Math.pow(lvl, 1.5)); },
    xpProgress() {
      const cur = this.data.xp;
      const needCurrent = this.xpForLevel(this.data.level);
      const needNext = this.xpForLevel(this.data.level + 1);
      const pct = Math.min(100, Math.round(((cur - needCurrent) / Math.max(1, needNext - needCurrent)) * 100));
      return { cur, needCurrent, needNext, pct: isFinite(pct) ? pct : 0 };
    },
    addXP(amount, reason = "") {
      this.data.xp += amount;
      const before = this.data.level;
      while (this.data.xp >= this.xpForLevel(this.data.level + 1)) this.data.level++;
      this.touchStreak();
      this.save();
      this.popXP(amount);
      // Live-update the XP pill if it's on the page.
      const pill = document.getElementById("xp-num");
      if (pill) pill.textContent = `${this.data.xp} XP`;
      if (this.data.level > before) this.toast(`Level up! → Lv ${this.data.level}`);
      else this.toast(`+${amount} XP ${reason ? "· " + reason : ""}`);
    },
    popXP(amount) {
      // Float a "+N XP" near the pill.
      const pill = document.getElementById("xp-pill");
      const rect = pill?.getBoundingClientRect();
      const el = document.createElement("div");
      el.className = "xp-pop";
      el.textContent = `+${amount} XP`;
      el.style.left = (rect ? rect.left - 10 : window.innerWidth - 100) + "px";
      el.style.top  = (rect ? rect.top  - 14 : 36) + "px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1300);
    },
    touchStreak() {
      const today = this.todayISO();
      if (this.data.lastActive === today) return;
      const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      this.data.streak = this.data.lastActive === yest ? this.data.streak + 1 : 1;
      this.data.lastActive = today;
      if (!this.data.streakDays.includes(today)) this.data.streakDays.push(today);
      this.data.streakDays = this.data.streakDays.slice(-365);
    },
    completeLesson(id, xp = 15) {
      if (this.data.completedLessons[id]) return false;
      this.data.completedLessons[id] = true;
      this.addXP(xp, "lesson complete");
      return true;
    },
    completeChallenge(id, xp = 20) {
      if (this.data.completedChallenges[id]) return false;
      this.data.completedChallenges[id] = true;
      this.addXP(xp, "challenge solved");
      return true;
    },
    completeQuiz(id, score, total, xp = 10) {
      this.data.completedQuizzes[id] = { score, total, at: Date.now() };
      this.addXP(Math.round(xp * (score / total)), "quiz");
    },

    // ----- toasts -----
    toast(text, kind = "ok") {
      const t = document.createElement("div");
      t.textContent = text;
      t.style.cssText = `
        position: fixed; bottom: 36px; right: 16px; z-index: 200;
        background: var(--bg-elev); border: 1px solid var(--border-strong);
        border-left: 3px solid var(--${kind === "ok" ? "green" : kind === "bad" ? "red" : "accent"});
        padding: 8px 14px; border-radius: 4px;
        font-family: var(--font-mono); font-size: 12px;
        color: var(--fg-strong);
        animation: fadeIn 0.18s ease-out;
        box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(t);
      setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity 0.3s"; }, 2200);
      setTimeout(() => t.remove(), 2700);
    },

    reset() {
      if (confirm("Reset all local progress? This cannot be undone.")) {
        localStorage.removeItem(KEY);
        location.reload();
      }
    }
  };

  window.State = State;

  // Apply theme on load
  document.documentElement.setAttribute("data-theme", State.data.settings.theme);

  // Mark activity on every load
  State.touchStreak();
  save();
})();
