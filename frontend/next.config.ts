import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 800, // Poll every 800ms
        aggregateTimeout: 300, // Delay rebuild by 300ms
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  org: "devfolio-saas",
  project: "frontend",
  silent: true,
});
