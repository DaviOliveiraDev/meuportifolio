import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,

  // Tracing/Performance monitoring sample rate (0.0 to 1.0)
  tracesSampleRate: 0.1,

  debug: false,
});
