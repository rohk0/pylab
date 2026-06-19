// ============================================================
// pylab configuration.
//
// SECURITY NOTE: this file is shipped to the browser. Any key
// here is public to anyone who views the page source. For a
// personal deployment that's fine; otherwise instruct users to
// provide their own key via Settings (stored only in their
// localStorage, never sent to the bundled key).
// ============================================================

window.PYLAB_CONFIG = {
  // Default Groq API key. Users provide their own via Settings → AI · Groq.
  // GitHub rejects pushed secrets, so this stays empty in the repo.
  // To enable AI for everyone on your live site, paste your key here BEFORE
  // making the repo public — or accept that AI features only work for users
  // who configure their own key in Settings.
  GROQ_API_KEY: "",

  GROQ_ENDPOINT: "https://api.groq.com/openai/v1/chat/completions",

  // Model presets — Groq IDs. "smart" is used for grading / review.
  // "fast" is used for streaming chat and lightweight tasks.
  GROQ_MODELS: {
    smart: "llama-3.3-70b-versatile",
    fast:  "llama-3.1-8b-instant",
  },

  // Soft client-side rate limit: max requests per minute per page.
  RATE_LIMIT_PER_MIN: 30,
};
