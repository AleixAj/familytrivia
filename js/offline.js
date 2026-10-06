// ============================================================
// Family Trivia - Service Worker Registration
// Saves the game in the browser so it still opens without
// connection. The worker itself lives in sw.js.
// ============================================================

// Skipped on localhost: while developing, a saved copy only gets in the way.
const IS_LOCAL_HOST = ['localhost', '127.0.0.1', '[::1]', ''].includes(location.hostname);

if ('serviceWorker' in navigator && window.isSecureContext && !IS_LOCAL_HOST) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
} else if ('serviceWorker' in navigator && IS_LOCAL_HOST) {
  // Drop any worker registered by an earlier visit so local changes show up.
  navigator.serviceWorker.getRegistrations()
    .then(regs => regs.forEach(reg => reg.unregister()))
    .catch(() => {});
}
