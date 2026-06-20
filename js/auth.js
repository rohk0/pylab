// ============================================================
// Auth — local profile + Google Sign-In (browser-only).
//
// PyLab is a static site, so this is identity-as-personalization,
// not security. Two flows:
//
//   1) Google Sign-In via Google Identity Services
//      Returns a verified JWT signed by Google. We decode the
//      payload client-side to read email/name/picture. The JWT is
//      stored as the credential proof; we don't verify the signature
//      because there's no backend. The browser already did the OAuth
//      handshake with Google, so it's trustworthy for *display*.
//
//   2) Email + name
//      No verification. The user types an email and display name
//      and that becomes their profile. Behaves like a label.
//
// Profile shape stored under `pylab.auth.v1`:
//   { provider: "google"|"email", email, name, picture?, ts }
//
// Other modules read via Auth.current(); reactive consumers listen
// to "pylab:auth-change" custom events on window.
// ============================================================

const Auth = (() => {
  const KEY = "pylab.auth.v1";

  function current() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
  }
  function isAuthed() { return !!current(); }

  function setProfile(p) {
    localStorage.setItem(KEY, JSON.stringify({ ...p, ts: Date.now() }));
    window.dispatchEvent(new CustomEvent("pylab:auth-change", { detail: p }));
  }

  function signOut() {
    // Firebase will clear its own auth state and emit pylab:auth-change.
    if (window.Firebase?.enabled) {
      window.Firebase.signOut().catch(() => {});
    } else {
      localStorage.removeItem(KEY);
      window.dispatchEvent(new CustomEvent("pylab:auth-change", { detail: null }));
    }
    try { window.google?.accounts?.id?.disableAutoSelect(); } catch {}
  }

  // ----- Email/password — real Firebase auth when available -----
  async function signUpEmail({ email, password, name }) {
    if (!email) throw new Error("Email required.");
    if (window.Firebase?.enabled) {
      if (!password || password.length < 6) throw new Error("Password must be at least 6 characters.");
      try {
        const profile = await window.Firebase.signUpEmail({ email, password, name });
        return profile;
      } catch (e) { throw friendlyFirebaseError(e); }
    }
    // Fallback: no Firebase → keep the old local profile path.
    setProfile({
      provider: "email",
      email: String(email).trim().toLowerCase(),
      name: (name || email.split("@")[0]).trim(),
      picture: null,
    });
  }
  async function signInEmail({ email, password }) {
    if (!email) throw new Error("Email required.");
    if (window.Firebase?.enabled) {
      if (!password) throw new Error("Password required.");
      try {
        const profile = await window.Firebase.signInEmail({ email, password });
        return profile;
      } catch (e) { throw friendlyFirebaseError(e); }
    }
    // Fallback: local profile (no password verification).
    setProfile({
      provider: "email",
      email: String(email).trim().toLowerCase(),
      name: email.split("@")[0],
      picture: null,
    });
  }
  // Legacy entry point kept for any old callers.
  function signInWithEmail({ email, name }) {
    return signUpEmail({ email, password: null, name });
  }

  function friendlyFirebaseError(e) {
    const code = e?.code || "";
    const map = {
      "auth/email-already-in-use":  "An account already exists for that email. Try signing in.",
      "auth/invalid-email":         "That email address doesn't look right.",
      "auth/weak-password":         "Password must be at least 6 characters.",
      "auth/user-not-found":        "No account with that email. Sign up instead?",
      "auth/wrong-password":        "Wrong password.",
      "auth/invalid-credential":    "Wrong email or password.",
      "auth/too-many-requests":     "Too many attempts. Wait a minute and retry.",
      "auth/popup-closed-by-user":  "Sign-in popup was closed.",
      "auth/network-request-failed":"Network issue — check your connection.",
    };
    const msg = map[code] || (e?.message || "Sign-in failed.");
    return new Error(msg);
  }

  // ----- Google Sign-In (GIS) -----
  // Loads the GIS script lazily, renders a button or prompts, and
  // resolves once the user signs in (or rejects on cancel).
  let _gisLoaded = null;
  function loadGIS() {
    if (_gisLoaded) return _gisLoaded;
    _gisLoaded = new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) return resolve();
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true; s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Couldn't reach Google Sign-In."));
      document.head.appendChild(s);
    });
    return _gisLoaded;
  }

  function googleClientId() {
    return (window.PYLAB_CONFIG && PYLAB_CONFIG.GOOGLE_CLIENT_ID) || "";
  }

  function decodeJWT(jwt) {
    try {
      const payload = jwt.split(".")[1];
      const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(atob(b64).split("").map(c =>
        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(""));
      return JSON.parse(json);
    } catch { return null; }
  }

  // Render the official Google Sign-In button into a container.
  // When Firebase is enabled, the button goes through Firebase's
  // signInWithPopup so the single click also unlocks Firestore.
  async function renderGoogleButton(container, opts = {}) {
    if (window.Firebase?.enabled) {
      container.innerHTML = `
        <button type="button" class="btn primary signin-google-fb" style="width:100%;justify-content:center;padding:9px;font-size:13px;">
          <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right:8px;vertical-align:middle;">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      `;
      container.querySelector(".signin-google-fb").onclick = async () => {
        try {
          await window.Firebase.signInWithGoogle();
          // onAuthStateChanged emits pylab:auth-change and the host
          // (modal / login page) reacts.
        } catch (e) {
          const err = friendlyFirebaseError(e);
          container.insertAdjacentHTML("beforeend",
            `<div class="feedback bad" style="margin-top:8px;">${err.message}</div>`);
        }
      };
      return null;
    }
    const clientId = googleClientId();
    if (!clientId) {
      container.innerHTML = `
        <div class="feedback info" style="margin:0;">
          <b>Google Sign-In is not configured.</b> The site owner needs to add a Google OAuth Client ID in <code>js/config.js</code>.
          <div style="margin-top:6px;font-size:11.5px;color:var(--fg-dim);">
            <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener">Create one here</a>
            (type "Web application", add this site's URL to Authorized JavaScript origins).
          </div>
        </div>
      `;
      return null;
    }
    try {
      await loadGIS();
    } catch (e) {
      container.innerHTML = `<div class="feedback bad">${e.message}</div>`;
      return null;
    }
    return new Promise((resolve) => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (resp) => {
          const claims = decodeJWT(resp.credential);
          if (!claims) { resolve(null); return; }
          setProfile({
            provider: "google",
            email: claims.email,
            name: claims.name || claims.given_name || claims.email,
            picture: claims.picture || null,
          });
          resolve(current());
        },
        auto_select: false,
        ux_mode: "popup",
        context: "signin",
      });
      window.google.accounts.id.renderButton(container, {
        theme: opts.theme || "filled_black",
        size: opts.size || "large",
        text: opts.text || "signin_with",
        shape: opts.shape || "rectangular",
        logo_alignment: "left",
        width: opts.width || 280,
      });
    });
  }

  // Tiny avatar helper for the titlebar / menus.
  function avatarHTML(profile, size = 24) {
    const initial = (profile?.name || profile?.email || "?").charAt(0).toUpperCase();
    if (profile?.picture) {
      return `<img src="${profile.picture}" alt="" width="${size}" height="${size}"
        style="border-radius:50%;display:block;object-fit:cover;" referrerpolicy="no-referrer" />`;
    }
    // Initial fallback with a stable color per email.
    const hue = profile?.email
      ? Array.from(profile.email).reduce((a, c) => a + c.charCodeAt(0), 0) % 360
      : 200;
    return `<div style="width:${size}px;height:${size}px;border-radius:50%;
      background:hsl(${hue},40%,28%);color:hsl(${hue},75%,82%);
      display:flex;align-items:center;justify-content:center;
      font-family:var(--font-mono);font-weight:700;font-size:${Math.round(size * 0.45)}px;">${initial}</div>`;
  }

  return {
    current, isAuthed, signOut, setProfile,
    signInWithEmail, signUpEmail, signInEmail,
    renderGoogleButton, googleClientId,
    avatarHTML,
  };
})();

