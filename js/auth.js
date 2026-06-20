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
    avatarHTML,
  };
})();

window.Auth = Auth;
