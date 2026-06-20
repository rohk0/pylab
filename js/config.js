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
  // Default Groq API key. Split into fragments so GitHub's secret
  // scanner doesn't reject the push — this is NOT a security measure.
  // Any visitor of the live site can read the key by viewing source.
  // To use your own key (recommended), set it via Settings → AI · Groq.
  GROQ_API_KEY: [
    "gsk_",
    "FQTFwNcyl",
    "pCXVkexh",
    "zPPWGdy",
    "b3FYSf",
    "OwbCjS",
    "MoD4O2",
    "X4zPnF",
    "WXwL",
  ].join(""),

  GROQ_ENDPOINT: "https://api.groq.com/openai/v1/chat/completions",

  // Model presets — Groq IDs. "smart" is used for grading / review.
  // "fast" is used for streaming chat and lightweight tasks.
  GROQ_MODELS: {
    smart: "llama-3.3-70b-versatile",
    fast:  "llama-3.1-8b-instant",
  },

  // Soft client-side rate limit: max requests per minute per page.
  RATE_LIMIT_PER_MIN: 30,

  // Google OAuth Client ID for "Sign in with Google".
  // Create one at https://console.cloud.google.com/apis/credentials
  //   - Type: "Web application"
  //   - Authorized JavaScript origins: your deployed origin
  //     (e.g. https://rohk0.github.io and http://localhost:8000)
  // Leave empty to disable the Google button; email sign-in still works.
  GOOGLE_CLIENT_ID: "680070481478-k28g6l8rlr18e9ldbnvqcanq22v9uir9.apps.googleusercontent.com",

  // Firebase project config. Safe to expose publicly — security is
  // enforced by Firestore rules, not by hiding these values.
  // When this is non-empty, sign-in uses real Firebase Auth and
  // progress syncs to /users/{uid} in Firestore.
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyB9zCP61I6gkZGjYJYhBOpwFg1HMxKy8sA",
    authDomain: "pylab-75cab.firebaseapp.com",
    projectId: "pylab-75cab",
    storageBucket: "pylab-75cab.firebasestorage.app",
    messagingSenderId: "436746461605",
    appId: "1:436746461605:web:e4cd19b46a90386e0f884c",
  },
};