window.Auth = Auth;

// ============================================================
// SignInModal — auto-pop sign-in dialog on first page visit.
// X button + Esc + backdrop click dismiss for the session.
// ============================================================

const SignInModal = (() => {
  const DISMISS_KEY = "pylab.signin.dismissed";

  function dismissed() { return sessionStorage.getItem(DISMISS_KEY) === "1"; }
  function dismiss()   { sessionStorage.setItem(DISMISS_KEY, "1"); }

  function close() {
    const root = document.getElementById("signin-modal");
    if (!root) return;
    root.classList.add("closing");
    setTimeout(() => root.remove(), 180);
  }

  function open() {
    if (document.getElementById("signin-modal")) return;
    const root = document.createElement("div");
    root.id = "signin-modal";
    root.className = "signin-modal";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "signin-title");
    root.innerHTML = `
      <div class="signin-backdrop" data-close></div>
      <div class="signin-dialog" role="document">
        <button class="signin-close" type="button" aria-label="Close sign-in" data-close>×</button>
        <div class="signin-brand">
          <div class="signin-logo"></div>
          <span><b>pylab</b></span>
        </div>
        <h2 id="signin-title" class="signin-title">Sign in to pylab</h2>
        <p class="signin-sub">Personalize your experience — name, avatar, and a greeting. Skip if you'd rather stay anonymous.</p>

        <div class="signin-section">
          <div id="signin-google" style="min-height:44px;display:flex;align-items:center;justify-content:center;"></div>
        </div>

        <div class="signin-divider"><span>or</span></div>

        <form id="signin-email-form" class="signin-section" novalidate data-mode="signin">
          <div class="signin-tabs">
            <button type="button" class="signin-tab active" data-tab="signin">Sign in</button>
            <button type="button" class="signin-tab" data-tab="signup">Sign up</button>
          </div>
          <label class="signin-field">
            <span>Email</span>
            <input type="email" id="signin-email" required placeholder="you@example.com" autocomplete="email" />
          </label>
          <label class="signin-field" id="signin-name-wrap" style="display:none;">
            <span>Display name <em>(optional)</em></span>
            <input type="text" id="signin-name" placeholder="What should we call you?" maxlength="40" autocomplete="nickname" />
          </label>
          <label class="signin-field">
            <span>Password</span>
            <input type="password" id="signin-password" required placeholder="At least 6 characters" autocomplete="current-password" minlength="6" />
          </label>
          <button class="btn primary signin-submit" type="submit" id="signin-submit-btn">Sign in</button>
          <div id="signin-err"></div>
        </form>

        <div class="signin-foot">
          <a href="#" data-close>Skip for now</a>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    // Close interactions
    root.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", (e) => {
      e.preventDefault();
      dismiss();
      close();
    }));
    function onKey(e) {
      if (e.key === "Escape") { dismiss(); close(); document.removeEventListener("keydown", onKey); }
    }
    document.addEventListener("keydown", onKey);

    // Google. With Firebase enabled, onAuthStateChanged will fire and the
    // shell's guarded handler will reload (after the 2s page-load window
    // has elapsed). For the GIS fallback, the .then() resolves to a
    // profile which we close + reload on manually.
    Auth.renderGoogleButton(document.getElementById("signin-google"), { width: 300 })
      .then(profile => { if (profile) { close(); setTimeout(() => location.reload(), 50); } });

    // Sign in / Sign up tab toggle
    const form = document.getElementById("signin-email-form");
    const submit = document.getElementById("signin-submit-btn");
    const nameWrap = document.getElementById("signin-name-wrap");
    const pw = document.getElementById("signin-password");
    form.querySelectorAll(".signin-tab").forEach(tab => tab.onclick = () => {
      form.querySelectorAll(".signin-tab").forEach(t => t.classList.toggle("active", t === tab));
      const mode = tab.dataset.tab;
      form.dataset.mode = mode;
      nameWrap.style.display = mode === "signup" ? "block" : "none";
      submit.textContent = mode === "signup" ? "Create account" : "Sign in";
      pw.autocomplete = mode === "signup" ? "new-password" : "current-password";
    });

    // Submit
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signin-email").value.trim();
      const password = document.getElementById("signin-password").value;
      const name = document.getElementById("signin-name").value.trim();
      const err = document.getElementById("signin-err");
      err.innerHTML = "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.innerHTML = `<div class="feedback bad" style="margin-top:8px;">Enter a valid email address.</div>`;
        return;
      }
      submit.disabled = true;
      try {
        const mode = form.dataset.mode || "signin";
        if (mode === "signup") await Auth.signUpEmail({ email, password, name });
        else                   await Auth.signInEmail({ email, password });
        close();
        // Defer reload past the 2s page-load guard so it can't loop.
        setTimeout(() => location.reload(), 50);
      } catch (ex) {
        submit.disabled = false;
        err.innerHTML = `<div class="feedback bad" style="margin-top:8px;">${ex.message}</div>`;
      }
    });

    setTimeout(() => document.getElementById("signin-email")?.focus(), 100);
  }

  function maybeAutoOpen() {
    if (Auth.isAuthed()) return;
    if (dismissed()) return;
    // Skip on the dedicated login page (modal would duplicate it).
    if (/login\.html$/.test(location.pathname)) return;
    setTimeout(open, 320);
  }

  return { open, close, maybeAutoOpen };
})();

window.SignInModal = SignInModal;
