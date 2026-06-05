import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Tracing/Performance monitoring sample rate (0.0 to 1.0)
  tracesSampleRate: 0.1,

  // Session Replay sample rate
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  debug: false,
});
