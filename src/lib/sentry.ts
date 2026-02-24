// Sentry stub for frontend error tracking.
// Currently a no-op. When you're ready to enable Sentry:
//   1. npm install @sentry/react
//   2. Set NEXT_PUBLIC_SENTRY_DSN in .env.local
//   3. Uncomment the dynamic import below

export function initSentry() {
  // No-op until Sentry is configured
  // if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  // import("@sentry/react").then((mod) => {
  //   mod.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!, tracesSampleRate: 0.1 });
  //   sentry = mod;
  // }).catch(() => {});
}

export function captureException(
  error: unknown,
  opts?: Record<string, unknown>,
) {
  // Log to console until Sentry is configured
  if (typeof console !== "undefined") {
    console.error("[sentry stub]", error, opts);
  }
}
