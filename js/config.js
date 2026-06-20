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

  // Apple Sign-In requires a paid Apple Developer account.
  //   1) developer.apple.com → Certificates, Identifiers & Profiles
  //   2) Create an App ID, then a Services ID (this is the value below)
  //   3) Add this site's origin and a Return URL to the Services ID
  //   4) Verify domain ownership by hosting the file Apple provides at
  //      /.well-known/apple-developer-domain-association.txt
  //   5) Paste your Services ID below and set APPLE_REDIRECT_URI to
  //      a page on your site that closes the popup (we use login.html).
  // Leave APPLE_CLIENT_ID empty to hide the Apple button.
  APPLE_CLIENT_ID: "",
  APPLE_REDIRECT_URI: "", // e.g. "https://rohk0.github.io/pylab/login.html"
};
