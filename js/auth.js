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
    localStorage.removeItem(KEY);
    // Also clear Google's stored prompt state so the next sign-in is interactive.
    try { window.google?.accounts?.id?.disableAutoSelect(); } catch {}
    window.dispatchEvent(new CustomEvent("pylab:auth-change", { detail: null }));
  }

  // ----- Email profile (no real auth) -----
  function signInWithEmail({ email, name }) {
    if (!email) throw new Error("Email required.");
    setProfile({
      provider: "email",
      email: String(email).trim().toLowerCase(),
      name: (name || email.split("@")[0]).trim(),
      picture: null,
    });
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
  // Resolves with the saved profile on successful sign-in.
  async function renderGoogleButton(container, opts = {}) {
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

  // ----- Apple Sign-In -----
  // Loads Apple's JS SDK on demand and renders a styled button that
  // initiates the OAuth popup. Apple returns a JWT; we decode its
  // payload (sub + email) and save a profile. Like Google, signature
  // verification needs a backend — this is identity-for-display only.
  let _appleLoaded = null;
  function loadApple() {
    if (_appleLoaded) return _appleLoaded;
    _appleLoaded = new Promise((resolve, reject) => {
      if (window.AppleID?.auth) return resolve();
      const s = document.createElement("script");
      s.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
      s.async = true; s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Couldn't reach Apple Sign-In."));
      document.head.appendChild(s);
    });
    return _appleLoaded;
  }

  function appleClientId() { return (window.PYLAB_CONFIG && PYLAB_CONFIG.APPLE_CLIENT_ID) || ""; }
  function appleRedirectURI() { return (window.PYLAB_CONFIG && PYLAB_CONFIG.APPLE_REDIRECT_URI) || location.origin + location.pathname; }

  // Render an Apple Sign-In button into a container.
  // Resolves to the profile on success, null otherwise.
  async function renderAppleButton(container) {
    if (!appleClientId()) {
      container.innerHTML = `
        <div class="feedback info" style="margin:0;">
          <b>Apple Sign-In is not configured.</b> The site owner needs an Apple Developer account, a Services ID, and verified domain ownership. See <code>js/config.js</code>.
        </div>
      `;
      return null;
    }
    // Render the styled button up-front so it's clickable even before
    // Apple's script finishes loading.
    container.innerHTML = `
      <button type="button" class="apple-btn" id="apple-btn-click">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M16.365 1.43c0 1.14-.42 2.27-1.18 3.05-.75.78-1.95 1.36-3.05 1.27-.13-1.1.41-2.21 1.13-2.96.81-.85 2.13-1.45 3.1-1.36zM20.6 17.42c-.5 1.15-.74 1.66-1.39 2.68-.9 1.43-2.18 3.21-3.76 3.22-1.4.01-1.77-.92-3.67-.91-1.9.01-2.31.93-3.71.92-1.58-.02-2.79-1.61-3.7-3.04C1.27 16.6.66 11.84 2.85 9.07c1.45-1.84 3.73-2.91 5.88-2.91 2.17 0 3.55 1.18 5.34 1.18 1.74 0 2.8-1.18 5.31-1.18 1.9 0 3.92 1.03 5.36 2.82-4.71 2.58-3.94 9.32-3.94 9.32-.06.16-.13.24-.2.42z"/>
        </svg>
        <span>Continue with Apple</span>
      </button>
    `;
    const btn = container.querySelector("#apple-btn-click");
    btn.onclick = async () => {
      btn.disabled = true;
      try {
        await loadApple();
        window.AppleID.auth.init({
          clientId: appleClientId(),
          scope: "name email",
          redirectURI: appleRedirectURI(),
          state: "pylab-" + Date.now(),
          usePopup: true,
        });
        const resp = await window.AppleID.auth.signIn();
        const claims = decodeJWT(resp.authorization?.id_token);
        if (!claims) throw new Error("Apple returned no user info.");
        const fullName = resp.user?.name
          ? [resp.user.name.firstName, resp.user.name.lastName].filter(Boolean).join(" ")
          : null;
        setProfile({
          provider: "apple",
          email: claims.email || (resp.user?.email ?? "apple-user"),
          name: fullName || (claims.email?.split("@")[0]) || "Apple user",
          picture: null,
        });
        location.reload();
      } catch (e) {
        // User cancelled or Apple errored — don't shout, just re-enable.
        btn.disabled = false;
        if (e?.error && e.error !== "popup_closed_by_user") {
          container.innerHTML += `<div class="feedback bad" style="margin-top:8px;">Apple sign-in failed: ${e.error}</div>`;
        }
      }
    };
    return null;
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
    signInWithEmail,
    renderGoogleButton, googleClientId,
    renderAppleButton, appleClientId,
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
        <div class="signin-section" style="margin-top:8px;">
          <div id="signin-apple"></div>
        </div>

        <div class="signin-divider"><span>or</span></div>

        <form id="signin-email-form" class="signin-section" novalidate>
          <label class="signin-field">
            <span>Email</span>
            <input type="email" id="signin-email" required placeholder="you@example.com" autocomplete="email" />
          </label>
          <label class="signin-field">
            <span>Display name <em>(optional)</em></span>
            <input type="text" id="signin-name" placeholder="What should we call you?" maxlength="40" autocomplete="nickname" />
          </label>
          <button class="btn primary signin-submit" type="submit">Continue with email</button>
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

    // Google
    Auth.renderGoogleButton(document.getElementById("signin-google"), { width: 300 })
      .then(profile => { if (profile) { close(); location.reload(); } });

    // Apple — render the styled button (it hides itself if not configured).
    if (Auth.appleClientId()) {
      Auth.renderAppleButton(document.getElementById("signin-apple"));
    } else {
      document.getElementById("signin-apple").remove();
    }

    // Email
    document.getElementById("signin-email-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("signin-email").value.trim();
      const name  = document.getElementById("signin-name").value.trim();
      const err   = document.getElementById("signin-err");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.innerHTML = `<div class="feedback bad" style="margin-top:8px;">Enter a valid email address.</div>`;
        return;
      }
      try {
        Auth.signInWithEmail({ email, name });
        close();
        location.reload();
      } catch (ex) {
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
