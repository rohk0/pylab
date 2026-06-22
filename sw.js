// ============================================================
// pylab service worker — offline-capable, cache-first for the
// app shell, network-first for HTML pages (so deploys are picked
// up promptly).
//
// Strategy:
//   - Pre-cache the core shell (CSS, vendor-free JS, manifest, icons)
//     on install so the first offline visit works
//   - On fetch:
//       HTML pages   → network, fall back to cache, fall back to /
//       same-origin  → cache-first, update cache on success
//       cross-origin → network only (don't cache Groq / Firebase /
//                      Pyodide CDN — those have their own caching)
//   - Bump CACHE_VERSION whenever any cached file changes so old
//     caches get evicted on activate
// ============================================================

const CACHE_VERSION = "pylab-v6";

const PRECACHE = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./manifest.json",
  "./css/main.css",
  "./css/ai.css",
  "./css/polish.css",
  "./css/landing.css",
  "./js/state.js",
  "./js/languages.js",
  "./js/codeblock.js",
  "./js/config.js",
  "./js/auth.js",
  "./js/shell.js",
  "./js/editor.js",
  "./js/runtime.js",
  "./js/grader.js",
  "./js/ai/core.js",
  "./js/ai/prompts.js",
  "./js/ai/tracker.js",
  "./js/ai/panel.js",
  "./js/data/lessons.js",
  "./js/data/challenges.js",
  "./js/data/quizzes.js",
  "./js/data/reference.js",
  "./js/data/projects.js",
  "./js/data/flashcards.js",
  "./js/data/curricula.js",
  "./js/data/lesson-bodies.js",
  "./icons/logo.png",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // Use addAll's tolerance for missing files by adding individually.
      Promise.all(PRECACHE.map((url) =>
        cache.add(url).catch((err) => console.warn("[sw] skip", url, err.message))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Don't intercept cross-origin requests — let them hit the network
  // normally. The big ones (Pyodide, Groq, Firebase, Google Sign-In)
  // manage their own caching.
  if (url.origin !== self.location.origin) return;

  // HTML pages: network-first so deploys propagate without a stale-shell
  // delay. Fall back to cache when offline, then to the index page.
  if (req.mode === "navigate" || (req.destination === "document")) {
    event.respondWith(
      fetch(req, { cache: "no-cache" })
        .then((resp) => {
          // Update the cache opportunistically.
          if (resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, clone)).catch(() => {});
          }
          return resp;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match("./index.html"))
        )
    );
    return;
  }

  const freshAsset =
    ["script", "style", "worker", "manifest"].includes(req.destination) ||
    /\.(?:js|css|json)$/i.test(url.pathname);

  // Code and stylesheet assets: network-first. GitHub Pages deploys can
  // otherwise leave HTML from the network paired with old cached JS, which
  // renders only the app shell/top bar and never fills the page content.
  if (freshAsset) {
    event.respondWith(
      fetch(req, { cache: "no-cache" })
        .then((resp) => {
          if (resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, clone)).catch(() => {});
          }
          return resp;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Other static assets: cache-first.
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((resp) => {
        // Only cache OK responses; skip opaque / errored ones.
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, clone)).catch(() => {});
        }
        return resp;
      });
    })
  );
});

// Optional: receive an "update" message and force-skipWaiting so a new
// SW activates immediately. Useful when we add an in-page "update available"
// nudge in the future.
self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});
