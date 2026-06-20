// ============================================================
// Firebase wiring — Auth + Firestore.
//
// Loaded as <script type="module"> on every page so it can use
// ES module imports from the official Firebase CDN. Exposes a
// classic-script-friendly surface at window.Firebase that
// js/auth.js and js/state.js call into.
//
// Auth flows:
//   - Google: signInWithPopup using GoogleAuthProvider
//   - Email/Password: real Firebase auth (createUserWithEmailAndPassword
//     for sign-up, signInWithEmailAndPassword for sign-in)
//
// Sync:
//   - On sign-in, hydrate State.data from /users/{uid}.state
//   - First-time signed-in users get their local state seeded
//     into Firestore (anonymous progress migrates over)
//   - State.save() emits "pylab:state-save" which we debounce-write
//   - onSnapshot pushes remote changes back into State via
//     "pylab:state-sync"
//   - Conflict resolution: higher xp wins on initial reconciliation
// ============================================================

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  updateProfile, signOut, setPersistence, browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, onSnapshot, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const cfg = window.PYLAB_CONFIG?.FIREBASE_CONFIG;
if (!cfg || !cfg.apiKey) {
  console.warn("[firebase] FIREBASE_CONFIG missing — sync disabled.");
} else {
  const app = initializeApp(cfg);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Local persistence so sign-in survives reload. (Default, but explicit.)
  setPersistence(auth, browserLocalPersistence).catch(() => {});

  // ---- helpers ----
  function profileFromUser(u) {
    if (!u) return null;
    const providerId = u.providerData?.[0]?.providerId || "";
    return {
      provider: providerId === "google.com" ? "google" : "email",
      email: u.email || "",
      name: u.displayName || (u.email ? u.email.split("@")[0] : "User"),
      picture: u.photoURL || null,
      uid: u.uid,
    };
  }

  function showToast(msg, kind = "ok") {
    if (window.State?.toast) State.toast(msg, kind === "ok" ? undefined : kind);
  }

  // ---- save / hydrate ----
  let saveTimer = null;
  async function saveState(state) {
    if (!auth.currentUser) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid),
          { state, updatedAt: serverTimestamp() },
          { merge: true });
      } catch (e) {
        console.warn("[firebase] save failed:", e?.message || e);
      }
    }, 800);
  }

  async function fetchRemoteState() {
    if (!auth.currentUser) return null;
    try {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      return snap.exists() ? (snap.data().state || null) : null;
    } catch (e) {
      console.warn("[firebase] hydrate failed:", e?.message || e);
      return null;
    }
  }

  let unsubSnapshot = null;
  function subscribeRemote() {
    if (!auth.currentUser || unsubSnapshot) return;
    const ref = doc(db, "users", auth.currentUser.uid);
    unsubSnapshot = onSnapshot(ref, snap => {
      if (!snap.exists()) return;
      const remote = snap.data().state;
      if (!remote) return;
      // Avoid an echo loop: only apply if remote differs from current local
      const local = JSON.parse(localStorage.getItem("pylab.state.v1") || "null");
      if (JSON.stringify(local) === JSON.stringify(remote)) return;
      localStorage.setItem("pylab.state.v1", JSON.stringify(remote));
      window.dispatchEvent(new CustomEvent("pylab:state-sync", { detail: remote }));
    });
  }
  function unsubscribeRemote() {
    if (unsubSnapshot) { unsubSnapshot(); unsubSnapshot = null; }
  }

  // ---- public API on window.Firebase ----
  window.Firebase = {
    enabled: true,

    async signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      return profileFromUser(cred.user);
    },

    async signUpEmail({ email, password, name }) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        try { await updateProfile(cred.user, { displayName: name }); } catch {}
      }
      return profileFromUser(cred.user);
    },

    async signInEmail({ email, password }) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return profileFromUser(cred.user);
    },

    async signOut() {
      unsubscribeRemote();
      await signOut(auth);
    },

    saveState,
    fetchRemoteState,
  };

  // ---- auth state observer ----
  // Mirrors the Firebase user into localStorage so the rest of the
  // app (avatar, greeting, dropdown) keeps working through Auth.current().
  onAuthStateChanged(auth, async user => {
    const profile = profileFromUser(user);
    if (profile) {
      localStorage.setItem("pylab.auth.v1", JSON.stringify({ ...profile, ts: Date.now() }));
      window.dispatchEvent(new CustomEvent("pylab:auth-change", { detail: profile }));

      // Hydrate / migrate / reconcile
      const remote = await fetchRemoteState();
      const localRaw = localStorage.getItem("pylab.state.v1");
      const local = localRaw ? JSON.parse(localRaw) : null;

      if (!remote && local) {
        // First-time signed-in user — seed Firestore with local progress
        await saveState(local);
        showToast("Progress uploaded to cloud", "ok");
      } else if (remote && (!local || remote.xp >= (local.xp || 0))) {
        // Remote has at least as much progress — use remote
        localStorage.setItem("pylab.state.v1", JSON.stringify(remote));
        window.dispatchEvent(new CustomEvent("pylab:state-sync", { detail: remote }));
        if (local && (local.xp || 0) > 0 && remote.xp > local.xp)
          showToast("Synced cloud progress", "ok");
      } else if (remote && local && (local.xp || 0) > remote.xp) {
        // Local has more — push it up
        await saveState(local);
        showToast("Local progress kept (more recent)", "ok");
      }

      subscribeRemote();
    } else {
      // Signed out
      unsubscribeRemote();
      localStorage.removeItem("pylab.auth.v1");
      window.dispatchEvent(new CustomEvent("pylab:auth-change", { detail: null }));
    }
  });

  // ---- listen for State.save() emissions ----
  window.addEventListener("pylab:state-save", e => {
    if (e?.detail) saveState(e.detail);
  });

  console.log("[firebase] ready");
}
