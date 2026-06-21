// Login page — Google + email entry. Calls Auth and routes back to
// the dashboard on success. If the user is already signed in, we
// show a "you're signed in" card with sign-out.

function renderLogin() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  const next = new URLSearchParams(location.search).get("next") || "dashboard.html";

  sidebar.innerHTML = `
    <div class="sb-header">Sign in</div>
    <div class="sb-item active">Account</div>
    <div class="sb-section"></div>
    <div class="sb-header">About</div>
    <div style="padding:6px 14px;font-size:11.5px;color:var(--fg-mute);line-height:1.6;">
      Sign-in is browser-side only — there's no backend.
      <br><br>
      <b style="color:var(--fg-dim);">Google</b> verifies with Google's official Sign-In; we read your name + avatar.
      <br><br>
      <b style="color:var(--fg-dim);">Email</b> is a local profile (no password, no verification) — it labels your progress on this device.
    </div>
  `;

  paint();

  function paint() {
    const me = Auth.current();
    if (me) {
      paintSignedIn(me);
    } else {
      paintSignIn();
    }
  }

  function paintSignedIn(me) {
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Account</div></div>
      <div class="page-narrow">
        <div class="h1">Signed in</div>
        <div class="card" style="margin-top:14px;display:flex;align-items:center;gap:14px;">
          ${Auth.avatarHTML(me, 56)}
          <div style="flex:1;">
            <div style="color:var(--fg-strong);font-weight:600;font-size:14px;">${escapeHTML(me.name)}</div>
            <div style="color:var(--fg-dim);font-size:12px;font-family:var(--font-mono);">${escapeHTML(me.email)}</div>
            <div style="margin-top:4px;display:flex;gap:6px;">
              <span class="tag">${me.provider === "google" ? "Google" : "Email"}</span>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:14px;">
          <a class="btn primary" href="${escapeAttr(next)}">Continue to dashboard →</a>
          <button class="btn danger" id="sign-out">Sign out</button>
        </div>
        <div style="margin-top:24px;color:var(--fg-mute);font-size:12px;line-height:1.6;">
          <b style="color:var(--fg-dim);">What signing out does:</b>
          <ul style="padding-left:20px;margin-top:4px;">
            <li>Clears your account profile from this browser.</li>
            <li>Keeps your learning progress (XP, completed lessons, notes).</li>
            <li>If you want to wipe progress too, use Settings → Data → Reset.</li>
          </ul>
        </div>
      </div>
    `;
    document.getElementById("sign-out").onclick = () => {
      if (!confirm("Sign out of this browser?")) return;
      Auth.signOut();
      paint();
    };
  }

  function paintSignIn() {
    main.innerHTML = `
      <div class="tabs"><div class="tab active">Sign in</div></div>
      <div class="page-narrow">
        <div class="h1">Sign in to pylab</div>
        <div class="subtle" style="margin-bottom:18px;">Personalize your experience and label your progress. Sign-in is optional — everything still works without it.</div>

        <div class="card" style="padding:20px;">
          <div style="font-weight:600;color:var(--fg-strong);margin-bottom:10px;font-size:13px;">Continue with Google</div>
          <div id="google-btn" style="min-height:44px;display:flex;align-items:center;"></div>
          <div style="font-size:11px;color:var(--fg-mute);margin-top:8px;">
            We don't see your password. Google returns your name and avatar.
          </div>
        </div>

        <div style="text-align:center;margin:18px 0;color:var(--fg-mute);font-size:11px;letter-spacing:1px;">
          OR
        </div>

        <div class="card" style="padding:20px;">
          <div style="font-weight:600;color:var(--fg-strong);margin-bottom:10px;font-size:13px;">Continue with email</div>
          <form id="email-form" autocomplete="off" novalidate data-mode="signin">
            <div class="signin-tabs" style="margin-bottom:12px;">
              <button type="button" class="signin-tab active" data-tab="signin">Sign in</button>
              <button type="button" class="signin-tab" data-tab="signup">Sign up</button>
            </div>
            <label style="display:block;margin-bottom:10px;">
              <div class="subtle" style="margin-bottom:4px;">Email</div>
              <input type="email" id="email" required placeholder="you@example.com" style="width:100%;" autocomplete="email" />
            </label>
            <label style="display:block;margin-bottom:10px;" id="name-wrap" hidden>
              <div class="subtle" style="margin-bottom:4px;">Display name <span style="color:var(--fg-mute);">(optional)</span></div>
              <input type="text" id="name" placeholder="What should we call you?" style="width:100%;" maxlength="40" autocomplete="nickname" />
            </label>
            <label style="display:block;margin-bottom:10px;">
              <div class="subtle" style="margin-bottom:4px;">Password</div>
              <input type="password" id="password" required placeholder="At least 6 characters" style="width:100%;" minlength="6" autocomplete="current-password" />
            </label>
            <button class="btn primary" type="submit" id="email-submit" style="width:100%;justify-content:center;">Sign in</button>
            <div id="email-err" style="margin-top:8px;"></div>
          </form>
          <div style="font-size:11px;color:var(--fg-mute);margin-top:8px;" id="email-hint"></div>
        </div>

        <div style="text-align:center;margin-top:18px;">
          <a href="${escapeAttr(next)}" class="subtle">Skip — keep using anonymously</a>
        </div>
      </div>
    `;

    // Google button
    Auth.renderGoogleButton(document.getElementById("google-btn")).then(profile => {
      if (profile) location.href = next;
    });

    // Sign in / Sign up tab toggle
    const form = document.getElementById("email-form");
    const submitBtn = document.getElementById("email-submit");
    const nameWrap = document.getElementById("name-wrap");
    const pwInput = document.getElementById("password");
    const hint = document.getElementById("email-hint");
    const useFirebase = !!window.Firebase?.enabled;
    hint.innerHTML = useFirebase
      ? "Real account — password is verified by Firebase. Progress will sync across all your devices."
      : "Local profile only — no password is checked. Set up Firebase to enable real auth and cross-device sync.";
    form.querySelectorAll(".signin-tab").forEach(tab => tab.onclick = () => {
      form.querySelectorAll(".signin-tab").forEach(t => t.classList.toggle("active", t === tab));
      const mode = tab.dataset.tab;
      form.dataset.mode = mode;
      nameWrap.hidden = mode !== "signup";
      submitBtn.textContent = mode === "signup" ? "Create account" : "Sign in";
      pwInput.autocomplete = mode === "signup" ? "new-password" : "current-password";
    });

    // Email form
    form.onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const name  = document.getElementById("name").value.trim();
      const password = pwInput.value;
      const err   = document.getElementById("email-err");
      err.innerHTML = "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.innerHTML = `<div class="feedback bad">Enter a valid email address.</div>`;
        return;
      }
      submitBtn.disabled = true;
      try {
        const mode = form.dataset.mode || "signin";
        if (mode === "signup") await Auth.signUpEmail({ email, password, name });
        else                   await Auth.signInEmail({ email, password });
        location.href = next;
      } catch (ex) {
        submitBtn.disabled = false;
        err.innerHTML = `<div class="feedback bad">${escapeHTML(ex.message)}</div>`;
      }
    };

    // Focus email input on first paint
    setTimeout(() => document.getElementById("email")?.focus(), 80);
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, "&quot;");
  }
}
