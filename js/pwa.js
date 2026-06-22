// ============================================================
// PWA registration — registers the service worker and listens
// for an "Add to Home Screen" / "Install" prompt. We don't show
// a custom install prompt yet, but capturing the event keeps the
// option open later.
//
// Only registers in production-ish environments (the page is
// served over https or from localhost). Avoids the dev-server
// confusion you sometimes hit with file:// or non-secure origins.
// ============================================================

(function () {
  if (!("serviceWorker" in navigator)) return;
  const okOrigin =
    location.protocol === "https:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";
  if (!okOrigin) return;

  // GitHub Pages serves the site under /pylab/, so use a relative path
  // for the SW scope.
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js?v=6").then(
      (reg) => {
        reg.update?.();
        // When a new SW takes over, surface a quiet toast nudging a reload.
        reg.addEventListener("updatefound", () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.addEventListener("statechange", () => {
            if (sw.state === "installed" && navigator.serviceWorker.controller) {
              if (window.State && State.toast)
                State.toast("New version available — reload for the latest.", "info");
            }
          });
        });
      },
      (err) => console.warn("[pwa] SW registration failed:", err.message)
    );
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });

  // Capture the install prompt so we can offer it later via a UI button.
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.__pylabInstall = () => deferredPrompt && deferredPrompt.prompt();
  });

  window.addEventListener("appinstalled", () => {
    if (window.State && State.toast) State.toast("Installed — pylab on your home screen.");
  });
})();
